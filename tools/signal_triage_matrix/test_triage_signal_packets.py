#!/usr/bin/env python3
"""Regression tests for Signal Triage Matrix."""

from __future__ import annotations

import json
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent
SCRIPT = ROOT / "triage_signal_packets.py"
FIXTURES = ROOT / "fixtures.synthetic.json"


def run_cli(path: Path) -> subprocess.CompletedProcess[str]:
    return subprocess.run(
        [sys.executable, str(SCRIPT), str(path)],
        check=False,
        text=True,
        capture_output=True,
    )


def test_valid_fixtures_pass() -> None:
    result = run_cli(FIXTURES)
    assert result.returncode == 0, result.stderr + result.stdout
    payload = json.loads(result.stdout)
    assert payload["component"] == "signal_triage_matrix"
    assert payload["total_packets"] == 3
    assert payload["invalid_packets"] == 0
    assert payload["route_counts"]["hold_for_controls"] == 1
    assert payload["route_counts"]["route_to_animal_evidence_router"] == 1
    assert payload["route_counts"]["export_as_uncertainty_only"] == 1


def test_forbidden_certainty_language_fails(tmp_path: Path) -> None:
    packet = {
        "packet_id": "bad_certainty",
        "domain": "hypothesis_generation",
        "signal_label": "bad_signal",
        "observation_summary": "This synthetic packet uses forbidden certainty language and should fail validation.",
        "source_status": "synthetic_fixture",
        "claim_status": "candidate_signal_not_conclusion",
        "privacy_status": "public_safe_synthetic",
        "missingness": ["control group"],
        "variables": ["x_score", "y_score"],
        "evidence_refs": ["synthetic_ref"],
        "risk_of_false_pattern": "high",
        "triage_route": "candidate_for_hypothesis_generation",
        "falsification_route": "Compare against negative controls and reject the signal if matched controls show the same pattern.",
        "next_executable_action": "Send to the fixture generator with paired controls.",
    }
    packet["observation_summary"] += " It proves the cure."
    path = tmp_path / "bad.json"
    path.write_text(json.dumps({"packets": [packet]}), encoding="utf-8")

    result = run_cli(path)
    assert result.returncode == 1
    payload = json.loads(result.stdout)
    assert payload["invalid_packets"] == 1
    assert "forbidden" in payload["results"][0]["errors"][0]


def test_missing_variables_fail(tmp_path: Path) -> None:
    fixture = json.loads(FIXTURES.read_text(encoding="utf-8"))
    fixture["packets"][0]["variables"] = ["eye_strain_score"]
    path = tmp_path / "missing_variables.json"
    path.write_text(json.dumps(fixture), encoding="utf-8")

    result = run_cli(path)
    assert result.returncode == 1
    payload = json.loads(result.stdout)
    assert payload["invalid_packets"] == 1
    assert any("variables" in err for err in payload["results"][0]["errors"])


if __name__ == "__main__":
    test_valid_fixtures_pass()
    import tempfile
    with tempfile.TemporaryDirectory() as d:
        test_forbidden_certainty_language_fails(Path(d))
    with tempfile.TemporaryDirectory() as d:
        test_missing_variables_fail(Path(d))
    print("ok")
