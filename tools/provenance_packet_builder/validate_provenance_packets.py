#!/usr/bin/env python3
"""Validate Mirror Cartographer provenance packets.

This CLI intentionally uses only the Python standard library so it can run in
minimal environments. It validates the schema-critical contract plus MC-specific
admission rules that are not expressible in plain JSON Schema without an
external validator dependency.

Usage:
    python tools/provenance_packet_builder/validate_provenance_packets.py \
        tools/provenance_packet_builder/fixtures.synthetic.json
"""

from __future__ import annotations

import json
import re
import sys
from datetime import datetime
from pathlib import Path
from typing import Any

ALLOWED_DOMAINS = {
    "cure_discovery_infrastructure",
    "medical_ai_evidence_organization",
    "scientific_reasoning",
    "nervous_system_cognition_model",
    "animal_care_evidence_organization",
    "human_ai_sensemaking",
    "privacy_preserving_longitudinal_memory",
    "symbolic_to_operational_translation",
    "collaboration_readiness",
}

ALLOWED_SOURCE_STATUS = {
    "synthetic",
    "primary",
    "secondary",
    "preprint",
    "institutional",
    "unknown",
}

ALLOWED_CLAIM_STATUS = {
    "hypothesis",
    "testable",
    "supported",
    "contradicted",
    "inconclusive",
    "rejected",
}

ALLOWED_PRIVACY_STATUS = {
    "public_safe",
    "deidentified",
    "restricted",
    "private_reject",
}

ALLOWED_IMPLEMENTATION_STATUS = {
    "planned",
    "implemented",
    "validated",
    "blocked",
}

ALLOWED_TESTABILITY = {
    "not_testable",
    "semi_executable",
    "executable",
}

ALLOWED_ADVICE_BOUNDARY = {
    "research_organization_only",
    "engineering_only",
    "collaboration_only",
}

ALLOWED_MEASUREMENT_TYPE = {
    "binary",
    "count",
    "ordinal",
    "continuous",
    "categorical",
    "text_score",
}

PACKET_ID_RE = re.compile(r"^mc-prov-[a-z0-9][a-z0-9-]{6,80}$")

REQUIRED_FIELDS = [
    "schema_version",
    "packet_id",
    "created_at_utc",
    "claim_text",
    "domain",
    "source_status",
    "claim_status",
    "privacy_status",
    "missingness",
    "revision_reason",
    "implementation_status",
    "testability",
    "evidence_boundaries",
    "measurable_variables",
    "falsification_route",
    "next_executable_action",
]

PROHIBITED_ADVICE_TERMS = {
    "diagnose",
    "diagnosis",
    "treat",
    "treatment",
    "dose",
    "dosage",
    "prescribe",
    "cure this patient",
    "cure this animal",
    "veterinary recommendation",
    "medical recommendation",
}


def _is_non_empty_string(value: Any, min_length: int = 1) -> bool:
    return isinstance(value, str) and len(value.strip()) >= min_length


def _is_iso_datetime(value: str) -> bool:
    try:
        datetime.fromisoformat(value.replace("Z", "+00:00"))
        return True
    except ValueError:
        return False


