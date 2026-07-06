#!/usr/bin/env python3
"""Validate MC decision-readiness packets.

This gate checks whether a generated discovery claim is ready for human
collaborator review rather than merely plausible. It is public-safe research
infrastructure and does not provide medical or veterinary advice.
"""

from __future__ import annotations

import json
import sys
from pathlib import Path
from typing import Any

ALLOWED_SOURCE_STATUS = {
    "primary_public",
    "preprint_public",
    "institutional_public",
    "benchmark_public",
    "synthetic_fixture",
    "mixed_public",
}
ALLOWED_CLAIM_STATUS = {
    "hypothesis",
    "prototype_requirement",
    "evaluation_criterion",
    "contradiction",
    "inconclusive",
}
ALLOWED_PRIVACY_STATUS = {
    "public_safe",
    "synthetic_only",
    "deidentified_public_safe",
}
ALLOWED_IMPLEMENTATION_STATUS = {"specified", "implemented", "validated", "blocked"}
ALLOWED_EVIDENCE_STRENGTH = {"low", "moderate", "high"}
ALLOWED_TARGET_DIRECTION = {"increase", "decrease", "bounded", "detect"}
ALLOWED_PROVENANCE_STATUS = {"observed", "generated", "validated", "rejected", "missing"}
REQUIRED_FIELDS = {
    "packet_id",
    "claim",
    "source_status",
    "claim_status",
    "privacy_status",
    "missingness",
    "revision_reason",
    "implementation_status",
    "evidence_strength",
    "human_decision_needed",
    "decision_options",
    "measurable_variables",
    "falsification_route",
    "provenance_chain",
    "uncertainty_summary",
    "next_executable_action",
}


def _text(value: Any, min_len: int = 1) -> bool:
    return isinstance(value, str) and len(value.strip()) >= min_len


def validate_packet(packet: dict[str, Any]) -> list[str]:
    errors: list[str] = []
    missing = sorted(REQUIRED_FIELDS - set(packet))
    if missing:
        errors.append(f"missing required fields: {', '.join(missing)}")

    if packet.get("source_status") not in ALLOWED_SOURCE_STATUS:
        errors.append("invalid source_status")
    if packet.get("claim_status") not in ALLOWED_CLAIM_STATUS:
        errors.append("invalid claim_status")
    if packet.get("privacy_status") not in ALLOWED_PRIVACY_STATUS:
        errors.append("invalid privacy_status")
    if packet.get("implementation_status") not in ALLOWED_IMPLEMENTATION_STATUS:
        errors.append("invalid implementation_status")
    if packet.get("evidence_strength") not in ALLOWED_EVIDENCE_STRENGTH:
        errors.append("invalid evidence_strength")

    for field, min_len in [
        ("packet_id", 6),
        ("claim", 20),
        ("revision_reason", 10),
        ("human_decision_needed", 15),
        ("falsification_route", 20),
        ("uncertainty_summary", 20),
        ("next_executable_action", 15),
    ]:
        if field in packet and not _text(packet[field], min_len):
            errors.append(f"{field} must be non-empty text of length >= {min_len}")

    missingness = packet.get("missingness")
    if not isinstance(missingness, list) or not missingness or not all(_text(x, 3) for x in missingness):
        errors.append("missingness must be a non-empty list of text entries")

    decision_options = packet.get("decision_options")
    if not isinstance(decision_options, list) or len(decision_options) < 2:
        errors.append("decision_options must contain at least two options")
    else:
        for i, option in enumerate(decision_options):
            if not isinstance(option, dict):
                errors.append(f"decision_options[{i}] must be an object")
                continue
            for field in ("option", "tradeoff", "acceptance_criterion"):
                if not _text(option.get(field), 3 if field == "option" else 8):
                    errors.append(f"decision_options[{i}].{field} is required")

    variables = packet.get("measurable_variables")
    if not isinstance(variables, list) or len(variables) < 2:
        errors.append("measurable_variables must contain at least two variables")
    else:
        for i, variable in enumerate(variables):
            if not isinstance(variable, dict):
                errors.append(f"measurable_variables[{i}] must be an object")
                continue
            if not _text(variable.get("name"), 3):
                errors.append(f"measurable_variables[{i}].name is required")
            if not _text(variable.get("measurement"), 8):
                errors.append(f"measurable_variables[{i}].measurement is required")
            if variable.get("target_direction") not in ALLOWED_TARGET_DIRECTION:
                errors.append(f"measurable_variables[{i}].target_direction is invalid")

    chain = packet.get("provenance_chain")
    if not isinstance(chain, list) or len(chain) < 2:
        errors.append("provenance_chain must contain at least two steps")
    else:
        for i, step in enumerate(chain):
            if not isinstance(step, dict):
                errors.append(f"provenance_chain[{i}] must be an object")
                continue
            if not _text(step.get("step"), 3):
                errors.append(f"provenance_chain[{i}].step is required")
            if not _text(step.get("artifact"), 3):
                errors.append(f"provenance_chain[{i}].artifact is required")
            if step.get("status") not in ALLOWED_PROVENANCE_STATUS:
                errors.append(f"provenance_chain[{i}].status is invalid")

    return errors


def main(argv: list[str]) -> int:
    if len(argv) != 2:
        print("usage: validate_decision_readiness.py <fixtures-or-packet.json>", file=sys.stderr)
        return 2
    path = Path(argv[1])
    data = json.loads(path.read_text(encoding="utf-8"))

    if isinstance(data, list):
        failures = 0
        for case in data:
            packet = case.get("packet", case)
            errors = validate_packet(packet)
            expect_valid = case.get("expect_valid", True)
            passed = not errors
            if passed != expect_valid:
                failures += 1
                print(f"FAIL {case.get('name', packet.get('packet_id', '<unnamed>'))}: {errors}")
            else:
                print(f"PASS {case.get('name', packet.get('packet_id', '<unnamed>'))}")
        return 1 if failures else 0

    errors = validate_packet(data)
    if errors:
        print(json.dumps({"valid": False, "errors": errors}, indent=2))
        return 1
    print(json.dumps({"valid": True, "errors": []}, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv))
