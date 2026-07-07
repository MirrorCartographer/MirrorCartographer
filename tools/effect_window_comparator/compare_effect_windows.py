#!/usr/bin/env python3
"""
Effect Window Comparator for Mirror Cartographer.

Public-safe executable component that compares baseline and follow-up windows
around a candidate change. It emits routing decisions only; it does not make
medical, veterinary, cure, or causal claims.
"""

from __future__ import annotations

import json
import sys
from datetime import datetime, timezone
from pathlib import Path
from statistics import mean
from typing import Any, Dict, List, Tuple

REQUIRED_PACKET_FIELDS = [
    "packet_id",
    "source_status",
    "claim_status",
    "privacy_status",
    "revision_reason",
    "comparison",
    "observations",
    "missingness",
]

REQUIRED_COMPARISON_FIELDS = [
    "entity_kind",
    "change_label",
    "change_timestamp",
    "expected_direction",
    "expected_window_hours",
    "outcome_metric",
    "minimum_baseline_points",
    "minimum_followup_points",
]

SAFE_PRIVACY = {"public_safe", "synthetic_public_safe"}
SAFE_SOURCE = {"synthetic_public_safe", "public_source", "public_safe_derived"}
ALLOWED_DIRECTIONS = {"increase", "decrease", "stabilize", "unknown"}
ALLOWED_PHASES = {"baseline", "followup"}


def parse_time(value: str) -> datetime:
    if not isinstance(value, str):
        raise ValueError("timestamp must be a string")
    normalized = value.replace("Z", "+00:00")
    parsed = datetime.fromisoformat(normalized)
    if parsed.tzinfo is None:
        parsed = parsed.replace(tzinfo=timezone.utc)
    return parsed.astimezone(timezone.utc)


def observed_direction(baseline_mean: float, followup_mean: float) -> str:
    delta = followup_mean - baseline_mean
    if abs(delta) < 0.000001:
        return "stabilize"
    if delta > 0:
        return "increase"
    return "decrease"


def validate_packet(packet: Dict[str, Any]) -> Tuple[List[str], List[str]]:
    blockers: List[str] = []
    warnings: List[str] = []

    for field in REQUIRED_PACKET_FIELDS:
        if field not in packet:
            blockers.append(f"missing_packet_field:{field}")

    if blockers:
        return blockers, warnings

    if packet.get("privacy_status") not in SAFE_PRIVACY:
        blockers.append("privacy_not_public_safe")

    if packet.get("source_status") not in SAFE_SOURCE:
        blockers.append("source_not_public_safe")

    if not isinstance(packet.get("missingness"), list):
        blockers.append("missingness_must_be_list")

    comparison = packet.get("comparison")
    if not isinstance(comparison, dict):
        blockers.append("comparison_must_be_object")
        return blockers, warnings

    for field in REQUIRED_COMPARISON_FIELDS:
        if field not in comparison:
            blockers.append(f"missing_comparison_field:{field}")

    if blockers:
        return blockers, warnings

    if comparison.get("expected_direction") not in ALLOWED_DIRECTIONS:
        blockers.append("invalid_expected_direction")

    try:
        parse_time(comparison["change_timestamp"])
    except Exception:
        blockers.append("invalid_change_timestamp")

    for numeric_field in ["expected_window_hours", "minimum_baseline_points", "minimum_followup_points"]:
        value = comparison.get(numeric_field)
        if not isinstance(value, int) or value < 0:
            blockers.append(f"invalid_numeric_field:{numeric_field}")

    observations = packet.get("observations")
    if not isinstance(observations, list):
        blockers.append("observations_must_be_list")
        return blockers, warnings

    for index, observation in enumerate(observations):
        if not isinstance(observation, dict):
            blockers.append(f"observation_not_object:{index}")
            continue
        if observation.get("phase") not in ALLOWED_PHASES:
            blockers.append(f"invalid_observation_phase:{index}")
        if "metric_value" not in observation or not isinstance(observation.get("metric_value"), (int, float)):
            blockers.append(f"invalid_metric_value:{index}")
        if not isinstance(observation.get("missingness", []), list):
            blockers.append(f"observation_missingness_must_be_list:{index}")
        if not isinstance(observation.get("confounders", []), list):
            blockers.append(f"observation_confounders_must_be_list:{index}")
        try:
            parse_time(observation.get("timestamp"))
        except Exception:
            blockers.append(f"invalid_observation_timestamp:{index}")

    if packet.get("missingness"):
        warnings.append("packet_has_explicit_missingness")

    return blockers, warnings


