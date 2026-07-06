#!/usr/bin/env python3
"""Regression tests for the public-safe novel hypothesis gate."""

from validate_hypothesis_packets import validate_packet

VALID_PACKET = {
    "packet_id": "hyp_public_latency_context_switch_001",
    "phenomenon_id": "phen_public_context_switch_001",
    "hypothesis_statement": "A candidate discovery packet becomes more testable when context-switch events are represented as transitions between typed states rather than as unstructured narrative summaries.",
    "novelty_basis": "The claim adds a new representational requirement because transition typing should increase downstream testability compared with prose-only capture.",
    "mechanism_hint": "Typed state transitions constrain which variables, alternatives, and falsification routes can be attached to a packet.",
    "measurable_variables": [
        {
            "name": "testable_variable_count",
            "operational_definition": "Number of variables with units or explicit measurement rules attached to a packet."
        },
        {
            "name": "valid_falsification_route_present",
            "operational_definition": "Boolean indicating whether an observable failure condition is specified."
        }
    ],
    "alternative_explanations": [
        "Improved testability may come from stricter templates rather than transition typing.",
        "Improved testability may come from evaluator bias toward structured records rather than actual discovery value."
    ],
    "source_status": "synthetic",
    "claim_status": "candidate",
    "privacy_status": "public_safe_only",
    "missingness": "Needs paired evaluation against prose-only packets and transition-typed packets.",
    "revision_reason": "Create a testable bridge from unresolved phenomenon mapping to mechanism generation.",
    "implementation_status": "implemented",
    "testability": "high",
    "falsification_route": "If transition-typed packets do not increase valid variable count or falsification-route presence compared with prose-only packets, reject or revise the claim.",
    "next_executable_action": "Generate matched prose-only and transition-typed synthetic packets and score both with the pipeline regression runner."
}


def test_valid_packet_passes():
    assert validate_packet(VALID_PACKET) == []


def test_missing_alternatives_fails():
    packet = dict(VALID_PACKET)
    packet["alternative_explanations"] = []
    errors = validate_packet(packet)
    assert any("alternative_explanations" in error for error in errors)


def test_single_variable_fails():
    packet = dict(VALID_PACKET)
    packet["measurable_variables"] = packet["measurable_variables"][:1]
    errors = validate_packet(packet)
    assert any("measurable_variables" in error for error in errors)


def test_private_or_advice_terms_fail():
    packet = dict(VALID_PACKET)
    packet["hypothesis_statement"] = "A named person's diagnosis should be treated by the system as a valid discovery hypothesis."
    errors = validate_packet(packet)
    assert any("privacy" in error or "advice" in error for error in errors)


def test_bad_enum_fails():
    packet = dict(VALID_PACKET)
    packet["source_status"] = "private_note"
    errors = validate_packet(packet)
    assert any("source_status" in error for error in errors)


if __name__ == "__main__":
    test_valid_packet_passes()
    test_missing_alternatives_fails()
    test_single_variable_fails()
    test_private_or_advice_terms_fail()
    test_bad_enum_fails()
    print("novel hypothesis gate tests passed")
