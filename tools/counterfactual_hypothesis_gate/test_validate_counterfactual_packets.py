#!/usr/bin/env python3
"""Regression tests for the Counterfactual Hypothesis Gate."""

from __future__ import annotations

import json
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent
VALIDATOR = ROOT / "validate_counterfactual_packets.py"
FIXTURES = ROOT / "fixtures.synthetic.json"


def test_fixture_expectations() -> None:
    completed = subprocess.run(
        [sys.executable, str(VALIDATOR), str(FIXTURES)],
        check=False,
        text=True,
        capture_output=True,
    )
    assert completed.returncode == 0, completed.stdout + completed.stderr
    payload = json.loads(completed.stdout)
    assert payload["failed"] == 0
    by_case = {row["case_id"]: row for row in payload["results"]}
    assert by_case["valid_counterfactual_packet"]["actual_valid"] is True
    assert by_case["invalid_missing_alternatives"]["actual_valid"] is False
    assert by_case["invalid_private_packet"]["actual_valid"] is False


def test_cli_requires_input_path() -> None:
    completed = subprocess.run(
        [sys.executable, str(VALIDATOR)],
        check=False,
        text=True,
        capture_output=True,
    )
    assert completed.returncode == 2
    assert "Usage:" in completed.stdout


if __name__ == "__main__":
    test_fixture_expectations()
    test_cli_requires_input_path()
    print("counterfactual hypothesis gate tests passed")
