#!/usr/bin/env python3
"""Normalize public-safe animal-care evidence packets for Mirror Cartographer.

This executable gate separates observation, source status, privacy status,
missingness, and overclaim blockers before packets can enter longitudinal
tracking, hypothesis generation, falsification, or collaborator review.

It is not medical or veterinary advice.
"""

from __future__ import annotations

import json
import re
import sys
from pathlib import Path
from typing import Any, Dict, Iterable, List

ALLOWED_SOURCE_STATUS = {"synthetic", "public_source", "deidentified_review_note"}
ALLOWED_CLAIM_STATUS = {
    "observation_only",
    "literature_summary",
    "measurement_record",
    "review_question",
}
PUBLIC_PRIVACY_STATUS = "public_safe"

REQUIRED_FIELDS = {
    "packet_id",
    "species",
    "domain",
    "observation_text",
    "source_type",
    "source_status",
    "claim_status",
    "privacy_status",
    "timestamp",
    "measurements",
    "missingness",
    "revision_reason",
}

OVERCLAIM_PATTERN = re.compile(
    r"\b(cure|cured|guaranteed|diagnose|diagnosis is|prescribe|prescription|"
    r"treat immediately|treatment plan|emergency advice|medical advice|"
    r"veterinary advice|definitely caused|proves causality)\b",
    re.IGNORECASE,
)

IDENTIFIER_PATTERN = re.compile(
    r"(?:\b\d{3}[-.\s]?\d{2}[-.\s]?\d{4}\b)|"  # SSN-like
    r"(?:\b[\w.+-]+@[\w-]+\.[\w.-]+\b)|"  # email
    r"(?:\b\+?1?[-.\s]?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}\b)"  # phone-like
)

ROUTE_BY_CLAIM = {
    "observation_only": ["longitudinal_tracking", "source_chain_validation"],
    "measurement_record": ["longitudinal_tracking", "source_chain_validation"],
    "literature_summary": ["animal_literature_routing", "source_chain_validation"],
    "review_question": ["review_packet_indexer"],
}


def load_packets(path: Path) -> List[Dict[str, Any]]:
    try:
        data = json.loads(path.read_text(encoding="utf-8"))
    except json.JSONDecodeError as exc:
        raise SystemExit(f"Invalid JSON: {exc}") from exc
    if not isinstance(data, list):
        raise SystemExit("Input must be a JSON array of packets.")
    if not all(isinstance(item, dict) for item in data):
        raise SystemExit("Every packet must be a JSON object.")
    return data


def find_blockers(packet: Dict[str, Any]) -> List[str]:
    blockers: List[str] = []
    missing_fields = sorted(REQUIRED_FIELDS - set(packet))
    if missing_fields:
        blockers.append("missing_required_fields:" + ",".join(missing_fields))

    text = str(packet.get("observation_text", ""))
    revision_reason = str(packet.get("revision_reason", ""))
    combined_text = f"{text}\n{revision_reason}"

    if packet.get("privacy_status") != PUBLIC_PRIVACY_STATUS:
        blockers.append("privacy_not_public_safe")
    if packet.get("source_status") not in ALLOWED_SOURCE_STATUS:
        blockers.append("source_status_not_allowed")
    if packet.get("claim_status") not in ALLOWED_CLAIM_STATUS:
        blockers.append("claim_status_not_allowed")
    if not isinstance(packet.get("missingness"), list):
        blockers.append("missingness_array_required")
    elif len(packet.get("missingness", [])) == 0:
        blockers.append("missingness_must_be_explicit")
    if not isinstance(packet.get("measurements"), list):
        blockers.append("measurements_array_required")
    if OVERCLAIM_PATTERN.search(combined_text):
        blockers.append("overclaim_or_advice_language_detected")
    if IDENTIFIER_PATTERN.search(combined_text):
        blockers.append("identifier_residue_detected")

    return blockers


def normalize_packet(packet: Dict[str, Any]) -> Dict[str, Any]:
    blockers = find_blockers(packet)
    claim_status = packet.get("claim_status", "unknown")
    accepted = not blockers
    route = ROUTE_BY_CLAIM.get(claim_status, []) if accepted else ["blocked_review"]

    return {
        "packet_id": packet.get("packet_id", "missing_packet_id"),
        "species": packet.get("species", "unknown"),
        "domain": packet.get("domain", "unknown"),
        "normalized_status": "accepted_for_review" if accepted else "blocked",
        "routing": route,
        "blocked_reasons": blockers,
        "evidence_boundary": claim_status if accepted else "blocked_boundary_violation",
        "measurement_count": len(packet.get("measurements", [])) if isinstance(packet.get("measurements"), list) else 0,
        "labels": {
            "source_status": packet.get("source_status", "missing"),
            "claim_status": packet.get("claim_status", "missing"),
            "privacy_status": packet.get("privacy_status", "missing"),
            "missingness": packet.get("missingness", "missing"),
            "revision_reason": packet.get("revision_reason", "missing"),
            "implementation_status": "executable_cli",
            "testability": "unit_tests_and_fixture",
        },
    }


def normalize_packets(packets: Iterable[Dict[str, Any]]) -> Dict[str, Any]:
    normalized = [normalize_packet(packet) for packet in packets]
    return {
        "component": "animal_care_evidence_normalizer",
        "claim_notice": "Normalization only; not medical or veterinary advice.",
        "summary": {
            "total_packets": len(normalized),
            "accepted_for_review": sum(1 for item in normalized if item["normalized_status"] == "accepted_for_review"),
            "blocked": sum(1 for item in normalized if item["normalized_status"] == "blocked"),
        },
        "normalized_packets": normalized,
    }


def main(argv: List[str]) -> int:
    if len(argv) != 2:
        print("Usage: normalize_animal_care_evidence.py <packets.json>", file=sys.stderr)
        return 2
    packets = load_packets(Path(argv[1]))
    print(json.dumps(normalize_packets(packets), indent=2, sort_keys=True))
    return 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv))
