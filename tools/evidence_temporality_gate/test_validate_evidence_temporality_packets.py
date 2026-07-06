#!/usr/bin/env python3
"""Minimal tests for the MC Evidence Temporality Gate validator."""

from __future__ import annotations

import copy
import json
import subprocess
import sys
import tempfile
from pathlib import Path

from validate_evidence_temporality_packets import validate_packet

ROOT = Path(__file__).resolve().parent
FIXTURES = ROOT / "fixtures.synthetic.json"
VALIDATOR = ROOT / "validate_evidence_temporality_packets.py"


def load_fixtures() -> list[dict]:
    return json.loads(FIXTURES.read_text(encoding="utf-8"))


def test_valid_fixture_passes() -> None:
    valid = load_fixtures()[0]
    assert validate_packet(valid) == []


def test_unknown_time_fixture_fails() -> None:
    invalid = load_fixtures()[1]
    errors = validate_packet(invalid)
    assert errors
    assert any("event order is not usable" in error for error in errors)


def test_private_rejected_fixture_fails() -> None:
    invalid = load_fixtures()[2]
    errors = validate_packet(invalid)
    assert errors
    assert any("privacy_status blocks" in error for error in errors)


def test_unordered_known_times_fail() -> None:
    packet = copy.deepcopy(load_fixtures()[0])
    packet["packet_id"] = "etg-unordered-known-times"
    packet["events"][0]["time_anchor"] = "2026-01-03T09:00:00Z"
    packet["events"][1]["time_anchor"] = "2026-01-02T09:00:00Z"
    errors = validate_packet(packet)
    assert any("chronological" in error for error in errors)


def test_advice_like_text_fails() -> None:
    packet = copy.deepcopy(load_fixtures()[0])
    packet["packet_id"] = "etg-advice-leak"
    packet["hypothesis_claim"] = "This packet tries to diagnose or treat instead of organizing evidence for research questions."
    errors = validate_packet(packet)
    assert any("advice-like" in error for error in errors)


def test_cli_fails_on_mixed_fixture_file() -> None:
    result = subprocess.run(
        [sys.executable, str(VALIDATOR), str(FIXTURES)],
        cwd=str(ROOT),
        text=True,
        capture_output=True,
        check=False,
    )
    assert result.returncode == 1
    assert "FAIL:" in result.stdout


def test_cli_passes_single_valid_file() -> None:
    valid = load_fixtures()[0]
    with tempfile.NamedTemporaryFile("w", suffix=".json", encoding="utf-8", delete=False) as handle:
        json.dump(valid, handle)
        temp_path = Path(handle.name)
    try:
        result = subprocess.run(
            [sys.executable, str(VALIDATOR), str(temp_path)],
            cwd=str(ROOT),
            text=True,
            capture_output=True,
            check=False,
        )
        assert result.returncode == 0
        assert "PASS:" in result.stdout
    finally:
        temp_path.unlink(missing_ok=True)


if __name__ == "__main__":
    tests = [
        test_valid_fixture_passes,
        test_unknown_time_fixture_fails,
        test_private_rejected_fixture_fails,
        test_unordered_known_times_fail,
        test_advice_like_text_fails,
        test_cli_fails_on_mixed_fixture_file,
        test_cli_passes_single_valid_file,
    ]
    for test in tests:
        test()
    print(f"PASS: {len(tests)} evidence temporality tests passed")
