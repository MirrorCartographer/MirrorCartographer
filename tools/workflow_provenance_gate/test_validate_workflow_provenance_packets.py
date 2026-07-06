#!/usr/bin/env python3
"""Regression tests for the MC workflow provenance gate."""

from __future__ import annotations

import json
from pathlib import Path

from validate_workflow_provenance_packets import validate_packet

FIXTURE_PATH = Path(__file__).with_name("fixtures.synthetic.json")


def test_fixture_expectations() -> None:
    fixtures = json.loads(FIXTURE_PATH.read_text(encoding="utf-8"))
    for fixture in fixtures:
        errors = validate_packet(fixture["packet"])
        expected = fixture["expected"]
        if expected == "pass":
            assert errors == [], f"{fixture['name']} unexpectedly failed: {errors}"
        elif expected == "fail":
            assert errors != [], f"{fixture['name']} unexpectedly passed"
        else:
            raise AssertionError(f"Unknown expectation {expected!r}")


def test_supported_claim_requires_validation() -> None:
    fixtures = json.loads(FIXTURE_PATH.read_text(encoding="utf-8"))
    packet = dict(fixtures[0]["packet"])
    packet["claim_status"] = "supported"
    packet["validation_objects"] = []
    errors = validate_packet(packet)
    assert any("validation" in error for error in errors)


def test_private_boundary_is_blocked() -> None:
    fixtures = json.loads(FIXTURE_PATH.read_text(encoding="utf-8"))
    packet = dict(fixtures[0]["packet"])
    packet["privacy_status"] = "blocked_private"
    errors = validate_packet(packet)
    assert any("privacy_status" in error for error in errors)


if __name__ == "__main__":
    test_fixture_expectations()
    test_supported_claim_requires_validation()
    test_private_boundary_is_blocked()
    print("workflow provenance gate tests passed")
