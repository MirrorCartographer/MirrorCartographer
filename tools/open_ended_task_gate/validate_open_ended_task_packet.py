#!/usr/bin/env python3
"""Validate Mirror Cartographer open-ended scientific task packets.

This gate separates answer-production from discovery-task admission. It is
public-safe and intended for synthetic or public research-organization packets.
"""

from __future__ import annotations

import json
import sys
from pathlib import Path
from typing import Any

REQUIRED_TOP_LEVEL = {
    "packet_id",
    "task_claim",
    "task_kind",
    "source_status",
    "claim_status",
    "privacy_status",
    "dataset_boundary",
    "measurable_variables",
    "hypothesis_decomposition",
    "exploratory_steps",
    "validation_plan",
    "falsification_route",
    "missingness",
    "revision_reason",
    "implementation_status",
    "next_executable_action",
}

ALLOWED_TASK_KINDS = {
    "literature_synthesis",
    "dataset_exploration",
    "hypothesis_generation",
    "mechanistic_modeling",
    "benchmark_design",
    "workflow_validation",
}

ALLOWED_PRIVACY = {"public_safe", "synthetic_only", "deidentified_required"}


def validate_packet(packet: dict[str, Any]) -> list[str]:
    errors: list[str] = []
    missing = sorted(REQUIRED_TOP_LEVEL - packet.keys())
    if missing:
        errors.append(f"missing required fields: {', '.join(missing)}")
        return errors

    if packet["task_kind"] not in ALLOWED_TASK_KINDS:
        errors.append("task_kind is not supported")

    if packet["privacy_status"] not in ALLOWED_PRIVACY:
        errors.append("privacy_status must be public_safe, synthetic_only, or deidentified_required")

    boundary = packet.get("dataset_boundary", {})
    if boundary.get("raw_private_data_allowed") is not False:
        errors.append("raw private data must not be allowed")
    if boundary.get("access_level") not in {"public", "synthetic", "restricted", "none"}:
        errors.append("dataset_boundary.access_level is invalid")

    variables = packet.get("measurable_variables", [])
    if not isinstance(variables, list) or len(variables) < 2:
        errors.append("at least two measurable_variables are required")
    else:
        for index, variable in enumerate(variables):
            for field in ("name", "measurement_method", "success_direction"):
                if not variable.get(field):
                    errors.append(f"measurable_variables[{index}] missing {field}")

    decomposition = packet.get("hypothesis_decomposition", [])
    if not isinstance(decomposition, list) or len(decomposition) < 2:
        errors.append("at least two hypothesis_decomposition items are required")

    exploratory_steps = packet.get("exploratory_steps", [])
    if not isinstance(exploratory_steps, list) or len(exploratory_steps) < 2:
        errors.append("at least two exploratory_steps are required")

    if len(str(packet.get("validation_plan", ""))) < 30:
        errors.append("validation_plan is too thin")
    if len(str(packet.get("falsification_route", ""))) < 30:
        errors.append("falsification_route is too thin")
    if len(str(packet.get("revision_reason", ""))) < 15:
        errors.append("revision_reason is too thin")

    return errors


def main(argv: list[str]) -> int:
    if len(argv) != 2:
        print("usage: validate_open_ended_task_packet.py <packet-or-fixtures.json>", file=sys.stderr)
        return 2

    payload = json.loads(Path(argv[1]).read_text(encoding="utf-8"))
    fixtures = payload.get("fixtures") if isinstance(payload, dict) else None

    if fixtures is not None:
        failed = 0
        for fixture in fixtures:
            errors = validate_packet(fixture["packet"])
            actual = "pass" if not errors else "fail"
            expected = fixture["expected"]
            if actual != expected:
                failed += 1
                print(f"FAIL {fixture['name']}: expected {expected}, got {actual}; errors={errors}")
            else:
                print(f"OK {fixture['name']}: {actual}")
        return 1 if failed else 0

    errors = validate_packet(payload)
    if errors:
        for error in errors:
            print(f"ERROR: {error}")
        return 1
    print("OK open-ended task packet passed")
    return 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv))
