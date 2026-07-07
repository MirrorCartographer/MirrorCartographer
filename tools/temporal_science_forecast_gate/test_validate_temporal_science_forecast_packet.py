#!/usr/bin/env python3
"""Regression tests for the Temporal Science Forecast Gate."""
from __future__ import annotations

import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent
VALIDATOR = ROOT / "validate_temporal_science_forecast_packet.py"
VALID = ROOT / "fixtures" / "valid_temporal_science_forecast_packet.json"
INVALID = ROOT / "fixtures" / "invalid_temporal_science_forecast_packet.json"


def test_valid_fixture_passes() -> None:
    result = subprocess.run([sys.executable, str(VALIDATOR), str(VALID)], capture_output=True, text=True)
    assert result.returncode == 0, result.stderr
    assert "OK:" in result.stdout


def test_invalid_fixture_fails() -> None:
    result = subprocess.run([sys.executable, str(VALIDATOR), str(INVALID)], capture_output=True, text=True)
    assert result.returncode != 0
    assert "ERROR:" in result.stderr


if __name__ == "__main__":
    test_valid_fixture_passes()
    test_invalid_fixture_fails()
    print("OK: temporal science forecast gate regression tests")
