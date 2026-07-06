#!/usr/bin/env python3
"""Validate Mirror Cartographer public-safe memory packets.

This validator blocks private residue and advice leakage before a research-memory
packet is exported, shared, or promoted into public/collaboration contexts.
It does not provide medical or veterinary guidance.
"""

from __future__ import annotations

import json
import sys
from pathlib import Path
from typing import Any, Dict, List, Tuple

ALLOWED_SOURCE_STATUS = {
    "synthetic",
    "public",
    "deidentified_private_summary",
    "mixed",
}

ALLOWED_CLAIM_STATUS = {
    "observation",
    "hypothesis",
    "question",
    "evidence_summary",
    "prototype_requirement",
}

ALLOWED_PRIVACY_STATUS = {
    "public_safe",
    "needs_redaction",
    "blocked_private",
}

ALLOWED_IMPLEMENTATION_STATUS = {
    "draft",
    "validated",
    "blocked",
    "ready_for_export",
}

BLOCKING_REDACTION_FLAGS = [
    "contains_raw_transcript",
    "contains_direct_identifier",
    "contains_exact_timestamp",
    "contains_location_detail",
    "contains_diagnosis_or_treatment_instruction",
    "contains_animal_care_advice",
]

REQUIRED_TOP_LEVEL_FIELDS = [
    "packet_id",
    "source_status",
    "claim_status",
    "privacy_status",
    "missingness",
    "revision_reason",
    "implementation_status",
    "testability",
    "next_executable_action",
    "body",
    "variables",
    "redaction",
]

REQUIRED_VARIABLE_FIELDS = ["name", "unit_or_scale", "collection_mode"]


def _is_nonempty_string(value: Any) -> bool:
    return isinstance(value, str) and bool(value.strip())


def validate_packet(packet: Dict[str, Any]) -> Dict[str, Any]:
    errors: List[str] = []
    warnings: List[str] = []

    for field in REQUIRED_TOP_LEVEL_FIELDS:
        if field not in packet:
            errors.append(f"missing required field: {field}")

    if errors:
        return {
            "packet_id": packet.get("packet_id", "<missing>"),
            "decision": "block",
            "errors": errors,
            "warnings": warnings,
        }

    if not _is_nonempty_string(packet["packet_id"]):
        errors.append("packet_id must be a nonempty string")

    if packet["source_status"] not in ALLOWED_SOURCE_STATUS:
        errors.append(f"invalid source_status: {packet['source_status']}")

    if packet["claim_status"] not in ALLOWED_CLAIM_STATUS:
        errors.append(f"invalid claim_status: {packet['claim_status']}")

    if packet["privacy_status"] != "public_safe":
        errors.append("privacy_status must be public_safe before export or public memory use")

    if packet["privacy_status"] not in ALLOWED_PRIVACY_STATUS:
        errors.append(f"invalid privacy_status: {packet['privacy_status']}")

    if packet["implementation_status"] not in ALLOWED_IMPLEMENTATION_STATUS:
        errors.append(f"invalid implementation_status: {packet['implementation_status']}")

    if not isinstance(packet["missingness"], list):
        errors.append("missingness must be a list")

    for text_field in ["revision_reason", "testability", "next_executable_action", "body"]:
        if not _is_nonempty_string(packet[text_field]):
            errors.append(f"{text_field} must be a nonempty string")

    variables = packet["variables"]
    if not isinstance(variables, list) or not variables:
        errors.append("variables must contain at least one measurable variable")
    else:
        for index, variable in enumerate(variables):
            if not isinstance(variable, dict):
                errors.append(f"variables[{index}] must be an object")
                continue
            for field in REQUIRED_VARIABLE_FIELDS:
                if not _is_nonempty_string(variable.get(field)):
                    errors.append(f"variables[{index}].{field} must be a nonempty string")

    redaction = packet["redaction"]
    if not isinstance(redaction, dict):
        errors.append("redaction must be an object")
    else:
        for flag in BLOCKING_REDACTION_FLAGS:
            if flag not in redaction:
                errors.append(f"redaction missing flag: {flag}")
            elif not isinstance(redaction[flag], bool):
                errors.append(f"redaction.{flag} must be boolean")
            elif redaction[flag] is True:
                errors.append(f"blocking private/advice residue flag is true: {flag}")

    body = packet.get("body", "")
    if isinstance(body, str):
        lower_body = body.lower()
        advice_markers = [
            "you should take",
            "you should give",
            "diagnose",
            "cure is",
            "treatment is",
            "prescribe",
            "dose",
        ]
        matched = [marker for marker in advice_markers if marker in lower_body]
        if matched:
            errors.append("body contains advice-like marker(s): " + ", ".join(matched))

    if packet.get("source_status") == "mixed":
        warnings.append("mixed source_status requires downstream provenance split before promotion")

    decision = "pass" if not errors else "block"
    return {
        "packet_id": packet.get("packet_id", "<missing>"),
        "decision": decision,
        "errors": errors,
        "warnings": warnings,
    }


def validate_packets(packets: Any) -> Tuple[List[Dict[str, Any]], int]:
    if not isinstance(packets, list):
        return [
            {
                "packet_id": "<root>",
                "decision": "block",
                "errors": ["root JSON value must be an array of packets"],
                "warnings": [],
            }
        ], 1

    results = [validate_packet(packet if isinstance(packet, dict) else {"packet_id": "<invalid>"}) for packet in packets]
    blocked = sum(1 for result in results if result["decision"] == "block")
    return results, blocked


def main(argv: List[str]) -> int:
    if len(argv) != 2:
        print("usage: validate_public_safe_memory_packets.py <packets.json>", file=sys.stderr)
        return 2

    input_path = Path(argv[1])
    try:
        packets = json.loads(input_path.read_text(encoding="utf-8"))
    except Exception as exc:  # pragma: no cover - CLI guard
        print(json.dumps({"error": f"could not read JSON: {exc}"}, indent=2), file=sys.stderr)
        return 2

    results, blocked = validate_packets(packets)
    print(json.dumps({"blocked_count": blocked, "results": results}, indent=2, sort_keys=True))
    return 1 if blocked else 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv))
