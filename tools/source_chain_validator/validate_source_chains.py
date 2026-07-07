#!/usr/bin/env python3
"""
Mirror Cartographer source-chain validator.

Validates whether packets have enough source structure to move into
hypothesis generation, falsification, review, or collaborator export.

Public-safe: this script performs routing only. It does not provide
medical or veterinary advice.
"""

from __future__ import annotations

import argparse
import json
import sys
from typing import Any, Dict, Iterable, List, Tuple

REQUIRED_TOP_LEVEL = {
    "packet_id",
    "domain",
    "claim_status",
    "privacy_status",
    "source_status",
    "sources",
    "claims",
    "missingness",
}

BLOCKING_PRIVACY_STATUSES = {"private", "unknown"}
BLOCKING_CLAIM_TYPES = {"recommendation", "cure_claim"}
REVIEW_SOURCE_STATUSES = {"unknown", "unverified"}


def _as_list(value: Any) -> List[Any]:
    return value if isinstance(value, list) else []


def validate_packet(packet: Dict[str, Any]) -> Dict[str, Any]:
    """Return route, reasons, missingness, and next action for one packet."""
    reasons: List[str] = []
    route = "pass"

    missing_fields = sorted(REQUIRED_TOP_LEVEL - set(packet.keys()))
    if missing_fields:
        return {
            "packet_id": packet.get("packet_id", "UNKNOWN_PACKET"),
            "route": "block",
            "reasons": [f"missing_required_field:{field}" for field in missing_fields],
            "missingness": missing_fields,
            "next_executable_action": "repair_packet_schema_before_reuse",
        }

    missingness = _as_list(packet.get("missingness"))
    sources = _as_list(packet.get("sources"))
    claims = _as_list(packet.get("claims"))

    if packet.get("privacy_status") in BLOCKING_PRIVACY_STATUSES:
        reasons.append(f"blocking_privacy_status:{packet.get('privacy_status')}")
        route = "block"

    if not sources:
        reasons.append("no_sources")
        route = max_route(route, "review")

    if not claims:
        reasons.append("no_claims")
        route = max_route(route, "review")

    if missingness:
        reasons.append("explicit_missingness_present")
        route = max_route(route, "review")

    if packet.get("source_status") in REVIEW_SOURCE_STATUSES:
        reasons.append(f"review_source_status:{packet.get('source_status')}")
        route = max_route(route, "review")

    source_ids = set()
    for source in sources:
        source_id = source.get("source_id") if isinstance(source, dict) else None
        if source_id:
            source_ids.add(source_id)
        else:
            reasons.append("source_missing_source_id")
            route = max_route(route, "review")

        if isinstance(source, dict) and not source.get("citation"):
            reasons.append(f"source_missing_citation:{source_id or 'UNKNOWN_SOURCE'}")
            route = max_route(route, "review")

        if isinstance(source, dict) and not source.get("limitations"):
            reasons.append(f"source_missing_limitations:{source_id or 'UNKNOWN_SOURCE'}")
            route = max_route(route, "review")

    for claim in claims:
        if not isinstance(claim, dict):
            reasons.append("malformed_claim")
            route = "block"
            continue

        claim_id = claim.get("claim_id", "UNKNOWN_CLAIM")
        claim_type = claim.get("claim_type")

        if claim_type in BLOCKING_CLAIM_TYPES:
            reasons.append(f"blocking_claim_type:{claim_id}:{claim_type}")
            route = "block"

        claim_source_ids = _as_list(claim.get("source_ids"))
        if not claim_source_ids:
            reasons.append(f"claim_missing_source_ids:{claim_id}")
            route = max_route(route, "review")

        for source_id in claim_source_ids:
            if source_id not in source_ids:
                reasons.append(f"unresolved_claim_source:{claim_id}:{source_id}")
                route = max_route(route, "review")

    return {
        "packet_id": packet.get("packet_id"),
        "route": route,
        "reasons": sorted(set(reasons)),
        "missingness": missingness,
        "next_executable_action": next_action(route),
    }


def max_route(current: str, proposed: str) -> str:
    order = {"pass": 0, "review": 1, "block": 2}
    return proposed if order[proposed] > order[current] else current


def next_action(route: str) -> str:
    if route == "pass":
        return "send_to_hypothesis_or_review_pipeline"
    if route == "review":
        return "repair_source_chain_or_add_limitations"
    return "block_and_redact_before_reuse"


def validate_packets(packets: Iterable[Dict[str, Any]]) -> Dict[str, Any]:
    results = [validate_packet(packet) for packet in packets]
    summary = {
        "total_packets": len(results),
        "pass": sum(1 for result in results if result["route"] == "pass"),
        "review": sum(1 for result in results if result["route"] == "review"),
        "block": sum(1 for result in results if result["route"] == "block"),
    }
    return {"summary": summary, "results": results}


def load_packets(path: str) -> List[Dict[str, Any]]:
    with open(path, "r", encoding="utf-8") as handle:
        data = json.load(handle)
    if not isinstance(data, list):
        raise ValueError("input must be a JSON array of packets")
    if not all(isinstance(item, dict) for item in data):
        raise ValueError("every packet must be a JSON object")
    return data


def main(argv: List[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description="Validate MC packet source chains.")
    parser.add_argument("--input", required=True, help="Path to JSON packet array.")
    parser.add_argument(
        "--fail-on-block",
        action="store_true",
        help="Exit non-zero if any packet routes to block.",
    )
    args = parser.parse_args(argv)

    try:
        packets = load_packets(args.input)
        output = validate_packets(packets)
    except Exception as exc:  # pragma: no cover - CLI guard
        print(json.dumps({"error": str(exc)}, indent=2), file=sys.stderr)
        return 2

    print(json.dumps(output, indent=2, sort_keys=True))
    if args.fail_on_block and output["summary"]["block"]:
        return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
