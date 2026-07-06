#!/usr/bin/env python3
"""Regression tests for the Typed Private Memory Gate validator."""

from __future__ import annotations

import json
from pathlib import Path

from validate_typed_private_memory_packet import validate_packet

ROOT = Path(__file__).resolve().parent


def load_fixture(name: str) -> dict:
    return json.loads((ROOT / "fixtures" / name).read_text())


def test_valid_packet_passes() -> None:
    errors = validate_packet(load_fixture("valid_packet.json"))
    assert errors == []


def test_invalid_raw_sensitive_packet_fails() -> None:
    errors = validate_packet(load_fixture("invalid_raw_sensitive_packet.json"))
    assert errors
    assert any("raw_memory_present" in error for error in errors)


def test_missing_placeholder_usage_fails() -> None:
    packet = load_fixture("valid_packet.json")
    packet["memory_candidate"]["sanitized_memory"] = "No placeholders are present in this synthetic memory."
    errors = validate_packet(packet)
    assert any("typed placeholders" in error or "placeholder not used" in error for error in errors)


def test_cloud_restoration_fails() -> None:
    packet = load_fixture("valid_packet.json")
    packet["local_restoration_boundary"]["cloud_can_restore"] = True
    errors = validate_packet(packet)
    assert any("cloud_can_restore" in error for error in errors)


if __name__ == "__main__":
    test_valid_packet_passes()
    test_invalid_raw_sensitive_packet_fails()
    test_missing_placeholder_usage_fails()
    test_cloud_restoration_fails()
    print("PASS")
