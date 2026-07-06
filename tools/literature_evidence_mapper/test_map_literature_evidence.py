#!/usr/bin/env python3
"""Regression tests for literature evidence mapper."""

from __future__ import annotations

import json
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent
SCRIPT = ROOT / "map_literature_evidence.py"
FIXTURES = ROOT / "fixtures.synthetic.json"


def run_cli() -> dict:
    completed = subprocess.run(
        [sys.executable, str(SCRIPT), str(FIXTURES)],
        check=True,
        capture_output=True,
        text=True,
    )
    return json.loads(completed.stdout)


def test_valid_packets_route_to_map_ready() -> None:
    result = run_cli()
    ready_ids = {entry["id"] for entry in result["queues"]["map_ready"]}
    assert "litmap-valid-001" in ready_ids
    assert "litmap-valid-002" in ready_ids
    assert result["accepted_count"] == 2


def test_private_packet_is_blocked() -> None:
    result = run_cli()
    blocked_ids = {entry["id"] for entry in result["queues"]["blocked_privacy"]}
    assert "litmap-reject-privacy-001" in blocked_ids


def test_overclaim_packet_is_blocked() -> None:
    result = run_cli()
    blocked_ids = {entry["id"] for entry in result["queues"]["blocked_overclaim"]}
    assert "litmap-reject-overclaim-001" in blocked_ids
    reasons = next(entry["reasons"] for entry in result["queues"]["blocked_overclaim"] if entry["id"] == "litmap-reject-overclaim-001")
    assert "blocked_overclaim" in reasons


def test_component_labels_are_present() -> None:
    result = run_cli()
    assert result["component"] == "literature_evidence_mapper"
    assert result["claim_status"] == "research_organization_only_not_medical_or_veterinary_advice"
    assert result["rejected_count"] == 2


if __name__ == "__main__":
    test_valid_packets_route_to_map_ready()
    test_private_packet_is_blocked()
    test_overclaim_packet_is_blocked()
    test_component_labels_are_present()
    print("literature_evidence_mapper tests passed")
