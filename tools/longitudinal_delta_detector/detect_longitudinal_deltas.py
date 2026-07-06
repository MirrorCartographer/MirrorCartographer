#!/usr/bin/env python3
"""
Mirror Cartographer Longitudinal Delta Detector.

Public-safe purpose:
Detect whether a deidentified, time-bucketed longitudinal signal shows enough
change to become a candidate pattern-change event for later evidence review.
This is research organization infrastructure only. It does not provide medical,
veterinary, financial, or personal advice.
"""

from __future__ import annotations

import argparse
import json
import math
import statistics
from pathlib import Path
from typing import Any, Dict, Iterable, List

PUBLIC_SAFE_PRIVACY = {"synthetic_public_safe", "deidentified_public_safe"}
ALLOWED_SOURCE_STATUS = {"synthetic", "public_dataset", "deidentified_internal"}
ALLOWED_CLAIM_STATUS = {"candidate_pattern", "observation_only"}
PRIVATE_BUCKET_MARKERS = {"/", ":", "@", "gps", "address", "location"}


def mean(values: Iterable[float]) -> float:
    values = list(values)
    if not values:
        return 0.0
    return sum(values) / len(values)


def cohens_d(left: List[float], right: List[float]) -> float:
    """Return absolute Cohen-style standardized mean difference."""
    if len(left) < 2 or len(right) < 2:
        return 0.0
    pooled_values = left + right
    sd = statistics.pstdev(pooled_values)
    if sd == 0:
        return 0.0
    return abs(mean(right) - mean(left)) / sd


def has_private_bucket_marker(bucket: str) -> bool:
    lowered = bucket.lower()
    if lowered.startswith("t") and all(ch in "t-0123456789" for ch in lowered):
        return False
    return any(marker in lowered for marker in PRIVATE_BUCKET_MARKERS)


def validate_record(record: Dict[str, Any]) -> List[str]:
    errors: List[str] = []
    if record.get("privacy_status") not in PUBLIC_SAFE_PRIVACY:
        errors.append("privacy_status_not_public_safe")
    if record.get("source_status") not in ALLOWED_SOURCE_STATUS:
        errors.append("source_status_unknown")
    if record.get("claim_status") not in ALLOWED_CLAIM_STATUS:
        errors.append("claim_status_unknown")

    series = record.get("series")
    if not isinstance(series, list):
        errors.append("series_missing_or_not_list")
        return errors

    for idx, point in enumerate(series):
        if not isinstance(point, dict):
            errors.append(f"point_{idx}_not_object")
            continue
        for field in ("bucket", "signal", "value", "unit", "context"):
            if field not in point:
                errors.append(f"point_{idx}_missing_{field}")
        bucket = str(point.get("bucket", ""))
        if has_private_bucket_marker(bucket):
            errors.append(f"point_{idx}_bucket_not_relative_or_coarse")
        try:
            float(point.get("value"))
        except (TypeError, ValueError):
            errors.append(f"point_{idx}_value_not_numeric")

    signals = {point.get("signal") for point in series if isinstance(point, dict)}
    units = {point.get("unit") for point in series if isinstance(point, dict)}
    contexts = {point.get("context") for point in series if isinstance(point, dict)}
    if len(signals) != 1:
        errors.append("series_mixes_signals")
    if len(units) != 1:
        errors.append("series_mixes_units")
    if len(contexts) != 1:
        errors.append("series_mixes_contexts")

    return errors


def score_record(record: Dict[str, Any]) -> Dict[str, Any]:
    errors = validate_record(record)
    if any(error.startswith("privacy_status") or "bucket_not_relative" in error for error in errors):
        route = "block_privacy"
    elif errors:
        route = "invalid_packet"
    else:
        series = record["series"]
        minimum_points = int(record.get("minimum_points", 6))
        minimum_effect_size = float(record.get("minimum_effect_size", 0.25))
        if len(series) < minimum_points:
            route = "needs_more_data"
            effect_size = 0.0
        else:
            values = [float(point["value"]) for point in series]
            midpoint = len(values) // 2
            baseline = values[:midpoint]
            recent = values[midpoint:]
            effect_size = cohens_d(baseline, recent)
            route = "candidate_delta_event" if effect_size >= minimum_effect_size else "stable_baseline"

    if "effect_size" not in locals():
        effect_size = None

    return {
        "id": record.get("id"),
        "route": route,
        "errors": errors,
        "effect_size": effect_size,
        "measurable_variables": [
            "relative_time_bucket",
            "signal_name",
            "numeric_value",
            "unit",
            "context_label",
            "effect_size",
            "minimum_effect_size",
            "minimum_points"
        ],
        "falsification_route": "A packet is falsified as a candidate delta if public-safe validation fails, the series is too sparse, or baseline-to-recent effect size is below threshold."
    }


def load_records(path: Path) -> List[Dict[str, Any]]:
    with path.open("r", encoding="utf-8") as handle:
        data = json.load(handle)
    if isinstance(data, dict):
        return [data]
    if isinstance(data, list):
        return data
    raise ValueError("Input must be a JSON object or array of objects")


def main() -> int:
    parser = argparse.ArgumentParser(description="Detect public-safe longitudinal signal deltas.")
    parser.add_argument("input", type=Path, help="JSON fixture file or packet file")
    parser.add_argument("--expect", action="store_true", help="Fail if any record route differs from expected_route")
    args = parser.parse_args()

    records = load_records(args.input)
    results = [score_record(record) for record in records]
    print(json.dumps(results, indent=2, sort_keys=True))

    if args.expect:
        mismatches = []
        for record, result in zip(records, results):
            expected = record.get("expected_route")
            if expected and expected != result["route"]:
                mismatches.append({"id": record.get("id"), "expected": expected, "actual": result["route"]})
        if mismatches:
            print(json.dumps({"mismatches": mismatches}, indent=2, sort_keys=True))
            return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
