#!/usr/bin/env python3
"""Regression tests for the Animal Evidence Router."""

from __future__ import annotations

import importlib.util
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent
MODULE_PATH = ROOT / "route_animal_evidence_packets.py"
spec = importlib.util.spec_from_file_location("route_animal_evidence_packets", MODULE_PATH)
router = importlib.util.module_from_spec(spec)
assert spec and spec.loader
spec.loader.exec_module(router)


def load_fixtures():
    return json.loads((ROOT / "fixtures.synthetic.json").read_text(encoding="utf-8"))


def test_expected_routes():
    results = {item["packet_id"]: item for item in router.route_packets(load_fixtures())}
    assert results["aer-pass-001"]["route"] == "organize_evidence"
    assert results["aer-privacy-001"]["route"] == "privacy_block"
    assert results["aer-overclaim-001"]["route"] == "reject_overclaim"
    assert results["aer-more-evidence-001"]["route"] == "needs_more_evidence"
    assert results["aer-vet-review-001"]["route"] == "needs_veterinary_review"


def test_invalid_packet_missing_fields():
    result = router.route_packet({"packet_id": "broken"})
    assert result.route == "invalid_packet"
    assert any("missing required fields" in reason for reason in result.reasons)


def test_public_safe_packet_needs_three_variables_and_one_reference():
    packet = load_fixtures()[0]
    weak = dict(packet)
    weak["measurable_variables"] = ["species", "source_type"]
    result = router.route_packet(weak)
    assert result.route == "needs_more_evidence"


def test_private_flag_blocks_even_if_privacy_status_claims_safe():
    packet = load_fixtures()[0]
    risky = dict(packet)
    risky["privacy_status"] = "public_safe"
    risky["forbidden_content_flags"] = ["exact_timestamp"]
    result = router.route_packet(risky)
    assert result.route == "privacy_block"


if __name__ == "__main__":
    test_expected_routes()
    test_invalid_packet_missing_fields()
    test_public_safe_packet_needs_three_variables_and_one_reference()
    test_private_flag_blocks_even_if_privacy_status_claims_safe()
    print("ok")
