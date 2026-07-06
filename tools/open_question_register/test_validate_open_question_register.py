#!/usr/bin/env python3
"""Regression tests for the open question register validator."""

from __future__ import annotations

import json
import tempfile
from pathlib import Path

from validate_open_question_register import summarize, validate_packet


def valid_packet():
    return {
        "question_id": "oq_test_valid",
        "domain": "hypothesis_generation",
        "question": "Which synthetic variables should be promoted into the next hypothesis batch?",
        "source_status": "synthetic_fixture",
        "claim_status": "open_question",
        "privacy_status": "public_safe_synthetic",
        "missingness": ["variable independence unknown"],
        "variables": ["variable_count", "independence_score"],
        "evidence_refs": ["synthetic_ref"],
        "falsification_route": "Reject promotion when variables cannot survive negative-control comparison.",
        "next_executable_action": "Generate synthetic hypothesis candidates for falsification routing.",
    }


def test_valid_packet_passes():
    ok, errors = validate_packet(valid_packet())
    assert ok, errors


def test_conclusion_claim_fails():
    packet = valid_packet()
    packet["claim_status"] = "confirmed_claim"
    ok, errors = validate_packet(packet)
    assert not ok
    assert any("claim_status" in error for error in errors)


def test_private_packet_fails():
    packet = valid_packet()
    packet["privacy_status"] = "private_raw"
    ok, errors = validate_packet(packet)
    assert not ok
    assert any("privacy_status" in error for error in errors)


def test_forbidden_cure_language_fails():
    packet = valid_packet()
    packet["question"] = "Does this prove that the synthetic pattern will cure the condition?"
    ok, errors = validate_packet(packet)
    assert not ok
    assert any("forbidden" in error for error in errors)


def test_too_few_variables_fails():
    packet = valid_packet()
    packet["variables"] = ["single_variable"]
    ok, errors = validate_packet(packet)
    assert not ok
    assert any("variables" in error for error in errors)


def test_summary_counts_failures():
    packets = [valid_packet(), valid_packet()]
    packets[1]["question_id"] = "oq_test_invalid"
    packets[1]["evidence_refs"] = []

    with tempfile.TemporaryDirectory() as tmpdir:
        path = Path(tmpdir) / "packets.json"
        path.write_text(json.dumps(packets), encoding="utf-8")
        summary = summarize(path)

    assert summary["packet_count"] == 2
    assert summary["passed"] == 1
    assert summary["failed"] == 1


if __name__ == "__main__":
    test_valid_packet_passes()
    test_conclusion_claim_fails()
    test_private_packet_fails()
    test_forbidden_cure_language_fails()
    test_too_few_variables_fails()
    test_summary_counts_failures()
    print("open_question_register tests passed")
