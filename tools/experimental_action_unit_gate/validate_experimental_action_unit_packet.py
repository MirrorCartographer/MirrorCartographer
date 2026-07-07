#!/usr/bin/env python3
"""Validate Experimental Action Unit packets.

No external dependencies are required. This validator intentionally checks the
same required labels as the JSON schema so the gate can run in lightweight CI or
local research folders without installing a schema package.
"""

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
    "experimental_action_unit",
    "workflow_phase",
    "substrate_boundary",
    "blocked_inferences",
    "falsification_route",
    "next_executable_action",
]

ENUMS = {
    "source_status": {
        "primary",
        "clinical_or_research_institution",
        "peer_reviewed",
        "preprint_caveated",
        "open_source",
        "benchmark_or_dataset",
        "synthetic_internal",
    },
    "claim_status": {
        "hypothesis",
        "prototype_requirement",
        "evaluation_criterion",
        "source_map",
        "collaborator_target",
        "opportunity_target",
        "blocked_claim",
    },
    "privacy_status": {
        "public_safe",
        "synthetic_only",
        "deidentified_required",
        "consent_required",
        "restricted_sensitive",
        "do_not_store",
    },
    "implementation_status": {
        "proposed",
        "schema_only",
        "validator_added",
        "fixtures_added",
        "tests_added",
        "implemented",
    },
    "evidence_strength": {"weak", "moderate", "strong", "unknown"},
    "workflow_phase": {
        "evidence_handling",
        "analysis",
        "design_and_optimization",
        "scientific_reasoning",
        "validation_and_operations",
        "translation",
        "scientific_communication",
    },
}

REQUIRED_ACTION_UNIT = [
    "action",
    "actor",
    "input",
    "operation",
    "output",
    "endpoint",
    "minimum_reproducible_unit",
]

REQUIRED_MISSINGNESS = ["known_missing", "impact", "minimum_resolution"]
REQUIRED_SUBSTRATE = ["domain", "species_or_population", "data_modality", "transfer_boundary"]


def _non_empty_string(value: Any) -> bool:
    return isinstance(value, str) and bool(value.strip())


def validate_packet(packet: dict[str, Any]) -> list[str]:
    errors: list[str] = []

    for key in REQUIRED_TOP_LEVEL:
        if key not in packet:
            errors.append(f"missing top-level field: {key}")

    for key, allowed in ENUMS.items():
        if key in packet and packet[key] not in allowed:
            errors.append(f"invalid {key}: {packet[key]!r}")

    for key in [
        "packet_id",
        "claim",
        "revision_reason",
        "falsification_route",
        "next_executable_action",
    ]:
        if key in packet and not _non_empty_string(packet[key]):
            errors.append(f"{key} must be a non-empty string")

    missingness = packet.get("missingness")
    if not isinstance(missingness, dict):
        errors.append("missingness must be an object")
    else:
        for key in REQUIRED_MISSINGNESS:
            if key not in missingness:
                errors.append(f"missingness missing field: {key}")
        known_missing = missingness.get("known_missing")
        if not isinstance(known_missing, list) or not known_missing:
            errors.append("missingness.known_missing must be a non-empty list")

    action_unit = packet.get("experimental_action_unit")
    if not isinstance(action_unit, dict):
        errors.append("experimental_action_unit must be an object")
    else:
        for key in REQUIRED_ACTION_UNIT:
            if key not in action_unit:
                errors.append(f"experimental_action_unit missing field: {key}")
            elif not _non_empty_string(action_unit[key]):
                errors.append(f"experimental_action_unit.{key} must be a non-empty string")

    substrate = packet.get("substrate_boundary")
    if not isinstance(substrate, dict):
        errors.append("substrate_boundary must be an object")
    else:
        for key in REQUIRED_SUBSTRATE:
            if key not in substrate:
                errors.append(f"substrate_boundary missing field: {key}")
            elif not _non_empty_string(substrate[key]):
                errors.append(f"substrate_boundary.{key} must be a non-empty string")

    blocked = packet.get("blocked_inferences")
    if not isinstance(blocked, list) or not blocked:
        errors.append("blocked_inferences must be a non-empty list")

    return errors


def main(argv: list[str]) -> int:
    if len(argv) != 2:
        print("usage: validate_experimental_action_unit_packet.py <packet.json>", file=sys.stderr)
        return 2

    path = Path(argv[1])
    packet = json.loads(path.read_text(encoding="utf-8"))
    errors = validate_packet(packet)
    if errors:
        for error in errors:
            print(f"ERROR: {error}")
        return 1

    print(f"valid experimental action unit packet: {path}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv))
