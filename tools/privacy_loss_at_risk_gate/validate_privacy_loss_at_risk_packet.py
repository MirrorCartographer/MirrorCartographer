#!/usr/bin/env python3
"""Validate Privacy Loss at Risk Gate packets.

This validator intentionally uses only the Python standard library so it can run
inside lightweight GitHub/Codex environments without dependency setup.
"""

import json
import sys
from pathlib import Path

REQUIRED_TOP = [
    "packet_id",
    "source_status",
    "claim_status",
    "privacy_status",
    "missingness",
    "revision_reason",
    "implementation_status",
    "evidence_strength",
    "falsification_route",
    "next_executable_action",
    "data_context",
    "query_context",
    "risk_model",
    "decision",
]

ALLOWED = {
    "source_status": {"primary", "institutional", "preprint", "benchmark", "synthetic", "mixed"},
    "claim_status": {"hypothesis", "evaluation_criterion", "schema", "prototype_requirement", "source_map", "collaborator_target"},
    "privacy_status": {"public_safe", "synthetic_only", "deidentified", "sensitive_placeholder", "blocked_private"},
    "implementation_status": {"proposed", "implemented", "tested", "needs_ci", "deprecated"},
    "evidence_strength": {"low", "moderate", "high"},
}

DOMAIN = {"human_health", "animal_health", "mechanistic_biology", "neuroscience", "hci", "scientific_ai"}
IDENTIFIER_POLICY = {"no_identifiers", "typed_placeholders", "hashed_local_only", "blocked"}
COHORT = {"individual", "small_cohort", "large_cohort", "synthetic_baseline"}
QUERY_TYPE = {"comparison", "trajectory", "hypothesis_generation", "retrieval_augmented_answer", "memory_write"}
RISK_LEVEL = {"low", "medium", "high"}
RISK_METRIC = {"privacy_loss_at_risk", "contextual_leakage_score", "k_anonymity_floor", "manual_review_only"}
THRESHOLD_ACTION = {"allow", "coarsen", "synthetic_only", "local_only", "block"}


def require(condition, message, errors):
    if not condition:
        errors.append(message)


def validate(packet):
    errors = []
    for key in REQUIRED_TOP:
        require(key in packet, f"missing top-level field: {key}", errors)
    if errors:
        return errors

    for key, allowed in ALLOWED.items():
        require(packet[key] in allowed, f"invalid {key}: {packet[key]!r}", errors)

    for key in ["missingness", "revision_reason", "next_executable_action"]:
        require(isinstance(packet[key], str) and len(packet[key]) >= 10, f"{key} is too short", errors)
    require(isinstance(packet["falsification_route"], str) and len(packet["falsification_route"]) >= 20, "falsification_route is too short", errors)

    data = packet["data_context"]
    for key in ["domain", "data_type", "identifier_policy", "cohort_granularity", "longitudinal_window", "rare_feature_handling"]:
        require(key in data, f"missing data_context.{key}", errors)
    if not errors:
        require(data["domain"] in DOMAIN, "invalid data_context.domain", errors)
        require(data["identifier_policy"] in IDENTIFIER_POLICY, "invalid data_context.identifier_policy", errors)
        require(data["cohort_granularity"] in COHORT, "invalid data_context.cohort_granularity", errors)
        require(len(str(data["rare_feature_handling"])) >= 10, "rare_feature_handling is too short", errors)

    query = packet["query_context"]
    for key in ["query_type", "retrieval_scope", "repeat_query_risk", "contextual_leakage_risk"]:
        require(key in query, f"missing query_context.{key}", errors)
    if not errors:
        require(query["query_type"] in QUERY_TYPE, "invalid query_context.query_type", errors)
        require(query["repeat_query_risk"] in RISK_LEVEL, "invalid query_context.repeat_query_risk", errors)
        require(query["contextual_leakage_risk"] in RISK_LEVEL, "invalid query_context.contextual_leakage_risk", errors)

    risk = packet["risk_model"]
    for key in ["static_controls", "cumulative_controls", "risk_metric", "utility_metric", "threshold_action"]:
        require(key in risk, f"missing risk_model.{key}", errors)
    if not errors:
        require(isinstance(risk["static_controls"], list) and len(risk["static_controls"]) >= 1, "risk_model.static_controls must be non-empty", errors)
        require(isinstance(risk["cumulative_controls"], list) and len(risk["cumulative_controls"]) >= 1, "risk_model.cumulative_controls must be non-empty", errors)
        require(risk["risk_metric"] in RISK_METRIC, "invalid risk_model.risk_metric", errors)
        require(risk["threshold_action"] in THRESHOLD_ACTION, "invalid risk_model.threshold_action", errors)

    decision = packet["decision"]
    for key in ["memory_write_allowed", "reason", "review_required"]:
        require(key in decision, f"missing decision.{key}", errors)
    if not errors:
        require(isinstance(decision["memory_write_allowed"], bool), "decision.memory_write_allowed must be boolean", errors)
        require(isinstance(decision["review_required"], bool), "decision.review_required must be boolean", errors)
        require(len(str(decision["reason"])) >= 15, "decision.reason is too short", errors)

    if risk.get("threshold_action") in {"block", "local_only"}:
        require(decision.get("memory_write_allowed") is False, "blocked/local_only packets cannot allow reusable memory writes", errors)
    if query.get("contextual_leakage_risk") == "high" and risk.get("threshold_action") == "allow":
        errors.append("high contextual leakage risk cannot use threshold_action=allow")
    if data.get("cohort_granularity") == "individual" and packet.get("privacy_status") not in {"sensitive_placeholder", "blocked_private", "synthetic_only"}:
        errors.append("individual-level context requires placeholder, blocked, or synthetic privacy status")

    return errors


def main(argv):
    if len(argv) != 2:
        print("usage: validate_privacy_loss_at_risk_packet.py PACKET.json", file=sys.stderr)
        return 2
    path = Path(argv[1])
    packet = json.loads(path.read_text())
    errors = validate(packet)
    if errors:
        for error in errors:
            print(f"ERROR: {error}", file=sys.stderr)
        return 1
    print(f"valid: {path}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv))
