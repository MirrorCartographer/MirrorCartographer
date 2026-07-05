#!/usr/bin/env python3
"""Regression tests for validate_bridge_packet.py.

Run from repository root:
  python tools/mechanistic_verification_bridge/test_validate_bridge_packet.py
"""

from __future__ import annotations

import importlib.util
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent
VALIDATOR_PATH = ROOT / "validate_bridge_packet.py"
FIXTURE_PATH = ROOT / "fixtures.synthetic.json"

spec = importlib.util.spec_from_file_location("validate_bridge_packet", VALIDATOR_PATH)
module = importlib.util.module_from_spec(spec)
assert spec.loader is not None
spec.loader.exec_module(module)


def test_fixture_expectations() -> None:
    fixtures = json.loads(FIXTURE_PATH.read_text(encoding="utf-8"))
    assert fixtures, "fixtures must not be empty"
    for fixture in fixtures:
        valid, errors = module.validate_packet(fixture["packet"])
        assert valid == fixture["expected_valid"], f"{fixture['name']} errors={errors}"


def test_private_status_forces_private_rejection() -> None:
    fixtures = json.loads(FIXTURE_PATH.read_text(encoding="utf-8"))
    packet = dict(fixtures[0]["packet"])
    packet["packet_id"] = "mvb_private_gate_test"
    packet["privacy_status"] = "reject_private"
    packet["admission_decision"] = "admit_to_hypothesis_backlog"
    valid, errors = module.validate_packet(packet)
    assert not valid
    assert any("reject_private" in error for error in errors)


def test_supported_requires_real_evidence_strength() -> None:
    fixtures = json.loads(FIXTURE_PATH.read_text(encoding="utf-8"))
    packet = dict(fixtures[0]["packet"])
    packet["packet_id"] = "mvb_supported_gate_test"
    packet["claim_status"] = "supported"
    packet["evidence_strength"] = "low"
    valid, errors = module.validate_packet(packet)
    assert not valid
    assert any("supported claims require" in error for error in errors)


def test_hold_for_missingness_can_pass_without_evidence() -> None:
    fixtures = json.loads(FIXTURE_PATH.read_text(encoding="utf-8"))
    hold_fixture = next(item for item in fixtures if item["name"] == "pass_hold_for_missingness")
    valid, errors = module.validate_packet(hold_fixture["packet"])
    assert valid, errors


if __name__ == "__main__":
    test_fixture_expectations()
    test_private_status_forces_private_rejection()
    test_supported_requires_real_evidence_strength()
    test_hold_for_missingness_can_pass_without_evidence()
    print("all mechanistic verification bridge tests passed")
