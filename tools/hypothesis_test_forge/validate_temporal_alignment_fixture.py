#!/usr/bin/env python3
"""Validate MC temporal alignment fixture.

This validator checks that longitudinal MC evidence records preserve timestamp,
observation window, lag uncertainty, source boundaries, privacy state,
missingness, measurable variables, safe routes, and falsification routes before
cross-record pattern inference. It rejects temporal causality creep, diagnosis,
treatment, veterinary advice, dosage guidance, emergency triage, cure certainty,
discovery proof, private identifier retention, and missingness collapse.
"""

from __future__ import annotations

import json
import re
from datetime import datetime
from pathlib import Path
from typing import Any

FIXTURE = Path(__file__).with_name("temporal_alignment_fixture.json")

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
    "claim",
    "source_status",
    "claim_status",
    "privacy_status",
    "missingness",
    "revision_reason",
    "implementation_status",
    "testability",
    "falsification_route",
    "temporal_anchor",
    "source_boundaries",
    "measurable_variables",
    "allowed_routes",
    "blocked_promotions",
    "next_executable_action",
}

REQUIRED_TEMPORAL_FIELDS = {
    "absolute_timestamp",
    "timestamp_precision",
    "observation_window_minutes",
    "temporal_relation_class",
    "candidate_context",
    "lag_uncertainty_minutes",
}

SAFE_ROUTE_SET = {
    "longitudinal_observation",
    "research_question",
    "question_prep",
    "contradiction_ledger",
}

PROHIBITED_PATTERNS = [
    r"\bdiagnos(?:e|is|ed)\b.*\b(user|patient|animal|pet|dog|cat)\b",
    r"\btreat(?:ment)?\b.*\b(should|must|needs?|give|take|dose)\b",
    r"\b(?:give|take|administer)\b.*\b\d+\s*(?:mg|ml|mcg|iu)\b",
    r"\bemergency\b.*\b(ignore|avoid|skip|unnecessary)\b",
    r"\bcure(?:d|s)?\b.*\b(proven|guaranteed|certain)\b",
    r"\bdiscovery\b.*\b(proven|confirmed|certain)\b",
    r"\bthis proves\b",
    r"\bproves the context caused\b",
    r"\bmissing\b.*\bmeans absent\b",
    r"\bno follow-up data means\b",
    r"\b(?:full name|street address|phone number|email address)\b",
]


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


def validate_timestamp(anchor: dict[str, Any], record_id: str) -> None:
    timestamp = anchor["absolute_timestamp"]
    relation = anchor["temporal_relation_class"]

    if timestamp == "unknown":
        if relation != "unknown":
            fail(f"{record_id} has unknown timestamp but non-unknown temporal relation.")
        if anchor["lag_uncertainty_minutes"] is not None:
            fail(f"{record_id} unknown timestamp must use null lag uncertainty.")
        return

    try:
        datetime.fromisoformat(timestamp)
    except ValueError as error:
        fail(f"{record_id} has invalid ISO 8601 timestamp: {timestamp!r}; {error}")

    window = anchor["observation_window_minutes"]
    if not isinstance(window, int) or window <= 0:
        fail(f"{record_id} observation_window_minutes must be a positive integer for known timestamps.")

    lag = anchor["lag_uncertainty_minutes"]
    if not isinstance(lag, int) or lag < 0:
        fail(f"{record_id} lag_uncertainty_minutes must be a non-negative integer for known timestamps.")


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
        fail("Every negative control must contain a detectable unsafe temporal inference pattern.")


def validate_record(record: dict[str, Any], thresholds: dict[str, Any]) -> dict[str, int]:
    missing = REQUIRED_RECORD_FIELDS - set(record)
    if missing:
        fail(f"{record.get('record_id', '<unknown>')} missing fields: {sorted(missing)}")

    record_id = record["record_id"]
    anchor = record["temporal_anchor"]
    temporal_missing = REQUIRED_TEMPORAL_FIELDS - set(anchor)
    if temporal_missing:
        fail(f"{record_id} temporal_anchor missing fields: {sorted(temporal_missing)}")

    if record["privacy_status"] not in {"deidentified", "no_private_identifiers_retained"}:
        fail(f"{record_id} has unsafe privacy_status: {record['privacy_status']}")

    if "missing" not in flatten(record["missingness"]).lower():
        fail(f"{record_id} missingness does not explicitly name absent information.")

    if anchor["temporal_relation_class"] not in thresholds["allowed_temporal_relation_classes"]:
        fail(f"{record_id} has invalid temporal relation class: {anchor['temporal_relation_class']}")

    validate_timestamp(anchor, record_id)

    if not str(anchor["candidate_context"]).strip():
        fail(f"{record_id} candidate_context must be explicit, even when unknown.")

    if len(record["source_boundaries"]) < thresholds["min_source_boundaries_per_record"]:
        fail(f"{record_id} has too few source boundaries.")

    if len(record["measurable_variables"]) < thresholds["min_measurable_variables_per_record"]:
        fail(f"{record_id} has too few measurable variables.")

    for variable in record["measurable_variables"]:
        validate_variable(variable, record_id)

    if len(record["blocked_promotions"]) < thresholds["min_blocked_promotions_per_record"]:
        fail(f"{record_id} has too few blocked promotions.")

    unsafe_routes = set(record["allowed_routes"]) - SAFE_ROUTE_SET
    if unsafe_routes:
        fail(f"{record_id} has unsafe allowed routes: {sorted(unsafe_routes)}")

    if not set(record["allowed_routes"]) & set(thresholds["required_safe_routes"]):
        fail(f"{record_id} does not include any required safe route.")

    if not str(record["next_executable_action"]).strip():
        fail(f"{record_id} needs a next executable action.")

    return {
        "source_boundaries": len(record["source_boundaries"]),
        "measurable_variables": len(record["measurable_variables"]),
        "blocked_promotions": len(record["blocked_promotions"]),
        "known_timestamp": int(anchor["absolute_timestamp"] != "unknown"),
        "unknown_timestamp": int(anchor["absolute_timestamp"] == "unknown"),
    }


def main() -> None:
    data = json.loads(FIXTURE.read_text(encoding="utf-8"))
    validate_metadata(data)
    validate_negative_controls(data["negative_controls"])

    thresholds = data["pass_thresholds"]
    records = data["records"]

    if len(records) < thresholds["min_record_count"]:
        fail("Fixture does not include enough temporal-alignment records.")

    metrics = [validate_record(record, thresholds) for record in records]
    summary = {
        "record_count": len(records),
        "records_with_source_boundaries": sum(
            metric["source_boundaries"] >= thresholds["min_source_boundaries_per_record"] for metric in metrics
        ),
        "records_with_measurable_variables": sum(
            metric["measurable_variables"] >= thresholds["min_measurable_variables_per_record"] for metric in metrics
        ),
        "blocked_promotion_count": sum(metric["blocked_promotions"] for metric in metrics),
        "known_timestamp_records": sum(metric["known_timestamp"] for metric in metrics),
        "unknown_timestamp_records": sum(metric["unknown_timestamp"] for metric in metrics),
        "negative_controls_rejected": len(data["negative_controls"]),
    }

    if summary["records_with_source_boundaries"] != len(records):
        fail("Not all records expose source boundaries.")
    if summary["records_with_measurable_variables"] != len(records):
        fail("Not all records expose measurable variables.")
    if summary["known_timestamp_records"] == 0 or summary["unknown_timestamp_records"] == 0:
        fail("Fixture must include both known and unknown timestamp cases.")

    print(json.dumps({"status": "PASS", "metrics": summary}, indent=2))


if __name__ == "__main__":
    main()
