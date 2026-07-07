#!/usr/bin/env python3
"""Regression tests for the Research Workflow Evidence Gate."""

from __future__ import annotations

import json
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent
VALIDATOR = ROOT / "validate_research_workflow_evidence_packet.py"
VALID_FIXTURE = ROOT / "fixtures" / "valid_research_workflow_evidence_packet.json"
INVALID_FIXTURE = ROOT / "fixtures" / "invalid_research_workflow_evidence_packet.json"


def run_validator(path: Path) -> subprocess.CompletedProcess[str]:
    return subprocess.run(
        [sys.executable, str(VALIDATOR), str(path)],
        check=False,
        text=True,
        capture_output=True,
    )


def test_valid_fixture_passes() -> None:
    result = run_validator(VALID_FIXTURE)
    assert result.returncode == 0, result.stderr
    assert "VALID" in result.stdout


def test_invalid_fixture_fails() -> None:
    result = run_validator(INVALID_FIXTURE)
    assert result.returncode != 0
    assert "INVALID" in result.stderr


def test_validation_stage_required_for_promotable_claims(tmp_path: Path) -> None:
    packet = json.loads(VALID_FIXTURE.read_text(encoding="utf-8"))
    packet["workflow_stage_coverage"]["validation_or_operations"] = "missing"
    test_path = tmp_path / "missing_validation.json"
    test_path.write_text(json.dumps(packet, indent=2), encoding="utf-8")
    result = run_validator(test_path)
    assert result.returncode != 0
    assert "validation_or_operations" in result.stderr


def test_implemented_packet_cannot_use_unknown_privacy(tmp_path: Path) -> None:
    packet = json.loads(VALID_FIXTURE.read_text(encoding="utf-8"))
    packet["privacy_status"]["classification"] = "unknown"
    test_path = tmp_path / "unknown_privacy.json"
    test_path.write_text(json.dumps(packet, indent=2), encoding="utf-8")
    result = run_validator(test_path)
    assert result.returncode != 0
    assert "privacy" in result.stderr.lower()


def main() -> int:
    checks = [
        ("valid fixture passes", run_validator(VALID_FIXTURE).returncode == 0),
        ("invalid fixture fails", run_validator(INVALID_FIXTURE).returncode != 0),
    ]
    failures = [name for name, ok in checks if not ok]
    if failures:
        print("FAILED: " + ", ".join(failures), file=sys.stderr)
        return 1
    print("PASS: research workflow evidence gate fixtures behave as expected")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
