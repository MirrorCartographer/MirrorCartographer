#!/usr/bin/env python3
"""Regression tests for score_progressive_disclosure_packets.py."""

from __future__ import annotations

import json
from pathlib import Path

from score_progressive_disclosure_packets import classify_fixture, score_packet

HERE = Path(__file__).resolve().parent


def load_fixtures():
    return json.loads((HERE / "fixtures.synthetic.json").read_text(encoding="utf-8"))


def test_all_synthetic_fixtures_match_expected_classifications():
    packet = load_fixtures()
    score = score_packet(packet)
    assert score["failed"] == 0, score


def test_late_recall_is_demoted():
    packet = load_fixtures()
    fixture = next(item for item in packet["fixtures"] if item["id"] == "pd_late_recall_only")
    predicted, reasons = classify_fixture(fixture)
    assert predicted == "demote_late_recall"
    assert any("late conclusion" in reason for reason in reasons)


def test_health_adjacent_fixture_stays_question_prep_not_advice():
    packet = load_fixtures()
    fixture = next(item for item in packet["fixtures"] if item["id"] == "pd_safe_question_prep")
    predicted, reasons = classify_fixture(fixture)
    assert predicted == "promote_question_prep"
    assert "diagnose" not in fixture["generated_hypothesis"].lower()
    assert "treat with" not in fixture["generated_hypothesis"].lower()
    assert any("question-prep" in reason for reason in reasons)


if __name__ == "__main__":
    test_all_synthetic_fixtures_match_expected_classifications()
    test_late_recall_is_demoted()
    test_health_adjacent_fixture_stays_question_prep_not_advice()
    print("progressive_disclosure_gate tests passed")
