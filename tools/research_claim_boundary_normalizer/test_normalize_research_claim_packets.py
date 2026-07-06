#!/usr/bin/env python3
"""Regression tests for normalize_research_claim_packets.py."""

from __future__ import annotations

import importlib.util
from pathlib import Path

MODULE_PATH = Path(__file__).with_name("normalize_research_claim_packets.py")
spec = importlib.util.spec_from_file_location("normalizer", MODULE_PATH)
normalizer = importlib.util.module_from_spec(spec)
assert spec.loader is not None
spec.loader.exec_module(normalizer)


def base_packet() -> dict:
    return {
        "packet_id": "test-pass-001",
        "domain": "mechanistic_biology",
        "source_status": "primary_source",
        "claim_status": "mechanistic_claim",
        "privacy_status": "public_safe",
        "source_refs": ["synthetic-ref"],
        "claim_text": "A bounded mechanism claim should become a measurable and falsifiable research packet.",
        "measurable_variables": ["variable_present"],
        "missingness": ["fixture lacks external replication"],
        "evidence_strength": "moderate",
        "falsification_route": "Reject if the measurable variable cannot be independently observed or reproduced.",
        "next_executable_action": "Build a provenance packet from this normalized research claim.",
        "advice_boundary": "research_organization_only",
        "contains_personal_data": False,
        "contains_cure_claim": False,
    }


def test_pass_packet_routes_to_provenance_or_review() -> None:
    result = normalizer.normalize_packet(base_packet())
    assert result.route == "normalized_for_provenance_packet"
    assert result.score >= 90
    assert not result.errors


def test_private_packet_blocks() -> None:
    packet = base_packet()
    packet["privacy_status"] = "private_or_mixed"
    packet["contains_personal_data"] = True
    result = normalizer.normalize_packet(packet)
    assert result.route == "block"
    assert "privacy_status must be public_safe" in result.errors
    assert "contains_personal_data must be false" in result.errors


def test_cure_claim_blocks() -> None:
    packet = base_packet()
    packet["contains_cure_claim"] = True
    result = normalizer.normalize_packet(packet)
    assert result.route == "block"
    assert "contains_cure_claim must be false" in result.errors


def test_weak_evidence_requires_missingness() -> None:
    packet = base_packet()
    packet["evidence_strength"] = "weak"
    packet["missingness"] = []
    result = normalizer.normalize_packet(packet)
    assert result.route == "block"
    assert "weak evidence must preserve explicit missingness" in result.errors


def test_preprint_weak_routes_to_more_evidence() -> None:
    packet = base_packet()
    packet["source_status"] = "preprint_caveated"
    packet["domain"] = "scientific_ai"
    packet["claim_status"] = "benchmark_result"
    packet["evidence_strength"] = "weak"
    packet["missingness"] = ["peer review pending", "replication unavailable"]
    result = normalizer.normalize_packet(packet)
    assert result.route == "needs_replication_or_more_evidence"
    assert not result.errors


def test_missing_variables_blocks() -> None:
    packet = base_packet()
    packet["measurable_variables"] = []
    result = normalizer.normalize_packet(packet)
    assert result.route == "block"
    assert "measurable_variables must be a non-empty list of strings" in result.errors


if __name__ == "__main__":
    test_pass_packet_routes_to_provenance_or_review()
    test_private_packet_blocks()
    test_cure_claim_blocks()
    test_weak_evidence_requires_missingness()
    test_preprint_weak_routes_to_more_evidence()
    test_missing_variables_blocks()
    print("research claim boundary normalizer tests passed")
