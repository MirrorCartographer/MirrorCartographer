#!/usr/bin/env python3
"""Regression tests for Benchmark Provenance Gap packet validation."""

from __future__ import annotations

import importlib.util
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent
VALIDATOR = ROOT / "validate_benchmark_provenance_gap_packet.py"
FIXTURES = ROOT / "fixtures"

spec = importlib.util.spec_from_file_location("validator", VALIDATOR)
validator = importlib.util.module_from_spec(spec)
assert spec.loader is not None
spec.loader.exec_module(validator)


def load_fixture(name: str) -> dict:
    return json.loads((FIXTURES / name).read_text(encoding="utf-8"))


def test_valid_fixture_passes() -> None:
    errors = validator.validate(load_fixture("valid_benchmark_provenance_gap_packet.json"))
    assert errors == []


def test_invalid_fixture_fails() -> None:
    errors = validator.validate(load_fixture("invalid_benchmark_provenance_gap_packet.json"))
    assert errors
    assert any("missingness" in error for error in errors)
    assert any("transfer_boundary.out_of_scope" in error for error in errors)
    assert any("benchmark_gap_model.known_gaps" in error for error in errors)


def test_metric_proxy_requires_blocked_inference_text() -> None:
    packet = load_fixture("valid_benchmark_provenance_gap_packet.json")
    packet["task_metric_binding"]["blocked_metric_inference"] = ""
    errors = validator.validate(packet)
    assert any("blocked_metric_inference" in error for error in errors)


def test_transfer_boundary_requires_bridge_evidence() -> None:
    packet = load_fixture("valid_benchmark_provenance_gap_packet.json")
    packet["transfer_boundary"]["required_bridge_evidence"] = []
    errors = validator.validate(packet)
    assert any("required_bridge_evidence" in error for error in errors)


if __name__ == "__main__":
    test_valid_fixture_passes()
    test_invalid_fixture_fails()
    test_metric_proxy_requires_blocked_inference_text()
    test_transfer_boundary_requires_bridge_evidence()
    print("benchmark provenance gap tests passed")
