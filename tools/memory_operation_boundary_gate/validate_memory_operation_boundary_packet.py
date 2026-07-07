#!/usr/bin/env python3
"""Validate Memory Operation Boundary Gate packets.

This validator intentionally uses only the Python standard library so the gate can
run in minimal CI or local environments without dependency setup.
"""

from __future__ import annotations

import json
import sys
from pathlib import Path
from typing import Any

REQUIRED_TOP = [
    "packet_id",
    "created_at",
    "operation",
    "source_status",
    "claim_status",
    "privacy_status",
    "boundaries",
    "allowed_reuse_scope",
    "missingness",
    "revision_reason",
    "implementation_status",
    "evidence_strength",
    "falsification_route",
    "next_executable_action",
]

ENUMS = {
    "operation.type": {"write", "retrieve", "reuse", "export", "handoff", "delete", "revise"},
    "operation.target_memory": {"scratch", "project_memory", "discovery_graph", "handoff_packet", "public_artifact"},
    "operation.promotion_decision": {"block", "quarantine", "allow_scoped", "allow_public_synthetic_only"},
    "source_status": {"peer_reviewed", "research_institution", "preprint", "grant_or_prize", "dataset_or_benchmark", "open_source_tool", "news_or_policy", "synthetic_fixture"},
    "claim_status": {"hypothesis", "test", "schema", "evaluation_criterion", "source_map", "prototype_requirement", "collaborator_or_opportunity_target"},
    "privacy_status": {"public_safe", "synthetic_only", "restricted_sensitive", "blocked_from_reuse"},
    "implementation_status": {"proposed", "schema_committed", "validator_committed", "fixtures_committed", "tests_committed", "active_gate"},
    "evidence_strength": {"low", "moderate", "high", "unknown"},
}

REQUIRED_BOUNDARIES = [
    "source_boundary",
    "subject_boundary",
    "modality_boundary",
    "species_context_boundary",
    "temporal_boundary",
    "tool_boundary",
    "privacy_boundary",
]

REQUIRED_MISSINGNESS = [
    "dataset_gaps",
    "subject_gaps",
    "modality_gaps",
    "temporal_gaps",
    "privacy_gaps",
]

ALLOWED_REUSE_SCOPE = {
    "same_packet_only",
    "same_project",
    "synthetic_test_only",
    "public_research_summary",
    "schema_design",
    "benchmark_design",
    "collaborator_outreach",
}


def _fail(message: str) -> None:
    raise ValueError(message)


def _require_string(value: Any, path: str, min_len: int = 1) -> None:
    if not isinstance(value, str) or len(value.strip()) < min_len:
        _fail(f"{path} must be a string with length >= {min_len}")


def _check_enum(value: Any, path: str) -> None:
    if value not in ENUMS[path]:
        _fail(f"{path} has invalid value: {value!r}")


def validate(packet: dict[str, Any]) -> None:
    for key in REQUIRED_TOP:
        if key not in packet:
            _fail(f"missing required field: {key}")

    _require_string(packet["packet_id"], "packet_id", 8)
    _require_string(packet["created_at"], "created_at", 10)

    operation = packet["operation"]
    if not isinstance(operation, dict):
        _fail("operation must be an object")
    for key in ["type", "target_memory", "promotion_decision", "review_required"]:
        if key not in operation:
            _fail(f"operation missing required field: {key}")
    _check_enum(operation["type"], "operation.type")
    _check_enum(operation["target_memory"], "operation.target_memory")
    _check_enum(operation["promotion_decision"], "operation.promotion_decision")
    if not isinstance(operation["review_required"], bool):
        _fail("operation.review_required must be boolean")

    for key in ["source_status", "claim_status", "privacy_status", "implementation_status", "evidence_strength"]:
        _check_enum(packet[key], key)

    boundaries = packet["boundaries"]
    if not isinstance(boundaries, dict):
        _fail("boundaries must be an object")
    for key in REQUIRED_BOUNDARIES:
        if key not in boundaries:
            _fail(f"boundaries missing required field: {key}")
        _require_string(boundaries[key], f"boundaries.{key}", 12)

    scopes = packet["allowed_reuse_scope"]
    if not isinstance(scopes, list) or not scopes:
        _fail("allowed_reuse_scope must be a non-empty array")
    invalid_scopes = [scope for scope in scopes if scope not in ALLOWED_REUSE_SCOPE]
    if invalid_scopes:
        _fail(f"invalid allowed_reuse_scope values: {invalid_scopes}")

    missingness = packet["missingness"]
    if not isinstance(missingness, dict):
        _fail("missingness must be an object")
    for key in REQUIRED_MISSINGNESS:
        if key not in missingness:
            _fail(f"missingness missing required field: {key}")
        if not isinstance(missingness[key], list):
            _fail(f"missingness.{key} must be an array")
        if not all(isinstance(item, str) for item in missingness[key]):
            _fail(f"missingness.{key} must contain only strings")

    _require_string(packet["revision_reason"], "revision_reason", 20)
    _require_string(packet["falsification_route"], "falsification_route", 20)
    _require_string(packet["next_executable_action"], "next_executable_action", 10)

    if packet["privacy_status"] in {"restricted_sensitive", "blocked_from_reuse"}:
        if operation["promotion_decision"] not in {"block", "quarantine"}:
            _fail("restricted or blocked packets cannot be promoted")

    if operation["target_memory"] == "public_artifact":
        if packet["privacy_status"] not in {"public_safe", "synthetic_only"}:
            _fail("public_artifact target requires public_safe or synthetic_only privacy_status")


def main(argv: list[str]) -> int:
    if len(argv) != 2:
        print("usage: validate_memory_operation_boundary_packet.py <packet.json>", file=sys.stderr)
        return 2
    path = Path(argv[1])
    with path.open("r", encoding="utf-8") as handle:
        packet = json.load(handle)
    validate(packet)
    print(f"valid: {path}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv))
