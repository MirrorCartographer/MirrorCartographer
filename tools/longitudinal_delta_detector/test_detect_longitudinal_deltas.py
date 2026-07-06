#!/usr/bin/env python3
"""Regression tests for the MC Longitudinal Delta Detector."""

from detect_longitudinal_deltas import score_record


def test_candidate_delta_event_detected():
    record = {
        "id": "candidate",
        "privacy_status": "synthetic_public_safe",
        "source_status": "synthetic",
        "claim_status": "candidate_pattern",
        "series": [
            {"bucket": "t-5", "signal": "x", "value": 1.0, "unit": "score", "context": "neutral"},
            {"bucket": "t-4", "signal": "x", "value": 1.1, "unit": "score", "context": "neutral"},
            {"bucket": "t-3", "signal": "x", "value": 1.0, "unit": "score", "context": "neutral"},
            {"bucket": "t-2", "signal": "x", "value": 2.0, "unit": "score", "context": "neutral"},
            {"bucket": "t-1", "signal": "x", "value": 2.1, "unit": "score", "context": "neutral"},
            {"bucket": "t", "signal": "x", "value": 2.0, "unit": "score", "context": "neutral"}
        ],
        "minimum_effect_size": 0.25,
        "minimum_points": 6
    }
    assert score_record(record)["route"] == "candidate_delta_event"


def test_private_bucket_blocked():
    record = {
        "id": "private",
        "privacy_status": "synthetic_public_safe",
        "source_status": "synthetic",
        "claim_status": "candidate_pattern",
        "series": [
            {"bucket": "2026-07-06T02:00:00-04:00", "signal": "x", "value": 1, "unit": "count", "context": "neutral"},
            {"bucket": "2026-07-06T03:00:00-04:00", "signal": "x", "value": 2, "unit": "count", "context": "neutral"}
        ],
        "minimum_effect_size": 0.25,
        "minimum_points": 2
    }
    result = score_record(record)
    assert result["route"] == "block_privacy"
    assert "point_0_bucket_not_relative_or_coarse" in result["errors"]


def test_sparse_series_needs_more_data():
    record = {
        "id": "sparse",
        "privacy_status": "synthetic_public_safe",
        "source_status": "synthetic",
        "claim_status": "candidate_pattern",
        "series": [
            {"bucket": "t-1", "signal": "x", "value": 1, "unit": "count", "context": "neutral"},
            {"bucket": "t", "signal": "x", "value": 2, "unit": "count", "context": "neutral"}
        ],
        "minimum_effect_size": 0.25,
        "minimum_points": 6
    }
    assert score_record(record)["route"] == "needs_more_data"


def test_stable_baseline_not_promoted():
    record = {
        "id": "stable",
        "privacy_status": "synthetic_public_safe",
        "source_status": "synthetic",
        "claim_status": "candidate_pattern",
        "series": [
            {"bucket": "t-5", "signal": "x", "value": 1.0, "unit": "score", "context": "neutral"},
            {"bucket": "t-4", "signal": "x", "value": 1.0, "unit": "score", "context": "neutral"},
            {"bucket": "t-3", "signal": "x", "value": 1.1, "unit": "score", "context": "neutral"},
            {"bucket": "t-2", "signal": "x", "value": 1.0, "unit": "score", "context": "neutral"},
            {"bucket": "t-1", "signal": "x", "value": 1.1, "unit": "score", "context": "neutral"},
            {"bucket": "t", "signal": "x", "value": 1.0, "unit": "score", "context": "neutral"}
        ],
        "minimum_effect_size": 2.0,
        "minimum_points": 6
    }
    assert score_record(record)["route"] == "stable_baseline"


if __name__ == "__main__":
    test_candidate_delta_event_detected()
    test_private_bucket_blocked()
    test_sparse_series_needs_more_data()
    test_stable_baseline_not_promoted()
    print("longitudinal_delta_detector tests passed")
