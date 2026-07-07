#!/usr/bin/env python3
"""Validate Temporal Science Forecast Gate packets.

This intentionally uses only the Python standard library so the gate can run in
minimal environments before the broader MC toolchain is installed.
"""
from __future__ import annotations

import json
import sys
from pathlib import Path

REQUIRED = {
    "packet_id": str,
    "research_domain": str,
    "source_status": str,
    "claim_status": str,
    "privacy_status": str,
    "evidence_cutoff": str,
    "forecast_horizon": str,
    "forecast_claim": str,
    "prior_work_dependencies": list,
    "collaborator_or_dataset_targets": list,
    "expected_contribution_shape": str,
    "evaluation_signal": str,
    "missingness": str,
    "revision_reason": str,
    "implementation_status": str,
    "evidence_strength": str,
    "falsification_route": str,
    "next_executable_action": str,
}

ALLOWED = {
    "source_status": {"primary", "institutional", "preprint", "benchmark", "dataset", "open_source", "mixed"},
    "claim_status": {"hypothesis", "evaluation_criterion", "schema", "prototype_requirement", "source_map", "opportunity_target"},
    "privacy_status": {"public_safe", "synthetic_only", "deidentified_required", "sensitive_blocked", "local_only"},
    "implementation_status": {"planned", "implemented_synthetic", "implemented_ci", "blocked"},
    "evidence_strength": {"weak", "moderate", "strong"},
}

MIN_LENGTHS = {
    "packet_id": 8,
    "research_domain": 3,
    "forecast_claim": 30,
    "expected_contribution_shape": 20,
    "evaluation_signal": 20,
    "missingness": 10,
    "revision_reason": 10,
    "falsification_route": 25,
    "next_executable_action": 10,
}


def validate(packet: dict) -> list[str]:
    errors: list[str] = []
    for field, expected_type in REQUIRED.items():
        if field not in packet:
            errors.append(f"missing required field: {field}")
            continue
        if not isinstance(packet[field], expected_type):
            errors.append(f"field {field} must be {expected_type.__name__}")

    for field, allowed_values in ALLOWED.items():
        if field in packet and packet[field] not in allowed_values:
            errors.append(f"field {field} has unsupported value: {packet[field]!r}")

    for field, min_len in MIN_LENGTHS.items():
        if isinstance(packet.get(field), str) and len(packet[field].strip()) < min_len:
            errors.append(f"field {field} is too short")

    if isinstance(packet.get("prior_work_dependencies"), list) and len(packet["prior_work_dependencies"]) < 2:
        errors.append("prior_work_dependencies must contain at least 2 items")
    if isinstance(packet.get("collaborator_or_dataset_targets"), list) and len(packet["collaborator_or_dataset_targets"]) < 1:
        errors.append("collaborator_or_dataset_targets must contain at least 1 item")

    cutoff = packet.get("evidence_cutoff")
    if isinstance(cutoff, str):
        parts = cutoff.split("-")
        if len(parts) != 3 or not all(part.isdigit() for part in parts):
            errors.append("evidence_cutoff must be YYYY-MM-DD")

    if isinstance(packet.get("forecast_claim"), str):
        weak_phrases = ["soon", "probably", "cure everything", "ai will fix"]
        if any(phrase in packet["forecast_claim"].lower() for phrase in weak_phrases):
            errors.append("forecast_claim is too vague or hype-like")

    return errors


def main(argv: list[str]) -> int:
    if len(argv) != 2:
        print("usage: validate_temporal_science_forecast_packet.py <packet.json>", file=sys.stderr)
        return 2
    path = Path(argv[1])
    packet = json.loads(path.read_text(encoding="utf-8"))
    errors = validate(packet)
    if errors:
        for error in errors:
            print(f"ERROR: {error}", file=sys.stderr)
        return 1
    print(f"OK: {path}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv))
