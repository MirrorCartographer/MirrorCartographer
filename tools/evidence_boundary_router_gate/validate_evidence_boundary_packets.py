#!/usr/bin/env python3
"""Validate Mirror Cartographer evidence-boundary routing packets.

This tool is public-safe research organization infrastructure. It does not provide
medical, veterinary, diagnostic, treatment, dosage, or emergency guidance.
"""

from __future__ import annotations

import json
import sys
from pathlib import Path
from typing import Any

REQUIRED_TOP_LEVEL = {
    "packet_id",
    "domain",
    "claim_text",
    "source_status",
    "claim_status",
    "privacy_status",
    "missingness",
    "boundary_route",
    "allowed_uses",
    "blocked_uses",
    "measurable_variables",
    "falsification_route",
    "next_executable_action",
}

ADVICE_OR_PRIVATE_BLOCKS = {
    "diagnosis",
    "treatment_recommendation",
    "dosage_or_medication_change",
    "emergency_triage",
    "veterinary_instruction",
    "public_memory_with_private_identifiers",
}

SAFE_ADVICE_BOUNDARY_ROUTES = {
    "research_question_prep",
    "reject_private_or_advice_like",
}

SAFE_PUBLIC_ROUTES = {
    "research_question_prep",
    "literature_map",
    "hypothesis_backlog",
    "mechanistic_verification",
    "contradiction_ledger",
    "symbolic_translation_queue",
    "reject_private_or_advice_like",
}

ROUTE_ALLOWED_USE_REQUIREMENTS = {
    "research_question_prep": {"organize_questions"},
    "literature_map": {"map_literature"},
    "hypothesis_backlog": {"route_to_falsification"},
    "mechanistic_verification": {"design_nonclinical_tests", "route_to_falsification"},
    "contradiction_ledger": {"route_to_falsification"},
    "symbolic_translation_queue": {"design_nonclinical_tests"},
    "reject_private_or_advice_like": set(),
}


def _load_packets(path: Path) -> list[dict[str, Any]]:
    data = json.loads(path.read_text(encoding="utf-8"))
    if isinstance(data, dict):
        return [data]
    if isinstance(data, list) and all(isinstance(item, dict) for item in data):
        return data
    raise ValueError("Input must be one packet object or a list of packet objects")


def validate_packet(packet: dict[str, Any]) -> list[str]:
    errors: list[str] = []
    missing_keys = REQUIRED_TOP_LEVEL - set(packet)
    if missing_keys:
        errors.append(f"missing required keys: {sorted(missing_keys)}")
        return errors

    route = packet["boundary_route"]
    allowed_uses = set(packet.get("allowed_uses", []))
    blocked_uses = set(packet.get("blocked_uses", []))
    privacy_status = packet["privacy_status"]
    claim_status = packet["claim_status"]
    source_status = packet["source_status"]
    missingness = packet.get("missingness", {})
    variables = packet.get("measurable_variables", [])

    if route not in SAFE_PUBLIC_ROUTES:
        errors.append(f"unknown boundary_route: {route}")

    if privacy_status in {"private_rejected", "requires_redaction"} and route != "reject_private_or_advice_like":
        errors.append("private or redaction-required packets must route to reject_private_or_advice_like")

    if "public_memory_with_private_identifiers" in blocked_uses and route != "reject_private_or_advice_like":
        errors.append("packets blocking public private identifiers cannot enter public routes")

    if blocked_uses & {"diagnosis", "treatment_recommendation", "dosage_or_medication_change", "emergency_triage", "veterinary_instruction"}:
        if route not in SAFE_ADVICE_BOUNDARY_ROUTES:
            errors.append("medical/veterinary advice-like packets must remain question-prep or rejection routes")

    if claim_status == "unsupported_claim" and route not in {"research_question_prep", "contradiction_ledger", "reject_private_or_advice_like"}:
        errors.append("unsupported claims cannot route to literature map, backlog, mechanism, or memory-like routes")

    if source_status == "assistant_inferred" and claim_status not in {"question", "hypothesis", "unsupported_claim", "validated_in_fixture_only"}:
        errors.append("assistant-inferred material must not be labeled as direct observation")

    if missingness.get("not_interpreted_as_absence") is not True:
        errors.append("missingness must explicitly prevent missing-as-absence interpretation")

    if not isinstance(variables, list) or not variables:
        errors.append("at least one measurable variable is required")
    else:
        for index, variable in enumerate(variables):
            if not variable.get("name") or not variable.get("unit_or_scale"):
                errors.append(f"variable {index} missing name or unit_or_scale")
            if variable.get("collection_status") == "missing" and missingness.get("state") == "none":
                errors.append(f"variable {index} is missing while packet missingness says none")

    required_allowed = ROUTE_ALLOWED_USE_REQUIREMENTS.get(route, set())
    if required_allowed and not (allowed_uses & required_allowed):
        errors.append(f"route {route} requires one of allowed uses: {sorted(required_allowed)}")

    if route == "symbolic_translation_queue":
        variable_names = {str(v.get("name", "")) for v in variables}
        if not any("symbol" in name or "variable" in name for name in variable_names):
            errors.append("symbolic translation route requires symbol/variable measurement")

    if len(str(packet.get("falsification_route", ""))) < 20:
        errors.append("falsification_route must be specific enough to test")

    return errors


def main(argv: list[str]) -> int:
    if len(argv) != 2:
        print("Usage: validate_evidence_boundary_packets.py <packet-or-fixtures.json>", file=sys.stderr)
        return 2

    path = Path(argv[1])
    packets = _load_packets(path)
    failures: dict[str, list[str]] = {}

    for packet in packets:
        packet_id = str(packet.get("packet_id", "<missing-packet-id>"))
        errors = validate_packet(packet)
        if errors:
            failures[packet_id] = errors

    result = {
        "packet_count": len(packets),
        "passed_count": len(packets) - len(failures),
        "failed_count": len(failures),
        "failures": failures,
    }
    print(json.dumps(result, indent=2, sort_keys=True))
    return 1 if failures else 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv))
