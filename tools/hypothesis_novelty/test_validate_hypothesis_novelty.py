#!/usr/bin/env python3
"""Regression tests for the hypothesis novelty validator."""

from __future__ import annotations

import importlib.util
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent
VALIDATOR_PATH = ROOT / "validate_hypothesis_novelty.py"
FIXTURE_PATH = ROOT / "fixtures.synthetic.json"

spec = importlib.util.spec_from_file_location("validate_hypothesis_novelty", VALIDATOR_PATH)
module = importlib.util.module_from_spec(spec)
assert spec.loader is not None
spec.loader.exec_module(module)


def load_fixtures():
    return json.loads(FIXTURE_PATH.read_text())


def test_fixture_expectations_match_validator():
    for fixture in load_fixtures():
        passed, errors = module.validate_packet(fixture["packet"])
        expected_pass = fixture["expected"] == "PASS"
        assert passed == expected_pass, f"{fixture['fixture_id']} errors={errors}"


def test_restatement_of_baseline_is_rejected():
    fixture = next(item for item in load_fixtures() if item["fixture_id"] == "HN-INVALID-001")
    passed, errors = module.validate_packet(fixture["packet"])
    assert not passed
    assert any("baseline" in error for error in errors)


def test_private_status_is_rejected():
    fixture = next(item for item in load_fixtures() if item["fixture_id"] == "HN-INVALID-PRIVATE-001")
    passed, errors = module.validate_packet(fixture["packet"])
    assert not passed
    assert any("privacy_status" in error or "private-safety" in error for error in errors)


def test_valid_fixture_has_separating_testable_difference():
    fixture = next(item for item in load_fixtures() if item["fixture_id"] == "HN-VALID-001")
    passed, errors = module.validate_packet(fixture["packet"])
    assert passed, errors


if __name__ == "__main__":
    test_fixture_expectations_match_validator()
    test_restatement_of_baseline_is_rejected()
    test_private_status_is_rejected()
    test_valid_fixture_has_separating_testable_difference()
    print("hypothesis novelty tests passed")
