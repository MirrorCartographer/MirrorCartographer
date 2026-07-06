#!/usr/bin/env python3
"""Regression tests for the Workflow Reconstruction Gate."""
from __future__ import annotations

import json
from pathlib import Path

from validate_workflow_reconstruction_packet import validate

ROOT = Path(__file__).resolve().parent


def load_packet(name: str) -> dict:
    return json.loads((ROOT / name).read_text(encoding="utf-8"))


def test_valid_packet_passes() -> None:
    errors = validate(load_packet("valid_packet.json"))
    assert errors == []


def test_invalid_packet_fails() -> None:
    errors = validate(load_packet("invalid_packet.json"))
    assert errors
    assert any("workflow_trace" in error for error in errors)
    assert any("source anchors" in error or "source_anchors" in error for error in errors)
    assert any("missingness.status" in error for error in errors)


def test_privacy_unknown_reject_fails_even_with_structure() -> None:
    packet = load_packet("valid_packet.json")
    packet["privacy_status"] = "unknown_reject"
    errors = validate(packet)
    assert "privacy_status unknown_reject cannot pass" in errors


if __name__ == "__main__":
    test_valid_packet_passes()
    test_invalid_packet_fails()
    test_privacy_unknown_reject_fails_even_with_structure()
    print("PASS")
