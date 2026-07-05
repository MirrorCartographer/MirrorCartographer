#!/usr/bin/env python3
"""Regression tests for the MC contradiction ledger validator."""

from __future__ import annotations

import copy
import json
import tempfile
from pathlib import Path

from validate_contradiction_records import validate_file, validate_record

FIXTURE_PATH = Path(__file__).with_name("fixtures.synthetic.json")


def load_fixture_records():
    return json.loads(FIXTURE_PATH.read_text(encoding="utf-8"))["records"]


def test_synthetic_fixtures_are_valid():
    result = validate_file(FIXTURE_PATH)
    assert result.ok, result.errors
    assert any("not_a_contradiction" in warning or "control" in warning for warning in result.warnings)


def test_missing_required_boundary_field_fails():
    record = copy.deepcopy(load_fixture_records()[2])
    del record["privacy_status"]
    errors, _warnings = validate_record(record)
    assert any("privacy_status" in error for error in errors)


def test_confirmed_contradiction_requires_moderate_or_better_evidence():
    record = copy.deepcopy(load_fixture_records()[2])
    record["evidence_strength"] = "weak"
    errors, _warnings = validate_record(record)
    assert any("confirmed_contradiction requires" in error for error in errors)


def test_ambiguous_missing_data_rejects_overconfident_claim_status():
    record = copy.deepcopy(load_fixture_records()[1])
    record["claim_status"] = "contradicted_hypothesis"
    errors, _warnings = validate_record(record)
    assert any("ambiguous_missing_data requires" in error for error in errors)


def test_duplicate_ids_fail_file_validation():
    records = load_fixture_records()
    duplicated = [records[0], records[0]]
    with tempfile.TemporaryDirectory() as tmpdir:
        path = Path(tmpdir) / "duplicate.json"
        path.write_text(json.dumps({"records": duplicated}, indent=2), encoding="utf-8")
        result = validate_file(path)
    assert not result.ok
    assert any("duplicate id" in error for error in result.errors)


def run_all():
    tests = [
        test_synthetic_fixtures_are_valid,
        test_missing_required_boundary_field_fails,
        test_confirmed_contradiction_requires_moderate_or_better_evidence,
        test_ambiguous_missing_data_rejects_overconfident_claim_status,
        test_duplicate_ids_fail_file_validation,
    ]
    for test in tests:
        test()
        print(f"PASS {test.__name__}")


if __name__ == "__main__":
    run_all()
