#!/usr/bin/env python3
"""
Validate the MC disagreement adjudication fixture.

This validator is research-organization infrastructure only. It does not provide
medical advice, veterinary advice, diagnosis, treatment, dosage guidance, or
emergency triage.
"""

from __future__ import annotations

import json
import re
from pathlib import Path
from typing import Any

FIXTURE_PATH = Path(__file__).with_name("disagreement_adjudication_fixture.json")

REQUIRED_TOP_LEVEL_FIELDS = {
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

REQUIRED_RECORD_FIELDS = REQUIRED_TOP_LEVEL_FIELDS | {
    "record_id",
    "packet_summary",
    "human_label",
    "ai_label",
    "agreement_state",
    "disagreement_type",
    "adjudication_route",
    "allowed_routes",
    "blocked_promotions",
}

UNSAFE_PATTERNS = [
    r"\bdiagnos(?:e|is|ed)\b",
    r"\btreat(?:ment|s|ed|ing)?\b",
    r"\bdos(?:e|age)\b",
    r"\bemergency\b",
    r"\btriage\b",
    r"\bveterinary advice\b",
    r"\bcure(?:d|s)?\b",
    r"\bproves?\b",
    r"\bconfirmed\b",
    r"\btherefore\b.*\buse\b",
    r"\bmust be caused by\b",
    r"\bis caused by\b",
]

MISSINGNESS_COLLAPSE_PATTERNS = [
    r"missing data proves",
    r"absence of evidence proves",
    r"not recorded means absent",
    r"unknown means no risk",
]

SAFE_REVIEW_ROUTES = {
    "hold_for_review",
    "contradiction_ledger",
    "research_question",
    "low_strength_private_memory",
}

UNSAFE_ROUTES = {
    "public_proof",
    "clinical_or_veterinary_action",
    "diagnosis_or_treatment",
    "discovery_claim",
    "causal_claim",
}


def load_fixture() -> dict[str, Any]:
    with FIXTURE_PATH.open("r", encoding="utf-8") as f:
        return json.load(f)


def as_text(value: Any) -> str:
    return json.dumps(value, ensure_ascii=False, sort_keys=True).lower()


def find_matches(patterns: list[str], value: Any) -> list[str]:
    text = as_text(value)
    return [pattern for pattern in patterns if re.search(pattern, text)]


def require_fields(container: dict[str, Any], required: set[str], label: str) -> list[str]:
    missing = sorted(required - set(container))
    return [f"{label} missing required field: {field}" for field in missing]


def validate_missingness(record: dict[str, Any]) -> list[str]:
    errors: list[str] = []
    missingness = record.get("missingness")
    if not isinstance(missingness, dict):
        return [f"{record.get('record_id')}: missingness must be an object"]
    for field in ["human_context_missing", "ai_context_missing", "adjudication_missing", "outcome_missing"]:
        if field not in missingness:
            errors.append(f"{record.get('record_id')}: missingness missing {field}")
    return errors


def is_expected_fail(record: dict[str, Any]) -> bool:
    return record.get("implementation_status") == "fixture_case_expected_to_fail"


def variable_names(record: dict[str, Any]) -> set[str]:
    variables = record.get("measurable_variables", [])
    names: set[str] = set()
    for variable in variables if isinstance(variables, list) else []:
        if isinstance(variable, dict) and variable.get("name"):
            names.add(str(variable["name"]))
        elif isinstance(variable, str):
            names.add(variable)
    return names


def validate_record(record: dict[str, Any]) -> tuple[list[str], list[str]]:
    """Return (hard_errors, expected_fail_reasons)."""
    rid = record.get("record_id", "<unknown>")
    hard_errors: list[str] = []
    fail_reasons: list[str] = []

    hard_errors.extend(require_fields(record, REQUIRED_RECORD_FIELDS, rid))
    hard_errors.extend(validate_missingness(record))

    human_label = str(record.get("human_label", "")).strip()
    ai_label = str(record.get("ai_label", "")).strip()
    agreement_state = str(record.get("agreement_state", "")).strip()
    disagreement_type = str(record.get("disagreement_type", "")).strip()
    adjudication_route = str(record.get("adjudication_route", "")).strip()
    allowed_routes = set(record.get("allowed_routes", []))
    blocked_promotions = set(record.get("blocked_promotions", []))
    falsification = str(record.get("falsification_route", "")).strip().lower()
    variables = variable_names(record)

    required_variables = {
        "human_label",
        "ai_label",
        "agreement_state",
        "disagreement_type",
        "confidence_delta",
        "privacy_risk_level",
    }
    missing_variables = required_variables - variables
    if missing_variables:
        fail_reasons.append(f"missing measurable variables: {sorted(missing_variables)}")

    if not human_label or not ai_label:
        fail_reasons.append("human_label and ai_label must be preserved")

    if agreement_state not in {"agreement", "disagreement", "partial_agreement"}:
        fail_reasons.append("agreement_state must be agreement, disagreement, or partial_agreement")

    labels_disagree = human_label != ai_label
    if labels_disagree and agreement_state == "agreement":
        fail_reasons.append("labels disagree but agreement_state says agreement")
    if labels_disagree and disagreement_type in {"", "none"}:
        fail_reasons.append("label disagreement requires a non-empty disagreement_type")
    if labels_disagree and adjudication_route not in SAFE_REVIEW_ROUTES:
        fail_reasons.append("label disagreement requires safe adjudication route")

    if allowed_routes & UNSAFE_ROUTES:
        fail_reasons.append(f"unsafe allowed routes present: {sorted(allowed_routes & UNSAFE_ROUTES)}")

    if not UNSAFE_ROUTES.intersection(blocked_promotions):
        fail_reasons.append("blocked_promotions must include unsafe route classes")

    if falsification in {"", "none", "n/a"}:
        fail_reasons.append("requires non-empty falsification route")

    unsafe_matches = find_matches(UNSAFE_PATTERNS, record)
    if unsafe_matches:
        fail_reasons.append(f"unsafe promotion language detected: {unsafe_matches}")

    missingness_collapse_matches = find_matches(MISSINGNESS_COLLAPSE_PATTERNS, record)
    if missingness_collapse_matches:
        fail_reasons.append(f"missingness collapse language detected: {missingness_collapse_matches}")

    if record.get("privacy_status") not in {"deidentified", "deidentified_synthetic_records_only"}:
        fail_reasons.append("privacy_status must be deidentified for passing records")

    return hard_errors, fail_reasons


def main() -> int:
    fixture = load_fixture()
    errors: list[str] = []
    errors.extend(require_fields(fixture, REQUIRED_TOP_LEVEL_FIELDS, "fixture"))

    records = fixture.get("fixture_records")
    if not isinstance(records, list) or not records:
        errors.append("fixture_records must be a non-empty list")
        records = []

    pass_count = 0
    expected_fail_count = 0

    for record in records:
        if not isinstance(record, dict):
            errors.append("each fixture record must be an object")
            continue

        hard_errors, fail_reasons = validate_record(record)
        errors.extend(hard_errors)
        expected_fail = is_expected_fail(record)

        if expected_fail:
            if fail_reasons:
                expected_fail_count += 1
            else:
                errors.append(f"{record.get('record_id')}: expected-fail case unexpectedly passed")
        else:
            if fail_reasons:
                errors.append(f"{record.get('record_id')}: unexpected failure: {', '.join(fail_reasons)}")
            else:
                pass_count += 1

    if pass_count < 1:
        errors.append("fixture must include at least one passing record")
    if expected_fail_count < 1:
        errors.append("fixture must include at least one expected failing negative control")

    if errors:
        print("FAIL disagreement adjudication fixture")
        for error in errors:
            print(f"- {error}")
        return 1

    print("PASS disagreement adjudication fixture")
    print(f"passing_records={pass_count}")
    print(f"expected_failing_controls={expected_fail_count}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
