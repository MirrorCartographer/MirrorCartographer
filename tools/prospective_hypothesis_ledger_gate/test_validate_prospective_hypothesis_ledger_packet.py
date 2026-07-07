#!/usr/bin/env python3
"""Regression tests for the Prospective Hypothesis Ledger Gate."""

from __future__ import annotations

import json
from pathlib import Path

from validate_prospective_hypothesis_ledger_packet import validate

ROOT = Path(__file__).resolve().parent


def load_fixture(name: str) -> dict:
    return json.loads((ROOT / "fixtures" / name).read_text(encoding="utf-8"))


def test_valid_packet_passes() -> None:
    validate(load_fixture("valid_packet.json"))


def test_invalid_packet_fails() -> None:
    try:
        validate(load_fixture("invalid_packet.json"))
    except ValueError as exc:
        assert "prospective validation" in str(exc) or "blocked_inferences" in str(exc)
    else:  # pragma: no cover
        raise AssertionError("invalid packet unexpectedly passed")


if __name__ == "__main__":
    test_valid_packet_passes()
    test_invalid_packet_fails()
    print("prospective hypothesis ledger gate tests passed")
