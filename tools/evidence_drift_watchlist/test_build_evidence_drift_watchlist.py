#!/usr/bin/env python3
"""Regression tests for evidence_drift_watchlist."""

from __future__ import annotations

import json
from datetime import date
from pathlib import Path

from build_evidence_drift_watchlist import build_watchlist, claims_from_payload, route_claim

FIXTURE_PATH = Path(__file__).with_name("fixtures.synthetic.json")
TODAY = date(2026, 7, 6)


def load_claims() -> list[dict]:
    return claims_from_payload(json.loads(FIXTURE_PATH.read_text(encoding="utf-8")))


def test_fixture_routes_cover_all_expected_queues() -> None:
    watchlist = build_watchlist(load_claims(), today=TODAY)
    assert watchlist["current_low_drift"][0]["claim_id"] == "edw_current_public_literature"
    assert watchlist["recheck_soon"][0]["claim_id"] == "edw_recheck_ai_systems"
    assert watchlist["refresh_before_reuse"][0]["claim_id"] == "edw_refresh_veterinary_claim"
    assert watchlist["blocked_boundary"][0]["claim_id"] == "edw_blocked_advice_leak"


def test_private_identifier_blocks_even_when_fresh() -> None:
    claim = load_claims()[0].copy()
    claim["claim_id"] = "edw_private_residue"
    claim["claim_text_public"] = "Contact researcher at private@example.com about this public-safe looking claim."
    result = route_claim(claim, today=TODAY)
    assert result.queue == "blocked_boundary"
    assert "private residue detected" in result.reasons


def test_missing_evidence_refs_blocks_shape() -> None:
    claim = load_claims()[0].copy()
    claim["claim_id"] = "edw_missing_refs"
    claim["evidence_refs"] = []
    result = route_claim(claim, today=TODAY)
    assert result.queue == "blocked_boundary"
    assert "evidence_refs must be a non-empty list" in result.reasons


def test_fast_drift_domain_increases_score() -> None:
    biology = load_claims()[0].copy()
    software = biology.copy()
    software["claim_id"] = "edw_software_fast_drift"
    software["domain"] = "software"
    biology_score = route_claim(biology, today=TODAY).drift_score
    software_score = route_claim(software, today=TODAY).drift_score
    assert software_score > biology_score


def test_claim_object_payload_is_accepted() -> None:
    claim = load_claims()[0]
    assert claims_from_payload(claim) == [claim]


if __name__ == "__main__":
    test_fixture_routes_cover_all_expected_queues()
    test_private_identifier_blocks_even_when_fresh()
    test_missing_evidence_refs_blocks_shape()
    test_fast_drift_domain_increases_score()
    test_claim_object_payload_is_accepted()
    print("evidence_drift_watchlist tests passed")
