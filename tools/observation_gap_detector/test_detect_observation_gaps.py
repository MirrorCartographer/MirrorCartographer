#!/usr/bin/env python3
"""Regression tests for observation gap detector."""

from __future__ import annotations

import json
import tempfile
from pathlib import Path

from detect_observation_gaps import build_report, load_streams

FIXTURE_PATH = Path(__file__).with_name("fixtures.synthetic.json")


def test_fixture_routes() -> None:
    report = build_report(load_streams(FIXTURE_PATH))
    routes = {packet["stream_id"]: packet["route"] for packet in report["gap_packets"]}
    assert routes["synthetic-human-window-alpha"] == "repair_missing_fields"
    assert routes["synthetic-animal-care-beta"] == "review_temporal_gap"
    assert routes["synthetic-literature-gamma"] == "eligible_for_signal_triage"
    assert routes["synthetic-behavioral-delta"] == "hold_for_more_data"


def test_required_public_safe_labels_exist() -> None:
    report = build_report(load_streams(FIXTURE_PATH))
    required = {
        "source_status",
        "claim_status",
        "privacy_status",
        "missingness",
        "revision_reason",
        "implementation_status",
        "testability",
        "next_executable_action",
    }
    for packet in report["gap_packets"]:
        assert required.issubset(packet.keys())
        assert packet["privacy_status"] == "public_safe_no_direct_identifiers"


def test_rejects_non_array_input() -> None:
    with tempfile.TemporaryDirectory() as directory:
        path = Path(directory) / "bad.json"
        path.write_text(json.dumps({"not": "a list"}), encoding="utf-8")
        try:
            load_streams(path)
        except ValueError as exc:
            assert "JSON array" in str(exc)
        else:  # pragma: no cover
            raise AssertionError("Expected ValueError for non-array input")


def test_rejects_direct_identifier_in_subject_class() -> None:
    stream = load_streams(FIXTURE_PATH)[0]
    stream = dict(stream)
    stream["subject_class"] = "person test@example.com"
    try:
        build_report([stream])
    except ValueError as exc:
        assert "direct identifier" in str(exc)
    else:  # pragma: no cover
        raise AssertionError("Expected direct identifier rejection")


def test_gap_packet_is_public_safe_and_actionable() -> None:
    report = build_report(load_streams(FIXTURE_PATH))
    packet = next(item for item in report["gap_packets"] if item["stream_id"] == "synthetic-animal-care-beta")
    assert packet["largest_gap_days"] == 5
    assert packet["gap_dates"] == [{"from": "2026-02-01", "to": "2026-02-06", "gap_days": 5}]
    assert "Review temporal gap" in packet["next_executable_action"]


def run_tests() -> None:
    test_fixture_routes()
    test_required_public_safe_labels_exist()
    test_rejects_non_array_input()
    test_rejects_direct_identifier_in_subject_class()
    test_gap_packet_is_public_safe_and_actionable()


if __name__ == "__main__":
    run_tests()
    print("observation_gap_detector tests passed")
