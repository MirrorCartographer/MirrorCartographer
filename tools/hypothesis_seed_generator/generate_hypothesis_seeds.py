#!/usr/bin/env python3
"""Generate conservative, falsifiable hypothesis seeds from public-safe MC packets.

This tool intentionally does not create advice, diagnosis, treatment guidance,
veterinary guidance, or cure claims. It only converts bounded observation
structures into next-step falsification prompts.
"""

from __future__ import annotations

import hashlib
import json
import sys
from typing import Any, Dict, List, Tuple

BLOCKING_SOURCE_STATUSES = {"unknown", "private"}
BLOCKING_PRIVACY_STATUSES = {"unknown", "private_residue"}
BLOCKING_CLAIM_STATUSES = {"unsupported_claim", "advice", "cure_claim"}
ALLOWED_DOMAINS = {"human", "animal", "literature", "environment", "mixed"}


def stable_seed_id(packet_id: str, signals: List[str]) -> str:
    payload = packet_id + "::" + "|".join(sorted(signals))
    digest = hashlib.sha256(payload.encode("utf-8")).hexdigest()[:12]
    return f"hyp-seed-{digest}"


def block_reason(packet: Dict[str, Any]) -> List[str]:
    reasons: List[str] = []

    if packet.get("domain") not in ALLOWED_DOMAINS:
        reasons.append("domain_invalid_or_missing")

    if packet.get("source_status") in BLOCKING_SOURCE_STATUSES:
        reasons.append("source_not_public_safe")

    if packet.get("privacy_status") in BLOCKING_PRIVACY_STATUSES:
        reasons.append("privacy_not_public_safe")

    if packet.get("claim_status") in BLOCKING_CLAIM_STATUSES:
        reasons.append("claim_status_blocks_hypothesis_generation")

    if not isinstance(packet.get("missingness"), list):
        reasons.append("missingness_must_be_list")

    signals = packet.get("signals")
    if not isinstance(signals, list) or len([s for s in signals if str(s).strip()]) < 2:
        reasons.append("insufficient_signal_count")

    contradictions = packet.get("contradictions", [])
    if contradictions and not all(isinstance(item, str) and item.strip() for item in contradictions):
        reasons.append("contradictions_not_explicitly_described")

    return reasons


def make_hypothesis_seed(packet: Dict[str, Any]) -> Dict[str, Any]:
    signals = [str(s).strip() for s in packet["signals"] if str(s).strip()]
    context = [str(c).strip() for c in packet.get("context_factors", []) if str(c).strip()]
    packet_id = str(packet["packet_id"])

    if context:
        context_phrase = ", ".join(context[:3])
    else:
        context_phrase = "documented context factors"

    hypothesis = (
        "Candidate pattern only: the co-occurrence of "
        + ", ".join(signals[:3])
        + f" may vary with {context_phrase}. This is not causal, diagnostic, advisory, or curative."
    )

    falsification_prompts = [
        "Find time windows where the same context factors occurred without the signal cluster.",
        "Find time windows where the signal cluster occurred without the named context factors.",
        "Check whether missing baseline frequency could explain the apparent pattern.",
        "Search for contradictory packets before promoting this seed.",
    ]

    required_next_evidence = [
        "baseline_frequency_window",
        "followup_frequency_window",
        "contradiction_ledger_entry",
        "provenance_packet",
        "reviewer_boundary_status",
    ]

    return {
        "seed_id": stable_seed_id(packet_id, signals),
        "packet_id": packet_id,
        "domain": packet["domain"],
        "hypothesis_seed": hypothesis,
        "source_status": packet.get("source_status"),
        "claim_status": "hypothesis_seed_not_promoted",
        "privacy_status": packet.get("privacy_status"),
        "missingness": packet.get("missingness", []),
        "revision_reason": "generated conservative falsification-ready seed from bounded observations",
        "falsification_prompts": falsification_prompts,
        "required_next_evidence": required_next_evidence,
        "implementation_status": "executable_cli_generated_seed",
        "testability": "deterministic_output_from_synthetic_fixture",
        "next_executable_action": "send seed to falsification_task_queue_builder before any promotion",
    }


def generate(packets: List[Dict[str, Any]]) -> Dict[str, Any]:
    accepted: List[Dict[str, Any]] = []
    blocked: List[Dict[str, Any]] = []

    for packet in packets:
        reasons = block_reason(packet)
        if reasons:
            blocked.append(
                {
                    "packet_id": packet.get("packet_id", "missing_packet_id"),
                    "block_reasons": reasons,
                    "source_status": packet.get("source_status", "missing"),
                    "claim_status": packet.get("claim_status", "missing"),
                    "privacy_status": packet.get("privacy_status", "missing"),
                    "missingness": packet.get("missingness", "missing"),
                    "revision_reason": "blocked before hypothesis generation",
                    "implementation_status": "blocked_by_generator",
                    "testability": "assert block_reasons contains expected gate result",
                    "next_executable_action": "repair packet labels or route to redaction/review",
                }
            )
            continue

        accepted.append(make_hypothesis_seed(packet))

    return {
        "generated_at_policy": "static-public-safe",
        "accepted_seeds": accepted,
        "blocked_packets": blocked,
        "summary": {
            "accepted_count": len(accepted),
            "blocked_count": len(blocked),
        },
    }


def load_packets(path: str) -> List[Dict[str, Any]]:
    with open(path, "r", encoding="utf-8") as handle:
        data = json.load(handle)
    if not isinstance(data, list):
        raise ValueError("input must be a JSON array of packets")
    return data


def main(argv: List[str]) -> int:
    if len(argv) != 2:
        print("usage: generate_hypothesis_seeds.py <packets.json>", file=sys.stderr)
        return 2

    packets = load_packets(argv[1])
    print(json.dumps(generate(packets), indent=2, sort_keys=True))
    return 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv))
