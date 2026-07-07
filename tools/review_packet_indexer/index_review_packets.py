#!/usr/bin/env python3
"""Build a public-safe review index for Mirror Cartographer packets.

This script is intentionally dependency-free so it can run in constrained CI,
local shells, or collaborator handoff environments.
"""

from __future__ import annotations

import argparse
import json
import sys
from dataclasses import dataclass
from pathlib import Path
from typing import Any, Dict, Iterable, List, Tuple

REQUIRED_FIELDS = [
    "packet_id",
    "domain",
    "source_status",
    "claim_status",
    "privacy_status",
    "missingness",
    "revision_reason",
    "implementation_status",
    "testability",
    "next_executable_action",
]

VALID_DOMAINS = {
    "animal_care",
    "medical_literature",
    "longitudinal_observation",
    "hypothesis",
    "collaboration",
}

VALID_PRIVACY = {"public_safe", "needs_redaction", "private_only", "unknown"}
VALID_CLAIM = {"observation", "hypothesis", "review_needed", "blocked", "ready_for_review"}
VALID_IMPLEMENTATION = {"draft", "validated", "blocked"}


@dataclass(frozen=True)
class RouteResult:
    packet_id: str
    route: str
    domain: str
    reason_codes: List[str]

    def as_dict(self) -> Dict[str, Any]:
        return {
            "packet_id": self.packet_id,
            "route": self.route,
            "domain": self.domain,
            "reason_codes": self.reason_codes,
        }


def load_packets(path: Path) -> List[Dict[str, Any]]:
    try:
        payload = json.loads(path.read_text(encoding="utf-8"))
    except json.JSONDecodeError as exc:
        raise ValueError(f"Malformed JSON: {exc}") from exc
    except OSError as exc:
        raise ValueError(f"Cannot read input file: {exc}") from exc

    if not isinstance(payload, dict) or not isinstance(payload.get("packets"), list):
        raise ValueError("Input must be a JSON object with a top-level packets array")
    return payload["packets"]


def missing_required_fields(packet: Dict[str, Any]) -> List[str]:
    return [field for field in REQUIRED_FIELDS if field not in packet]


def route_packet(packet: Dict[str, Any]) -> RouteResult:
    packet_id = str(packet.get("packet_id", "UNKNOWN_PACKET"))
    domain = str(packet.get("domain", "unknown"))
    reasons: List[str] = []

    missing_fields = missing_required_fields(packet)
    if missing_fields:
        reasons.extend(f"missing_required:{field}" for field in missing_fields)
        return RouteResult(packet_id, "missingness_queue", domain, reasons)

    if domain not in VALID_DOMAINS:
        reasons.append("invalid_domain")
    if packet["privacy_status"] not in VALID_PRIVACY:
        reasons.append("invalid_privacy_status")
    if packet["claim_status"] not in VALID_CLAIM:
        reasons.append("invalid_claim_status")
    if packet["implementation_status"] not in VALID_IMPLEMENTATION:
        reasons.append("invalid_implementation_status")
    if not isinstance(packet["missingness"], list):
        reasons.append("missingness_not_array")

    if reasons:
        return RouteResult(packet_id, "missingness_queue", domain, reasons)

    privacy_status = packet["privacy_status"]
    claim_status = packet["claim_status"]
    implementation_status = packet["implementation_status"]
    missingness = packet["missingness"]

    if privacy_status in {"needs_redaction", "private_only", "unknown"}:
        return RouteResult(packet_id, "redaction_queue", domain, [f"privacy:{privacy_status}"])

    if claim_status == "blocked" or implementation_status == "blocked":
        block_reasons = []
        if claim_status == "blocked":
            block_reasons.append("claim:blocked")
        if implementation_status == "blocked":
            block_reasons.append("implementation:blocked")
        return RouteResult(packet_id, "blocked_queue", domain, block_reasons)

    if missingness:
        return RouteResult(packet_id, "missingness_queue", domain, ["explicit_missingness"])

    if claim_status in {"ready_for_review", "review_needed"}:
        return RouteResult(packet_id, "review_queue", domain, ["public_safe_reviewable"])

    return RouteResult(packet_id, "missingness_queue", domain, ["not_review_ready"])


def build_index(packets: Iterable[Dict[str, Any]]) -> Dict[str, Any]:
    routed = [route_packet(packet) for packet in packets]
    routed.sort(key=lambda item: item.packet_id)

    summary = {
        "total_packets": len(routed),
        "ready_for_review": sum(1 for item in routed if item.route == "review_queue"),
        "blocked": sum(1 for item in routed if item.route == "blocked_queue"),
        "needs_redaction": sum(1 for item in routed if item.route == "redaction_queue"),
        "missing_required_fields": sum(
            1 for item in routed if any(code.startswith("missing_required:") for code in item.reason_codes)
        ),
    }
    return {"summary": summary, "index": [item.as_dict() for item in routed]}


def main(argv: List[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description="Build MC review packet routing index")
    parser.add_argument("--input", required=True, help="Path to input packet JSON")
    parser.add_argument("--output", required=True, help="Path to output index JSON")
    args = parser.parse_args(argv)

    try:
        packets = load_packets(Path(args.input))
        result = build_index(packets)
        Path(args.output).write_text(json.dumps(result, indent=2, sort_keys=True) + "\n", encoding="utf-8")
    except ValueError as exc:
        print(f"review_packet_indexer error: {exc}", file=sys.stderr)
        return 2
    except OSError as exc:
        print(f"review_packet_indexer file error: {exc}", file=sys.stderr)
        return 3
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
