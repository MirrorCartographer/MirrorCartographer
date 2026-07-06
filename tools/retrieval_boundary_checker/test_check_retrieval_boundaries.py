#!/usr/bin/env python3
"""Regression tests for the MC Retrieval Boundary Checker."""

from __future__ import annotations

import importlib.util
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent
MODULE_PATH = ROOT / "check_retrieval_boundaries.py"
FIXTURE_PATH = ROOT / "fixtures.synthetic.json"

spec = importlib.util.spec_from_file_location("check_retrieval_boundaries", MODULE_PATH)
checker = importlib.util.module_from_spec(spec)
assert spec.loader is not None
spec.loader.exec_module(checker)


def load_fixtures():
    return json.loads(FIXTURE_PATH.read_text(encoding="utf-8"))


def test_fixture_expected_decisions_match_actual_decisions():
    packets = load_fixtures()
    results = checker.evaluate_packets(packets, enforce_expected=False)
    by_id = {result.packet_id: result for result in results}
    for packet in packets:
        assert by_id[packet["id"]].decision == packet["expected_decision"], by_id[packet["id"]].reasons


def test_private_input_cannot_route_to_public_memory():
    packet = next(p for p in load_fixtures() if p["id"] == "rbc_fail_private_detail_to_public_memory")
    result = checker.check_packet(packet)
    assert result.decision == "fail"
    assert any("private input" in reason for reason in result.reasons)


def test_advice_leak_is_rejected_even_when_public_safe():
    packet = next(p for p in load_fixtures() if p["id"] == "rbc_fail_medical_advice_leak")
    result = checker.check_packet(packet)
    assert result.decision == "fail"
    assert any("advice" in reason for reason in result.reasons)


def test_private_abstracted_packet_can_enter_private_partition():
    packet = next(p for p in load_fixtures() if p["id"] == "rbc_pass_private_to_private_abstracted_memory")
    result = checker.check_packet(packet)
    assert result.decision == "pass"
    assert result.reasons == []


def test_unknown_source_status_is_rejected():
    packet = next(p for p in load_fixtures() if p["id"] == "rbc_fail_unknown_source_status")
    result = checker.check_packet(packet)
    assert result.decision == "fail"
    assert any("source_status" in reason for reason in result.reasons)


if __name__ == "__main__":
    test_fixture_expected_decisions_match_actual_decisions()
    test_private_input_cannot_route_to_public_memory()
    test_advice_leak_is_rejected_even_when_public_safe()
    test_private_abstracted_packet_can_enter_private_partition()
    test_unknown_source_status_is_rejected()
    print("retrieval boundary checker tests passed")
