#!/usr/bin/env python3
"""Validate MC consent-scope packets.

This validator is intentionally dependency-light. It checks the schema-critical
constraints needed before a packet can enter longitudinal memory or research maps.
It does not provide medical or veterinary advice; it only routes research records.
"""

from __future__ import annotations

import json
import sys
from pathlib import Path
from typing import Any

ALLOWED_SOURCE_STATUS = {"synthetic", "user_stated", "measured", "literature_derived", "assistant_inferred"}
ALLOWED_CLAIM_STATUS = {"hypothesis", "test_fixture", "validation_rule", "rejected", "needs_review"}
ALLOWED_PRIVACY_STATUS = {"public_safe", "private", "deidentified", "aggregated", "blocked"}
ALLOWED_ROUTES = {"question_prep", "research_map", "synthetic_test", "private_longitudinal", "public_discovery_memory"}
BLOCKED_ROUTE_NAMES = {"diagnosis", "treatment", "veterinary_instruction", "dosage", "public_discovery_memory", "private_longitudinal", "public_export"}


def _require(condition: bool, message: str, errors: list[str]) -> None:
    if not condition:
        errors.append(message)


def validate_packet(packet: dict[str, Any]) -> list[str]:
    errors: list[str] = []

    required = [
        "packet_id", "claim", "source_status", "claim_status", "privacy_status",
        "consent_scope", "allowed_routes", "blocked_routes", "missingness",
        "revision_reason", "implementation_status", "testability", "falsification_route",
        "measurable_variables", "next_executable_action",
    ]
    for key in required:
        _require(key in packet, f"missing required field: {key}", errors)
    if errors:
        return errors

    _require(str(packet["packet_id"]).startswith("mc-consent-scope-"), "packet_id must use mc-consent-scope prefix", errors)
    _require(len(packet["claim"]) >= 20, "claim must be specific enough to test", errors)
    _require(packet["source_status"] in ALLOWED_SOURCE_STATUS, "invalid source_status", errors)
    _require(packet["claim_status"] in ALLOWED_CLAIM_STATUS, "invalid claim_status", errors)
    _require(packet["privacy_status"] in ALLOWED_PRIVACY_STATUS, "invalid privacy_status", errors)

    consent = packet["consent_scope"]
    for key in ["subject_type", "consent_basis", "allowed_use", "retention", "revocation_supported"]:
        _require(key in consent, f"missing consent_scope.{key}", errors)

    allowed_use = set(consent.get("allowed_use", []))
    allowed_routes = set(packet.get("allowed_routes", []))
    blocked_routes = set(packet.get("blocked_routes", []))

    _require(bool(allowed_use), "consent_scope.allowed_use must not be empty", errors)
    _require(allowed_routes <= ALLOWED_ROUTES, "allowed_routes contains unknown route", errors)
    _require(blocked_routes <= BLOCKED_ROUTE_NAMES, "blocked_routes contains unknown route", errors)
    _require(bool(blocked_routes), "blocked_routes must declare at least one blocked use", errors)
    _require(allowed_routes.isdisjoint(blocked_routes), "a route cannot be both allowed and blocked", errors)

    consent_basis = consent.get("consent_basis")
    retention = consent.get("retention")
    privacy_status = packet.get("privacy_status")

    if privacy_status in {"private", "blocked"}:
        _require("public_discovery_memory" not in allowed_routes, "private/blocked packets cannot enter public discovery memory", errors)
        _require("public_export" in blocked_routes or privacy_status == "blocked", "private packets must block public_export", errors)

    if retention == "longitudinal_dataset":
        _require(consent_basis == "explicit", "longitudinal_dataset retention requires explicit consent", errors)
        _require(consent.get("revocation_supported") is True, "longitudinal retention requires revocation support", errors)

    if consent_basis in {"unknown", "not_allowed"}:
        _require("private_longitudinal" not in allowed_routes, "unknown/not_allowed consent cannot enter private_longitudinal", errors)
        _require("public_discovery_memory" not in allowed_routes, "unknown/not_allowed consent cannot enter public discovery memory", errors)

    missingness = packet["missingness"]
    _require(missingness.get("absence_as_evidence") is False, "missingness cannot be treated as absence evidence", errors)
    _require(missingness.get("state") in {"complete", "partial", "unknown", "redacted", "not_collected"}, "invalid missingness.state", errors)
    _require(len(str(missingness.get("interpretation", ""))) >= 8, "missingness.interpretation required", errors)

    variables = packet.get("measurable_variables", [])
    _require(isinstance(variables, list) and len(variables) >= 3, "at least three measurable variables required", errors)
    for idx, variable in enumerate(variables):
        _require(bool(variable.get("name")), f"variable {idx} missing name", errors)
        _require(bool(variable.get("unit")), f"variable {idx} missing unit", errors)
        _require(variable.get("collection_status") in {"synthetic", "observed", "not_collected", "redacted"}, f"variable {idx} invalid collection_status", errors)

    banned_advice_terms = ["diagnose", "treat", "dose", "prescribe", "cure now", "emergency"]
    joined = json.dumps(packet, sort_keys=True).lower()
    for term in banned_advice_terms:
        _require(term not in joined, f"advice-like term blocked: {term}", errors)

    return errors


def validate_file(path: Path) -> int:
    packets = json.loads(path.read_text(encoding="utf-8"))
    if isinstance(packets, dict):
        packets = [packets]

    failures = 0
    for packet in packets:
        errors = validate_packet(packet)
        expected_invalid = "invalid" in packet.get("packet_id", "")
        if expected_invalid and not errors:
            failures += 1
            print(f"FAIL: {packet['packet_id']} was expected to be invalid but passed")
        elif not expected_invalid and errors:
            failures += 1
            print(f"FAIL: {packet['packet_id']} should pass but failed:")
            for error in errors:
                print(f"  - {error}")
        else:
            status = "rejected as expected" if expected_invalid else "passed"
            print(f"OK: {packet['packet_id']} {status}")
    return failures


def main(argv: list[str]) -> int:
    path = Path(argv[1]) if len(argv) > 1 else Path(__file__).with_name("fixtures.synthetic.json")
    return 1 if validate_file(path) else 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv))
