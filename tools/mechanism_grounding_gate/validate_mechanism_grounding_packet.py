#!/usr/bin/env python3
"""Validate Mechanism Grounding Gate packets.

This validator intentionally uses only the Python standard library so it can run
inside minimal CI or local review environments without dependency setup.
"""

from __future__ import annotations

import json
import sys
from pathlib import Path

REQUIRED_FIELDS = [
    "packet_id",
    "domain",
    "problem_context",
    "observed_failure_or_gap",
    "proposed_intervention_or_variable",
    "proposed_mechanism",
    "target_endpoint",
    "expected_direction",
    "validation_method",
    "source_map",
    "source_status",
    "claim_status",
    "privacy_status",
    "missingness",
    "revision_reason",
    "implementation_status",
    "evidence_strength",
    "falsification_route",
    "next_executable_action",
]

ALLOWED_DOMAINS = {
    "scientific_ai",
    "medical_ai_research_organization",
    "mechanistic_biology",
    "neuroscience",
    "longitudinal_health_data",
    "animal_health_research_infrastructure",
    "hci",
    "privacy_preserving_memory",
    "hypothesis_generation_system",
}

ALLOWED_DIRECTIONS = {"increase", "decrease", "stabilize", "differentiate", "unknown_but_measurable"}
ALLOWED_CLAIM_STATUS = {"infrastructure_hypothesis", "evaluation_criterion", "schema_requirement", "prototype_requirement", "collaborator_target"}
ALLOWED_PRIVACY_STATUS = {"public_safe_synthetic_only", "contains_private_data_rejected", "requires_local_only_restoration", "deidentified_review_needed"}
ALLOWED_EVIDENCE_STRENGTH = {"weak", "moderate", "strong", "unknown"}
ALLOWED_SOURCE_STATUS = {"primary", "institutional", "preprint_caveated", "benchmark", "open_source_tool", "dataset", "news_secondary"}

ADVICE_TERMS = [
    "diagnose",
    "diagnosis is",
    "treat with",
    "give your dog",
    "give your cat",
    "you should take",
    "dose",
    "prescribe",
]


def _text(value: object) -> str:
    return value if isinstance(value, str) else ""


def validate(packet: dict) -> list[str]:
    errors: list[str] = []

    for field in REQUIRED_FIELDS:
        if field not in packet:
            errors.append(f"missing required field: {field}")

    if errors:
        return errors

    if packet["domain"] not in ALLOWED_DOMAINS:
        errors.append("domain is not allowed")
    if packet["expected_direction"] not in ALLOWED_DIRECTIONS:
        errors.append("expected_direction is not allowed")
    if packet["claim_status"] not in ALLOWED_CLAIM_STATUS:
        errors.append("claim_status is not allowed")
    if packet["privacy_status"] not in ALLOWED_PRIVACY_STATUS:
        errors.append("privacy_status is not allowed")
    if packet["evidence_strength"] not in ALLOWED_EVIDENCE_STRENGTH:
        errors.append("evidence_strength is not allowed")

    for field in [
        "problem_context",
        "observed_failure_or_gap",
        "proposed_mechanism",
        "validation_method",
        "falsification_route",
    ]:
        if len(_text(packet[field]).strip()) < 20:
            errors.append(f"{field} is too short to review")

    if not isinstance(packet["source_map"], list) or not packet["source_map"]:
        errors.append("source_map must contain at least one source")
    else:
        for idx, source in enumerate(packet["source_map"]):
            if not isinstance(source, dict):
                errors.append(f"source_map[{idx}] must be an object")
                continue
            for key in ["title", "url", "status", "claim_supported"]:
                if key not in source:
                    errors.append(f"source_map[{idx}] missing {key}")
            if source.get("status") not in ALLOWED_SOURCE_STATUS:
                errors.append(f"source_map[{idx}] status is not allowed")

    combined = "\n".join(_text(packet.get(field, "")).lower() for field in packet.keys())
    if packet["domain"] in {"medical_ai_research_organization", "animal_health_research_infrastructure"}:
        if any(term in combined for term in ADVICE_TERMS):
            errors.append("medical/veterinary packet appears advice-like rather than research-organizational")

    mechanism = _text(packet["proposed_mechanism"]).lower()
    if not any(marker in mechanism for marker in ["because", "via", "through", "mediated", "mechanism", "pathway", "causal"]):
        errors.append("proposed_mechanism lacks an explicit causal/mechanistic connector")

    return errors


def main(argv: list[str]) -> int:
    if len(argv) != 2:
        print("usage: validate_mechanism_grounding_packet.py <packet.json>", file=sys.stderr)
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
