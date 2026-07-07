#!/usr/bin/env python3
"""Regression tests for the Null Evidence Capture Gate validator."""

from __future__ import annotations

import json
from pathlib import Path

from validate_null_evidence_capture_packet import validate_packet

ROOT = Path(__file__).resolve().parent


def load_fixture(name: str) -> dict:
    return json.loads((ROOT / "fixtures" / name).read_text(encoding="utf-8"))


def test_valid_fixture_passes() -> None:
    packet = load_fixture("valid_null_evidence_capture_packet.json")
    errors = validate_packet(packet)
    assert errors == [], errors


def test_invalid_fixture_fails() -> None:
    packet = load_fixture("invalid_null_evidence_capture_packet.json")
    errors = validate_packet(packet)
    assert errors, "invalid packet unexpectedly passed"
    assert any("source_status" in error for error in errors)
    assert any("null_evidence_inventory" in error for error in errors)
    assert any("blocked_inferences" in error for error in errors)


def run_tests() -> None:
    test_valid_fixture_passes()
    test_invalid_fixture_fails()
    print("null evidence capture gate tests passed")


if __name__ == "__main__":
    run_tests()
