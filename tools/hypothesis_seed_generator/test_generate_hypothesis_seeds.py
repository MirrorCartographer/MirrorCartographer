#!/usr/bin/env python3
"""Tests for hypothesis_seed_generator using only standard library."""

from __future__ import annotations

import importlib.util
from pathlib import Path

TOOL_PATH = Path(__file__).with_name("generate_hypothesis_seeds.py")
spec = importlib.util.spec_from_file_location("generate_hypothesis_seeds", TOOL_PATH)
module = importlib.util.module_from_spec(spec)
assert spec.loader is not None
spec.loader.exec_module(module)


def test_accepts_public_safe_candidate_pattern() -> None:
    packets = [
        {
            "packet_id": "obs-ok",
            "domain": "animal",
            "source_status": "synthetic",
            "claim_status": "candidate_pattern",
            "privacy_status": "public_safe",
            "missingness": ["no baseline"],
            "signals": ["signal one", "signal two"],
            "context_factors": ["context one"],
            "contradictions": [],
            "revision_reason": "test public-safe acceptance",
        }
    ]
    result = module.generate(packets)
    assert result["summary"] == {"accepted_count": 1, "blocked_count": 0}
    seed = result["accepted_seeds"][0]
    assert seed["claim_status"] == "hypothesis_seed_not_promoted"
    assert "not causal" in seed["hypothesis_seed"]
    assert len(seed["falsification_prompts"]) >= 4
    assert "contradiction_ledger_entry" in seed["required_next_evidence"]


def test_blocks_cure_claim() -> None:
    result = module.generate(
        [
            {
                "packet_id": "obs-cure",
                "domain": "human",
                "source_status": "synthetic",
                "claim_status": "cure_claim",
                "privacy_status": "public_safe",
                "missingness": [],
                "signals": ["a", "b"],
                "context_factors": [],
                "contradictions": [],
                "revision_reason": "test",
            }
        ]
    )
    assert result["summary"]["accepted_count"] == 0
    assert "claim_status_blocks_hypothesis_generation" in result["blocked_packets"][0]["block_reasons"]


def test_blocks_private_residue() -> None:
    result = module.generate(
        [
            {
                "packet_id": "obs-private",
                "domain": "human",
                "source_status": "private",
                "claim_status": "observation",
                "privacy_status": "private_residue",
                "missingness": [],
                "signals": ["a", "b"],
                "context_factors": [],
                "contradictions": [],
                "revision_reason": "test",
            }
        ]
    )
    reasons = result["blocked_packets"][0]["block_reasons"]
    assert "source_not_public_safe" in reasons
    assert "privacy_not_public_safe" in reasons


def test_blocks_low_signal_packet() -> None:
    result = module.generate(
        [
            {
                "packet_id": "obs-thin",
                "domain": "literature",
                "source_status": "public",
                "claim_status": "summary",
                "privacy_status": "public_safe",
                "missingness": [],
                "signals": ["single signal"],
                "context_factors": [],
                "contradictions": [],
                "revision_reason": "test",
            }
        ]
    )
    assert "insufficient_signal_count" in result["blocked_packets"][0]["block_reasons"]


def test_requires_missingness_list() -> None:
    result = module.generate(
        [
            {
                "packet_id": "obs-missingness-bad",
                "domain": "environment",
                "source_status": "synthetic",
                "claim_status": "observation",
                "privacy_status": "public_safe",
                "signals": ["a", "b"],
                "context_factors": [],
                "contradictions": [],
                "revision_reason": "test",
            }
        ]
    )
    assert "missingness_must_be_list" in result["blocked_packets"][0]["block_reasons"]


if __name__ == "__main__":
    test_accepts_public_safe_candidate_pattern()
    test_blocks_cure_claim()
    test_blocks_private_residue()
    test_blocks_low_signal_packet()
    test_requires_missingness_list()
    print("hypothesis_seed_generator tests passed")
