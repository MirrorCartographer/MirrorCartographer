#!/usr/bin/env python3
"""Route Mirror Cartographer hypothesis packets into falsification queues.

Public-safe research organization only. This script does not provide medical or
veterinary advice; it checks whether a hypothesis packet is bounded, measurable,
source-aware, privacy-safe, and falsifiable enough to become a test-plan input.
"""

from __future__ import annotations

import argparse
import json
import re
import sys
from pathlib import Path
from typing import Any, Dict, Iterable, List, Tuple

READY = "ready_for_test_plan"
NEEDS_OPERATIONALIZATION = "needs_operationalization"
NEEDS_EVIDENCE = "needs_evidence"
PRIVACY_HOLD = "privacy_hold"
REJECT_OVERCLAIM = "reject_overclaim"

ALLOWED_DOMAINS = {
    "mechanistic_biology",
    "neuroscience",
    "medical_ai",
    "animal_health_research",
    "longitudinal_health",
    "hci",
    "privacy_preserving_memory",
    "scientific_ai",
}

ALLOWED_CLAIM_STATUS = {
    "hypothesis",
    "preliminary",
    "replicated",
    "contradicted",
    "overclaim",
}

ALLOWED_SOURCE_STATUS = {
    "primary_source",
    "preprint",
    "benchmark",
    "dataset",
    "institution",
    "synthetic_fixture",
    "unsourced",
}

ALLOWED_PRIVACY_STATUS = {
    "public_safe",
    "deidentified",
    "private_or_raw",
}

OVERCLAIM_PATTERN = re.compile(
    r"\b(cure|cures|guarantee|guaranteed|proves|proven|always|never|definitely|certainly|fixes|heals)\b",
    re.IGNORECASE,
)

REQUIRED_TEXT_FIELDS = [
    "id",
    "domain",
    "hypothesis",
    "claim_status",
    "source_status",
    "privacy_status",
    "measurement_plan",
    "falsification_route",
    "comparison_design",
    "next_executable_action",
]


def _nonempty_string(value: Any) -> bool:
    return isinstance(value, str) and bool(value.strip())


def _nonempty_list(value: Any) -> bool:
    return isinstance(value, list) and any(str(item).strip() for item in value)


def validate_shape(packet: Dict[str, Any]) -> List[str]:
    """Return structural validation errors for a packet."""
    errors: List[str] = []
    for field in REQUIRED_TEXT_FIELDS:
        if not _nonempty_string(packet.get(field)):
            errors.append(f"missing_or_empty:{field}")

    if packet.get("domain") not in ALLOWED_DOMAINS:
        errors.append("invalid_domain")
    if packet.get("claim_status") not in ALLOWED_CLAIM_STATUS:
        errors.append("invalid_claim_status")
    if packet.get("source_status") not in ALLOWED_SOURCE_STATUS:
        errors.append("invalid_source_status")
    if packet.get("privacy_status") not in ALLOWED_PRIVACY_STATUS:
        errors.append("invalid_privacy_status")

    for list_field in ["variables", "evidence_refs", "missingness"]:
        if list_field not in packet or not isinstance(packet.get(list_field), list):
            errors.append(f"missing_or_invalid_list:{list_field}")

    return errors


def score_packet(packet: Dict[str, Any]) -> Tuple[int, List[str], List[str]]:
    """Return score, positive reasons, and blocker reasons."""
    score = 0
    reasons: List[str] = []
    blockers: List[str] = []

    shape_errors = validate_shape(packet)
    if shape_errors:
        blockers.extend(shape_errors)

    hypothesis = str(packet.get("hypothesis", ""))
    if packet.get("claim_status") == "overclaim" or OVERCLAIM_PATTERN.search(hypothesis):
        blockers.append("overclaim_or_certainty_language")
    if packet.get("privacy_status") == "private_or_raw":
        blockers.append("privacy_boundary_violation")
    if packet.get("source_status") == "unsourced" or not _nonempty_list(packet.get("evidence_refs")):
        blockers.append("missing_evidence_refs")

    if _nonempty_list(packet.get("variables")):
        score += 2
        reasons.append("has_variables")
    else:
        blockers.append("missing_variables")

    if _nonempty_string(packet.get("measurement_plan")):
        score += 2
        reasons.append("has_measurement_plan")
    else:
        blockers.append("missing_measurement_plan")

    if _nonempty_string(packet.get("falsification_route")):
        score += 3
        reasons.append("has_falsification_route")
    else:
        blockers.append("missing_falsification_route")

    if _nonempty_string(packet.get("comparison_design")):
        score += 1
        reasons.append("has_comparison_design")
    else:
        blockers.append("missing_comparison_design")

    if _nonempty_list(packet.get("evidence_refs")) and packet.get("source_status") != "unsourced":
        score += 1
        reasons.append("has_source_mapping")

    if packet.get("privacy_status") in {"public_safe", "deidentified"}:
        score += 1
        reasons.append("privacy_boundary_ok")

    return score, reasons, blockers


def route_packet(packet: Dict[str, Any]) -> Dict[str, Any]:
    score, reasons, blockers = score_packet(packet)

    if "privacy_boundary_violation" in blockers:
        route = PRIVACY_HOLD
    elif "overclaim_or_certainty_language" in blockers:
        route = REJECT_OVERCLAIM
    elif any(
        blocker in blockers
        for blocker in ["missing_variables", "missing_measurement_plan", "missing_falsification_route", "missing_comparison_design"]
    ):
        route = NEEDS_OPERATIONALIZATION
    elif "missing_evidence_refs" in blockers:
        route = NEEDS_EVIDENCE
    elif score >= 9:
        route = READY
    else:
        route = NEEDS_OPERATIONALIZATION

    return {
        "id": packet.get("id", "<missing-id>"),
        "route": route,
        "score": score,
        "reasons": sorted(set(reasons)),
        "blockers": sorted(set(blockers)),
        "next_executable_action": packet.get("next_executable_action", "Add a concrete next executable action."),
    }


def route_packets(packets: Iterable[Dict[str, Any]]) -> Dict[str, Any]:
    results = [route_packet(packet) for packet in packets]
    summary = {route: 0 for route in [READY, NEEDS_OPERATIONALIZATION, NEEDS_EVIDENCE, PRIVACY_HOLD, REJECT_OVERCLAIM]}
    for result in results:
        summary[result["route"]] = summary.get(result["route"], 0) + 1
    return {"summary": summary, "results": results}


def load_packets(path: Path) -> List[Dict[str, Any]]:
    with path.open("r", encoding="utf-8") as handle:
        data = json.load(handle)
    if not isinstance(data, list):
        raise ValueError("Input JSON must be an array of hypothesis packets.")
    if not all(isinstance(item, dict) for item in data):
        raise ValueError("Every hypothesis packet must be a JSON object.")
    return data


def main(argv: List[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description="Route MC hypothesis packets into falsification queues.")
    parser.add_argument("input_json", type=Path, help="Path to JSON array of hypothesis packets.")
    parser.add_argument("--pretty", action="store_true", help="Pretty-print JSON output.")
    args = parser.parse_args(argv)

    try:
        packets = load_packets(args.input_json)
        output = route_packets(packets)
    except Exception as exc:  # noqa: BLE001 - CLI should return a readable failure.
        print(json.dumps({"error": str(exc)}), file=sys.stderr)
        return 2

    print(json.dumps(output, indent=2 if args.pretty else None, sort_keys=True))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
