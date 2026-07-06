#!/usr/bin/env python3
"""Regression tests for the hypothesis falsification runner."""

from __future__ import annotations

import json
import subprocess
import sys
from pathlib import Path

SCRIPT_DIR = Path(__file__).resolve().parent
RUNNER = SCRIPT_DIR / "route_hypothesis_falsification_packets.py"
FIXTURES = SCRIPT_DIR / "fixtures.synthetic.json"


def load_fixture_results() -> dict:
    completed = subprocess.run(
        [sys.executable, str(RUNNER), str(FIXTURES)],
        check=True,
        capture_output=True,
        text=True,
    )
    return json.loads(completed.stdout)


def result_by_id(output: dict, packet_id: str) -> dict:
    for result in output["results"]:
        if result["id"] == packet_id:
            return result
    raise AssertionError(f"Missing result for {packet_id}")


def test_ready_packet_routes_to_test_plan() -> None:
    output = load_fixture_results()
    result = result_by_id(output, "HYP-SYN-001")
    assert result["route"] == "ready_for_test_plan"
    assert result["score"] >= 9
    assert "has_falsification_route" in result["reasons"]


def test_vague_symbolic_packet_needs_operationalization() -> None:
    output = load_fixture_results()
    result = result_by_id(output, "HYP-SYN-002")
    assert result["route"] == "needs_operationalization"
    assert "missing_variables" in result["blockers"]
    assert "missing_falsification_route" in result["blockers"]


def test_overclaim_packet_is_rejected() -> None:
    output = load_fixture_results()
    result = result_by_id(output, "HYP-SYN-003")
    assert result["route"] == "reject_overclaim"
    assert "overclaim_or_certainty_language" in result["blockers"]


def test_private_raw_packet_routes_to_privacy_hold() -> None:
    output = load_fixture_results()
    result = result_by_id(output, "HYP-SYN-004")
    assert result["route"] == "privacy_hold"
    assert "privacy_boundary_violation" in result["blockers"]


def test_unsourced_packet_needs_evidence() -> None:
    output = load_fixture_results()
    result = result_by_id(output, "HYP-SYN-005")
    assert result["route"] == "needs_evidence"
    assert "missing_evidence_refs" in result["blockers"]


def test_summary_counts_are_stable() -> None:
    output = load_fixture_results()
    assert output["summary"] == {
        "ready_for_test_plan": 1,
        "needs_operationalization": 1,
        "needs_evidence": 1,
        "privacy_hold": 1,
        "reject_overclaim": 1,
    }


if __name__ == "__main__":
    test_ready_packet_routes_to_test_plan()
    test_vague_symbolic_packet_needs_operationalization()
    test_overclaim_packet_is_rejected()
    test_private_raw_packet_routes_to_privacy_hold()
    test_unsourced_packet_needs_evidence()
    test_summary_counts_are_stable()
    print("hypothesis_falsification_runner tests passed")
