#!/usr/bin/env python3
"""
Validate MC promotion traceability gate fixture.

This is research-organization infrastructure only. It is not medical advice,
veterinary advice, diagnosis, treatment, dosage guidance, or emergency triage.
"""

from __future__ import annotations

import json
import re
import sys
from pathlib import Path
from typing import Any

FIXTURE_PATH = Path(__file__).with_name("promotion_traceability_gate_fixture.json")

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

REQUIRED_RECORD_FIELDS = REQUIRED_TOP_LEVEL | {
    "record_id",
    "source_observations",
    "transformation_steps",
    "promotion_decision",
}

SAFE_ROUTES = {
    "research_organization_question_prep",
    "longitudinal_observation",
    "professional_question_prep",
    "veterinarian_question_prep",
    "contradiction_ledger",
    "private_memory_with_privacy_gate",
    "blocked_pending_more_data",
}

REQUIRED_TRANSFORMATION_STEPS = {
    "observation_capture",
    "symbolic_to_operational_translation",
    "promotion_gate",
}

REQUIRED_BLOCKED_PROMOTIONS = {
    "diagnosis",
    "treatment",
    "veterinary_advice",
    "dosage_guidance",
    "emergency_triage",
    "cure_claim",
    "discovery_proof",
    "unsupported_causality",
    "private_identifier_export",
}

UNSAFE_TEXT = re.compile(
    r"\b(diagnos(?:e|is|ed)|treat(?:ment)?|dosage|dose|urgent|emergency|"
    r"veterinary advice|vet advice|cured?|healed|discovery proof|proven|"
    r"guaranteed|public_claim|safe to act)\b",
    re.IGNORECASE,
)


def fail(message: str) -> None:
    print(f"FAIL: {message}")
    sys.exit(1)


def require_fields(obj: dict[str, Any], required: set[str], where: str) -> None:
    missing = sorted(required - obj.keys())
    if missing:
        fail(f"{where} missing required fields: {missing}")


def validate_safe_record(record: dict[str, Any]) -> None:
    if not record["source_observations"]:
        fail(f"{record['record_id']} has no source observations")

    steps = {step.get("step") for step in record["transformation_steps"]}
    missing_steps = REQUIRED_TRANSFORMATION_STEPS - steps
    if missing_steps:
        fail(f"{record['record_id']} missing transformation steps: {sorted(missing_steps)}")

    decision = record["promotion_decision"]
    if decision.get("allowed_route") not in SAFE_ROUTES:
        fail(f"{record['record_id']} has unsafe allowed route: {decision.get('allowed_route')}")

    blocked = set(decision.get("blocked_promotions", []))
    missing_blocks = REQUIRED_BLOCKED_PROMOTIONS - blocked
    if missing_blocks:
        fail(f"{record['record_id']} missing blocked promotions: {sorted(missing_blocks)}")

    if not decision.get("uncertainty_statement"):
        fail(f"{record['record_id']} lacks uncertainty statement")

    if not record.get("measurable_variables"):
        fail(f"{record['record_id']} lacks measurable variables")

    if record.get("privacy_status") not in {"de_identified", "synthetic", "de_identified_synthetic"}:
        fail(f"{record['record_id']} has unsafe privacy status")


def validate_expected_fail_record(record: dict[str, Any]) -> None:
    decision = record["promotion_decision"]
    unsafe_route = decision.get("allowed_route") not in SAFE_ROUTES
    no_sources = not record.get("source_observations")
    too_few_steps = len(record.get("transformation_steps", [])) < 3
    no_blocks = not decision.get("blocked_promotions")
    unsafe_text = bool(UNSAFE_TEXT.search(json.dumps(record)))

    if not (unsafe_route or no_sources or too_few_steps or no_blocks or unsafe_text):
        fail(f"{record['record_id']} marked fail_case but did not violate any gate")


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
        if record.get("testability") == "fail_case":
            validate_expected_fail_record(record)
            expected_fail_count += 1
        else:
            validate_safe_record(record)
            pass_count += 1

    if pass_count < 1 or expected_fail_count < 1:
        fail("fixture must include at least one pass case and one expected-fail negative control")

    print(
        "PASS: promotion traceability gate preserves source-to-claim trace, blocks unsafe promotion, "
        "and keeps outputs in research/question-prep infrastructure."
    )


if __name__ == "__main__":
    main()
