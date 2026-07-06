#!/usr/bin/env python3
"""Regression tests for the Mechanism Grounding Gate."""

from __future__ import annotations

import json
from pathlib import Path

from validate_mechanism_grounding_packet import validate

ROOT = Path(__file__).resolve().parent


def load_fixture(name: str) -> dict:
    return json.loads((ROOT / "fixtures" / name).read_text(encoding="utf-8"))


def test_valid_packet_passes() -> None:
    packet = load_fixture("valid_packet.json")
    errors = validate(packet)
    assert errors == [], errors


def test_invalid_advice_like_packet_fails() -> None:
    packet = load_fixture("invalid_advice_like_packet.json")
    errors = validate(packet)
    assert errors, "invalid packet unexpectedly passed"
    joined = "\n".join(errors)
    assert "advice-like" in joined or "too short" in joined or "mechanistic" in joined


def test_missing_required_field_fails() -> None:
    packet = load_fixture("valid_packet.json")
    del packet["falsification_route"]
    errors = validate(packet)
    assert "missing required field: falsification_route" in errors


if __name__ == "__main__":
    test_valid_packet_passes()
    test_invalid_advice_like_packet_fails()
    test_missing_required_field_fails()
    print("all mechanism grounding gate tests passed")
