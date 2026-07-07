#!/usr/bin/env python3
"""Validate Benchmark Provenance Gap packets.

This intentionally uses only the Python standard library so it can run in minimal
research-ops environments without dependency setup.
"""

from __future__ import annotations

import json
import sys
from pathlib import Path

ALLOWED = {
    "domain": {
        "scientific_ai", "medical_ai", "mechanistic_biology", "neuroscience",
        "longitudinal_health", "animal_health", "hci", "privacy_memory",
        "hypothesis_generation", "mixed",
    },
    "benchmark_status": {
        "peer_reviewed", "preprint", "institutional_dataset", "open_source_tool",
        "grant_program", "synthetic_internal", "unknown",
    },
    "source_status": {
        "primary", "institutional", "preprint_with_caveat", "open_source",
        "secondary", "synthetic_internal",
    },
    "claim_status": {
        "hypothesis", "evaluation_criterion", "prototype_requirement", "source_map",
        "collaborator_target", "not_promotable",
    },
    "provenance_risk": {"low", "moderate", "high", "unknown"},
    "metric_claim_fit": {"direct", "partial", "proxy_only", "unknown"},
    "gap_severity": {"low", "moderate", "high", "blocking"},
    "privacy_status": {
        "public_safe", "deidentified_but_sensitive", "restricted_health_data",
        "animal_health_sensitive", "contains_personal_memory", "unknown",
    },
    "implementation_status": {
        "schema_only", "validator_added", "fixtures_added", "tests_added",
        "integrated", "blocked",
    },
    "evidence_strength": {"weak", "moderate", "strong", "clinical_grade", "unknown"},
}

REQUIRED_TOP = [
    "packet_id", "benchmark_identity", "source_status", "claim_status",
    "claim_under_review", "dataset_provenance", "task_metric_binding",
    "transfer_boundary", "benchmark_gap_model", "privacy_status",
    "missingness", "revision_reason", "implementation_status",
    "evidence_strength", "falsification_route", "next_executable_action",
]


def require(condition: bool, message: str, errors: list[str]) -> None:
    if not condition:
        errors.append(message)


def nonempty_string(value: object, min_len: int = 1) -> bool:
    return isinstance(value, str) and len(value.strip()) >= min_len


def nonempty_string_list(value: object) -> bool:
    return isinstance(value, list) and bool(value) and all(nonempty_string(item, 3) for item in value)


