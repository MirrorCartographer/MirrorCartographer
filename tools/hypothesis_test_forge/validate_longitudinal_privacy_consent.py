#!/usr/bin/env python3
"""Validate MC longitudinal privacy/consent fixture.

This is research-organization infrastructure only. It does not provide medical
advice, veterinary advice, diagnosis, treatment, dosage guidance, or emergency
triage.
"""

from __future__ import annotations

import json
import re
import sys
from pathlib import Path
from typing import Any

FIXTURE_PATH = Path(__file__).with_name("longitudinal_privacy_consent_fixture.json")

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
    "blocked_classes",
    "records",
}

REQUIRED_RECORD_FIELDS = {
    "record_id",
    "domain",
    "source_status",
    "claim_status",
    "privacy_status",
    "consent_scope",
    "retention_policy",
    "privacy_transforms",
    "direct_identifiers",
    "missingness",
    "measurable_variables",
    "allowed_exports",
    "blocked_exports",
    "falsification_route",
    "next_executable_action",
}

UNSAFE_TERMS = {
    "diagnosis",
    "treatment",
    "dosage_guidance",
    "emergency_triage",
    "veterinary_advice",
    "cure_certainty",
    "discovery_proof",
    "unsupported_causality",
    "private_identifier_retention",
    "missingness_as_absence",
}

EMAIL_RE = re.compile(r"[^@\s]+@[^@\s]+\.[^@\s]+")
PHONE_RE = re.compile(r"(?:\+?1[-.\s]?)?(?:\(?\d{3}\)?[-.\s]?)\d{3}[-.\s]?\d{4}")


def fail(message: str) -> None:
    raise AssertionError(message)


def contains_direct_identifier(value: Any) -> bool:
    text = json.dumps(value, sort_keys=True)
    return bool(EMAIL_RE.search(text) or PHONE_RE.search(text))


def validate_top_level(data: dict[str, Any]) -> None:
    missing = REQUIRED_TOP_LEVEL - data.keys()
    if missing:
        fail(f"Missing top-level labels: {sorted(missing)}")
    if not isinstance(data["records"], list) or not data["records"]:
        fail("Fixture must contain at least one record.")
    if not set(data["blocked_classes"]).issuperset(UNSAFE_TERMS):
        fail("blocked_classes must include all unsafe terms.")


def validate_positive_record(record: dict[str, Any]) -> None:
    missing = REQUIRED_RECORD_FIELDS - record.keys()
    if missing:
        fail(f"{record.get('record_id', '<unknown>')} missing fields: {sorted(missing)}")

    if record["direct_identifiers"]:
        fail(f"{record['record_id']} retained direct identifiers.")
    if contains_direct_identifier(record):
        fail(f"{record['record_id']} contains identifier-like text.")
    if record["consent_scope"] in {"public_export", "unbounded", "missing"}:
        fail(f"{record['record_id']} has unsafe consent scope.")
    if record["retention_policy"] in {"missing", "forever", "unbounded"}:
        fail(f"{record['record_id']} has unsafe retention policy.")
    if len(record["privacy_transforms"]) < 2:
        fail(f"{record['record_id']} needs at least two privacy transforms.")
    if len(record["measurable_variables"]) < 2:
        fail(f"{record['record_id']} needs at least two measurable variables.")
    if not record["missingness"].get("items"):
        fail(f"{record['record_id']} must preserve explicit missingness items.")
    if record["missingness"].get("missingness_as_absence_allowed") is not False:
        fail(f"{record['record_id']} permits missingness-as-absence collapse.")
    if "public_raw_record" in record["allowed_exports"]:
        fail(f"{record['record_id']} allows public raw record export.")
    if not record["blocked_exports"]:
        fail(f"{record['record_id']} must block at least one unsafe export route.")


def validate_negative_control(record: dict[str, Any]) -> None:
    failures = []
    if record.get("direct_identifiers"):
        failures.append("direct identifiers present")
    if contains_direct_identifier(record):
        failures.append("identifier-like text present")
    if record.get("retention_policy") in {"missing", "forever", "unbounded"}:
        failures.append("retention policy unsafe")
    if not record.get("measurable_variables"):
        failures.append("no measurable variables")
    if record.get("missingness", {}).get("missingness_as_absence_allowed") is True:
        failures.append("missingness-as-absence allowed")
    if "public_raw_record" in record.get("allowed_exports", []):
        failures.append("public raw record allowed")
    if not failures:
        fail("Negative control did not trigger expected privacy/measurement failures.")


def main() -> int:
    data = json.loads(FIXTURE_PATH.read_text(encoding="utf-8"))
    validate_top_level(data)

    positive_count = 0
    negative_count = 0
    for record in data["records"]:
        if "negative_control" in record.get("record_id", ""):
            validate_negative_control(record)
            negative_count += 1
        else:
            validate_positive_record(record)
            positive_count += 1

    if positive_count < 2:
        fail("Expected at least two positive records.")
    if negative_count < 1:
        fail("Expected at least one negative control.")

    print(
        "PASS longitudinal privacy consent fixture: "
        f"{positive_count} positive records valid; {negative_count} negative control rejected as intended."
    )
    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except AssertionError as exc:
        print(f"FAIL longitudinal privacy consent fixture: {exc}", file=sys.stderr)
        raise SystemExit(1)
