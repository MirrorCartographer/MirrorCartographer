#!/usr/bin/env python3
"""Validate a Null Evidence Capture packet using only the Python standard library."""

from __future__ import annotations

import json
import sys
from pathlib import Path
from typing import Any

REQUIRED_TOP_LEVEL = [
    "packet_id",
    "claim",
    "source_status",
    "claim_status",
    "privacy_status",
    "missingness",
    "revision_reason",
    "implementation_status",
    "evidence_strength",
    "null_evidence_inventory",
    "source_boundary",
    "confirmation_bias_risk",
    "blocked_inferences",
    "falsification_route",
    "next_executable_action",
]

ENUMS = {
    "source_status": {
        "primary",
        "peer_reviewed",
        "preprint",
        "benchmark",
        "clinical_research_institution",
        "grant_or_prize_program",
        "open_source_tool",
        "mixed_public_sources",
        "synthetic_fixture",
    },
    "claim_status": {
        "hypothesis",
        "evaluation_criterion",
        "schema_requirement",
        "prototype_requirement",
        "source_map",
        "collaborator_target",
        "opportunity_target",
        "blocked_claim",
    },
    "privacy_status": {
        "public_safe",
        "synthetic_only",
        "deidentified_required",
        "aggregate_only",
        "sensitive_raw_trace_forbidden",
    },
    "implementation_status": {
        "proposed",
        "schema_only",
        "implemented_with_tests",
        "validated_in_prototype",
        "rejected",
    },
    "evidence_strength": {"weak", "moderate", "strong", "conflicting", "unknown"},
}

MISSINGNESS_STATUSES = {
    "none_declared",
    "insufficient_data",
    "missing_materials",
    "untested_boundary",
    "privacy_redaction",
    "unknown",
}

EVIDENCE_TYPES = {
    "null_result",
    "negative_control",
    "failed_reproduction",
    "non_verifiable",
    "missing_materials",
    "insufficient_data",
    "retracted_or_contested",
    "not_searched",
}

INTERPRETATIONS = {
    "true_negative_possible",
    "absence_of_evidence",
    "method_failure",
    "privacy_limited",
    "boundary_gap",
    "requires_followup",
}

RISK_LEVELS = {"low", "medium", "high", "unknown"}


def _require_string(packet: dict[str, Any], key: str, min_len: int = 1) -> list[str]:
    value = packet.get(key)
    if not isinstance(value, str) or len(value.strip()) < min_len:
        return [f"{key} must be a string with length >= {min_len}"]
    return []


def validate_packet(packet: dict[str, Any]) -> list[str]:
    errors: list[str] = []

    for key in REQUIRED_TOP_LEVEL:
        if key not in packet:
            errors.append(f"missing required field: {key}")

    for key, allowed in ENUMS.items():
        if key in packet and packet[key] not in allowed:
            errors.append(f"{key} must be one of {sorted(allowed)}")

    errors.extend(_require_string(packet, "packet_id", 8))
    errors.extend(_require_string(packet, "claim", 20))
    errors.extend(_require_string(packet, "revision_reason", 10))
    errors.extend(_require_string(packet, "falsification_route", 20))
    errors.extend(_require_string(packet, "next_executable_action", 10))

    missingness = packet.get("missingness")
    if not isinstance(missingness, dict):
        errors.append("missingness must be an object")
    else:
        if missingness.get("status") not in MISSINGNESS_STATUSES:
            errors.append("missingness.status is invalid")
        if not isinstance(missingness.get("description"), str) or len(missingness["description"].strip()) < 10:
            errors.append("missingness.description must be a string with length >= 10")
        known_unknowns = missingness.get("known_unknowns")
        if not isinstance(known_unknowns, list) or not known_unknowns:
            errors.append("missingness.known_unknowns must be a non-empty list")

    inventory = packet.get("null_evidence_inventory")
    if not isinstance(inventory, list) or not inventory:
        errors.append("null_evidence_inventory must be a non-empty list")
    else:
        for index, item in enumerate(inventory):
            if not isinstance(item, dict):
                errors.append(f"null_evidence_inventory[{index}] must be an object")
                continue
            if item.get("evidence_type") not in EVIDENCE_TYPES:
                errors.append(f"null_evidence_inventory[{index}].evidence_type is invalid")
            if item.get("interpretation") not in INTERPRETATIONS:
                errors.append(f"null_evidence_inventory[{index}].interpretation is invalid")
            for key in ("description", "source"):
                if not isinstance(item.get(key), str) or len(item[key].strip()) < 5:
                    errors.append(f"null_evidence_inventory[{index}].{key} must be a useful string")

    boundary = packet.get("source_boundary")
    if not isinstance(boundary, dict):
        errors.append("source_boundary must be an object")
    else:
        for key in ("species", "modality"):
            if not isinstance(boundary.get(key), list) or not boundary[key]:
                errors.append(f"source_boundary.{key} must be a non-empty list")
        for key in ("dataset_or_corpus", "transfer_boundary"):
            if not isinstance(boundary.get(key), str) or len(boundary[key].strip()) < 3:
                errors.append(f"source_boundary.{key} must be a useful string")

    risk = packet.get("confirmation_bias_risk")
    if not isinstance(risk, dict):
        errors.append("confirmation_bias_risk must be an object")
    else:
        if risk.get("risk_level") not in RISK_LEVELS:
            errors.append("confirmation_bias_risk.risk_level is invalid")
        for key in ("risk_route", "mitigation"):
            if not isinstance(risk.get(key), str) or len(risk[key].strip()) < 10:
                errors.append(f"confirmation_bias_risk.{key} must be a useful string")

    blocked = packet.get("blocked_inferences")
    if not isinstance(blocked, list) or not blocked:
        errors.append("blocked_inferences must be a non-empty list")

    return errors


def main() -> int:
    if len(sys.argv) != 2:
        print("usage: validate_null_evidence_capture_packet.py <packet.json>", file=sys.stderr)
        return 2

    path = Path(sys.argv[1])
    packet = json.loads(path.read_text(encoding="utf-8"))
    errors = validate_packet(packet)
    if errors:
        for error in errors:
            print(f"ERROR: {error}", file=sys.stderr)
        return 1

    print(f"valid null evidence capture packet: {path}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
