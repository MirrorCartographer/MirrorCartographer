#!/usr/bin/env python3
"""
Validate Mirror Cartographer contradiction records.

This validator intentionally uses only the Python standard library so it can run
inside minimal CI, local scripts, and constrained research environments.
It enforces the project-specific contract expressed in the JSON schema and adds
semantic checks that plain JSON Schema cannot reliably express without extra
runtime dependencies.
"""

from __future__ import annotations

from dataclasses import dataclass
from datetime import datetime
from pathlib import Path
from typing import Any, Dict, Iterable, List, Tuple
import argparse
import json
import re
import sys

ID_RE = re.compile(r"^cr-[0-9]{4}-[0-9]{2}-[0-9]{2}-[a-z0-9-]+$")

REQUIRED_FIELDS = [
    "schema_version",
    "record_type",
    "id",
    "timestamp_utc",
    "title",
    "hypothesis_reference",
    "source_status",
    "claim_status",
    "privacy_status",
    "missingness",
    "revision_reason",
    "implementation_status",
    "testability",
    "evidence_strength",
    "contradiction_status",
    "contradiction_summary",
    "expected_result",
    "observed_result",
    "possible_explanations",
    "measurable_variables",
    "falsification_route",
    "next_executable_action",
    "linked_artifacts",
]

ALLOWED = {
    "source_status": {
        "synthetic_fixture",
        "public_source_map",
        "assistant_generated_public_safe",
        "repository_internal_public_safe",
    },
    "claim_status": {
        "failed_hypothesis",
        "contradicted_hypothesis",
        "ambiguous_result",
        "needs_replication",
        "engineering_regression",
    },
    "privacy_status": {
        "public_safe",
        "synthetic_only",
        "public_source_only",
        "abstracted_no_private_details",
    },
    "implementation_status": {
        "schema_only",
        "fixture_only",
        "validator_ready",
        "tested",
        "integrated",
    },
    "testability": {"high", "medium", "low"},
    "evidence_strength": {"synthetic", "weak", "moderate", "strong", "replicated"},
    "contradiction_status": {
        "not_a_contradiction",
        "candidate_contradiction",
        "confirmed_contradiction",
        "ambiguous_missing_data",
    },
    "direction": {"increase", "decrease", "stable", "present", "absent", "unknown"},
    "measurement_status": {"measured", "proxy", "missing", "simulated"},
}


@dataclass
class ValidationResult:
    path: str
    ok: bool
    errors: List[str]
    warnings: List[str]


def load_records(path: Path) -> List[Dict[str, Any]]:
    payload = json.loads(path.read_text(encoding="utf-8"))
    if isinstance(payload, dict) and "records" in payload:
        records = payload["records"]
    elif isinstance(payload, list):
        records = payload
    elif isinstance(payload, dict):
        records = [payload]
    else:
        raise ValueError("input must be an object, array, or object with records[]")
    if not isinstance(records, list):
        raise ValueError("records must be a list")
    return records


