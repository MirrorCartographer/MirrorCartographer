#!/usr/bin/env python3
"""Public-safe hypothesis novelty validator for Mirror Cartographer discovery builds.

The gate rejects hypotheses that merely rename a baseline explanation, lack a
separating test, or cross the public-safety boundary.
"""

from __future__ import annotations

import json
import re
import sys
from pathlib import Path
from typing import Any, Dict, List, Tuple

REQUIRED_FIELDS = {
    "hypothesis_id",
    "hypothesis_statement",
    "baseline_explanations",
    "novelty_delta",
    "testable_difference",
    "acceptance_criteria",
    "privacy_status",
    "source_status",
    "claim_status",
}

PUBLIC_ALLOWED = {"public"}
SOURCE_ALLOWED = {"synthetic", "public_abstraction", "literature_derived"}
CLAIM_ALLOWED = {"proposed", "rejected", "superseded"}
PRIVATE_MARKERS = {
    "address",
    "location",
    "credential",
    "diagnosis",
    "veterinary",
    "animal-care",
    "household",
    "financial",
    "relationship",
    "transcript",
    "private person",
}


def normalize(text: str) -> str:
    return re.sub(r"[^a-z0-9]+", " ", text.lower()).strip()


def token_set(text: str) -> set[str]:
    return set(normalize(text).split())


def jaccard(a: str, b: str) -> float:
    left = token_set(a)
    right = token_set(b)
    if not left and not right:
        return 1.0
    if not left or not right:
        return 0.0
    return len(left & right) / len(left | right)


def contains_private_marker(packet: Dict[str, Any]) -> bool:
    joined = normalize(json.dumps(packet, sort_keys=True))
    return any(marker in joined for marker in PRIVATE_MARKERS)


def validate_packet(packet: Dict[str, Any]) -> Tuple[bool, List[str]]:
    errors: List[str] = []

    missing = sorted(REQUIRED_FIELDS - set(packet))
    if missing:
        errors.append(f"missing required fields: {', '.join(missing)}")
        return False, errors

    if packet["privacy_status"] not in PUBLIC_ALLOWED:
        errors.append("privacy_status must be public")
    if packet["source_status"] not in SOURCE_ALLOWED:
        errors.append("source_status is not recognized")
    if packet["claim_status"] not in CLAIM_ALLOWED:
        errors.append("claim_status is not recognized")

    baselines = packet.get("baseline_explanations")
    criteria = packet.get("acceptance_criteria")
    if not isinstance(baselines, list) or not baselines:
        errors.append("baseline_explanations must be a non-empty list")
    if not isinstance(criteria, list) or not criteria:
        errors.append("acceptance_criteria must be a non-empty list")

    for field in ["hypothesis_id", "hypothesis_statement", "novelty_delta", "testable_difference"]:
        if not isinstance(packet.get(field), str) or not packet[field].strip():
            errors.append(f"{field} must be a non-empty string")

    if contains_private_marker(packet):
        errors.append("packet contains a private-safety marker")

    if isinstance(baselines, list):
        novelty = packet.get("novelty_delta", "")
        statement = packet.get("hypothesis_statement", "")
        for baseline in baselines:
            if not isinstance(baseline, str) or not baseline.strip():
                errors.append("each baseline explanation must be a non-empty string")
                continue
            if jaccard(novelty, baseline) >= 0.80:
                errors.append("novelty_delta substantially restates a baseline explanation")
            if jaccard(statement, baseline) >= 0.90:
                errors.append("hypothesis_statement substantially restates a baseline explanation")

    testable = packet.get("testable_difference", "")
    if isinstance(testable, str) and len(token_set(testable)) < 6:
        errors.append("testable_difference is too underspecified to separate hypotheses")

    return not errors, errors


def main(path: str) -> int:
    data = json.loads(Path(path).read_text())
    packets = data if isinstance(data, list) else [data]
    report = []
    ok = True
    for item in packets:
        packet = item.get("packet", item) if isinstance(item, dict) else item
        passed, errors = validate_packet(packet)
        expected = item.get("expected") if isinstance(item, dict) else None
        report.append({
            "fixture_id": item.get("fixture_id") if isinstance(item, dict) else packet.get("hypothesis_id"),
            "passed": passed,
            "expected": expected,
            "errors": errors,
        })
        if errors:
            ok = False
    print(json.dumps({"validator": "hypothesis_novelty", "results": report}, indent=2))
    return 0 if ok else 1


if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("usage: validate_hypothesis_novelty.py <packet-or-fixtures.json>", file=sys.stderr)
        raise SystemExit(2)
    raise SystemExit(main(sys.argv[1]))
