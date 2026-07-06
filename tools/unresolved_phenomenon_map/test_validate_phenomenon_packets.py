#!/usr/bin/env python3
"""Regression tests for unresolved phenomenon packet validation."""

from __future__ import annotations

import copy
import json
from pathlib import Path

from validate_phenomenon_packets import validate_packet

FIXTURES = Path(__file__).with_name("fixtures.synthetic.json")


def load_fixtures():
    return json.loads(FIXTURES.read_text(encoding="utf-8"))


def test_public_safe_operationalized_packet_passes():
    packets = load_fixtures()
    passed = packets[0]
    assert validate_packet(passed) == []


def test_private_packet_fails():
    packets = load_fixtures()
    private_packet = packets[1]
    errors = validate_packet(private_packet)
    assert errors
    assert any("privacy_status" in error for error in errors)


def test_unbounded_symbolic_packet_fails():
    packets = load_fixtures()
    unbounded = packets[2]
    errors = validate_packet(unbounded)
    assert errors
    assert any("operational_variables" in error for error in errors)
    assert any("boundary_conditions" in error for error in errors)


def test_requires_output_variable():
    packet = copy.deepcopy(load_fixtures()[0])
    for variable in packet["operational_variables"]:
        if variable["role"] == "output":
            variable["role"] = "context"
    errors = validate_packet(packet)
    assert any("output variable" in error for error in errors)


def test_requires_two_alternative_explanations():
    packet = copy.deepcopy(load_fixtures()[0])
    packet["alternative_explanations"] = ["Only one alternative"]
    errors = validate_packet(packet)
    assert any("alternative_explanations" in error for error in errors)


def test_rejects_cure_language_in_measurement_fields():
    packet = copy.deepcopy(load_fixtures()[0])
    packet["operational_variables"][0]["measurement_method"] = "cure breakthrough score"
    errors = validate_packet(packet)
    assert any("low-information" in error for error in errors)


if __name__ == "__main__":
    test_public_safe_operationalized_packet_passes()
    test_private_packet_fails()
    test_unbounded_symbolic_packet_fails()
    test_requires_output_variable()
    test_requires_two_alternative_explanations()
    test_rejects_cure_language_in_measurement_fields()
    print("PASS unresolved_phenomenon_map tests")
