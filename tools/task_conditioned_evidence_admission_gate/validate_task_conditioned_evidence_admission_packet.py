#!/usr/bin/env python3
"""Validate Task Conditioned Evidence Admission packets.

This validator intentionally uses only the Python standard library so the gate can
run in constrained research/review environments without dependency setup.
"""

from __future__ import annotations

import json
import sys
from datetime import datetime
from pathlib import Path

REQUIRED_FIELDS = [
    "packet_id",
    "created_utc",
    "current_task_intent",
    "candidate_memory_or_evidence",
    "source_status",
    "claim_status",
    "task_fit_status",
    "task_fit_rationale",
    "privacy_status",
    "privacy_transformation",
    "provenance_status",
    "transfer_boundaries",
    "missingness",
    "synthetic_real_mismatch",
    "blocked_inferences",
    "revision_reason",
    "implementation_status",
    "evidence_strength",
    "falsification_route",
    "next_executable_action",
]

SOURCE_STATUS = {
    "primary_source",
    "clinical_research_institution",
    "preprint",
    "benchmark",
    "open_source_tool",
    "dataset",
    "grant_or_prize",
    "synthetic_fixture",
    "mixed_public_sources",
}
CLAIM_STATUS = {
    "hypothesis",
    "schema_requirement",
    "evaluation_criterion",
    "prototype_requirement",
    "collaborator_target",
    "source_map",
    "blocked_claim",
}
TASK_FIT_STATUS = {
    "direct_task_fit",
    "bounded_task_fit",
    "weak_task_fit",
    "semantic_similarity_only",
    "task_fit_rejected",
}
PRIVACY_STATUS = {
    "public_only",
    "deidentified",
    "placeholder_transformed",
    "synthetic_only",
    "restricted_sensitive",
    "undeclared",
}
PROVENANCE_STATUS = {
    "full_provenance",
    "partial_provenance",
    "synthetic_provenance",
    "derived_summary",
    "unknown",
}
IMPLEMENTATION_STATUS = {
    "proposed",
    "schema_only",
    "validator_added",
    "fixtures_added",
    "tests_added",
    "implemented",
}
EVIDENCE_STRENGTH = {"low", "moderate", "high", "mixed", "insufficient"}


def _non_empty_string(value: object, min_len: int = 1) -> bool:
    return isinstance(value, str) and len(value.strip()) >= min_len


def _non_empty_string_list(value: object, min_len: int = 1) -> bool:
    return isinstance(value, list) and bool(value) and all(_non_empty_string(item, min_len) for item in value)


def validate(packet: dict) -> list[str]:
    errors: list[str] = []

    for field in REQUIRED_FIELDS:
        if field not in packet:
            errors.append(f"missing required field: {field}")

    if errors:
        return errors

    try:
        datetime.fromisoformat(packet["created_utc"].replace("Z", "+00:00"))
    except Exception:
        errors.append("created_utc must be ISO-8601 datetime")

    if not _non_empty_string(packet["packet_id"], 8):
        errors.append("packet_id must be at least 8 characters")

    for field in [
        "current_task_intent",
        "candidate_memory_or_evidence",
        "task_fit_rationale",
        "privacy_transformation",
        "synthetic_real_mismatch",
        "revision_reason",
        "falsification_route",
        "next_executable_action",
    ]:
        if not _non_empty_string(packet[field], 8):
            errors.append(f"{field} must be a non-empty string")

    enum_checks = {
        "source_status": SOURCE_STATUS,
        "claim_status": CLAIM_STATUS,
        "task_fit_status": TASK_FIT_STATUS,
        "privacy_status": PRIVACY_STATUS,
        "provenance_status": PROVENANCE_STATUS,
        "implementation_status": IMPLEMENTATION_STATUS,
        "evidence_strength": EVIDENCE_STRENGTH,
    }
    for field, allowed in enum_checks.items():
        if packet[field] not in allowed:
            errors.append(f"{field} must be one of: {sorted(allowed)}")

    for field in ["transfer_boundaries", "missingness", "blocked_inferences"]:
        if not _non_empty_string_list(packet[field], 4):
            errors.append(f"{field} must be a non-empty list of strings")

    if packet["task_fit_status"] == "semantic_similarity_only":
        errors.append("semantic similarity alone cannot admit evidence")
    if packet["privacy_status"] == "undeclared":
        errors.append("privacy status must be declared")
    if packet["provenance_status"] == "unknown":
        errors.append("unknown provenance cannot admit evidence")
    if packet["source_status"] == "synthetic_fixture" and packet["claim_status"] not in {"schema_requirement", "evaluation_criterion", "blocked_claim"}:
        errors.append("synthetic fixtures cannot directly support discovery or collaborator claims")
    if "execute" not in packet["next_executable_action"].lower() and "run" not in packet["next_executable_action"].lower() and "compare" not in packet["next_executable_action"].lower():
        errors.append("next_executable_action must contain an executable verb such as run, compare, or execute")
    if "falsif" not in packet["falsification_route"].lower() and "fail" not in packet["falsification_route"].lower() and "compare" not in packet["falsification_route"].lower():
        errors.append("falsification_route must describe how the claim can fail or be compared")

    return errors


def main(argv: list[str]) -> int:
    if len(argv) != 2:
        print("usage: validate_task_conditioned_evidence_admission_packet.py <packet.json>", file=sys.stderr)
        return 2

    path = Path(argv[1])
    packet = json.loads(path.read_text(encoding="utf-8"))
    errors = validate(packet)
    if errors:
        print("INVALID")
        for error in errors:
            print(f"- {error}")
        return 1

    print("VALID")
    return 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv))
