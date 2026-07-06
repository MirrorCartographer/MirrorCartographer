#!/usr/bin/env python3
"""Regression tests for the exploratory hypothesis gate."""

from __future__ import annotations

import importlib.util
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent
VALIDATOR_PATH = ROOT / "validate_exploratory_packet.py"
FIXTURE_PATH = ROOT / "fixtures.synthetic.json"

spec = importlib.util.spec_from_file_location("validate_exploratory_packet", VALIDATOR_PATH)
validator = importlib.util.module_from_spec(spec)
assert spec and spec.loader
spec.loader.exec_module(validator)


def load_fixtures():
    return json.loads(FIXTURE_PATH.read_text(encoding="utf-8"))


def test_valid_packet_passes():
    fixtures = load_fixtures()
    ok, errors = validator.validate_packet(fixtures["valid_packet"])
    assert ok, errors


def test_missing_updates_fixture_fails():
    fixtures = load_fixtures()
    ok, errors = validator.validate_packet(fixtures["invalid_packet_missing_updates"])
    assert not ok
    assert any("hypothesis_updates" in error for error in errors)


def test_promote_requires_prior_nonfinal_stage():
    fixtures = load_fixtures()
    packet = dict(fixtures["valid_packet"])
    packet["hypothesis_updates"] = [
        {
            "stage": "instant",
            "claim": "This claim tries to promote without staged exploratory pressure.",
            "evidence_delta": "No earlier hold, revise, or reject stage exists.",
            "decision": "promote",
        },
        {
            "stage": "afterward",
            "claim": "This later hold cannot justify the earlier promotion.",
            "evidence_delta": "Temporal order is wrong.",
            "decision": "hold",
        },
    ]
    ok, errors = validator.validate_packet(packet)
    assert not ok
    assert any("requires earlier" in error for error in errors)


if __name__ == "__main__":
    test_valid_packet_passes()
    test_missing_updates_fixture_fails()
    test_promote_requires_prior_nonfinal_stage()
    print("PASS exploratory hypothesis gate tests")
