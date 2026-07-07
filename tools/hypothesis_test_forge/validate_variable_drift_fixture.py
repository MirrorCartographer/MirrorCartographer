#!/usr/bin/env python3
"""Validate MC variable-drift fixtures.

This validator is research-organization infrastructure only. It rejects unsafe
promotion of longitudinal records into diagnosis, treatment, veterinary advice,
dosage guidance, emergency triage, cure certainty, discovery proof, private
identifier retention, unsupported causality, or missingness-as-absence.
"""

from __future__ import annotations

import json
import re
from pathlib import Path
from typing import Any

FIXTURE_PATH = Path(__file__).with_name("variable_drift_fixture.json")

REQUIRED_TOP_LEVEL = {
    "artifact_id",
    "domain",
    "claim",
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

REQUIRED_RECORD = {
    "record_id",
    "variable_name",
    "definition",
    "unit",
    "collection_context",
    "timepoint_a",
    "timepoint_b",
    "comparison_status",
    "claimed_inference",
    "boundary_flags",
    "decision",
}

ALLOWED_MISSINGNESS = {
    "observed",
    "unknown",
    "not_collected",
    "redacted",
    "not_applicable",
}

BLOCKED_PATTERNS = {
    "diagnosis_claim": re.compile(r"\b(diagnos(e|is|tic)|proves diagnosis)\b", re.I),
    "treatment_claim": re.compile(r"\b(treat(ment)?|therapy should start|medication should start)\b", re.I),
    "veterinary_advice": re.compile(r"\b(vet treatment|veterinary treatment|animal dosage|pet dosage)\b", re.I),
    "dosage_guidance": re.compile(r"\b\d+\s?(mg|mcg|ml|tablet|capsule)s?\b", re.I),
    "emergency_triage": re.compile(r"\b(emergency|urgent|ER now|go now)\b", re.I),
    "cure_certainty": re.compile(r"\b(cure(d)?|healed|guaranteed recovery)\b", re.I),
    "discovery_proof": re.compile(r"\b(proves? discovery|new law of biology|breakthrough proven)\b", re.I),
    "unsupported_causality": re.compile(r"\b(caused by|therefore caused|must be caused)\b", re.I),
}

PRIVATE_PATTERNS = {
    "email": re.compile(r"[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}", re.I),
    "phone": re.compile(r"\b(?:\+?1[-.\s]?)?(?:\(?\d{3}\)?[-.\s]?){2}\d{4}\b"),
}

DRIFT_FLAGS = {
    "definition_drift",
    "unit_drift",
    "collection_context_drift",
}


def flatten_text(value: Any) -> str:
    if isinstance(value, dict):
        return " ".join(flatten_text(v) for v in value.values())
    if isinstance(value, list):
        return " ".join(flatten_text(v) for v in value)
    return str(value)


def require(condition: bool, message: str, errors: list[str]) -> None:
    if not condition:
        errors.append(message)


def validate_fixture(data: dict[str, Any]) -> list[str]:
    errors: list[str] = []
    require(REQUIRED_TOP_LEVEL <= set(data), f"missing top-level keys: {sorted(REQUIRED_TOP_LEVEL - set(data))}", errors)
    require("synthetic" in data.get("source_status", "").lower(), "source_status must identify synthetic source", errors)
    require("not a scientific finding" in data.get("claim_status", "").lower(), "claim_status must block finding-level promotion", errors)
    require("public-safe" in data.get("privacy_status", "").lower(), "privacy_status must be public-safe", errors)
    require("unknown must not be treated as absence" in data.get("missingness", "").lower(), "missingness must forbid unknown-as-absence", errors)
    require(isinstance(data.get("measurable_variables"), list) and len(data.get("measurable_variables", [])) >= 4, "measurable_variables must list at least four metrics", errors)

    records = data.get("records", [])
    require(isinstance(records, list) and records, "records must be a non-empty list", errors)

    for idx, record in enumerate(records):
        prefix = f"record[{idx}] {record.get('record_id', '<missing>')}: "
        require(REQUIRED_RECORD <= set(record), prefix + f"missing record keys: {sorted(REQUIRED_RECORD - set(record))}", errors)

        flags = set(record.get("boundary_flags", []))
        decision = record.get("decision")
        comparison_status = str(record.get("comparison_status", ""))
        all_text = flatten_text(record)

        for tp_name in ("timepoint_a", "timepoint_b"):
            tp = record.get(tp_name, {})
            require(isinstance(tp, dict), prefix + f"{tp_name} must be an object", errors)
            require(tp.get("missingness") in ALLOWED_MISSINGNESS, prefix + f"{tp_name} has invalid missingness", errors)

        has_private = any(pattern.search(all_text) for pattern in PRIVATE_PATTERNS.values())
        has_blocked = {name for name, pattern in BLOCKED_PATTERNS.items() if pattern.search(all_text)}
        has_missingness_collapse = "missingness_as_absence" in flags or (
            "no issue" in all_text.lower() and "unknown" in all_text.lower() and comparison_status == "comparable"
        )
        has_drift = bool(flags & DRIFT_FLAGS) or "not_comparable" in comparison_status
        unsafe = has_private or bool(has_blocked) or has_missingness_collapse

        if decision == "pass":
            require(not has_private, prefix + "pass record contains private identifier", errors)
            require(not has_blocked, prefix + f"pass record contains blocked claims: {sorted(has_blocked)}", errors)
            require(not has_missingness_collapse, prefix + "pass record collapses missingness into absence", errors)
            if has_drift:
                require(comparison_status.startswith("not_comparable"), prefix + "drifted pass record must be marked not_comparable", errors)
        elif decision == "fail":
            require(unsafe, prefix + "fail record must contain a detectable unsafe condition", errors)
        else:
            errors.append(prefix + "decision must be pass or fail")

    return errors


def main() -> int:
    data = json.loads(FIXTURE_PATH.read_text(encoding="utf-8"))
    errors = validate_fixture(data)
    if errors:
        print("VARIABLE DRIFT FIXTURE FAILED")
        for error in errors:
            print(f"- {error}")
        return 1

    records = data["records"]
    drift_event_count = sum(1 for r in records if set(r.get("boundary_flags", [])) & DRIFT_FLAGS)
    comparable_record_count = sum(1 for r in records if r.get("comparison_status") == "comparable" and r.get("decision") == "pass")
    rejected_record_count = sum(1 for r in records if r.get("decision") == "fail")
    print("VARIABLE DRIFT FIXTURE PASSED")
    print(f"records={len(records)} drift_event_count={drift_event_count} comparable_record_count={comparable_record_count} rejected_record_count={rejected_record_count}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
