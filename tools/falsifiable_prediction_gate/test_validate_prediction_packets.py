#!/usr/bin/env python3
"""Regression tests for the falsifiable prediction packet validator."""

from __future__ import annotations

import copy
import importlib.util
import json
from pathlib import Path

HERE = Path(__file__).resolve().parent
MODULE_PATH = HERE / "validate_prediction_packets.py"
FIXTURE_PATH = HERE / "fixtures.synthetic.json"

spec = importlib.util.spec_from_file_location("validate_prediction_packets", MODULE_PATH)
validator = importlib.util.module_from_spec(spec)
assert spec.loader is not None
spec.loader.exec_module(validator)


def load_fixtures():
    return json.loads(FIXTURE_PATH.read_text(encoding="utf-8"))


def test_fixture_expectations():
    for fixture in load_fixtures():
        errors = validator.validate_packet(fixture["packet"])
        if fixture["should_pass"]:
            assert not errors, f"{fixture['name']} should pass but failed: {errors}"
        else:
            assert errors, f"{fixture['name']} should fail but passed"


def test_rejects_missing_failure_condition():
    valid = next(f["packet"] for f in load_fixtures() if f["should_pass"])
    packet = copy.deepcopy(valid)
    packet.pop("failure_condition")
    errors = validator.validate_packet(packet)
    assert any("missing required fields" in error for error in errors)


def test_rejects_single_repetition_prediction():
    valid = next(f["packet"] for f in load_fixtures() if f["should_pass"])
    packet = copy.deepcopy(valid)
    packet["observation_window"]["minimum_repetitions"] = 1
    errors = validator.validate_packet(packet)
    assert any("minimum_repetitions" in error for error in errors)


def test_rejects_private_or_advice_like_marker():
    valid = next(f["packet"] for f in load_fixtures() if f["should_pass"])
    packet = copy.deepcopy(valid)
    packet["prediction_statement"] += " This must not contain treatment plan language."
    errors = validator.validate_packet(packet)
    assert any("treatment plan" in error for error in errors)


if __name__ == "__main__":
    test_fixture_expectations()
    test_rejects_missing_failure_condition()
    test_rejects_single_repetition_prediction()
    test_rejects_private_or_advice_like_marker()
    print("All falsifiable prediction packet tests passed.")
