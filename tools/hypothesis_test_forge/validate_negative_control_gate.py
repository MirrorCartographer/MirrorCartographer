#!/usr/bin/env python3
"""Validate the MC negative-control gate fixture.

This validator is research-organization infrastructure only. It rejects packets
that promote diagnosis, treatment, veterinary advice, dosage guidance, emergency
triage, cure certainty, discovery proof, unsupported causality, or public
certainty claims.
"""

from __future__ import annotations

import json
import sys
from pathlib import Path
from typing import Any

FIXTURE = Path(__file__).with_name("negative_control_gate_fixture.json")

REQUIRED_TOP_LEVEL_FIELDS = [
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

REQUIRED_CASE_FIELDS = [
    "case_id",
    "source_status",
    "claim_status",
    "privacy_status",
    "missingness",
    "revision_reason",
    "implementation_status",
    "testability",
    "proposed_relationship",
    "source_boundary",
    "positive_control",
    "negative_control",
    "disconfirming_observations",
    "measurable_variables",
    "falsification_route",
    "blocked_routes",
    "next_executable_action",
]

UNSAFE_TERMS = [
    "diagnosis",
    "treatment_recommendation",
    "veterinary_advice",
    "dosage_guidance",
    "emergency_triage",
    "cure_certainty",
    "discovery_proof",
    "unsupported_causality",
    "public_certainty_claim",
]


def fail(message: str) -> None:
    print(f"FAIL: {message}")
    sys.exit(1)


def require_nonempty_string(value: Any, label: str) -> None:
    if not isinstance(value, str) or not value.strip():
        fail(f"{label} must be a non-empty string")


def require_list(value: Any, label: str, minimum: int = 1) -> None:
    if not isinstance(value, list) or len(value) < minimum:
        fail(f"{label} must be a list with at least {minimum} item(s)")


def validate_control(control: Any, label: str) -> None:
    if not isinstance(control, dict):
        fail(f"{label} must be an object")
    for field in ["expectation", "measurement", "unit"]:
        require_nonempty_string(control.get(field), f"{label}.{field}")


def validate_valid_case(case: dict[str, Any]) -> None:
    validate_control(case.get("positive_control"), "positive_control")
    validate_control(case.get("negative_control"), "negative_control")
    require_list(case.get("disconfirming_observations"), "disconfirming_observations")
    require_list(case.get("measurable_variables"), "measurable_variables")
    require_nonempty_string(case.get("falsification_route"), "falsification_route")
    require_nonempty_string(case.get("source_boundary"), "source_boundary")
    if case.get("missingness") in ["", None, "not_reported"]:
        fail("valid case must preserve missingness explicitly")
    if case.get("blocked_routes") != []:
        fail("valid case must not promote unsafe blocked routes")


def validate_invalid_case(case: dict[str, Any]) -> None:
    has_negative_control = isinstance(case.get("negative_control"), dict)
    has_disconfirming_route = bool(case.get("disconfirming_observations"))
    has_measurable_variables = bool(case.get("measurable_variables"))
    blocks_unsafe_routes = any(route in UNSAFE_TERMS for route in case.get("blocked_routes", []))
    if has_negative_control and has_disconfirming_route and has_measurable_variables and blocks_unsafe_routes:
        fail("invalid case unexpectedly satisfies the negative-control gate")


def main() -> None:
    data = json.loads(FIXTURE.read_text(encoding="utf-8"))

    for field in REQUIRED_TOP_LEVEL_FIELDS:
        if field not in data:
            fail(f"missing top-level field: {field}")

    require_nonempty_string(data.get("claim"), "claim")
    require_list(data.get("measurable_variables"), "measurable_variables")
    require_nonempty_string(data.get("falsification_route"), "falsification_route")
    require_nonempty_string(data.get("next_executable_action"), "next_executable_action")

    promotion_rules = data.get("promotion_rules", {})
    blocked_outputs = promotion_rules.get("blocked_outputs", [])
    for unsafe in UNSAFE_TERMS:
        if unsafe not in blocked_outputs:
            fail(f"promotion rules must block {unsafe}")

    test_cases = data.get("test_cases")
    require_list(test_cases, "test_cases", minimum=2)

    saw_valid = False
    saw_invalid = False

    for case in test_cases:
        for field in REQUIRED_CASE_FIELDS:
            if field not in case:
                fail(f"{case.get('case_id', '<unknown>')} missing field: {field}")

        case_id = case.get("case_id", "")
        if case_id.startswith("valid_"):
            validate_valid_case(case)
            saw_valid = True
        elif case_id.startswith("invalid_"):
            validate_invalid_case(case)
            saw_invalid = True
        else:
            fail(f"case_id must start with valid_ or invalid_: {case_id}")

    if not saw_valid or not saw_invalid:
        fail("fixture must include at least one valid_ and one invalid_ case")

    print("PASS: negative-control gate fixture is valid")


if __name__ == "__main__":
    main()
