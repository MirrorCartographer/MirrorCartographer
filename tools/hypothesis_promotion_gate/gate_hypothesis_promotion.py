#!/usr/bin/env python3
"""Mirror Cartographer Hypothesis Promotion Gate.

Evaluates synthetic/public-safe hypothesis packets and decides whether they can
move to a higher research stage. This is not medical or veterinary advice.
"""

from __future__ import annotations

import argparse
import json
import sys
from collections import Counter
from pathlib import Path
from typing import Any, Dict, List

ALLOWED_SOURCE = {"synthetic", "user_provided", "public_source", "derived", "unknown"}
ALLOWED_CLAIM = {
    "hypothesis_candidate",
    "falsification_ready",
    "evidence_supported",
    "advice",
    "cure_claim",
    "unknown",
}
ALLOWED_PRIVACY = {"public_safe", "redacted", "contains_private_residue", "unknown"}
ALLOWED_PROMOTION = {
    "keep_candidate",
    "promote_to_testable",
    "promote_to_review",
    "promote_to_action",
}
REQUIRED_FIELDS = {
    "hypothesis_id",
    "domain",
    "statement",
    "source_status",
    "claim_status",
    "privacy_status",
    "evidence_items",
    "contradictions",
    "missingness",
    "falsification_tests",
    "mechanism_scope",
    "requested_promotion",
    "revision_reason",
}


def _as_list(value: Any) -> List[Any]:
    return value if isinstance(value, list) else []


def evaluate_packet(packet: Dict[str, Any]) -> Dict[str, Any]:
    missing_required = sorted(REQUIRED_FIELDS - set(packet))
    reasons: List[str] = []
    actions: List[str] = []

    if missing_required:
        reasons.append("required fields missing: " + ", ".join(missing_required))
        actions.append("complete required schema fields before promotion review")

    source_status = packet.get("source_status", "unknown")
    claim_status = packet.get("claim_status", "unknown")
    privacy_status = packet.get("privacy_status", "unknown")
    requested = packet.get("requested_promotion", "keep_candidate")
    mechanism_scope = packet.get("mechanism_scope", "none")

    evidence_items = _as_list(packet.get("evidence_items"))
    contradictions = _as_list(packet.get("contradictions"))
    missingness = _as_list(packet.get("missingness"))
    falsification_tests = _as_list(packet.get("falsification_tests"))

    if source_status not in ALLOWED_SOURCE or source_status == "unknown":
        reasons.append("source status is unknown or invalid")
        actions.append("attach explicit source status before retrieval or promotion")
    if claim_status not in ALLOWED_CLAIM or claim_status == "unknown":
        reasons.append("claim status is unknown or invalid")
        actions.append("label claim stage before promotion")
    if privacy_status not in ALLOWED_PRIVACY or privacy_status == "unknown":
        reasons.append("privacy status is unknown or invalid")
        actions.append("run privacy-preserving memory redactor")
    if privacy_status == "contains_private_residue":
        reasons.append("private residue cannot enter promoted research state")
        actions.append("redact or partition packet before re-evaluation")
    if claim_status in {"advice", "cure_claim"}:
        reasons.append("advice and cure claims are blocked from promotion")
        actions.append("downgrade to bounded research question or remove action language")
    if requested == "promote_to_action":
        reasons.append("action promotion is blocked by this research gate")
        actions.append("route to clinician/veterinarian/professional review outside MC claim promotion")
    if not falsification_tests:
        reasons.append("no falsification test supplied")
        actions.append("add at least one disconfirming test or negative-control check")
    if requested not in ALLOWED_PROMOTION:
        reasons.append("requested promotion is invalid")
        actions.append("use a valid requested_promotion value")

    block_markers = [
        "blocked" in reason
        or "private residue" in reason
        or "unknown or invalid" in reason
        or "no falsification" in reason
        for reason in reasons
    ]

    if any(block_markers):
        decision = "block"
        allowed_stage = "do_not_promote"
    else:
        hold_reasons = []
        if len(evidence_items) < 2:
            hold_reasons.append("fewer than two evidence items")
            actions.append("add independent evidence or replicated observation window")
        if not isinstance(packet.get("contradictions"), list):
            hold_reasons.append("contradictions field is not explicit")
            actions.append("add explicit contradiction list, even if empty")
        if not missingness:
            hold_reasons.append("missingness is not explicit")
            actions.append("add explicit missingness array")
        if mechanism_scope in {"none", "speculative"}:
            hold_reasons.append("mechanism scope is not bounded enough")
            actions.append("route through literature evidence mapper or negative-control generator")
        if claim_status == "hypothesis_candidate" and requested == "promote_to_review":
            hold_reasons.append("candidate must become falsification_ready before review")
            actions.append("run falsification or negative-control fixture first")

        if hold_reasons:
            reasons.extend(hold_reasons)
            decision = "hold"
            allowed_stage = "candidate_or_testable_only"
        else:
            decision = "promote"
            allowed_stage = "testable_or_review_queue"
            reasons.append("bounded falsifiable public-safe packet can move to review/test queue")
            actions.append("send to contradiction ledger and provenance packet builder")

    return {
        "hypothesis_id": packet.get("hypothesis_id", "<missing>"),
        "decision": decision,
        "allowed_stage": allowed_stage,
        "reasons": sorted(set(reasons)),
        "required_actions": sorted(set(actions)),
        "labels": {
            "source_status": source_status,
            "claim_status": claim_status,
            "privacy_status": privacy_status,
            "missingness": missingness if missingness else ["missingness absent or empty"],
            "revision_reason": packet.get("revision_reason", "missing revision reason"),
            "implementation_status": "executable CLI gate with synthetic fixtures",
            "testability": "python tools/hypothesis_promotion_gate/test_gate_hypothesis_promotion.py",
            "next_executable_action": "route promoted packets to contradiction ledger and provenance packet builder; route held packets to falsification fixtures",
        },
    }


def evaluate_packets(packets: List[Dict[str, Any]]) -> Dict[str, Any]:
    results = [evaluate_packet(packet) for packet in packets]
    counts = Counter(result["decision"] for result in results)
    return {"results": results, "summary": dict(sorted(counts.items()))}


def main(argv: List[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description="Gate Mirror Cartographer hypothesis promotion packets.")
    parser.add_argument("input_json", help="Path to JSON array of hypothesis packets")
    args = parser.parse_args(argv)

    try:
        packets = json.loads(Path(args.input_json).read_text(encoding="utf-8"))
    except Exception as exc:  # pragma: no cover - user-facing CLI guard
        print(f"error: could not read input JSON: {exc}", file=sys.stderr)
        return 2

    if not isinstance(packets, list):
        print("error: input must be a JSON array", file=sys.stderr)
        return 2

    print(json.dumps(evaluate_packets(packets), indent=2, sort_keys=True))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
