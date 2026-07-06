#!/usr/bin/env python3
"""Regression tests for the MC decision-readiness gate."""

from __future__ import annotations

import importlib.util
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent
MODULE_PATH = ROOT / "validate_decision_readiness.py"
FIXTURE_PATH = ROOT / "fixtures.synthetic.json"

spec = importlib.util.spec_from_file_location("validate_decision_readiness", MODULE_PATH)
module = importlib.util.module_from_spec(spec)
assert spec and spec.loader
spec.loader.exec_module(module)


def test_fixtures_match_expected_validity() -> None:
    cases = json.loads(FIXTURE_PATH.read_text(encoding="utf-8"))
    assert cases, "fixtures must not be empty"
    for case in cases:
        errors = module.validate_packet(case["packet"])
        assert (not errors) is case["expect_valid"], f"{case['name']} errors={errors}"


def test_valid_packet_has_human_decision_surface() -> None:
    cases = json.loads(FIXTURE_PATH.read_text(encoding="utf-8"))
    valid = next(case["packet"] for case in cases if case["expect_valid"])
    assert len(valid["decision_options"]) >= 2
    assert all("acceptance_criterion" in option for option in valid["decision_options"])
    assert valid["privacy_status"] in module.ALLOWED_PRIVACY_STATUS


def test_private_status_is_rejected() -> None:
    cases = json.loads(FIXTURE_PATH.read_text(encoding="utf-8"))
    private_case = next(case["packet"] for case in cases if case["name"] == "fail_private_status")
    errors = module.validate_packet(private_case)
    assert "invalid privacy_status" in errors


if __name__ == "__main__":
    test_fixtures_match_expected_validity()
    test_valid_packet_has_human_decision_surface()
    test_private_status_is_rejected()
    print("decision readiness gate tests passed")
