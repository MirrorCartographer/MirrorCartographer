#!/usr/bin/env python3
"""Validate a Virtual Cell Fidelity packet.

This validator intentionally uses only the Python standard library so the gate can run
in constrained automation and repository review environments.
"""

from __future__ import annotations

import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent

REQUIRED_TOP_LEVEL = [
    "packet_id",
    "source_status",
    "claim_status",
    "privacy_status",
    "missingness",
    "revision_reason",
    "implementation_status",
    "evidence_strength",
    "falsification_route",
    "next_executable_action",
    "perturbation",
    "cell_context",
    "semantic_harmonization",
    "distribution_shift",
    "metrics",
    "validation_status",
    "blocked_inferences",
    "source_map",
]

ALLOWED_SOURCE_STATUS = {
    "primary_source",
    "clinical_or_research_institution",
    "preprint_with_caveat",
    "open_source_tool",
    "benchmark_dataset",
    "synthetic_fixture",
}

ALLOWED_CLAIM_STATUS = {
    "hypothesis",
    "benchmark_result",
    "prototype_requirement",
    "evaluation_criterion",
    "source_map",
    "clinical_or_veterinary_action",
}

BIOLOGICAL_FIDELITY_METRICS = {
    "perturbation_direction_correlation",
    "differential_expression_overlap",
    "pathway_enrichment_consistency",
    "marker_consistency",
    "ontology_grounded_correctness",
    "wet_lab_endpoint_match",
}


def fail(message: str) -> None:
    raise SystemExit(f"INVALID: {message}")


def require(condition: bool, message: str) -> None:
    if not condition:
        fail(message)


def validate(packet: dict) -> None:
    for key in REQUIRED_TOP_LEVEL:
        require(key in packet, f"missing required field: {key}")

    require(packet["source_status"] in ALLOWED_SOURCE_STATUS, "invalid source_status")
    require(packet["claim_status"] in ALLOWED_CLAIM_STATUS, "invalid claim_status")
    require(packet["claim_status"] != "clinical_or_veterinary_action", "clinical/veterinary action claims cannot be promoted by this research gate")
    require(packet["privacy_status"] in {"public_safe_synthetic", "public_non_subject_data", "deidentified_subject_data", "restricted_subject_data", "unknown"}, "invalid privacy_status")
    require(packet["privacy_status"] != "unknown", "privacy_status must not be unknown")

    metrics = packet["metrics"]
    require(isinstance(metrics.get("biological_fidelity"), list), "metrics.biological_fidelity must be a list")
    require(len(metrics["biological_fidelity"]) >= 1, "at least one biological-fidelity metric is required")
    require(set(metrics["biological_fidelity"]).issubset(BIOLOGICAL_FIDELITY_METRICS), "unknown biological-fidelity metric")
    require(metrics.get("reconstruction_only") is False, "reconstruction-only evaluation cannot support promotion")

    semantic = packet["semantic_harmonization"]
    require(semantic.get("status") in {"declared", "partial"}, "semantic harmonization must be declared or partial")
    require(bool(semantic.get("ontology_or_mapping")), "ontology_or_mapping is required")

    shift = packet["distribution_shift"]
    require(shift.get("status") == "declared", "distribution shift status must be declared")
    require(isinstance(shift.get("shift_types"), list) and len(shift["shift_types"]) >= 1, "shift_types must be non-empty")

    validation = packet["validation_status"]
    require(validation.get("benchmark_validation") == "declared", "benchmark validation must be declared")
    require(validation.get("dual_use_review") != "missing", "dual-use review status cannot be missing")

    perturbation = packet["perturbation"]
    require(perturbation.get("type") in {"genetic", "chemical", "cytokine", "environmental", "unknown"}, "invalid perturbation type")
    require(perturbation.get("type") != "unknown", "perturbation type must be known")
    require(perturbation.get("target"), "perturbation target is required")

    blocked = packet["blocked_inferences"]
    require(isinstance(blocked, list) and len(blocked) >= 1, "blocked_inferences must be non-empty")
    require(any("clinical" in item.lower() or "veterinary" in item.lower() or "cure" in item.lower() for item in blocked), "blocked_inferences must explicitly block clinical/veterinary/cure overreach")

    require(len(packet["falsification_route"]) >= 20, "falsification route is too short")
    require(len(packet["next_executable_action"]) >= 10, "next executable action is too short")


def main(argv: list[str]) -> int:
    if len(argv) != 2:
        print("usage: validate_virtual_cell_fidelity_packet.py <packet.json>", file=sys.stderr)
        return 2
    path = Path(argv[1])
    packet = json.loads(path.read_text(encoding="utf-8"))
    validate(packet)
    print(f"VALID: {path}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv))
