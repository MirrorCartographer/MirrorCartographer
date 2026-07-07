#!/usr/bin/env python3
"""Build a deterministic falsification task queue from public-safe hypothesis packets.

This component is intentionally dependency-free so it can run in CI, local shells,
or constrained research handoff environments.
"""

from __future__ import annotations

import json
import sys
from dataclasses import dataclass
from pathlib import Path
from typing import Any, Dict, Iterable, List, Tuple

ALLOWED_DOMAINS = {
    "medical_literature",
    "animal_care",
    "longitudinal_pattern",
    "system_evaluation",
    "collaboration",
}
ALLOWED_STATUSES = {"candidate", "needs_review", "falsification_ready", "blocked"}
ALLOWED_RISKS = {"low", "medium", "high"}
SAFE_PRIVACY = {"public_safe_synthetic", "public_safe_redacted"}
REVIEW_DOMAINS = {"medical_literature", "animal_care"}

RISK_SCORE = {"high": 0, "medium": 1, "low": 2}
DOMAIN_SCORE = {
    "animal_care": 0,
    "medical_literature": 1,
    "longitudinal_pattern": 2,
    "collaboration": 3,
    "system_evaluation": 4,
}


@dataclass(frozen=True)
class BlockedPacket:
    hypothesis_id: str
    reasons: List[str]


def load_packets(path: Path) -> List[Dict[str, Any]]:
    data = json.loads(path.read_text(encoding="utf-8"))
    if not isinstance(data, list):
        raise ValueError("input must be a JSON array of hypothesis packets")
    return data


def validate_packet(packet: Dict[str, Any]) -> List[str]:
    reasons: List[str] = []
    required = [
        "hypothesis_id",
        "domain",
        "claim_text",
        "claim_status",
        "evidence_refs",
        "missingness",
        "risk_level",
        "proposed_test",
        "privacy_status",
    ]
    for field in required:
        if field not in packet:
            reasons.append(f"missing field: {field}")

    if reasons:
        return reasons

    if packet["domain"] not in ALLOWED_DOMAINS:
        reasons.append("invalid domain")
    if packet["claim_status"] not in ALLOWED_STATUSES:
        reasons.append("invalid claim_status")
    if packet["risk_level"] not in ALLOWED_RISKS:
        reasons.append("invalid risk_level")
    if packet["privacy_status"] not in SAFE_PRIVACY:
        reasons.append("unsafe privacy_status")
    if not isinstance(packet["evidence_refs"], list):
        reasons.append("evidence_refs must be an array")
    if not isinstance(packet["missingness"], list):
        reasons.append("missingness must be an array")
    if not str(packet["claim_text"]).strip():
        reasons.append("empty claim_text")
    if not packet["missingness"] and not str(packet["proposed_test"]).strip():
        reasons.append("no missingness or proposed falsification test")
    if packet["claim_status"] == "blocked":
        reasons.append("packet already blocked upstream")

    return reasons


def route_for(packet: Dict[str, Any]) -> str:
    if packet["domain"] in {"medical_literature", "animal_care"}:
        return "expert_review_and_counterevidence"
    if packet["domain"] == "longitudinal_pattern":
        return "longitudinal_counterexample_search"
    if packet["domain"] == "collaboration":
        return "collaboration_boundary_review"
    return "system_adversarial_eval"


def falsification_question(packet: Dict[str, Any]) -> str:
    domain = packet["domain"]
    claim = packet["claim_text"].rstrip(".")
    if domain == "animal_care":
        return f"What repeated observation, vet-reviewed counterexample, or controlled context would weaken this animal-care hypothesis: {claim}?"
    if domain == "medical_literature":
        return f"What higher-quality or newer source would contradict or narrow this literature claim: {claim}?"
    if domain == "longitudinal_pattern":
        return f"What missing time window or negative case would prevent this from being called a stable pattern: {claim}?"
    if domain == "collaboration":
        return f"What boundary failure would make this packet unsafe or unclear for collaborator handoff: {claim}?"
    return f"What adversarial fixture would disprove this system-performance claim: {claim}?"


def required_inputs(packet: Dict[str, Any]) -> List[str]:
    inputs = list(packet.get("missingness", []))
    if packet.get("evidence_refs") == []:
        inputs.append("at least one evidence reference or explicit reason for no source")
    if packet["domain"] in REVIEW_DOMAINS:
        inputs.append("qualified review or literature/veterinary counterevidence check")
    return inputs


def stop_condition(packet: Dict[str, Any]) -> str:
    if packet["risk_level"] == "high":
        return "Do not promote until counterevidence search and qualified review are complete."
    if packet["domain"] == "longitudinal_pattern":
        return "Do not promote until negative cases and missing time windows are represented."
    return "Do not promote until the proposed falsification test has a recorded pass/fail result."


def build_queue(packets: Iterable[Dict[str, Any]]) -> Dict[str, Any]:
    queue: List[Dict[str, Any]] = []
    blocked: List[Dict[str, Any]] = []

    for packet in packets:
        hypothesis_id = str(packet.get("hypothesis_id", "UNKNOWN"))
        reasons = validate_packet(packet)
        if reasons:
            blocked.append({"hypothesis_id": hypothesis_id, "reasons": reasons})
            continue

        task = {
            "task_id": f"FAL-{hypothesis_id}",
            "hypothesis_id": hypothesis_id,
            "route": route_for(packet),
            "priority": packet["risk_level"],
            "falsification_question": falsification_question(packet),
            "required_inputs": required_inputs(packet),
            "stop_condition": stop_condition(packet),
            "review_required": packet["risk_level"] == "high" or packet["domain"] in REVIEW_DOMAINS,
        }
        queue.append(task)

    queue.sort(key=lambda task: (RISK_SCORE[task["priority"]], DOMAIN_SCORE.get(_domain_for(task, packets), 9), task["hypothesis_id"]))

    summary = {
        "queued_count": len(queue),
        "blocked_count": len(blocked),
        "high_risk_count": sum(1 for task in queue if task["priority"] == "high"),
        "review_required_count": sum(1 for task in queue if task["review_required"]),
    }
    return {"queue": queue, "blocked": blocked, "summary": summary}


def _domain_for(task: Dict[str, Any], packets: Iterable[Dict[str, Any]]) -> str:
    for packet in packets:
        if packet.get("hypothesis_id") == task["hypothesis_id"]:
            return str(packet.get("domain", ""))
    return ""


def main(argv: List[str]) -> int:
    if len(argv) != 2:
        print("usage: build_falsification_task_queue.py <hypothesis_packets.json>", file=sys.stderr)
        return 2
    result = build_queue(load_packets(Path(argv[1])))
    print(json.dumps(result, indent=2, sort_keys=True))
    return 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv))
