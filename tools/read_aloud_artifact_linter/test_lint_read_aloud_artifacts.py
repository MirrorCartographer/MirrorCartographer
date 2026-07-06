#!/usr/bin/env python3
"""Regression tests for read-aloud artifact linter."""

from __future__ import annotations

import json
import tempfile
from pathlib import Path

from lint_read_aloud_artifacts import lint_packet, run


def test_fixture_routes_are_stable() -> None:
    fixture_path = Path(__file__).with_name("fixtures.synthetic.json")
    result = run(str(fixture_path))
    assert result["summary"] == {"accepted": 1, "needs_revision": 1, "blocked": 1}
    assert result["accepted"][0]["artifact_id"] == "ra-ok-001"
    assert result["needs_revision"][0]["artifact_id"] == "ra-revise-001"
    assert result["blocked"][0]["artifact_id"] == "ra-block-001"


def test_critical_terms_inside_code_fence_do_not_count() -> None:
    packet = {
        "artifact_id": "ra-term-fence",
        "artifact_type": "readme",
        "source_status": "assistant_generated",
        "claim_status": "engineering_contract",
        "privacy_status": "public_safe",
        "content": "Purpose: accessible summary.\n\nSource status: ok.\nClaim status: ok.\nPrivacy status: ok.\nMissingness: none.\nRevision reason: test.\nImplementation status: test.\nTestability: test.\nNext executable action: test.\n```\nevidence boundary\n```",
        "critical_terms": ["evidence boundary"],
        "revision_reason": "test fenced critical term",
        "next_action": "add term to normal prose",
    }
    decision = lint_packet(packet)
    assert decision.route == "needs_revision"
    assert any("critical term" in reason for reason in decision.reasons)


def test_private_residue_blocks_even_when_accessible() -> None:
    packet = {
        "artifact_id": "ra-private",
        "artifact_type": "handoff_note",
        "source_status": "assistant_generated",
        "claim_status": "engineering_contract",
        "privacy_status": "contains_private_residue",
        "content": "Purpose: otherwise accessible artifact.\n\nSource status: ok.\nClaim status: ok.\nPrivacy status: contains private residue.\nMissingness: none.\nRevision reason: test.\nImplementation status: test.\nTestability: test.\nNext executable action: redact.\nCritical terms: privacy partition.",
        "critical_terms": ["privacy partition"],
        "revision_reason": "test privacy block",
        "next_action": "redact",
    }
    decision = lint_packet(packet)
    assert decision.route == "blocked"
    assert any("privacy" in reason for reason in decision.reasons)


def test_missing_required_field_blocks() -> None:
    decision = lint_packet({"artifact_id": "bad"})
    assert decision.route == "blocked"
    assert any("missing required fields" in reason for reason in decision.reasons)


def test_run_accepts_top_level_list() -> None:
    packet = {
        "artifact_id": "ra-list-ok",
        "artifact_type": "ui_contract",
        "source_status": "synthetic_fixture",
        "claim_status": "engineering_contract",
        "privacy_status": "public_safe",
        "content": "Purpose: ensure list payloads work.\n\nSource status: synthetic fixture.\nClaim status: engineering contract.\nPrivacy status: public safe.\nMissingness: none.\nRevision reason: test list input.\nImplementation status: test packet.\nTestability: direct test.\nNext executable action: keep accepted.\nCritical terms: collaboration readiness.",
        "critical_terms": ["collaboration readiness"],
        "revision_reason": "test list input",
        "next_action": "keep accepted",
    }
    with tempfile.NamedTemporaryFile("w", suffix=".json", delete=False, encoding="utf-8") as handle:
        json.dump([packet], handle)
        path = handle.name
    result = run(path)
    assert result["summary"]["accepted"] == 1


if __name__ == "__main__":
    test_fixture_routes_are_stable()
    test_critical_terms_inside_code_fence_do_not_count()
    test_private_residue_blocks_even_when_accessible()
    test_missing_required_field_blocks()
    test_run_accepts_top_level_list()
    print("read_aloud_artifact_linter tests passed")
