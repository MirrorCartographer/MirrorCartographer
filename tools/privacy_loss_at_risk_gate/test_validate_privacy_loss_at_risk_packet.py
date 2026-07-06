#!/usr/bin/env python3
"""Regression tests for the Privacy Loss at Risk Gate validator."""

import json
from pathlib import Path

from validate_privacy_loss_at_risk_packet import validate

ROOT = Path(__file__).resolve().parent


def load_fixture(name):
    return json.loads((ROOT / "fixtures" / name).read_text())


def test_valid_packet_passes():
    packet = load_fixture("valid_privacy_loss_at_risk_packet.json")
    assert validate(packet) == []


def test_invalid_packet_fails():
    packet = load_fixture("invalid_privacy_loss_at_risk_packet.json")
    errors = validate(packet)
    assert errors
    assert any("high contextual leakage" in error for error in errors)
    assert any("individual-level context" in error for error in errors)


def test_blocked_packet_cannot_allow_memory_write():
    packet = load_fixture("valid_privacy_loss_at_risk_packet.json")
    packet["risk_model"]["threshold_action"] = "block"
    packet["decision"]["memory_write_allowed"] = True
    errors = validate(packet)
    assert any("blocked/local_only" in error for error in errors)


if __name__ == "__main__":
    for fn in [test_valid_packet_passes, test_invalid_packet_fails, test_blocked_packet_cannot_allow_memory_write]:
        fn()
    print("all privacy loss at risk gate tests passed")
