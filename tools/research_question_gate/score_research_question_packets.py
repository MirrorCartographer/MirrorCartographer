#!/usr/bin/env python3
"""Score Mirror Cartographer research-question packets.

This gate keeps longitudinal or symbolic observations in a research-organization lane.
It does not provide medical, veterinary, legal, or personal advice. It classifies
packets as:

- accept_research_question: bounded, public-safe, measurable, falsifiable.
- needs_revision: useful structure exists but missingness prevents promotion.
- reject_boundary_violation: private, advice-like, untestable, or unsupported.
"""

from __future__ import annotations

import json
import sys
from pathlib import Path
from typing import Any, Dict, List, Tuple

REQUIRED_FIELDS = {
    "packet_id",
    "source_status",
    "claim_status",
    "privacy_status",
    "missingness",
    "revision_reason",
    "implementation_status",
    "testability",
    "falsification_route",
    "measurable_variables",
    "phenomenon_summary",
    "candidate_research_question",
    "boundary_statement",
    "next_executable_action",
}

ADVICE_TERMS = {
    "diagnose",
    "diagnosis",
    "treat",
    "treatment",
    "cure",
    "prescribe",
    "dose",
    "dosage",
    "should take",
    "must take",
    "veterinary advice",
    "medical advice",
}

ACCEPTABLE_PRIVACY = {"public_safe", "deidentified"}
ACCEPTABLE_SOURCE = {"synthetic", "public_source", "deidentified_longitudinal", "mixed_public_synthetic"}


def load_packets(path: Path) -> List[Dict[str, Any]]:
    data = json.loads(path.read_text(encoding="utf-8"))
    if not isinstance(data, list):
        raise ValueError("Input must be a JSON array of packet objects.")
    return data


def contains_advice_like_language(packet: Dict[str, Any]) -> bool:
    searchable = " ".join(
        str(packet.get(field, ""))
        for field in [
            "phenomenon_summary",
            "candidate_research_question",
            "boundary_statement",
            "falsification_route",
            "next_executable_action",
        ]
    ).lower()
    return any(term in searchable for term in ADVICE_TERMS)


def validate_shape(packet: Dict[str, Any]) -> List[str]:
    errors: List[str] = []
    missing = sorted(REQUIRED_FIELDS - set(packet))
    if missing:
        errors.append(f"missing required fields: {', '.join(missing)}")

    if packet.get("source_status") not in ACCEPTABLE_SOURCE:
        errors.append("invalid source_status")

    if packet.get("privacy_status") not in {"public_safe", "deidentified", "requires_partition", "reject_private_detail"}:
        errors.append("invalid privacy_status")

    variables = packet.get("measurable_variables")
    if not isinstance(variables, list) or not variables:
        errors.append("measurable_variables must be a non-empty list")
    else:
        for index, variable in enumerate(variables):
            if not isinstance(variable, dict):
                errors.append(f"variable {index} must be an object")
                continue
            for field in ["name", "operational_definition", "measurement_method", "expected_direction"]:
                if not variable.get(field):
                    errors.append(f"variable {index} missing {field}")

    return errors


def classify_packet(packet: Dict[str, Any]) -> Tuple[str, List[str]]:
    reasons: List[str] = []
    shape_errors = validate_shape(packet)
    if shape_errors:
        return "reject_boundary_violation", shape_errors

    if packet["privacy_status"] not in ACCEPTABLE_PRIVACY:
        reasons.append("privacy status blocks public discovery memory")

    if contains_advice_like_language(packet):
        reasons.append("advice-like language detected")

    if packet["claim_status"] in {"unsupported", "contradicted"}:
        reasons.append("claim status cannot be promoted")

    if packet["testability"] in {"not_testable", "not_testable_yet"}:
        reasons.append("packet is not testable enough for promotion")

    if reasons:
        return "reject_boundary_violation", reasons

    if packet.get("missingness"):
        return "needs_revision", list(packet["missingness"])

    if packet["testability"] == "measurable_now" and packet["claim_status"] == "research_question":
        return "accept_research_question", ["bounded, measurable, falsifiable, and public-safe"]

    return "needs_revision", ["packet is valid shape but not ready for promotion"]


def main(argv: List[str]) -> int:
    if len(argv) != 2:
        print("Usage: score_research_question_packets.py <packets.json>", file=sys.stderr)
        return 2

    packets = load_packets(Path(argv[1]))
    results = []
    exit_code = 0
    for packet in packets:
        classification, reasons = classify_packet(packet)
        if classification == "reject_boundary_violation":
            exit_code = 1
        results.append(
            {
                "packet_id": packet.get("packet_id", "<missing>"),
                "classification": classification,
                "reasons": reasons,
            }
        )

    print(json.dumps(results, indent=2, sort_keys=True))
    return exit_code


if __name__ == "__main__":
    raise SystemExit(main(sys.argv))
