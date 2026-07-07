#!/usr/bin/env python3
"""Validate MC revision-integrity packets.

This executable gate checks whether a revised MC hypothesis packet preserves
revision context before it can influence longitudinal memory, question-prep,
research maps, or public claims.
"""

from __future__ import annotations

import json
import re
import sys
from pathlib import Path
from typing import Any

ROOT = Path(__file__).resolve().parent
FIXTURE_PATH = ROOT / "revision_integrity_fixture.json"

TOP_LEVEL_REQUIRED = {
    "artifact_name",
    "domain",
    "hypothesis",
    "source_status",
    "claim_status",
    "privacy_status",
    "missingness",
    "revision_reason",
    "implementation_status",
    "testability",
    "falsification_route",
    "measurable_variables",
    "next_executable_action",
    "packets",
}

PACKET_REQUIRED = {
    "packet_id",
    "expected_result",
    "source_status",
    "claim_status",
    "privacy_status",
    "missingness",
    "revision_reason",
    "implementation_status",
    "testability",
    "falsification_route",
    "measurable_variables",
    "next_executable_action",
    "prior_claim",
    "revised_claim",
    "evidence_delta",
    "missingness_delta",
    "allowed_route",
}

BLOCKED_PATTERNS = [
    r"\bdiagnos(?:e|is|tic)\b",
    r"\btreat(?:ment|s|ed|ing)?\b",
    r"\bdosage\b",
    r"\burgent\b",
    r"\bemergency\b",
    r"\bcure(?:d|s)?\b",
    r"\bproves?\b",
    r"\bguarantee(?:d|s)?\b",
    r"\bveterinary advice\b",
    r"\bmedical advice\b",
]

PRIVATE_PATTERNS = [
    r"[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}",
    r"\b\d{3}-\d{2}-\d{4}\b",
    r"\b\d{3}[-.]\d{3}[-.]\d{4}\b",
    r"\b\d{1,5}\s+[A-Z][a-z]+\s+(Street|St|Road|Rd|Avenue|Ave|Drive|Dr)\b",
]

MISSINGNESS_COLLAPSE_PATTERNS = [
    r"not recorded so no issue exists",
    r"unknown means absent",
    r"missing means false",
    r"no source means no problem",
]

SAFE_ROUTES = {
    "longitudinal_observation",
    "research_question",
    "question_prep",
    "contradiction_ledger",
    "blocked_packet",
}


def text_blob(value: Any) -> str:
    return json.dumps(value, sort_keys=True)


def has_pattern(patterns: list[str], value: Any) -> bool:
    blob = text_blob(value)
    return any(re.search(pattern, blob, re.IGNORECASE) for pattern in patterns)


def nonempty(value: Any) -> bool:
    if isinstance(value, str):
        return bool(value.strip())
    if isinstance(value, (list, dict, tuple, set)):
        return bool(value)
    return value is not None


def validate_packet(packet: dict[str, Any]) -> list[str]:
    errors: list[str] = []

    missing_keys = sorted(PACKET_REQUIRED - set(packet))
    if missing_keys:
        errors.append(f"missing required keys: {missing_keys}")
        return errors

    for key in PACKET_REQUIRED:
        if key == "expected_result":
            continue
        if not nonempty(packet.get(key)):
            errors.append(f"empty required field: {key}")

    if packet.get("expected_result") not in {"pass", "fail"}:
        errors.append("expected_result must be pass or fail")

    if packet.get("allowed_route") not in SAFE_ROUTES:
        errors.append(f"unsafe or unknown allowed_route: {packet.get('allowed_route')}")

    if has_pattern(PRIVATE_PATTERNS, packet):
        errors.append("private identifier pattern retained")

    if has_pattern(BLOCKED_PATTERNS, packet.get("revised_claim", "")):
        errors.append("blocked claim language in revised_claim")

    if has_pattern(MISSINGNESS_COLLAPSE_PATTERNS, packet):
        errors.append("missingness collapsed into absence or safety")

    if not isinstance(packet.get("evidence_delta"), list) or not packet["evidence_delta"]:
        errors.append("evidence_delta must be a non-empty list")

    if not isinstance(packet.get("missingness_delta"), list) or not packet["missingness_delta"]:
        errors.append("missingness_delta must be a non-empty list")

    variables = packet.get("measurable_variables")
    if not isinstance(variables, list) or not variables:
        errors.append("measurable_variables must be a non-empty list")
    else:
        for index, variable in enumerate(variables):
            if not isinstance(variable, dict):
                errors.append(f"measurable_variables[{index}] must be an object")
                continue
            for key in ("name", "unit", "value"):
                if key not in variable or not nonempty(variable[key]):
                    errors.append(f"measurable_variables[{index}] missing {key}")

    return errors


def main() -> int:
    fixture = json.loads(FIXTURE_PATH.read_text(encoding="utf-8"))

    missing_top = sorted(TOP_LEVEL_REQUIRED - set(fixture))
    if missing_top:
        print(f"TOP LEVEL FAIL: missing keys {missing_top}")
        return 1

    packets = fixture.get("packets")
    if not isinstance(packets, list) or not packets:
        print("TOP LEVEL FAIL: packets must be a non-empty list")
        return 1

    failures: list[str] = []
    pass_count = 0
    expected_fail_count = 0

    for packet in packets:
        packet_id = packet.get("packet_id", "<missing packet_id>")
        errors = validate_packet(packet)
        actual = "fail" if errors else "pass"
        expected = packet.get("expected_result")

        if expected == "pass" and actual == "pass":
            pass_count += 1
        elif expected == "fail" and actual == "fail":
            expected_fail_count += 1
        else:
            failures.append(
                f"{packet_id}: expected {expected}, got {actual}; errors={errors}"
            )

    if failures:
        print("REVISION INTEGRITY VALIDATION FAILED")
        for failure in failures:
            print(f"- {failure}")
        return 1

    print("REVISION INTEGRITY VALIDATION PASSED")
    print(f"passing packets: {pass_count}")
    print(f"expected blocked packets: {expected_fail_count}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
