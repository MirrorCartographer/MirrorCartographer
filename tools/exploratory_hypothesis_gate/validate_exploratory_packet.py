#!/usr/bin/env python3
"""Validate Mirror Cartographer exploratory hypothesis gate packets.

This gate rejects static plausible claims that do not expose dataset boundaries,
measurable variables, exploratory steps, staged hypothesis updates, validation,
and falsification logic.
"""

from __future__ import annotations

import json
import sys
from pathlib import Path
from typing import Any, Dict, List, Tuple

REQUIRED_TOP_LEVEL = [
    "packet_id", "source_status", "claim_status", "privacy_status", "missingness",
    "revision_reason", "research_question", "dataset_boundary", "measurable_variables",
    "exploratory_steps", "hypothesis_updates", "validation_plan", "falsification_route",
    "evidence_strength", "implementation_status", "testability", "next_executable_action",
]

ALLOWED_SOURCE_STATUS = {"synthetic", "public_source", "private_source_redacted", "mixed_public_synthetic"}
ALLOWED_CLAIM_STATUS = {"infrastructure_hypothesis", "research_organization", "unsupported", "validated_in_fixture_only"}
ALLOWED_PRIVACY_STATUS = {"public_safe", "redacted", "reject_sensitive_detail"}
ALLOWED_DECISIONS = {"promote", "hold", "revise", "reject"}


def require(condition: bool, errors: List[str], message: str) -> None:
    if not condition:
        errors.append(message)


def validate_packet(packet: Dict[str, Any]) -> Tuple[bool, List[str]]:
    errors: List[str] = []

    for key in REQUIRED_TOP_LEVEL:
        require(key in packet, errors, f"missing required field: {key}")
    if errors:
        return False, errors

    require(packet["source_status"] in ALLOWED_SOURCE_STATUS, errors, "invalid source_status")
    require(packet["claim_status"] in ALLOWED_CLAIM_STATUS, errors, "invalid claim_status")
    require(packet["privacy_status"] in ALLOWED_PRIVACY_STATUS, errors, "invalid privacy_status")
    require(isinstance(packet["missingness"], list) and len(packet["missingness"]) >= 1, errors, "missingness must list at least one limitation")
    require(len(str(packet["research_question"])) >= 20, errors, "research_question too short")

    boundary = packet["dataset_boundary"]
    require(isinstance(boundary, dict), errors, "dataset_boundary must be an object")
    if isinstance(boundary, dict):
        for key in ["allowed_inputs", "excluded_inputs", "time_boundary", "population_or_system_boundary"]:
            require(key in boundary, errors, f"dataset_boundary missing {key}")
        require(isinstance(boundary.get("allowed_inputs"), list) and len(boundary.get("allowed_inputs", [])) >= 1, errors, "allowed_inputs must not be empty")
        require(isinstance(boundary.get("excluded_inputs"), list) and len(boundary.get("excluded_inputs", [])) >= 1, errors, "excluded_inputs must not be empty")

    variables = packet["measurable_variables"]
    require(isinstance(variables, list) and len(variables) >= 2, errors, "at least two measurable_variables required")
    if isinstance(variables, list):
        for idx, variable in enumerate(variables):
            require(isinstance(variable, dict), errors, f"variable {idx} must be object")
            if isinstance(variable, dict):
                for key in ["name", "unit_or_scale", "measurement_method", "expected_direction"]:
                    require(key in variable and str(variable[key]).strip(), errors, f"variable {idx} missing {key}")

    steps = packet["exploratory_steps"]
    require(isinstance(steps, list) and len(steps) >= 3, errors, "at least three exploratory_steps required")
    if isinstance(steps, list):
        for idx, step in enumerate(steps):
            require(isinstance(step, dict), errors, f"exploratory step {idx} must be object")
            if isinstance(step, dict):
                for key in ["step", "purpose", "artifact_expected"]:
                    require(key in step and str(step[key]).strip(), errors, f"exploratory step {idx} missing {key}")

    updates = packet["hypothesis_updates"]
    require(isinstance(updates, list) and len(updates) >= 2, errors, "at least two hypothesis_updates required")
    has_prior_nonfinal = False
    has_promote = False
    if isinstance(updates, list):
        for idx, update in enumerate(updates):
            require(isinstance(update, dict), errors, f"hypothesis update {idx} must be object")
            if isinstance(update, dict):
                for key in ["stage", "claim", "evidence_delta", "decision"]:
                    require(key in update and str(update[key]).strip(), errors, f"hypothesis update {idx} missing {key}")
                decision = update.get("decision")
                require(decision in ALLOWED_DECISIONS, errors, f"hypothesis update {idx} has invalid decision")
                if decision in {"hold", "revise", "reject"}:
                    has_prior_nonfinal = True
                if decision == "promote":
                    has_promote = True
                    require(has_prior_nonfinal, errors, "promote decision requires earlier hold, revise, or reject stage")

    require(has_promote, errors, "packet must include one promote decision after staged exploration")
    require(len(str(packet["validation_plan"])) >= 20, errors, "validation_plan too short")
    require(len(str(packet["falsification_route"])) >= 20, errors, "falsification_route too short")

    return len(errors) == 0, errors


def main() -> int:
    if len(sys.argv) != 2:
        print("Usage: validate_exploratory_packet.py <packet-or-fixtures.json>", file=sys.stderr)
        return 2

    path = Path(sys.argv[1])
    data = json.loads(path.read_text(encoding="utf-8"))
    packets: Dict[str, Dict[str, Any]] = data if isinstance(data, dict) else {"packet": data}

    failures = 0
    for name, packet in packets.items():
        ok, errors = validate_packet(packet)
        expected_invalid = name.startswith("invalid_")
        if expected_invalid and not ok:
            print(f"PASS {name}: invalid as expected")
        elif expected_invalid and ok:
            print(f"FAIL {name}: expected invalid but passed")
            failures += 1
        elif ok:
            print(f"PASS {name}")
        else:
            print(f"FAIL {name}: {'; '.join(errors)}")
            failures += 1

    return 1 if failures else 0


if __name__ == "__main__":
    raise SystemExit(main())
