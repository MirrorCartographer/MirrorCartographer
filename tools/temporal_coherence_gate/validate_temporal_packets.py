#!/usr/bin/env python3
"""Validate public-safe Mirror Cartographer temporal coherence packets.

Purpose:
    Prevent longitudinal discovery infrastructure from mistaking missing data,
    unordered observations, undeclared variables, or private material for a
    valid research pattern.

This is research-organization infrastructure only. It does not diagnose,
recommend treatment, or provide medical/veterinary advice.
"""
from __future__ import annotations

import json
import sys
from pathlib import Path
from typing import Any

ALLOWED_SOURCE_STATUS = {"synthetic", "public_dataset", "literature_derived", "deidentified_research"}
ALLOWED_CLAIM_STATUS = {"hypothesis", "test_fixture", "inconclusive", "supported", "contradicted"}
ALLOWED_PRIVACY_STATUS = {"public_safe", "deidentified"}
ALLOWED_VALUE_STATUS = {"observed", "missing_unknown", "not_collected", "redacted", "not_applicable"}
ALLOWED_BOUNDARIES = {"research_organization", "question_prep", "literature_mapping", "not_advice"}

REQUIRED_PACKET_FIELDS = {
    "packet_id",
    "source_status",
    "claim_status",
    "privacy_status",
    "revision_reason",
    "implementation_status",
    "testability",
    "falsification_route",
    "measurable_variables",
    "observations",
}


def _require(condition: bool, errors: list[str], message: str) -> None:
    if not condition:
        errors.append(message)


def validate_packet(packet: dict[str, Any]) -> list[str]:
    """Return validation errors. Empty list means the packet passes."""
    errors: list[str] = []

    missing = sorted(REQUIRED_PACKET_FIELDS - set(packet))
    _require(not missing, errors, f"missing required packet fields: {missing}")

    if packet.get("source_status") not in ALLOWED_SOURCE_STATUS:
        errors.append(f"invalid source_status: {packet.get('source_status')}")
    if packet.get("claim_status") not in ALLOWED_CLAIM_STATUS:
        errors.append(f"invalid claim_status: {packet.get('claim_status')}")
    if packet.get("privacy_status") not in ALLOWED_PRIVACY_STATUS:
        errors.append("privacy_status must be public_safe or deidentified")

    measurable = packet.get("measurable_variables", [])
    if not isinstance(measurable, list) or not measurable:
        errors.append("measurable_variables must be a non-empty list")
        declared_variables: set[str] = set()
    else:
        declared_variables = {item.get("name") for item in measurable if isinstance(item, dict)}
        if None in declared_variables or "" in declared_variables:
            errors.append("each measurable variable must have a non-empty name")

    observations = packet.get("observations", [])
    if not isinstance(observations, list) or len(observations) < 2:
        errors.append("observations must contain at least two timepoints")
        return errors

    last_time = -1
    seen_observed = False
    seen_missing_state = False

    for index, obs in enumerate(observations):
        if not isinstance(obs, dict):
            errors.append(f"observation {index} must be an object")
            continue

        time_index = obs.get("time_index")
        variable = obs.get("variable")
        value_status = obs.get("value_status")
        boundary = obs.get("evidence_boundary")

        if not isinstance(time_index, int):
            errors.append(f"observation {index} time_index must be integer")
        else:
            if time_index <= last_time:
                errors.append(f"observation {index} time_index is not strictly increasing")
            last_time = time_index

        if variable not in declared_variables:
            errors.append(f"observation {index} variable is not declared: {variable}")

        if value_status not in ALLOWED_VALUE_STATUS:
            errors.append(f"observation {index} has invalid value_status: {value_status}")
        elif value_status == "observed":
            seen_observed = True
            if "value" not in obs:
                errors.append(f"observation {index} is observed but has no value")
        else:
            seen_missing_state = True
            if "value" in obs:
                errors.append(f"observation {index} has missing value_status but still contains value")

        if boundary not in ALLOWED_BOUNDARIES:
            errors.append(f"observation {index} has invalid evidence_boundary: {boundary}")

    _require(seen_observed, errors, "packet must contain at least one observed value")
    _require(
        packet.get("privacy_status") != "reject_private",
        errors,
        "private packets cannot enter public-safe temporal research memory",
    )

    # This is a warning-level design invariant treated as an error for now:
    # longitudinal research packets must make missingness explicit whenever it exists.
    if any(obs.get("value_status") != "observed" for obs in observations if isinstance(obs, dict)):
        _require(seen_missing_state, errors, "missingness states must be explicit")

    return errors


def validate_fixture_file(path: Path) -> int:
    fixtures = json.loads(path.read_text(encoding="utf-8"))
    failures: list[str] = []

    for fixture in fixtures:
        name = fixture.get("name", "unnamed")
        should_pass = fixture.get("should_pass")
        packet = fixture.get("packet", {})
        errors = validate_packet(packet)
        passed = not errors
        if passed != should_pass:
            failures.append(f"{name}: expected should_pass={should_pass}, got {passed}; errors={errors}")

    if failures:
        for failure in failures:
            print(f"FAIL: {failure}")
        return 1

    print(f"PASS: validated {len(fixtures)} temporal coherence fixtures")
    return 0


def main(argv: list[str]) -> int:
    if len(argv) != 2:
        print("Usage: validate_temporal_packets.py fixtures.synthetic.json")
        return 2
    return validate_fixture_file(Path(argv[1]))


if __name__ == "__main__":
    raise SystemExit(main(sys.argv))
