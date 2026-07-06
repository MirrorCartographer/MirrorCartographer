#!/usr/bin/env python3
"""Route public-safe animal-care research packets.

This is a research-organization component for Mirror Cartographer. It does not
provide medical or veterinary advice. It sorts deidentified/synthetic packets into
workflow queues based on privacy, evidence, claim boundary, and testability.
"""

from __future__ import annotations

import json
import sys
from dataclasses import dataclass
from pathlib import Path
from typing import Any

ALLOWED_SPECIES = {"dog", "cat", "multi_species", "unknown"}
ALLOWED_CLAIM_STATUS = {
    "hypothesis",
    "association",
    "background",
    "protocol_candidate",
    "needs_review",
}
ALLOWED_SOURCE_STATUS = {
    "primary_source",
    "clinical_institution",
    "review",
    "preprint",
    "synthetic_fixture",
    "unknown",
}
ALLOWED_PRIVACY_STATUS = {"public_safe", "synthetic", "deidentified", "private_risk"}
PRIVACY_BLOCK_FLAGS = {"private_identifier", "exact_timestamp", "raw_transcript", "location_detail"}
OVERCLAIM_FLAGS = {"diagnosis", "cure_claim"}
CLINICAL_REVIEW_FLAGS = {"treatment_instruction"}

REQUIRED_FIELDS = {
    "packet_id",
    "species_scope",
    "research_question",
    "claim_text",
    "claim_status",
    "source_status",
    "evidence_refs",
    "measurable_variables",
    "missingness",
    "privacy_status",
    "forbidden_content_flags",
    "next_executable_action",
}


@dataclass(frozen=True)
class RouteResult:
    packet_id: str
    route: str
    reasons: list[str]
    evidence_strength: str
    testability: str


def _as_nonempty_string(value: Any) -> bool:
    return isinstance(value, str) and bool(value.strip())


def _as_string_list(value: Any) -> bool:
    return isinstance(value, list) and all(isinstance(item, str) and item.strip() for item in value)


def validate_shape(packet: dict[str, Any]) -> list[str]:
    errors: list[str] = []
    missing = sorted(REQUIRED_FIELDS - packet.keys())
    if missing:
        errors.append("missing required fields: " + ", ".join(missing))
        return errors

    for key in ["packet_id", "species_scope", "research_question", "claim_text", "claim_status", "source_status", "privacy_status", "next_executable_action"]:
        if not _as_nonempty_string(packet.get(key)):
            errors.append(f"{key} must be a nonempty string")

    if packet.get("species_scope") not in ALLOWED_SPECIES:
        errors.append("species_scope is not allowed")
    if packet.get("claim_status") not in ALLOWED_CLAIM_STATUS:
        errors.append("claim_status is not allowed")
    if packet.get("source_status") not in ALLOWED_SOURCE_STATUS:
        errors.append("source_status is not allowed")
    if packet.get("privacy_status") not in ALLOWED_PRIVACY_STATUS:
        errors.append("privacy_status is not allowed")

    for key in ["evidence_refs", "measurable_variables", "missingness", "forbidden_content_flags"]:
        if not _as_string_list(packet.get(key)):
            errors.append(f"{key} must be a list of nonempty strings")

    return errors


def route_packet(packet: dict[str, Any]) -> RouteResult:
    packet_id = str(packet.get("packet_id", "<missing>"))
    shape_errors = validate_shape(packet)
    if shape_errors:
        return RouteResult(packet_id, "invalid_packet", shape_errors, "none", "not_testable")

    flags = set(packet["forbidden_content_flags"])
    evidence_refs = packet["evidence_refs"]
    variables = packet["measurable_variables"]
    source_status = packet["source_status"]
    privacy_status = packet["privacy_status"]

    if privacy_status == "private_risk" or flags & PRIVACY_BLOCK_FLAGS:
        return RouteResult(packet_id, "privacy_block", ["private residue or direct identifier risk"], "not_assessed", "blocked")

    if flags & OVERCLAIM_FLAGS:
        return RouteResult(packet_id, "reject_overclaim", ["diagnosis/cure certainty boundary exceeded"], "insufficient", "falsification_required")

    if flags & CLINICAL_REVIEW_FLAGS:
        return RouteResult(packet_id, "needs_veterinary_review", ["clinical action language requires veterinary-review boundary"], "bounded", "review_required")

    if len(evidence_refs) < 1 or source_status == "unknown" or len(variables) < 3:
        return RouteResult(packet_id, "needs_more_evidence", ["minimum source and variable support not met"], "weak", "partially_testable")

    return RouteResult(packet_id, "organize_evidence", ["public-safe bounded research packet"], "moderate", "testable")


def route_packets(packets: list[dict[str, Any]]) -> list[dict[str, Any]]:
    results = []
    for packet in packets:
        routed = route_packet(packet)
        results.append(
            {
                "packet_id": routed.packet_id,
                "route": routed.route,
                "reasons": routed.reasons,
                "evidence_strength": routed.evidence_strength,
                "testability": routed.testability,
            }
        )
    return results


def main(argv: list[str]) -> int:
    if len(argv) != 2:
        print("usage: route_animal_evidence_packets.py <packets.json>", file=sys.stderr)
        return 2

    path = Path(argv[1])
    packets = json.loads(path.read_text(encoding="utf-8"))
    if not isinstance(packets, list):
        print("input must be a JSON list of packet objects", file=sys.stderr)
        return 2

    results = route_packets(packets)
    print(json.dumps(results, indent=2, sort_keys=True))
    return 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv))
