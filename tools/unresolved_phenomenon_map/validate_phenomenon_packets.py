#!/usr/bin/env python3
"""Validate Mirror Cartographer unresolved phenomenon packets.

This validator is intentionally conservative. It accepts public-safe,
operationalized phenomenon records and rejects packets that are private,
unbounded, under-specified, or trying to behave like hypotheses before the
phenomenon rung has been stabilized.
"""

from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path
from typing import Any

ALLOWED_SOURCE_STATUS = {
    "synthetic",
    "public_primary",
    "public_secondary",
    "public_institutional",
    "deidentified_observation",
}

ALLOWED_CLAIM_STATUS = {
    "unresolved",
    "candidate_pattern",
    "rejected_as_unbounded",
}

ALLOWED_PATTERN_TYPES = {
    "temporal",
    "contextual",
    "transition",
    "dose_response_like",
    "interaction",
    "contradiction",
    "measurement_gap",
}

ALLOWED_VARIABLE_ROLES = {
    "input",
    "output",
    "context",
    "confounder",
    "stratifier",
}

LOW_INFORMATION_TERMS = {
    "none",
    "undefined",
    "unknown",
    "n/a",
    "breakthrough",
    "cure",
    "magic",
}

PRIVATE_MARKERS = {
    "raw transcript",
    "private_identifier",
    "address",
    "phone",
    "email",
    "diagnosis",
    "treatment plan",
}


def _text(value: Any) -> str:
    if value is None:
        return ""
    if isinstance(value, str):
        return value
    return json.dumps(value, sort_keys=True)


def _contains_any(text: str, markers: set[str]) -> bool:
    lower = text.lower()
    return any(marker in lower for marker in markers)


def validate_packet(packet: dict[str, Any]) -> list[str]:
    errors: list[str] = []

    if packet.get("schema_version") != "1.0":
        errors.append("schema_version must be 1.0")
    if packet.get("record_type") != "unresolved_phenomenon_packet":
        errors.append("record_type must be unresolved_phenomenon_packet")
    if packet.get("source_status") not in ALLOWED_SOURCE_STATUS:
        errors.append("source_status is not allowed")
    if packet.get("claim_status") not in ALLOWED_CLAIM_STATUS:
        errors.append("claim_status is not allowed")
    if packet.get("privacy_status") != "public_safe":
        errors.append("privacy_status must be public_safe for repository admission")

    missingness = packet.get("missingness")
    if not isinstance(missingness, list) or not missingness:
        errors.append("missingness must list at least one known gap")

    observed = packet.get("observed_pattern")
    if not isinstance(observed, dict):
        errors.append("observed_pattern must be an object")
    else:
        if len(_text(observed.get("description"))) < 20:
            errors.append("observed_pattern.description is too short")
        if observed.get("pattern_type") not in ALLOWED_PATTERN_TYPES:
            errors.append("observed_pattern.pattern_type is not allowed")
        if observed.get("time_window") in (None, ""):
            errors.append("observed_pattern.time_window is required")

    variables = packet.get("operational_variables")
    if not isinstance(variables, list) or len(variables) < 2:
        errors.append("at least two operational_variables are required")
    else:
        roles = set()
        for index, variable in enumerate(variables):
            if not isinstance(variable, dict):
                errors.append(f"operational_variables[{index}] must be an object")
                continue
            roles.add(variable.get("role"))
            if variable.get("role") not in ALLOWED_VARIABLE_ROLES:
                errors.append(f"operational_variables[{index}].role is not allowed")
            method = _text(variable.get("measurement_method"))
            unit = _text(variable.get("unit_or_scale"))
            name = _text(variable.get("name"))
            if _contains_any(" ".join([name, method, unit]), LOW_INFORMATION_TERMS):
                errors.append(f"operational_variables[{index}] contains low-information measurement language")
        if "output" not in roles:
            errors.append("at least one output variable is required")
        if not ({"input", "context"} & roles):
            errors.append("at least one input or context variable is required")

    boundaries = packet.get("boundary_conditions")
    if not isinstance(boundaries, list) or not boundaries:
        errors.append("boundary_conditions must not be empty")

    alternatives = packet.get("alternative_explanations")
    if not isinstance(alternatives, list) or len(alternatives) < 2:
        errors.append("at least two alternative_explanations are required")

    falsification = _text(packet.get("falsification_route"))
    if len(falsification) < 20 or _contains_any(falsification, LOW_INFORMATION_TERMS):
        errors.append("falsification_route must be concrete and non-empty")

    combined_text = json.dumps(packet, sort_keys=True).lower()
    if _contains_any(combined_text, PRIVATE_MARKERS):
        errors.append("packet contains private or advice-like markers")

    return errors


def load_packets(path: Path) -> list[dict[str, Any]]:
    with path.open("r", encoding="utf-8") as handle:
        payload = json.load(handle)
    if isinstance(payload, dict):
        return [payload]
    if isinstance(payload, list):
        return payload
    raise TypeError("fixture file must contain one packet object or a list of packets")


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description="Validate unresolved phenomenon packets")
    parser.add_argument("path", type=Path, help="JSON packet or fixture file")
    args = parser.parse_args(argv)

    failures = 0
    for packet in load_packets(args.path):
        packet_id = packet.get("packet_id", "<missing packet_id>")
        errors = validate_packet(packet)
        if errors:
            failures += 1
            print(f"FAIL {packet_id}")
            for error in errors:
                print(f"  - {error}")
        else:
            print(f"PASS {packet_id}")

    return 1 if failures else 0


if __name__ == "__main__":
    sys.exit(main())
