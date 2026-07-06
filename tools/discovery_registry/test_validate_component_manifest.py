#!/usr/bin/env python3
"""Regression tests for discovery component manifest validation."""

from __future__ import annotations

import importlib.util
import json
from pathlib import Path

HERE = Path(__file__).resolve().parent
MODULE_PATH = HERE / "validate_component_manifest.py"
FIXTURE_PATH = HERE / "fixtures.synthetic.json"

spec = importlib.util.spec_from_file_location("validate_component_manifest", MODULE_PATH)
module = importlib.util.module_from_spec(spec)
assert spec.loader is not None
spec.loader.exec_module(module)


def test_fixture_expectations() -> None:
    cases = json.loads(FIXTURE_PATH.read_text())
    assert cases, "fixture file must contain cases"
    for case in cases:
        report = module.validate_manifests(case["manifests"])
        assert report.status == case["expected"], f"{case['case_id']} expected {case['expected']} got {report.to_dict()}"


def test_valid_case_has_stable_execution_order() -> None:
    cases = json.loads(FIXTURE_PATH.read_text())
    valid_case = next(case for case in cases if case["case_id"] == "valid_linear_registry")
    report = module.validate_manifests(valid_case["manifests"])
    assert report.status == "PASS"
    assert report.execution_order == ["phenomenon_gate", "hypothesis_gate"]


def test_side_effects_are_rejected() -> None:
    cases = json.loads(FIXTURE_PATH.read_text())
    manifest = dict(cases[0]["manifests"][0])
    manifest["side_effects"] = True
    report = module.validate_manifests([manifest])
    assert report.status == "FAIL"
    assert any("side effects" in error for error in report.errors)


def test_private_status_is_rejected() -> None:
    cases = json.loads(FIXTURE_PATH.read_text())
    manifest = dict(cases[0]["manifests"][0])
    manifest["privacy_status"] = "private"
    report = module.validate_manifests([manifest])
    assert report.status == "FAIL"
    assert any("public-safe" in error for error in report.errors)


if __name__ == "__main__":
    test_fixture_expectations()
    test_valid_case_has_stable_execution_order()
    test_side_effects_are_rejected()
    test_private_status_is_rejected()
    print("discovery registry validator tests passed")
