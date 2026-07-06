#!/usr/bin/env python3
"""Regression test runner for the MC Agent Boundary Gate."""

from __future__ import annotations

import importlib.util
from pathlib import Path

HERE = Path(__file__).resolve().parent
VALIDATOR_PATH = HERE / "validate_agent_boundary_packets.py"
FIXTURE_PATH = HERE / "fixtures.synthetic.json"

spec = importlib.util.spec_from_file_location("validate_agent_boundary_packets", VALIDATOR_PATH)
validator = importlib.util.module_from_spec(spec)
assert spec and spec.loader
spec.loader.exec_module(validator)


def test_fixture_file_matches_expected_outcomes() -> None:
    assert validator.run_fixture_file(FIXTURE_PATH) == 0


def test_assistant_inference_cannot_be_user_quote() -> None:
    packet = {
        "schema_version": "1.0.0",
        "packet_id": "abg-unit-fail",
        "hypothesis_id": "hyp-agent-boundary-preservation",
        "claim": "Assistant-generated inferences must not be stored as if the user said them.",
        "source_status": "synthetic",
        "claim_status": "testable_infrastructure_claim",
        "privacy_status": "public_safe",
        "missingness": {"state": "none", "known_gaps": []},
        "revision_reason": "Unit test for role boundary violation.",
        "implementation_status": "implemented",
        "testability": "high",
        "falsification_route": "Validator fails if this packet is accepted as valid.",
        "measurable_variables": [
            {"name": "role_violation_count", "measurement": "count", "failure_threshold": "> 0"},
            {"name": "attribution_collapse_count", "measurement": "count", "failure_threshold": "> 0"}
        ],
        "next_executable_action": "Reject the packet.",
        "boundary_segments": [
            {
                "segment_id": "seg-1",
                "agent_role": "assistant_inferred",
                "content": "A generated inference.",
                "allowed_downstream_use": ["quote_as_user_statement"],
                "prohibited_downstream_use": ["use_as_diagnosis"]
            }
        ]
    }
    valid, errors = validator.validate_packet(packet)
    assert not valid
    assert any("assistant inference" in error for error in errors)


def test_public_safe_user_statement_can_pass() -> None:
    packet = {
        "schema_version": "1.0.0",
        "packet_id": "abg-unit-pass",
        "hypothesis_id": "hyp-agent-boundary-preservation",
        "claim": "Public-safe user-stated content can be quoted as a user statement when the packet preserves boundaries.",
        "source_status": "synthetic",
        "claim_status": "testable_infrastructure_claim",
        "privacy_status": "public_safe",
        "missingness": {"state": "none", "known_gaps": []},
        "revision_reason": "Unit test for acceptable role boundary handling.",
        "implementation_status": "implemented",
        "testability": "high",
        "falsification_route": "Validator fails if this well-bounded packet is rejected.",
        "measurable_variables": [
            {"name": "role_violation_count", "measurement": "count", "failure_threshold": "== 0"},
            {"name": "privacy_leak_count", "measurement": "count", "failure_threshold": "== 0"}
        ],
        "next_executable_action": "Accept the packet.",
        "boundary_segments": [
            {
                "segment_id": "seg-1",
                "agent_role": "user_stated",
                "content": "A public-safe statement.",
                "allowed_downstream_use": ["quote_as_user_statement"],
                "prohibited_downstream_use": ["use_as_diagnosis", "store_as_private_memory"]
            }
        ]
    }
    valid, errors = validator.validate_packet(packet)
    assert valid, errors


if __name__ == "__main__":
    test_fixture_file_matches_expected_outcomes()
    test_assistant_inference_cannot_be_user_quote()
    test_public_safe_user_statement_can_pass()
    print("Agent Boundary Gate regression tests: PASS")
