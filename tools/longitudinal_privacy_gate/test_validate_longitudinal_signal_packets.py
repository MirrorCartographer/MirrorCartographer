#!/usr/bin/env python3
"""Regression tests for the longitudinal privacy gate."""

from __future__ import annotations

import importlib.util
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent
VALIDATOR_PATH = ROOT / "validate_longitudinal_signal_packets.py"
FIXTURE_PATH = ROOT / "fixtures.synthetic.json"

spec = importlib.util.spec_from_file_location("validator", VALIDATOR_PATH)
validator = importlib.util.module_from_spec(spec)
assert spec.loader is not None
spec.loader.exec_module(validator)


def test_fixture_expectations() -> None:
    fixtures = json.loads(FIXTURE_PATH.read_text(encoding="utf-8"))
    assert fixtures, "fixture file must not be empty"
    for fixture in fixtures:
        errors = validator.validate_packet(fixture["packet"])
        observed_valid = not errors
        assert observed_valid is fixture["expect_valid"], f"{fixture['name']} errors={errors}"


def test_private_blocked_rejected() -> None:
    packet = json.loads(FIXTURE_PATH.read_text(encoding="utf-8"))[0]["packet"]
    packet = json.loads(json.dumps(packet))
    packet["packet_id"] = "lsp_private_status_manual"
    packet["privacy_status"] = "private_blocked"
    errors = validator.validate_packet(packet)
    assert any("private_blocked" in error for error in errors)


def test_absolute_timestamp_rejected_even_when_flag_true() -> None:
    packet = json.loads(FIXTURE_PATH.read_text(encoding="utf-8"))[0]["packet"]
    packet = json.loads(json.dumps(packet))
    packet["packet_id"] = "lsp_absolute_timestamp_manual"
    packet["time_index"]["sequence_label"] = "2026-07-05T20:00:00-04:00"
    packet["time_index"]["absolute_time_removed"] = True
    errors = validator.validate_packet(packet)
    assert any("absolute timestamp" in error for error in errors)


def test_requires_operational_variable() -> None:
    packet = json.loads(FIXTURE_PATH.read_text(encoding="utf-8"))[0]["packet"]
    packet = json.loads(json.dumps(packet))
    packet["packet_id"] = "lsp_no_variables_manual"
    packet["observable_variables"] = []
    errors = validator.validate_packet(packet)
    assert any("observable_variables" in error for error in errors)


def test_requires_raw_transcript_exclusion() -> None:
    packet = json.loads(FIXTURE_PATH.read_text(encoding="utf-8"))[0]["packet"]
    packet = json.loads(json.dumps(packet))
    packet["packet_id"] = "lsp_no_raw_transcript_manual"
    packet["context_boundaries"]["excluded_private_fields"] = ["name", "exact_location"]
    errors = validator.validate_packet(packet)
    assert any("raw_transcript" in error for error in errors)


if __name__ == "__main__":
    test_fixture_expectations()
    test_private_blocked_rejected()
    test_absolute_timestamp_rejected_even_when_flag_true()
    test_requires_operational_variable()
    test_requires_raw_transcript_exclusion()
    print("longitudinal_privacy_gate tests passed")
