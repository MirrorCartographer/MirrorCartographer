#!/usr/bin/env python3
"""Regression tests for the MC interaction trajectory gate."""

from __future__ import annotations

import importlib.util
import json
from pathlib import Path

HERE = Path(__file__).resolve().parent
VALIDATOR = HERE / "validate_interaction_trajectory.py"
FIXTURES = HERE / "fixtures.synthetic.json"

spec = importlib.util.spec_from_file_location("validator", VALIDATOR)
validator = importlib.util.module_from_spec(spec)
assert spec.loader is not None
spec.loader.exec_module(validator)


def test_fixtures_match_expectations() -> None:
    fixtures = json.loads(FIXTURES.read_text())
    assert fixtures, "fixtures must not be empty"
    for fixture in fixtures:
        errors = validator.validate_packet(fixture["packet"])
        if fixture["expect"] == "pass":
            assert errors == [], f"{fixture['name']} unexpectedly failed: {errors}"
        else:
            assert errors, f"{fixture['name']} unexpectedly passed"


def test_rejects_missing_falsification_route() -> None:
    packet = json.loads(FIXTURES.read_text())[0]["packet"]
    packet = json.loads(json.dumps(packet))
    packet["research_state_after"]["falsification_route_present"] = False
    packet["trajectory_metrics"]["falsifiability_delta"] = 0
    errors = validator.validate_packet(packet)
    assert any("falsification" in error for error in errors)


def test_rejects_privacy_regression() -> None:
    packet = json.loads(FIXTURES.read_text())[0]["packet"]
    packet = json.loads(json.dumps(packet))
    packet["trajectory_metrics"]["privacy_risk_delta"] = 0.1
    errors = validator.validate_packet(packet)
    assert any("privacy_risk_delta" in error for error in errors)


if __name__ == "__main__":
    test_fixtures_match_expectations()
    test_rejects_missing_falsification_route()
    test_rejects_privacy_regression()
    print("interaction trajectory gate tests passed")