def validate_packet(packet: dict[str, Any]) -> list[str]:
    errors: list[str] = []

    for field in REQUIRED_FIELDS:
        if field not in packet:
            errors.append(f"missing required field: {field}")

    if errors:
        return errors

    if packet["schema_version"] != "1.0.0":
        errors.append("schema_version must be 1.0.0")

    if not isinstance(packet["packet_id"], str) or not PACKET_ID_RE.match(packet["packet_id"]):
        errors.append("packet_id must match mc-prov-* lowercase identifier pattern")

    if not isinstance(packet["created_at_utc"], str) or not _is_iso_datetime(packet["created_at_utc"]):
        errors.append("created_at_utc must be an ISO-8601 datetime")

    if not _is_non_empty_string(packet["claim_text"], 20):
        errors.append("claim_text must be at least 20 characters")

    if packet["domain"] not in ALLOWED_DOMAINS:
        errors.append(f"domain is not allowed: {packet['domain']!r}")

    if packet["source_status"] not in ALLOWED_SOURCE_STATUS:
        errors.append("source_status is not allowed")

    if packet["claim_status"] not in ALLOWED_CLAIM_STATUS:
        errors.append("claim_status is not allowed")

    if packet["privacy_status"] not in ALLOWED_PRIVACY_STATUS:
        errors.append("privacy_status is not allowed")

    if packet["implementation_status"] not in ALLOWED_IMPLEMENTATION_STATUS:
        errors.append("implementation_status is not allowed")

    if packet["testability"] not in ALLOWED_TESTABILITY:
        errors.append("testability is not allowed")

    if not isinstance(packet["missingness"], list) or not packet["missingness"]:
        errors.append("missingness must contain at least one item")
    elif any(not _is_non_empty_string(item, 3) for item in packet["missingness"]):
        errors.append("each missingness item must be a non-empty string")

    if not _is_non_empty_string(packet["revision_reason"], 10):
        errors.append("revision_reason must be explicit")

    boundaries = packet["evidence_boundaries"]
    if not isinstance(boundaries, dict):
        errors.append("evidence_boundaries must be an object")
    else:
        allowed_uses = boundaries.get("allowed_uses")
        blocked_uses = boundaries.get("blocked_uses")
        advice_boundary = boundaries.get("advice_boundary")
        if not isinstance(allowed_uses, list) or not allowed_uses:
            errors.append("evidence_boundaries.allowed_uses must be non-empty")
        if not isinstance(blocked_uses, list) or not blocked_uses:
            errors.append("evidence_boundaries.blocked_uses must be non-empty")
        if advice_boundary not in ALLOWED_ADVICE_BOUNDARY:
            errors.append("evidence_boundaries.advice_boundary is not allowed")

    variables = packet["measurable_variables"]
    if not isinstance(variables, list) or not variables:
        errors.append("measurable_variables must contain at least one variable")
    else:
        for index, variable in enumerate(variables):
            if not isinstance(variable, dict):
                errors.append(f"measurable_variables[{index}] must be an object")
                continue
            if not _is_non_empty_string(variable.get("name"), 2):
                errors.append(f"measurable_variables[{index}].name is required")
            if not _is_non_empty_string(variable.get("operational_definition"), 10):
                errors.append(f"measurable_variables[{index}].operational_definition is required")
            if variable.get("measurement_type") not in ALLOWED_MEASUREMENT_TYPE:
                errors.append(f"measurable_variables[{index}].measurement_type is not allowed")

    if not _is_non_empty_string(packet["falsification_route"], 20):
        errors.append("falsification_route must be at least 20 characters")

    if not _is_non_empty_string(packet["next_executable_action"], 10):
        errors.append("next_executable_action must be explicit")

    # MC-specific admission rules.
    if packet["privacy_status"] == "private_reject":
        errors.append("private_reject packets cannot be admitted to discovery memory")

    if packet["claim_status"] in {"supported", "testable"} and packet["testability"] == "not_testable":
        errors.append("supported/testable claims cannot have testability=not_testable")

    searchable_text = json.dumps(packet, sort_keys=True).lower()
    leaked_terms = sorted(term for term in PROHIBITED_ADVICE_TERMS if term in searchable_text)
    if leaked_terms:
        errors.append("packet contains prohibited advice-like terms: " + ", ".join(leaked_terms))

    return errors


def _load_fixture_file(path: Path) -> list[dict[str, Any]]:
    data = json.loads(path.read_text(encoding="utf-8"))
    if isinstance(data, dict):
        return [{"name": "single_packet", "expect_valid": True, "packet": data}]
    if isinstance(data, list):
        return data
    raise ValueError("fixture file must contain either a packet object or a list of fixture cases")


def main(argv: list[str]) -> int:
    if len(argv) != 2:
        print("usage: validate_provenance_packets.py <packet-or-fixtures.json>", file=sys.stderr)
        return 2

    path = Path(argv[1])
    fixtures = _load_fixture_file(path)
    failed = 0

    for fixture in fixtures:
        name = fixture.get("name", "unnamed")
        expect_valid = bool(fixture.get("expect_valid", True))
        packet = fixture.get("packet", fixture)
        errors = validate_packet(packet)
        actual_valid = not errors

        if actual_valid != expect_valid:
            failed += 1
            print(f"FAIL {name}: expected valid={expect_valid}, got valid={actual_valid}")
            for error in errors:
                print(f"  - {error}")
        else:
            print(f"PASS {name}")

    return 1 if failed else 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv))
