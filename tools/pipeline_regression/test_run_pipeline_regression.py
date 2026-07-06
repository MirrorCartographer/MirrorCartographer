#!/usr/bin/env python3
"""Regression tests for the MC synthetic pipeline runner."""

from __future__ import annotations

import importlib.util
import json
from pathlib import Path

HERE = Path(__file__).resolve().parent
MODULE_PATH = HERE / "run_pipeline_regression.py"
spec = importlib.util.spec_from_file_location("run_pipeline_regression", MODULE_PATH)
runner = importlib.util.module_from_spec(spec)
assert spec and spec.loader
spec.loader.exec_module(runner)


def load_fixtures():
    return json.loads((HERE / "fixtures.synthetic.json").read_text(encoding="utf-8"))["fixtures"]


def test_expected_fixture_outcomes():
    for fixture in load_fixtures():
        result = runner.run_pipeline(fixture["packet"])
        assert result.pipeline_status == fixture["expected_status"], fixture["fixture_id"]
        expected_failed_stage = fixture.get("expected_failed_stage")
        if expected_failed_stage:
            assert result.failed_stage == expected_failed_stage, fixture["fixture_id"]
        else:
            assert result.failed_stage is None, fixture["fixture_id"]


def test_valid_fixture_executes_all_stages():
    valid_fixture = next(item for item in load_fixtures() if item["fixture_id"] == "valid_full_discovery_path")
    result = runner.run_pipeline(valid_fixture["packet"])
    assert result.pipeline_status == "PASS"
    assert result.executed_stages == [stage for stage, _ in runner.VALIDATORS]
    assert len(result.transition_log) == len(runner.VALIDATORS)


def test_invalid_fixture_stops_at_first_failure():
    private_fixture = next(item for item in load_fixtures() if item["fixture_id"] == "fail_private_identifier")
    result = runner.run_pipeline(private_fixture["packet"])
    assert result.pipeline_status == "FAIL"
    assert result.failed_stage == "PrivacyBoundaryValidator"
    assert result.executed_stages == ["PrivacyBoundaryValidator"]
    assert len(result.transition_log) == 1


def test_identical_inputs_are_deterministic_except_latency():
    fixture = next(item for item in load_fixtures() if item["fixture_id"] == "valid_full_discovery_path")
    first = runner.run_pipeline(fixture["packet"])
    second = runner.run_pipeline(fixture["packet"])

    def stable(result):
        data = result.__dict__.copy()
        data["transition_log"] = [
            {k: v for k, v in stage.items() if k != "latency_ms"}
            for stage in data["transition_log"]
        ]
        return data

    assert stable(first) == stable(second)


if __name__ == "__main__":
    test_expected_fixture_outcomes()
    test_valid_fixture_executes_all_stages()
    test_invalid_fixture_stops_at_first_failure()
    test_identical_inputs_are_deterministic_except_latency()
    print("pipeline regression tests passed")
