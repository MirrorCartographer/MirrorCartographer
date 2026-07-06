#!/usr/bin/env python3
"""Regression tests for the measurement invariance gate."""

from __future__ import annotations

import json
from pathlib import Path

from validate_measurement_invariance_packets import validate_packet

FIXTURES = Path(__file__).with_name("fixtures.synthetic.json")


def load_cases():
    with FIXTURES.open("r", encoding="utf-8") as handle:
        return json.load(handle)


def test_fixture_expectations():
    for case in load_cases():
        errors = validate_packet(case["packet"])
        passed = not errors
        assert passed == case["expect_pass"], f"{case['name']} errors={errors}"


def test_rejects_out_of_order_series():
    case = load_cases()[0]["packet"]
    mutated = json.loads(json.dumps(case))
    mutated["measurement_series"][0]["time_index"] = 2
    mutated["measurement_series"][1]["time_index"] = 1
    errors = validate_packet(mutated)
    assert any("ordered" in error for error in errors)


def test_rejects_variable_mixing():
    case = load_cases()[0]["packet"]
    mutated = json.loads(json.dumps(case))
    mutated["measurement_series"][1]["variable_name"] = "different_signal"
    errors = validate_packet(mutated)
    assert any("same variable_name" in error for error in errors)


if __name__ == "__main__":
    test_fixture_expectations()
    test_rejects_out_of_order_series()
    test_rejects_variable_mixing()
    print("measurement invariance gate tests passed")
