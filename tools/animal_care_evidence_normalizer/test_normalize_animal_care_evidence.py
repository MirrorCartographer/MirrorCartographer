#!/usr/bin/env python3
"""Tests for animal_care_evidence_normalizer.

Run from repository root:
python tools/animal_care_evidence_normalizer/test_normalize_animal_care_evidence.py
"""

from __future__ import annotations

import importlib.util
from pathlib import Path
from typing import Any, Dict

MODULE_PATH = Path(__file__).with_name("normalize_animal_care_evidence.py")
spec = importlib.util.spec_from_file_location("normalize_animal_care_evidence", MODULE_PATH)
module = importlib.util.module_from_spec(spec)
assert spec and spec.loader
spec.loader.exec_module(module)


def base_packet(**overrides: Any) -> Dict[str, Any]:
    packet: Dict[str, Any] = {
        "packet_id": "unit-syn-001",
        "species": "dog",
        "domain": "general_observation",
        "observation_text": "Synthetic animal observation with no advice or diagnosis.",
        "source_type": "owner_observation",
        "source_status": "synthetic",
        "claim_status": "observation_only",
        "privacy_status": "public_safe",
        "timestamp": "2026-07-07T12:00:00Z",
        "measurements": [],
        "missingness": ["no_exam_findings"],
        "revision_reason": "unit test fixture",
    }
    packet.update(overrides)
    return packet


def test_accepts_public_safe_observation() -> None:
    result = module.normalize_packet(base_packet())
    assert result["normalized_status"] == "accepted_for_review"
    assert result["routing"] == ["longitudinal_tracking", "source_chain_validation"]
    assert result["blocked_reasons"] == []


def test_routes_literature_summary() -> None:
    result = module.normalize_packet(
        base_packet(
            source_type="public_literature",
            claim_status="literature_summary",
            observation_text="Synthetic literature summary with explicit uncertainty.",
        )
    )
    assert result["normalized_status"] == "accepted_for_review"
    assert result["routing"] == ["animal_literature_routing", "source_chain_validation"]


def test_blocks_private_packet() -> None:
    result = module.normalize_packet(base_packet(privacy_status="private"))
    assert result["normalized_status"] == "blocked"
    assert "privacy_not_public_safe" in result["blocked_reasons"]


def test_blocks_missing_missingness() -> None:
    packet = base_packet()
    packet.pop("missingness")
    result = module.normalize_packet(packet)
    assert result["normalized_status"] == "blocked"
    assert any(reason.startswith("missing_required_fields:missingness") for reason in result["blocked_reasons"])
    assert "missingness_array_required" in result["blocked_reasons"]


def test_blocks_empty_missingness() -> None:
    result = module.normalize_packet(base_packet(missingness=[]))
    assert result["normalized_status"] == "blocked"
    assert "missingness_must_be_explicit" in result["blocked_reasons"]


def test_blocks_overclaim_language() -> None:
    result = module.normalize_packet(
        base_packet(observation_text="This synthetic packet claims the animal is cured and should treat immediately.")
    )
    assert result["normalized_status"] == "blocked"
    assert "overclaim_or_advice_language_detected" in result["blocked_reasons"]


def test_blocks_identifier_residue() -> None:
    result = module.normalize_packet(
        base_packet(observation_text="Synthetic observation accidentally includes person@example.com.")
    )
    assert result["normalized_status"] == "blocked"
    assert "identifier_residue_detected" in result["blocked_reasons"]


def test_summary_counts() -> None:
    output = module.normalize_packets([
        base_packet(packet_id="ok"),
        base_packet(packet_id="blocked", privacy_status="unknown"),
    ])
    assert output["summary"] == {"total_packets": 2, "accepted_for_review": 1, "blocked": 1}


def run_all() -> None:
    test_accepts_public_safe_observation()
    test_routes_literature_summary()
    test_blocks_private_packet()
    test_blocks_missing_missingness()
    test_blocks_empty_missingness()
    test_blocks_overclaim_language()
    test_blocks_identifier_residue()
    test_summary_counts()


if __name__ == "__main__":
    run_all()
    print("animal_care_evidence_normalizer tests passed")
