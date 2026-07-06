#!/usr/bin/env python3
"""Regression tests for the MC contradiction-ledger validator."""

from __future__ import annotations

import importlib.util
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
MODULE_PATH = ROOT / "tools" / "contradiction_ledger_gate" / "validate_contradiction_packets.py"
FIXTURE_PATH = ROOT / "tools" / "contradiction_ledger_gate" / "fixtures.synthetic.json"

spec = importlib.util.spec_from_file_location("validate_contradiction_packets", MODULE_PATH)
validator = importlib.util.module_from_spec(spec)
assert spec.loader is not None
spec.loader.exec_module(validator)


def test_fixtures_match_expected_pass_fail() -> None:
    fixtures = json.loads(FIXTURE_PATH.read_text(encoding="utf-8"))
    assert len(fixtures) >= 4
    for fixture in fixtures:
        errors = validator.validate_packet(fixture["packet"])
        assert (not errors) is fixture["should_pass"], f"{fixture['name']} errors={errors}"


def test_rejects_missingness_as_absence() -> None:
    fixture = json.loads(FIXTURE_PATH.read_text(encoding="utf-8"))[0]
    packet = dict(fixture["packet"])
    packet["missingness"] = {"state": "unknown", "interpretation_allowed": True}
    errors = validator.validate_packet(packet)
    assert any("cannot allow interpretation" in error for error in errors)


def test_rejects_identical_expected_and_observed_results() -> None:
    fixture = json.loads(FIXTURE_PATH.read_text(encoding="utf-8"))[0]
    packet = dict(fixture["packet"])
    packet["observed_result"] = packet["expected_result"]
    errors = validator.validate_packet(packet)
    assert any("observed_result must differ" in error for error in errors)


def test_rejects_private_content_storage() -> None:
    fixture = json.loads(FIXTURE_PATH.read_text(encoding="utf-8"))[0]
    packet = dict(fixture["packet"])
    packet["privacy_status"] = "reject_private_content"
    errors = validator.validate_packet(packet)
    assert any("cannot be stored" in error for error in errors)


if __name__ == "__main__":
    test_fixtures_match_expected_pass_fail()
    test_rejects_missingness_as_absence()
    test_rejects_identical_expected_and_observed_results()
    test_rejects_private_content_storage()
    print("contradiction ledger gate tests passed")
