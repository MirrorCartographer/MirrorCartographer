#!/usr/bin/env python3
"""Regression tests for the Data Rights Modality Fitness Gate."""

from __future__ import annotations

import importlib.util
from pathlib import Path

ROOT = Path(__file__).resolve().parent
VALIDATOR_PATH = ROOT / "validate_packet.py"

spec = importlib.util.spec_from_file_location("validate_packet", VALIDATOR_PATH)
validator = importlib.util.module_from_spec(spec)
assert spec.loader is not None
spec.loader.exec_module(validator)


def load(name: str):
    return validator.load_json(ROOT / "fixtures" / name)


def test_valid_public_benchmark_packet_passes():
    errors = validator.validate(load("valid_public_benchmark_packet.json"))
    assert errors == []


def test_invalid_raw_sensitive_public_packet_fails():
    errors = validator.validate(load("invalid_raw_sensitive_public_packet.json"))
    assert "raw sensitive data cannot be marked public_safe" in errors
    assert "clinical-care-only or unknown consent cannot be promoted as public_safe" in errors
    assert "non-redistributable data cannot be promoted as public_safe" in errors
    assert "blocked packets cannot be marked tested/wired as admissible" in errors
    assert "not-fit/unknown modality packets must be rejected or converted to prototype requirements" in errors


if __name__ == "__main__":
    test_valid_public_benchmark_packet_passes()
    test_invalid_raw_sensitive_public_packet_fails()
    print("PASS data_rights_modality_fitness_gate regression tests")
