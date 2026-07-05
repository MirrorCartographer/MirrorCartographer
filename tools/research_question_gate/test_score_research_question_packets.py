#!/usr/bin/env python3
"""Regression tests for the research question packet scorer."""

from score_research_question_packets import classify_packet


def base_packet():
    return {
        "packet_id": "test-packet",
        "source_status": "synthetic",
        "claim_status": "research_question",
        "privacy_status": "public_safe",
        "missingness": [],
        "revision_reason": "Test packet for research question gate.",
        "implementation_status": "fixture",
        "testability": "measurable_now",
        "phenomenon_summary": "A bounded synthetic longitudinal pattern is described without causal certainty.",
        "candidate_research_question": "Does an operational context label associate with reduced latency in synthetic logs?",
        "boundary_statement": "Research organization only; no personal, clinical, or care instruction is produced.",
        "falsification_route": "If blinded synthetic trials show no difference from null, the question is unsupported.",
        "measurable_variables": [
            {
                "name": "latency_seconds",
                "operational_definition": "Seconds between cue and first logged action.",
                "measurement_method": "Timestamp difference in structured logs.",
                "expected_direction": "decrease",
            }
        ],
        "excluded_advice": ["No intervention advice is generated."],
        "next_executable_action": "Generate a synthetic comparison dataset and score it against a null model.",
    }


def test_accepts_bounded_measurable_question():
    classification, reasons = classify_packet(base_packet())
    assert classification == "accept_research_question", reasons


def test_missingness_requires_revision():
    packet = base_packet()
    packet["missingness"] = ["No baseline window defined"]
    classification, reasons = classify_packet(packet)
    assert classification == "needs_revision", reasons


def test_rejects_private_detail():
    packet = base_packet()
    packet["privacy_status"] = "reject_private_detail"
    classification, reasons = classify_packet(packet)
    assert classification == "reject_boundary_violation", reasons


def test_rejects_advice_like_language():
    packet = base_packet()
    packet["candidate_research_question"] = "Should the system diagnose and treat this pattern?"
    classification, reasons = classify_packet(packet)
    assert classification == "reject_boundary_violation", reasons


def test_rejects_without_measurable_variables():
    packet = base_packet()
    packet["measurable_variables"] = []
    classification, reasons = classify_packet(packet)
    assert classification == "reject_boundary_violation", reasons


if __name__ == "__main__":
    test_accepts_bounded_measurable_question()
    test_missingness_requires_revision()
    test_rejects_private_detail()
    test_rejects_advice_like_language()
    test_rejects_without_measurable_variables()
    print("research question packet scorer tests passed")
