#!/usr/bin/env python3
"""Validate Research Workflow Evidence Gate packets.

This validator intentionally uses only the Python standard library so the gate can
run in constrained research and automation environments without dependency setup.
It performs the critical schema checks needed for CI fixtures; projects may later
swap in a full JSON Schema validator if desired.
"""

from __future__ import annotations

import json
import sys
from datetime import datetime
from pathlib import Path
from typing import Any

REQUIRED_TOP_LEVEL = [
    "packet_id",
    "created_utc",
    "source_status",
    "claim_status",
    "privacy_status",
    "missingness",
    "revision_reason",
    "implementation_status",
    "evidence_strength",
    "falsification_route",
    "next_executable_action",
    "workflow_stage_coverage",
    "translation_boundary",
    "validation_route",
    "blocked_inferences",
    "provenance_route",
]

CLAIM_STATUS = {
    "hypothesis",
    "test",
    "schema",
    "evaluation_criterion",
    "source_map",
    "prototype_requirement",
    "collaborator_or_opportunity_target",
}

IMPLEMENTATION_STATUS = {
    "proposed",
    "schema_only",
    "implemented_with_tests",
    "validated",
    "deprecated",
}

EVIDENCE_STRENGTH = {"weak", "moderate", "strong", "mixed"}
SOURCE_CLASSIFICATION = {
    "primary",
    "clinical_or_research_institution",
    "preprint",
    "benchmark",
    "open_source_tool",
    "mixed",
}
PRIVACY_CLASSIFICATION = {
    "public_safe_synthetic",
    "deidentified_research",
    "contains_sensitive_data",
    "unknown",
}
WORKFLOW_VALUES = {"covered", "partial", "missing", "not_applicable"}
WORKFLOW_KEYS = [
    "evidence_handling",
    "analysis",
    "design_or_optimization",
    "scientific_reasoning",
    "validation_or_operations",
    "translation",
    "scientific_communication",
]


def _fail(message: str) -> None:
    raise ValueError(message)


def _require_string(obj: dict[str, Any], key: str, min_len: int = 1) -> str:
    value = obj.get(key)
    if not isinstance(value, str) or len(value.strip()) < min_len:
        _fail(f"{key} must be a string with length >= {min_len}")
    return value


def _require_nonempty_string_list(obj: dict[str, Any], key: str) -> list[str]:
    value = obj.get(key)
    if not isinstance(value, list) or not value:
        _fail(f"{key} must be a non-empty list")
    for item in value:
        if not isinstance(item, str) or len(item.strip()) < 3:
            _fail(f"{key} entries must be strings with length >= 3")
    return value


def validate_packet(packet: dict[str, Any]) -> None:
    extra_keys = sorted(set(packet) - set(REQUIRED_TOP_LEVEL))
    if extra_keys:
        _fail(f"unexpected top-level keys: {extra_keys}")

    for key in REQUIRED_TOP_LEVEL:
        if key not in packet:
            _fail(f"missing required key: {key}")

    _require_string(packet, "packet_id", 8)
    try:
        datetime.fromisoformat(packet["created_utc"].replace("Z", "+00:00"))
    except Exception as exc:  # noqa: BLE001
        _fail(f"created_utc must be ISO datetime: {exc}")

    if packet["claim_status"] not in CLAIM_STATUS:
        _fail("claim_status is not allowed")
    if packet["implementation_status"] not in IMPLEMENTATION_STATUS:
        _fail("implementation_status is not allowed")
    if packet["evidence_strength"] not in EVIDENCE_STRENGTH:
        _fail("evidence_strength is not allowed")

    _require_string(packet, "revision_reason", 10)
    _require_string(packet, "falsification_route", 20)
    _require_string(packet, "next_executable_action", 10)
    _require_nonempty_string_list(packet, "missingness")
    _require_nonempty_string_list(packet, "validation_route")
    _require_nonempty_string_list(packet, "blocked_inferences")
    _require_nonempty_string_list(packet, "provenance_route")

    source_status = packet["source_status"]
    if not isinstance(source_status, dict):
        _fail("source_status must be an object")
    if source_status.get("classification") not in SOURCE_CLASSIFICATION:
        _fail("source_status.classification is not allowed")
    sources = source_status.get("sources")
    if not isinstance(sources, list) or not sources:
        _fail("source_status.sources must be non-empty")
    for source in sources:
        if not isinstance(source, dict):
            _fail("each source must be an object")
        for key in ["title", "url", "date", "status", "caveat"]:
            _require_string(source, key, 3)
        if not source["url"].startswith(("https://", "http://")):
            _fail("source.url must be HTTP(S)")

    privacy = packet["privacy_status"]
    if not isinstance(privacy, dict):
        _fail("privacy_status must be an object")
    if privacy.get("classification") not in PRIVACY_CLASSIFICATION:
        _fail("privacy_status.classification is not allowed")
    if not isinstance(privacy.get("personal_data"), bool):
        _fail("privacy_status.personal_data must be boolean")
    _require_string(privacy, "allowed_reuse_scope", 3)
    _require_string(privacy, "privacy_risk", 3)

    coverage = packet["workflow_stage_coverage"]
    if not isinstance(coverage, dict):
        _fail("workflow_stage_coverage must be an object")
    if sorted(coverage) != sorted(WORKFLOW_KEYS):
        _fail("workflow_stage_coverage must include exactly the required workflow keys")
    for key in WORKFLOW_KEYS:
        if coverage[key] not in WORKFLOW_VALUES:
            _fail(f"workflow_stage_coverage.{key} has invalid value")

    boundary = packet["translation_boundary"]
    if not isinstance(boundary, dict):
        _fail("translation_boundary must be an object")
    for key in ["from_context", "to_context", "bridge_evidence"]:
        _require_string(boundary, key, 3)
    _require_nonempty_string_list(boundary, "blocked_transfer")

    if packet["claim_status"] in {"hypothesis", "evaluation_criterion", "prototype_requirement"}:
        if packet["workflow_stage_coverage"]["validation_or_operations"] == "missing":
            _fail("promotable research claims cannot omit validation_or_operations")

    if packet["privacy_status"]["classification"] == "unknown" and packet["implementation_status"] in {"validated", "implemented_with_tests"}:
        _fail("implemented packets cannot leave privacy classification unknown")


def main(argv: list[str]) -> int:
    if len(argv) != 2:
        print("usage: validate_research_workflow_evidence_packet.py <packet.json>", file=sys.stderr)
        return 2
    path = Path(argv[1])
    packet = json.loads(path.read_text(encoding="utf-8"))
    try:
        validate_packet(packet)
    except ValueError as exc:
        print(f"INVALID: {exc}", file=sys.stderr)
        return 1
    print(f"VALID: {path}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv))
