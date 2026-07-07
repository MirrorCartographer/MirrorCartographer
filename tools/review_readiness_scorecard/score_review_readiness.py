#!/usr/bin/env python3
"""Score Mirror Cartographer packets for collaborator review readiness.

Public-safe engineering gate only. This script does not provide medical or
veterinary advice and does not validate scientific truth. It validates whether
packet structure is ready for bounded review.
"""

from __future__ import annotations

import argparse
import json
from pathlib import Path
from typing import Any, Dict, List, Tuple

REQUIRED_FIELDS = [
    "packet_id",
    "domain",
    "source_status",
    "claim_status",
    "privacy_status",
    "evidence_route",
    "missingness",
    "falsification_status",
    "revision_reason",
    "implementation_status",
    "testability",
    "next_executable_action",
]

BLOCKED_PRIVACY = {"private", "unknown", "private_reject", "contains_identifier", "unredacted"}
BLOCKED_CLAIMS = {
    "diagnosis",
    "treatment",
    "treatment_advice",
    "veterinary_advice",
    "medical_advice",
    "claim_cure",
    "cure_claim",
    "discovery_proof",
    "proven_discovery",
}
WEAK_FALSIFICATION = {"", "none", "not_applicable", "missing_falsification_path", "too_vague"}


def _nonempty(value: Any) -> bool:
    if value is None:
        return False
    if isinstance(value, str):
        return bool(value.strip())
    if isinstance(value, list):
        return True
    return True


def score_packet(packet: Dict[str, Any]) -> Dict[str, Any]:
    blockers: List[str] = []
    warnings: List[str] = []
    score = 100

    for field in REQUIRED_FIELDS:
        if field not in packet or not _nonempty(packet.get(field)):
            blockers.append(f"missing_required_field:{field}")
            score -= 15

    missingness = packet.get("missingness")
    if "missingness" in packet and not isinstance(missingness, list):
        blockers.append("missingness_not_array")
        score -= 20
    elif isinstance(missingness, list) and missingness:
        warnings.append("missingness_present")
        score -= min(10, len(missingness) * 3)

    privacy_status = str(packet.get("privacy_status", "")).strip().lower()
    claim_status = str(packet.get("claim_status", "")).strip().lower()
    falsification_status = str(packet.get("falsification_status", "")).strip().lower()

    if privacy_status in BLOCKED_PRIVACY or privacy_status != "public_safe":
        blockers.append("privacy_not_public_safe")
        score -= 40

    if claim_status in BLOCKED_CLAIMS:
        blockers.append("blocked_claim_status")
        score -= 40

    if falsification_status in WEAK_FALSIFICATION:
        warnings.append("weak_or_missing_falsification")
        score -= 20

    if not str(packet.get("evidence_route", "")).strip():
        warnings.append("missing_evidence_route")
        score -= 10

    if not str(packet.get("next_executable_action", "")).strip():
        warnings.append("missing_next_executable_action")
        score -= 10

    score = max(0, min(100, score))

    if blockers:
        status = "blocked"
    elif score < 80 or "weak_or_missing_falsification" in warnings:
        status = "needs_revision"
    else:
        status = "review_ready"

    return {
        "packet_id": packet.get("packet_id", "missing-packet-id"),
        "domain": packet.get("domain", "unknown"),
        "score": score,
        "status": status,
        "blockers": sorted(set(blockers)),
        "warnings": sorted(set(warnings)),
        "next_executable_action": packet.get("next_executable_action", "define next executable action"),
    }


def build_scorecard(packets: List[Dict[str, Any]]) -> Dict[str, Any]:
    scorecards = [score_packet(packet) for packet in packets]
    summary = {
        "total": len(scorecards),
        "review_ready": sum(1 for card in scorecards if card["status"] == "review_ready"),
        "needs_revision": sum(1 for card in scorecards if card["status"] == "needs_revision"),
        "blocked": sum(1 for card in scorecards if card["status"] == "blocked"),
    }
    return {
        "scorecard_version": "mc-review-readiness/v1",
        "summary": summary,
        "scorecards": scorecards,
    }


def load_packets(path: Path) -> List[Dict[str, Any]]:
    data = json.loads(path.read_text(encoding="utf-8"))
    if not isinstance(data, list):
        raise ValueError("input must be a JSON array of packet objects")
    for index, item in enumerate(data):
        if not isinstance(item, dict):
            raise ValueError(f"packet at index {index} must be an object")
    return data


def main() -> int:
    parser = argparse.ArgumentParser(description="Score MC packets for review readiness.")
    parser.add_argument("--input", required=True, help="Path to JSON array of packets")
    parser.add_argument("--output", required=True, help="Path to write scorecard JSON")
    args = parser.parse_args()

    packets = load_packets(Path(args.input))
    result = build_scorecard(packets)
    output_path = Path(args.output)
    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_text(json.dumps(result, indent=2, sort_keys=True) + "\n", encoding="utf-8")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
