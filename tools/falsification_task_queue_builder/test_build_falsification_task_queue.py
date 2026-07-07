#!/usr/bin/env python3
"""Regression tests for falsification task queue builder."""

from __future__ import annotations

import importlib.util
from pathlib import Path

ROOT = Path(__file__).resolve().parent
MODULE_PATH = ROOT / "build_falsification_task_queue.py"
FIXTURE_PATH = ROOT / "fixtures.synthetic.json"

spec = importlib.util.spec_from_file_location("build_falsification_task_queue", MODULE_PATH)
module = importlib.util.module_from_spec(spec)
assert spec.loader is not None
spec.loader.exec_module(module)


def test_fixture_routes_and_blocks_are_deterministic() -> None:
    packets = module.load_packets(FIXTURE_PATH)
    result = module.build_queue(packets)

    assert result["summary"] == {
        "queued_count": 3,
        "blocked_count": 2,
        "high_risk_count": 2,
        "review_required_count": 2,
    }

    assert [task["hypothesis_id"] for task in result["queue"]] == [
        "HYP-SYN-001",
        "HYP-SYN-002",
        "HYP-SYN-003",
    ]

    blocked = {item["hypothesis_id"]: item["reasons"] for item in result["blocked"]}
    assert "no missingness or proposed falsification test" in blocked["HYP-SYN-004"]
    assert "unsafe privacy_status" in blocked["HYP-SYN-005"]


def test_high_risk_domains_require_review() -> None:
    packets = module.load_packets(FIXTURE_PATH)
    result = module.build_queue(packets)
    review_map = {task["hypothesis_id"]: task["review_required"] for task in result["queue"]}

    assert review_map["HYP-SYN-001"] is True
    assert review_map["HYP-SYN-002"] is True
    assert review_map["HYP-SYN-003"] is False


def test_empty_or_unsafe_packets_are_blocked() -> None:
    result = module.build_queue([
        {
            "hypothesis_id": "BAD-001",
            "domain": "animal_care",
            "claim_text": "",
            "claim_status": "candidate",
            "evidence_refs": [],
            "missingness": [],
            "risk_level": "high",
            "proposed_test": "",
            "privacy_status": "private",
        }
    ])

    reasons = result["blocked"][0]["reasons"]
    assert "unsafe privacy_status" in reasons
    assert "empty claim_text" in reasons
    assert "no missingness or proposed falsification test" in reasons
    assert result["queue"] == []


if __name__ == "__main__":
    test_fixture_routes_and_blocks_are_deterministic()
    test_high_risk_domains_require_review()
    test_empty_or_unsafe_packets_are_blocked()
    print("ok")
