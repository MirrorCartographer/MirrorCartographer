#!/usr/bin/env python3
"""
Mirror Cartographer falsifiable prediction packet validator.

Validates public-safe prediction packets that convert mechanism graphs into
measurable, failure-capable predictions before discovery-memory promotion.
This tool uses only the Python standard library.
"""

from __future__ import annotations

import json
import re
import sys
from pathlib import Path
from typing import Any

ALLOWED_PREDICTION_TYPES = {
    "temporal",
    "dose_response",
    "comparative",
    "threshold",
    "sequence",
    "negative_control",
}
ALLOWED_DIRECTIONS = {"increase", "decrease", "no_change", "nonlinear", "sequence_specific"}
ALLOWED_SOURCE_STATUS = {"synthetic", "primary", "secondary", "preprint", "institutional"}
ALLOWED_CLAIM_STATUS = {
    "proposed",
    "test_ready",
    "tested_supported",
    "tested_contradicted",
    "inconclusive",
}
ALLOWED_PRIVACY_STATUS = {"public_safe", "deidentified", "reject_private"}
ALLOWED_IMPLEMENTATION_STATUS = {"planned", "implemented", "validated"}
ALLOWED_TESTABILITY = {"low", "moderate", "high"}
PRIVATE_MARKERS = {
    "address",
    "phone",
    "email",
    "ssn",
    "diagnosis",
    "veterinary advice",
    "treatment plan",
    "raw transcript",
    "household",
    "location",
    "financial",
}

REQUIRED_FIELDS = {
    "schema_version",
    "record_type",
    "prediction_id",
    "mechanism_graph_id",
    "claim_id",
    "prediction_statement",
    "prediction_type",
    "measurable_variables",
    "expected_direction",
    "observation_window",
    "failure_condition",
    "alternative_outcomes",
    "source_status",
    "claim_status",
    "privacy_status",
    "missingness",
    "revision_reason",
    "implementation_status",
    "testability",
    "falsification_route",
    "next_executable_action",
}


def _text_blob(value: Any) -> str:
    if isinstance(value, dict):
        return " ".join(_text_blob(v) for v in value.values())
    if isinstance(value, list):
        return " ".join(_text_blob(v) for v in value)
    return str(value)


def validate_packet(packet: dict[str, Any]) -> list[str]:
    errors: list[str] = []

    missing = sorted(REQUIRED_FIELDS - set(packet))
    if missing:
        errors.append(f"missing required fields: {', '.join(missing)}")
        return errors

    if packet.get("schema_version") != "1.0":
        errors.append("schema_version must be 1.0")
    if packet.get("record_type") != "falsifiable_prediction_packet":
        errors.append("record_type must be falsifiable_prediction_packet")
    if not re.match(r"^pred_[a-z0-9_\-]+$", str(packet.get("prediction_id", ""))):
        errors.append("prediction_id must match ^pred_[a-z0-9_\\-]+$")

    if packet.get("prediction_type") not in ALLOWED_PREDICTION_TYPES:
        errors.append("prediction_type is unsupported")
    if packet.get("expected_direction") not in ALLOWED_DIRECTIONS:
        errors.append("expected_direction is unsupported")
    if packet.get("source_status") not in ALLOWED_SOURCE_STATUS:
        errors.append("source_status is unsupported")
    if packet.get("claim_status") not in ALLOWED_CLAIM_STATUS:
        errors.append("claim_status is unsupported")
    if packet.get("privacy_status") not in ALLOWED_PRIVACY_STATUS:
        errors.append("privacy_status is unsupported")
    if packet.get("privacy_status") == "reject_private":
        errors.append("privacy_status reject_private cannot enter public discovery memory")
    if packet.get("implementation_status") not in ALLOWED_IMPLEMENTATION_STATUS:
        errors.append("implementation_status is unsupported")
    if packet.get("testability") not in ALLOWED_TESTABILITY:
        errors.append("testability is unsupported")

    if len(str(packet.get("prediction_statement", ""))) < 40:
        errors.append("prediction_statement must be at least 40 characters")
    if len(str(packet.get("failure_condition", ""))) < 30:
        errors.append("failure_condition must be explicit and at least 30 characters")
    if len(str(packet.get("falsification_route", ""))) < 30:
        errors.append("falsification_route must be explicit and at least 30 characters")
    if len(str(packet.get("revision_reason", ""))) < 20:
        errors.append("revision_reason must be at least 20 characters")
    if len(str(packet.get("next_executable_action", ""))) < 20:
        errors.append("next_executable_action must be at least 20 characters")

    variables = packet.get("measurable_variables")
    if not isinstance(variables, list) or not variables:
        errors.append("measurable_variables must contain at least one variable")
    else:
        for index, variable in enumerate(variables):
            if not isinstance(variable, dict):
                errors.append(f"measurable_variables[{index}] must be an object")
                continue
            for field in ("name", "operational_definition", "unit_or_scale", "collection_method"):
                if not variable.get(field):
                    errors.append(f"measurable_variables[{index}].{field} is required")
            if len(str(variable.get("operational_definition", ""))) < 20:
                errors.append(f"measurable_variables[{index}].operational_definition is too short")
            if len(str(variable.get("collection_method", ""))) < 10:
                errors.append(f"measurable_variables[{index}].collection_method is too short")

    window = packet.get("observation_window")
    if not isinstance(window, dict):
        errors.append("observation_window must be an object")
    else:
        for field in ("start_rule", "end_rule", "minimum_repetitions"):
            if field not in window:
                errors.append(f"observation_window.{field} is required")
        if int(window.get("minimum_repetitions", 0) or 0) < 2:
            errors.append("observation_window.minimum_repetitions must be at least 2")

    alternatives = packet.get("alternative_outcomes")
    if not isinstance(alternatives, list) or not alternatives:
        errors.append("alternative_outcomes must contain at least one alternative")

    missingness = packet.get("missingness")
    if not isinstance(missingness, list):
        errors.append("missingness must be a list")

    blob = _text_blob(packet).lower()
    for marker in PRIVATE_MARKERS:
        if marker in blob:
            errors.append(f"possible private or advice-like marker found: {marker}")

    return errors


def load_packets(path: Path) -> list[dict[str, Any]]:
    data = json.loads(path.read_text(encoding="utf-8"))
    if isinstance(data, dict):
        return [data]
    if isinstance(data, list):
        if data and isinstance(data[0], dict) and "packet" in data[0]:
            return [item["packet"] for item in data]
        return data
    raise ValueError("Input must be a packet object, packet list, or fixture list")


def main(argv: list[str]) -> int:
    if len(argv) != 2:
        print("Usage: validate_prediction_packets.py <packet-or-fixture-json>", file=sys.stderr)
        return 2

    path = Path(argv[1])
    packets = load_packets(path)
    failed = False
    for index, packet in enumerate(packets):
        errors = validate_packet(packet)
        if errors:
            failed = True
            print(f"packet[{index}] FAIL")
            for error in errors:
                print(f"  - {error}")
        else:
            print(f"packet[{index}] PASS")
    return 1 if failed else 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv))
