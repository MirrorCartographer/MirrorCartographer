#!/usr/bin/env python3
"""Regression tests for context-level claim gate."""

from __future__ import annotations

import json
import tempfile
from pathlib import Path

from validate_context_level_claim_packet import validate_packet

ROOT = Path(__file__).parent
VALID = ROOT / "fixtures" / "valid_context_level_claim_packet.json"
INVALID = ROOT / "fixtures" / "invalid_cross_level_claim_packet.json"


def test_valid_packet_passes() -> None:
    packet = validate_packet(VALID)
    assert packet["packet_id"] == "synthetic-context-level-alpha"
    assert packet["context_level"] == packet["claim_level"] == "cohort"


def test_invalid_cross_level_claim_fails() -> None:
    try:
        validate_packet(INVALID)
    except ValueError as exc:
        assert "Cross-level mismatch" in str(exc)
    else:  # pragma: no cover
        raise AssertionError("Expected cross-level mismatch failure")


def test_direct_identifier_fails() -> None:
    packet = json.loads(VALID.read_text(encoding="utf-8"))
    packet["claim_text"] += " Contact test@example.com."
    with tempfile.TemporaryDirectory() as directory:
        path = Path(directory) / "identifier.json"
        path.write_text(json.dumps(packet), encoding="utf-8")
        try:
            validate_packet(path)
        except ValueError as exc:
            assert "direct identifier" in str(exc)
        else:  # pragma: no cover
            raise AssertionError("Expected direct identifier failure")


def test_medical_or_veterinary_advice_fails() -> None:
    packet = json.loads(VALID.read_text(encoding="utf-8"))
    packet["claim_status"] = "medical_or_veterinary_advice"
    with tempfile.TemporaryDirectory() as directory:
        path = Path(directory) / "advice.json"
        path.write_text(json.dumps(packet), encoding="utf-8")
        try:
            validate_packet(path)
        except ValueError as exc:
            assert "advice is blocked" in str(exc)
        else:  # pragma: no cover
            raise AssertionError("Expected advice-block failure")


def test_cross_level_with_bridge_can_pass() -> None:
    packet = json.loads(VALID.read_text(encoding="utf-8"))
    packet["packet_id"] = "synthetic-context-level-bridge"
    packet["context_level"] = "assay"
    packet["claim_level"] = "organ_system"
    packet["cross_level_promotion"] = {
        "attempted": True,
        "bridge_rationale": "Assay-level signal is treated only as a candidate organ-system mechanism, not as an outcome claim.",
        "validation_required": "Independent organ-system endpoint validation is required before reusable memory promotion."
    }
    with tempfile.TemporaryDirectory() as directory:
        path = Path(directory) / "bridge.json"
        path.write_text(json.dumps(packet), encoding="utf-8")
        assert validate_packet(path)["claim_level"] == "organ_system"


def run_tests() -> None:
    test_valid_packet_passes()
    test_invalid_cross_level_claim_fails()
    test_direct_identifier_fails()
    test_medical_or_veterinary_advice_fails()
    test_cross_level_with_bridge_can_pass()


if __name__ == "__main__":
    run_tests()
    print("context_level_claim_gate tests passed")
