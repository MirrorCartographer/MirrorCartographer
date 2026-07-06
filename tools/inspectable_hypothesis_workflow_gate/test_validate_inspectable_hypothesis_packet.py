#!/usr/bin/env python3
"""Regression tests for Inspectable Hypothesis Workflow Gate."""

from __future__ import annotations

import json
from pathlib import Path

from validate_inspectable_hypothesis_packet import validate


ROOT = Path(__file__).resolve().parent
FIXTURES = ROOT / "fixtures"


def load_fixture(name: str) -> dict:
    return json.loads((FIXTURES / name).read_text(encoding="utf-8"))


def test_valid_packet_passes() -> None:
    packet = load_fixture("valid_inspectable_hypothesis_packet.json")
    errors = validate(packet)
    assert errors == []


def test_missing_privacy_route_fails() -> None:
    packet = load_fixture("invalid_missing_privacy_route.json")
    errors = validate(packet)
    assert any("privacy_leakage_route" in error for error in errors)
    assert any("human_checkpoint.required" in error for error in errors)
    assert any("decision_options" in error for error in errors)


if __name__ == "__main__":
    valid_errors = validate(load_fixture("valid_inspectable_hypothesis_packet.json"))
    invalid_errors = validate(load_fixture("invalid_missing_privacy_route.json"))

    if valid_errors:
        raise SystemExit(f"valid fixture failed: {valid_errors}")
    if not invalid_errors:
        raise SystemExit("invalid fixture unexpectedly passed")

    print("PASS")
