#!/usr/bin/env python3
"""Validate MC symbolic-to-operational translation fixtures.

This validator tests whether symbolic material is converted into measurable,
reviewable variables without being promoted into diagnosis, treatment,
veterinary advice, factual discovery proof, or supernatural certainty.
"""
from __future__ import annotations

import json
import re
import sys
from pathlib import Path
from typing import Any

REQUIRED_TOP_LEVEL_FIELDS = [
    "artifact_id",
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
    "hypothesis_packet",
]

REQUIRED_PACKET_FIELDS = [
    "domain",
    "route",
    "input_statement",
    "allowed_translation",
    "blocked_translation_examples",
    "observations",
    "boundary_flags",
    "decision",
]

MISSINGNESS_STATES = {"observed", "unknown", "not_collected", "redacted", "not_applicable"}

BLOCKED_PATTERNS = [
    r"\bdiagnos(?:e|is|tic)\b",
    r"\btreat(?:ment)?\b",
    r"\bdosage\b",
    r"\bhealed?\b",
    r"\bcured?\b",
    r"\bproves?\b",
    r"\bmust mean\b",
    r"\bexternal entity\b",
    r"\bmessage from\b",
    r"\bveterinary advice\b",
]

ALLOWED_DECISIONS = {
    "pass_as_research_organization_fixture",
    "revise_before_memory_entry",
    "reject_boundary_violation",
}


def load_json(path: Path) -> dict[str, Any]:
    with path.open("r", encoding="utf-8") as handle:
        return json.load(handle)


def contains_blocked_claim(text: str) -> bool:
    lowered = text.lower()
    return any(re.search(pattern, lowered) for pattern in BLOCKED_PATTERNS)


def validate_fixture(data: dict[str, Any]) -> list[str]:
    errors: list[str] = []

    for field in REQUIRED_TOP_LEVEL_FIELDS:
        if field not in data:
            errors.append(f"missing top-level field: {field}")

    packet = data.get("hypothesis_packet") or {}
    for field in REQUIRED_PACKET_FIELDS:
        if field not in packet:
            errors.append(f"missing hypothesis_packet field: {field}")

    if data.get("privacy_status") and "synthetic" not in data["privacy_status"].lower():
        errors.append("privacy_status must explicitly identify synthetic/public-safe status")

    if not data.get("measurable_variables"):
        errors.append("measurable_variables must not be empty")

    decision = packet.get("decision")
    if decision not in ALLOWED_DECISIONS:
        errors.append(f"invalid decision: {decision!r}")

    allowed = packet.get("allowed_translation") or {}
    variables = allowed.get("operational_variables") or []
    if not variables:
        errors.append("allowed_translation.operational_variables must not be empty")

    for index, variable in enumerate(variables):
        for key in ["variable", "definition", "unit", "missingness", "measurement_route"]:
            if key not in variable:
                errors.append(f"operational variable {index} missing {key}")
        if variable.get("missingness") not in MISSINGNESS_STATES:
            errors.append(f"operational variable {index} has invalid missingness {variable.get('missingness')!r}")

    permitted_output = allowed.get("permitted_output", "")
    if contains_blocked_claim(permitted_output):
        errors.append("permitted_output contains blocked claim language")

    blocked_examples = packet.get("blocked_translation_examples") or []
    if not blocked_examples:
        errors.append("blocked_translation_examples must not be empty")
    for example in blocked_examples:
        if not contains_blocked_claim(example):
            errors.append(f"blocked example does not actually include detectable blocked language: {example!r}")

    for index, observation in enumerate(packet.get("observations") or []):
        state = observation.get("missingness")
        if state not in MISSINGNESS_STATES:
            errors.append(f"observation {index} has invalid missingness {state!r}")
        value = observation.get("value")
        if state != "observed" and value in (False, 0, "absent", "none", "no"):
            errors.append(f"observation {index} collapses missingness into absence")
        if state == "observed":
            for key in ["variable", "value", "unit"]:
                if key not in observation:
                    errors.append(f"observed observation {index} missing {key}")

    return errors


def main(argv: list[str]) -> int:
    path = Path(argv[1]) if len(argv) > 1 else Path(__file__).with_name("symbolic_operational_translation_fixture.json")
    errors = validate_fixture(load_json(path))
    if errors:
        print("MC symbolic-operational fixture failed:")
        for error in errors:
            print(f"- {error}")
        return 1
    print("MC symbolic-operational fixture passed.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv))
