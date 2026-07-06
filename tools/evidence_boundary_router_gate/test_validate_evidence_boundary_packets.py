#!/usr/bin/env python3
"""Regression tests for Evidence Boundary Router Gate."""

from __future__ import annotations

import importlib.util
from pathlib import Path

MODULE_PATH = Path(__file__).with_name("validate_evidence_boundary_packets.py")
spec = importlib.util.spec_from_file_location("validate_evidence_boundary_packets", MODULE_PATH)
module = importlib.util.module_from_spec(spec)
assert spec and spec.loader
spec.loader.exec_module(module)


def base_packet(**overrides):
    packet = {
        "packet_id": "pass_base_001",
        "domain": "scientific_reasoning",
        "claim_text": "A research packet should be routed only when source, claim, privacy, and measurement boundaries are explicit.",
        "source_status": "synthetic_fixture",
        "claim_status": "hypothesis",
        "privacy_status": "public_safe",
        "missingness": {"state": "unknown", "not_interpreted_as_absence": True},
        "boundary_route": "research_question_prep",
        "allowed_uses": ["organize_questions", "route_to_falsification"],
        "blocked_uses": ["diagnosis", "treatment_recommendation"],
        "measurable_variables": [
            {"name": "boundary_violation_count", "unit_or_scale": "integer", "collection_status": "synthetic"}
        ],
        "falsification_route": "If packets with boundary violations pass validation, the routing claim is falsified.",
        "next_executable_action": "Run the validator against synthetic fixtures."
    }
    packet.update(overrides)
    return packet


def assert_valid(packet):
    errors = module.validate_packet(packet)
    assert errors == [], errors


def assert_invalid(packet, expected_substring):
    errors = module.validate_packet(packet)
    assert any(expected_substring in error for error in errors), errors


def test_question_prep_packet_passes_with_advice_blocks():
    assert_valid(base_packet())


def test_private_rejected_packet_cannot_enter_backlog():
    assert_invalid(
        base_packet(
            privacy_status="private_rejected",
            boundary_route="hypothesis_backlog",
            allowed_uses=["route_to_falsification"],
            blocked_uses=["public_memory_with_private_identifiers"]
        ),
        "private or redaction-required"
    )


def test_advice_like_packet_cannot_enter_literature_map():
    assert_invalid(
        base_packet(
            boundary_route="literature_map",
            allowed_uses=["map_literature"],
            blocked_uses=["veterinary_instruction", "treatment_recommendation"]
        ),
        "advice-like"
    )


def test_missingness_as_absence_is_rejected():
    assert_invalid(
        base_packet(missingness={"state": "unknown", "not_interpreted_as_absence": False}),
        "missing-as-absence"
    )


def test_assistant_inferred_observation_is_rejected():
    assert_invalid(
        base_packet(source_status="assistant_inferred", claim_status="observation"),
        "assistant-inferred"
    )


def test_symbolic_translation_requires_symbol_variable_measurement():
    assert_invalid(
        base_packet(
            domain="symbolic_to_operational_translation",
            boundary_route="symbolic_translation_queue",
            allowed_uses=["design_nonclinical_tests"],
            blocked_uses=["claiming_causality_from_observation"],
            measurable_variables=[
                {"name": "latency", "unit_or_scale": "seconds", "collection_status": "synthetic"}
            ]
        ),
        "symbolic translation"
    )


def test_symbolic_translation_passes_with_symbol_measurement():
    assert_valid(
        base_packet(
            domain="symbolic_to_operational_translation",
            boundary_route="symbolic_translation_queue",
            allowed_uses=["design_nonclinical_tests"],
            blocked_uses=["claiming_causality_from_observation"],
            measurable_variables=[
                {"name": "symbol_to_variable_count", "unit_or_scale": "integer", "collection_status": "synthetic"}
            ]
        )
    )


if __name__ == "__main__":
    tests = [name for name in globals() if name.startswith("test_")]
    for name in tests:
        globals()[name]()
    print(f"passed {len(tests)} evidence boundary router tests")
