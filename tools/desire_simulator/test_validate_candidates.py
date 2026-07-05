#!/usr/bin/env python3
"""Minimal tests for validate_candidates.py."""

from __future__ import annotations

import copy
import json
import subprocess
import sys
import tempfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
VALIDATOR = ROOT / "tools" / "desire_simulator" / "validate_candidates.py"
EXAMPLE = ROOT / "tools" / "desire_simulator" / "candidates.example.json"


def run_validator(path: Path) -> subprocess.CompletedProcess[str]:
    return subprocess.run(
        [sys.executable, str(VALIDATOR), str(path)],
        check=False,
        text=True,
        capture_output=True,
    )


def write_temp(payload: dict) -> Path:
    handle = tempfile.NamedTemporaryFile("w", encoding="utf-8", suffix=".json", delete=False)
    with handle:
        json.dump(payload, handle, indent=2)
    return Path(handle.name)


def test_valid_example() -> None:
    result = run_validator(EXAMPLE)
    assert result.returncode == 0, result.stdout + result.stderr
    assert "VALID" in result.stdout


def test_missing_falsification_route_fails() -> None:
    payload = json.loads(EXAMPLE.read_text(encoding="utf-8"))
    del payload["candidates"][0]["falsification_route"]
    path = write_temp(payload)
    result = run_validator(path)
    assert result.returncode == 1
    assert "falsification_route is required" in result.stdout


def test_bad_drive_score_fails() -> None:
    payload = json.loads(EXAMPLE.read_text(encoding="utf-8"))
    payload["candidates"][0]["drives"]["evidence_gain"] = 1.7
    path = write_temp(payload)
    result = run_validator(path)
    assert result.returncode == 1
    assert "drives.evidence_gain must be a number from 0 to 1" in result.stdout


def test_missing_acceptance_criteria_fails() -> None:
    payload = json.loads(EXAMPLE.read_text(encoding="utf-8"))
    payload["candidates"][1]["acceptance_criteria"] = []
    path = write_temp(payload)
    result = run_validator(path)
    assert result.returncode == 1
    assert "acceptance_criteria must be a non-empty array" in result.stdout


if __name__ == "__main__":
    tests = [
        test_valid_example,
        test_missing_falsification_route_fails,
        test_bad_drive_score_fails,
        test_missing_acceptance_criteria_fails,
    ]
    failures = 0
    for test in tests:
        try:
            test()
            print(f"PASS {test.__name__}")
        except AssertionError as exc:
            failures += 1
            print(f"FAIL {test.__name__}: {exc}")
    raise SystemExit(1 if failures else 0)
