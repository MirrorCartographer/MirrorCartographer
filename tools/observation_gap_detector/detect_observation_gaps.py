#!/usr/bin/env python3
"""Detect public-safe observation gaps before MC signal promotion.

This script is intentionally dependency-free so it can run in constrained CI.
It is research organization infrastructure only and does not provide medical or
veterinary advice.
"""

from __future__ import annotations

import argparse
import json
import re
from dataclasses import dataclass
from datetime import date
from pathlib import Path
from typing import Any, Dict, Iterable, List, Tuple

ALLOWED_DOMAINS = {
    "human_research",
    "animal_care",
    "literature",
    "environment",
    "behavioral",
}

DIRECT_IDENTIFIER_PATTERNS = [
    re.compile(r"[A-Z0-9._%+-]+@[A-Z0-9.-]+\\.[A-Z]{2,}", re.IGNORECASE),
    re.compile(r"\\b\\d{3}[-. ]?\\d{2}[-. ]?\\d{4}\\b"),
    re.compile(r"\\b(?:\\+?1[-. ]?)?\\(?\\d{3}\\)?[-. ]?\\d{3}[-. ]?\\d{4}\\b"),
]


@dataclass(frozen=True)
class GapResult:
    route: str
    missing_fields: List[str]
    observation_count: int
    largest_gap_days: int
    gap_dates: List[Dict[str, Any]]
    missingness: Dict[str, Any]


def parse_iso_date(value: str) -> date:
    try:
        return date.fromisoformat(value)
    except Exception as exc:  # pragma: no cover - exact exception varies by Python version
        raise ValueError(f"Invalid observed_at date: {value!r}") from exc


def contains_direct_identifier(value: str) -> bool:
    return any(pattern.search(value) for pattern in DIRECT_IDENTIFIER_PATTERNS)


def require(condition: bool, message: str) -> None:
    if not condition:
        raise ValueError(message)


def validate_stream(stream: Dict[str, Any]) -> None:
    require(isinstance(stream, dict), "Each stream must be an object")
    for field in [
        "stream_id",
        "domain",
        "subject_class",
        "required_fields",
        "minimum_observation_count",
        "maximum_gap_days",
        "source_status",
        "privacy_status",
        "claim_status",
        "observations",
    ]:
        require(field in stream, f"Missing required stream field: {field}")

    require(stream["domain"] in ALLOWED_DOMAINS, f"Unsupported domain: {stream['domain']!r}")
    require(isinstance(stream["subject_class"], str), "subject_class must be a string")
    require(
        not contains_direct_identifier(stream["subject_class"]),
        "subject_class appears to contain a direct identifier",
    )
    require(isinstance(stream["required_fields"], list), "required_fields must be a list")
    require(isinstance(stream["observations"], list), "observations must be a list")
    require(stream["minimum_observation_count"] >= 1, "minimum_observation_count must be positive")
    require(stream["maximum_gap_days"] >= 0, "maximum_gap_days cannot be negative")

    for observation in stream["observations"]:
        require(isinstance(observation, dict), "Each observation must be an object")
        require("observed_at" in observation, "Observation missing observed_at")
        require("values" in observation, "Observation missing values")
        require("missingness" in observation, "Observation missing missingness")
        parse_iso_date(observation["observed_at"])
        require(isinstance(observation["values"], dict), "observation values must be an object")
        require(isinstance(observation["missingness"], dict), "observation missingness must be an object")


def analyze_stream(stream: Dict[str, Any]) -> GapResult:
    validate_stream(stream)
    observations = sorted(stream["observations"], key=lambda item: item["observed_at"])
    required_fields = stream["required_fields"]

    missing_fields = sorted(
        {
            required
            for observation in observations
            for required in required_fields
            if required not in observation.get("values", {})
        }
    )

    merged_missingness: Dict[str, List[str]] = {}
    for observation in observations:
        for field, reason in observation.get("missingness", {}).items():
            merged_missingness.setdefault(field, [])
            if reason not in merged_missingness[field]:
                merged_missingness[field].append(reason)

    largest_gap_days = 0
    gap_dates: List[Dict[str, Any]] = []
    previous: date | None = None
    previous_raw: str | None = None
    for observation in observations:
        current_raw = observation["observed_at"]
        current = parse_iso_date(current_raw)
        if previous is not None and previous_raw is not None:
            gap_days = (current - previous).days
            largest_gap_days = max(largest_gap_days, gap_days)
            if gap_days > stream["maximum_gap_days"]:
                gap_dates.append({"from": previous_raw, "to": current_raw, "gap_days": gap_days})
        previous = current
        previous_raw = current_raw

    observation_count = len(observations)
    if observation_count < stream["minimum_observation_count"]:
        route = "hold_for_more_data"
    elif missing_fields:
        route = "repair_missing_fields"
    elif gap_dates:
        route = "review_temporal_gap"
    else:
        route = "eligible_for_signal_triage"

    return GapResult(
        route=route,
        missing_fields=missing_fields,
        observation_count=observation_count,
        largest_gap_days=largest_gap_days,
        gap_dates=gap_dates,
        missingness=merged_missingness,
    )


def build_gap_packet(stream: Dict[str, Any]) -> Dict[str, Any]:
    result = analyze_stream(stream)
    if result.route == "eligible_for_signal_triage":
        next_action = "Forward to signal triage matrix with provenance packet attached."
    elif result.route == "hold_for_more_data":
        next_action = "Collect additional public-safe observations before pattern inference."
    elif result.route == "repair_missing_fields":
        next_action = "Repair or explicitly mark missing required fields before hypothesis generation."
    else:
        next_action = "Review temporal gap before using this stream for longitudinal inference."

    return {
        "stream_id": stream["stream_id"],
        "route": result.route,
        "missing_fields": result.missing_fields,
        "observation_count": result.observation_count,
        "largest_gap_days": result.largest_gap_days,
        "gap_dates": result.gap_dates,
        "source_status": stream["source_status"],
        "claim_status": stream["claim_status"],
        "privacy_status": stream["privacy_status"],
        "missingness": result.missingness or {"status": "none_detected"},
        "revision_reason": "Detect missing fields, sparse windows, and temporal gaps before MC treats observations as longitudinal patterns.",
        "implementation_status": "executable_cli_with_synthetic_fixtures_and_tests",
        "testability": "python tools/observation_gap_detector/test_detect_observation_gaps.py",
        "next_executable_action": next_action,
    }


def build_report(streams: Iterable[Dict[str, Any]]) -> Dict[str, Any]:
    packets = [build_gap_packet(stream) for stream in streams]
    routes: Dict[str, int] = {}
    for packet in packets:
        routes[packet["route"]] = routes.get(packet["route"], 0) + 1
    return {
        "component": "observation_gap_detector",
        "summary": {"stream_count": len(packets), "routes": routes},
        "gap_packets": packets,
    }


def load_streams(path: Path) -> List[Dict[str, Any]]:
    data = json.loads(path.read_text(encoding="utf-8"))
    require(isinstance(data, list), "Input must be a JSON array of observation streams")
    return data


def main() -> int:
    parser = argparse.ArgumentParser(description="Detect public-safe observation gaps for Mirror Cartographer.")
    parser.add_argument("input", type=Path)
    parser.add_argument("--output", type=Path, default=None)
    args = parser.parse_args()

    report = build_report(load_streams(args.input))
    serialized = json.dumps(report, indent=2, sort_keys=True)
    if args.output:
        args.output.write_text(serialized + "\n", encoding="utf-8")
    else:
        print(serialized)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
