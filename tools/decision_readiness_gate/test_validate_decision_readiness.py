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


def _cases() -> list[dict]:
    return json.loads(FIXTURE_PATH.read_text(encoding="utf-8"))


def test_fixtures_match_expected_validity() -> None:
    cases = _cases()
    assert cases, "fixtures must not be empty"
    for case in cases:
        errors = module.validate_packet(case["packet"])
        assert (not errors) is case["expect_valid"], f"{case['name']} errors={errors}"


def test_valid_packet_has_human_decision_surface() -> None:
    valid = next(case["packet"] for case in _cases() if case["expect_valid"])
    assert len(valid["decision_options"]) >= 2
    assert all("acceptance_criterion" in option for option in valid["decision_options"])
    assert valid["privacy_status"] in module.ALLOWED_PRIVACY_STATUS
    assert valid["consequence_class"] in module.ALLOWED_CONSEQUENCE_CLASS


def test_valid_packet_exposes_ambiguity_and_blocking_evidence() -> None:
    valid = next(case["packet"] for case in _cases() if case["expect_valid"])
    assert valid["ambiguity_register"]
    assert valid["decision_readiness_evidence"]
    assert valid["blocking_evidence"]


def test_private_status_is_rejected() -> None:
    private_case = next(case["packet"] for case in _cases() if case["name"] == "fail_private_status")
    errors = module.validate_packet(private_case)
    assert "invalid privacy_status" in errors


def test_personal_advice_class_must_be_blocked() -> None:
    advice_case = next(case["packet"] for case in _cases() if case["name"] == "fail_personal_advice_not_blocked")
    errors = module.validate_packet(advice_case)
    assert "blocked_personal_advice packets must have implementation_status=blocked" in errors


if __name__ == "__main__":
    test_fixtures_match_expected_validity()
    test_valid_packet_has_human_decision_surface()
    test_valid_packet_exposes_ambiguity_and_blocking_evidence()
    test_private_status_is_rejected()
    test_personal_advice_class_must_be_blocked()
    print("decision readiness gate tests passed")
