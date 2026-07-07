#!/usr/bin/env python3
"""Tests for Effect Window Comparator."""

from compare_effect_windows import compare_packet


def make_packet(**overrides):
    packet = {
        "packet_id": "test-packet",
        "source_status": "synthetic_public_safe",
        "claim_status": "candidate_effect",
        "privacy_status": "public_safe",
        "revision_reason": "unit test",
        "comparison": {
            "entity_kind": "system",
            "change_label": "synthetic change",
            "change_timestamp": "2026-07-01T10:00:00Z",
            "expected_direction": "decrease",
            "expected_window_hours": 72,
            "outcome_metric": "synthetic score",
            "minimum_baseline_points": 2,
            "minimum_followup_points": 2,
        },
        "observations": [
            {
                "timestamp": "2026-06-29T10:00:00Z",
                "phase": "baseline",
                "metric_value": 6,
                "unit": "ordinal_0_10",
                "source_type": "synthetic",
                "confounders": [],
                "missingness": [],
            },
            {
                "timestamp": "2026-06-30T10:00:00Z",
                "phase": "baseline",
                "metric_value": 5,
                "unit": "ordinal_0_10",
                "source_type": "synthetic",
                "confounders": [],
                "missingness": [],
            },
            {
                "timestamp": "2026-07-02T10:00:00Z",
                "phase": "followup",
                "metric_value": 3,
                "unit": "ordinal_0_10",
                "source_type": "synthetic",
                "confounders": [],
                "missingness": [],
            },
            {
                "timestamp": "2026-07-03T10:00:00Z",
                "phase": "followup",
                "metric_value": 2,
                "unit": "ordinal_0_10",
                "source_type": "synthetic",
                "confounders": [],
                "missingness": [],
            },
        ],
        "missingness": [],
    }
    packet.update(overrides)
    return packet


def test_candidate_signal_when_direction_matches_and_windows_are_complete():
    result = compare_packet(make_packet())
    assert result["decision"] == "candidate_signal"
    assert result["baseline_count"] == 2
    assert result["followup_count"] == 2
    assert result["baseline_mean"] == 5.5
    assert result["followup_mean"] == 2.5
    assert result["direction_observed"] == "decrease"
    assert result["claim_status"] == "candidate_effect_not_causal"
    assert result["next_executable_action"] == "send_to_contradiction_ledger"


def test_blocks_private_residue():
    packet = make_packet(privacy_status="private_residue_possible")
    result = compare_packet(packet)
    assert result["decision"] == "blocked"
    assert "privacy_not_public_safe" in result["blockers"]
    assert result["next_executable_action"] == "redact_or_repair_packet"


def test_sparse_baseline_is_inconclusive_not_promoted():
    packet = make_packet()
    packet["observations"] = [obs for obs in packet["observations"] if obs["phase"] == "followup"]
    result = compare_packet(packet)
    assert result["decision"] == "inconclusive"
    assert "insufficient_baseline_points" in result["warnings"]


def test_direction_mismatch_is_inconclusive():
    packet = make_packet()
    packet["comparison"]["expected_direction"] = "increase"
    result = compare_packet(packet)
    assert result["decision"] == "inconclusive"
    assert result["direction_observed"] == "decrease"
    assert "observed_direction_mismatch" in result["warnings"]


def test_followup_outside_window_does_not_count():
    packet = make_packet()
    packet["comparison"]["expected_window_hours"] = 12
    result = compare_packet(packet)
    assert result["decision"] == "inconclusive"
    assert result["followup_count"] == 0
    assert "followup_points_outside_expected_window" in result["warnings"]


def test_missing_required_labels_block_packet():
    packet = make_packet()
    del packet["revision_reason"]
    result = compare_packet(packet)
    assert result["decision"] == "blocked"
    assert "missing_packet_field:revision_reason" in result["blockers"]


def run_all():
    test_candidate_signal_when_direction_matches_and_windows_are_complete()
    test_blocks_private_residue()
    test_sparse_baseline_is_inconclusive_not_promoted()
    test_direction_mismatch_is_inconclusive()
    test_followup_outside_window_does_not_count()
    test_missing_required_labels_block_packet()
    print("effect_window_comparator tests passed")


if __name__ == "__main__":
    run_all()
