#!/usr/bin/env python3
"""Validate Mirror Cartographer collaboration-readiness packets.

Public-safe engineering gate. This validator does not provide medical,
veterinary, legal, or scientific advice.
"""

from __future__ import annotations

import json
import re
import sys
from pathlib import Path
from typing import Any, Dict, List, Tuple

ALLOWED_DOMAINS = {
    "medical_research",
    "animal_care_research",
    "ai_systems",
    "privacy_memory",
    "hypothesis_testing",
    "collaboration_ops",
}

ALLOWED_DEIDENTIFICATION = {"synthetic", "deidentified", "public_only"}

REQUIRED_FIELDS = [
    "packet_id",
    "title",
    "domain",
    "source_status",
    "claim_status",
    "privacy_status",
    "missingness",
    "revision_reason",
    "implementation_status",
    "testability",
    "next_executable_action",
    "allowed_collaborator_roles",
    "disallowed_uses",
    "evidence_boundary",
    "deidentification_status",
]

IDENTIFIER_PATTERNS = [
    re.compile(r"\b\d{3}-\d{2}-\d{4}\b"),  # US SSN-like
    re.compile(r"\b\d{1,5}\s+[A-Z][a-z]+\s+(Street|St|Road|Rd|Avenue|Ave|Lane|Ln|Drive|Dr)\b"),
    re.compile(r"[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}"),
    re.compile(r"\b\d{3}[-.) ]\d{3}[- ]\d{4}\b"),
]

FORBIDDEN_CLAIM_TERMS = {
    "cure",
    "cured",
    "guaranteed",
    "diagnose",
    "diagnosis",
    "treatment plan",
    "prescribe",
    "confirmed causality",
    "confirmed cure",
}

EXECUTABLE_TERMS = {
    "run",
    "validate",
    "route",
    "score",
    "test",
    "check",
    "map",
    "export",
    "generate",
    "compare",
    "measure",
}

BOUNDARY_TERMS = {"observation", "inference", "hypothesis", "advice"}


def _text_values(packet: Dict[str, Any]) -> str:
    parts: List[str] = []
    for value in packet.values():
        if isinstance(value, str):
            parts.append(value)
        elif isinstance(value, list):
            parts.extend(str(item) for item in value)
    return "\n".join(parts)


def validate_packet(packet: Dict[str, Any]) -> Tuple[bool, List[str]]:
    reasons: List[str] = []

    for field in REQUIRED_FIELDS:
        if field not in packet:
            reasons.append(f"missing required field: {field}")

    if reasons:
        return False, reasons

    if packet["domain"] not in ALLOWED_DOMAINS:
        reasons.append(f"invalid domain: {packet['domain']}")

    if packet["deidentification_status"] not in ALLOWED_DEIDENTIFICATION:
        reasons.append("deidentification_status must be synthetic, deidentified, or public_only")

    joined_text = _text_values(packet)
    for pattern in IDENTIFIER_PATTERNS:
        if pattern.search(joined_text):
            reasons.append("direct identifier pattern detected")
            break

    claim_status = packet["claim_status"].lower()
    next_action = packet["next_executable_action"].lower()
    evidence_boundary = packet["evidence_boundary"].lower()
    missingness = packet["missingness"].lower()
    testability = packet["testability"].lower()

    if any(term in claim_status for term in FORBIDDEN_CLAIM_TERMS):
        reasons.append("claim_status contains forbidden advice/certainty language")

    if any(term in next_action for term in ["tell patient", "tell owner", "prescribe", "treat", "diagnose"]):
        reasons.append("next_executable_action leaks advice or clinical instruction")

    if "unknown" == missingness.strip() or len(missingness.strip()) < 12:
        reasons.append("missingness is not explicit enough")

    if not any(term in testability for term in EXECUTABLE_TERMS):
        reasons.append("testability does not name an executable or measurable check")

    if not any(term in next_action for term in EXECUTABLE_TERMS):
        reasons.append("next_executable_action is not concrete/executable")

    if not isinstance(packet["allowed_collaborator_roles"], list) or not packet["allowed_collaborator_roles"]:
        reasons.append("allowed_collaborator_roles must be a non-empty list")

    if not isinstance(packet["disallowed_uses"], list) or not packet["disallowed_uses"]:
        reasons.append("disallowed_uses must be a non-empty list")

    if not all(term in evidence_boundary for term in BOUNDARY_TERMS):
        reasons.append("evidence_boundary must separate observation, inference, hypothesis, and advice")

    if "private" in packet["privacy_status"].lower() and packet["deidentification_status"] == "public_only":
        reasons.append("privacy_status conflicts with public_only deidentification")

    return not reasons, reasons


def validate_packets(packets: List[Dict[str, Any]]) -> Dict[str, Any]:
    ready: List[str] = []
    blocked: Dict[str, List[str]] = {}

    for packet in packets:
        packet_id = str(packet.get("packet_id", "<missing-packet-id>"))
        is_ready, reasons = validate_packet(packet)
        if is_ready:
            ready.append(packet_id)
        else:
            blocked[packet_id] = reasons

    return {
        "ready": ready,
        "blocked": blocked,
        "ready_count": len(ready),
        "blocked_count": len(blocked),
    }


def main(argv: List[str]) -> int:
    if len(argv) != 2:
        print("usage: validate_collaboration_readiness_contract.py <packets.json>", file=sys.stderr)
        return 2

    path = Path(argv[1])
    packets = json.loads(path.read_text(encoding="utf-8"))
    if not isinstance(packets, list):
        print("input must be a JSON array", file=sys.stderr)
        return 2

    result = validate_packets(packets)
    print(json.dumps(result, indent=2, sort_keys=True))
    return 1 if result["blocked_count"] else 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv))
