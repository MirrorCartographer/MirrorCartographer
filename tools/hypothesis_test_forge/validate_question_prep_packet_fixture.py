#!/usr/bin/env python3
"""Validate MC question-prep packet fixtures.

This validator checks that medical/animal-care adjacent observations are organized
as research/question-prep infrastructure, not diagnosis, treatment, veterinary
advice, dosage guidance, emergency triage, cure certainty, or proof claims.
"""

from __future__ import annotations

import json
import re
import sys
from pathlib import Path
from typing import Any

ROOT = Path(__file__).resolve().parent
FIXTURE = ROOT / "question_prep_packet_fixture.json"

REQUIRED_TOP_LEVEL = {
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
    "packets",
}

REQUIRED_PACKET_FIELDS = {
    "packet_id",
    "subject_scope",
    "source_status",
    "claim_status",
    "privacy_status",
    "missingness",
    "revision_reason",
    "implementation_status",
    "testability",
    "falsification_route",
    "observations",
    "interpretations",
    "questions_for_professional_review",
    "blocked_claims",
    "measurable_variables",
    "next_executable_action",
}

UNSAFE_PATTERNS = [
    r"\bdiagnos(?:e|is|ed)\b.*\b(is|confirmed|proven)\b",
    r"\btreat(?:ment|s|ed|ing)?\b.*\b(should|must|will|cure|fix)\b",
    r"\bdos(?:e|age)\b.*\b(should|must|give|increase|decrease)\b",
    r"\bemergency\b.*\b(definitely|always|never|is)\b",
    r"\bcure(?:d|s)?\b.*\b(proven|guaranteed|certain|will)\b",
    r"\bcaused by\b",
    r"\bproves?\b",
    r"\babsence of evidence\b.*\babsence\b",
]

PRIVATE_IDENTIFIER_PATTERNS = [
    r"[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}",
    r"\b\d{3}[-.) ]?\d{3}[-. ]?\d{4}\b",
    r"\b\d{1,5}\s+[A-Za-z0-9.'-]+\s+(Street|St|Road|Rd|Avenue|Ave|Lane|Ln|Drive|Dr)\b",
]


def flatten_text(value: Any) -> str:
    if isinstance(value, dict):
        return "\n".join(flatten_text(v) for v in value.values())
    if isinstance(value, list):
        return "\n".join(flatten_text(v) for v in value)
    return str(value)


def assert_required_fields(obj: dict[str, Any], required: set[str], label: str) -> list[str]:
    return [f"{label} missing required field: {field}" for field in sorted(required - set(obj))]


def validate_measurable_variables(packet: dict[str, Any]) -> list[str]:
    errors: list[str] = []
    variables = packet.get("measurable_variables")
    if not isinstance(variables, list) or not variables:
        return [f"{packet.get('packet_id')}: measurable_variables must be a non-empty list"]
    for idx, variable in enumerate(variables):
        if not isinstance(variable, dict):
            errors.append(f"{packet.get('packet_id')}: variable {idx} must be an object")
            continue
        for field in ("name", "unit", "collection_method", "missingness_allowed"):
            if field not in variable:
                errors.append(f"{packet.get('packet_id')}: variable {idx} missing {field}")
        if variable.get("missingness_allowed") is not True:
            errors.append(f"{packet.get('packet_id')}: variable {idx} must explicitly allow missingness")
    return errors


def validate_packet(packet: dict[str, Any]) -> list[str]:
    errors = assert_required_fields(packet, REQUIRED_PACKET_FIELDS, str(packet.get("packet_id", "packet")))

    text = flatten_text(packet)
    for pattern in UNSAFE_PATTERNS:
        if re.search(pattern, text, flags=re.IGNORECASE):
            errors.append(f"{packet.get('packet_id')}: unsafe promotable claim matched {pattern!r}")
    for pattern in PRIVATE_IDENTIFIER_PATTERNS:
        if re.search(pattern, text, flags=re.IGNORECASE):
            errors.append(f"{packet.get('packet_id')}: private identifier matched {pattern!r}")

    if "question_prep" not in packet.get("claim_status", "") and "observation_only" not in packet.get("claim_status", ""):
        errors.append(f"{packet.get('packet_id')}: claim_status must preserve observation/question-prep boundary")

    if not isinstance(packet.get("missingness"), dict) or not packet["missingness"]:
        errors.append(f"{packet.get('packet_id')}: missingness must be a non-empty object")
    elif any(str(value).lower() in {"absent", "none", "no issue"} for value in packet["missingness"].values()):
        errors.append(f"{packet.get('packet_id')}: missingness cannot collapse unknown into absence")

    if not packet.get("observations") or not packet.get("questions_for_professional_review"):
        errors.append(f"{packet.get('packet_id')}: observations and professional-review questions are required")

    errors.extend(validate_measurable_variables(packet))
    return errors


def main() -> int:
    data = json.loads(FIXTURE.read_text(encoding="utf-8"))
    errors = assert_required_fields(data, REQUIRED_TOP_LEVEL, "fixture")

    packets = data.get("packets")
    if not isinstance(packets, list) or not packets:
        errors.append("fixture packets must be a non-empty list")
    else:
        for packet in packets:
            if not isinstance(packet, dict):
                errors.append("each packet must be an object")
                continue
            errors.extend(validate_packet(packet))

    if errors:
        print("QUESTION_PREP_PACKET_FIXTURE: FAIL")
        for error in errors:
            print(f"- {error}")
        return 1

    print("QUESTION_PREP_PACKET_FIXTURE: PASS")
    print(f"validated_packets={len(packets)}")
    print("blocked_classes=diagnosis,treatment,veterinary_advice,dosage,urgency,cure,unsupported_causality,private_identifiers,missingness_collapse")
    return 0


if __name__ == "__main__":
    sys.exit(main())
