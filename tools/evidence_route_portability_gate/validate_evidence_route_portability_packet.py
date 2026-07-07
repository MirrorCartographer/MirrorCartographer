#!/usr/bin/env python3
"""Validate Evidence Route Portability packets.

This validator intentionally uses only the Python standard library so the gate can run
in constrained environments without installing jsonschema. It checks the schema's
high-value invariants rather than implementing a full JSON Schema engine.
"""

from __future__ import annotations

import json
import sys
from pathlib import Path

REQUIRED_TOP_LEVEL = {
    "packet_id",
    "created_at",
    "source_status",
    "claim_status",
    "privacy_status",
    "missingness",
    "revision_reason",
    "implementation_status",
    "evidence_strength",
    "falsification_route",
    "next_executable_action",
    "research_domain",
    "claim",
    "evidence_route",
    "transfer_boundaries",
    "promotion_decision",
}

ALLOWED_RESEARCH_DOMAINS = {
    "scientific_ai",
    "medical_ai",
    "mechanistic_biology",
    "neuroscience",
    "longitudinal_health_data",
    "animal_health_research_infrastructure",
    "hci",
    "privacy_preserving_memory",
    "hypothesis_generation_system",
}

ALLOWED_SOURCE_STATUS = {
    "peer_reviewed",
    "preprint",
    "clinical_or_research_institution",
    "grant_or_prize_program",
    "dataset_or_benchmark",
    "open_source_tool",
    "synthetic_fixture",
    "mixed_public_sources",
}

ALLOWED_CLAIM_STATUS = {
    "hypothesis",
    "schema",
    "evaluation_criterion",
    "source_map",
    "prototype_requirement",
    "collaborator_or_opportunity_target",
    "blocked_claim",
}

ALLOWED_PRIVACY_STATUS = {
    "public_safe",
    "synthetic_only",
    "deidentified_requires_review",
    "private_memory_blocked",
    "requires_local_only_processing",
}

ALLOWED_IMPLEMENTATION_STATUS = {
    "proposed",
    "schema_committed",
    "validator_committed",
    "fixtures_committed",
    "tests_committed",
    "integrated",
    "blocked",
}

ALLOWED_EVIDENCE_STRENGTH = {"weak", "moderate", "strong", "mixed", "insufficient"}
ALLOWED_PROMOTION_DECISION = {"pass", "fail", "revise_before_promotion"}


def fail(message: str) -> None:
    raise SystemExit(f"INVALID: {message}")


def require_string(packet: dict, key: str, minimum: int = 1) -> None:
    value = packet.get(key)
    if not isinstance(value, str) or len(value.strip()) < minimum:
        fail(f"{key} must be a string with at least {minimum} characters")


def validate(packet: dict) -> None:
    missing = REQUIRED_TOP_LEVEL - set(packet)
    if missing:
        fail(f"missing required fields: {sorted(missing)}")

    if packet["research_domain"] not in ALLOWED_RESEARCH_DOMAINS:
        fail("research_domain is not allowed")
    if packet["source_status"] not in ALLOWED_SOURCE_STATUS:
        fail("source_status is not allowed")
    if packet["claim_status"] not in ALLOWED_CLAIM_STATUS:
        fail("claim_status is not allowed")
    if packet["privacy_status"] not in ALLOWED_PRIVACY_STATUS:
        fail("privacy_status is not allowed")
    if packet["implementation_status"] not in ALLOWED_IMPLEMENTATION_STATUS:
        fail("implementation_status is not allowed")
    if packet["evidence_strength"] not in ALLOWED_EVIDENCE_STRENGTH:
        fail("evidence_strength is not allowed")
    if packet["promotion_decision"] not in ALLOWED_PROMOTION_DECISION:
        fail("promotion_decision is not allowed")

    require_string(packet, "packet_id", 8)
    require_string(packet, "revision_reason", 20)
    require_string(packet, "falsification_route", 30)
    require_string(packet, "next_executable_action", 15)

    missingness = packet["missingness"]
    if not isinstance(missingness, dict):
        fail("missingness must be an object")
    if missingness.get("declared") is not True:
        fail("missingness.declared must be true")
    for list_key in ["unobserved_variables", "excluded_modalities"]:
        value = missingness.get(list_key)
        if not isinstance(value, list) or not value or not all(isinstance(item, str) and item.strip() for item in value):
            fail(f"missingness.{list_key} must contain at least one non-empty string")
    for text_key in ["irregular_time", "impact_on_claim"]:
        if not isinstance(missingness.get(text_key), str) or len(missingness[text_key].strip()) < 5:
            fail(f"missingness.{text_key} must be informative")

    claim = packet["claim"]
    if not isinstance(claim, dict):
        fail("claim must be an object")
    for key, minimum in [("text", 20), ("allowed_scope", 10), ("disallowed_scope", 10)]:
        if not isinstance(claim.get(key), str) or len(claim[key].strip()) < minimum:
            fail(f"claim.{key} must be informative")
    if claim.get("decision_readiness") not in {"research_organization_only", "prototype_design", "benchmark_design", "not_ready_for_action"}:
        fail("claim.decision_readiness is not allowed")

    route = packet["evidence_route"]
    if not isinstance(route, list) or len(route) < 2:
        fail("evidence_route must contain at least two steps")
    for index, step in enumerate(route):
        if not isinstance(step, dict):
            fail(f"evidence_route[{index}] must be an object")
        for key in ["step_id", "input", "transformation", "output", "actor_or_tool", "portability_risk", "reconstruction_requirement"]:
            if not isinstance(step.get(key), str) or len(step[key].strip()) < 3:
                fail(f"evidence_route[{index}].{key} must be informative")
        if len(step["portability_risk"].strip()) < 15:
            fail(f"evidence_route[{index}].portability_risk is too short")
        if len(step["reconstruction_requirement"].strip()) < 20:
            fail(f"evidence_route[{index}].reconstruction_requirement is too short")

    boundaries = packet["transfer_boundaries"]
    if not isinstance(boundaries, dict):
        fail("transfer_boundaries must be an object")
    for key in ["species", "modality", "model", "site", "time", "privacy"]:
        if not isinstance(boundaries.get(key), str) or len(boundaries[key].strip()) < 5:
            fail(f"transfer_boundaries.{key} must be informative")

    if packet["promotion_decision"] == "pass" and packet["evidence_strength"] in {"weak", "insufficient"}:
        fail("weak or insufficient evidence cannot pass promotion")

    if packet["privacy_status"] in {"private_memory_blocked", "requires_local_only_processing"} and packet["promotion_decision"] == "pass":
        fail("private or local-only packets cannot pass public discovery-memory promotion")


def main() -> int:
    if len(sys.argv) != 2:
        print("Usage: validate_evidence_route_portability_packet.py <packet.json>", file=sys.stderr)
        return 2
    path = Path(sys.argv[1])
    packet = json.loads(path.read_text(encoding="utf-8"))
    validate(packet)
    print(f"VALID: {path}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
