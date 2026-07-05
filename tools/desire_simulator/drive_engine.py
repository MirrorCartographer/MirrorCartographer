#!/usr/bin/env python3
"""
MC Drive Selection Engine

This tool simulates desire-like direction without claiming consciousness.
It scores candidate build actions by explicit drives and returns the next action
MC should build, test, or log.

Drives:
- curiosity
- care
- novelty
- uncertainty
- usefulness
- contradiction
- executability
- evidence_gain
- discovery_potential

Use only public-safe candidate descriptions.
"""

from __future__ import annotations

from dataclasses import dataclass, asdict
from datetime import datetime, timezone
from typing import Dict, List, Optional
import argparse
import json

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
    next_executable_action: str
    falsification_route: str
    measurable_variables: List[str]
    drives: Dict[str, float]


def validate(candidate: Candidate) -> List[str]:
    errors = []
    required = [
        "id",
        "title",
        "action_type",
        "description",
        "source_status",
        "claim_status",
        "privacy_status",
        "missingness",
        "revision_reason",
        "next_executable_action",
        "falsification_route",
    ]
    for field_name in required:
        if not str(getattr(candidate, field_name, "")).strip():
            errors.append(f"missing {field_name}")
    for drive in DRIVES:
        value = candidate.drives.get(drive)
        if not isinstance(value, (int, float)) or value < 0 or value > 1:
            errors.append(f"drive {drive} must be a number from 0 to 1")
    return errors


def score(candidate: Candidate) -> Dict[str, object]:
    errors = validate(candidate)
    if errors:
        return {"id": candidate.id, "valid": False, "errors": errors, "score": 0}

    weighted = {drive: candidate.drives[drive] * WEIGHTS[drive] for drive in DRIVES}
    base = sum(weighted.values()) / sum(WEIGHTS.values())
    variable_bonus = min(0.1, 0.02 * len(candidate.measurable_variables))
    final = min(1.0, base + variable_bonus)

    return {
        "id": candidate.id,
        "valid": True,
        "score": round(final, 4),
        "weighted_drives": {k: round(v, 4) for k, v in weighted.items()},
    }


def choose(candidates: List[Candidate]) -> Dict[str, object]:
    scored = [(candidate, score(candidate)) for candidate in candidates]
    valid = [(candidate, item) for candidate, item in scored if item["valid"]]
    if not valid:
        return {"selected": None, "errors": [item for _, item in scored]}

    valid.sort(key=lambda pair: pair[1]["score"], reverse=True)
    selected, selected_score = valid[0]

    return {
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
            "next_executable_action": selected.next_executable_action,
            "falsification_route": selected.falsification_route,
            "measurable_variables": selected.measurable_variables,
            "weighted_drives": selected_score["weighted_drives"],
        },
        "rejected": [
            {
                "id": candidate.id,
                "title": candidate.title,
                "score": item["score"],
                "reason": "lower weighted drive score",
            }
            for candidate, item in valid[1:]
        ],
    }


def load_candidates(path: str) -> List[Candidate]:
    with open(path, "r", encoding="utf-8") as handle:
        payload = json.load(handle)
    rows = payload["candidates"] if isinstance(payload, dict) else payload
    return [Candidate(**row) for row in rows]


def main(argv: Optional[List[str]] = None) -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("candidate_file")
    args = parser.parse_args(argv)
    result = choose(load_candidates(args.candidate_file))
    print(json.dumps(result, indent=2, ensure_ascii=False))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
