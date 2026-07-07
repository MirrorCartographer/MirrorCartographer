#!/usr/bin/env python3
"""Regression tests for the Prospective Evidence Update Gate validator."""

from __future__ import annotations

import json
from pathlib import Path

from validate_prospective_evidence_update_packet import validate_packet

ROOT = Path(__file__).resolve().parent
FIXTURES = ROOT / "fixtures"


def load(name: str) -> dict:
    return json.loads((FIXTURES / name).read_text())


def test_valid_packet_passes() -> None:
    errors = validate_packet(load("valid_prospective_evidence_update_packet.json"))
    assert errors == []


def test_invalid_packet_fails() -> None:
    errors = validate_packet(load("invalid_prospective_evidence_update_packet.json"))
    assert errors
    assert any("source_status" in error for error in errors)
    assert any("claim_status" in error for error in errors)
    assert any("sensitive data classes require redaction" in error for error in errors)
    assert any("evidence window dates are reversed" in error for error in errors)


def test_sensitive_claims_require_conservative_stale_behavior() -> None:
    packet = load("valid_prospective_evidence_update_packet.json")
    packet["privacy_status"]["data_class"] = "veterinary_record"
    packet["privacy_status"]["redaction_required"] = True
    packet["stale_claim_behavior"] = "retain_with_warning"
    errors = validate_packet(packet)
    assert any("sensitive updateable claims require conservative stale behavior" in error for error in errors)


if __name__ == "__main__":
    test_valid_packet_passes()
    test_invalid_packet_fails()
    test_sensitive_claims_require_conservative_stale_behavior()
    print("all prospective evidence update gate tests passed")
