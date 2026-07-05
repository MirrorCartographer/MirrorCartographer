#!/usr/bin/env python3
"""Regression tests for the dual-source hypothesis gate."""

from __future__ import annotations

import json
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
TOOL = ROOT / "tools" / "dual_source_hypothesis_gate" / "score_dual_source_packet.py"
FIXTURES = ROOT / "tools" / "dual_source_hypothesis_gate" / "fixtures.synthetic.json"


def test_fixture_expectations() -> None:
    packets = json.loads(FIXTURES.read_text(encoding="utf-8"))
    namespace: dict[str, object] = {}
    exec(TOOL.read_text(encoding="utf-8"), namespace)
    score_packet = namespace["score_packet"]

    results = [score_packet(packet) for packet in packets]
    failures = [result for result in results if not result["passed_fixture_expectation"]]
    assert not failures, failures


def test_cli_strict_mode() -> None:
    completed = subprocess.run(
        [sys.executable, str(TOOL), str(FIXTURES), "--strict"],
        check=False,
        capture_output=True,
        text=True,
    )
    assert completed.returncode == 0, completed.stderr + completed.stdout
    assert "dshg_pass_001" in completed.stdout


if __name__ == "__main__":
    test_fixture_expectations()
    test_cli_strict_mode()
    print("dual_source_hypothesis_gate tests passed")
