#!/usr/bin/env python3
"""Signal Triage Evaluator for Mirror Cartographer.

Public-safe standard-library CLI that routes observation clusters without
creating medical or veterinary advice.
"""

from __future__ import annotations

import json
import sys
from pathlib import Path
from typing import Any, Dict, List, Tuple

ALLOWED_PRIVACY = {"public_safe", "redacted"}
BLOCKED_CLAIMS = {"advice", "cure_claim"}
ALLOWED_CLAIMS = {"observation", "candidate_signal", "hypothesis"} | BLOCKED_CLAIMS
REQUIRED_CLUSTER_FIELDS = {
    "cluster_id",
    "domain",
    "privacy_status",
    "claim_status",
    "source_status",
    "observations",
    "missingness",
    "contradictions",
    "confounders",
    "candidate_mechanisms",
}
REQUIRED_OBSERVATION_FIELDS = {
    "observed_at",
    "feature",
    "direction",
    "severity",
    "context_tags",
}


def _list_value(value: Any) -> List[Any]:
    return value if isinstance(value, list) else []


def validate_cluster(cluster: Dict[str, Any]) -> Tuple[List[str], List[str]]:
    blockers: List[str] = []
    reasons: List[str] = []

    missing_fields = sorted(REQUIRED_CLUSTER_FIELDS - set(cluster.keys()))
    if missing_fields:
        blockers.append("missing_required_cluster_fields:" + ",".join(missing_fields))
        return blockers, reasons

    if cluster.get("privacy_status") not in ALLOWED_PRIVACY:
        blockers.append("privacy_not_public_safe")

    claim_status = cluster.get("claim_status")
    if claim_status not in ALLOWED_CLAIMS:
        blockers.append("unknown_claim_status")
    elif claim_status in BLOCKED_CLAIMS:
        blockers.append("blocked_claim_status:" + str(claim_status))

    if not isinstance(cluster.get("missingness"), list):
        blockers.append("missingness_must_be_explicit_array")

    observations = cluster.get("observations")
    if not isinstance(observations, list) or not observations:
        blockers.append("observations_required")
    else:
        for index, observation in enumerate(observations):
            if not isinstance(observation, dict):
                blockers.append(f"observation_{index}_not_object")
                continue
            missing_observation_fields = sorted(REQUIRED_OBSERVATION_FIELDS - set(observation.keys()))
            if missing_observation_fields:
                blockers.append(
                    f"observation_{index}_missing_fields:" + ",".join(missing_observation_fields)
                )
            severity = observation.get("severity")
            if not isinstance(severity, int) or severity < 0 or severity > 5:
                blockers.append(f"observation_{index}_severity_out_of_range")

    if len(_list_value(cluster.get("observations"))) >= 2:
        reasons.append("repeated_observations")
    if len(_list_value(cluster.get("candidate_mechanisms"))) > 0:
        reasons.append("candidate_mechanism_present")
    if len(_list_value(cluster.get("missingness"))) > 0:
        reasons.append("missingness_present")
    if len(_list_value(cluster.get("contradictions"))) > 0:
        reasons.append("contradictions_present")
    if len(_list_value(cluster.get("confounders"))) > 0:
        reasons.append("confounders_present")

    return blockers, reasons


def score_cluster(cluster: Dict[str, Any]) -> int:
    observations = _list_value(cluster.get("observations"))
    missingness = _list_value(cluster.get("missingness"))
    contradictions = _list_value(cluster.get("contradictions"))
    confounders = _list_value(cluster.get("confounders"))
    mechanisms = _list_value(cluster.get("candidate_mechanisms"))

    score = 0
    score += min(len(observations), 4)
    score += 2 if len(mechanisms) > 0 else 0
    score -= min(len(missingness), 3)
    score -= 2 * min(len(contradictions), 2)
    score -= min(len(confounders), 3)

    severities = [obs.get("severity") for obs in observations if isinstance(obs, dict)]
    if severities and all(isinstance(value, int) and value >= 3 for value in severities):
        score += 1

    return score


def route_cluster(cluster: Dict[str, Any]) -> Dict[str, Any]:
    blockers, reasons = validate_cluster(cluster)
    score = score_cluster(cluster) if not blockers else 0

    if blockers:
        route = "archive_only"
        next_action = "redact_or_repair_before_reuse"
    elif score >= 6 and cluster.get("claim_status") == "hypothesis":
        route = "falsification_queue"
        next_action = "create_counterexample_tasks"
    elif score >= 5:
        route = "review_queue"
        next_action = "prepare_public_safe_review_packet"
    elif score >= 2:
        route = "watch"
        next_action = "continue_longitudinal_tracking"
    else:
        route = "archive_only"
        next_action = "retain_without_promotion"

    return {
        "cluster_id": cluster.get("cluster_id", "unknown_cluster"),
        "route": route,
        "score": score,
        "blockers": blockers,
        "reasons": reasons,
        "next_action": next_action,
    }


def evaluate(payload: Dict[str, Any]) -> Dict[str, Any]:
    clusters = payload.get("clusters")
    if not isinstance(clusters, list):
        raise ValueError("input must contain a clusters array")
    return {"triage_results": [route_cluster(cluster) for cluster in clusters]}


def main(argv: List[str]) -> int:
    if len(argv) != 2:
        print("Usage: evaluate_signal_triage.py <input.json>", file=sys.stderr)
        return 2

    payload = json.loads(Path(argv[1]).read_text(encoding="utf-8"))
    result = evaluate(payload)
    print(json.dumps(result, indent=2, sort_keys=True))
    return 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv))
