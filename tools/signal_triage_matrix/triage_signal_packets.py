#!/usr/bin/env python3
"""Mirror Cartographer Signal Triage Matrix.

Public-safe CLI for routing candidate signals before hypothesis promotion.
It is intentionally conservative: observations remain observations unless they
carry enough variables, evidence references, missingness, and falsification logic.
"""

from __future__ import annotations

import json
import re
import sys
from pathlib import Path
from typing import Any, Dict, List, Tuple

ALLOWED_DOMAINS = {
    "longitudinal_pattern_tracking",
    "evidence_boundary_routing",
    "hypothesis_generation",
    "falsification",
    "medical_scientific_literature_organization",
    "animal_care_evidence_organization",
    "privacy_preserving_research_memory",
    "collaboration_readiness",
}

ALLOWED_PRIVACY = {"public_safe", "public_safe_synthetic", "synthetic_only"}
ALLOWED_ROUTES = {
    "hold_for_controls",
    "route_to_animal_evidence_router",
    "route_to_literature_mapper",
    "route_to_falsification_runner",
    "export_as_uncertainty_only",
    "block_promotion",
    "candidate_for_hypothesis_generation",
}

FORBIDDEN_PHRASES = [
    r"\bcures?\b",
    r"\bguarantee(?:d|s)?\b",
    r"\bdiagnose(?:s|d)?\b",
    r"\btreat(?:s|ed|ment)?\b",
    r"\bshould take\b",
    r"\bmedical advice\b",
    r"\bveterinary advice\b",
    r"\bproves?\b",
]

REQUIRED_FIELDS = [
    "packet_id",
    "domain",
    "signal_label",
    "observation_summary",
    "source_status",
    "claim_status",
    "privacy_status",
    "missingness",
    "variables",
    "evidence_refs",
    "risk_of_false_pattern",
    "triage_route",
    "falsification_route",
    "next_executable_action",
]


def _contains_forbidden_language(packet: Dict[str, Any]) -> List[str]:
    text = json.dumps(packet, sort_keys=True).lower()
    hits: List[str] = []
    for pattern in FORBIDDEN_PHRASES:
        if re.search(pattern, text):
            hits.append(pattern)
    return hits


def validate_packet(packet: Dict[str, Any]) -> Tuple[bool, List[str]]:
    errors: List[str] = []

    for field in REQUIRED_FIELDS:
        if field not in packet:
            errors.append(f"missing required field: {field}")

    if errors:
        return False, errors

    if packet["domain"] not in ALLOWED_DOMAINS:
        errors.append(f"domain not allowed: {packet['domain']}")

    if packet["privacy_status"] not in ALLOWED_PRIVACY:
        errors.append(f"privacy_status not public-safe: {packet['privacy_status']}")

    if packet["triage_route"] not in ALLOWED_ROUTES:
        errors.append(f"triage_route not allowed: {packet['triage_route']}")

    if not isinstance(packet["missingness"], list) or len(packet["missingness"]) < 1:
        errors.append("missingness must contain at least one unresolved item")

    if not isinstance(packet["variables"], list) or len(packet["variables"]) < 2:
        errors.append("variables must contain at least two measurable variables")

    if not isinstance(packet["evidence_refs"], list) or len(packet["evidence_refs"]) < 1:
        errors.append("evidence_refs must contain at least one reference")

    if len(str(packet["observation_summary"]).strip()) < 40:
        errors.append("observation_summary must be specific enough for review")

    if len(str(packet["falsification_route"]).strip()) < 30:
        errors.append("falsification_route must describe a real disconfirmation path")

    if len(str(packet["next_executable_action"]).strip()) < 20:
        errors.append("next_executable_action must be implementation-ready")

    forbidden = _contains_forbidden_language(packet)
    if forbidden:
        errors.append("forbidden certainty/advice language found: " + ", ".join(forbidden))

    return len(errors) == 0, errors


def load_packets(path: Path) -> List[Dict[str, Any]]:
    payload = json.loads(path.read_text(encoding="utf-8"))
    if isinstance(payload, dict) and "packets" in payload:
        packets = payload["packets"]
    else:
        packets = payload
    if not isinstance(packets, list):
        raise ValueError("Input must be a JSON list or an object with a packets list.")
    return packets


def main(argv: List[str]) -> int:
    if len(argv) != 2:
        print("Usage: python triage_signal_packets.py <packets.json>", file=sys.stderr)
        return 2

    packets = load_packets(Path(argv[1]))
    results = []
    route_counts: Dict[str, int] = {}
    failed = 0

    for packet in packets:
        ok, errors = validate_packet(packet)
        route = packet.get("triage_route", "invalid")
        route_counts[route] = route_counts.get(route, 0) + 1
        if not ok:
            failed += 1
        results.append({
            "packet_id": packet.get("packet_id", "<missing>"),
            "valid": ok,
            "triage_route": route,
            "errors": errors,
        })

    summary = {
        "component": "signal_triage_matrix",
        "total_packets": len(packets),
        "valid_packets": len(packets) - failed,
        "invalid_packets": failed,
        "route_counts": route_counts,
        "results": results,
    }
    print(json.dumps(summary, indent=2, sort_keys=True))
    return 1 if failed else 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv))
