#!/usr/bin/env python3
"""Regression tests for the Virtual Cell Fidelity Gate."""

from __future__ import annotations

import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent
VALID = ROOT / "fixtures" / "valid_virtual_cell_fidelity_packet.json"
INVALID = ROOT / "fixtures" / "invalid_reconstruction_only_packet.json"
VALIDATOR = ROOT / "validate_virtual_cell_fidelity_packet.py"


def run(packet: Path) -> subprocess.CompletedProcess[str]:
    return subprocess.run(
        [sys.executable, str(VALIDATOR), str(packet)],
        text=True,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        check=False,
    )


def test_valid_packet_passes() -> None:
    result = run(VALID)
    assert result.returncode == 0, result.stdout + result.stderr
    assert "VALID:" in result.stdout


def test_reconstruction_only_packet_fails() -> None:
    result = run(INVALID)
    assert result.returncode != 0
    combined = result.stdout + result.stderr
    assert "INVALID:" in combined


def main() -> int:
    test_valid_packet_passes()
    test_reconstruction_only_packet_fails()
    print("virtual_cell_fidelity_gate tests passed")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
