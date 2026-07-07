#!/usr/bin/env python3
"""Tests for Signal Triage Evaluator."""

from __future__ import annotations

import json
import subprocess
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
SCRIPT = HERE / "evaluate_signal_triage.py"
FIXTURES = HERE / "fixtures.synthetic.json"


def run_cli() -> dict:
    completed = subprocess.run(
        [sys.executable, str(SCRIPT), str(FIXTURES)],
        check=True,
        capture_output=True,
        text=True,
    )
    return json.loads(completed.stdout)


def by_id(results: dict, cluster_id: str) -> dict:
    for item in results["triage_results"]:
        if item["cluster_id"] == cluster_id:
            return item
    raise AssertionError(f"missing cluster_id {cluster_id}")


def test_watch_route() -> None:
    result = by_id(run_cli(), "synthetic-watch-001")
    assert result["route"] == "watch"
    assert result["score"] >= 2
    assert "missingness_present" in result["reasons"]
    assert result["blockers"] == []


def test_falsification_route() -> None:
    result = by_id(run_cli(), "synthetic-falsify-001")
    assert result["route"] == "falsification_queue"
    assert result["next_action"] == "create_counterexample_tasks"
    assert result["blockers"] == []


def test_private_route_blocks() -> None:
    result = by_id(run_cli(), "synthetic-block-private-001")
    assert result["route"] == "archive_only"
    assert "privacy_not_public_safe" in result["blockers"]


def test_cure_claim_blocks() -> None:
    result = by_id(run_cli(), "synthetic-block-claim-001")
    assert result["route"] == "archive_only"
    assert "blocked_claim_status:cure_claim" in result["blockers"]


def test_cli_is_deterministic() -> None:
    first = run_cli()
    second = run_cli()
    assert first == second


if __name__ == "__main__":
    test_watch_route()
    test_falsification_route()
    test_private_route_blocks()
    test_cure_claim_blocks()
    test_cli_is_deterministic()
    print("ok")