def compare_packet(packet: Dict[str, Any]) -> Dict[str, Any]:
    blockers, warnings = validate_packet(packet)
    packet_id = packet.get("packet_id", "unknown_packet")

    base_result: Dict[str, Any] = {
        "packet_id": packet_id,
        "decision": "blocked" if blockers else "inconclusive",
        "baseline_count": 0,
        "followup_count": 0,
        "baseline_mean": None,
        "followup_mean": None,
        "direction_observed": "unknown",
        "claim_status": "candidate_effect_not_causal",
        "privacy_status": packet.get("privacy_status", "unknown"),
        "missingness": packet.get("missingness", ["packet_unreadable"]),
        "blockers": blockers,
        "warnings": warnings,
        "next_executable_action": "redact_or_repair_packet" if blockers else "collect_more_observations",
    }

    if blockers:
        return base_result

    comparison = packet["comparison"]
    change_time = parse_time(comparison["change_timestamp"])
    expected_window_hours = comparison["expected_window_hours"]
    expected_direction = comparison["expected_direction"]

    baseline_values: List[float] = []
    followup_values: List[float] = []
    confounder_count = 0
    outside_window_count = 0

    for observation in packet["observations"]:
        obs_time = parse_time(observation["timestamp"])
        value = float(observation["metric_value"])
        confounder_count += len(observation.get("confounders", []))

        if observation["phase"] == "baseline" and obs_time < change_time:
            baseline_values.append(value)
        elif observation["phase"] == "followup" and obs_time >= change_time:
            hours_after_change = (obs_time - change_time).total_seconds() / 3600
            if hours_after_change <= expected_window_hours:
                followup_values.append(value)
            else:
                outside_window_count += 1

    base_result["baseline_count"] = len(baseline_values)
    base_result["followup_count"] = len(followup_values)

    if len(baseline_values) < comparison["minimum_baseline_points"]:
        warnings.append("insufficient_baseline_points")
    if len(followup_values) < comparison["minimum_followup_points"]:
        warnings.append("insufficient_followup_points")
    if outside_window_count:
        warnings.append("followup_points_outside_expected_window")
    if confounder_count:
        warnings.append("confounders_present")
    if expected_direction == "unknown":
        warnings.append("expected_direction_unknown")

    if baseline_values:
        base_result["baseline_mean"] = round(mean(baseline_values), 6)
    if followup_values:
        base_result["followup_mean"] = round(mean(followup_values), 6)

    if baseline_values and followup_values:
        direction = observed_direction(mean(baseline_values), mean(followup_values))
        base_result["direction_observed"] = direction
        if expected_direction != "unknown" and direction != expected_direction:
            warnings.append("observed_direction_mismatch")

    has_minimum_points = (
        len(baseline_values) >= comparison["minimum_baseline_points"]
        and len(followup_values) >= comparison["minimum_followup_points"]
    )
    direction_matches = (
        expected_direction != "unknown"
        and base_result["direction_observed"] == expected_direction
    )
    too_confounded = confounder_count >= max(2, len(packet["observations"]))

    if has_minimum_points and direction_matches and not too_confounded and not packet.get("missingness"):
        base_result["decision"] = "candidate_signal"
        base_result["next_executable_action"] = "send_to_contradiction_ledger"
    else:
        base_result["decision"] = "inconclusive"
        base_result["next_executable_action"] = "collect_more_observations_or_falsify"

    base_result["warnings"] = sorted(set(warnings))
    return base_result


def main(argv: List[str]) -> int:
    if len(argv) != 2:
        print("Usage: compare_effect_windows.py <packets.json>", file=sys.stderr)
        return 2

    input_path = Path(argv[1])
    packets = json.loads(input_path.read_text(encoding="utf-8"))
    if isinstance(packets, dict):
        packets = [packets]
    if not isinstance(packets, list):
        print("Input must be a JSON object or list of objects", file=sys.stderr)
        return 2

    results = [compare_packet(packet) for packet in packets]
    print(json.dumps(results, indent=2, sort_keys=True))
    return 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv))
