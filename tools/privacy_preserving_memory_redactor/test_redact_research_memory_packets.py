#!/usr/bin/env python3
"""Regression tests for privacy_preserving_memory_redactor."""

from __future__ import annotations

import json
import tempfile
from pathlib import Path

from redact_research_memory_packets import normalize_packet, run

FIXTURE_PATH = Path(__file__).with_name("fixtures.synthetic.json")


def by_id(result, packet_id):
    for packet in result["packets"]:
        if packet["packet_id"] == packet_id:
            return packet
    raise AssertionError(f"missing packet {packet_id}")


def test_fixture_routes_are_stable():
    result = run(FIXTURE_PATH)
    assert result["component"] == "privacy_preserving_memory_redactor"
    assert result["summary"]["total"] == 4
    assert by_id(result, "pmr-001")["route"] == "memory_ready"
    assert by_id(result, "pmr-002")["route"] == "private_review_required"
    assert by_id(result, "pmr-003")["route"] == "boundary_review_required"
    assert by_id(result, "pmr-004")["route"] == "memory_ready"


def test_private_identifiers_are_redacted_and_blocked():
    packet = normalize_packet({
        "packet_id": "private-case",
        "domain": "general",
        "source_status": "user_private",
        "claim_status": "observation_only",
        "privacy_status": "private_contains_identifiers",
        "text": "Contact a@b.com or 555-111-2222 at 18 Test Street. Full name marker Jane Example.",
        "missingness": ["private fixture"],
        "revision_reason": "unit test",
    })
    assert packet["route"] == "private_review_required"
    assert packet["severity"] == "block"
    assert "[REDACTED_EMAIL]" in packet["redacted_text"]
    assert "[REDACTED_PHONE]" in packet["redacted_text"]
    assert "[REDACTED_ADDRESS]" in packet["redacted_text"]
    assert "[REDACTED_FULL_NAME]" in packet["redacted_text"]
    assert "email_address" in packet["detected_risks"]
    assert "phone_like_contact" in packet["detected_risks"]


def test_cure_and_advice_language_routes_to_boundary_review():
    packet = normalize_packet({
        "packet_id": "claim-case",
        "domain": "hypothesis",
        "source_status": "synthetic",
        "claim_status": "bounded_hypothesis",
        "privacy_status": "synthetic_public_safe",
        "text": "This could cure the condition and should take a supplement.",
        "missingness": ["no evidence"],
        "revision_reason": "unit test",
    })
    assert packet["route"] == "boundary_review_required"
    assert packet["severity"] == "warn"
    assert "cure_certainty" in packet["detected_risks"]
    assert "directive_medical_language" in packet["detected_risks"]


def test_missingness_is_required_for_memory_ready():
    packet = normalize_packet({
        "packet_id": "missingness-case",
        "domain": "literature",
        "source_status": "synthetic",
        "claim_status": "bounded_summary",
        "privacy_status": "synthetic_public_safe",
        "text": "Bounded public-safe note without explicit caveats.",
        "missingness": [],
        "revision_reason": "unit test",
    })
    assert packet["route"] == "private_review_required"
    assert "missingness_empty" in packet["detected_risks"]


def test_output_file_serializes_json():
    with tempfile.TemporaryDirectory() as tmpdir:
        out = Path(tmpdir) / "out.json"
        result = run(FIXTURE_PATH)
        out.write_text(json.dumps(result), encoding="utf-8")
        loaded = json.loads(out.read_text(encoding="utf-8"))
        assert loaded["summary"]["total"] == 4
        assert loaded["implementation_status"] == "executable_cli_with_fixtures_and_tests"


if __name__ == "__main__":
    test_fixture_routes_are_stable()
    test_private_identifiers_are_redacted_and_blocked()
    test_cure_and_advice_language_routes_to_boundary_review()
    test_missingness_is_required_for_memory_ready()
    test_output_file_serializes_json()
    print("privacy_preserving_memory_redactor tests passed")
