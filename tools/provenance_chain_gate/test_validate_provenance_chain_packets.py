#!/usr/bin/env python3
"""Regression tests for the MC provenance-chain gate."""

from __future__ import annotations

import json
from pathlib import Path

from validate_provenance_chain_packets import validate_packet

FIXTURE_PATH = Path(__file__).with_name("fixtures.synthetic.json")


def load_fixtures():
    return json.loads(FIXTURE_PATH.read_text(encoding="utf-8"))["fixtures"]


def test_all_fixtures_match_expected_outcome():
    for fixture in load_fixtures():
        valid, errors = validate_packet(fixture["packet"])
        assert valid is fixture["expected_valid"], f"{fixture['name']} errors={errors}"


def test_supported_claim_requires_measured_or_external_public_step():
    packet = next(
        fixture["packet"]
        for fixture in load_fixtures()
        if fixture["name"] == "pass_generated_hypothesis_with_preserved_boundaries"
    )
    packet = json.loads(json.dumps(packet))
    packet["claim_status"] = "supported"
    packet["provenance_chain"] = [
        step for step in packet["provenance_chain"] if step["claim_boundary"] != "measured"
    ]
    for index, step in enumerate(packet["provenance_chain"], start=1):
        step["step"] = index

    valid, errors = validate_packet(packet)
    assert not valid
    assert any("measured or external-public" in error for error in errors)


def test_reject_private_boundary_blocks_admission():
    packet = next(
        fixture["packet"] for fixture in load_fixtures() if fixture["name"] == "pass_generated_hypothesis_with_preserved_boundaries"
    )
    packet = json.loads(json.dumps(packet))
    packet["provenance_chain"][0]["public_boundary"] = "reject_private"

    valid, errors = validate_packet(packet)
    assert not valid
    assert any("reject_private" in error for error in errors)


def test_missingness_must_not_mean_absence():
    packet = next(
        fixture["packet"] for fixture in load_fixtures() if fixture["name"] == "pass_generated_hypothesis_with_preserved_boundaries"
    )
    packet = json.loads(json.dumps(packet))
    packet["missingness"]["state"] = "unknown"
    packet["missingness"]["does_not_mean_absence"] = False

    valid, errors = validate_packet(packet)
    assert not valid
    assert any("missingness must not mean absence" in error for error in errors)


if __name__ == "__main__":
    test_all_fixtures_match_expected_outcome()
    test_supported_claim_requires_measured_or_external_public_step()
    test_reject_private_boundary_blocks_admission()
    test_missingness_must_not_mean_absence()
    print("PASS: provenance-chain gate regression tests")
