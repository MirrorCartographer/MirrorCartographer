#!/usr/bin/env python3
"""Score public-safe Mirror Cartographer discovery packets for verifiability.

This gate does not decide truth. It decides whether a packet is ready to enter
research memory as a verifiable discovery object, must be partitioned for
privacy, should wait for more evidence, is overclaimed, or must be rejected.
"""
from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path
from typing import Any, Dict, Iterable, List

VALID_SOURCE_STATUS = {"primary", "preprint", "secondary", "institutional", "synthetic", "private_observation"}
VALID_PRIVACY_STATUS = {"public_safe", "deidentified", "contains_private_details", "unknown"}
VALID_EVIDENCE_STRENGTH = {"low", "moderate", "high", "unknown"}
OVERCLAIM_TERMS = {"cure", "proves", "guarantees", "miracle", "definitive", "certain"}


def _as_list(value: Any) -> List[Any]:
    return value if isinstance(value, list) else []


def classify_packet(packet: Dict[str, Any]) -> Dict[str, Any]:
    reasons: List[str] = []
    summary = str(packet.get("summary", "")).lower()
    source_status = packet.get("source_status", "unknown")
    privacy_status = packet.get("privacy_status", "unknown")
    evidence_strength = packet.get("evidence_strength", "unknown")
    variables = _as_list(packet.get("measurable_variables"))
    routes = _as_list(packet.get("verification_routes"))
    missingness = _as_list(packet.get("known_missingness"))

    if privacy_status in {"contains_private_details", "unknown"}:
        return {
            "id": packet.get("id", "unknown"),
            "classification": "requires_privacy_partition" if privacy_status == "contains_private_details" else "reject_for_memory",
            "reasons": ["privacy boundary is not public-safe"],
        }

    if source_status not in VALID_SOURCE_STATUS or evidence_strength not in VALID_EVIDENCE_STRENGTH:
        reasons.append("invalid or unknown source/evidence status")
    if not variables:
        reasons.append("missing measurable variables")
    if not routes:
        reasons.append("missing verification route")
    if packet.get("claim_status") in {"unknown", None, ""}:
        reasons.append("missing claim status")

    if reasons:
        if not routes and variables and missingness:
            return {"id": packet.get("id", "unknown"), "classification": "non_verifiable_yet", "reasons": reasons}
        return {"id": packet.get("id", "unknown"), "classification": "reject_for_memory", "reasons": reasons}

    overclaim = packet.get("claim_status") == "overclaimed" or any(term in summary for term in OVERCLAIM_TERMS)
    if overclaim and evidence_strength in {"low", "moderate"}:
        return {
            "id": packet.get("id", "unknown"),
            "classification": "overclaimed",
            "reasons": ["claim language exceeds present evidence strength"],
        }

    return {
        "id": packet.get("id", "unknown"),
        "classification": "verifiable_now",
        "reasons": ["public-safe, sourced, measurable, and has verification route"],
    }


def score_packets(packets: Iterable[Dict[str, Any]]) -> List[Dict[str, Any]]:
    return [classify_packet(packet) for packet in packets]


def main() -> int:
    parser = argparse.ArgumentParser(description="Classify MC discovery packets by verifiability readiness.")
    parser.add_argument("input", type=Path, help="JSON file containing one packet or a list of packets")
    parser.add_argument("--strict-fixtures", action="store_true", help="Fail if expected_classification does not match output")
    args = parser.parse_args()

    data = json.loads(args.input.read_text(encoding="utf-8"))
    packets = data if isinstance(data, list) else [data]
    results = score_packets(packets)
    print(json.dumps(results, indent=2, sort_keys=True))

    if args.strict_fixtures:
        expected = [packet.get("expected_classification") for packet in packets]
        actual = [result["classification"] for result in results]
        if expected != actual:
            print(f"Expected {expected}, got {actual}", file=sys.stderr)
            return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
