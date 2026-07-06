#!/usr/bin/env python3
"""Regression tests for the MC provenance packet validator."""

from __future__ import annotations

import json
from pathlib import Path

from validate_provenance_packets import validate_packet

FIXTURE_PATH = Path(__file__).with_name("fixtures.synthetic.json")


def test_fixtures_match_expected_validity() -> None:
    fixtures = json.loads(FIXTURE_PATH.read_text(encoding="utf-8"))
    assert fixtures, "expected at least one fixture"

    for fixture in fixtures:
        errors = validate_packet(fixture["packet"])
        actual_valid = not errors
        assert actual_valid is fixture["expect_valid"], f"{fixture['name']} errors={errors}"


def test_private_reject_never_passes() -> None:
    fixtures = json.loads(FIXTURE_PATH.read_text(encoding="utf-8"))
    packet = fixtures[0]["packet"].copy()
    packet["packet_id"] = "mc-prov-private-rule-test-001"
    packet["privacy_status"] = "private_reject"

    errors = validate_packet(packet)
    assert any("private_reject" in error for error in errors)


def test_advice_like_terms_are_blocked() -> None:
    fixtures = json.loads(FIXTURE_PATH.read_text(encoding="utf-8"))
    packet = fixtures[0]["packet"].copy()
    packet["packet_id"] = "mc-prov-advice-rule-test-001"
    packet["claim_text"] = "This should fail because it tries to convert research organization into treatment recommendation language."

    errors = validate_packet(packet)
    assert any("prohibited advice-like" in error for error in errors)


if __name__ == "__main__":
    test_fixtures_match_expected_validity()
    test_private_reject_never_passes()
    test_advice_like_terms_are_blocked()
    print("PASS provenance packet validator tests")
