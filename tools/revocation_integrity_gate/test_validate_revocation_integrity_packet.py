#!/usr/bin/env python3
"""Regression tests for the Revocation Integrity Gate validator."""

from __future__ import annotations

import importlib.util
from pathlib import Path

ROOT = Path(__file__).resolve().parent
VALIDATOR_PATH = ROOT / "validate_revocation_integrity_packet.py"

spec = importlib.util.spec_from_file_location("validator", VALIDATOR_PATH)
validator = importlib.util.module_from_spec(spec)
assert spec.loader is not None
spec.loader.exec_module(validator)


def _load_json(path: Path):
    import json

    return json.loads(path.read_text(encoding="utf-8"))


def test_valid_fixture_passes() -> None:
    packet = _load_json(ROOT / "valid_revocation_integrity_packet.json")
    errors = validator.validate(packet)
    assert errors == []


def test_invalid_fixture_fails() -> None:
    packet = _load_json(ROOT / "invalid_revocation_integrity_packet.json")
    errors = validator.validate(packet)
    assert errors
    assert any("can_revoke" in error for error in errors)
    assert any("downstream_dependencies" in error for error in errors)
    assert any("missingness" in error for error in errors)


def test_revocation_must_have_measurable_verification_signal() -> None:
    packet = _load_json(ROOT / "valid_revocation_integrity_packet.json")
    packet["revocation_route"]["verification_signal"] = "gone"
    errors = validator.validate(packet)
    assert any("verification_signal" in error for error in errors)


def test_downgrade_must_block_inference() -> None:
    packet = _load_json(ROOT / "valid_revocation_integrity_packet.json")
    packet["downgrade_route"]["blocked_after_downgrade"] = []
    errors = validator.validate(packet)
    assert any("blocked_after_downgrade" in error for error in errors)


if __name__ == "__main__":
    test_valid_fixture_passes()
    test_invalid_fixture_fails()
    test_revocation_must_have_measurable_verification_signal()
    test_downgrade_must_block_inference()
    print("revocation integrity tests passed")
