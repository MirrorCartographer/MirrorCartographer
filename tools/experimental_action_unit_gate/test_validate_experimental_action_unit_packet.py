#!/usr/bin/env python3
"""Regression tests for the Experimental Action Unit Gate."""

from __future__ import annotations

import json
from pathlib import Path

from validate_experimental_action_unit_packet import validate_packet

ROOT = Path(__file__).resolve().parent


def load_fixture(name: str) -> dict:
    return json.loads((ROOT / "fixtures" / name).read_text(encoding="utf-8"))


def test_valid_packet_passes() -> None:
    errors = validate_packet(load_fixture("valid_packet.json"))
    assert errors == []


def test_invalid_packet_fails() -> None:
    errors = validate_packet(load_fixture("invalid_packet.json"))
    assert errors
    assert any("experimental_action_unit" in error for error in errors)
    assert any("blocked_inferences" in error for error in errors)


def test_required_labels_are_enforced() -> None:
    packet = load_fixture("valid_packet.json")
    for key in [
        "source_status",
        "claim_status",
        "privacy_status",
        "missingness",
        "revision_reason",
        "implementation_status",
        "evidence_strength",
        "falsification_route",
        "next_executable_action",
    ]:
        mutated = dict(packet)
        mutated.pop(key)
        errors = validate_packet(mutated)
        assert any(key in error for error in errors), key


if __name__ == "__main__":
    test_valid_packet_passes()
    test_invalid_packet_fails()
    test_required_labels_are_enforced()
    print("experimental action unit gate tests passed")
