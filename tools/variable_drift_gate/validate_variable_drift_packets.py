#!/usr/bin/env python3
"""Validate MC Variable Drift Gate packets.

Purpose:
- Prevent longitudinal trend scoring from comparing different constructs under one symbolic label.
- Keep public discovery memory separate from private or attribution-unsafe packets.

This script intentionally uses only the Python standard library.
"""

from __future__ import annotations

import json
import sys
from pathlib import Path
from typing import Any

ALLOWED_SOURCE_STATUS = {
    "synthetic_fixture",
    "user_stated",
    "assistant_inferred",
    "tool_observed",
    "literature_derived",
}
ALLOWED_CLAIM_STATUS = {"hypothesis", "operational_test", "rejected", "needs_review"}
ALLOWED_PRIVACY_STATUS = {"public_safe", "deidentified", "private_rejected"}
ALLOWED_MISSINGNESS = {"observed", "unknown", "not_collected", "redacted", "not_applicable"}


def _require(condition: bool, message: str, errors: list[str]) -> None:
    if not condition:
        errors.append(message)


def validate_packet(packet: dict[str, Any]) -> list[str]:
    errors: list[str] = []

    required = [
        "packet_id",
        "hypothesis_id",
        "claim",
        "source_status",
        "claim_status",
        "privacy_status",
        "revision_reason",
        "tracked_variable",
        "baseline_definition",
        "current_definition",
        "timepoints",
        "allowed_drift",
        "missingness",
        "falsification_route",
        "next_executable_action",
    ]
    for key in required:
        _require(key in packet, f"missing required field: {key}", errors)
    if errors:
        return errors

    _require(packet["source_status"] in ALLOWED_SOURCE_STATUS, "invalid source_status", errors)
    _require(packet["claim_status"] in ALLOWED_CLAIM_STATUS, "invalid claim_status", errors)
    _require(packet["privacy_status"] in ALLOWED_PRIVACY_STATUS, "invalid privacy_status", errors)
    _require(packet["privacy_status"] != "private_rejected", "private_rejected packets cannot enter public-safe variable drift memory", errors)

    tracked = packet.get("tracked_variable", {})
    for key in ["name", "symbolic_phrase", "unit", "measurement_method"]:
        _require(isinstance(tracked.get(key), str) and bool(tracked.get(key).strip()), f"tracked_variable.{key} must be non-empty", errors)

    allowed = packet.get("allowed_drift", {})
    for key in ["semantic_change_allowed", "unit_change_allowed", "method_change_allowed", "requires_new_variable_if_exceeded"]:
        _require(isinstance(allowed.get(key), bool), f"allowed_drift.{key} must be boolean", errors)

    baseline = str(packet.get("baseline_definition", "")).strip().lower()
    current = str(packet.get("current_definition", "")).strip().lower()
    if baseline != current and not allowed.get("semantic_change_allowed", False):
        errors.append("semantic drift detected: baseline_definition and current_definition differ while semantic drift is not allowed")
    if baseline != current and not allowed.get("requires_new_variable_if_exceeded", False):
        errors.append("semantic drift detected but packet does not require a new variable when exceeded")

    timepoints = packet.get("timepoints", [])
    _require(isinstance(timepoints, list) and len(timepoints) >= 2, "at least two timepoints required", errors)
    previous_t = ""
    definitions: set[str] = set()
    observed_count = 0
    for idx, point in enumerate(timepoints):
        _require(isinstance(point, dict), f"timepoint {idx} must be object", errors)
        t = str(point.get("t", ""))
        definition = str(point.get("definition", "")).strip().lower()
        state = point.get("missingness_state")
        observed = point.get("observed")
        _require(bool(t), f"timepoint {idx} missing t", errors)
        _require(t > previous_t, f"timepoint {idx} is not strictly time-ordered", errors)
        previous_t = t
        _require(bool(definition), f"timepoint {idx} missing definition", errors)
        definitions.add(definition)
        _require(state in ALLOWED_MISSINGNESS, f"timepoint {idx} invalid missingness_state", errors)
        _require(isinstance(observed, bool), f"timepoint {idx} observed must be boolean", errors)
        if state == "observed":
            _require(observed is True, f"timepoint {idx} missingness_state observed conflicts with observed false", errors)
            observed_count += 1
        else:
            _require(observed is False, f"timepoint {idx} non-observed missingness_state conflicts with observed true", errors)

    if len(definitions) > 1 and not allowed.get("semantic_change_allowed", False):
        errors.append("timepoint definition drift detected while semantic drift is not allowed")
    _require(observed_count >= 2, "at least two observed timepoints required for longitudinal comparison", errors)

    text_fields = ["claim", "revision_reason", "missingness", "falsification_route", "next_executable_action"]
    for key in text_fields:
        _require(isinstance(packet.get(key), str) and len(packet[key].strip()) >= 10, f"{key} must be descriptive text", errors)

    return errors


def load_packets(path: Path) -> dict[str, dict[str, Any]]:
    with path.open("r", encoding="utf-8") as handle:
        data = json.load(handle)
    if not isinstance(data, dict):
        raise ValueError("fixture file must contain an object keyed by fixture name")
    return data


def main(argv: list[str]) -> int:
    if len(argv) != 2:
        print("Usage: validate_variable_drift_packets.py <packets.json>", file=sys.stderr)
        return 2
    packets = load_packets(Path(argv[1]))
    failed = False
    for name, packet in packets.items():
        errors = validate_packet(packet)
        if errors:
            failed = True
            print(f"FAIL {name}")
            for error in errors:
                print(f"  - {error}")
        else:
            print(f"PASS {name}")
    return 1 if failed else 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv))
