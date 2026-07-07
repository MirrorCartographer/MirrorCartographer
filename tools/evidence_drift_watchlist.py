#!/usr/bin/env python3
"""Build an Evidence Drift Watchlist for Mirror Cartographer.

Public-safe routing only. This script does not provide medical or veterinary advice.
It classifies evidence packets into stable/watch/review/block based on freshness,
privacy, contradictions, supersession, and missingness.
"""

from __future__ import annotations

import json
import sys
from dataclasses import dataclass
from datetime import date
from pathlib import Path
from typing import Any, Dict, List, Tuple

VALID_PRIVACY = {"public_safe", "synthetic", "redacted", "private", "unknown"}
VALID_CLAIM = {"observation", "hypothesis", "review_needed", "unsupported", "contradicted"}
VALID_SOURCE = {"primary", "secondary", "anecdotal", "synthetic", "unknown"}
VALID_ROUTES = {"stable", "watch", "review", "block"}
STALE_DAYS = 180


@dataclass(frozen=True)
class RouteResult:
    packet_id: str
    route: str
    drift_reasons: List[str]
    next_executable_action: str

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.packet_id,
            "route": self.route,
            "drift_reasons": self.drift_reasons,
            "next_executable_action": self.next_executable_action,
        }


def parse_iso_date(value: Any) -> Tuple[date | None, str | None]:
    if not isinstance(value, str) or not value.strip():
        return None, "missing_date"
    try:
        return date.fromisoformat(value), None
    except ValueError:
        return None, "invalid_date"


def validate_packet(packet: Dict[str, Any]) -> List[str]:
    errors: List[str] = []
    required = [
        "id",
        "domain",
        "claim_text",
        "claim_status",
        "source_status",
        "privacy_status",
        "evidence_date",
        "last_reviewed_date",
        "contradiction_count",
        "superseded_by",
        "missingness",
        "revision_reason",
    ]
    for key in required:
        if key not in packet:
            errors.append(f"missing_required:{key}")

    if packet.get("privacy_status") not in VALID_PRIVACY:
        errors.append("invalid_privacy_status")
    if packet.get("claim_status") not in VALID_CLAIM:
        errors.append("invalid_claim_status")
    if packet.get("source_status") not in VALID_SOURCE:
        errors.append("invalid_source_status")
    if not isinstance(packet.get("superseded_by", []), list):
        errors.append("invalid_superseded_by")
    if not isinstance(packet.get("missingness", []), list):
        errors.append("invalid_missingness")
    if not isinstance(packet.get("contradiction_count", 0), int):
        errors.append("invalid_contradiction_count")
    return errors


def route_packet(packet: Dict[str, Any]) -> RouteResult:
    packet_id = str(packet.get("id", "unknown"))
    reasons = validate_packet(packet)

    evidence_date, evidence_error = parse_iso_date(packet.get("evidence_date"))
    reviewed_date, reviewed_error = parse_iso_date(packet.get("last_reviewed_date"))
    if evidence_error:
        reasons.append(f"evidence_date:{evidence_error}")
    if reviewed_error:
        reasons.append(f"last_reviewed_date:{reviewed_error}")

    privacy_status = packet.get("privacy_status")
    claim_status = packet.get("claim_status")
    source_status = packet.get("source_status")
    contradiction_count = packet.get("contradiction_count", 0)
    superseded_by = packet.get("superseded_by", [])
    missingness = packet.get("missingness", [])

    if privacy_status in {"private", "unknown"}:
        reasons.append("privacy_not_public_safe")
        return RouteResult(packet_id, "block", reasons, "redact_or_remove_private_residue_before_reuse")

    if claim_status == "contradicted":
        reasons.append("claim_contradicted")
        return RouteResult(packet_id, "block", reasons, "send_to_contradiction_ledger_and_stop_promotion")

    if reasons or source_status == "unknown":
        if source_status == "unknown":
            reasons.append("source_status_unknown")
        return RouteResult(packet_id, "review", reasons, "repair_packet_fields_or_verify_source_before_reuse")

    if isinstance(superseded_by, list) and superseded_by:
        reasons.append("evidence_superseded")
        return RouteResult(packet_id, "review", reasons, "compare_against_superseding_packet_before_reuse")

    if isinstance(contradiction_count, int) and contradiction_count > 0:
        reasons.append("contradictions_present")
        return RouteResult(packet_id, "review", reasons, "route_to_contradiction_ledger_before_claim_promotion")

    if evidence_date and reviewed_date and (reviewed_date - evidence_date).days > STALE_DAYS:
        reasons.append(f"stale_review_window_gt_{STALE_DAYS}_days")

    if isinstance(missingness, list) and missingness:
        reasons.append("missingness_present:" + ",".join(str(item) for item in missingness))

    if reasons:
        return RouteResult(packet_id, "watch", reasons, "refresh_evidence_or_mark_limits_before_hypothesis_generation")

    return RouteResult(packet_id, "stable", [], "eligible_for_downstream_review_packet_indexing")


def build_watchlist(payload: Dict[str, Any]) -> Dict[str, Any]:
    packets = payload.get("packets")
    if not isinstance(packets, list):
        raise ValueError("Input must contain a 'packets' list")

    routed = [route_packet(packet if isinstance(packet, dict) else {"id": "invalid_packet"}) for packet in packets]
    summary = {route: 0 for route in ["stable", "watch", "review", "block"]}
    for item in routed:
        summary[item.route] += 1

    return {"watchlist": [item.to_dict() for item in routed], "summary": summary}


def main(argv: List[str]) -> int:
    if len(argv) != 2:
        print("Usage: python tools/evidence_drift_watchlist.py <input.json>", file=sys.stderr)
        return 2

    input_path = Path(argv[1])
    try:
        payload = json.loads(input_path.read_text(encoding="utf-8"))
        output = build_watchlist(payload)
    except Exception as exc:  # intentionally CLI-friendly
        print(json.dumps({"error": str(exc)}, indent=2), file=sys.stderr)
        return 1

    print(json.dumps(output, indent=2, sort_keys=True))
    return 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv))
