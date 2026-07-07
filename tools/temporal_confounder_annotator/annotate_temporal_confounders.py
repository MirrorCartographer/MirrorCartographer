#!/usr/bin/env python3
"""Annotate temporal confounders in public-safe longitudinal packets.

This is research-organization infrastructure, not medical or veterinary advice.
"""

from __future__ import annotations

import argparse
import json
from datetime import date
from pathlib import Path
from typing import Any, Dict, List, Tuple

BLOCKED_CLAIM_STATUSES = {"cure_claim", "direct_medical_advice", "direct_veterinary_advice"}
CONFOUNDER_EVENT_TYPES = {
    "travel",
    "heat",
    "medication_change",
    "sleep_disruption",
    "environment_change",
    "measurement_change",
    "stress_context",
}
REQUIRED_PACKET_FIELDS = {
    "id",
    "domain",
    "source_status",
    "claim_status",
    "privacy_status",
    "observations",
    "context_events",
    "missingness",
}


def parse_iso_date(value: str) -> date:
    return date.fromisoformat(value)


def days_between(a: str, b: str) -> int:
    return abs((parse_iso_date(a) - parse_iso_date(b)).days)


def annotate_packet(packet: Dict[str, Any], confounder_window_days: int = 2) -> Dict[str, Any]:
    reasons: List[str] = []
    confounders: List[Dict[str, Any]] = []

    missing_fields = sorted(REQUIRED_PACKET_FIELDS - set(packet.keys()))
    if missing_fields:
        return {
            "id": packet.get("id", "unknown"),
            "route": "block_pattern_claim",
            "reasons": [f"missing_required_fields:{','.join(missing_fields)}"],
            "confounders": [],
            "next_executable_action": "repair_packet_schema_before_pattern_scan",
        }

    if packet.get("claim_status") in BLOCKED_CLAIM_STATUSES:
        reasons.append("blocked_claim_status")

    if packet.get("privacy_status") not in {"public_safe", "public_safe_synthetic", "deidentified_synthetic"}:
        reasons.append("unsafe_privacy_status")

    observations = packet.get("observations") or []
    context_events = packet.get("context_events") or []

    if len(observations) < 3:
        reasons.append("fewer_than_three_dated_observations")

    if not isinstance(packet.get("missingness"), list):
        reasons.append("missingness_not_explicit_list")

    measurement_methods = {obs.get("measurement_method") for obs in observations if obs.get("measurement_method")}
    if len(measurement_methods) > 1:
        confounders.append({
            "type": "measurement_method_change",
            "evidence": sorted(measurement_methods),
            "severity": "review",
        })

    for event in context_events:
        event_type = event.get("event_type")
        if event_type not in CONFOUNDER_EVENT_TYPES:
            continue
        linked_observations = []
        event_date = event.get("date")
        if not event_date:
            continue
        for obs in observations:
            obs_date = obs.get("date")
            if obs_date and days_between(event_date, obs_date) <= confounder_window_days:
                linked_observations.append(obs.get("signal", "unknown_signal"))
        if linked_observations:
            confounders.append({
                "type": event_type,
                "event_date": event_date,
                "linked_signals": sorted(set(linked_observations)),
                "severity": "review",
            })

    if reasons:
        route = "block_pattern_claim"
        next_action = "repair_or_remove_packet_before_hypothesis_generation"
    elif confounders or packet.get("missingness"):
        route = "needs_review"
        next_action = "add_controls_or_baseline_before_pattern_promotion"
    else:
        route = "allow_pattern_scan"
        next_action = "send_to_signal_triage_matrix"

    return {
        "id": packet["id"],
        "route": route,
        "reasons": reasons,
        "confounders": confounders,
        "missingness": packet.get("missingness", []),
        "next_executable_action": next_action,
    }


def annotate_packets(packets: List[Dict[str, Any]]) -> Dict[str, Any]:
    annotated = [annotate_packet(packet) for packet in packets]
    return {
        "allow_pattern_scan": [p["id"] for p in annotated if p["route"] == "allow_pattern_scan"],
        "needs_review": [p["id"] for p in annotated if p["route"] == "needs_review"],
        "block_pattern_claim": [p["id"] for p in annotated if p["route"] == "block_pattern_claim"],
        "packets": annotated,
    }


def load_packets(path: Path) -> List[Dict[str, Any]]:
    data = json.loads(path.read_text(encoding="utf-8"))
    if not isinstance(data, list):
        raise ValueError("Input must be a JSON array of packets")
    return data


def main() -> int:
    parser = argparse.ArgumentParser(description="Annotate temporal confounders in MC longitudinal packets.")
    parser.add_argument("input", type=Path, help="Path to JSON array of packets")
    parser.add_argument("--json", action="store_true", help="Emit compact JSON")
    args = parser.parse_args()

    result = annotate_packets(load_packets(args.input))
    if args.json:
        print(json.dumps(result, sort_keys=True, separators=(",", ":")))
    else:
        print(json.dumps(result, indent=2, sort_keys=True))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
