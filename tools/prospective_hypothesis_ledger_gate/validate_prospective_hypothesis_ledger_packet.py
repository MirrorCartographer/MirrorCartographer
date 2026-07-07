#!/usr/bin/env python3
"""Validate Prospective Hypothesis Ledger packets.

No network access is required. This is intentionally dependency-light so it can run
inside CI or a local checkout.
"""

from __future__ import annotations

import json
import sys
from datetime import date, datetime
from pathlib import Path
from typing import Any

REQUIRED = [
    "packet_id",
    "created_at",
    "source_status",
    "claim_status",
    "privacy_status",
    "evidence_cutoff_date",
    "hypothesis",
    "generation_context",
    "prediction_target",
    "prospective_validation_window",
    "expected_evidence_type",
    "boundary_conditions",
    "missingness",
    "revision_reason",
    "implementation_status",
    "evidence_strength",
    "falsification_route",
    "next_executable_action",
]

ENUMS = {
    "source_status": {
        "peer_reviewed",
        "preprint",
        "institutional_program",
        "benchmark",
        "open_source_tool",
        "dataset",
        "synthetic_fixture",
        "mixed",
    },
    "claim_status": {
        "hypothesis",
        "evaluation_criterion",
        "prototype_requirement",
        "source_map",
        "collaborator_target",
        "blocked_claim",
    },
    "privacy_status": {
        "public_safe",
        "synthetic_only",
        "deidentified_required",
        "restricted_health_data",
        "restricted_veterinary_data",
        "contains_sensitive_personal_data",
    },
    "implementation_status": {
        "proposed",
        "schema_created",
        "validator_created",
        "tests_created",
        "integrated",
        "deprecated",
    },
    "evidence_strength": {"weak", "moderate", "strong", "mixed", "insufficient"},
}

EVIDENCE_TYPES = {
    "new_peer_reviewed_paper",
    "registered_trial",
    "dataset_release",
    "benchmark_result",
    "replication_attempt",
    "negative_result",
    "software_release",
    "grant_or_program_award",
    "clinical_guideline_update",
    "veterinary_dataset_or_benchmark",
}


def parse_date(value: str, field: str) -> date:
    try:
        return date.fromisoformat(value)
    except Exception as exc:  # noqa: BLE001
        raise ValueError(f"{field} must be an ISO date") from exc


def parse_datetime(value: str, field: str) -> datetime:
    try:
        return datetime.fromisoformat(value.replace("Z", "+00:00"))
    except Exception as exc:  # noqa: BLE001
        raise ValueError(f"{field} must be an ISO datetime") from exc


def require_text(packet: dict[str, Any], field: str, minimum: int = 10) -> None:
    value = packet.get(field)
    if not isinstance(value, str) or len(value.strip()) < minimum:
        raise ValueError(f"{field} must be text with at least {minimum} characters")


def validate(packet: dict[str, Any]) -> None:
    missing = [field for field in REQUIRED if field not in packet]
    if missing:
        raise ValueError(f"missing required fields: {', '.join(missing)}")

    for field, allowed in ENUMS.items():
        if packet[field] not in allowed:
            raise ValueError(f"{field} has invalid value: {packet[field]!r}")

    created_at = parse_datetime(packet["created_at"], "created_at")
    cutoff = parse_date(packet["evidence_cutoff_date"], "evidence_cutoff_date")

    window = packet["prospective_validation_window"]
    if not isinstance(window, dict):
        raise ValueError("prospective_validation_window must be an object")
    starts_after = parse_date(window.get("starts_after", ""), "prospective_validation_window.starts_after")
    ends_before = parse_date(window.get("ends_before", ""), "prospective_validation_window.ends_before")
    if starts_after <= cutoff:
        raise ValueError("prospective validation must start after the evidence cutoff")
    if ends_before <= starts_after:
        raise ValueError("prospective validation window must end after it starts")
    if not isinstance(window.get("rationale"), str) or len(window["rationale"].strip()) < 20:
        raise ValueError("prospective_validation_window.rationale is too short")

    if created_at.date() < cutoff:
        raise ValueError("created_at cannot precede evidence_cutoff_date")

    for field, minimum in [
        ("packet_id", 8),
        ("hypothesis", 20),
        ("generation_context", 20),
        ("prediction_target", 10),
        ("revision_reason", 20),
        ("falsification_route", 20),
        ("next_executable_action", 10),
    ]:
        require_text(packet, field, minimum)

    evidence = packet["expected_evidence_type"]
    if not isinstance(evidence, list) or not evidence:
        raise ValueError("expected_evidence_type must be a non-empty list")
    invalid_evidence = [item for item in evidence if item not in EVIDENCE_TYPES]
    if invalid_evidence:
        raise ValueError(f"invalid expected_evidence_type values: {invalid_evidence}")

    boundary = packet["boundary_conditions"]
    if not isinstance(boundary, dict):
        raise ValueError("boundary_conditions must be an object")
    for key in ["domain", "species", "modality", "site_or_cohort"]:
        if not isinstance(boundary.get(key), str) or len(boundary[key].strip()) < 2:
            raise ValueError(f"boundary_conditions.{key} is required")
    blocked = boundary.get("blocked_inferences")
    if not isinstance(blocked, list) or not blocked:
        raise ValueError("boundary_conditions.blocked_inferences must be non-empty")

    for field in ["missingness"]:
        values = packet[field]
        if not isinstance(values, list) or not values:
            raise ValueError(f"{field} must be a non-empty list")
        if any(not isinstance(value, str) or len(value.strip()) < 5 for value in values):
            raise ValueError(f"{field} entries must be meaningful strings")


def main(argv: list[str]) -> int:
    if len(argv) != 2:
        print("usage: validate_prospective_hypothesis_ledger_packet.py <packet.json>", file=sys.stderr)
        return 2
    path = Path(argv[1])
    packet = json.loads(path.read_text(encoding="utf-8"))
    validate(packet)
    print(f"valid prospective hypothesis ledger packet: {path}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv))
