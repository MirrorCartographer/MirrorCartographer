#!/usr/bin/env python3
"""Smoke tests for the MC evidence granularity gate."""

from __future__ import annotations

import copy
import importlib.util
from pathlib import Path

ROOT = Path(__file__).resolve().parent
VALIDATOR_PATH = ROOT / "validate_evidence_granularity_packets.py"

spec = importlib.util.spec_from_file_location("validator", VALIDATOR_PATH)
validator = importlib.util.module_from_spec(spec)
assert spec.loader is not None
spec.loader.exec_module(validator)


def base_packet() -> dict:
    return {
        "packet_id": "granularity-test-pass-001",
        "claim": "Atomic observation boundaries reduce false promotion in MC evidence maps.",
        "source_status": "synthetic_fixture",
        "claim_status": "research_organization",
        "privacy_status": "public_safe_synthetic",
        "missingness": {"state": "observed", "absence_interpretation_allowed": False},
        "revision_reason": "Keeps summaries separate from timestamped observations before promotion.",
        "implementation_status": "tested",
        "testability": "Direct validator unit test.",
        "falsification_route": "If ambiguous summaries pass as stable evidence, the gate fails.",
        "evidence_units": [
            {
                "unit_id": "u01",
                "unit_type": "single_observation",
                "granularity": "atomic",
                "observation": "One synthetic timestamped event.",
                "can_stand_alone": True,
                "supports_claim_scope": True,
            },
            {
                "unit_id": "u02",
                "unit_type": "repeated_observation",
                "granularity": "session",
                "observation": "One synthetic session count.",
                "can_stand_alone": True,
                "supports_claim_scope": True,
            },
        ],
        "aggregation_rule": {
            "allowed": True,
            "method": "count",
            "minimum_atomic_units": 2,
            "blocks_mixed_granularity_without_label": True,
        },
        "measurable_variables": ["atomic_unit_count", "mixed_granularity_count"],
        "next_executable_action": "Run this gate before longitudinal evidence-map storage.",
    }


def assert_valid(packet: dict) -> None:
    errors = validator.validate_packet(packet)
    assert errors == [], errors


def assert_invalid(packet: dict, expected_fragment: str) -> None:
    errors = validator.validate_packet(packet)
    assert any(expected_fragment in error for error in errors), errors


def test_accepts_atomic_public_safe_packet() -> None:
    assert_valid(base_packet())


def test_rejects_private_packet() -> None:
    packet = base_packet()
    packet["privacy_status"] = "contains_sensitive_detail"
    assert_invalid(packet, "private or sensitive")


def test_rejects_missingness_as_absence() -> None:
    packet = base_packet()
    packet["missingness"]["absence_interpretation_allowed"] = True
    assert_invalid(packet, "missingness must not be interpreted as absence")


def test_rejects_ambiguous_summary_promotion() -> None:
    packet = base_packet()
    packet["evidence_units"][0]["granularity"] = "ambiguous"
    packet["evidence_units"][0]["unit_type"] = "summary"
    packet["evidence_units"][0]["can_stand_alone"] = False
    packet["evidence_units"][0]["supports_claim_scope"] = False
    assert_invalid(packet, "ambiguous or summary units cannot use promotion-style aggregation")


def test_rejects_unblocked_mixed_granularity() -> None:
    packet = base_packet()
    packet["aggregation_rule"]["blocks_mixed_granularity_without_label"] = False
    assert_invalid(packet, "mixed granularity")


if __name__ == "__main__":
    tests = [
        test_accepts_atomic_public_safe_packet,
        test_rejects_private_packet,
        test_rejects_missingness_as_absence,
        test_rejects_ambiguous_summary_promotion,
        test_rejects_unblocked_mixed_granularity,
    ]
    for test in tests:
        test()
    print(f"passed {len(tests)} evidence granularity gate tests")
