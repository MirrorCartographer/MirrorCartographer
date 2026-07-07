#!/usr/bin/env python3
"""
Validate MC counterfactual prediction gate fixture.

This is research-organization infrastructure only. It is not medical advice,
veterinary advice, diagnosis, treatment, dosage guidance, or emergency triage.
"""

from __future__ import annotations

import json
import re
import sys
from pathlib import Path
from typing import Any

FIXTURE_PATH = Path(__file__).with_name("counterfactual_prediction_gate_fixture.json")

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
    "source_boundaries",
    "proposed_pattern",
    "counterfactual_predictions",
    "null_result_criteria",
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

REQUIRED_BLOCKED_ROUTES = {
    "diagnosis",
    "treatment",
    "veterinary_advice",
    "dosage_guidance",
    "emergency_triage",
    "cure_claim",
    "discovery_proof",
    "unsupported_causality",
    "private_identifier_export",
    "public_certainty_claim",
}

UNSAFE_TEXT = re.compile(
    r"\b(diagnos(?:e|is|ed)|treat(?:ment)?|dosage|dose|urgent|emergency|"
    r"veterinary advice|vet advice|cured?|healed|discovery proof|proven|"
    r"guaranteed|publish as fact|public_certainty_claim|safe to act)\b",
    re.IGNORECASE,
)

BAD_MISSINGNESS = {"ignored", "none", "absent", "resolved", "complete"}


def fail(message: str) -> None:
    print(f"FAIL: {message}")
    sys.exit(1)


def require_fields(obj: dict[str, Any], required: set[str], where: str) -> None:
    missing = sorted(required - obj.keys())
    if missing:
        fail(f"{where} missing required fields: {missing}")


def validate_safe_record(record: dict[str, Any]) -> None:
    record_id = record["record_id"]

    if record.get("privacy_status") not in {"de_identified", "synthetic", "de_identified_synthetic"}:
        fail(f"{record_id} has unsafe privacy status")

    if str(record.get("missingness", "")).strip().lower() in BAD_MISSINGNESS:
        fail(f"{record_id} collapses missingness")

    if len(record.get("source_boundaries", [])) < 3:
        fail(f"{record_id} needs at least three source boundaries")

    if len(record.get("measurable_variables", [])) < 2:
        fail(f"{record_id} needs at least two measurable variables")

    predictions = record.get("counterfactual_predictions", [])
    if len(predictions) < 2:
        fail(f"{record_id} needs both wrong-pattern and right-pattern counterfactual predictions")

    joined_predictions = json.dumps(predictions).lower()
    if "if_pattern_is_wrong" not in joined_predictions or "if_pattern_is_right" not in joined_predictions:
        fail(f"{record_id} lacks explicit wrong/right counterfactual branches")

    if len(record.get("null_result_criteria", [])) < 2:
        fail(f"{record_id} needs null-result criteria")

    decision = record["promotion_decision"]
    if decision.get("allowed_route") not in SAFE_ROUTES:
        fail(f"{record_id} has unsafe allowed route: {decision.get('allowed_route')}")

    blocked = set(decision.get("blocked_routes", []))
    missing_blocks = REQUIRED_BLOCKED_ROUTES - blocked
    if missing_blocks:
        fail(f"{record_id} missing blocked routes: {sorted(missing_blocks)}")

    if not decision.get("uncertainty_statement"):
        fail(f"{record_id} lacks uncertainty statement")

    if UNSAFE_TEXT.search(record.get("proposed_pattern", "")):
        fail(f"{record_id} contains unsafe promotion wording in proposed pattern")

    next_action = str(record.get("next_executable_action", "")).lower()
    if not next_action or "publish" in next_action or "fact" in next_action:
        fail(f"{record_id} has unsafe or missing next executable action")


def validate_expected_fail_record(record: dict[str, Any]) -> None:
    decision = record.get("promotion_decision", {})
    unsafe_route = decision.get("allowed_route") not in SAFE_ROUTES
    missing_predictions = len(record.get("counterfactual_predictions", [])) < 2
    missing_nulls = len(record.get("null_result_criteria", [])) < 2
    missing_boundaries = len(record.get("source_boundaries", [])) < 3
    missing_variables = len(record.get("measurable_variables", [])) < 2
    missing_blocks = not decision.get("blocked_routes")
    bad_missingness = str(record.get("missingness", "")).strip().lower() in BAD_MISSINGNESS
    unsafe_text = bool(UNSAFE_TEXT.search(json.dumps(record)))

    if not any([
        unsafe_route,
        missing_predictions,
        missing_nulls,
        missing_boundaries,
        missing_variables,
        missing_blocks,
        bad_missingness,
        unsafe_text,
    ]):
        fail(f"{record.get('record_id', 'record')} marked fail_case but did not violate any gate")


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
        "PASS: counterfactual prediction gate requires source boundaries, measurable variables, "
        "wrong/right predictions, null-result criteria, privacy gates, and safe routing."
    )


if __name__ == "__main__":
    main()
