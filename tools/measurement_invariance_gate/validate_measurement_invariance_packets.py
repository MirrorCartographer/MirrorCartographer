#!/usr/bin/env python3
"""Validate Mirror Cartographer measurement-invariance packets.

This public-safe validator prevents longitudinal discovery infrastructure from
promoting apparent trends when the variable, unit, instrument, protocol,
missingness interpretation, or temporal order changed without an explicit
normalization/calibration plan.
"""

from __future__ import annotations

import json
import sys
from pathlib import Path
from typing import Any

ALLOWED_MISSINGNESS = {
    "observed",
    "not_collected",
    "redacted",
    "not_applicable",
    "instrument_failed",
}


def load_json(path: str | Path) -> Any:
    with Path(path).open("r", encoding="utf-8") as handle:
        return json.load(handle)


def validate_packet(packet: dict[str, Any]) -> list[str]:
    errors: list[str] = []

    if packet.get("privacy_status") == "rejected_private":
        errors.append("privacy_status rejected_private cannot enter longitudinal comparison")

    if not packet.get("missingness", {}).get("declared"):
        errors.append("missingness must be declared")

    if not packet.get("missingness", {}).get("absence_is_not_negative_evidence"):
        errors.append("missingness must not be collapsed into negative evidence")

    series = packet.get("measurement_series", [])
    if not isinstance(series, list) or len(series) < 2:
        errors.append("measurement_series requires at least two records")
        return errors

    time_indices = [entry.get("time_index") for entry in series]
    if time_indices != sorted(time_indices):
        errors.append("measurement_series must be ordered by nondecreasing time_index")
    if len(set(time_indices)) != len(time_indices):
        errors.append("time_index values must be unique")

    variable_names = {entry.get("variable_name") for entry in series}
    units = {entry.get("unit") for entry in series}
    instruments = {entry.get("instrument") for entry in series}
    protocols = {entry.get("protocol") for entry in series}

    plan = packet.get("comparison_plan", {})
    normalization = plan.get("allowed_normalization", "none")

    if len(variable_names) != 1:
        errors.append("all records in a comparison packet must use the same variable_name")

    if plan.get("requires_same_unit") and len(units) != 1:
        if normalization != "unit_conversion_only":
            errors.append("unit changed without allowed unit conversion")

    if plan.get("requires_same_instrument") and len(instruments) != 1:
        if normalization != "protocol_specific_calibration":
            errors.append("instrument changed without protocol-specific calibration")

    if plan.get("requires_same_protocol") and len(protocols) != 1:
        if normalization != "protocol_specific_calibration":
            errors.append("protocol changed without protocol-specific calibration")

    observed = [entry for entry in series if entry.get("missingness_state") == "observed"]
    minimum_observed = plan.get("minimum_observed_points", 2)
    if len(observed) < minimum_observed:
        errors.append(
            f"observed point count {len(observed)} is below required minimum {minimum_observed}"
        )

    for idx, entry in enumerate(series):
        missingness_state = entry.get("missingness_state")
        value = entry.get("value")
        if missingness_state not in ALLOWED_MISSINGNESS:
            errors.append(f"record {idx} has invalid missingness_state {missingness_state!r}")
        if missingness_state == "observed" and value is None:
            errors.append(f"record {idx} is observed but value is null")
        if missingness_state != "observed" and value is not None:
            errors.append(f"record {idx} has non-null value despite missingness_state {missingness_state}")

    falsification_route = packet.get("falsification_route", "")
    if not isinstance(falsification_route, str) or len(falsification_route.strip()) < 20:
        errors.append("falsification_route must be explicit and at least 20 characters")

    return errors


def main(argv: list[str]) -> int:
    if len(argv) != 2:
        print("Usage: validate_measurement_invariance_packets.py <packet-or-fixtures.json>", file=sys.stderr)
        return 2

    payload = load_json(argv[1])
    cases = payload if isinstance(payload, list) else [{"name": "packet", "expect_pass": True, "packet": payload}]

    failed = 0
    for case in cases:
        name = case.get("name", "unnamed")
        expect_pass = bool(case.get("expect_pass", True))
        packet = case.get("packet", case)
        errors = validate_packet(packet)
        passed = not errors
        if passed != expect_pass:
            failed += 1
            print(f"FAIL {name}: expected pass={expect_pass}, got pass={passed}")
            for error in errors:
                print(f"  - {error}")
        else:
            print(f"PASS {name}")

    return 1 if failed else 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv))
