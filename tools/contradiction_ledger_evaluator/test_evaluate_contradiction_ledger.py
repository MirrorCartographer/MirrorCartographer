#!/usr/bin/env python3
"""Regression tests for evaluate_contradiction_ledger.py."""

from __future__ import annotations

import json
import subprocess
import sys
from pathlib import Path

SCRIPT = Path(__file__).with_name("evaluate_contradiction_ledger.py")
FIXTURES = Path(__file__).with_name("fixtures.synthetic.json")


def run_json_report() -> dict:
    completed = subprocess.run(
        [sys.executable, str(SCRIPT), str(FIXTURES), "--json"],
        check=True,
        text=True,
        capture_output=True,
    )
    return json.loads(completed.stdout)


def test_fixture_routes() -> None:
    report = run_json_report()
    routes = {item["id"]: item["route"] for item in report["results"]}

    assert routes["contradiction.synthetic.001"] == "ready_for_falsification"
    assert routes["contradiction.synthetic.002"] == "needs_normalization"
    assert routes["contradiction.synthetic.003"] == "needs_evidence"
    assert routes["contradiction.synthetic.004"] == "blocked_public_export"


def test_counts_are_reported() -> None:
    report = run_json_report()
    assert report["counts"]["ready_for_falsification"] == 1
    assert report["counts"]["needs_normalization"] == 1
    assert report["counts"]["needs_evidence"] == 1
    assert report["counts"]["blocked_public_export"] == 1


def test_human_readable_cli_output() -> None:
    completed = subprocess.run(
        [sys.executable, str(SCRIPT), str(FIXTURES)],
        check=True,
        text=True,
        capture_output=True,
    )
    assert "Contradiction Ledger Evaluation" in completed.stdout
    assert "contradiction.synthetic.001: ready_for_falsification" in completed.stdout


if __name__ == "__main__":
    test_fixture_routes()
    test_counts_are_reported()
    test_human_readable_cli_output()
    print("ok")
