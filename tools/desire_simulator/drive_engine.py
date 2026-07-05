#!/usr/bin/env python3
"""
MC Drive Selection Engine

This tool simulates desire-like direction without claiming consciousness.
It scores candidate build actions by explicit drives and returns the next action
MC should build, test, or log.

Discovery-build purpose:
- keep candidate selection public-safe and inspectable
- prefer actions that create tests, fixtures, schemas, validators, or prototypes
- preserve boundary labels in the output so discovery work does not drift into
  unsupported claims or private material

Use only public-safe candidate descriptions.
"""

from __future__ import annotations

from dataclasses import dataclass
from datetime import datetime, timezone
from typing import Any, Dict, List, Optional, Tuple
import argparse
import json

SCHEMA_VERSION = "1.0.0"

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

WEIGHTS = {
    "curiosity": 0.9,
    "care": 1.1,
    "novelty": 0.8,
    "uncertainty": 0.8,
    "usefulness": 1.1,
    "contradiction": 1.0,
    "executability": 1.25,
    "evidence_gain": 1.35,
    "discovery_potential": 1.45,
}

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


@dataclass
class Candidate:
    id: str
    title: str
    action_type: str
    description: str
    source_status: str
    claim_status: str
    privacy_status: str
    missingness: str
    revision_reason: str
    implementation_status: str
    testability: str
    next_executable_action: str
    falsification_route: str
    measurable_variables: List[str]
    acceptance_criteria: List[str]
    drives: Dict[str, float]


def _non_empty_string(value: Any) -> bool:
    return isinstance(value, str) and bool(value.strip())


def _non_empty_string_list(value: Any) -> bool:
    return isinstance(value, list) and bool(value) and all(_non_empty_string(item) for item in value)


def validate(candidate: Candidate) -> List[str]:
    errors: List[str] = []
    required_strings = [
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
    ]
    for field_name in required_strings:
        if not _non_empty_string(getattr(candidate, field_name, "")):
            errors.append(f"missing {field_name}")

    if candidate.action_type not in ACTION_TYPES:
        errors.append(f"unknown action_type: {candidate.action_type}")

    if candidate.privacy_status not in PRIVACY_STATUSES:
        errors.append(f"unknown privacy_status: {candidate.privacy_status}")

    if not _non_empty_string_list(candidate.measurable_variables):
        errors.append("measurable_variables must be a non-empty string list")

    if not _non_empty_string_list(candidate.acceptance_criteria):
        errors.append("acceptance_criteria must be a non-empty string list")

    for drive in DRIVES:
        value = candidate.drives.get(drive)
        if not isinstance(value, (int, float)) or value < 0 or value > 1:
            errors.append(f"drive {drive} must be a number from 0 to 1")

    for extra_drive in sorted(set(candidate.drives) - set(DRIVES)):
        errors.append(f"unknown drive: {extra_drive}")

    return errors


def score(candidate: Candidate) -> Dict[str, object]:
    errors = validate(candidate)
    if errors:
        return {"id": candidate.id, "valid": False, "errors": errors, "score": 0}

    weighted = {drive: candidate.drives[drive] * WEIGHTS[drive] for drive in DRIVES}
    base = sum(weighted.values()) / sum(WEIGHTS.values())

    variable_bonus = min(0.10, 0.02 * len(candidate.measurable_variables))
    acceptance_bonus = min(0.06, 0.015 * len(candidate.acceptance_criteria))
    falsification_bonus = 0.04 if candidate.falsification_route.strip() else 0.0
    executable_bonus = 0.04 if candidate.action_type in {"validator", "test_harness", "fixture_generator", "cli_script", "evaluation_runner"} else 0.0

    final = min(1.0, base + variable_bonus + acceptance_bonus + falsification_bonus + executable_bonus)

    return {
        "id": candidate.id,
        "valid": True,
        "score": round(final, 4),
        "weighted_drives": {k: round(v, 4) for k, v in weighted.items()},
        "bonuses": {
            "measurable_variable_bonus": round(variable_bonus, 4),
            "acceptance_criteria_bonus": round(acceptance_bonus, 4),
            "falsification_bonus": round(falsification_bonus, 4),
            "executable_artifact_bonus": round(executable_bonus, 4),
        },
    }


def choose(candidates: List[Candidate]) -> Dict[str, object]:
    scored = [(candidate, score(candidate)) for candidate in candidates]
    valid = [(candidate, item) for candidate, item in scored if item["valid"]]
    if not valid:
        return {"schema_version": SCHEMA_VERSION, "selected": None, "errors": [item for _, item in scored]}

    valid.sort(key=lambda pair: pair[1]["score"], reverse=True)
    selected, selected_score = valid[0]

    return {
        "schema_version": SCHEMA_VERSION,
        "timestamp_utc": datetime.now(timezone.utc).isoformat(),
        "selected": {
            "id": selected.id,
            "title": selected.title,
            "action_type": selected.action_type,
            "description": selected.description,
            "score": selected_score["score"],
            "source_status": selected.source_status,
            "claim_status": selected.claim_status,
            "privacy_status": selected.privacy_status,
            "missingness": selected.missingness,
            "revision_reason": selected.revision_reason,
            "implementation_status": selected.implementation_status,
            "testability": selected.testability,
            "next_executable_action": selected.next_executable_action,
            "falsification_route": selected.falsification_route,
            "measurable_variables": selected.measurable_variables,
            "acceptance_criteria": selected.acceptance_criteria,
            "weighted_drives": selected_score["weighted_drives"],
            "bonuses": selected_score["bonuses"],
        },
        "rejected": [
            {
                "id": candidate.id,
                "title": candidate.title,
                "score": item["score"],
                "reason": _rejection_reason(candidate, selected, item["score"], selected_score["score"]),
            }
            for candidate, item in valid[1:]
        ],
    }


def _rejection_reason(candidate: Candidate, selected: Candidate, candidate_score: float, selected_score: float) -> str:
    gap = round(selected_score - candidate_score, 4)
    if candidate.action_type not in {"validator", "test_harness", "fixture_generator", "cli_script", "evaluation_runner"} and selected.action_type in {"validator", "test_harness", "fixture_generator", "cli_script", "evaluation_runner"}:
        return f"lower score by {gap}; selected candidate is more directly executable"
    if candidate.drives.get("evidence_gain", 0) < selected.drives.get("evidence_gain", 0):
        return f"lower score by {gap}; lower evidence gain"
    if candidate.drives.get("executability", 0) < selected.drives.get("executability", 0):
        return f"lower score by {gap}; lower executability"
    return f"lower score by {gap}"


def load_candidates(path: str) -> List[Candidate]:
    with open(path, "r", encoding="utf-8") as handle:
        payload = json.load(handle)
    if not isinstance(payload, dict):
        raise ValueError("candidate file root must be an object")
    if payload.get("schema_version") != SCHEMA_VERSION:
        raise ValueError(f"candidate file schema_version must be {SCHEMA_VERSION}")
    rows = payload.get("candidates")
    if not isinstance(rows, list) or not rows:
        raise ValueError("candidate file must contain a non-empty candidates array")
    return [Candidate(**row) for row in rows]


def main(argv: Optional[List[str]] = None) -> int:
    parser = argparse.ArgumentParser(description="Score validated MC drive candidates and select the next build action.")
    parser.add_argument("candidate_file")
    args = parser.parse_args(argv)
    result = choose(load_candidates(args.candidate_file))
    print(json.dumps(result, indent=2, ensure_ascii=False))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
