#!/usr/bin/env python3
"""Tests for review_readiness_scorecard.

Run from repository root:
python tools/review_readiness_scorecard/test_score_review_readiness.py
"""

from __future__ import annotations

import importlib.util
import json
from pathlib import Path

MODULE_PATH = Path(__file__).with_name("score_review_readiness.py")
spec = importlib.util.spec_from_file_location("score_review_readiness", MODULE_PATH)
module = importlib.util.module_from_spec(spec)
assert spec.loader is not None
spec.loader.exec_module(module)

FIXTURE_PATH = Path(__file__).with_name("fixtures.synthetic.json")


def load_fixtures():
    return json.loads(FIXTURE_PATH.read_text(encoding="utf-8"))


def test_fixture_summary_counts():
    result = module.build_scorecard(load_fixtures())
    assert result["scorecard_version"] == "mc-review-readiness/v1"
    assert result["summary"] == {
        "total": 4,
        "review_ready": 1,
        "needs_revision": 1,
        "blocked": 2,
    }


def test_public_safe_hypothesis_can_be_review_ready():
    cards = {card["packet_id"]: card for card in module.build_scorecard(load_fixtures())["scorecards"]}
    card = cards["review-ready-001"]
    assert card["status"] == "review_ready"
    assert card["score"] >= 80
    assert card["blockers"] == []
    assert "missingness_present" in card["warnings"]


def test_missing_falsification_needs_revision():
    cards = {card["packet_id"]: card for card in module.build_scorecard(load_fixtures())["scorecards"]}
    card = cards["needs-revision-001"]
    assert card["status"] == "needs_revision"
    assert "weak_or_missing_falsification" in card["warnings"]


def test_private_packet_is_blocked():
    cards = {card["packet_id"]: card for card in module.build_scorecard(load_fixtures())["scorecards"]}
    card = cards["blocked-private-001"]
    assert card["status"] == "blocked"
    assert "privacy_not_public_safe" in card["blockers"]


def test_overclaim_packet_is_blocked():
    cards = {card["packet_id"]: card for card in module.build_scorecard(load_fixtures())["scorecards"]}
    card = cards["blocked-overclaim-001"]
    assert card["status"] == "blocked"
    assert "blocked_claim_status" in card["blockers"]


def test_missingness_must_be_array():
    packet = {
        "packet_id": "bad-missingness",
        "domain": "test",
        "source_status": "synthetic",
        "claim_status": "hypothesis_only",
        "privacy_status": "public_safe",
        "evidence_route": "test_route",
        "missingness": "not an array",
        "falsification_status": "counterexample_defined",
        "revision_reason": "unit test",
        "implementation_status": "routed",
        "testability": "machine_checkable",
        "next_executable_action": "fix missingness",
    }
    card = module.score_packet(packet)
    assert card["status"] == "blocked"
    assert "missingness_not_array" in card["blockers"]


if __name__ == "__main__":
    test_fixture_summary_counts()
    test_public_safe_hypothesis_can_be_review_ready()
    test_missing_falsification_needs_revision()
    test_private_packet_is_blocked()
    test_overclaim_packet_is_blocked()
    test_missingness_must_be_array()
    print("review_readiness_scorecard tests passed")
