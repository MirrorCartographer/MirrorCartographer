#!/usr/bin/env python3
"""Validate Prospective Evidence Update packets without external dependencies."""

from __future__ import annotations

import json
import sys
from pathlib import Path
from typing import Any

REQUIRED_TOP_LEVEL = {
    "packet_id",
    "claim",
    "source_status",
    "claim_status",
    "privacy_status",
    "evidence_window",
    "update_trigger",
    "post_window_validation_signal",
    "stale_claim_behavior",
    "missingness",
    "revision_reason",
    "implementation_status",
    "evidence_strength",
    "falsification_route",
    "next_executable_action",
}

CLAIM_STATUS = {
    "hypothesis",
    "evaluation_criterion",
    "prototype_requirement",
    "source_map",
    "collaborator_target",
    "opportunity_target",
}

SOURCE_STATUS = {
    "peer_reviewed",
    "preprint",
    "institutional",
    "benchmark",
    "dataset",
    "open_source",
    "grant_or_prize",
    "vendor_research",
    "synthetic_fixture",
}

DATA_CLASS = {
    "public_only",
    "synthetic_only",
    "deidentified_research",
    "personal_health",
    "veterinary_record",
    "mixed_sensitive",
}

TRIGGER_TYPE = {
    "new_peer_reviewed_source",
    "new_preprint_revision",
    "benchmark_release",
    "dataset_release",
    "failed_reproduction",
    "privacy_policy_change",
    "clinical_guideline_change",
    "veterinary_standard_change",
}

STALE_BEHAVIOR = {
    "retain_with_warning",
    "downgrade_to_hypothesis",
    "block_promotion",
    "retire_claim",
    "requires_human_review",
}

IMPLEMENTATION_STATUS = {
    "schema_only",
    "validator_added",
    "tests_added",
    "prototype_requirement",
    "implemented_and_testable",
}

EVIDENCE_STRENGTH = {"low", "moderate", "high", "mixed", "insufficient"}
REVIEW_FREQUENCY = {"per_run", "daily", "weekly", "monthly", "on_trigger_only"}


def require(condition: bool, message: str, errors: list[str]) -> None:
    if not condition:
        errors.append(message)


def require_text(value: Any, name: str, errors: list[str], min_len: int = 1) -> None:
    require(isinstance(value, str) and len(value.strip()) >= min_len, f"{name} must be text length >= {min_len}", errors)


def validate_packet(packet: dict[str, Any]) -> list[str]:
    errors: list[str] = []
    missing = sorted(REQUIRED_TOP_LEVEL - set(packet))
    extra = sorted(set(packet) - REQUIRED_TOP_LEVEL)
    require(not missing, f"missing required fields: {missing}", errors)
    require(not extra, f"unexpected fields: {extra}", errors)

    require_text(packet.get("packet_id"), "packet_id", errors, 8)
    require_text(packet.get("claim"), "claim", errors, 20)
    require(packet.get("claim_status") in CLAIM_STATUS, "claim_status is invalid", errors)
    require(packet.get("stale_claim_behavior") in STALE_BEHAVIOR, "stale_claim_behavior is invalid", errors)
    require(packet.get("implementation_status") in IMPLEMENTATION_STATUS, "implementation_status is invalid", errors)
    require(packet.get("evidence_strength") in EVIDENCE_STRENGTH, "evidence_strength is invalid", errors)
    require_text(packet.get("post_window_validation_signal"), "post_window_validation_signal", errors, 20)
    require_text(packet.get("revision_reason"), "revision_reason", errors, 10)
    require_text(packet.get("falsification_route"), "falsification_route", errors, 20)
    require_text(packet.get("next_executable_action"), "next_executable_action", errors, 10)

    sources = packet.get("source_status")
    require(isinstance(sources, list) and len(sources) >= 1, "source_status must be a non-empty list", errors)
    if isinstance(sources, list):
        for idx, source in enumerate(sources):
            require(isinstance(source, dict), f"source_status[{idx}] must be object", errors)
            if isinstance(source, dict):
                require(source.get("status") in SOURCE_STATUS, f"source_status[{idx}].status is invalid", errors)
                require_text(source.get("source"), f"source_status[{idx}].source", errors, 3)
                require_text(source.get("caveat"), f"source_status[{idx}].caveat", errors, 5)
                require_text(source.get("url_or_identifier"), f"source_status[{idx}].url_or_identifier", errors, 5)

    privacy = packet.get("privacy_status")
    require(isinstance(privacy, dict), "privacy_status must be object", errors)
    if isinstance(privacy, dict):
        require(privacy.get("data_class") in DATA_CLASS, "privacy_status.data_class is invalid", errors)
        require_text(privacy.get("allowed_reuse_scope"), "privacy_status.allowed_reuse_scope", errors, 10)
        require(isinstance(privacy.get("redaction_required"), bool), "privacy_status.redaction_required must be boolean", errors)
        require_text(privacy.get("consent_boundary"), "privacy_status.consent_boundary", errors, 10)

    evidence_window = packet.get("evidence_window")
    require(isinstance(evidence_window, dict), "evidence_window must be object", errors)
    if isinstance(evidence_window, dict):
        require_text(evidence_window.get("opened_on"), "evidence_window.opened_on", errors, 10)
        require_text(evidence_window.get("closed_on"), "evidence_window.closed_on", errors, 10)
        require_text(evidence_window.get("rationale"), "evidence_window.rationale", errors, 10)
        if isinstance(evidence_window.get("opened_on"), str) and isinstance(evidence_window.get("closed_on"), str):
            require(evidence_window["opened_on"] <= evidence_window["closed_on"], "evidence window dates are reversed", errors)

    update_trigger = packet.get("update_trigger")
    require(isinstance(update_trigger, dict), "update_trigger must be object", errors)
    if isinstance(update_trigger, dict):
        require(update_trigger.get("trigger_type") in TRIGGER_TYPE, "update_trigger.trigger_type is invalid", errors)
        require_text(update_trigger.get("minimum_signal"), "update_trigger.minimum_signal", errors, 10)
        require(update_trigger.get("review_frequency") in REVIEW_FREQUENCY, "update_trigger.review_frequency is invalid", errors)

    missingness = packet.get("missingness")
    require(isinstance(missingness, list) and len(missingness) >= 1, "missingness must be non-empty list", errors)
    if isinstance(missingness, list):
        for idx, item in enumerate(missingness):
            require_text(item, f"missingness[{idx}]", errors, 5)

    # Domain-specific safety assertions.
    sensitive_classes = {"personal_health", "veterinary_record", "mixed_sensitive"}
    if isinstance(privacy, dict) and privacy.get("data_class") in sensitive_classes:
        require(privacy.get("redaction_required") is True, "sensitive data classes require redaction", errors)
        require(packet.get("stale_claim_behavior") in {"block_promotion", "requires_human_review", "retire_claim"}, "sensitive updateable claims require conservative stale behavior", errors)

    return errors


def main() -> int:
    if len(sys.argv) != 2:
        print("usage: validate_prospective_evidence_update_packet.py <packet.json>", file=sys.stderr)
        return 2
    path = Path(sys.argv[1])
    packet = json.loads(path.read_text())
    errors = validate_packet(packet)
    if errors:
        for error in errors:
            print(f"ERROR: {error}", file=sys.stderr)
        return 1
    print(f"valid: {path}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
