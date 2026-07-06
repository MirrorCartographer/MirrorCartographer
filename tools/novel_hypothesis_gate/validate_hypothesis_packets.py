#!/usr/bin/env python3
"""
Validate public-safe Mirror Cartographer hypothesis packets.

This tool is discovery-infrastructure only. It does not provide medical,
veterinary, diagnostic, treatment, or personal advice.
"""

from __future__ import annotations

import json
import sys
from pathlib import Path
from typing import Any, Dict, List

REQUIRED_FIELDS = [
    "packet_id",
    "phenomenon_id",
    "hypothesis_statement",
    "novelty_basis",
    "mechanism_hint",
    "measurable_variables",
    "alternative_explanations",
    "source_status",
    "claim_status",
    "privacy_status",
    "missingness",
    "revision_reason",
    "implementation_status",
    "testability",
    "falsification_route",
    "next_executable_action",
]

ALLOWED_SOURCE_STATUS = {"synthetic", "public_primary", "public_secondary", "mixed_public"}
ALLOWED_CLAIM_STATUS = {"candidate", "proposed", "rejected", "needs_evidence"}
ALLOWED_IMPLEMENTATION_STATUS = {"planned", "implemented", "validated"}
ALLOWED_TESTABILITY = {"high", "moderate", "low"}
PROHIBITED_PRIVACY_TERMS = {
    "address",
    "phone",
    "email",
    "diagnosis",
    "treatment",
    "prescription",
    "veterinary advice",
    "medical advice",
    "household",
    "relationship",
    "credential",
    "raw transcript",
}


def _flatten_text(value: Any) -> str:
    if isinstance(value, dict):
        return " ".join(_flatten_text(v) for v in value.values())
    if isinstance(value, list):
        return " ".join(_flatten_text(v) for v in value)
    return str(value)


def validate_packet(packet: Dict[str, Any]) -> List[str]:
    errors: List[str] = []

    for field in REQUIRED_FIELDS:
        if field not in packet:
            errors.append(f"missing required field: {field}")

    if errors:
        return errors

    if packet["source_status"] not in ALLOWED_SOURCE_STATUS:
        errors.append(f"unsupported source_status: {packet['source_status']}")
    if packet["claim_status"] not in ALLOWED_CLAIM_STATUS:
        errors.append(f"unsupported claim_status: {packet['claim_status']}")
    if packet["privacy_status"] != "public_safe_only":
        errors.append("privacy_status must be public_safe_only")
    if packet["implementation_status"] not in ALLOWED_IMPLEMENTATION_STATUS:
        errors.append(f"unsupported implementation_status: {packet['implementation_status']}")
    if packet["testability"] not in ALLOWED_TESTABILITY:
        errors.append(f"unsupported testability: {packet['testability']}")

    variables = packet.get("measurable_variables", [])
    if not isinstance(variables, list) or len(variables) < 2:
        errors.append("measurable_variables must contain at least two variables")
    else:
        for i, variable in enumerate(variables):
            if not isinstance(variable, dict):
                errors.append(f"measurable_variables[{i}] must be an object")
                continue
            if not variable.get("name") or not variable.get("operational_definition"):
                errors.append(f"measurable_variables[{i}] requires name and operational_definition")

    alternatives = packet.get("alternative_explanations", [])
    if not isinstance(alternatives, list) or len(alternatives) < 2:
        errors.append("alternative_explanations must contain at least two alternatives")

    hypothesis_statement = str(packet.get("hypothesis_statement", "")).strip()
    if len(hypothesis_statement.split()) < 10:
        errors.append("hypothesis_statement is too vague to test")

    novelty_basis = str(packet.get("novelty_basis", "")).strip()
    if len(novelty_basis.split()) < 10:
        errors.append("novelty_basis must explain the new inference enabled by the hypothesis")

    falsification_route = str(packet.get("falsification_route", "")).strip().lower()
    if len(falsification_route.split()) < 12 or not any(term in falsification_route for term in ["if", "reject", "fail", "does not", "no "]):
        errors.append("falsification_route must describe an observable failure condition")

    combined_text = _flatten_text(packet).lower()
    if any(term in combined_text for term in PROHIBITED_PRIVACY_TERMS):
        errors.append("privacy boundary violation: packet contains prohibited private/advice terms")

    advice_like = ["should treat", "should diagnose", "cure by", "give medication", "clinical recommendation"]
    if any(term in combined_text for term in advice_like):
        errors.append("advice boundary violation: packet appears to provide medical or veterinary advice")

    return errors


def validate_file(path: Path) -> Dict[str, Any]:
    payload = json.loads(path.read_text(encoding="utf-8"))
    packets = payload if isinstance(payload, list) else payload.get("valid_packets", [])
    results = []
    for packet in packets:
        errors = validate_packet(packet)
        results.append({
            "packet_id": packet.get("packet_id", "<missing>"),
            "status": "PASS" if not errors else "FAIL",
            "errors": errors,
        })
    return {
        "file": str(path),
        "packet_count": len(results),
        "status": "PASS" if all(r["status"] == "PASS" for r in results) else "FAIL",
        "results": results,
    }


def main(argv: List[str]) -> int:
    if len(argv) != 2:
        print("usage: validate_hypothesis_packets.py <packet-file.json>", file=sys.stderr)
        return 2
    result = validate_file(Path(argv[1]))
    print(json.dumps(result, indent=2, sort_keys=True))
    return 0 if result["status"] == "PASS" else 1


if __name__ == "__main__":
    raise SystemExit(main(sys.argv))
