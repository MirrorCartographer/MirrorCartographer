#!/usr/bin/env python3
"""Mirror Cartographer Retrieval Boundary Checker.

Public-safe gate that verifies source, privacy, and advice boundaries before
retrieval outputs are admitted into discovery memory.

Usage:
  python tools/retrieval_boundary_checker/check_retrieval_boundaries.py \
    tools/retrieval_boundary_checker/fixtures.synthetic.json
"""

from __future__ import annotations

import argparse
import json
import sys
from dataclasses import dataclass
from pathlib import Path
from typing import Any, Iterable

ALLOWED_SOURCE_STATUS = {
    "primary_public",
    "secondary_public",
    "preprint_public",
    "institutional_public",
    "benchmark_public",
    "dataset_public",
    "repository_public",
    "private_abstracted",
    "mixed_public_private",
    "synthetic_public_safe",
}

ALLOWED_CLAIM_STATUS = {
    "research_question",
    "hypothesis_candidate",
    "pattern_tracking_candidate",
    "evidence_packet",
    "falsification_task",
    "collaboration_target",
}

ALLOWED_PRIVACY_STATUS = {
    "public_safe",
    "deidentified_private",
    "private_present",
}

ALLOWED_ROUTE_INTENT = {
    "hypothesis_generation",
    "longitudinal_pattern_tracking",
    "medical_evidence_organization",
    "animal_care_evidence_organization",
    "scientific_literature_organization",
    "collaboration_readiness",
    "falsification",
}

PUBLIC_MEMORY = "public_discovery_memory"
PRIVATE_MEMORY = "private_research_memory"


@dataclass(frozen=True)
class BoundaryResult:
    packet_id: str
    decision: str
    reasons: list[str]

    @property
    def passed(self) -> bool:
        return self.decision == "pass"


def _as_bool(value: Any) -> bool:
    return bool(value) if isinstance(value, bool) else False


def check_packet(packet: dict[str, Any]) -> BoundaryResult:
    reasons: list[str] = []
    packet_id = str(packet.get("id", "<missing-id>"))

    source_status = packet.get("source_status")
    claim_status = packet.get("claim_status")
    privacy_status = packet.get("privacy_status")
    route_intent = packet.get("route_intent")
    retrieval_inputs = packet.get("retrieval_inputs")
    output_packet = packet.get("output_packet") or {}

    if source_status not in ALLOWED_SOURCE_STATUS:
        reasons.append(f"unknown source_status: {source_status!r}")
    if claim_status not in ALLOWED_CLAIM_STATUS:
        reasons.append(f"unknown claim_status: {claim_status!r}")
    if privacy_status not in ALLOWED_PRIVACY_STATUS:
        reasons.append(f"unknown privacy_status: {privacy_status!r}")
    if route_intent not in ALLOWED_ROUTE_INTENT:
        reasons.append(f"unknown route_intent: {route_intent!r}")
    if not isinstance(retrieval_inputs, list) or not retrieval_inputs:
        reasons.append("retrieval_inputs must be a non-empty list")

    input_private = False
    input_advice = False
    if isinstance(retrieval_inputs, list):
        for index, item in enumerate(retrieval_inputs):
            if not isinstance(item, dict):
                reasons.append(f"retrieval_inputs[{index}] must be an object")
                continue
            boundary = item.get("boundary")
            if boundary not in {"public", "private", "synthetic"}:
                reasons.append(f"retrieval_inputs[{index}] has invalid boundary: {boundary!r}")
            if not item.get("kind"):
                reasons.append(f"retrieval_inputs[{index}] missing kind")
            if not item.get("locator"):
                reasons.append(f"retrieval_inputs[{index}] missing locator")
            input_private = input_private or boundary == "private" or _as_bool(item.get("contains_private_detail"))
            input_advice = input_advice or _as_bool(item.get("contains_medical_advice"))

    output_boundary = output_packet.get("boundary")
    output_scope = output_packet.get("allowed_memory_scope")
    output_private = _as_bool(output_packet.get("contains_private_detail"))
    output_advice = _as_bool(output_packet.get("contains_medical_advice"))
    output_action = output_packet.get("action")

    if output_boundary not in {"public", "private", "synthetic"}:
        reasons.append(f"invalid output boundary: {output_boundary!r}")
    if output_scope not in {PUBLIC_MEMORY, PRIVATE_MEMORY, "do_not_store"}:
        reasons.append(f"invalid allowed_memory_scope: {output_scope!r}")
    if output_action not in {"admit_with_provenance", "admit_with_privacy_partition", "reject", "quarantine"}:
        reasons.append(f"invalid action: {output_action!r}")

    if input_private and output_scope == PUBLIC_MEMORY:
        reasons.append("private input cannot route to public discovery memory")
    if output_private and output_scope == PUBLIC_MEMORY:
        reasons.append("private output cannot route to public discovery memory")
    if privacy_status == "private_present" and output_scope == PUBLIC_MEMORY:
        reasons.append("privacy_status private_present cannot route to public discovery memory")
    if source_status == "mixed_public_private" and output_scope == PUBLIC_MEMORY:
        reasons.append("mixed public/private source requires private partition or rejection")
    if input_advice or output_advice:
        reasons.append("medical/veterinary advice content must not enter discovery memory")
    if output_action.startswith("admit") and output_scope == "do_not_store":
        reasons.append("admit action conflicts with do_not_store scope")
    if output_action == "admit_with_provenance" and output_scope == PRIVATE_MEMORY:
        reasons.append("private memory admission requires privacy partition action")

    return BoundaryResult(packet_id=packet_id, decision="fail" if reasons else "pass", reasons=reasons)


def load_packets(path: Path) -> list[dict[str, Any]]:
    data = json.loads(path.read_text(encoding="utf-8"))
    if isinstance(data, dict):
        data = data.get("packets", [])
    if not isinstance(data, list):
        raise ValueError("Input must be a list of packet objects or an object with a packets list")
    return data


def evaluate_packets(packets: Iterable[dict[str, Any]], enforce_expected: bool = False) -> list[BoundaryResult]:
    results: list[BoundaryResult] = []
    for packet in packets:
        result = check_packet(packet)
        expected = packet.get("expected_decision")
        if enforce_expected and expected and expected != result.decision:
            result = BoundaryResult(
                packet_id=result.packet_id,
                decision="fail",
                reasons=result.reasons + [f"expected {expected!r} but got {result.decision!r}"],
            )
        results.append(result)
    return results


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description="Check MC retrieval boundary packets.")
    parser.add_argument("path", type=Path, help="JSON file containing packets")
    parser.add_argument("--enforce-expected", action="store_true", help="Fail when expected_decision mismatches actual decision")
    parser.add_argument("--json", action="store_true", help="Emit machine-readable results")
    args = parser.parse_args(argv)

    packets = load_packets(args.path)
    results = evaluate_packets(packets, enforce_expected=args.enforce_expected)

    payload = [
        {"id": result.packet_id, "decision": result.decision, "reasons": result.reasons}
        for result in results
    ]

    if args.json:
        print(json.dumps(payload, indent=2, sort_keys=True))
    else:
        for item in payload:
            print(f"{item['id']}: {item['decision']}")
            for reason in item["reasons"]:
                print(f"  - {reason}")

    return 0 if all(result.passed for result in results) else 1


if __name__ == "__main__":
    sys.exit(main())
