#!/usr/bin/env python3
"""Regression tests for the MC evidence crosswalk validator."""

from __future__ import annotations

import copy
import importlib.util
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent
VALIDATOR_PATH = ROOT / "validate_crosswalk_records.py"
FIXTURE_PATH = ROOT / "fixtures.synthetic.json"

spec = importlib.util.spec_from_file_location("validate_crosswalk_records", VALIDATOR_PATH)
assert spec and spec.loader
validator = importlib.util.module_from_spec(spec)
spec.loader.exec_module(validator)


def load_fixtures() -> dict:
    return json.loads(FIXTURE_PATH.read_text(encoding="utf-8"))


def test_valid_records_pass() -> None:
    fixtures = load_fixtures()
    for record in fixtures["valid_records"]:
        errors = validator.validate_record(record)
        assert errors == [], errors


def test_invalid_records_fail_for_expected_reason() -> None:
    fixtures = load_fixtures()
    for item in fixtures["invalid_records"]:
        errors = validator.validate_record(item["record"])
        joined = "\n".join(errors)
        assert errors, item["name"]
        assert item["expected_error_contains"] in joined, joined


def test_supported_claim_requires_linked_test_and_artifact() -> None:
    record = copy.deepcopy(load_fixtures()["valid_records"][0])
    record["claim_status"] = "supported"
    record["linked_tests"] = []
    record["reproducibility"]["artifacts_available"] = False
    errors = validator.validate_record(record)
    joined = "\n".join(errors)
    assert "supported claims require at least one linked test" in joined
    assert "supported claims require reproducibility.artifacts_available=true" in joined


def test_public_memory_rejects_unknown_source_type() -> None:
    record = copy.deepcopy(load_fixtures()["valid_records"][0])
    record["evidence_source"]["type"] = "rumor"
    errors = validator.validate_record(record)
    assert any("evidence_source.type" in error for error in errors)


if __name__ == "__main__":
    test_valid_records_pass()
    test_invalid_records_fail_for_expected_reason()
    test_supported_claim_requires_linked_test_and_artifact()
    test_public_memory_rejects_unknown_source_type()
    print("all evidence_crosswalk validator tests passed")
