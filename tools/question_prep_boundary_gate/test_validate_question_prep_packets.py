#!/usr/bin/env python3
"""Regression tests for the MC Question Prep Boundary Gate."""

from __future__ import annotations

import json
from pathlib import Path

from validate_question_prep_packets import validate_packet

FIXTURE_PATH = Path(__file__).with_name("fixtures.synthetic.json")


def test_fixtures_match_expected_validity() -> None:
    fixtures = json.loads(FIXTURE_PATH.read_text(encoding="utf-8"))
    assert fixtures, "fixtures must not be empty"
    for fixture in fixtures:
        errors = validate_packet(fixture["packet"])
        is_valid = not errors
        assert is_valid is fixture["expect_valid"], f"{fixture['name']} errors={errors}"


def test_valid_packet_requires_public_safe_privacy_status() -> None:
    packet = json.loads(FIXTURE_PATH.read_text(encoding="utf-8"))[0]["packet"]
    packet = json.loads(json.dumps(packet))
    packet["privacy_status"] = "reject_private_or_identifying"
    errors = validate_packet(packet)
    assert any("privacy_status" in error for error in errors)


def test_question_must_link_to_declared_variable() -> None:
    packet = json.loads(FIXTURE_PATH.read_text(encoding="utf-8"))[0]["packet"]
    packet = json.loads(json.dumps(packet))
    packet["questions"][0]["linked_variable"] = "undeclared_variable"
    errors = validate_packet(packet)
    assert any("linked_variable" in error for error in errors)


def test_advice_language_is_rejected() -> None:
    packet = json.loads(FIXTURE_PATH.read_text(encoding="utf-8"))[0]["packet"]
    packet = json.loads(json.dumps(packet))
    packet["questions"][0]["question"] = "Should the system prescribe a dose immediately?"
    errors = validate_packet(packet)
    assert any("leakage" in error for error in errors)


if __name__ == "__main__":
    test_fixtures_match_expected_validity()
    test_valid_packet_requires_public_safe_privacy_status()
    test_question_must_link_to_declared_variable()
    test_advice_language_is_rejected()
    print("question_prep_boundary_gate tests passed")
