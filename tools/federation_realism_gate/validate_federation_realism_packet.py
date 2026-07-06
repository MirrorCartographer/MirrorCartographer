#!/usr/bin/env python3
"""Validate Federation Realism Gate packets.

This validator intentionally uses only the Python standard library so it can run
in constrained automation contexts. It checks the schema's high-value invariants
without requiring a JSON Schema dependency.
"""

from __future__ import annotations

import json
import sys
from pathlib import Path

REQUIRED_TOP_LEVEL = {
    "packet_id",
    "created_at",
    "domain",
    "claim",
    "source_status",
    "claim_status",
    "privacy_status",
    "missingness",
    "revision_reason",
    "implementation_status",
    "evidence_strength",
    "site_boundary_model",
    "partition_realism",
    "privacy_mechanism",
    "privacy_utility_tradeoff",
    "leakage_threat_model",
    "falsification_route",
    "next_executable_action",
}

REQUIRED_MISSINGNESS = {
    "declared",
    "sampling_cadence",
    "site_specific_absence",
    "dropout_or_censoring",
}

REQUIRED_SITE_BOUNDARY = {"holders", "what_leaves_site", "site_identity_preserved"}
REQUIRED_TRADEOFF = {
    "utility_metric",
    "expected_privacy_cost",
    "minimum_acceptable_utility",
    "stability_risk",
}

ALLOWED_DOMAINS = {
    "human_health",
    "animal_health",
    "mechanistic_biology",
    "neuroscience",
    "longitudinal_health",
    "hci",
    "privacy_memory",
    "hypothesis_generation",
    "scientific_ai",
}

ALLOWED_PRIVACY_MECHANISMS = {
    "none_declared",
    "deidentification",
    "secure_aggregation",
    "local_differential_privacy",
    "federated_updates",
    "synthetic_only",
    "local_only_restoration",
}

ALLOWED_THREATS = {
    "membership_inference",
    "gradient_inversion",
    "attribute_inference",
    "reconstruction",
    "cross_context_memory_leakage",
    "tool_action_leakage",
    "site_reidentification",
}


def _nonempty_text(value: object, min_len: int = 3) -> bool:
    return isinstance(value, str) and len(value.strip()) >= min_len


def validate(packet: dict) -> list[str]:
    errors: list[str] = []

    missing = sorted(REQUIRED_TOP_LEVEL - set(packet))
    if missing:
        errors.append(f"missing top-level fields: {', '.join(missing)}")

    if packet.get("domain") not in ALLOWED_DOMAINS:
        errors.append("domain is not allowed")

    if not _nonempty_text(packet.get("claim"), 20):
        errors.append("claim must be a specific statement, not a label")

    missingness = packet.get("missingness")
    if not isinstance(missingness, dict):
        errors.append("missingness must be an object")
    else:
        absent = sorted(REQUIRED_MISSINGNESS - set(missingness))
        if absent:
            errors.append(f"missingness lacks: {', '.join(absent)}")
        if missingness.get("declared") is not True:
            errors.append("missingness.declared must be true")
        for key in REQUIRED_MISSINGNESS - {"declared"}:
            if not _nonempty_text(missingness.get(key)) or str(missingness.get(key)).lower() == "unknown":
                errors.append(f"missingness.{key} must be explicit, not unknown")

    boundary = packet.get("site_boundary_model")
    if not isinstance(boundary, dict):
        errors.append("site_boundary_model must be an object")
    else:
        absent = sorted(REQUIRED_SITE_BOUNDARY - set(boundary))
        if absent:
            errors.append(f"site_boundary_model lacks: {', '.join(absent)}")
        holders = boundary.get("holders")
        if not isinstance(holders, list) or len(holders) < 2:
            errors.append("site_boundary_model.holders must list at least two holders/sites")
        if boundary.get("site_identity_preserved") is not True:
            errors.append("site identity must be preserved")
        if not _nonempty_text(boundary.get("what_leaves_site")):
            errors.append("site_boundary_model.what_leaves_site must be explicit")

    if not _nonempty_text(packet.get("partition_realism"), 30):
        errors.append("partition_realism must explain why the split is realistic")
    if "random" in str(packet.get("partition_realism", "")).lower() and "not" not in str(packet.get("partition_realism", "")).lower():
        errors.append("row-random partitioning without a realism justification is not acceptable")

    if packet.get("privacy_mechanism") not in ALLOWED_PRIVACY_MECHANISMS:
        errors.append("privacy_mechanism is not allowed")

    tradeoff = packet.get("privacy_utility_tradeoff")
    if not isinstance(tradeoff, dict):
        errors.append("privacy_utility_tradeoff must be an object")
    else:
        absent = sorted(REQUIRED_TRADEOFF - set(tradeoff))
        if absent:
            errors.append(f"privacy_utility_tradeoff lacks: {', '.join(absent)}")
        for key in REQUIRED_TRADEOFF:
            if not _nonempty_text(tradeoff.get(key)) or str(tradeoff.get(key)).lower() == "unknown":
                errors.append(f"privacy_utility_tradeoff.{key} must be explicit, not unknown")

    threats = packet.get("leakage_threat_model")
    if not isinstance(threats, list) or not threats:
        errors.append("leakage_threat_model must contain at least one threat")
    elif any(threat not in ALLOWED_THREATS for threat in threats):
        errors.append("leakage_threat_model contains an unknown threat")

    for key in ["revision_reason", "falsification_route", "next_executable_action"]:
        if not _nonempty_text(packet.get(key), 10):
            errors.append(f"{key} must be explicit")

    return errors


def main(argv: list[str]) -> int:
    if len(argv) != 2:
        print("usage: validate_federation_realism_packet.py <packet.json>", file=sys.stderr)
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
