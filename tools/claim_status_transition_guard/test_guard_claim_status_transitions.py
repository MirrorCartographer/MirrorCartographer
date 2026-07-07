#!/usr/bin/env python3
"""Unit tests for claim status transition guard."""

from __future__ import annotations

from guard_claim_status_transitions import validate_transition


def base_transition(**overrides):
    transition = {
        "id": "transition.synthetic.test",
        "source_status": "synthetic_fixture",
        "privacy_status": "public_safe",
        "from_claim_status": "normalized_evidence",
        "to_claim_status": "hypothesis_seed",
        "missingness": [],
        "revision_reason": "promote normalized evidence into a falsifiable seed",
        "evidence_packets": [
            {
                "id": "packet.synthetic.test",
                "source_chain_validated": True,
                "retrieval_boundary_checked": True,
                "outcome_measures_defined": True,
                "falsification_tasks_defined": False,
                "review_readiness_score": 0.5,
            }
        ],
    }
    transition.update(overrides)
    return transition


def test_valid_normalized_evidence_to_hypothesis_seed_passes():
    result = validate_transition(base_transition())
    assert result.decision == "allow_transition"
    assert result.blocked_reasons == []


def test_private_privacy_blocks():
    result = validate_transition(base_transition(privacy_status="private"))
    assert result.decision == "block_transition"
    assert "privacy_status_not_public_safe:private" in result.blocked_reasons


def test_missing_missingness_array_blocks():
    transition = base_transition()
    del transition["missingness"]
    result = validate_transition(transition)
    assert result.decision == "block_transition"
    assert "missingness_field_required" in result.blocked_reasons


def test_skipped_promotion_blocks_without_override():
    result = validate_transition(
        base_transition(
            from_claim_status="observation",
            to_claim_status="review_ready",
            evidence_packets=[
                {
                    "id": "packet.synthetic.skip",
                    "source_chain_validated": True,
                    "retrieval_boundary_checked": True,
                    "outcome_measures_defined": True,
                    "falsification_tasks_defined": True,
                    "review_readiness_score": 0.91,
                }
            ],
        )
    )
    assert result.decision == "block_transition"
    assert "skipped_claim_status_without_explicit_manual_override" in result.blocked_reasons


def test_review_ready_requires_falsification_and_score():
    result = validate_transition(
        base_transition(
            from_claim_status="falsification_ready",
            to_claim_status="review_ready",
            evidence_packets=[
                {
                    "id": "packet.synthetic.review",
                    "source_chain_validated": True,
                    "retrieval_boundary_checked": True,
                    "outcome_measures_defined": True,
                    "falsification_tasks_defined": False,
                    "review_readiness_score": 0.79,
                }
            ],
        )
    )
    assert result.decision == "block_transition"
    assert "falsification_tasks_not_defined:packet.synthetic.review" in result.blocked_reasons
    assert "review_readiness_score_below_0_8:packet.synthetic.review" in result.blocked_reasons


def test_review_to_export_passes_when_ready():
    result = validate_transition(
        base_transition(
            from_claim_status="review_ready",
            to_claim_status="collaborator_export_ready",
            evidence_packets=[
                {
                    "id": "packet.synthetic.export",
                    "source_chain_validated": True,
                    "retrieval_boundary_checked": True,
                    "outcome_measures_defined": True,
                    "falsification_tasks_defined": True,
                    "review_readiness_score": 0.95,
                }
            ],
        )
    )
    assert result.decision == "allow_transition"


def test_export_too_early_blocks_even_with_good_packet():
    result = validate_transition(
        base_transition(
            from_claim_status="hypothesis_seed",
            to_claim_status="collaborator_export_ready",
            evidence_packets=[
                {
                    "id": "packet.synthetic.early_export",
                    "source_chain_validated": True,
                    "retrieval_boundary_checked": True,
                    "outcome_measures_defined": True,
                    "falsification_tasks_defined": True,
                    "review_readiness_score": 0.99,
                }
            ],
        )
    )
    assert result.decision == "block_transition"
    assert "collaborator_export_requires_review_ready_source" in result.blocked_reasons


if __name__ == "__main__":
    tests = [
        test_valid_normalized_evidence_to_hypothesis_seed_passes,
        test_private_privacy_blocks,
        test_missing_missingness_array_blocks,
        test_skipped_promotion_blocks_without_override,
        test_review_ready_requires_falsification_and_score,
        test_review_to_export_passes_when_ready,
        test_export_too_early_blocks_even_with_good_packet,
    ]
    for test in tests:
        test()
    print(f"passed {len(tests)} claim status transition guard tests")
