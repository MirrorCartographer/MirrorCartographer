#!/usr/bin/env python3
"""Score Mirror Cartographer claim packets for promotion readiness.

This tool is intentionally domain-agnostic and public-safe. It does not provide
medical, veterinary, or treatment advice. It only routes research-organization
packets according to evidence, privacy, falsifiability, and implementation
readiness.
"""

from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path
from typing import Any, Dict, Iterable, List

ALLOWED_DOMAINS = {
    "scientific_ai",
    "medical_ai_evidence",
    "mechanistic_biology",
    "neuroscience",
    "animal_health_research",
    "longitudinal_data",
    "hci",
    "privacy_memory",
    "symbolic_translation",
}

BLOCKING_PRIVACY = {"private_risk", "blocked"}
BLOCKING_CLAIM_STATUS = {"overclaimed"}
CONTRADICTION_STATUSES = {"contradicted", "inconclusive"}

REQUIRED_FIELDS = {
    "id",
    "claim",
    "domain",
    "source_status",
    "claim_status",
    "privacy_status",
    "implementation_status",
    "measurable_variables",
    "evidence_links",
    "falsification_route",
    "missingness",
    "contradictions",
    "next_executable_action",
}


def _as_list(value: Any) -> List[Any]:
    return value if isinstance(value, list) else []


def score_packet(packet: Dict[str, Any]) -> Dict[str, Any]:
    missing_fields = sorted(REQUIRED_FIELDS - set(packet))
    variables = _as_list(packet.get("measurable_variables"))
    evidence_links = _as_list(packet.get("evidence_links"))
    missingness = _as_list(packet.get("missingness"))
    contradictions = _as_list(packet.get("contradictions"))
    falsification_route = str(packet.get("falsification_route", "")).strip()
    next_action = str(packet.get("next_executable_action", "")).strip()

    reasons: List[str] = []

    if missing_fields:
        reasons.append("missing_required_fields:" + ",".join(missing_fields))
    if packet.get("domain") not in ALLOWED_DOMAINS:
        reasons.append("unknown_domain")
    if packet.get("privacy_status") in BLOCKING_PRIVACY:
        reasons.append("privacy_boundary_failure")
    if packet.get("claim_status") in BLOCKING_CLAIM_STATUS:
        reasons.append("overclaimed")
    if len(variables) < 1:
        reasons.append("no_measurable_variables")
    if not falsification_route:
        reasons.append("missing_falsification_route")
    if not next_action:
        reasons.append("missing_next_executable_action")

    if any(reason in reasons for reason in [
        "unknown_domain",
        "privacy_boundary_failure",
        "overclaimed",
        "no_measurable_variables",
        "missing_falsification_route",
        "missing_next_executable_action",
    ]) or missing_fields:
        decision = "block"
    elif contradictions or packet.get("claim_status") in CONTRADICTION_STATUSES:
        decision = "contradiction_review"
    elif len(evidence_links) < 1 or len(variables) < 2 or missingness:
        decision = "gather_evidence"
    else:
        decision = "promote"

    if decision == "promote":
        reasons.append("promotion_ready")
    elif decision == "gather_evidence":
        if len(evidence_links) < 1:
            reasons.append("needs_evidence_links")
        if len(variables) < 2:
            reasons.append("needs_additional_variables")
        if missingness:
            reasons.append("known_missingness")
    elif decision == "contradiction_review":
        reasons.append("requires_contradiction_triage")

    return {
        "id": packet.get("id", "unknown"),
        "decision": decision,
        "reasons": sorted(set(reasons)),
        "variable_count": len(variables),
        "evidence_reference_count": len(evidence_links),
        "contradiction_count": len(contradictions),
    }


def score_packets(packets: Iterable[Dict[str, Any]]) -> List[Dict[str, Any]]:
    return [score_packet(packet) for packet in packets]


def main(argv: List[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description="Score MC claim packets for promotion readiness.")
    parser.add_argument("input", type=Path, help="Path to JSON array of claim packets")
    args = parser.parse_args(argv)

    try:
        packets = json.loads(args.input.read_text(encoding="utf-8"))
    except Exception as exc:  # pragma: no cover - CLI guard
        print(json.dumps({"error": f"failed_to_read_input: {exc}"}, indent=2), file=sys.stderr)
        return 2

    if not isinstance(packets, list):
        print(json.dumps({"error": "input_must_be_json_array"}, indent=2), file=sys.stderr)
        return 2

    results = score_packets(packets)
    print(json.dumps(results, indent=2, sort_keys=True))
    return 0 if all(result["decision"] != "block" for result in results) else 1


if __name__ == "__main__":
    raise SystemExit(main())
