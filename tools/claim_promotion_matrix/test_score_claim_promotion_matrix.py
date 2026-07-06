#!/usr/bin/env python3
"""Regression tests for the Claim Promotion Matrix."""

from __future__ import annotations

import json
from pathlib import Path

from score_claim_promotion_matrix import score_packets

FIXTURE_PATH = Path(__file__).with_name("fixtures.synthetic.json")


def load_results():
    packets = json.loads(FIXTURE_PATH.read_text(encoding="utf-8"))
    return {result["id"]: result for result in score_packets(packets)}


def test_promotes_complete_public_safe_packet():
    results = load_results()
    assert results["cpm-pass-001"]["decision"] == "promote"
    assert "promotion_ready" in results["cpm-pass-001"]["reasons"]


def test_blocks_private_risk_packet():
    results = load_results()
    assert results["cpm-block-private-001"]["decision"] == "block"
    assert "privacy_boundary_failure" in results["cpm-block-private-001"]["reasons"]


def test_routes_under_supported_packet_to_evidence_gathering():
    results = load_results()
    assert results["cpm-gather-evidence-001"]["decision"] == "gather_evidence"
    assert "needs_evidence_links" in results["cpm-gather-evidence-001"]["reasons"]


def test_routes_contradiction_packet_to_review():
    results = load_results()
    assert results["cpm-contradiction-001"]["decision"] == "contradiction_review"
    assert "requires_contradiction_triage" in results["cpm-contradiction-001"]["reasons"]


def test_blocks_unfalsifiable_overclaim():
    results = load_results()
    assert results["cpm-block-unfalsifiable-001"]["decision"] == "block"
    assert "overclaimed" in results["cpm-block-unfalsifiable-001"]["reasons"]
    assert "no_measurable_variables" in results["cpm-block-unfalsifiable-001"]["reasons"]
    assert "missing_falsification_route" in results["cpm-block-unfalsifiable-001"]["reasons"]


if __name__ == "__main__":
    test_promotes_complete_public_safe_packet()
    test_blocks_private_risk_packet()
    test_routes_under_supported_packet_to_evidence_gathering()
    test_routes_contradiction_packet_to_review()
    test_blocks_unfalsifiable_overclaim()
    print("claim_promotion_matrix tests passed")
