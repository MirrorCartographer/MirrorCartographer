#!/usr/bin/env python3
"""Regression tests for temporal confounder annotator."""

from __future__ import annotations

import importlib.util
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent
MODULE_PATH = ROOT / "annotate_temporal_confounders.py"
FIXTURE_PATH = ROOT / "fixtures.synthetic.json"

spec = importlib.util.spec_from_file_location("annotate_temporal_confounders", MODULE_PATH)
module = importlib.util.module_from_spec(spec)
assert spec.loader is not None
spec.loader.exec_module(module)


def load_fixtures():
    return json.loads(FIXTURE_PATH.read_text(encoding="utf-8"))


def test_routes_match_fixture_oracles():
    packets = load_fixtures()
    result = module.annotate_packets(packets)
    route_by_id = {packet["id"]: packet["route"] for packet in result["packets"]}
    for packet in packets:
        assert route_by_id[packet["id"]] == packet["expected_route"], packet["id"]


def test_context_event_creates_review_confounder():
    packets = load_fixtures()
    result = module.annotate_packets(packets)
    packet = next(p for p in result["packets"] if p["id"] == "tca_syn_002")
    assert packet["route"] == "needs_review"
    assert any(c["type"] == "heat" for c in packet["confounders"])


def test_fewer_than_three_observations_blocks_pattern_claim():
    packets = load_fixtures()
    result = module.annotate_packets(packets)
    packet = next(p for p in result["packets"] if p["id"] == "tca_syn_003")
    assert packet["route"] == "block_pattern_claim"
    assert "fewer_than_three_dated_observations" in packet["reasons"]
    assert any(c["type"] == "measurement_method_change" for c in packet["confounders"])


def test_cure_claim_blocks_even_with_three_observations():
    packets = load_fixtures()
    result = module.annotate_packets(packets)
    packet = next(p for p in result["packets"] if p["id"] == "tca_syn_004")
    assert packet["route"] == "block_pattern_claim"
    assert "blocked_claim_status" in packet["reasons"]


def test_missingness_pushes_review_not_acceptance():
    packets = load_fixtures()
    result = module.annotate_packets(packets)
    packet = next(p for p in result["packets"] if p["id"] == "tca_syn_005")
    assert packet["route"] == "needs_review"
    assert "baseline_sleep_window_unknown" in packet["missingness"]


def run_all():
    test_routes_match_fixture_oracles()
    test_context_event_creates_review_confounder()
    test_fewer_than_three_observations_blocks_pattern_claim()
    test_cure_claim_blocks_even_with_three_observations()
    test_missingness_pushes_review_not_acceptance()


if __name__ == "__main__":
    run_all()
    print("temporal_confounder_annotator tests passed")
