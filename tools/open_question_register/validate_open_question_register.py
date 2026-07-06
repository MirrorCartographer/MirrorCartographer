#!/usr/bin/env python3
"""Validate public-safe Mirror Cartographer open-question packets.

This component keeps uncertainty executable: a packet is admitted only when it is
bounded, measurable, privacy-safe, falsifiable, and explicitly still an open
question rather than a conclusion or advice claim.
"""

from __future__ import annotations

import json
import re
import sys
from pathlib import Path
from typing import Any, Dict, List, Tuple

ALLOWED_DOMAINS = {
    "longitudinal_pattern_tracking",
    "evidence_boundary_routing",
    "hypothesis_generation",
    "falsification",
    "medical_scientific_literature_organization",
    "animal_care_evidence",
    "privacy_preserving_research_memory",
    "collaboration_readiness",
}

REQUIRED_FIELDS = [
    "question_id",
    "domain",
    "question",
    "source_status",
    "claim_status",
    "privacy_status",
    "missingness",
    "variables",
    "evidence_refs",
    "falsification_route",
    "next_executable_action",
]

FORBIDDEN_PATTERNS = [
    r"\bwill cure\b",
    r"\bguaranteed\b",
    r"\bproves? that\b",
    r"\bdiagnose\b",
    r"\btreat(?:ment)? recommendation\b",
    r"\bexact address\b",
    r"\bfull name\b",
    r"\bphone number\b",
    r"\bssn\b",
]

QUESTION_RE = re.compile(r"\?$|\bwhich\b|\bwhat\b|\bdoes\b|\bdo\b|\bhow\b|\bwhen\b|\bwhether\b", re.I)


def load_packets(path: Path) -> List[Dict[str, Any]]:
    with path.open("r", encoding="utf-8") as handle:
        data = json.load(handle)
    if not isinstance(data, list):
        raise ValueError("Input must be a JSON array of open-question packets.")
    if not all(isinstance(item, dict) for item in data):
        raise ValueError("Every packet must be a JSON object.")
    return data


def contains_forbidden_language(packet: Dict[str, Any]) -> List[str]:
    text = json.dumps(packet, sort_keys=True).lower()
    hits = []
    for pattern in FORBIDDEN_PATTERNS:
        if re.search(pattern, text, flags=re.I):
            hits.append(pattern)
    return hits


def validate_packet(packet: Dict[str, Any]) -> Tuple[bool, List[str]]:
    errors: List[str] = []

    for field in REQUIRED_FIELDS:
        if field not in packet:
            errors.append(f"missing required field: {field}")

    if errors:
        return False, errors

    if packet["domain"] not in ALLOWED_DOMAINS:
        errors.append(f"unsupported domain: {packet['domain']}")

    if packet["claim_status"] != "open_question":
        errors.append("claim_status must be open_question")

    privacy_status = str(packet["privacy_status"]).lower()
    if "public_safe" not in privacy_status and "synthetic" not in privacy_status:
        errors.append("privacy_status must be public-safe or synthetic")

    question = str(packet["question"]).strip()
    if len(question) < 20 or not QUESTION_RE.search(question):
        errors.append("question must be phrased as a bounded question")

    if not isinstance(packet["missingness"], list) or len(packet["missingness"]) < 1:
        errors.append("missingness must list at least one uncertainty or data gap")

    if not isinstance(packet["variables"], list) or len(packet["variables"]) < 2:
        errors.append("variables must list at least two measurable variables")

    if not isinstance(packet["evidence_refs"], list) or len(packet["evidence_refs"]) < 1:
        errors.append("evidence_refs must list at least one source or synthetic fixture reference")

    if len(str(packet["falsification_route"]).strip()) < 20:
        errors.append("falsification_route must be specific enough to execute")

    if len(str(packet["next_executable_action"]).strip()) < 15:
        errors.append("next_executable_action must be concrete")

    forbidden_hits = contains_forbidden_language(packet)
    if forbidden_hits:
        errors.append("forbidden public-safety language found: " + ", ".join(forbidden_hits))

    return not errors, errors


def summarize(path: Path) -> Dict[str, Any]:
    packets = load_packets(path)
    results = []
    passed = 0

    for packet in packets:
        ok, errors = validate_packet(packet)
        if ok:
            passed += 1
        results.append(
            {
                "question_id": packet.get("question_id", "<missing>"),
                "status": "pass" if ok else "fail",
                "errors": errors,
            }
        )

    return {
        "component": "open_question_register",
        "input": str(path),
        "packet_count": len(packets),
        "passed": passed,
        "failed": len(packets) - passed,
        "results": results,
    }


def main(argv: List[str]) -> int:
    if len(argv) != 2:
        print("Usage: validate_open_question_register.py <packets.json>", file=sys.stderr)
        return 2

    summary = summarize(Path(argv[1]))
    print(json.dumps(summary, indent=2, sort_keys=True))
    return 0 if summary["failed"] == 0 else 1


if __name__ == "__main__":
    raise SystemExit(main(sys.argv))
