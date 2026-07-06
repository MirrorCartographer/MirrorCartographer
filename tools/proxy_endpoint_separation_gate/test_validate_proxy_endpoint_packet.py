#!/usr/bin/env python3
"""Regression test for proxy endpoint separation validator."""
from __future__ import annotations

import json
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent
VALIDATOR = ROOT / "validate_proxy_endpoint_packet.py"
FIXTURES = ROOT / "fixtures.synthetic.json"


def test_fixture_expectations() -> None:
    result = subprocess.run(
        [sys.executable, str(VALIDATOR), str(FIXTURES)],
        check=False,
        text=True,
        capture_output=True,
    )
    assert result.returncode == 0, result.stdout + result.stderr
    assert "valid_longitudinal_research_packet: PASS" in result.stdout
    assert "invalid_proxy_as_cure_packet: FAIL" in result.stdout


def test_promotion_requires_reject_or_revise_falsification(tmp_path: Path) -> None:
    fixtures = json.loads(FIXTURES.read_text(encoding="utf-8"))
    packet = fixtures[0]["packet"]
    packet["memory_action"] = "promote_to_discovery_candidate"
    packet["falsification_route"] = "Only positive evidence is considered for this promotion path."
    candidate = tmp_path / "candidate.json"
    candidate.write_text(json.dumps(packet, indent=2), encoding="utf-8")
    result = subprocess.run(
        [sys.executable, str(VALIDATOR), str(candidate)],
        check=False,
        text=True,
        capture_output=True,
    )
    assert result.returncode == 1
    assert "must state reject or revise conditions" in result.stdout


if __name__ == "__main__":
    test_fixture_expectations()
    import tempfile
    with tempfile.TemporaryDirectory() as directory:
        test_promotion_requires_reject_or_revise_falsification(Path(directory))
    print("proxy endpoint separation tests passed")
