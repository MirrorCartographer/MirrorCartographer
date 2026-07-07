#!/usr/bin/env python3
"""Regression tests for medical_literature_claim_router."""

from __future__ import annotations

import json
import subprocess
import sys
from pathlib import Path

SCRIPT = Path(__file__).with_name("route_medical_literature_claims.py")
FIXTURES = Path(__file__).with_name("fixtures.synthetic.json")


def load_result() -> dict:
    completed = subprocess.run(
        [sys.executable, str(SCRIPT), str(FIXTURES)],
        check=True,
        capture_output=True,
        text=True,
    )
    return json.loads(completed.stdout)


def route_map(result: dict) -> dict:
    return {route["note_id"]: route for route in result["routes"]}


def test_public_background_enters_research_memory() -> None:
    routes = route_map(load_result())
    assert routes["lit_001"]["decision"] == "accepted"
    assert routes["lit_001"]["route"] == "research_memory"


def test_contradiction_routes_to_falsification_queue() -> None:
    routes = route_map(load_result())
    assert routes["lit_002"]["decision"] == "accepted"
    assert routes["lit_002"]["route"] == "falsification_queue"


def test_cure_claim_is_blocked() -> None:
    routes = route_map(load_result())
    assert routes["lit_003"]["decision"] == "blocked"
    assert routes["lit_003"]["route"] == "claim_block"


def test_private_residue_is_blocked() -> None:
    routes = route_map(load_result())
    assert routes["lit_004"]["decision"] == "blocked"
    assert routes["lit_004"]["route"] == "privacy_block"


def test_missing_source_metadata_needs_review() -> None:
    routes = route_map(load_result())
    assert routes["lit_005"]["decision"] == "accepted"
    assert routes["lit_005"]["route"] == "needs_review"


def test_summary_counts_are_stable() -> None:
    result = load_result()
    assert result["summary"]["total"] == 5
    assert result["summary"]["decisions"] == {"accepted": 3, "blocked": 2}
    assert result["summary"]["routes"] == {
        "claim_block": 1,
        "falsification_queue": 1,
        "needs_review": 1,
        "privacy_block": 1,
        "research_memory": 1,
    }


if __name__ == "__main__":
    test_public_background_enters_research_memory()
    test_contradiction_routes_to_falsification_queue()
    test_cure_claim_is_blocked()
    test_private_residue_is_blocked()
    test_missing_source_metadata_needs_review()
    test_summary_counts_are_stable()
    print("medical_literature_claim_router tests passed")
