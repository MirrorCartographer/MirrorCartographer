#!/usr/bin/env python3
"""Validate MC animal-care evidence-map fixtures.

This validator keeps animal-care packets in research organization and
veterinarian-facing question-prep territory. It is not veterinary advice,
diagnosis, treatment, dosage guidance, emergency triage, or factual discovery
proof.
"""
from __future__ import annotations

import json
import re
import sys
from pathlib import Path
from typing import Any

REQUIRED_LABELS = [
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
]

MISSINGNESS_STATES = {"observed", "unknown", "not_collected", "redacted", "not_applicable"}
ABSENCE_VALUES = {"absent", "none", "no", "not present", False, 0}
BLOCKING_FLAGS = {
    "diagnosis_claim",
    "treatment_or_cure_claim",
    "veterinary_directive",
    "dosage_guidance",
    "emergency_triage",
    "unsupported_causality",
    "private_identifier_present",
    "missingness_as_absence",
}
BLOCKED_PATTERNS = [
    re.compile(pattern, re.IGNORECASE)
    for pattern in [
        r"\bdiagnos(?:e|es|is|ed)\b",
        r"\bcure(?:s|d)?\b",
        r"\bheal(?:s|ed)?\b",
        r"\btreat(?:s|ed|ment)?\b",
        r"\bgive\s+(?:a\s+)?dose\b",
        r"\b(?:increase|decrease|change)\s+(?:the\s+)?dose\b",
        r"\bskip\s+(?:the\s+)?(?:vet|veterinarian|emergency)\b",
        r"\bno\s+(?:vet|veterinarian)\s+needed\b",
        r"\bdefinitely\s+caused\s+by\b",
        r"\bproves?\s+(?:lymphoma|heart disease|glaucoma|infection|cancer)\b",
        r"\bemergency\s+level\s+is\b",
    ]
]
PRIVATE_PATTERNS = [
    re.compile(pattern, re.IGNORECASE)
    for pattern in [
        r"\b\d{3}[-.) ]?\d{3}[-. ]?\d{4}\b",
        r"\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b",
        r"\b\d{1,5}\s+[A-Z][a-z]+\s+(?:Street|St|Road|Rd|Avenue|Ave|Drive|Dr)\b",
        r"\b(?:Banfield|VCA|South Rowan|Imperial Beach)\b",
    ]
]


def load_json(path: str | Path) -> dict[str, Any]:
    with open(path, "r", encoding="utf-8") as handle:
        return json.load(handle)


def collect_text(value: Any) -> str:
    if isinstance(value, dict):
        return "\n".join(collect_text(item) for item in value.values())
    if isinstance(value, list):
        return "\n".join(collect_text(item) for item in value)
    return "" if value is None else str(value)


def validate_packet(packet: dict[str, Any]) -> list[str]:
    errors: list[str] = []
    packet_id = packet.get("packet_id", "<no-id>")

    for label in REQUIRED_LABELS:
        if label not in packet:
            errors.append(f"{packet_id}: missing required label {label}")
        elif label == "measurable_variables" and not isinstance(packet[label], list):
            errors.append(f"{packet_id}: measurable_variables must be a list")
        elif label != "measurable_variables" and not packet[label]:
            errors.append(f"{packet_id}: empty required label {label}")

    decision = packet.get("decision")
    if decision not in {"pass", "reject", "needs_review"}:
        errors.append(f"{packet_id}: invalid decision {decision!r}")

    text = collect_text(packet)
    for pattern in BLOCKED_PATTERNS:
        if pattern.search(text):
            errors.append(f"{packet_id}: blocked veterinary/causality claim matched {pattern.pattern!r}")
    for pattern in PRIVATE_PATTERNS:
        if pattern.search(text):
            errors.append(f"{packet_id}: possible private identifier matched {pattern.pattern!r}")

    boundary_flags = set(packet.get("boundary_flags") or [])
    blocking_flags = boundary_flags.intersection(BLOCKING_FLAGS)
    if decision == "pass" and blocking_flags:
        errors.append(f"{packet_id}: pass decision with blocking flags {sorted(blocking_flags)}")

    observations = packet.get("observations") or []
    if not observations:
        errors.append(f"{packet_id}: observations required")

    observed_count = 0
    unknown_count = 0
    for index, observation in enumerate(observations):
        state = observation.get("missingness")
        if state not in MISSINGNESS_STATES:
            errors.append(f"{packet_id}: observation {index} invalid missingness {state!r}")
        if state == "observed":
            observed_count += 1
            for key in ("variable", "value", "unit", "time_status"):
                if key not in observation:
                    errors.append(f"{packet_id}: observed observation {index} missing {key}")
        else:
            if state == "unknown":
                unknown_count += 1
            if observation.get("value") in ABSENCE_VALUES:
                errors.append(f"{packet_id}: missingness collapsed into absence at observation {index}")

    safe_outputs = packet.get("safe_outputs") or []
    if not safe_outputs:
        errors.append(f"{packet_id}: safe_outputs required for question-prep framing")
    elif not any("ask" in output.lower() or "question" in output.lower() for output in safe_outputs):
        errors.append(f"{packet_id}: safe_outputs must preserve question-prep framing")

    if decision == "pass" and observed_count == 0:
        errors.append(f"{packet_id}: pass requires at least one observed variable")
    if decision == "pass" and not packet.get("measurable_variables"):
        errors.append(f"{packet_id}: pass requires measurable variables")

    if unknown_count == 0 and "unknown" not in str(packet.get("missingness", "")).lower():
        errors.append(f"{packet_id}: fixture should demonstrate explicit unknown/missingness handling")

    return errors


def validate_fixture(path: str | Path) -> tuple[int, list[str], dict[str, int]]:
    fixture = load_json(path)
    all_errors: list[str] = []
    intentionally_invalid_rejected = 0
    valid_packets_seen = 0

    for label in REQUIRED_LABELS:
        if label not in fixture:
            all_errors.append(f"fixture: missing top-level label {label}")

    for packet in fixture.get("packets", []):
        errors = validate_packet(packet)
        is_intentionally_invalid = ".invalid." in packet.get("packet_id", "")
        if is_intentionally_invalid:
            if errors:
                intentionally_invalid_rejected += 1
            else:
                all_errors.append(f"{packet.get('packet_id')}: intentionally invalid packet was accepted")
        else:
            valid_packets_seen += 1
            all_errors.extend(errors)

    metrics = {
        "valid_packets_seen": valid_packets_seen,
        "intentionally_invalid_rejected": intentionally_invalid_rejected,
        "total_errors": len(all_errors),
    }
    return (0 if not all_errors else 1), all_errors, metrics


def main(argv: list[str]) -> int:
    base = Path(__file__).resolve().parent
    fixture_path = Path(argv[1]) if len(argv) > 1 else base / "animal_care_evidence_map_fixture.json"
    code, errors, metrics = validate_fixture(fixture_path)
    if errors:
        print("MC animal-care evidence-map validation failed:")
        for error in errors:
            print(f"- {error}")
    else:
        print("MC animal-care evidence-map validation passed.")
    print(json.dumps(metrics, indent=2, sort_keys=True))
    return code


if __name__ == "__main__":
    raise SystemExit(main(sys.argv))
