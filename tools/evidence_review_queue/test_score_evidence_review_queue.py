#!/usr/bin/env python3
"""Regression tests for evidence_review_queue scorer."""

from __future__ import annotations

import json
import subprocess
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(HERE))

from score_evidence_review_queue import PacketError, score_packet, score_packets  # noqa: E402


def load_fixtures():
    return json.loads((HERE / "fixtures.synthetic.json").read_text(encoding="utf-8"))


def by_id(results):
    return {result["packet_id"]: result for result in results}


def test_expected_queues():
    results = by_id(score_packets(load_fixtures()))
    assert results["pkt_promote_001"]["queue"] == "promote_candidate"
    assert results["pkt_falsify_001"]["queue"] == "falsification_priority"
    assert results["pkt_normalize_001"]["queue"] == "needs_normalization"
    assert results["pkt_more_evidence_001"]["queue"] == "needs_more_evidence"
    assert results["pkt_block_private_001"]["queue"] == "blocked_privacy_or_advice"
    assert results["pkt_block_overclaim_001"]["queue"] == "blocked_privacy_or_advice"


def test_private_packets_score_zero():
    results = by_id(score_packets(load_fixtures()))
    assert results["pkt_block_private_001"]["score"] == 0


def test_overclaims_score_zero():
    results = by_id(score_packets(load_fixtures()))
    assert results["pkt_block_overclaim_001"]["score"] == 0


def test_missing_variables_rejected():
    packet = dict(load_fixtures()[0])
    packet["id"] = "bad_missing_variables"
    packet["measurable_variables"] = []
    try:
        score_packet(packet)
    except PacketError as exc:
        assert "measurable_variables" in str(exc)
    else:
        raise AssertionError("missing measurable variables should fail shape validation")


def test_invalid_status_rejected():
    packet = dict(load_fixtures()[0])
    packet["id"] = "bad_status"
    packet["source_status"] = "blogish"
    try:
        score_packet(packet)
    except PacketError as exc:
        assert "invalid source_status" in str(exc)
    else:
        raise AssertionError("invalid source_status should fail shape validation")


def test_cli_outputs_json():
    completed = subprocess.run(
        [sys.executable, str(HERE / "score_evidence_review_queue.py"), str(HERE / "fixtures.synthetic.json")],
        check=True,
        capture_output=True,
        text=True,
    )
    parsed = json.loads(completed.stdout)
    assert isinstance(parsed, list)
    assert len(parsed) == 6
    assert {item["queue"] for item in parsed} >= {
        "promote_candidate",
        "falsification_priority",
        "needs_normalization",
        "needs_more_evidence",
        "blocked_privacy_or_advice",
    }


def run_all():
    test_expected_queues()
    test_private_packets_score_zero()
    test_overclaims_score_zero()
    test_missing_variables_rejected()
    test_invalid_status_rejected()
    test_cli_outputs_json()


if __name__ == "__main__":
    run_all()
    print("ok")
