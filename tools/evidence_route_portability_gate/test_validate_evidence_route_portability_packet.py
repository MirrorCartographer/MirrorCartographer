#!/usr/bin/env python3
"""Regression tests for the Evidence Route Portability Gate."""

from __future__ import annotations

import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent
VALIDATOR = ROOT / "validate_evidence_route_portability_packet.py"
VALID_PACKET = ROOT / "fixtures" / "valid_evidence_route_portability_packet.json"
INVALID_PACKET = ROOT / "fixtures" / "invalid_evidence_route_portability_packet.json"


def run_validator(packet: Path) -> subprocess.CompletedProcess[str]:
    return subprocess.run(
        [sys.executable, str(VALIDATOR), str(packet)],
        cwd=str(ROOT),
        text=True,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        check=False,
    )


def main() -> int:
    valid = run_validator(VALID_PACKET)
    if valid.returncode != 0:
        print(valid.stdout)
        print(valid.stderr)
        raise SystemExit("valid packet failed validation")

    invalid = run_validator(INVALID_PACKET)
    if invalid.returncode == 0:
        print(invalid.stdout)
        raise SystemExit("invalid packet unexpectedly passed validation")

    print("PASS: evidence route portability gate regression tests")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
