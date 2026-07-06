#!/usr/bin/env python3
"""Regression tests for MC Variable Drift Gate."""

from __future__ import annotations

import copy
import json
import subprocess
import sys
from pathlib import Path

from validate_variable_drift_packets import validate_packet

ROOT = Path(__file__).resolve().parent
FIXTURES = ROOT / "fixtures.synthetic.json"
VALIDATOR = ROOT / "validate_variable_drift_packets.py"


def load_fixture(name: str) -> dict:
    data = json.loads(FIXTURES.read_text(encoding="utf-8"))
    return data[name]


def assert_valid(name: str) -> None:
    errors = validate_packet(load_fixture(name))
    assert errors == [], errors


def assert_invalid(name: str, expected_substring: str) -> None:
    errors = validate_packet(load_fixture(name))
    assert any(expected_substring in error for error in errors), errors


def test_pass_stable_variable() -> None:
    assert_valid("pass_stable_variable")


def test_rejects_semantic_drift() -> None:
    assert_invalid("fail_semantic_drift", "semantic drift detected")


def test_rejects_private_packet() -> None:
    assert_invalid("fail_private_packet", "private_rejected")


def test_rejects_missingness_observed_conflict() -> None:
    packet = copy.deepcopy(load_fixture("pass_stable_variable"))
    packet["timepoints"][1]["observed"] = False
    errors = validate_packet(packet)
    assert any("observed conflicts" in error for error in errors), errors


def test_rejects_unordered_timepoints() -> None:
    packet = copy.deepcopy(load_fixture("pass_stable_variable"))
    packet["timepoints"][1]["t"] = "2026-06-30T12:00:00Z"
    errors = validate_packet(packet)
    assert any("not strictly time-ordered" in error for error in errors), errors


def test_cli_reports_failures_for_synthetic_fixture_file() -> None:
    result = subprocess.run(
        [sys.executable, str(VALIDATOR), str(FIXTURES)],
        text=True,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        check=False,
    )
    assert result.returncode == 1
    assert "PASS pass_stable_variable" in result.stdout
    assert "FAIL fail_semantic_drift" in result.stdout
    assert "FAIL fail_private_packet" in result.stdout


if __name__ == "__main__":
    test_pass_stable_variable()
    test_rejects_semantic_drift()
    test_rejects_private_packet()
    test_rejects_missingness_observed_conflict()
    test_rejects_unordered_timepoints()
    test_cli_reports_failures_for_synthetic_fixture_file()
    print("all variable drift gate tests passed")
