#!/usr/bin/env python3
"""Validate Inspectable Hypothesis Workflow packets.

This validator intentionally checks structure only. It does not validate medical,
veterinary, or scientific truth. It is meant to block reusable discovery-memory
promotion unless the packet exposes inspectable research-organization metadata.
"""

from __future__ import annotations

import json
import sys
from pathlib import Path
from typing import Any


REQUIRED_TOP_LEVEL = [
    "packet_id",
    "domain",
    "source_status",
    "claim_status",
    "privacy_status",
    "missingness",
    "revision_reason",
    "implementation_status",
    "evidence_strength",
    "source_map",
    "workflow_boundary",
    "hypothesis_route",
    "critique_route",
    "privacy_leakage_route",
    "human_checkpoint",
    "falsification_route",
    "next_executable_action",
]

ALLOWED_DOMAINS = {
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

ALLOWED_EVIDENCE_STRENGTH = {"low", "low_to_moderate", "moderate", "high"}
ALLOWED_DECISIONS = {"promote", "hold", "revise", "reject"}


def require(condition: bool, message: str, errors: list[str]) -> None:
    if not condition:
        errors.append(message)


def validate(packet: dict[str, Any]) -> list[str]:
    errors: list[str] = []

    for field in REQUIRED_TOP_LEVEL:
        require(field in packet, f"missing top-level field: {field}", errors)

    if errors:
        return errors

    require(packet["domain"] in ALLOWED_DOMAINS, "domain is not recognized", errors)
    require(packet["evidence_strength"] in ALLOWED_EVIDENCE_STRENGTH, "evidence_strength is invalid", errors)

    for field in [
        "source_status",
        "claim_status",
        "privacy_status",
        "missingness",
        "revision_reason",
        "implementation_status",
        "falsification_route",
        "next_executable_action",
    ]:
        require(isinstance(packet[field], str) and len(packet[field]) >= 8, f"{field} must be a descriptive string", errors)

    source_map = packet["source_map"]
    require(isinstance(source_map, list) and len(source_map) >= 2, "source_map must include at least two sources", errors)
    if isinstance(source_map, list):
        for i, source in enumerate(source_map):
            require(isinstance(source, dict), f"source_map[{i}] must be an object", errors)
            if isinstance(source, dict):
                for field in ["source_id", "source_type", "claim_supported", "caveat"]:
                    require(field in source, f"source_map[{i}] missing {field}", errors)

    boundary = packet["workflow_boundary"]
    require(isinstance(boundary, dict), "workflow_boundary must be an object", errors)
    if isinstance(boundary, dict):
        for field in ["dataset_boundary", "code_boundary", "literature_boundary", "tool_boundary", "excluded_uses"]:
            require(field in boundary, f"workflow_boundary missing {field}", errors)
        require(isinstance(boundary.get("excluded_uses"), list) and boundary.get("excluded_uses"), "excluded_uses must be a non-empty list", errors)
        if isinstance(boundary.get("excluded_uses"), list):
            require(any("advice" in str(use).lower() for use in boundary["excluded_uses"]), "excluded_uses should explicitly block medical/veterinary advice use", errors)

    route = packet["hypothesis_route"]
    require(isinstance(route, dict), "hypothesis_route must be an object", errors)
    if isinstance(route, dict):
        for field in ["starting_question", "structured_evidence_route", "candidate_hypothesis", "ranking_basis"]:
            require(field in route, f"hypothesis_route missing {field}", errors)
        require(isinstance(route.get("structured_evidence_route"), list) and len(route.get("structured_evidence_route", [])) >= 2, "structured_evidence_route must have at least two steps", errors)

    critique = packet["critique_route"]
    require(isinstance(critique, dict), "critique_route must be an object", errors)
    if isinstance(critique, dict):
        require(isinstance(critique.get("main_failure_modes"), list) and len(critique.get("main_failure_modes", [])) >= 2, "critique_route must include at least two failure modes", errors)
        require("revision_trigger" in critique, "critique_route missing revision_trigger", errors)

    privacy = packet["privacy_leakage_route"]
    require(isinstance(privacy, dict), "privacy_leakage_route must be an object", errors)
    if isinstance(privacy, dict):
        for field in ["sensitive_context", "leakage_risk", "mitigation", "residual_risk"]:
            require(field in privacy, f"privacy_leakage_route missing {field}", errors)

    checkpoint = packet["human_checkpoint"]
    require(isinstance(checkpoint, dict), "human_checkpoint must be an object", errors)
    if isinstance(checkpoint, dict):
        require(checkpoint.get("required") is True, "human_checkpoint.required must be true", errors)
        decisions = checkpoint.get("decision_options")
        require(isinstance(decisions, list), "decision_options must be a list", errors)
        if isinstance(decisions, list):
            require(set(decisions).issubset(ALLOWED_DECISIONS), "decision_options contains invalid option", errors)
            require({"promote", "hold", "revise", "reject"}.issubset(set(decisions)), "decision_options must include promote, hold, revise, reject", errors)

    return errors


def main() -> int:
    if len(sys.argv) != 2:
        print("usage: validate_inspectable_hypothesis_packet.py <packet.json>", file=sys.stderr)
        return 2

    path = Path(sys.argv[1])
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
    raise SystemExit(main())
