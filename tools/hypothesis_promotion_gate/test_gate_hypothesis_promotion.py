#!/usr/bin/env python3
"""Regression tests for hypothesis promotion gate."""

from __future__ import annotations

import importlib.util
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent
MODULE_PATH = ROOT / "gate_hypothesis_promotion.py"
FIXTURE_PATH = ROOT / "fixtures.synthetic.json"

spec = importlib.util.spec_from_file_location("gate_hypothesis_promotion", MODULE_PATH)
module = importlib.util.module_from_spec(spec)
assert spec and spec.loader
spec.loader.exec_module(module)


def load_fixtures():
    return json.loads(FIXTURE_PATH.read_text(encoding="utf-8"))


def test_fixture_oracles_match():
    packets = load_fixtures()
    results = module.evaluate_packets(packets)["results"]
    observed = {result["hypothesis_id"]: result["decision"] for result in results}
    expected = {packet["hypothesis_id"]: packet["expected_decision"] for packet in packets}
    assert observed == expected, (observed, expected)


def test_cure_claim_blocks_even_with_evidence():
    packet = {
        "hypothesis_id": "unit-cure-block",
        "domain": "human_health",
        "statement": "Unsafe synthetic cure claim.",
        "source_status": "synthetic",
        "claim_status": "cure_claim",
        "privacy_status": "public_safe",
        "evidence_items": ["a", "b", "c"],
        "contradictions": [],
        "missingness": ["clinical validation absent"],
        "falsification_tests": ["synthetic test"],
        "mechanism_scope": "bounded",
        "requested_promotion": "promote_to_review",
        "revision_reason": "unit test",
    }
    result = module.evaluate_packet(packet)
    assert result["decision"] == "block"
    assert any("cure" in reason for reason in result["reasons"])


def test_private_residue_blocks_collaboration_ready_packet():
    packet = {
        "hypothesis_id": "unit-private-block",
        "domain": "collaboration",
        "statement": "Synthetic private residue packet.",
        "source_status": "user_provided",
        "claim_status": "falsification_ready",
        "privacy_status": "contains_private_residue",
        "evidence_items": ["a", "b"],
        "contradictions": [],
        "missingness": ["redaction incomplete"],
        "falsification_tests": ["redact then retry"],
        "mechanism_scope": "bounded",
        "requested_promotion": "promote_to_review",
        "revision_reason": "unit test",
    }
    result = module.evaluate_packet(packet)
    assert result["decision"] == "block"
    assert "run privacy-preserving memory redactor" in result["required_actions"] or "redact or partition packet before re-evaluation" in result["required_actions"]


def test_missingness_empty_holds_not_promotes():
    packet = {
        "hypothesis_id": "unit-empty-missingness-hold",
        "domain": "science_literature",
        "statement": "Synthetic bounded but incomplete packet.",
        "source_status": "synthetic",
        "claim_status": "falsification_ready",
        "privacy_status": "public_safe",
        "evidence_items": ["a", "b"],
        "contradictions": [],
        "missingness": [],
        "falsification_tests": ["synthetic negative control"],
        "mechanism_scope": "bounded",
        "requested_promotion": "promote_to_review",
        "revision_reason": "unit test",
    }
    result = module.evaluate_packet(packet)
    assert result["decision"] == "hold"
    assert any("missingness" in reason for reason in result["reasons"])


def test_promoted_packet_emits_required_labels():
    packet = load_fixtures()[0]
    result = module.evaluate_packet(packet)
    labels = result["labels"]
    for key in [
        "source_status",
        "claim_status",
        "privacy_status",
        "missingness",
        "revision_reason",
        "implementation_status",
        "testability",
        "next_executable_action",
    ]:
        assert key in labels
    assert result["decision"] == "promote"


if __name__ == "__main__":
    test_fixture_oracles_match()
    test_cure_claim_blocks_even_with_evidence()
    test_private_residue_blocks_collaboration_ready_packet()
    test_missingness_empty_holds_not_promotes()
    test_promoted_packet_emits_required_labels()
    print("hypothesis_promotion_gate tests passed")
