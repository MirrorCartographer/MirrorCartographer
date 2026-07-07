#!/usr/bin/env python3
"""Validate MC animal question-prep boundary fixture.

This validator checks that animal-care evidence-map records preserve observation,
interpretation boundary, species/context metadata, source status, privacy state,
missingness, measurable variables, professional-review questions, blocked
promotions, safe routes, falsification routes, and next executable actions. It
rejects diagnosis, treatment, dosage guidance, emergency triage, veterinary
advice, unsupported causality, private identifier retention, and missingness
collapse.
"""

from __future__ import annotations

import json
import re
from pathlib import Path
from typing import Any

FIXTURE = Path(__file__).with_name("animal_question_prep_boundary_fixture.json")

REQUIRED_TOP_LEVEL = {
    "artifact_type",
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
    "pass_thresholds",
    "records",
    "negative_controls",
}

REQUIRED_RECORD_FIELDS = {
    "record_id",
    "domain",
    "species_context",
    "observation",
    "interpretation_boundary",
    "source_status",
    "claim_status",
    "privacy_status",
    "missingness",
    "revision_reason",
    "implementation_status",
    "testability",
    "falsification_route",
    "measurable_variables",
    "professional_review_questions",
    "allowed_routes",
    "blocked_promotions",
    "next_executable_action",
}

PROHIBITED_PATTERNS = [
    r"\bdiagnos(?:e|is|ed)\b.*\b(dog|cat|pet|animal)\b",
    r"\b(?:give|take|administer)\b.*\b\d+\s*(?:mg|ml|mcg|iu)\b",
    r"\b(?:treatment|treat)\b.*\b(?:should|must|needs?|stop|start|continue)\b",
    r"\b(?:medication|medicine|drop|pill)\b.*\b(?:should|must|needs?|stop|start|continue)\b",
    r"\bemergency\b.*\b(?:ignore|avoid|skip|unnecessary|cannot happen)\b",
    r"\bmissing\b.*\bmeans\b.*\b(absent|safe|normal|fine)\b",
    r"\bthis proves\b",
    r"\bproves\b.*\bcaused\b",
    r"\bcure(?:d|s)?\b.*\b(?:proven|guaranteed|certain)\b",
    r"\b(?:full name|street address|phone number|email address)\b",
]

SAFE_ROUTE_SET = {
    "vet_question_prep",
    "longitudinal_observation",
    "research_organization",
    "contradiction_ledger",
}


class ValidationError(AssertionError):
    pass


def fail(message: str) -> None:
    raise ValidationError(message)


def flatten(value: Any) -> str:
    if isinstance(value, dict):
        return "\n".join(f"{key}: {flatten(item)}" for key, item in value.items())
    if isinstance(value, list):
        return "\n".join(flatten(item) for item in value)
    return str(value)


def unsafe_patterns_found(text: str) -> list[str]:
    return [
        pattern
        for pattern in PROHIBITED_PATTERNS
        if re.search(pattern, text, flags=re.IGNORECASE | re.DOTALL)
    ]


def validate_variable(variable: dict[str, Any], context: str) -> None:
    for field in ("name", "unit", "measurement_context"):
        if field not in variable or not str(variable[field]).strip():
            fail(f"{context} variable missing {field}: {variable}")


def validate_metadata(data: dict[str, Any]) -> None:
    missing = REQUIRED_TOP_LEVEL - set(data)
    if missing:
        fail(f"Missing top-level fields: {sorted(missing)}")

    if data["privacy_status"] != "no_private_identifiers_retained":
        fail("Top-level privacy_status must state no private identifiers retained.")

    if "missing" not in flatten(data["missingness"]).lower():
        fail("Top-level missingness must explicitly describe missing information.")

    if "fail" not in flatten(data["falsification_route"]).lower():
        fail("Top-level falsification_route must describe how the claim can fail.")

    for variable in data["measurable_variables"]:
        validate_variable(variable, "top-level")

    safe_fixture_text = flatten({key: value for key, value in data.items() if key != "negative_controls"})
    found = unsafe_patterns_found(safe_fixture_text)
    if found:
        fail(f"Unsafe promotion/private leakage pattern found outside negative controls: {found}")


