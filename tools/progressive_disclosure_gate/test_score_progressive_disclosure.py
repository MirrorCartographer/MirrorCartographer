#!/usr/bin/env python3
"""Regression tests for the progressive disclosure gate."""

from __future__ import annotations

import json
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
FIXTURE = ROOT / "tools" / "progressive_disclosure_gate" / "fixtures.synthetic.json"
SCORER = ROOT / "tools" / "progressive_disclosure_gate" / "score_progressive_disclosure.py"


def test_fixture_file_has_required_labels() -> None:
    payload = json.loads(FIXTURE.read_text(encoding="utf-8"))
    required = [
        "source_status",
        "claim_status",
        "privacy_status",
        "missingness",
        "revision_reason",
        "implementation_status",
        "testability",
        "hypothesis_under_test",
    ]
    missing = [field for field in required if not payload.get(field)]
    assert not missing, f"missing required top-level labels: {missing}"


def test_each_fixture_has_falsification_and_variables() -> None:
    payload = json.loads(FIXTURE.read_text(encoding="utf-8"))
    for item in payload["fixtures"]:
        assert item.get("falsification_route"), item["id"]
        assert item.get("measurable_variables"), item["id"]
        assert item.get("expected_classification"), item["id"]


def test_scorer_classifies_all_synthetic_fixtures() -> None:
    completed = subprocess.run(
        [sys.executable, str(SCORER), str(FIXTURE)],
        cwd=str(ROOT),
        text=True,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        check=False,
    )
    assert completed.returncode == 0, completed.stdout + completed.stderr
    report = json.loads(completed.stdout)
    assert report["summary"]["all_passed"] is True
    assert report["summary"]["total"] == 4


if __name__ == "__main__":
    test_fixture_file_has_required_labels()
    test_each_fixture_has_falsification_and_variables()
    test_scorer_classifies_all_synthetic_fixtures()
    print("progressive disclosure gate tests passed")
