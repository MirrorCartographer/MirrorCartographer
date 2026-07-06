#!/usr/bin/env python3
"""Regression tests for collaboration-readiness gate."""

from __future__ import annotations

import importlib.util
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent
FIXTURE_PATH = ROOT / "fixtures.synthetic.json"
SCORER_PATH = ROOT / "score_collaboration_packets.py"

spec = importlib.util.spec_from_file_location("score_collaboration_packets", SCORER_PATH)
assert spec and spec.loader
scorer = importlib.util.module_from_spec(spec)
spec.loader.exec_module(scorer)


def load_fixtures() -> dict:
    return json.loads(FIXTURE_PATH.read_text(encoding="utf-8"))


def test_valid_packets_pass() -> None:
    fixtures = load_fixtures()
    for packet in fixtures["valid_packets"]:
        result = scorer.score_packet(packet)
        assert result["passes"], result
        assert result["score"] >= 90, result


def test_invalid_packets_fail_for_expected_reason() -> None:
    fixtures = load_fixtures()
    for item in fixtures["invalid_packets"]:
        result = scorer.score_packet(item["packet"])
        joined = "\n".join(result["errors"])
        assert not result["passes"], item["name"]
        assert item["expected_error_contains"] in joined, result


def test_supported_synthetic_claim_warns() -> None:
    packet = dict(load_fixtures()["valid_packets"][0])
    packet["claim_status"] = "supported"
    packet["source_status"] = "synthetic"
    result = scorer.score_packet(packet)
    assert result["passes"], result
    assert any("synthetic source" in warning for warning in result["warnings"]), result


if __name__ == "__main__":
    test_valid_packets_pass()
    test_invalid_packets_fail_for_expected_reason()
    test_supported_synthetic_claim_warns()
    print("all collaboration_readiness_gate tests passed")
