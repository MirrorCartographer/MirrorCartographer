#!/usr/bin/env python3
"""Regression checks for the public-safe promotion gate."""

from validate_promotion_decision import evaluate_packet, evaluate_packets


def packet(**overrides):
    base = {
        "artifact_id": "artifact.synthetic.test",
        "artifact_type": "prediction",
        "source_status": "synthetic",
        "claim_status": "proposed_prediction",
        "privacy_status": "public",
        "missingness": "none_blocking",
        "implementation_status": "validator_passed",
        "testability": "falsifiable_or_evaluable",
        "falsification_route": "Fails under a declared synthetic counter-observation.",
        "next_executable_action": "Run the synthetic evaluation harness."
    }
    base.update(overrides)
    return base


def test_valid_packet_promotes():
    result = evaluate_packet(packet())
    assert result.decision == "PROMOTE"
    assert result.errors == []
    assert result.warnings == []


def test_private_packet_blocks():
    result = evaluate_packet(packet(privacy_status="private"))
    assert result.decision == "BLOCK"
    assert "privacy_status_not_public" in result.errors


def test_unsupported_claim_blocks():
    result = evaluate_packet(packet(claim_status="unsupported"))
    assert result.decision == "BLOCK"
    assert "blocked_claim_status" in result.errors


def test_missing_falsification_revises():
    result = evaluate_packet(packet(falsification_route=""))
    assert result.decision == "REVISE"
    assert "missing_falsification_route" in result.warnings


def test_report_counts_are_deterministic():
    packets = [
        packet(artifact_id="a"),
        packet(artifact_id="b", privacy_status="private"),
        packet(artifact_id="c", falsification_route=""),
    ]
    first = evaluate_packets(packets)
    second = evaluate_packets(packets)
    assert first == second
    assert first["summary"] == {"total": 3, "promote": 1, "revise": 1, "block": 1}


if __name__ == "__main__":
    test_valid_packet_promotes()
    test_private_packet_blocks()
    test_unsupported_claim_blocks()
    test_missing_falsification_revises()
    test_report_counts_are_deterministic()
    print("promotion gate tests passed")
