#!/usr/bin/env python3
"""Regression tests for the Federation Realism Gate."""

from __future__ import annotations

import json
from pathlib import Path

from validate_federation_realism_packet import validate

ROOT = Path(__file__).resolve().parent
FIXTURES = ROOT / "fixtures"


def load_fixture(name: str) -> dict:
    return json.loads((FIXTURES / name).read_text(encoding="utf-8"))


def test_valid_packet_passes() -> None:
    packet = load_fixture("valid_federation_realism_packet.json")
    assert validate(packet) == []


def test_missing_site_boundary_fails() -> None:
    packet = load_fixture("invalid_missing_site_boundary_packet.json")
    errors = validate(packet)
    assert errors
    assert any("site_boundary_model" in error for error in errors)


def test_unknown_missingness_fails() -> None:
    packet = load_fixture("valid_federation_realism_packet.json")
    packet["missingness"]["sampling_cadence"] = "unknown"
    errors = validate(packet)
    assert any("missingness.sampling_cadence" in error for error in errors)


def test_random_partition_without_realism_fails() -> None:
    packet = load_fixture("valid_federation_realism_packet.json")
    packet["partition_realism"] = "Rows were randomly split across clients."
    errors = validate(packet)
    assert any("row-random" in error for error in errors)


def run_all() -> None:
    test_valid_packet_passes()
    test_missing_site_boundary_fails()
    test_unknown_missingness_fails()
    test_random_partition_without_realism_fails()
    print("all federation realism tests passed")


if __name__ == "__main__":
    run_all()
