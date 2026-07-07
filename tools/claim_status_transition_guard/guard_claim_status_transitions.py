#!/usr/bin/env python3
"""Mirror Cartographer claim status transition guard.

Public-safe executable validator. It prevents unsafe escalation of notes,
observations, evidence packets, and hypotheses into stronger claim states before
privacy, source-chain, missingness, measurement, falsification, and review gates
are satisfied.
"""

from __future__ import annotations

import argparse
import json
import sys
from dataclasses import dataclass
from pathlib import Path
from typing import Any, Dict, Iterable, List

CLAIM_LADDER = [
    "raw_note",
    "observation",
    "normalized_evidence",
    "hypothesis_seed",
    "falsification_ready",
    "review_ready",
    "collaborator_export_ready",
]

CLAIM_INDEX = {status: index for index, status in enumerate(CLAIM_LADDER)}
SAFE_PRIVACY = {"public_safe"}


@dataclass(frozen=True)
class GuardResult:
    id: str
    decision: str
    blocked_reasons: List[str]
    source_status: str
    claim_status: str
    privacy_status: str
    missingness: Any
    revision_reason: str
    implementation_status: str
    testability: str
    next_executable_action: str

    def as_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "decision": self.decision,
            "blocked_reasons": self.blocked_reasons,
            "source_status": self.source_status,
            "claim_status": self.claim_status,
            "privacy_status": self.privacy_status,
            "missingness": self.missingness,
            "revision_reason": self.revision_reason,
            "implementation_status": self.implementation_status,
            "testability": self.testability,
            "next_executable_action": self.next_executable_action,
        }


def load_transitions(path: Path) -> List[Dict[str, Any]]:
    raw = json.loads(path.read_text(encoding="utf-8"))
    if isinstance(raw, dict):
        return [raw]
    if isinstance(raw, list) and all(isinstance(item, dict) for item in raw):
        return raw
    raise ValueError("Input must be a transition object or an array of transition objects")


def _packets(transition: Dict[str, Any]) -> Iterable[Dict[str, Any]]:
    packets = transition.get("evidence_packets", [])
    if not isinstance(packets, list):
        return []
    return [packet for packet in packets if isinstance(packet, dict)]


def validate_transition(transition: Dict[str, Any]) -> GuardResult:
    blocked: List[str] = []
    tid = str(transition.get("id", "unknown-transition"))
    source_status = str(transition.get("source_status", "missing"))
    privacy_status = str(transition.get("privacy_status", "missing"))
    from_status = transition.get("from_claim_status")
    to_status = transition.get("to_claim_status")
    revision_reason = transition.get("revision_reason", "")
    missingness = transition.get("missingness", "MISSING_FIELD")

    if privacy_status not in SAFE_PRIVACY:
        blocked.append(f"privacy_status_not_public_safe:{privacy_status}")

    if "missingness" not in transition:
        blocked.append("missingness_field_required")
    elif not isinstance(missingness, list):
        blocked.append("missingness_must_be_array")

    if not isinstance(revision_reason, str) or not revision_reason.strip():
        blocked.append("revision_reason_required")

    if from_status not in CLAIM_INDEX:
        blocked.append(f"unknown_from_claim_status:{from_status}")
    if to_status not in CLAIM_INDEX:
        blocked.append(f"unknown_to_claim_status:{to_status}")

    if from_status in CLAIM_INDEX and to_status in CLAIM_INDEX:
        delta = CLAIM_INDEX[to_status] - CLAIM_INDEX[from_status]
        if delta < 0:
            blocked.append("demotion_not_handled_by_promotion_guard")
        if delta > 1 and "explicit_manual_override" not in str(revision_reason):
            blocked.append("skipped_claim_status_without_explicit_manual_override")
        if to_status == "collaborator_export_ready" and from_status != "review_ready":
            blocked.append("collaborator_export_requires_review_ready_source")

    packets = list(_packets(transition))
    packet_ids = [str(packet.get("id", "unknown-packet")) for packet in packets]

    def packet_failures(field: str) -> List[str]:
        return [pid for pid, packet in zip(packet_ids, packets) if packet.get(field) is not True]

    if to_status in {"hypothesis_seed", "falsification_ready", "review_ready", "collaborator_export_ready"}:
        failures = packet_failures("source_chain_validated")
        if failures:
            blocked.append("source_chain_not_validated:" + ",".join(failures))
        failures = packet_failures("retrieval_boundary_checked")
        if failures:
            blocked.append("retrieval_boundary_not_checked:" + ",".join(failures))
        failures = packet_failures("outcome_measures_defined")
        if failures:
            blocked.append("outcome_measures_not_defined:" + ",".join(failures))

    if to_status in {"falsification_ready", "review_ready", "collaborator_export_ready"}:
        failures = packet_failures("falsification_tasks_defined")
        if failures:
            blocked.append("falsification_tasks_not_defined:" + ",".join(failures))

    if to_status in {"review_ready", "collaborator_export_ready"}:
        low_score = []
        for pid, packet in zip(packet_ids, packets):
            try:
                score = float(packet.get("review_readiness_score", 0.0))
            except (TypeError, ValueError):
                score = 0.0
            if score < 0.8:
                low_score.append(pid)
        if low_score:
            blocked.append("review_readiness_score_below_0_8:" + ",".join(low_score))

    decision = "allow_transition" if not blocked else "block_transition"
    claim_status = f"{from_status}->{to_status}"
    next_action = (
        "write transition to claim dependency graph and review packet index"
        if decision == "allow_transition"
        else "repair blocked fields, rerun guard, then retry promotion"
    )

    return GuardResult(
        id=tid,
        decision=decision,
        blocked_reasons=blocked,
        source_status=source_status,
        claim_status=claim_status,
        privacy_status=privacy_status,
        missingness=missingness,
        revision_reason=str(revision_reason),
        implementation_status="executable_cli_guard",
        testability="python tools/claim_status_transition_guard/test_guard_claim_status_transitions.py",
        next_executable_action=next_action,
    )


def run(input_path: Path) -> List[Dict[str, Any]]:
    return [validate_transition(item).as_dict() for item in load_transitions(input_path)]


def main(argv: List[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description="Guard MC claim status transitions")
    parser.add_argument("--input", required=True, help="Path to transition JSON")
    args = parser.parse_args(argv)
    results = run(Path(args.input))
    print(json.dumps(results, indent=2, sort_keys=True))
    return 1 if any(result["decision"] == "block_transition" for result in results) else 0


if __name__ == "__main__":
    sys.exit(main())
