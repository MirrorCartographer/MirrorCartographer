#!/usr/bin/env python3
"""Map public-safe literature notes into bounded evidence queues.

Mirror Cartographer executable component.
This is research organization infrastructure, not medical or veterinary advice.
"""

from __future__ import annotations

import json
import re
import sys
from pathlib import Path
from typing import Any, Dict, List, Tuple

ALLOWED_SOURCE_STATUS = {"public_literature", "synthetic_fixture", "repo_internal_note"}
ALLOWED_PRIVACY_STATUS = {"public_safe", "synthetic_public_safe"}
ALLOWED_CLAIM_TYPE = {"mechanism", "association", "intervention", "observation", "diagnostic_boundary"}
ALLOWED_ORGANISM_SCOPE = {"human", "dog", "cat", "multi_species", "general_biology"}
ALLOWED_EVIDENCE_LEVEL = {
    "review",
    "trial",
    "cohort",
    "case_series",
    "case_report",
    "mechanistic_model",
    "unknown",
}

PRIVATE_PATTERNS = [
    re.compile(r"\b\d{4}-\d{2}-\d{2}\b"),
    re.compile(r"\b\d{1,2}:\d{2}\s?(?:am|pm)?\b", re.I),
    re.compile(r"raw transcript", re.I),
    re.compile(r"private timeline", re.I),
    re.compile(r"exact timestamp", re.I),
]

OVERCLAIM_PATTERNS = [
    re.compile(r"\bcure[sd]?\b", re.I),
    re.compile(r"\bproves?\b", re.I),
    re.compile(r"\bshould be used\b", re.I),
    re.compile(r"\bguarantee[sd]?\b", re.I),
    re.compile(r"\bimmediately\b", re.I),
]

ADVICE_PATTERNS = [
    re.compile(r"\btell (?:owners|patients|people) to\b", re.I),
    re.compile(r"\bprescribe\b", re.I),
    re.compile(r"\btake \d", re.I),
    re.compile(r"\buse it\b", re.I),
]

REQUIRED_FIELDS = [
    "id",
    "source_status",
    "privacy_status",
    "claim_text",
    "claim_type",
    "organism_scope",
    "evidence_level",
    "variables",
    "boundary_notes",
    "contradiction_notes",
    "falsification_route",
    "next_action",
]


def packet_text(packet: Dict[str, Any]) -> str:
    return "\n".join(str(packet.get(field, "")) for field in REQUIRED_FIELDS)


def validate_packet(packet: Dict[str, Any]) -> Tuple[str, List[str]]:
    reasons: List[str] = []

    for field in REQUIRED_FIELDS:
        if field not in packet:
            reasons.append(f"missing:{field}")

    if reasons:
        return "needs_normalization", reasons

    if packet["source_status"] not in ALLOWED_SOURCE_STATUS:
        reasons.append("invalid_source_status")
    if packet["privacy_status"] not in ALLOWED_PRIVACY_STATUS:
        reasons.append("blocked_privacy_status")
    if packet["claim_type"] not in ALLOWED_CLAIM_TYPE:
        reasons.append("invalid_claim_type")
    if packet["organism_scope"] not in ALLOWED_ORGANISM_SCOPE:
        reasons.append("invalid_organism_scope")
    if packet["evidence_level"] not in ALLOWED_EVIDENCE_LEVEL:
        reasons.append("invalid_evidence_level")

    variables = packet.get("variables")
    if not isinstance(variables, list) or not variables or not all(isinstance(v, str) and v.strip() for v in variables):
        reasons.append("missing_measurable_variables")

    if not str(packet.get("boundary_notes", "")).strip():
        reasons.append("missing_boundary_notes")
    if not str(packet.get("falsification_route", "")).strip():
        reasons.append("missing_falsification_route")
    if not str(packet.get("next_action", "")).strip():
        reasons.append("missing_next_action")

    text = packet_text(packet)
    if packet.get("privacy_status") not in ALLOWED_PRIVACY_STATUS or any(p.search(text) for p in PRIVATE_PATTERNS):
        reasons.append("blocked_privacy")
    if any(p.search(text) for p in OVERCLAIM_PATTERNS):
        reasons.append("blocked_overclaim")
    if any(p.search(text) for p in ADVICE_PATTERNS):
        reasons.append("blocked_advice_leakage")

    if any(r.startswith("blocked_privacy") for r in reasons):
        return "blocked_privacy", reasons
    if "blocked_overclaim" in reasons or "blocked_advice_leakage" in reasons:
        return "blocked_overclaim", reasons
    if any(r.startswith("invalid_") or r.startswith("missing:") for r in reasons):
        return "needs_normalization", reasons
    if "missing_measurable_variables" in reasons or "missing_boundary_notes" in reasons:
        return "needs_normalization", reasons
    if "missing_falsification_route" in reasons:
        return "needs_falsification", reasons
    if packet.get("evidence_level") == "unknown" or not str(packet.get("contradiction_notes", "")).strip():
        return "needs_falsification", reasons or ["insufficient_contradiction_mapping"]

    return "map_ready", []


def map_packets(packets: List[Dict[str, Any]]) -> Dict[str, Any]:
    queues: Dict[str, List[Dict[str, Any]]] = {
        "map_ready": [],
        "needs_normalization": [],
        "needs_falsification": [],
        "blocked_privacy": [],
        "blocked_overclaim": [],
    }

    for packet in packets:
        route, reasons = validate_packet(packet)
        entry = {
            "id": packet.get("id", "missing-id"),
            "route": route,
            "reasons": reasons,
            "claim_type": packet.get("claim_type"),
            "organism_scope": packet.get("organism_scope"),
            "evidence_level": packet.get("evidence_level"),
            "variables": packet.get("variables", []),
            "next_action": packet.get("next_action", ""),
        }
        queues[route].append(entry)

    return {
        "component": "literature_evidence_mapper",
        "claim_status": "research_organization_only_not_medical_or_veterinary_advice",
        "accepted_count": len(queues["map_ready"]),
        "rejected_count": len(queues["blocked_privacy"]) + len(queues["blocked_overclaim"]),
        "queues": queues,
    }


def main(argv: List[str]) -> int:
    if len(argv) != 2:
        print("usage: map_literature_evidence.py <packets.json>", file=sys.stderr)
        return 2

    path = Path(argv[1])
    packets = json.loads(path.read_text(encoding="utf-8"))
    if not isinstance(packets, list):
        print("input must be a JSON list of packets", file=sys.stderr)
        return 2

    result = map_packets(packets)
    print(json.dumps(result, indent=2, sort_keys=True))
    return 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv))
