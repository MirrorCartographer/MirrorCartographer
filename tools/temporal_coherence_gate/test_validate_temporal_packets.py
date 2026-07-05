#!/usr/bin/env python3
"""Regression tests for the MC temporal coherence gate."""
from __future__ import annotations

import json
from pathlib import Path

from validate_temporal_packets import validate_packet

ROOT = Path(__file__).resolve().parent
FIXTURES = ROOT / "fixtures.synthetic.json"


def test_fixtures_match_expected_results() -> None:
    fixtures = json.loads(FIXTURES.read_text(encoding="utf-8"))
    assert fixtures, "fixtures must not be empty"
    for fixture in fixtures:
        errors = validate_packet(fixture["packet"])
        assert (not errors) is fixture["should_pass"], (fixture["name"], errors)


def test_missing_observed_value_is_rejected() -> None:
    packet = json.loads(FIXTURES.read_text(encoding="utf-8"))[0]["packet"]
    packet = json.loads(json.dumps(packet))
    del packet["observations"][0]["value"]
    errors = validate_packet(packet)
    assert any("observed but has no value" in error for error in errors)


def test_missing_state_with_value_is_rejected() -> None:
    packet = json.loads(FIXTURES.read_text(encoding="utf-8"))[0]["packet"]
    packet = json.loads(json.dumps(packet))
    packet["observations"][1]["value"] = 0
    errors = validate_packet(packet)
    assert any("missing value_status but still contains value" in error for error in errors)


def test_single_timepoint_is_rejected() -> None:
    packet = json.loads(FIXTURES.read_text(encoding="utf-8"))[0]["packet"]
    packet = json.loads(json.dumps(packet))
    packet["observations"] = packet["observations"][:1]
    errors = validate_packet(packet)
    assert any("at least two timepoints" in error for error in errors)


if __name__ == "__main__":
    test_fixtures_match_expected_results()
    test_missing_observed_value_is_rejected()
    test_missing_state_with_value_is_rejected()
    test_single_timepoint_is_rejected()
    print("PASS: temporal coherence gate regression tests")
