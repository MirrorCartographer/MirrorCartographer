#!/usr/bin/env python3
"""Normalize public-safe research claim packets for Mirror Cartographer.

This CLI validates whether research notes are safe and testable enough to enter
MC's discovery/research memory pipeline. It is for research organization only,
not medical or veterinary advice.
"""

from __future__ import annotations

import json
import sys
from dataclasses import dataclass, asdict
from pathlib import Path
from typing import Any

DOMAINS = {
    "human_health_research",
    "animal_health_research",
    "mechanistic_biology",
    "neuroscience",
    "scientific_ai",
    "hci",
    "privacy_memory",
    "hypothesis_systems",
}

SOURCE_STATUSES = {
    "primary_source",
    "clinical_institution",
    "preprint_caveated",
    "benchmark_dataset",
    "open_source_tool",
    "secondary_summary",
    "synthetic_fixture",
}

CLAIM_STATUSES = {
    "observation",
    "hypothesis",
    "association",
    "mechanistic_claim",
    "benchmark_result",
    "prototype_requirement",
}

EVIDENCE_STRENGTHS = {"weak", "moderate", "strong"}

REQUIRED_FIELDS = {
    "packet_id",
    "domain",
    "source_status",
    "claim_status",
    "privacy_status",
    "source_refs",
    "claim_text",
    "measurable_variables",
    "missingness",
    "evidence_strength",
    "falsification_route",
    "next_executable_action",
    "advice_boundary",
    "contains_personal_data",
    "contains_cure_claim",
}


@dataclass
class NormalizedResult:
    packet_id: str
    route: str
    score: int
    source_status: str
    claim_status: str
    privacy_status: str
    evidence_strength: str
    evidence_strength_label: str
    errors: list[str]
    warnings: list[str]
    falsification_route: str
    next_executable_action: str


def _as_nonempty_list(value: Any) -> bool:
    return isinstance(value, list) and bool(value) and all(isinstance(item, str) and item.strip() for item in value)


def _as_list(value: Any) -> bool:
    return isinstance(value, list) and all(isinstance(item, str) for item in value)


def normalize_packet(packet: dict[str, Any]) -> NormalizedResult:
    errors: list[str] = []
    warnings: list[str] = []

    packet_id = str(packet.get("packet_id", "UNKNOWN"))
    missing_fields = sorted(REQUIRED_FIELDS - set(packet))
    if missing_fields:
        errors.append(f"missing required fields: {', '.join(missing_fields)}")

    domain = packet.get("domain")
    source_status = packet.get("source_status")
    claim_status = packet.get("claim_status")
    privacy_status = packet.get("privacy_status")
    evidence_strength = packet.get("evidence_strength")

    if domain not in DOMAINS:
        errors.append("invalid domain")
    if source_status not in SOURCE_STATUSES:
        errors.append("invalid source_status")
    if claim_status not in CLAIM_STATUSES:
        errors.append("invalid claim_status")
    if privacy_status != "public_safe":
        errors.append("privacy_status must be public_safe")
    if evidence_strength not in EVIDENCE_STRENGTHS:
        errors.append("invalid evidence_strength")

    if packet.get("advice_boundary") != "research_organization_only":
        errors.append("advice_boundary must be research_organization_only")
    if packet.get("contains_personal_data") is not False:
        errors.append("contains_personal_data must be false")
    if packet.get("contains_cure_claim") is not False:
        errors.append("contains_cure_claim must be false")

    if not _as_nonempty_list(packet.get("source_refs")):
        errors.append("source_refs must be a non-empty list of strings")
    if not isinstance(packet.get("claim_text"), str) or len(packet.get("claim_text", "").strip()) < 20:
        errors.append("claim_text must be a bounded explanatory string of at least 20 characters")
    if not _as_nonempty_list(packet.get("measurable_variables")):
        errors.append("measurable_variables must be a non-empty list of strings")
    if not _as_list(packet.get("missingness")):
        errors.append("missingness must be a list of strings")
    if evidence_strength == "weak" and not packet.get("missingness"):
        errors.append("weak evidence must preserve explicit missingness")
    if source_status == "preprint_caveated" and not packet.get("missingness"):
        warnings.append("preprint packet should preserve caveats in missingness")
    if source_status == "preprint_caveated" and evidence_strength == "strong":
        warnings.append("preprint marked strong; verify independent replication before promotion")

    falsification_route = packet.get("falsification_route", "")
    next_action = packet.get("next_executable_action", "")
    if not isinstance(falsification_route, str) or len(falsification_route.strip()) < 20:
        errors.append("falsification_route must be concrete and at least 20 characters")
    if not isinstance(next_action, str) or len(next_action.strip()) < 20:
        errors.append("next_executable_action must be concrete and at least 20 characters")

    score = 100
    score -= 20 * len(errors)
    score -= 5 * len(warnings)
    if evidence_strength == "weak":
        score -= 20
    elif evidence_strength == "moderate":
        score -= 5
    score = max(score, 0)

    if errors:
        route = "block"
    elif evidence_strength == "weak":
        route = "needs_replication_or_more_evidence"
    elif warnings:
        route = "review_with_caveats"
    else:
        route = "normalized_for_provenance_packet"

    strength_label = {
        "weak": "hypothesis_support_only",
        "moderate": "candidate_design_input",
        "strong": "promotion_candidate_after_external_review",
    }.get(str(evidence_strength), "invalid")

    return NormalizedResult(
        packet_id=packet_id,
        route=route,
        score=score,
        source_status=str(source_status),
        claim_status=str(claim_status),
        privacy_status=str(privacy_status),
        evidence_strength=str(evidence_strength),
        evidence_strength_label=strength_label,
        errors=errors,
        warnings=warnings,
        falsification_route=str(falsification_route),
        next_executable_action=str(next_action),
    )


def load_packets(path: Path) -> list[dict[str, Any]]:
    data = json.loads(path.read_text(encoding="utf-8"))
    if isinstance(data, dict):
        return [data]
    if isinstance(data, list) and all(isinstance(item, dict) for item in data):
        return data
    raise ValueError("input must be a packet object or list of packet objects")


def main(argv: list[str]) -> int:
    if len(argv) != 2:
        print("usage: normalize_research_claim_packets.py <packets.json>", file=sys.stderr)
        return 2

    packets = load_packets(Path(argv[1]))
    results = [normalize_packet(packet) for packet in packets]
    print(json.dumps([asdict(result) for result in results], indent=2, sort_keys=True))
    return 1 if any(result.route == "block" for result in results) else 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv))
