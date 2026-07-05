#!/usr/bin/env python3
"""Regression tests for the MC longitudinal missingness gate."""
from __future__ import annotations

import json
import subprocess
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
VALIDATOR = HERE / "validate_missingness_packets.py"
FIXTURES = HERE / "fixtures.synthetic.json"


def test_fixture_expectations_match() -> None:
    proc = subprocess.run(
        [sys.executable, str(VALIDATOR), str(FIXTURES), "--check-fixture-expectations"],
        text=True,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        check=False,
    )
    assert proc.returncode == 0, proc.stdout + proc.stderr


def test_pass_fixture_contains_distinct_missingness_states() -> None:
    fixtures = json.loads(FIXTURES.read_text(encoding="utf-8"))
    passing = next(item for item in fixtures if item["name"] == "pass_distinguishes_absence_from_unknown")
    values = passing["packet"]["variables"][0]["values"]
    states = {entry["state"] for entry in values}
    assert "absent" in states
    assert "unknown" in states
    assert "not_collected" in states
    assert "observed" in states


def test_public_safe_only() -> None:
    fixtures = json.loads(FIXTURES.read_text(encoding="utf-8"))
    public_safe = {"public_safe_synthetic", "public_safe_deidentified", "public"}
    for item in fixtures:
        if item["expect_pass"]:
            assert item["packet"]["privacy_status"] in public_safe


if __name__ == "__main__":
    test_fixture_expectations_match()
    test_pass_fixture_contains_distinct_missingness_states()
    test_public_safe_only()
    print("longitudinal_missingness_gate tests passed")
