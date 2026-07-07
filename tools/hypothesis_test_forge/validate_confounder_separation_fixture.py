#!/usr/bin/env python3
"""
Validate the MC confounder separation fixture.

This validator is research-organization infrastructure only. It does not provide
medical advice, veterinary advice, diagnosis, treatment, dosage guidance, or
emergency triage.
"""

from __future__ import annotations

import json
import re
from pathlib import Path
from typing import Any

FIXTURE_PATH = Path(__file__).with_name("confounder_separation_fixture.json")

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
    "proposed_pattern",
    "confounders",
    "alternative_explanations",
    "discriminating_measurements",
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
    r"\bmust be caused by\b",
    r"\bis caused by\b",
]

MISSINGNESS_COLLAPSE_PATTERNS = [
    r"no contrary observations were recorded,? therefore",
    r"no contrary observations were recorded,? the pattern is confirmed",
    r"missing data proves",
    r"absence of evidence proves",
    r"not recorded means absent",
]

SAFE_NEGATIVE_ROUTES = {"blocked_packet", "research_question", "contradiction_ledger"}


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
    for field in ["unknown_confounders", "unmeasured_variables", "source_limitations", "temporal_uncertainty"]:
        if field not in missingness:
            errors.append(f"{record.get('record_id')}: missingness missing {field}")
    return errors


def is_expected_fail(record: dict[str, Any]) -> bool:
    return record.get("implementation_status") == "fixture_case_expected_to_fail"


def validate_record(record: dict[str, Any]) -> tuple[list[str], list[str]]:
    """Return (hard_errors, expected_fail_reasons)."""
    rid = record.get("record_id", "<unknown>")
    hard_errors: list[str] = []
    fail_reasons: list[str] = []

    hard_errors.extend(require_fields(record, REQUIRED_RECORD_FIELDS, rid))
    hard_errors.extend(validate_missingness(record))

    confounders = record.get("confounders", [])
    alternatives = record.get("alternative_explanations", [])
    measurements = record.get("discriminating_measurements", [])
    variables = record.get("measurable_variables", [])
    routes = set(record.get("allowed_routes", []))
    falsification = str(record.get("falsification_route", "")).strip().lower()

    if not isinstance(confounders, list) or len(confounders) < 2:
        fail_reasons.append("requires at least two plausible confounders")
    if not isinstance(alternatives, list) or len(alternatives) < 1:
        fail_reasons.append("requires at least one alternative explanation")
    if not isinstance(measurements, list) or len(measurements) < 1:
        fail_reasons.append("requires at least one discriminating measurement")
    if not isinstance(variables, list) or len(variables) < 1:
        fail_reasons.append("requires measurable variables")
    if falsification in {"", "none", "n/a"}:
        fail_reasons.append("requires non-empty falsification route")

    unsafe_matches = find_matches(UNSAFE_PATTERNS, record.get("proposed_pattern", ""))
    if unsafe_matches and not routes.issubset(SAFE_NEGATIVE_ROUTES):
        fail_reasons.append(f"unsafe promotion language outside safe negative routes: {unsafe_matches}")

    missingness_collapse_matches = find_matches(MISSINGNESS_COLLAPSE_PATTERNS, record)
    if missingness_collapse_matches:
        fail_reasons.append(f"missingness collapse language detected: {missingness_collapse_matches}")

    if "public_proof" in routes or "causal_claim" in routes:
        fail_reasons.append("unsafe allowed route present")

    for measurement in measurements if isinstance(measurements, list) else []:
        if not isinstance(measurement, dict):
            fail_reasons.append("each discriminating measurement must be an object")
            continue
        for field in ["variable", "measurement_method", "comparison"]:
            if not measurement.get(field):
                fail_reasons.append(f"measurement missing {field}")

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
        print("FAIL confounder separation fixture")
        for error in errors:
            print(f"- {error}")
        return 1

    print("PASS confounder separation fixture")
    print(f"passing_records={pass_count}")
    print(f"expected_failing_controls={expected_fail_count}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
