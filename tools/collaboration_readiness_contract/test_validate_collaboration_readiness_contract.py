#!/usr/bin/env python3
"""Regression tests for collaboration-readiness validator."""

from __future__ import annotations

import importlib.util
from pathlib import Path

MODULE_PATH = Path(__file__).with_name("validate_collaboration_readiness_contract.py")
spec = importlib.util.spec_from_file_location("crc_validator", MODULE_PATH)
module = importlib.util.module_from_spec(spec)
assert spec and spec.loader
spec.loader.exec_module(module)


def test_ready_packet_passes() -> None:
    packet = {
        "packet_id": "crc-test-ready",
        "title": "Synthetic collaboration handoff",
        "domain": "collaboration_ops",
        "source_status": "synthetic fixture only",
        "claim_status": "engineering organization only; no advice or guaranteed discovery",
        "privacy_status": "public-safe synthetic packet",
        "missingness": "no raw records, no private dates, no direct identifiers",
        "revision_reason": "test valid handoff contract",
        "implementation_status": "ready for validator test",
        "testability": "run validator and inspect JSON result",
        "next_executable_action": "route packet to public-safe collaborator export",
        "allowed_collaborator_roles": ["software developer"],
        "disallowed_uses": ["infer identity", "make clinical advice"],
        "evidence_boundary": "observation is source material; inference is labeled; hypothesis requires testing; advice is out of scope",
        "deidentification_status": "synthetic",
    }
    ready, reasons = module.validate_packet(packet)
    assert ready, reasons


def test_forbidden_claim_fails() -> None:
    packet = {
        "packet_id": "crc-test-bad-claim",
        "title": "Bad claim",
        "domain": "medical_research",
        "source_status": "synthetic fixture only",
        "claim_status": "confirmed cure pathway",
        "privacy_status": "public-safe synthetic packet",
        "missingness": "no raw records, no private dates, no direct identifiers",
        "revision_reason": "test bad claim rejection",
        "implementation_status": "not ready",
        "testability": "run validator",
        "next_executable_action": "route packet to falsification runner",
        "allowed_collaborator_roles": ["research reviewer"],
        "disallowed_uses": ["diagnose", "treat"],
        "evidence_boundary": "observation is source material; inference is labeled; hypothesis requires testing; advice is out of scope",
        "deidentification_status": "synthetic",
    }
    ready, reasons = module.validate_packet(packet)
    assert not ready
    assert any("claim_status" in reason for reason in reasons)


def test_identifier_pattern_fails() -> None:
    packet = {
        "packet_id": "crc-test-identifier",
        "title": "Email leak example test@example.com",
        "domain": "privacy_memory",
        "source_status": "synthetic fixture only",
        "claim_status": "engineering organization only; no advice",
        "privacy_status": "public-safe synthetic packet",
        "missingness": "no raw records, no private dates, no direct identifiers",
        "revision_reason": "test identifier rejection",
        "implementation_status": "not ready",
        "testability": "run validator",
        "next_executable_action": "check packet for direct identifiers",
        "allowed_collaborator_roles": ["software developer"],
        "disallowed_uses": ["infer identity"],
        "evidence_boundary": "observation is source material; inference is labeled; hypothesis requires testing; advice is out of scope",
        "deidentification_status": "synthetic",
    }
    ready, reasons = module.validate_packet(packet)
    assert not ready
    assert any("identifier" in reason for reason in reasons)


def test_batch_summary_counts_ready_and_blocked() -> None:
    ready_packet = {
        "packet_id": "crc-ready",
        "title": "Ready packet",
        "domain": "ai_systems",
        "source_status": "synthetic fixture only",
        "claim_status": "engineering organization only; no advice",
        "privacy_status": "public-safe synthetic packet",
        "missingness": "no raw records, no direct identifiers",
        "revision_reason": "test batch ready count",
        "implementation_status": "ready",
        "testability": "validate packet with regression test",
        "next_executable_action": "export packet to reviewer queue",
        "allowed_collaborator_roles": ["software developer"],
        "disallowed_uses": ["infer identity"],
        "evidence_boundary": "observation is source material; inference is labeled; hypothesis requires testing; advice is out of scope",
        "deidentification_status": "synthetic",
    }
    bad_packet = dict(ready_packet)
    bad_packet["packet_id"] = "crc-blocked"
    bad_packet["disallowed_uses"] = []

    result = module.validate_packets([ready_packet, bad_packet])
    assert result["ready_count"] == 1
    assert result["blocked_count"] == 1
    assert result["ready"] == ["crc-ready"]
    assert "crc-blocked" in result["blocked"]


if __name__ == "__main__":
    test_ready_packet_passes()
    test_forbidden_claim_fails()
    test_identifier_pattern_fails()
    test_batch_summary_counts_ready_and_blocked()
    print("all collaboration readiness contract tests passed")
