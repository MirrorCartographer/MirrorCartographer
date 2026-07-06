#!/usr/bin/env python3
"""Regression tests for animal-health evidence packet validation."""

from __future__ import annotations

import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent
VALIDATOR = ROOT / "validate_animal_health_evidence_packet.py"
FIXTURES = ROOT / "fixtures.synthetic.json"


def test_synthetic_fixtures_match_expected_outcomes() -> None:
    result = subprocess.run(
        [sys.executable, str(VALIDATOR), str(FIXTURES), "--fixtures"],
        cwd=str(ROOT),
        text=True,
        capture_output=True,
        check=False,
    )
    assert result.returncode == 0, result.stdout + result.stderr
    assert "PASS valid_companion_animal_longitudinal_glaucoma_packet" in result.stdout
    assert "PASS invalid_treatment_advice_packet" in result.stdout


if __name__ == "__main__":
    test_synthetic_fixtures_match_expected_outcomes()
    print("animal_health_evidence_gate tests passed")
