#!/usr/bin/env python3
"""Regression tests for the Memory Operation Boundary Gate validator."""

from __future__ import annotations

import importlib.util
from pathlib import Path

ROOT = Path(__file__).resolve().parent
VALIDATOR_PATH = ROOT / "validate_memory_operation_boundary_packet.py"
VALID_FIXTURE = ROOT / "fixtures" / "valid_memory_operation_boundary_packet.json"
INVALID_FIXTURE = ROOT / "fixtures" / "invalid_memory_operation_boundary_packet.json"

spec = importlib.util.spec_from_file_location("mobg_validator", VALIDATOR_PATH)
assert spec and spec.loader
validator = importlib.util.module_from_spec(spec)
spec.loader.exec_module(validator)


def test_valid_fixture_passes() -> None:
    assert validator.main(["validator", str(VALID_FIXTURE)]) == 0


def test_invalid_fixture_fails() -> None:
    try:
        validator.main(["validator", str(INVALID_FIXTURE)])
    except ValueError as exc:
        assert "restricted or blocked packets cannot be promoted" in str(exc) or "public_artifact" in str(exc) or "length" in str(exc)
    else:
        raise AssertionError("invalid fixture unexpectedly passed")


if __name__ == "__main__":
    test_valid_fixture_passes()
    test_invalid_fixture_fails()
    print("memory operation boundary gate tests passed")
