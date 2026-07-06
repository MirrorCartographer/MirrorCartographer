#!/usr/bin/env python3
"""Validate MC privacy-preserving longitudinal dataset fixtures.

This validator is research-organization infrastructure only. It does not provide
medical advice, veterinary advice, diagnosis, treatment, dosage guidance, or
clinical triage. It checks whether longitudinal records can retain continuity
signals while rejecting unsafe or privacy-violating records.
"""
from __future__ import annotations

import json
import re
import sys
from pathlib import Path
from typing import Any

REQUIRED_TOP_LEVEL = {
    "artifact_id",
    "hypothesis",
    "source_status",
    "claim_status",
    "privacy_status",
    "missingness",
    "revision_reason",
    "implementation_status",
    "testability",
    "falsification_route",
    "measurable_variables",
    "next_executable_action",
    "records",
}

MISSINGNESS_STATES = {"observed", "unknown", "not_collected", "redacted", "not_applicable"}
VALID_DECISIONS = {"retain", "redact", "reject", "needs_review"}
COLLAPSED_ABSENCE_VALUES = {"absent", "none", "no", "not present", False, 0}
PRIVATE_PATTERNS = [
    re.compile(r"\b\d{3}[-.]\d{3}[-.]\d{4}\b"),
    re.compile(r"\b\d{3}-\d{2}-\d{4}\b"),
    re.compile(r"[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}"),
]
UNSAFE_DIRECTIVE_TERMS = {
    "diagnose",
    "diagnosis",
    "treat",
    "treatment",
    "dose",
    "dosage",
    "give extra",
    "increase dose",
    "decrease dose",
    "cure now",
    "emergency instruction",
    "veterinary instruction",
}


def load_json(path: str | Path) -> dict[str, Any]:
    with open(path, "r", encoding="utf-8") as handle:
        return json.load(handle)


def text_blob(value: Any) -> str:
    if isinstance(value, str):
        return value
    return json.dumps(value, sort_keys=True)


def has_private_pattern(record: dict[str, Any]) -> bool:
    blob = text_blob(record)
    return any(pattern.search(blob) for pattern in PRIVATE_PATTERNS)


def has_unsafe_directive(record: dict[str, Any]) -> bool:
    blob = text_blob(record).lower()
    return any(term in blob for term in UNSAFE_DIRECTIVE_TERMS)


def validate_record(record: dict[str, Any]) -> list[str]:
    errors: list[str] = []
    record_id = record.get("record_id", "<no-record-id>")

    if record.get("value_state") not in MISSINGNESS_STATES:
        errors.append(f"{record_id}: invalid value_state {record.get('value_state')!r}")

    if record.get("decision") not in VALID_DECISIONS:
        errors.append(f"{record_id}: invalid decision {record.get('decision')!r}")

    value_state = record.get("value_state")
    value = record.get("value")
    if value_state != "observed" and value in COLLAPSED_ABSENCE_VALUES:
        errors.append(f"{record_id}: missingness collapsed into absence")

    private_detected = bool(record.get("private_identifier_present")) or has_private_pattern(record)
    if private_detected and record.get("decision") == "retain":
        errors.append(f"{record_id}: retained private identifier")

    if has_unsafe_directive(record) and record.get("decision") == "retain":
        errors.append(f"{record_id}: retained diagnosis/treatment/dosage/veterinary directive")

    if record.get("decision") == "retain" and value_state != "observed":
        errors.append(f"{record_id}: retained non-observed value without review/redaction")

    return errors


def score_fixture(packet: dict[str, Any]) -> dict[str, float]:
    records = packet.get("records", [])
    if not records:
        return {
            "private_identifier_rejection_rate": 0.0,
            "missingness_state_validity_rate": 0.0,
            "unsafe_directive_rejection_rate": 0.0,
            "continuity_signal_retention_rate": 0.0,
        }

    private_cases = [record for record in records if record.get("private_identifier_present") or has_private_pattern(record)]
    unsafe_cases = [record for record in records if has_unsafe_directive(record)]
    valid_missingness = [record for record in records if record.get("value_state") in MISSINGNESS_STATES]
    retainable_signals = [
        record for record in records
        if not record.get("private_identifier_present")
        and not has_private_pattern(record)
        and not has_unsafe_directive(record)
        and record.get("value_state") == "observed"
    ]

    def ratio(numerator: int, denominator: int) -> float:
        return 1.0 if denominator == 0 else round(numerator / denominator, 4)

    return {
        "private_identifier_rejection_rate": ratio(
            sum(1 for record in private_cases if record.get("decision") in {"redact", "reject", "needs_review"}),
            len(private_cases),
        ),
        "missingness_state_validity_rate": ratio(len(valid_missingness), len(records)),
        "unsafe_directive_rejection_rate": ratio(
            sum(1 for record in unsafe_cases if record.get("decision") in {"reject", "needs_review"}),
            len(unsafe_cases),
        ),
        "continuity_signal_retention_rate": ratio(
            sum(1 for record in retainable_signals if record.get("decision") == "retain"),
            len(retainable_signals),
        ),
    }


def validate_fixture(path: str | Path) -> tuple[int, list[str], dict[str, float]]:
    packet = load_json(path)
    errors: list[str] = []

    missing = REQUIRED_TOP_LEVEL.difference(packet)
    for field in sorted(missing):
        errors.append(f"packet: missing required label {field}")

    if packet.get("privacy_status") != "public_safe_synthetic":
        errors.append("packet: automation fixture must remain public_safe_synthetic")

    if packet.get("claim_status") not in {"infrastructure_hypothesis", "validated_only_against_fixture", "research_question"}:
        errors.append("packet: claim_status overstates validation")

    measurable = packet.get("measurable_variables") or []
    required_metrics = {
        "private_identifier_rejection_rate",
        "missingness_state_validity_rate",
        "unsafe_directive_rejection_rate",
        "continuity_signal_retention_rate",
    }
    if not required_metrics.issubset(set(measurable)):
        errors.append("packet: measurable_variables missing required privacy/retention metrics")

    for record in packet.get("records", []):
        errors.extend(validate_record(record))

    scores = score_fixture(packet)
    return (0 if not errors else 1), errors, scores


def main(argv: list[str]) -> int:
    base = Path(__file__).resolve().parent
    fixture_path = Path(argv[1]) if len(argv) > 1 else base / "privacy_longitudinal_fixture.json"
    code, errors, scores = validate_fixture(fixture_path)

    print("MC privacy longitudinal dataset scores:")
    for key, value in scores.items():
        print(f"- {key}: {value:.4f}")

    if errors:
        print("MC privacy longitudinal dataset validation failed:")
        for error in errors:
            print(f"- {error}")
    else:
        print("MC privacy longitudinal dataset validation passed.")
    return code


if __name__ == "__main__":
    raise SystemExit(main(sys.argv))
