#!/usr/bin/env python3
"""Smoke tests for observation-question triage validation."""

from __future__ import annotations

import importlib.util
from pathlib import Path

MODULE_PATH = Path(__file__).with_name("validate_observation_question_packets.py")
spec = importlib.util.spec_from_file_location("validator", MODULE_PATH)
validator = importlib.util.module_from_spec(spec)
assert spec and spec.loader
spec.loader.exec_module(validator)


def test_fixture_expectations() -> None:
    packets = validator.load_packets(Path(__file__).with_name("fixtures.synthetic.json"))
    results = {packet["packet_id"]: validator.validate_packet(packet) for packet in packets}

    assert results["oqtg-pass-001"] == []
    assert any("privacy_status blocks" in err for err in results["oqtg-fail-private-001"])
    assert any("advice-like" in err for err in results["oqtg-fail-advice-001"])


def test_missingness_never_negative() -> None:
    packet = validator.load_packets(Path(__file__).with_name("fixtures.synthetic.json"))[0]
    packet["missingness"]["absence_interpreted_as_negative"] = True
    errors = validator.validate_packet(packet)
    assert any("missingness" in err for err in errors)


if __name__ == "__main__":
    test_fixture_expectations()
    test_missingness_never_negative()
    print("observation_question_triage_gate tests passed")
