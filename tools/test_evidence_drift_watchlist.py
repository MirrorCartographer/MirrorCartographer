#!/usr/bin/env python3
"""Tests for tools/evidence_drift_watchlist.py."""

from __future__ import annotations

import importlib.util
from pathlib import Path

MODULE_PATH = Path(__file__).with_name("evidence_drift_watchlist.py")
spec = importlib.util.spec_from_file_location("evidence_drift_watchlist", MODULE_PATH)
module = importlib.util.module_from_spec(spec)
assert spec and spec.loader
spec.loader.exec_module(module)


def packet(**overrides):
    base = {
        "id": "base-001",
        "domain": "medical_literature",
        "claim_text": "Synthetic public-safe packet.",
        "claim_status": "review_needed",
        "source_status": "primary",
        "privacy_status": "synthetic",
        "evidence_date": "2026-06-01",
        "last_reviewed_date": "2026-07-01",
        "contradiction_count": 0,
        "superseded_by": [],
        "missingness": [],
        "revision_reason": "test fixture",
    }
    base.update(overrides)
    return base


def route(**overrides):
    return module.route_packet(packet(**overrides))


def test_stable_packet_routes_stable():
    result = route()
    assert result.route == "stable"
    assert result.drift_reasons == []


def test_private_packet_blocks():
    result = route(privacy_status="private")
    assert result.route == "block"
    assert "privacy_not_public_safe" in result.drift_reasons


def test_unknown_privacy_blocks():
    result = route(privacy_status="unknown")
    assert result.route == "block"
    assert "privacy_not_public_safe" in result.drift_reasons


def test_contradicted_packet_blocks():
    result = route(claim_status="contradicted", contradiction_count=3)
    assert result.route == "block"
    assert "claim_contradicted" in result.drift_reasons


def test_superseded_packet_routes_review():
    result = route(superseded_by=["newer-packet"])
    assert result.route == "review"
    assert "evidence_superseded" in result.drift_reasons


def test_contradiction_count_routes_review():
    result = route(contradiction_count=1)
    assert result.route == "review"
    assert "contradictions_present" in result.drift_reasons


def test_old_evidence_routes_watch():
    result = route(evidence_date="2025-01-01", last_reviewed_date="2026-07-01")
    assert result.route == "watch"
    assert any(reason.startswith("stale_review_window_gt_") for reason in result.drift_reasons)


def test_missingness_routes_watch():
    result = route(missingness=["dose_unknown", "timing_unknown"])
    assert result.route == "watch"
    assert any(reason.startswith("missingness_present:") for reason in result.drift_reasons)


def test_invalid_date_routes_review():
    result = route(evidence_date="not-a-date")
    assert result.route == "review"
    assert "evidence_date:invalid_date" in result.drift_reasons


def test_summary_counts_all_routes():
    output = module.build_watchlist({
        "packets": [
            packet(id="stable"),
            packet(id="watch", evidence_date="2025-01-01", last_reviewed_date="2026-07-01"),
            packet(id="review", superseded_by=["newer"]),
            packet(id="block", privacy_status="private"),
        ]
    })
    assert output["summary"] == {"stable": 1, "watch": 1, "review": 1, "block": 1}
    assert len(output["watchlist"]) == 4


if __name__ == "__main__":
    for name, fn in sorted(globals().items()):
        if name.startswith("test_") and callable(fn):
            fn()
    print("ok")
