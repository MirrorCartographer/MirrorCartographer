#!/usr/bin/env python3
"""Regression tests for the MC Verifiability-First Discovery Gate."""
from __future__ import annotations

import importlib.util
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent
MODULE_PATH = ROOT / "score_verifiability_packet.py"
FIXTURE_PATH = ROOT / "fixtures.synthetic.json"

spec = importlib.util.spec_from_file_location("score_verifiability_packet", MODULE_PATH)
module = importlib.util.module_from_spec(spec)
assert spec.loader is not None
spec.loader.exec_module(module)


def test_fixture_classifications_match_expected() -> None:
    packets = json.loads(FIXTURE_PATH.read_text(encoding="utf-8"))
    results = module.score_packets(packets)
    actual = [result["classification"] for result in results]
    expected = [packet["expected_classification"] for packet in packets]
    assert actual == expected


def test_private_packet_never_enters_discovery_memory() -> None:
    packet = {
        "id": "privacy_guard",
        "summary": "Contains private notes but has variables.",
        "source_status": "private_observation",
        "claim_status": "observation",
        "privacy_status": "contains_private_details",
        "evidence_strength": "low",
        "measurable_variables": ["frequency"],
        "verification_routes": ["deidentified_aggregation"],
        "known_missingness": []
    }
    assert module.classify_packet(packet)["classification"] == "requires_privacy_partition"


def test_cure_language_with_low_evidence_is_overclaim() -> None:
    packet = {
        "id": "overclaim_guard",
        "summary": "This proves a cure from one observation.",
        "source_status": "secondary",
        "claim_status": "candidate_hypothesis",
        "privacy_status": "public_safe",
        "evidence_strength": "low",
        "measurable_variables": ["outcome_delta"],
        "verification_routes": ["controlled_retest"],
        "known_missingness": ["replication"]
    }
    assert module.classify_packet(packet)["classification"] == "overclaimed"


def test_packet_without_variables_is_rejected() -> None:
    packet = {
        "id": "variable_guard",
        "summary": "A public claim with no measurable variable.",
        "source_status": "primary",
        "claim_status": "candidate_hypothesis",
        "privacy_status": "public_safe",
        "evidence_strength": "moderate",
        "measurable_variables": [],
        "verification_routes": ["benchmark_retest"],
        "known_missingness": []
    }
    assert module.classify_packet(packet)["classification"] == "reject_for_memory"


if __name__ == "__main__":
    test_fixture_classifications_match_expected()
    test_private_packet_never_enters_discovery_memory()
    test_cure_language_with_low_evidence_is_overclaim()
    test_packet_without_variables_is_rejected()
    print("verifiability gate tests passed")
