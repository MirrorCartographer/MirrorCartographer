#!/usr/bin/env python3
"""Validate public-safe symbolic-to-operational translation packets.

This validator is intentionally conservative. It does not interpret medical,
veterinary, or private content. It only checks whether a redacted symbolic packet
has enough structure to become a measurable research-organization object.
"""

from __future__ import annotations

import json
import re
import sys
from pathlib import Path
from typing import Any, Dict, Iterable, List, Tuple

ALLOWED_SOURCE_STATUS = {
    "synthetic",
    "public_abstract",
    "literature_derived",
    "deidentified_user_abstract",
}

ALLOWED_PRIVACY_STATUS = {"public_safe", "deidentified"}
ALLOWED_CLAIM_STATUS = {"observation_only", "mapping_candidate", "test_ready", "rejected"}
MEASURABLE_TYPES = {"count", "ordinal", "categorical", "binary", "duration", "ratio"}

PRIVATE_PATTERNS = [
    re.compile(r"\b\d{4}-\d{2}-\d{2}\b"),
    re.compile(r"\b\d{1,2}:\d{2}\b"),
    re.compile(r"\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b", re.I),
    re.compile(r"\b\d{3}[-. ]?\d{3}[-. ]?\d{4}\b"),
]

ADVICE_PATTERNS = [
    re.compile(r"\byou should\b", re.I),
    re.compile(r"\btreat\b", re.I),
    re.compile(r"\btake\b.*\b(medication|dose|supplement)\b", re.I),
    re.compile(r"\bgive\b.*\b(medication|dose|drop|pill)\b", re.I),
    re.compile(r"\bcure\b", re.I),
    re.compile(r"\bheal\b", re.I),
]


def _text_values(value: Any) -> Iterable[str]:
    if isinstance(value, str):
        yield value
    elif isinstance(value, dict):
        for child in value.values():
            yield from _text_values(child)
    elif isinstance(value, list):
        for child in value:
            yield from _text_values(child)


def _contains_pattern(packet: Dict[str, Any], patterns: List[re.Pattern[str]]) -> bool:
    haystack = "\n".join(_text_values(packet))
    return any(pattern.search(haystack) for pattern in patterns)


def validate_packet(packet: Dict[str, Any]) -> Tuple[bool, List[str]]:
    errors: List[str] = []

    required = [
        "packet_id",
        "source_status",
        "privacy_status",
        "claim_status",
        "symbolic_observation",
        "symbolic_terms",
        "context_window",
        "candidate_variables",
        "falsification_route",
        "missingness",
    ]
    for key in required:
        if key not in packet:
            errors.append(f"missing required field: {key}")

    if errors:
        return False, errors

    if packet["source_status"] not in ALLOWED_SOURCE_STATUS:
        errors.append("invalid source_status")
    if packet["privacy_status"] not in ALLOWED_PRIVACY_STATUS:
        errors.append("invalid privacy_status")
    if packet["claim_status"] not in ALLOWED_CLAIM_STATUS:
        errors.append("invalid claim_status")

    if _contains_pattern(packet, PRIVATE_PATTERNS):
        errors.append("private identifier or exact timestamp/date pattern detected")
    if _contains_pattern(packet, ADVICE_PATTERNS):
        errors.append("advice-like language detected")

    symbolic_terms = packet.get("symbolic_terms", [])
    if not isinstance(symbolic_terms, list) or not symbolic_terms:
        errors.append("symbolic_terms must be a non-empty list")
    else:
        for idx, term in enumerate(symbolic_terms):
            mappings = term.get("operational_mappings") if isinstance(term, dict) else None
            if not isinstance(mappings, list) or not mappings:
                errors.append(f"symbolic_terms[{idx}] has no operational mappings")

    variables = packet.get("candidate_variables", [])
    measurable_count = 0
    if not isinstance(variables, list) or not variables:
        errors.append("candidate_variables must be a non-empty list")
    else:
        for idx, variable in enumerate(variables):
            if not isinstance(variable, dict):
                errors.append(f"candidate_variables[{idx}] is not an object")
                continue
            if variable.get("measurement_type") in MEASURABLE_TYPES:
                measurable_count += 1
            if not variable.get("name") or not variable.get("unit"):
                errors.append(f"candidate_variables[{idx}] missing name or unit")
    if measurable_count < 2:
        errors.append("at least two measurable candidate variables are required")

    falsification = packet.get("falsification_route")
    if not isinstance(falsification, str) or len(falsification.strip()) < 20:
        errors.append("falsification_route is missing or too short")

    missingness = packet.get("missingness")
    if not isinstance(missingness, list):
        errors.append("missingness must be a list")

    return not errors, errors


def main(argv: List[str]) -> int:
    if len(argv) != 2:
        print("usage: validate_symbolic_operational_packets.py <packets.json>")
        return 2

    path = Path(argv[1])
    packets = json.loads(path.read_text())
    if not isinstance(packets, list):
        print("input must be a JSON array of packets")
        return 2

    failures = 0
    for packet in packets:
        valid, errors = validate_packet(packet)
        expected = packet.get("expected_valid")
        status = "PASS" if valid else "FAIL"
        print(f"{packet.get('packet_id', '<missing>')}: {status}")
        for error in errors:
            print(f"  - {error}")
        if expected is not None and bool(expected) != valid:
            failures += 1
            print(f"  - expectation mismatch: expected_valid={expected}")

    return 1 if failures else 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv))
