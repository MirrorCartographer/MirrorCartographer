#!/usr/bin/env python3
"""Validate Revocation Integrity Gate packets without external dependencies."""

from __future__ import annotations

import json
import sys
from pathlib import Path

REQUIRED_TOP_LEVEL = [
    "packet_id",
    "claim",
    "source_status",
    "claim_status",
    "privacy_status",
    "memory_operation",
    "revocation_route",
    "redaction_route",
    "downgrade_route",
    "downstream_dependencies",
    "missingness",
    "revision_reason",
    "implementation_status",
    "evidence_strength",
    "falsification_route",
    "next_executable_action",
]

SOURCE_STATUS = {
    "primary",
    "clinical_research_institution",
    "preprint_caveated",
    "dataset_or_benchmark",
    "open_source_tool",
    "grant_or_prize",
    "mixed_public_scan",
    "synthetic_fixture",
}
CLAIM_STATUS = {
    "hypothesis",
    "schema",
    "test",
    "evaluation_criterion",
    "prototype_requirement",
    "collaborator_target",
    "source_map",
}
PRIVACY_STATUS = {
    "public_safe",
    "synthetic_only",
    "deidentified_required",
    "sensitive_blocked",
    "consent_required",
    "unknown_privacy_risk",
}
MEMORY_OPERATION = {"write", "promote", "revise", "redact", "revoke", "downgrade", "export", "block"}
DOWNGRADE_TO = {"discard", "private_note", "weak_signal", "hypothesis_only", "needs_revalidation", "blocked"}
IMPLEMENTATION_STATUS = {"planned", "implemented", "validated", "blocked", "needs_revision"}
EVIDENCE_STRENGTH = {"low", "moderate", "high"}
DEPENDENCY_TYPE = {
    "citation",
    "schema_field",
    "test_fixture",
    "hypothesis",
    "prototype_requirement",
    "personalization_rule",
    "source_map",
}


def _nonempty_string(value: object, min_len: int = 1) -> bool:
    return isinstance(value, str) and len(value.strip()) >= min_len


def _nonempty_string_list(value: object, min_len: int = 1) -> bool:
    return isinstance(value, list) and len(value) >= min_len and all(_nonempty_string(item) for item in value)


def validate(packet: dict) -> list[str]:
    errors: list[str] = []

    for field in REQUIRED_TOP_LEVEL:
        if field not in packet:
            errors.append(f"missing top-level field: {field}")

    if errors:
        return errors

    if not _nonempty_string(packet["packet_id"], 8):
        errors.append("packet_id must be a string with at least 8 characters")
    if not _nonempty_string(packet["claim"], 20):
        errors.append("claim must be a string with at least 20 characters")
    if packet["source_status"] not in SOURCE_STATUS:
        errors.append("source_status is not allowed")
    if packet["claim_status"] not in CLAIM_STATUS:
        errors.append("claim_status is not allowed")
    if packet["privacy_status"] not in PRIVACY_STATUS:
        errors.append("privacy_status is not allowed")
    if packet["memory_operation"] not in MEMORY_OPERATION:
        errors.append("memory_operation is not allowed")

    revocation = packet["revocation_route"]
    if not isinstance(revocation, dict):
        errors.append("revocation_route must be an object")
    else:
        if revocation.get("can_revoke") is not True:
            errors.append("revocation_route.can_revoke must be true for promotable memory")
        if not _nonempty_string(revocation.get("revocation_target"), 5):
            errors.append("revocation_route.revocation_target must be specific")
        if not _nonempty_string(revocation.get("required_actor"), 3):
            errors.append("revocation_route.required_actor must be specific")
        if not _nonempty_string(revocation.get("verification_signal"), 10):
            errors.append("revocation_route.verification_signal must be measurable")

    redaction = packet["redaction_route"]
    if not isinstance(redaction, dict):
        errors.append("redaction_route must be an object")
    else:
        if not _nonempty_string_list(redaction.get("redactable_fields"), 1):
            errors.append("redaction_route.redactable_fields must include at least one field")
        if not isinstance(redaction.get("non_redactable_fields"), list):
            errors.append("redaction_route.non_redactable_fields must be a list")
        if not _nonempty_string(redaction.get("semantic_loss_note"), 10):
            errors.append("redaction_route.semantic_loss_note must describe semantic loss")

    downgrade = packet["downgrade_route"]
    if not isinstance(downgrade, dict):
        errors.append("downgrade_route must be an object")
    else:
        if downgrade.get("downgrade_to") not in DOWNGRADE_TO:
            errors.append("downgrade_route.downgrade_to is not allowed")
        if not _nonempty_string_list(downgrade.get("blocked_after_downgrade"), 1):
            errors.append("downgrade_route.blocked_after_downgrade must block at least one inference")
        if not _nonempty_string(downgrade.get("revalidation_trigger"), 10):
            errors.append("downgrade_route.revalidation_trigger must be actionable")

    dependencies = packet["downstream_dependencies"]
    if not isinstance(dependencies, list) or not dependencies:
        errors.append("downstream_dependencies must include at least one dependency")
    else:
        for idx, dependency in enumerate(dependencies):
            if not isinstance(dependency, dict):
                errors.append(f"downstream_dependencies[{idx}] must be an object")
                continue
            if not _nonempty_string(dependency.get("dependent_id"), 3):
                errors.append(f"downstream_dependencies[{idx}].dependent_id must be specific")
            if dependency.get("dependency_type") not in DEPENDENCY_TYPE:
                errors.append(f"downstream_dependencies[{idx}].dependency_type is not allowed")
            if not _nonempty_string(dependency.get("impact_if_removed"), 10):
                errors.append(f"downstream_dependencies[{idx}].impact_if_removed must describe impact")

    if not _nonempty_string_list(packet["missingness"], 1):
        errors.append("missingness must list at least one known gap")
    if not _nonempty_string(packet["revision_reason"], 10):
        errors.append("revision_reason must be meaningful")
    if packet["implementation_status"] not in IMPLEMENTATION_STATUS:
        errors.append("implementation_status is not allowed")
    if packet["evidence_strength"] not in EVIDENCE_STRENGTH:
        errors.append("evidence_strength is not allowed")
    if not _nonempty_string(packet["falsification_route"], 20):
        errors.append("falsification_route must be testable")
    if not _nonempty_string(packet["next_executable_action"], 10):
        errors.append("next_executable_action must be actionable")

    return errors


def main() -> int:
    if len(sys.argv) != 2:
        print("usage: validate_revocation_integrity_packet.py <packet.json>", file=sys.stderr)
        return 2

    packet_path = Path(sys.argv[1])
    packet = json.loads(packet_path.read_text(encoding="utf-8"))
    errors = validate(packet)
    if errors:
        print("INVALID")
        for error in errors:
            print(f"- {error}")
        return 1

    print("VALID")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
