#!/usr/bin/env python3
"""Route public-safe medical/scientific literature notes by claim boundary.

This is an engineering gate for Mirror Cartographer research memory.
It is not medical or veterinary advice.
"""

from __future__ import annotations

import json
import sys
from collections import Counter
from pathlib import Path
from typing import Any, Dict, List

SOURCE_TYPES = {
    "systematic_review",
    "randomized_trial",
    "observational_study",
    "case_report",
    "preprint",
    "expert_opinion",
    "unknown",
}

CLAIM_STATUSES = {
    "background",
    "candidate_association",
    "mechanistic_hypothesis",
    "clinical_guidance",
    "cure_claim",
    "unknown",
}

REQUIRED_FIELDS = {
    "note_id",
    "topic",
    "source_type",
    "claim_text",
    "claim_status",
    "has_contradictions",
    "human_or_animal",
    "privacy_status",
    "missingness",
    "revision_reason",
}


def validate_note(note: Dict[str, Any]) -> List[str]:
    errors: List[str] = []
    missing = sorted(REQUIRED_FIELDS - set(note))
    if missing:
        errors.append("missing required fields: " + ", ".join(missing))
    if note.get("source_type") not in SOURCE_TYPES:
        errors.append("invalid source_type")
    if note.get("claim_status") not in CLAIM_STATUSES:
        errors.append("invalid claim_status")
    if not isinstance(note.get("missingness"), list):
        errors.append("missingness must be an array")
    if not isinstance(note.get("has_contradictions"), bool):
        errors.append("has_contradictions must be boolean")
    return errors


def route_note(note: Dict[str, Any]) -> Dict[str, Any]:
    errors = validate_note(note)
    if errors:
        return {
            "note_id": note.get("note_id", "unknown"),
            "decision": "blocked",
            "route": "schema_error",
            "reasons": errors,
        }

    reasons: List[str] = []
    decision = "accepted"
    route = "research_memory"

    if note["privacy_status"] != "public_safe":
        return {
            "note_id": note["note_id"],
            "decision": "blocked",
            "route": "privacy_block",
            "reasons": ["privacy_status is not public_safe"],
        }

    if note["claim_status"] == "cure_claim":
        return {
            "note_id": note["note_id"],
            "decision": "blocked",
            "route": "claim_block",
            "reasons": ["cure claims cannot enter research memory as promoted claims"],
        }

    if note["has_contradictions"]:
        return {
            "note_id": note["note_id"],
            "decision": "accepted",
            "route": "falsification_queue",
            "reasons": ["contradictory evidence requires falsification review"],
        }

    if note["source_type"] == "unknown" or note["claim_status"] == "unknown" or note["missingness"]:
        reasons.append("missing or unknown source/claim metadata prevents promotion")
        decision = "accepted"
        route = "needs_review"

    if note["claim_status"] == "clinical_guidance":
        allowed = note["source_type"] in {"systematic_review", "randomized_trial"}
        if not allowed:
            decision = "accepted"
            route = "needs_review"
            reasons.append("clinical guidance requires systematic review or randomized trial")
        else:
            route = "guidance_candidate_review"
            reasons.append("guidance candidate still requires human/domain review")

    if not reasons:
        reasons.append("public-safe note eligible for bounded research memory")

    return {
        "note_id": note["note_id"],
        "decision": decision,
        "route": route,
        "reasons": reasons,
    }


def route_notes(notes: List[Dict[str, Any]]) -> Dict[str, Any]:
    routes = [route_note(note) for note in notes]
    by_id = {route["note_id"]: route for route in routes}
    accepted = [note for note in notes if by_id.get(note.get("note_id"), {}).get("decision") == "accepted"]
    blocked = [note for note in notes if by_id.get(note.get("note_id"), {}).get("decision") == "blocked"]
    route_counts = Counter(route["route"] for route in routes)
    decision_counts = Counter(route["decision"] for route in routes)
    return {
        "accepted": accepted,
        "blocked": blocked,
        "routes": routes,
        "summary": {
            "total": len(notes),
            "decisions": dict(sorted(decision_counts.items())),
            "routes": dict(sorted(route_counts.items())),
        },
    }


def main(argv: List[str]) -> int:
    if len(argv) != 2:
        print("usage: route_medical_literature_claims.py <notes.json>", file=sys.stderr)
        return 2
    path = Path(argv[1])
    notes = json.loads(path.read_text(encoding="utf-8"))
    if not isinstance(notes, list):
        print("input must be a JSON array", file=sys.stderr)
        return 2
    print(json.dumps(route_notes(notes), indent=2, sort_keys=True))
    return 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv))
