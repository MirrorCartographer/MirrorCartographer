#!/usr/bin/env python3
"""Regression tests for symbolic operational packet validation."""

from __future__ import annotations

import importlib.util
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent
VALIDATOR_PATH = ROOT / "validate_symbolic_operational_packets.py"
FIXTURES_PATH = ROOT / "fixtures.synthetic.json"

spec = importlib.util.spec_from_file_location("validator", VALIDATOR_PATH)
validator = importlib.util.module_from_spec(spec)
assert spec.loader is not None
spec.loader.exec_module(validator)


def test_fixture_expectations() -> None:
    packets = json.loads(FIXTURES_PATH.read_text())
    assert packets, "fixtures must not be empty"
    for packet in packets:
        valid, errors = validator.validate_packet(packet)
        assert valid == packet["expected_valid"], f"{packet['packet_id']} errors={errors}"


def test_private_exact_date_is_blocked() -> None:
    packet = json.loads(FIXTURES_PATH.read_text())[0]
    packet = dict(packet)
    packet["symbolic_observation"] = "Synthetic note includes exact date 2026-07-06."
    valid, errors = validator.validate_packet(packet)
    assert not valid
    assert any("private" in error for error in errors)


def test_two_measurable_variables_required() -> None:
    packet = json.loads(FIXTURES_PATH.read_text())[0]
    packet = dict(packet)
    packet["candidate_variables"] = [
        {"name": "transition_count", "measurement_type": "count", "unit": "events"}
    ]
    valid, errors = validator.validate_packet(packet)
    assert not valid
    assert any("at least two" in error for error in errors)


def run() -> None:
    test_fixture_expectations()
    test_private_exact_date_is_blocked()
    test_two_measurable_variables_required()
    print("symbolic_operational_translator tests passed")


if __name__ == "__main__":
    run()
