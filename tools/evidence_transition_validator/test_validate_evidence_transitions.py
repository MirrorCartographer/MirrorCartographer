#!/usr/bin/env python3
"""Regression tests for the MC Evidence Transition Validator."""

from __future__ import annotations

import importlib.util
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent
MODULE_PATH = ROOT / "validate_evidence_transitions.py"
FIXTURE_PATH = ROOT / "fixtures.synthetic.json"

spec = importlib.util.spec_from_file_location("validate_evidence_transitions", MODULE_PATH)
validator = importlib.util.module_from_spec(spec)
assert spec.loader is not None
spec.loader.exec_module(validator)


def test_fixture_expected_results_match_validator() -> None:
    payload = json.loads(FIXTURE_PATH.read_text(encoding="utf-8"))
    expected = payload["expected_results"]

    for record in payload["records"]:
        ok, errors = validator.validate_record(record)
        observed = "pass" if ok else "fail"
        assert observed == expected[record["transition_id"]], {
            "transition_id": record["transition_id"],
            "expected": expected[record["transition_id"]],
            "observed": observed,
            "errors": errors,
        }


def test_supported_requires_test_result() -> None:
    payload = json.loads(FIXTURE_PATH.read_text(encoding="utf-8"))
    base = payload["records"][0].copy()
    base["transition_id"] = "unit_illegal_support"
    base["from_state"] = "Mechanistic Model"
    base["to_state"] = "Supported"

    ok, errors = validator.validate_record(base)
    assert not ok
    assert any("Supported can only be reached from Test Result" in error for error in errors)


def test_privacy_block_rejects_record() -> None:
    payload = json.loads(FIXTURE_PATH.read_text(encoding="utf-8"))
    base = payload["records"][0].copy()
    base["transition_id"] = "unit_privacy_block"
    base["privacy_status"] = "blocked_private_or_sensitive"

    ok, errors = validator.validate_record(base)
    assert not ok
    assert any("privacy_status is blocked" in error for error in errors)


def test_terminal_states_do_not_transition_onward() -> None:
    payload = json.loads(FIXTURE_PATH.read_text(encoding="utf-8"))
    base = payload["records"][0].copy()
    base["transition_id"] = "unit_terminal_transition"
    base["from_state"] = "Contradicted"
    base["to_state"] = "Prediction"

    ok, errors = validator.validate_record(base)
    assert not ok
    assert any("terminal from_state cannot transition onward" in error for error in errors)


def test_missing_measurable_variables_rejected() -> None:
    payload = json.loads(FIXTURE_PATH.read_text(encoding="utf-8"))
    base = payload["records"][0].copy()
    base["transition_id"] = "unit_no_variables"
    base["measurable_variables"] = []

    ok, errors = validator.validate_record(base)
    assert not ok
    assert any("at least one measurable variable" in error for error in errors)


if __name__ == "__main__":
    test_fixture_expected_results_match_validator()
    test_supported_requires_test_result()
    test_privacy_block_rejects_record()
    test_terminal_states_do_not_transition_onward()
    test_missing_measurable_variables_rejected()
    print("evidence transition validator tests passed")
