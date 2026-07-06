#!/usr/bin/env python3
"""Regression tests for validate_agent_judgment_packets.py.

Run from repository root:
    python tools/agent_judgment_gate/test_validate_agent_judgment_packets.py
"""
from __future__ import annotations

import importlib.util
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
MODULE_PATH = ROOT / "tools" / "agent_judgment_gate" / "validate_agent_judgment_packets.py"
FIXTURE_PATH = ROOT / "tools" / "agent_judgment_gate" / "fixtures.synthetic.json"

spec = importlib.util.spec_from_file_location("validate_agent_judgment_packets", MODULE_PATH)
module = importlib.util.module_from_spec(spec)
assert spec and spec.loader
spec.loader.exec_module(module)


def load_fixtures():
    return json.loads(FIXTURE_PATH.read_text(encoding="utf-8"))


def test_expected_fixture_outcomes():
    fixtures = load_fixtures()
    by_id = {fixture["packet_id"]: fixture for fixture in fixtures}

    assert not module.validate_packet(by_id["pass.dataset_backed_judgment"])
    assert module.validate_packet(by_id["fail.no_ambiguity"])
    assert module.validate_packet(by_id["fail.private_or_advice_leak"])


def test_privacy_rejection_blocks_otherwise_complete_packet():
    packet = load_fixtures()[0]
    packet = dict(packet)
    packet["packet_id"] = "fail.synthetic_privacy_boundary"
    packet["privacy_status"] = "reject_private"
    errors = module.validate_packet(packet)
    assert any("reject_private" in error for error in errors)


def test_requires_two_measurable_variables():
    packet = load_fixtures()[0]
    packet = dict(packet)
    packet["packet_id"] = "fail.one_variable"
    packet["measurable_variables"] = ["only_one"]
    errors = module.validate_packet(packet)
    assert any("measurable_variables" in error for error in errors)


def test_requires_supported_atomic_fact():
    packet = load_fixtures()[0]
    packet = dict(packet)
    packet["packet_id"] = "fail.no_supported_fact"
    packet["atomic_fact_checks"] = [dict(item, support_status="partial") for item in packet["atomic_fact_checks"]]
    errors = module.validate_packet(packet)
    assert any("at least one atomic fact" in error for error in errors)


def main():
    test_expected_fixture_outcomes()
    test_privacy_rejection_blocks_otherwise_complete_packet()
    test_requires_two_measurable_variables()
    test_requires_supported_atomic_fact()
    print("agent_judgment_gate tests passed")


if __name__ == "__main__":
    main()
