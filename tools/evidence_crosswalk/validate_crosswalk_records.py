#!/usr/bin/env python3
"""Validate Mirror Cartographer evidence crosswalk records.

The validator intentionally uses only the Python standard library so it can run
inside lightweight automation or CI environments without dependency setup. It
performs the schema-critical checks needed by MC's public-safe discovery memory:
source/claim separation, privacy boundary enforcement, measurable variables,
limitations, falsification route, and reproducibility fields.
"""

from __future__ import annotations

import argparse
import json
import re
import sys
from pathlib import Path
from typing import Any

ALLOWED_SOURCE_TYPES = {
    "paper",
    "dataset",
    "benchmark",
    "repository",
    "institution",
    "protocol",
    "synthetic_fixture",
}
ALLOWED_SOURCE_STATUS = {"primary", "secondary", "preprint", "institutional", "synthetic"}
ALLOWED_CLAIM_STATUS = {"observational", "supported", "contradicted", "inconclusive"}
ALLOWED_PRIVACY_STATUS = {"public", "deidentified", "synthetic"}
ALLOWED_IMPLEMENTATION_STATUS = {"planned", "implemented", "validated", "rejected"}
ALLOWED_EVIDENCE_STRENGTH = {"low", "moderate", "high"}
ID_PATTERN = re.compile(r"^ecw_[a-z0-9_\-]{6,80}$")


def _require(condition: bool, message: str, errors: list[str]) -> None:
    if not condition:
        errors.append(message)


def validate_record(record: dict[str, Any]) -> list[str]:
    """Return a list of validation errors for a single crosswalk record."""
    errors: list[str] = []

    _require(record.get("schema_version") == "1.0", "schema_version must equal '1.0'", errors)
    _require(record.get("record_type") == "evidence_crosswalk", "record_type must equal 'evidence_crosswalk'", errors)

    record_id = record.get("id")
    _require(isinstance(record_id, str) and bool(ID_PATTERN.match(record_id)), "id must match ecw_[a-z0-9_-]{6,80}", errors)

    claim_reference = record.get("claim_reference")
    _require(isinstance(claim_reference, str) and len(claim_reference) >= 8, "claim_reference must be a non-empty claim identifier", errors)

    source = record.get("evidence_source")
    if not isinstance(source, dict):
        errors.append("evidence_source must be an object")
    else:
        _require(source.get("type") in ALLOWED_SOURCE_TYPES, "evidence_source.type is not allowed", errors)
        _require(isinstance(source.get("identifier"), str) and len(source["identifier"]) >= 3, "evidence_source.identifier is required", errors)
        _require(isinstance(source.get("version"), str) and len(source["version"]) >= 1, "evidence_source.version is required", errors)

    _require(record.get("source_status") in ALLOWED_SOURCE_STATUS, "source_status is not allowed", errors)
    _require(record.get("claim_status") in ALLOWED_CLAIM_STATUS, "claim_status is not allowed", errors)
    _require(record.get("privacy_status") in ALLOWED_PRIVACY_STATUS, "privacy_status is not allowed", errors)
    _require(record.get("implementation_status") in ALLOWED_IMPLEMENTATION_STATUS, "implementation_status is not allowed", errors)
    _require(record.get("evidence_strength") in ALLOWED_EVIDENCE_STRENGTH, "evidence_strength is not allowed", errors)

    reproducibility = record.get("reproducibility")
    if not isinstance(reproducibility, dict):
        errors.append("reproducibility must be an object")
    else:
        for key in ("artifacts_available", "open_data", "open_code"):
            _require(isinstance(reproducibility.get(key), bool), f"reproducibility.{key} must be boolean", errors)

    variables = record.get("measurable_variables")
    if not isinstance(variables, list) or not variables:
        errors.append("measurable_variables must contain at least one variable")
    else:
        for index, variable in enumerate(variables):
            if not isinstance(variable, dict):
                errors.append(f"measurable_variables[{index}] must be an object")
                continue
            _require(isinstance(variable.get("name"), str) and len(variable["name"]) >= 2, f"measurable_variables[{index}].name is required", errors)
            _require(isinstance(variable.get("units"), str) and len(variable["units"]) >= 1, f"measurable_variables[{index}].units is required", errors)
            _require(isinstance(variable.get("measurement_method"), str) and len(variable["measurement_method"]) >= 5, f"measurable_variables[{index}].measurement_method is required", errors)

    limitations = record.get("limitations")
    _require(isinstance(limitations, list) and len(limitations) >= 1 and all(isinstance(item, str) and len(item) >= 5 for item in limitations), "limitations must contain at least one clear limitation", errors)

    falsification_route = record.get("falsification_route")
    _require(isinstance(falsification_route, str) and len(falsification_route) >= 12, "falsification_route must be explicit", errors)

    linked_tests = record.get("linked_tests")
    _require(isinstance(linked_tests, list) and all(isinstance(item, str) for item in linked_tests), "linked_tests must be a list of strings", errors)

    revision_reason = record.get("revision_reason")
    _require(isinstance(revision_reason, str) and len(revision_reason) >= 8, "revision_reason must explain why the record exists", errors)

    if record.get("claim_status") == "supported":
        _require(bool(linked_tests), "supported claims require at least one linked test", errors)
        if isinstance(reproducibility, dict):
            _require(bool(reproducibility.get("artifacts_available")), "supported claims require reproducibility.artifacts_available=true", errors)

    return errors


def _extract_records(payload: Any) -> list[dict[str, Any]]:
    if isinstance(payload, list):
        return payload
    if isinstance(payload, dict):
        if payload.get("record_type") == "evidence_crosswalk":
            return [payload]
        if isinstance(payload.get("valid_records"), list):
            return payload["valid_records"]
    raise ValueError("Input must be a record, a list of records, or a fixture file with valid_records.")


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description="Validate MC evidence crosswalk records.")
    parser.add_argument("path", type=Path, help="JSON record file, record list, or fixture file")
    args = parser.parse_args(argv)

    payload = json.loads(args.path.read_text(encoding="utf-8"))
    records = _extract_records(payload)

    all_errors: list[str] = []
    for index, record in enumerate(records):
        errors = validate_record(record)
        all_errors.extend([f"record[{index}]: {error}" for error in errors])

    if all_errors:
        for error in all_errors:
            print(error, file=sys.stderr)
        return 1

    print(f"validated {len(records)} evidence_crosswalk record(s)")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
