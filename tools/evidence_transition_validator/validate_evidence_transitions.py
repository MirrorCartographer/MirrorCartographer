#!/usr/bin/env python3
"""
Mirror Cartographer Evidence Transition Validator.

Validates public-safe evidence transition records against:
1. Required schema shape.
2. State-machine transition rules.
3. Privacy and overclaim boundary rules.

This is discovery infrastructure only. It is not a medical, veterinary,
diagnostic, treatment, or triage tool.
"""

from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path
from typing import Any, Dict, List, Tuple

ALLOWED_TRANSITIONS = {
    ("Observation", "Candidate Hypothesis"),
    ("Candidate Hypothesis", "Mechanistic Model"),
    ("Candidate Hypothesis", "Prediction"),
    ("Mechanistic Model", "Prediction"),
    ("Prediction", "Test Result"),
    ("Test Result", "Supported"),
    ("Test Result", "Contradicted"),
    ("Observation", "Inconclusive"),
    ("Candidate Hypothesis", "Inconclusive"),
    ("Mechanistic Model", "Inconclusive"),
    ("Prediction", "Inconclusive"),
    ("Test Result", "Inconclusive"),
}

TERMINAL_STATES = {"Supported", "Contradicted", "Inconclusive"}
BLOCKED_PRIVACY_STATUSES = {"blocked_private_or_sensitive"}

REQUIRED_FIELDS = {
    "schema_version",
    "record_type",
    "transition_id",
    "claim_id",
    "from_state",
    "to_state",
    "transition_reason",
    "source_status",
    "claim_status",
    "privacy_status",
    "evidence_strength",
    "measurable_variables",
    "falsification_route",
    "timestamp_utc",
    "provenance",
    "missingness",
    "next_executable_action",
}

VALID_STATES = {
    "Observation",
    "Candidate Hypothesis",
    "Mechanistic Model",
    "Prediction",
    "Test Result",
    "Supported",
    "Contradicted",
    "Inconclusive",
}


def load_json(path: Path) -> Any:
    with path.open("r", encoding="utf-8") as handle:
        return json.load(handle)


def validate_record(record: Dict[str, Any]) -> Tuple[bool, List[str]]:
    errors: List[str] = []

    missing = sorted(REQUIRED_FIELDS - set(record))
    if missing:
        errors.append(f"missing required fields: {', '.join(missing)}")

    if record.get("schema_version") != "1.0":
        errors.append("schema_version must be 1.0")

    if record.get("record_type") != "evidence_transition_record":
        errors.append("record_type must be evidence_transition_record")

    from_state = record.get("from_state")
    to_state = record.get("to_state")

    if from_state not in VALID_STATES:
        errors.append(f"invalid from_state: {from_state}")

    if to_state not in VALID_STATES:
        errors.append(f"invalid to_state: {to_state}")

    if from_state in TERMINAL_STATES:
        errors.append(f"terminal from_state cannot transition onward: {from_state}")

    if from_state in VALID_STATES and to_state in VALID_STATES:
        if (from_state, to_state) not in ALLOWED_TRANSITIONS:
            errors.append(f"illegal transition: {from_state} -> {to_state}")

    if to_state == "Supported" and from_state != "Test Result":
        errors.append("Supported can only be reached from Test Result")

    if to_state == "Contradicted" and from_state != "Test Result":
        errors.append("Contradicted can only be reached from Test Result")

    if record.get("privacy_status") in BLOCKED_PRIVACY_STATUSES:
        errors.append("privacy_status is blocked for public-safe discovery memory")

    variables = record.get("measurable_variables")
    if not isinstance(variables, list) or not variables:
        errors.append("at least one measurable variable is required")
    else:
        for index, variable in enumerate(variables):
            if not isinstance(variable, dict):
                errors.append(f"measurable_variables[{index}] must be an object")
                continue
            for field in ("name", "operational_definition", "expected_direction"):
                if not variable.get(field):
                    errors.append(f"measurable_variables[{index}] missing {field}")

    provenance = record.get("provenance")
    if not isinstance(provenance, list) or not provenance:
        errors.append("at least one provenance entry is required")

    falsification_route = record.get("falsification_route")
    if not isinstance(falsification_route, str) or len(falsification_route.strip()) < 20:
        errors.append("falsification_route must be a concrete sentence of at least 20 characters")

    return not errors, errors


def validate_file(path: Path) -> Dict[str, Any]:
    payload = load_json(path)
    records = payload.get("records") if isinstance(payload, dict) else payload
    if not isinstance(records, list):
        raise ValueError("Input must be a list of records or an object with a records list.")

    results = []
    passed = 0
    failed = 0

    for record in records:
        ok, errors = validate_record(record)
        result = {
            "transition_id": record.get("transition_id", "<missing>"),
            "claim_id": record.get("claim_id", "<missing>"),
            "from_state": record.get("from_state"),
            "to_state": record.get("to_state"),
            "status": "pass" if ok else "fail",
            "errors": errors,
        }
        results.append(result)
        if ok:
            passed += 1
        else:
            failed += 1

    return {
        "validator": "evidence_transition_validator.v1",
        "input_path": str(path),
        "record_count": len(records),
        "passed": passed,
        "failed": failed,
        "results": results,
    }


def main() -> int:
    parser = argparse.ArgumentParser(description="Validate MC evidence transition records.")
    parser.add_argument("path", type=Path, help="Path to JSON record list or fixture file.")
    parser.add_argument(
        "--allow-failures",
        action="store_true",
        help="Return exit code 0 even when some records fail. Useful for negative fixture tests.",
    )
    args = parser.parse_args()

    try:
        report = validate_file(args.path)
    except Exception as exc:  # pragma: no cover - defensive CLI boundary
        print(json.dumps({"status": "error", "error": str(exc)}, indent=2), file=sys.stderr)
        return 2

    print(json.dumps(report, indent=2))

    if report["failed"] and not args.allow_failures:
        return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
