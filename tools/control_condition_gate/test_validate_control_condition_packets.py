#!/usr/bin/env python3
"""Regression tests for the MC control-condition gate."""

from __future__ import annotations

import copy
import json
from pathlib import Path

from validate_control_condition_packets import validate_packet

HERE = Path(__file__).resolve().parent


def load_fixtures() -> list[dict]:
    return json.loads((HERE / "fixtures.synthetic.json").read_text(encoding="utf-8"))


def test_expected_fixture_outcomes() -> None:
    fixtures = load_fixtures()
    results = {packet["packet_id"]: validate_packet(packet) for packet in fixtures}

    assert results["ccg-pass-001"] == []
    assert any("negative_control" in error for error in results["ccg-fail-no-negative-control"])
    assert any("unknown or not_collected" in error for error in results["ccg-fail-missingness-collapse"])


def test_private_or_advice_markers_are_rejected() -> None:
    packet = copy.deepcopy(load_fixtures()[0])
    packet["claim"] = "This should diagnose me and choose a treatment from a private chart."

    errors = validate_packet(packet)

    assert any("private_or_advice_marker_present" in error for error in errors)


def test_duplicate_variable_names_are_rejected() -> None:
    packet = copy.deepcopy(load_fixtures()[0])
    packet["measurable_variables"][1]["name"] = packet["measurable_variables"][0]["name"]

    errors = validate_packet(packet)

    assert any("duplicate variable name" in error for error in errors)


def test_null_result_handling_is_required() -> None:
    packet = copy.deepcopy(load_fixtures()[0])
    packet["null_result_handling"] = ""

    errors = validate_packet(packet)

    assert any("null_result_handling" in error for error in errors)


def run_all() -> None:
    test_expected_fixture_outcomes()
    test_private_or_advice_markers_are_rejected()
    test_duplicate_variable_names_are_rejected()
    test_null_result_handling_is_required()


if __name__ == "__main__":
    run_all()
    print("control_condition_gate tests passed")