def validate_record(record: Dict[str, Any]) -> Tuple[List[str], List[str]]:
    errors: List[str] = []
    warnings: List[str] = []

    for field in REQUIRED_FIELDS:
        if field not in record:
            errors.append(f"missing required field: {field}")

    if errors:
        return errors, warnings

    extra_fields = sorted(set(record) - set(REQUIRED_FIELDS))
    if extra_fields:
        errors.append("unexpected fields: " + ", ".join(extra_fields))

    if record["schema_version"] != "1.0.0":
        errors.append("schema_version must be 1.0.0")
    if record["record_type"] != "contradiction_record":
        errors.append("record_type must be contradiction_record")
    if not isinstance(record["id"], str) or not ID_RE.match(record["id"]):
        errors.append("id must match cr-YYYY-MM-DD-slug")

    try:
        datetime.fromisoformat(str(record["timestamp_utc"]).replace("Z", "+00:00"))
    except ValueError:
        errors.append("timestamp_utc must be ISO8601 date-time")

    for field in [
        "source_status",
        "claim_status",
        "privacy_status",
        "implementation_status",
        "testability",
        "evidence_strength",
        "contradiction_status",
    ]:
        if record[field] not in ALLOWED[field]:
            errors.append(f"invalid {field}: {record[field]}")

    for field, min_len in [
        ("title", 8),
        ("hypothesis_reference", 3),
        ("revision_reason", 10),
        ("contradiction_summary", 20),
        ("expected_result", 10),
        ("observed_result", 10),
        ("falsification_route", 20),
        ("next_executable_action", 12),
    ]:
        if not isinstance(record[field], str) or len(record[field].strip()) < min_len:
            errors.append(f"{field} must be a string of at least {min_len} chars")

    for field in ["missingness", "possible_explanations", "linked_artifacts"]:
        if not isinstance(record[field], list):
            errors.append(f"{field} must be a list")
    if isinstance(record["missingness"], list) and not record["missingness"]:
        errors.append("missingness must not be empty")
    if isinstance(record["possible_explanations"], list) and not record["possible_explanations"]:
        errors.append("possible_explanations must not be empty")

    variables = record["measurable_variables"]
    if not isinstance(variables, list) or not variables:
        errors.append("measurable_variables must be a non-empty list")
    elif isinstance(variables, list):
        for idx, variable in enumerate(variables):
            prefix = f"measurable_variables[{idx}]"
            if not isinstance(variable, dict):
                errors.append(f"{prefix} must be an object")
                continue
            required_variable_fields = {
                "name",
                "unit",
                "expected_direction",
                "observed_direction",
                "measurement_status",
            }
            missing = required_variable_fields - set(variable)
            extra = set(variable) - required_variable_fields
            if missing:
                errors.append(f"{prefix} missing: " + ", ".join(sorted(missing)))
            if extra:
                errors.append(f"{prefix} unexpected: " + ", ".join(sorted(extra)))
            if variable.get("expected_direction") not in ALLOWED["direction"]:
                errors.append(f"{prefix}.expected_direction invalid")
            if variable.get("observed_direction") not in ALLOWED["direction"]:
                errors.append(f"{prefix}.observed_direction invalid")
            if variable.get("measurement_status") not in ALLOWED["measurement_status"]:
                errors.append(f"{prefix}.measurement_status invalid")

    contradiction_status = record["contradiction_status"]
    claim_status = record["claim_status"]
    evidence_strength = record["evidence_strength"]

    if contradiction_status == "confirmed_contradiction":
        if claim_status not in {"failed_hypothesis", "contradicted_hypothesis", "engineering_regression"}:
            errors.append("confirmed_contradiction requires failed, contradicted, or engineering_regression claim_status")
        if evidence_strength not in {"moderate", "strong", "replicated"}:
            errors.append("confirmed_contradiction requires moderate, strong, or replicated evidence_strength")

    if contradiction_status == "ambiguous_missing_data":
        if claim_status not in {"ambiguous_result", "needs_replication"}:
            errors.append("ambiguous_missing_data requires ambiguous_result or needs_replication claim_status")

    if contradiction_status == "not_a_contradiction":
        warnings.append("record is valid but should not be stored as a contradiction-ledger failure unless retained as a control fixture")

    return errors, warnings


def validate_file(path: Path) -> ValidationResult:
    errors: List[str] = []
    warnings: List[str] = []
    try:
        records = load_records(path)
    except Exception as exc:  # noqa: BLE001 - CLI should report parse errors directly.
        return ValidationResult(str(path), False, [f"cannot load JSON: {exc}"], [])

    seen_ids = set()
    for index, record in enumerate(records):
        if not isinstance(record, dict):
            errors.append(f"record[{index}] must be an object")
            continue
        record_errors, record_warnings = validate_record(record)
        record_id = record.get("id", f"record[{index}]")
        for error in record_errors:
            errors.append(f"{record_id}: {error}")
        for warning in record_warnings:
            warnings.append(f"{record_id}: {warning}")
        if record_id in seen_ids:
            errors.append(f"{record_id}: duplicate id")
        seen_ids.add(record_id)

    return ValidationResult(str(path), not errors, errors, warnings)


def main(argv: List[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description="Validate MC contradiction ledger records.")
    parser.add_argument("paths", nargs="+", help="JSON files to validate")
    args = parser.parse_args(argv)

    exit_code = 0
    for path_text in args.paths:
        result = validate_file(Path(path_text))
        status = "OK" if result.ok else "FAIL"
        print(f"{status} {result.path}")
        for warning in result.warnings:
            print(f"  warning: {warning}")
        for error in result.errors:
            print(f"  error: {error}")
        if not result.ok:
            exit_code = 1
    return exit_code


if __name__ == "__main__":
    raise SystemExit(main())
