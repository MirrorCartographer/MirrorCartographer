#!/usr/bin/env python3
"""Tests for the MC consent-scope gate."""

from __future__ import annotations

import copy
import importlib.util
from pathlib import Path

MODULE_PATH = Path(__file__).with_name("validate_consent_scope_packets.py")
spec = importlib.util.spec_from_file_location("validate_consent_scope_packets", MODULE_PATH)
validator = importlib.util.module_from_spec(spec)
assert spec.loader is not None
spec.loader.exec_module(validator)

VALID_PACKET = {
    "packet_id": "mc-consent-scope-valid-unit-test",
    "claim": "Longitudinal records should declare consent scope before storage or routing.",
    "source_status": "synthetic",
    "claim_status": "test_fixture",
    "privacy_status": "public_safe",
    "consent_scope": {
        "subject_type": "synthetic",
        "consent_basis": "synthetic_only",
        "allowed_use": ["schema_testing", "research_organization"],
        "retention": "project_memory",
        "revocation_supported": True,
    },
    "allowed_routes": ["synthetic_test", "research_map"],
    "blocked_routes": ["diagnosis", "treatment", "veterinary_instruction", "dosage", "public_export"],
    "missingness": {
        "state": "partial",
        "interpretation": "Synthetic packet does not contain private longitudinal details.",
        "absence_as_evidence": False,
    },
    "revision_reason": "Unit test for valid consent-scope routing.",
    "implementation_status": "tested",
    "testability": "Run this file directly with Python.",
    "falsification_route": "Gate fails if missing consent or missingness collapse is accepted.",
    "measurable_variables": [
        {"name": "consent_scope_present", "unit": "boolean", "collection_status": "synthetic"},
        {"name": "blocked_route_count", "unit": "count", "collection_status": "synthetic"},
        {"name": "revocation_supported", "unit": "boolean", "collection_status": "synthetic"},
    ],
    "next_executable_action": "Route this packet through the validator before storage.",
}


def assert_valid(packet: dict) -> None:
    errors = validator.validate_packet(packet)
    assert not errors, errors


def assert_invalid(packet: dict, expected_fragment: str) -> None:
    errors = validator.validate_packet(packet)
    assert errors, "packet unexpectedly passed"
    assert any(expected_fragment in error for error in errors), errors


def test_valid_packet_passes() -> None:
    assert_valid(copy.deepcopy(VALID_PACKET))


def test_longitudinal_requires_explicit_consent() -> None:
    packet = copy.deepcopy(VALID_PACKET)
    packet["consent_scope"]["retention"] = "longitudinal_dataset"
    packet["consent_scope"]["consent_basis"] = "unknown"
    packet["allowed_routes"] = ["private_longitudinal"]
    assert_invalid(packet, "longitudinal_dataset retention requires explicit consent")


def test_missingness_cannot_be_absence_evidence() -> None:
    packet = copy.deepcopy(VALID_PACKET)
    packet["missingness"]["absence_as_evidence"] = True
    assert_invalid(packet, "missingness cannot be treated as absence evidence")


def test_private_packet_blocks_public_export() -> None:
    packet = copy.deepcopy(VALID_PACKET)
    packet["privacy_status"] = "private"
    packet["blocked_routes"] = ["diagnosis", "treatment"]
    assert_invalid(packet, "private packets must block public_export")


def test_unknown_consent_cannot_enter_public_memory() -> None:
    packet = copy.deepcopy(VALID_PACKET)
    packet["consent_scope"]["consent_basis"] = "unknown"
    packet["allowed_routes"] = ["public_discovery_memory"]
    assert_invalid(packet, "unknown/not_allowed consent cannot enter public discovery memory")


def test_advice_like_terms_are_blocked() -> None:
    packet = copy.deepcopy(VALID_PACKET)
    packet["claim"] = "This packet tries to prescribe what to do instead of organizing evidence."
    assert_invalid(packet, "advice-like term blocked")


def main() -> int:
    tests = [
        test_valid_packet_passes,
        test_longitudinal_requires_explicit_consent,
        test_missingness_cannot_be_absence_evidence,
        test_private_packet_blocks_public_export,
        test_unknown_consent_cannot_enter_public_memory,
        test_advice_like_terms_are_blocked,
    ]
    for test in tests:
        test()
        print(f"OK: {test.__name__}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