def validate_negative_controls(negative_controls: list[dict[str, Any]]) -> None:
    if not negative_controls:
        fail("Negative controls are required.")

    rejected = 0
    for control in negative_controls:
        if control.get("expected_result") != "reject":
            fail(f"Negative control {control.get('record_id')} must expect rejection.")
        if unsafe_patterns_found(control.get("unsafe_text", "")):
            rejected += 1

    if rejected != len(negative_controls):
        fail("Every negative control must contain a detectable unsafe animal-care pattern.")


def validate_record(record: dict[str, Any], thresholds: dict[str, Any]) -> dict[str, int]:
    missing = REQUIRED_RECORD_FIELDS - set(record)
    if missing:
        fail(f"{record.get('record_id', '<unknown>')} missing fields: {sorted(missing)}")

    record_id = record["record_id"]

    if record["domain"] not in thresholds["allowed_domains"]:
        fail(f"{record_id} has unsupported domain: {record['domain']}")

    if record["privacy_status"] not in {"deidentified", "no_private_identifiers_retained"}:
        fail(f"{record_id} has unsafe privacy_status: {record['privacy_status']}")

    if "missing" not in flatten(record["missingness"]).lower():
        fail(f"{record_id} missingness does not explicitly name absent information.")

    if len(record["measurable_variables"]) < thresholds["min_measurable_variables_per_record"]:
        fail(f"{record_id} has too few measurable variables.")
    for variable in record["measurable_variables"]:
        validate_variable(variable, record_id)

    if len(record["professional_review_questions"]) < thresholds["min_vet_questions_per_record"]:
        fail(f"{record_id} lacks professional-review question prep.")

    if len(record["blocked_promotions"]) < thresholds["min_blocked_promotions_per_record"]:
        fail(f"{record_id} has too few blocked promotions.")

    unsafe_routes = set(record["allowed_routes"]) - SAFE_ROUTE_SET
    if unsafe_routes:
        fail(f"{record_id} has unsafe allowed routes: {sorted(unsafe_routes)}")

    if not set(record["allowed_routes"]) <= set(thresholds["allowed_routes"]):
        fail(f"{record_id} includes route outside fixture thresholds.")

    if record["observation"].strip() == record["interpretation_boundary"].strip():
        fail(f"{record_id} collapses observation and interpretation boundary.")

    if "not" not in record["interpretation_boundary"].lower():
        fail(f"{record_id} interpretation boundary must explicitly block overclaiming.")

    if "fail" not in record["falsification_route"].lower():
        fail(f"{record_id} falsification route must describe failure condition.")

    if not str(record["next_executable_action"]).strip():
        fail(f"{record_id} needs a next executable action.")

    return {
        "measurable_variables": len(record["measurable_variables"]),
        "professional_review_questions": len(record["professional_review_questions"]),
        "blocked_promotions": len(record["blocked_promotions"]),
    }


def main() -> None:
    data = json.loads(FIXTURE.read_text(encoding="utf-8"))
    validate_metadata(data)
    validate_negative_controls(data["negative_controls"])

    thresholds = data["pass_thresholds"]
    records = data["records"]
    if len(records) < thresholds["min_record_count"]:
        fail("Fixture does not include enough animal question-prep records.")

    metrics = [validate_record(record, thresholds) for record in records]
    summary = {
        "record_count": len(records),
        "records_with_measurable_variables": sum(
            metric["measurable_variables"] >= thresholds["min_measurable_variables_per_record"] for metric in metrics
        ),
        "records_with_professional_review_questions": sum(
            metric["professional_review_questions"] >= thresholds["min_vet_questions_per_record"] for metric in metrics
        ),
        "blocked_promotion_count": sum(metric["blocked_promotions"] for metric in metrics),
        "negative_controls_rejected": len(data["negative_controls"]),
    }

    if summary["records_with_measurable_variables"] != len(records):
        fail("Not all records expose measurable variables.")
    if summary["records_with_professional_review_questions"] != len(records):
        fail("Not all records include professional-review questions.")

    print(json.dumps({"status": "PASS", "metrics": summary}, indent=2))


if __name__ == "__main__":
    main()
