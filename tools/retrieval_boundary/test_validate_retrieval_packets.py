#!/usr/bin/env python3
"""Regression tests for validate_retrieval_packets.py."""

from __future__ import annotations

import copy
import json
import pathlib
import sys

THIS_DIR = pathlib.Path(__file__).resolve().parent
sys.path.insert(0, str(THIS_DIR))

from validate_retrieval_packets import validate_packet  # noqa: E402


def load_fixtures():
    with open(THIS_DIR / "fixtures.synthetic.json", "r", encoding="utf-8") as handle:
        return json.load(handle)["fixtures"]


def test_fixture_routes():
    fixtures = load_fixtures()
    for fixture in fixtures:
        result = validate_packet(fixture["packet"])
        assert result.valid, f"{result.packet_id} should be valid fixture: {result.errors}"
        assert result.route == fixture["expected_result"], f"{result.packet_id}: expected {fixture['expected_result']}, got {result.route}"


def test_private_status_cannot_accept_to_memory():
    packet = copy.deepcopy(load_fixtures()[2]["packet"])
    packet["boundary_decision"]["route"] = "accept_to_memory"
    packet["boundary_decision"]["requires_human_review"] = False
    result = validate_packet(packet)
    assert not result.valid
    assert any("blocked privacy status" in error for error in result.errors)


def test_weak_high_inference_cannot_accept_to_memory():
    packet = copy.deepcopy(load_fixtures()[1]["packet"])
    packet["boundary_decision"]["route"] = "accept_to_memory"
    packet["boundary_decision"]["requires_human_review"] = False
    result = validate_packet(packet)
    assert not result.valid
    assert any("weak or uncertain evidence" in error for error in result.errors)


def test_contradicted_claim_routes_to_ledger():
    packet = copy.deepcopy(load_fixtures()[0]["packet"])
    packet["claim_status"] = "contradicted"
    packet["boundary_decision"]["route"] = "accept_to_memory"
    result = validate_packet(packet)
    assert not result.valid
    assert any("contradiction ledger" in error for error in result.errors)


def run_tests():
    tests = [
        test_fixture_routes,
        test_private_status_cannot_accept_to_memory,
        test_weak_high_inference_cannot_accept_to_memory,
        test_contradicted_claim_routes_to_ledger,
    ]
    for test in tests:
        test()
    print(f"passed {len(tests)} retrieval boundary validator tests")


if __name__ == "__main__":
    run_tests()
