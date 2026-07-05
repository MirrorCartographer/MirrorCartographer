#!/usr/bin/env python3
"""
Validate MC drive candidate files without external dependencies.

This intentionally avoids requiring jsonschema so it can run in constrained
automation, local, and CI environments. It checks the same practical contract as
candidate_schema.json:

- public-safe boundary labels exist
- action type is known
- privacy status is constrained
- drives are complete and between 0 and 1
- measurable variables, falsification route, testability, and acceptance criteria exist

Exit codes:
0 valid
1 invalid candidate file
2 unreadable or malformed JSON
"""

from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path
from typing import Any, Dict, List

REQUIRED_TOP_LEVEL = ["schema_version", "candidates"]
REQUIRED_CANDIDATE_FIELDS = [
    "id",
    "title",
    "action_type",
    "description",
    "source_status",
    "claim_status",
    "privacy_status",
    "missingness",
    "revision_reason",
    "implementation_status",
    "testability",
    "next_executable_action",
    "falsification_route",
    "measurable_variables",
    "acceptance_criteria",
    "drives",
]
DRIVES = [
    "curiosity",
    "care",
    "novelty",
    "uncertainty",
    "usefulness",
    "contradiction",
    "executability",
    "evidence_gain",
    "discovery_potential",
]
ACTION_TYPES = {
    "schema",
    "validator",
    "test_harness",
    "fixture_generator",
    "cli_script",
    "ui_contract",
    "accessibility_fix",
    "provenance_packet_builder",
    "retrieval_boundary_checker",
    "evaluation_runner",
    "prototype_plan",
}
PRIVACY_STATUSES = {"public-safe", "synthetic", "abstracted", "public-source-only"}


def is_non_empty_string(value: Any) -> bool:
    return isinstance(value, str) and bool(value.strip())


def validate_string_array(value: Any, path: str) -> List[str]:
    errors: List[str] = []
    if not isinstance(value, list) or len(value) == 0:
        return [f"{path} must be a non-empty array"]
    for index, item in enumerate(value):
        if not is_non_empty_string(item):
            errors.append(f"{path}[{index}] must be a non-empty string")
    return errors


def validate_candidate(candidate: Any, index: int) -> List[str]:
    prefix = f"candidates[{index}]"
    errors: List[str] = []

    if not isinstance(candidate, dict):
        return [f"{prefix} must be an object"]

    for field in REQUIRED_CANDIDATE_FIELDS:
        if field not in candidate:
            errors.append(f"{prefix}.{field} is required")

    for field in REQUIRED_CANDIDATE_FIELDS:
        if field in {"measurable_variables", "acceptance_criteria", "drives"}:
            continue
        if field in candidate and not is_non_empty_string(candidate[field]):
            errors.append(f"{prefix}.{field} must be a non-empty string")

    if candidate.get("action_type") not in ACTION_TYPES:
        errors.append(f"{prefix}.action_type must be one of {sorted(ACTION_TYPES)}")

    if candidate.get("privacy_status") not in PRIVACY_STATUSES:
        errors.append(f"{prefix}.privacy_status must be one of {sorted(PRIVACY_STATUSES)}")

    if "measurable_variables" in candidate:
        errors.extend(validate_string_array(candidate["measurable_variables"], f"{prefix}.measurable_variables"))

    if "acceptance_criteria" in candidate:
        errors.extend(validate_string_array(candidate["acceptance_criteria"], f"{prefix}.acceptance_criteria"))

    drives = candidate.get("drives")
    if not isinstance(drives, dict):
        errors.append(f"{prefix}.drives must be an object")
    else:
        for drive in DRIVES:
            value = drives.get(drive)
            if not isinstance(value, (int, float)) or value < 0 or value > 1:
                errors.append(f"{prefix}.drives.{drive} must be a number from 0 to 1")
        for extra in sorted(set(drives) - set(DRIVES)):
            errors.append(f"{prefix}.drives.{extra} is not an allowed drive")

    return errors


def validate_payload(payload: Any) -> List[str]:
    errors: List[str] = []

    if not isinstance(payload, dict):
        return ["root must be an object"]

    for field in REQUIRED_TOP_LEVEL:
        if field not in payload:
            errors.append(f"root.{field} is required")

    if payload.get("schema_version") != "1.0.0":
        errors.append("root.schema_version must be 1.0.0")

    candidates = payload.get("candidates")
    if not isinstance(candidates, list) or len(candidates) == 0:
        errors.append("root.candidates must be a non-empty array")
    elif isinstance(candidates, list):
        seen_ids = set()
        for index, candidate in enumerate(candidates):
            errors.extend(validate_candidate(candidate, index))
            if isinstance(candidate, dict):
                candidate_id = candidate.get("id")
                if candidate_id in seen_ids:
                    errors.append(f"candidates[{index}].id duplicates {candidate_id}")
                seen_ids.add(candidate_id)

    return errors


def main() -> int:
    parser = argparse.ArgumentParser(description="Validate an MC drive candidate JSON file.")
    parser.add_argument("candidate_file", help="Path to candidate JSON file")
    args = parser.parse_args()

    path = Path(args.candidate_file)
    try:
        payload = json.loads(path.read_text(encoding="utf-8"))
    except Exception as exc:
        print(f"UNREADABLE: {path}: {exc}")
        return 2

    errors = validate_payload(payload)
    if errors:
        print("INVALID")
        for error in errors:
            print(f"- {error}")
        return 1

    print(f"VALID: {path}")
    print(f"candidate_count={len(payload['candidates'])}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
