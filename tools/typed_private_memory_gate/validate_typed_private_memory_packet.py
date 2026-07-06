#!/usr/bin/env python3
"""Validate Typed Private Memory Gate packets.

This validator intentionally uses only the Python standard library so the gate can run in
minimal CI and local research folders without dependency drift.
"""

from __future__ import annotations

import json
import re
import sys
from pathlib import Path
from typing import Any

PLACEHOLDER_RE = re.compile(r"^<[A-Z0-9_:-]+>$")
ALLOWED_SOURCE_STATUS = {
    "primary_source",
    "institutional_source",
    "preprint_clear_caveat",
    "benchmark_dataset",
    "open_source_tool",
    "synthetic_fixture",
}
ALLOWED_CLAIM_STATUS = {
    "research_organization",
    "infrastructure_hypothesis",
    "evaluation_criterion",
    "prototype_requirement",
    "not_medical_or_veterinary_advice",
}
ALLOWED_PRIVACY_STATUS = {
    "public_safe",
    "deidentified",
    "typed_placeholder_only",
    "sensitive_local_only",
    "blocked_raw_sensitive",
}
ALLOWED_DECISIONS = {"admit", "hold", "reject", "revise"}

REQUIRED_TOP_LEVEL = [
    "packet_id",
    "source_status",
    "claim_status",
    "privacy_status",
    "missingness",
    "revision_reason",
    "implementation_status",
    "evidence_strength",
    "falsification_route",
    "next_executable_action",
    "memory_candidate",
    "sensitive_span_policy",
    "typed_placeholders",
    "semantic_utility_plan",
    "local_restoration_boundary",
    "retrieval_gate",
    "audit_trace",
]


def require(condition: bool, message: str, errors: list[str]) -> None:
    if not condition:
        errors.append(message)


def validate_packet(packet: dict[str, Any]) -> list[str]:
    errors: list[str] = []

    for field in REQUIRED_TOP_LEVEL:
        require(field in packet, f"missing top-level field: {field}", errors)
    if errors:
        return errors

    require(packet["source_status"] in ALLOWED_SOURCE_STATUS, "invalid source_status", errors)
    require(packet["claim_status"] in ALLOWED_CLAIM_STATUS, "invalid claim_status", errors)
    require(packet["privacy_status"] in ALLOWED_PRIVACY_STATUS, "invalid privacy_status", errors)
    require(packet["evidence_strength"] in {"low", "moderate", "high"}, "invalid evidence_strength", errors)

    memory = packet["memory_candidate"]
    require(isinstance(memory, dict), "memory_candidate must be object", errors)
    if isinstance(memory, dict):
        require(memory.get("raw_memory_present") is False, "raw_memory_present must be false before reusable-memory admission", errors)
        sanitized = memory.get("sanitized_memory", "")
        require(isinstance(sanitized, str) and len(sanitized) >= 10, "sanitized_memory too short", errors)
        require("<" in sanitized and ">" in sanitized, "sanitized_memory must contain typed placeholders", errors)
        for field in ["intended_use", "retention_reason"]:
            require(isinstance(memory.get(field), str) and len(memory[field]) >= 10, f"{field} too short", errors)

    policy = packet["sensitive_span_policy"]
    require(isinstance(policy, dict), "sensitive_span_policy must be object", errors)
    if isinstance(policy, dict):
        detected = set(policy.get("detected_span_types", []))
        allowed = set(policy.get("allowed_placeholder_types", []))
        require(bool(detected), "detected_span_types cannot be empty", errors)
        require(bool(allowed), "allowed_placeholder_types cannot be empty", errors)
        require(policy.get("policy_level") in {"low", "moderate", "strict", "blocked"}, "invalid policy_level", errors)

    placeholders = packet["typed_placeholders"]
    require(isinstance(placeholders, list) and len(placeholders) > 0, "typed_placeholders must be non-empty list", errors)
    if isinstance(placeholders, list):
        seen: set[str] = set()
        for index, item in enumerate(placeholders):
            require(isinstance(item, dict), f"typed_placeholders[{index}] must be object", errors)
            if not isinstance(item, dict):
                continue
            placeholder = item.get("placeholder")
            require(isinstance(placeholder, str) and bool(PLACEHOLDER_RE.match(placeholder)), f"invalid placeholder at index {index}", errors)
            if isinstance(placeholder, str):
                require(placeholder not in seen, f"duplicate placeholder: {placeholder}", errors)
                seen.add(placeholder)
                sanitized = packet["memory_candidate"].get("sanitized_memory", "") if isinstance(packet["memory_candidate"], dict) else ""
                require(placeholder in sanitized, f"placeholder not used in sanitized_memory: {placeholder}", errors)
            require(item.get("restoration_location") in {"local_only", "not_stored", "user_supplied_runtime"}, f"invalid restoration_location at index {index}", errors)

    utility = packet["semantic_utility_plan"]
    require(isinstance(utility, dict), "semantic_utility_plan must be object", errors)
    if isinstance(utility, dict):
        require(isinstance(utility.get("utility_preserved"), list) and len(utility["utility_preserved"]) > 0, "utility_preserved cannot be empty", errors)
        require(isinstance(utility.get("measurement"), str) and len(utility["measurement"]) >= 10, "measurement too short", errors)

    boundary = packet["local_restoration_boundary"]
    require(isinstance(boundary, dict), "local_restoration_boundary must be object", errors)
    if isinstance(boundary, dict):
        require(boundary.get("cloud_can_restore") is False, "cloud_can_restore must be false", errors)
        require(boundary.get("local_restore_required") is True, "local_restore_required must be true", errors)
        require(boundary.get("restoration_audit_required") is True, "restoration_audit_required must be true", errors)

    retrieval = packet["retrieval_gate"]
    require(isinstance(retrieval, dict), "retrieval_gate must be object", errors)
    if isinstance(retrieval, dict):
        for field in ["query_conditioned", "cross_domain_leakage_check", "tool_action_check"]:
            require(retrieval.get(field) is True, f"retrieval_gate.{field} must be true", errors)
        require(retrieval.get("admission_decision") in ALLOWED_DECISIONS, "invalid admission_decision", errors)

    audit = packet["audit_trace"]
    require(isinstance(audit, list) and len(audit) > 0, "audit_trace must be non-empty list", errors)

    if packet["privacy_status"] in {"public_safe", "deidentified", "typed_placeholder_only"}:
        require(memory.get("raw_memory_present") is False, "nonlocal reusable memory cannot include raw sensitive memory", errors)

    return errors


def main(argv: list[str]) -> int:
    if len(argv) != 2:
        print("usage: validate_typed_private_memory_packet.py <packet.json>", file=sys.stderr)
        return 2
    path = Path(argv[1])
    packet = json.loads(path.read_text())
    errors = validate_packet(packet)
    if errors:
        print("FAIL")
        for error in errors:
            print(f"- {error}")
        return 1
    print("PASS")
    return 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv))
