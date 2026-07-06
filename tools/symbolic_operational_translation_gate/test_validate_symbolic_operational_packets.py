#!/usr/bin/env python3
"""Regression tests for symbolic operational translation gate."""

from __future__ import annotations

import importlib.util
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent
VALIDATOR_PATH = ROOT / "validate_symbolic_operational_packets.py"
FIXTURES_PATH = ROOT / "fixtures.synthetic.json"

spec = importlib.util.spec_from_file_location("validator", VALIDATOR_PATH)
validator = importlib.util.module_from_spec(spec)
assert spec and spec.loader
spec.loader.exec_module(validator)


def test_fixtures_match_expected_outcomes() -> None:
    cases = json.loads(FIXTURES_PATH.read_text())
    assert cases, "fixtures must not be empty"
    for case in cases:
        errors = validator.validate_packet(case["packet"])
        assert (not errors) == case["should_pass"], f"{case['case_id']} errors={errors}"


def test_rejects_private_status_even_when_other_fields_are_valid() -> None:
    case = json.loads(FIXTURES_PATH.read_text())[0]["packet"]
    case = json.loads(json.dumps(case))
    case["privacy_status"] = "private_rejected"
    errors = validator.validate_packet(case)
    assert any("private_rejected" in error for error in errors)


def test_rejects_single_story_symbolic_mapping() -> None:
    case = json.loads(FIXTURES_PATH.read_text())[0]["packet"]
    case = json.loads(json.dumps(case))
    case["ambiguity_controls"]["alternative_interpretations"] = ["only one story"]
    errors = validator.validate_packet(case)
    assert any("alternative interpretations" in error for error in errors)


def test_rejects_missing_measurable_variable() -> None:
    case = json.loads(FIXTURES_PATH.read_text())[0]["packet"]
    case = json.loads(json.dumps(case))
    case["measurable_variables"] = case["measurable_variables"][:1]
    errors = validator.validate_packet(case)
    assert any("measurable variables" in error for error in errors)


if __name__ == "__main__":
    test_fixtures_match_expected_outcomes()
    test_rejects_private_status_even_when_other_fields_are_valid()
    test_rejects_single_story_symbolic_mapping()
    test_rejects_missing_measurable_variable()
    print("all symbolic operational translation gate tests passed")