def validate(packet: dict) -> list[str]:
    errors: list[str] = []
    for key in REQUIRED_TOP:
        require(key in packet, f"missing top-level field: {key}", errors)
    if errors:
        return errors

    require(nonempty_string(packet["packet_id"], 8), "packet_id must be a string with at least 8 characters", errors)
    require(packet["source_status"] in ALLOWED["source_status"], "source_status is not allowed", errors)
    require(packet["claim_status"] in ALLOWED["claim_status"], "claim_status is not allowed", errors)
    require(nonempty_string(packet["claim_under_review"], 12), "claim_under_review is too short", errors)
    require(packet["privacy_status"] in ALLOWED["privacy_status"], "privacy_status is not allowed", errors)
    require(nonempty_string_list(packet["missingness"]), "missingness must list at least one explicit unknown/gap", errors)
    require(nonempty_string(packet["revision_reason"], 10), "revision_reason is too short", errors)
    require(packet["implementation_status"] in ALLOWED["implementation_status"], "implementation_status is not allowed", errors)
    require(packet["evidence_strength"] in ALLOWED["evidence_strength"], "evidence_strength is not allowed", errors)
    require(nonempty_string(packet["falsification_route"], 20), "falsification_route is too short", errors)
    require(nonempty_string(packet["next_executable_action"], 10), "next_executable_action is too short", errors)

    identity = packet["benchmark_identity"]
    require(isinstance(identity, dict), "benchmark_identity must be an object", errors)
    if isinstance(identity, dict):
        for key in ["name", "version_or_date", "domain", "benchmark_status"]:
            require(key in identity, f"benchmark_identity missing {key}", errors)
        require(nonempty_string(identity.get("name"), 2), "benchmark_identity.name is too short", errors)
        require(nonempty_string(identity.get("version_or_date"), 4), "benchmark_identity.version_or_date is too short", errors)
        require(identity.get("domain") in ALLOWED["domain"], "benchmark_identity.domain is not allowed", errors)
        require(identity.get("benchmark_status") in ALLOWED["benchmark_status"], "benchmark_identity.benchmark_status is not allowed", errors)

    provenance = packet["dataset_provenance"]
    require(isinstance(provenance, dict), "dataset_provenance must be an object", errors)
    if isinstance(provenance, dict):
        for key in ["origin", "population_or_species", "site_or_lab", "modality", "collection_context", "license_or_access", "provenance_risk"]:
            require(key in provenance, f"dataset_provenance missing {key}", errors)
        require(nonempty_string(provenance.get("origin"), 3), "dataset_provenance.origin is too short", errors)
        require(nonempty_string(provenance.get("population_or_species"), 3), "dataset_provenance.population_or_species is too short", errors)
        require(nonempty_string(provenance.get("site_or_lab"), 3), "dataset_provenance.site_or_lab is too short", errors)
        require(nonempty_string(provenance.get("modality"), 3), "dataset_provenance.modality is too short", errors)
        require(nonempty_string(provenance.get("collection_context"), 8), "dataset_provenance.collection_context is too short", errors)
        require(nonempty_string(provenance.get("license_or_access"), 3), "dataset_provenance.license_or_access is too short", errors)
        require(provenance.get("provenance_risk") in ALLOWED["provenance_risk"], "dataset_provenance.provenance_risk is not allowed", errors)

    binding = packet["task_metric_binding"]
    require(isinstance(binding, dict), "task_metric_binding must be an object", errors)
    if isinstance(binding, dict):
        for key in ["task", "metric", "metric_claim_fit", "blocked_metric_inference"]:
            require(key in binding, f"task_metric_binding missing {key}", errors)
        require(nonempty_string(binding.get("task"), 5), "task_metric_binding.task is too short", errors)
        require(nonempty_string(binding.get("metric"), 2), "task_metric_binding.metric is too short", errors)
        require(binding.get("metric_claim_fit") in ALLOWED["metric_claim_fit"], "task_metric_binding.metric_claim_fit is not allowed", errors)
        require(nonempty_string(binding.get("blocked_metric_inference"), 8), "task_metric_binding.blocked_metric_inference is too short", errors)

    transfer = packet["transfer_boundary"]
    require(isinstance(transfer, dict), "transfer_boundary must be an object", errors)
    if isinstance(transfer, dict):
        for key in ["within_scope", "out_of_scope", "required_bridge_evidence"]:
            require(key in transfer, f"transfer_boundary missing {key}", errors)
            require(nonempty_string_list(transfer.get(key)), f"transfer_boundary.{key} must be a non-empty string list", errors)

    gap = packet["benchmark_gap_model"]
    require(isinstance(gap, dict), "benchmark_gap_model must be an object", errors)
    if isinstance(gap, dict):
        for key in ["known_gaps", "gap_severity", "why_gap_matters"]:
            require(key in gap, f"benchmark_gap_model missing {key}", errors)
        require(nonempty_string_list(gap.get("known_gaps")), "benchmark_gap_model.known_gaps must be a non-empty string list", errors)
        require(gap.get("gap_severity") in ALLOWED["gap_severity"], "benchmark_gap_model.gap_severity is not allowed", errors)
        require(nonempty_string(gap.get("why_gap_matters"), 12), "benchmark_gap_model.why_gap_matters is too short", errors)

    return errors


def main(argv: list[str]) -> int:
    if len(argv) != 2:
        print("usage: validate_benchmark_provenance_gap_packet.py <packet.json>", file=sys.stderr)
        return 2
    path = Path(argv[1])
    packet = json.loads(path.read_text(encoding="utf-8"))
    errors = validate(packet)
    if errors:
        for error in errors:
            print(f"ERROR: {error}", file=sys.stderr)
        return 1
    print(f"VALID: {path}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv))
