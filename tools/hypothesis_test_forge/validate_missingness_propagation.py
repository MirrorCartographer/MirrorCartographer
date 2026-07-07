#!/usr/bin/env python3
"""
Validate MC missingness propagation fixture.

This is research-organization infrastructure only. It is not medical advice,
veterinary advice, diagnosis, treatment, dosage guidance, or emergency triage.
"""

from __future__ import annotations

import json
import re
import sys
from pathlib import Path
from typing import Any

FIXTURE_PATH = Path(__file__).with_name("missingness_propagation_fixture.json")

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
}

REQUIRED_RECORD_FIELDS = REQUIRED_TOP_LEVEL | {"record_id", "derived_inference"}

UNSAFE_PHRASES = re.compile(
    r"\b(diagnos(?:e|is|ed)|treat(?:ment)?|dosage|dose|urgent|emergency|"
    r"veterinary advice|vet advice|cured?|healed|discovery proof|proven|resolved|"
    r"appears resolved|absence|absent|improved because no|safe to ignore)\b",
    re.IGNORECASE,
)

MISSING_STATES_THAT_MUST_PROPAGATE = {
    "not_asked",
    "not_recorded",
    "withheld_for_privacy",
    "unknown_source_quality",
}

REQUIRED_BLOCKED_PROMOTIONS = {
    "diagnosis",
    "treatment",
    "veterinary_advice",
    "cure_claim",
    "discovery_proof",
    "absence_from_missingness",
    "improvement_from_missingness",
}

SAFE_ROUTES = {
    "research_organization_question_prep",
    "longitudinal_observation",
    "professional_question_prep",
    "private_memory_with_privacy_gate",
    "blocked_pending_more_data",
}


def fail(message: str) -> None:
    print(f"FAIL: {message}")
    sys.exit(1)


def require_fields(obj: dict[str, Any], required: set[str], where: str) -> None:
    missing = sorted(required - obj.keys())
    if missing:
        fail(f"{where} missing required fields: {missing}")


def variable_missing_states(record: dict[str, Any]) -> set[str]:
    states: set[str] = set()
    for variable in record.get("measurable_variables", []):
        state = variable.get("missingness_state")
        if not state:
            fail(f"{record['record_id']} variable missing missingness_state")
        states.add(state)
    return states


def validate_pass_record(record: dict[str, Any]) -> None:
    inference = record["derived_inference"]
    states = variable_missing_states(record)
    must_propagate = bool(states & MISSING_STATES_THAT_MUST_PROPAGATE)

    if must_propagate and not inference.get("missingness_propagated"):
        fail(f"{record['record_id']} failed to propagate missingness")

    blocked = set(inference.get("blocked_promotions", []))
    missing_blocks = REQUIRED_BLOCKED_PROMOTIONS - blocked
    if missing_blocks:
        fail(f"{record['record_id']} missing blocked promotions: {sorted(missing_blocks)}")

    if inference.get("safe_route") not in SAFE_ROUTES:
        fail(f"{record['record_id']} has unsafe route: {inference.get('safe_route')}")

    text = inference.get("text", "")
    if UNSAFE_PHRASES.search(text) and not inference.get("missingness_propagated"):
        fail(f"{record['record_id']} contains unsafe inference without propagated uncertainty")


def validate_expected_fail_record(record: dict[str, Any]) -> None:
    inference = record["derived_inference"]
    text = inference.get("text", "")
    unsafe_route = inference.get("safe_route") not in SAFE_ROUTES
    unsafe_text = bool(UNSAFE_PHRASES.search(text))
    failed_to_propagate = not inference.get("missingness_propagated")

    if not (unsafe_route or unsafe_text or failed_to_propagate):
        fail(f"{record['record_id']} was marked expected-fail but did not fail any gate")


def main() -> None:
    fixture = json.loads(FIXTURE_PATH.read_text(encoding="utf-8"))
    require_fields(fixture, REQUIRED_TOP_LEVEL, "fixture")

    records = fixture.get("records")
    if not isinstance(records, list) or not records:
        fail("fixture must contain non-empty records list")

    pass_count = 0
    expected_fail_count = 0

    for record in records:
        require_fields(record, REQUIRED_RECORD_FIELDS, record.get("record_id", "record"))
        if record.get("privacy_status") not in {"de_identified", "synthetic", "de_identified_synthetic"}:
            fail(f"{record['record_id']} has unsafe privacy_status")

        if record.get("testability") == "fail_case":
            validate_expected_fail_record(record)
            expected_fail_count += 1
        else:
            validate_pass_record(record)
            pass_count += 1

    if pass_count < 1 or expected_fail_count < 1:
        fail("fixture must include at least one pass case and one expected-fail negative control")

    print(
        "PASS: missingness propagation fixture preserves uncertainty, blocks missingness-as-absence, "
        "and keeps outputs in research/question-prep infrastructure."
    )


if __name__ == "__main__":
    main()
