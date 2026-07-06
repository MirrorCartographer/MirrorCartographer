#!/usr/bin/env python3
"""Regression tests for public-safe memory packet validation."""

from __future__ import annotations

import importlib.util
from pathlib import Path

MODULE_PATH = Path(__file__).with_name("validate_public_safe_memory_packets.py")
spec = importlib.util.spec_from_file_location("validator", MODULE_PATH)
validator = importlib.util.module_from_spec(spec)
assert spec.loader is not None
spec.loader.exec_module(validator)


def base_packet():
    return {
        "packet_id": "unit-pass-001",
        "source_status": "synthetic",
        "claim_status": "hypothesis",
        "privacy_status": "public_safe",
        "missingness": ["needs external evidence"],
        "revision_reason": "Unit test packet.",
        "implementation_status": "draft",
        "testability": "Score with synthetic fixtures.",
        "next_executable_action": "Build a provenance packet.",
        "body": "A public-safe hypothesis summary with measurable variables.",
        "variables": [
            {
                "name": "conversion_rate",
                "unit_or_scale": "0_to_1_ratio",
                "collection_mode": "synthetic_summary",
            }
        ],
        "redaction": {
            "contains_raw_transcript": False,
            "contains_direct_identifier": False,
            "contains_exact_timestamp": False,
            "contains_location_detail": False,
            "contains_diagnosis_or_treatment_instruction": False,
            "contains_animal_care_advice": False,
        },
    }


def assert_decision(packet, expected):
    result = validator.validate_packet(packet)
    assert result["decision"] == expected, result
    return result


def test_passes_public_safe_measurable_packet():
    assert_decision(base_packet(), "pass")


def test_blocks_non_public_safe_packet():
    packet = base_packet()
    packet["privacy_status"] = "needs_redaction"
    result = assert_decision(packet, "block")
    assert any("public_safe" in error for error in result["errors"])


def test_blocks_raw_transcript_residue():
    packet = base_packet()
    packet["redaction"]["contains_raw_transcript"] = True
    result = assert_decision(packet, "block")
    assert any("contains_raw_transcript" in error for error in result["errors"])


def test_blocks_direct_identifier():
    packet = base_packet()
    packet["redaction"]["contains_direct_identifier"] = True
    result = assert_decision(packet, "block")
    assert any("contains_direct_identifier" in error for error in result["errors"])


def test_blocks_medical_or_animal_advice_flags():
    packet = base_packet()
    packet["redaction"]["contains_diagnosis_or_treatment_instruction"] = True
    packet["redaction"]["contains_animal_care_advice"] = True
    result = assert_decision(packet, "block")
    assert any("contains_diagnosis_or_treatment_instruction" in error for error in result["errors"])
    assert any("contains_animal_care_advice" in error for error in result["errors"])


def test_blocks_advice_like_body_marker():
    packet = base_packet()
    packet["body"] = "This would incorrectly say you should take a dose."
    result = assert_decision(packet, "block")
    assert any("advice-like" in error for error in result["errors"])


def test_blocks_unmeasurable_packet():
    packet = base_packet()
    packet["variables"] = []
    result = assert_decision(packet, "block")
    assert any("variables" in error for error in result["errors"])


def test_mixed_source_warns_but_can_pass():
    packet = base_packet()
    packet["source_status"] = "mixed"
    result = assert_decision(packet, "pass")
    assert result["warnings"]


if __name__ == "__main__":
    test_passes_public_safe_measurable_packet()
    test_blocks_non_public_safe_packet()
    test_blocks_raw_transcript_residue()
    test_blocks_direct_identifier()
    test_blocks_medical_or_animal_advice_flags()
    test_blocks_advice_like_body_marker()
    test_blocks_unmeasurable_packet()
    test_mixed_source_warns_but_can_pass()
    print("public_safe_memory_redactor tests passed")
