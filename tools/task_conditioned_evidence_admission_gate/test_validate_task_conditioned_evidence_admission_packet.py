#!/usr/bin/env python3
"""Regression tests for the Task Conditioned Evidence Admission Gate."""

from __future__ import annotations

import json
from pathlib import Path

from validate_task_conditioned_evidence_admission_packet import validate

ROOT = Path(__file__).resolve().parent


def _load(name: str) -> dict:
    return json.loads((ROOT / "fixtures" / name).read_text(encoding="utf-8"))


def test_valid_packet_passes() -> None:
    errors = validate(_load("valid_packet.json"))
    assert errors == []


def test_invalid_packet_fails() -> None:
    errors = validate(_load("invalid_packet.json"))
    assert errors
    assert any("semantic similarity" in error for error in errors)
    assert any("privacy" in error for error in errors)
    assert any("provenance" in error for error in errors)


if __name__ == "__main__":
    test_valid_packet_passes()
    test_invalid_packet_fails()
    print("task-conditioned evidence admission gate tests passed")
