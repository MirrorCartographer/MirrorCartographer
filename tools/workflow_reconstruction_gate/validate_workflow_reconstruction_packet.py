#!/usr/bin/env python3
"""Validate Workflow Reconstruction Gate packets.

This validator intentionally uses only the Python standard library so the gate can run
in lightweight environments before CI dependencies are installed.
"""
from __future__ import annotations

import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent

REQUIRED_TOP_LEVEL = [
    "packet_id",
    "research_question",
    "source_status",
    "claim_status",
    "privacy_status",
    "missingness",
    "revision_reason",
    "implementation_status",
    "evidence_strength",
    "source_anchors",
    "boundary_conditions",
    "workflow_trace",
    "hypothesis_updates",
    "method_fit",
    "validation_route",
    "falsification_route",
    "next_executable_action",
]

ENUMS = {
    "source_status": {
        "primary",
        "clinical_research_institution",
        "preprint_with_caveat",
        "grant_or_prize_program",
        "dataset_or_benchmark",
        "open_source_tool",
        "synthetic_fixture",
    },
    "claim_status": {
        "hypothesis",
        "evaluation_criterion",
        "schema_requirement",
        "prototype_requirement",
        "source_map",
        "collaborator_target",
    },
    "privacy_status": {
        "public_safe_synthetic",
        "deidentified_research",
        "local_only_private",
        "restricted_sensitive",
        "unknown_reject",
    },
    "implementation_status": {
        "proposed",
        "schema_only",
        "validator_built",
        "tests_built",
        "ci_wired",
        "deprecated",
    },
    "evidence_strength": {"low", "moderate", "high", "insufficient_reject"},
}


def _require(condition: bool, message: str, errors: list[str]) -> None:
    if not condition:
        errors.append(message)


def validate(packet: dict) -> list[str]:
    errors: list[str] = []

    for field in REQUIRED_TOP_LEVEL:
        _require(field in packet, f"missing required field: {field}", errors)

    for field, allowed in ENUMS.items():
        if field in packet:
            _require(packet[field] in allowed, f"invalid {field}: {packet[field]!r}", errors)

    _require(len(str(packet.get("research_question", ""))) >= 20, "research_question must be bounded and descriptive", errors)
    _require(len(str(packet.get("revision_reason", ""))) >= 15, "revision_reason must explain why the packet changed", errors)
    _require(len(str(packet.get("validation_route", ""))) >= 20, "validation_route must be executable", errors)
    _require(len(str(packet.get("falsification_route", ""))) >= 20, "falsification_route must be explicit", errors)
    _require(len(str(packet.get("next_executable_action", ""))) >= 10, "next_executable_action must be concrete", errors)

    missingness = packet.get("missingness", {})
    _require(isinstance(missingness, dict), "missingness must be an object", errors)
    if isinstance(missingness, dict):
        _require(missingness.get("status") in {"explicitly_modeled", "not_applicable"}, "missingness.status must be explicitly modeled or not applicable", errors)
        _require(isinstance(missingness.get("expected_missing_fields"), list), "missingness.expected_missing_fields must be a list", errors)
        _require(len(str(missingness.get("handling_rule", ""))) >= 10, "missingness.handling_rule must be specific", errors)

    anchors = packet.get("source_anchors", [])
    _require(isinstance(anchors, list) and len(anchors) >= 2, "at least two source anchors are required", errors)
    if isinstance(anchors, list):
        for i, anchor in enumerate(anchors):
            _require(isinstance(anchor, dict), f"source_anchors[{i}] must be an object", errors)
            if isinstance(anchor, dict):
                for key in ["name", "status", "date", "role"]:
                    _require(bool(anchor.get(key)), f"source_anchors[{i}].{key} is required", errors)
                _require(len(str(anchor.get("role", ""))) >= 10, f"source_anchors[{i}].role must state its gate use", errors)

    boundary = packet.get("boundary_conditions", {})
    _require(isinstance(boundary, dict), "boundary_conditions must be an object", errors)
    if isinstance(boundary, dict):
        modalities = boundary.get("modality", [])
        _require(isinstance(modalities, list) and len(modalities) >= 1, "boundary_conditions.modality must list at least one modality", errors)
        for key in ["dataset_or_context", "species_or_population", "time_boundary", "exclusion_boundary"]:
            _require(len(str(boundary.get(key, ""))) >= 4, f"boundary_conditions.{key} must be specific", errors)

    trace = packet.get("workflow_trace", [])
    _require(isinstance(trace, list) and len(trace) >= 3, "workflow_trace must include at least three reproducible steps", errors)
    if isinstance(trace, list):
        for i, step in enumerate(trace):
            _require(isinstance(step, dict), f"workflow_trace[{i}] must be an object", errors)
            if isinstance(step, dict):
                _require(isinstance(step.get("step"), int), f"workflow_trace[{i}].step must be an integer", errors)
                for key in ["input", "operation", "output", "reproducibility_note"]:
                    _require(len(str(step.get(key, ""))) >= 3, f"workflow_trace[{i}].{key} is required", errors)
                _require(len(str(step.get("reproducibility_note", ""))) >= 10, f"workflow_trace[{i}].reproducibility_note must be useful", errors)

    updates = packet.get("hypothesis_updates", [])
    _require(isinstance(updates, list) and len(updates) >= 1, "at least one hypothesis update is required", errors)
    if isinstance(updates, list):
        for i, update in enumerate(updates):
            _require(isinstance(update, dict), f"hypothesis_updates[{i}] must be an object", errors)
            if isinstance(update, dict):
                for key in ["before", "evidence_trigger", "after", "decision"]:
                    _require(bool(update.get(key)), f"hypothesis_updates[{i}].{key} is required", errors)
                _require(update.get("decision") in {"promote", "hold", "revise", "reject"}, f"hypothesis_updates[{i}].decision is invalid", errors)

    method_fit = packet.get("method_fit", {})
    _require(isinstance(method_fit, dict), "method_fit must be an object", errors)
    if isinstance(method_fit, dict):
        _require(len(str(method_fit.get("appropriateness_rationale", ""))) >= 20, "method_fit.appropriateness_rationale must be substantive", errors)
        limitations = method_fit.get("known_limitations", [])
        _require(isinstance(limitations, list) and len(limitations) >= 1, "method_fit.known_limitations must list at least one limitation", errors)

    if packet.get("privacy_status") == "unknown_reject":
        errors.append("privacy_status unknown_reject cannot pass")
    if packet.get("evidence_strength") == "insufficient_reject":
        errors.append("evidence_strength insufficient_reject cannot pass")

    return errors


def main(argv: list[str]) -> int:
    if len(argv) != 2:
        print("usage: validate_workflow_reconstruction_packet.py <packet.json>", file=sys.stderr)
        return 2

    path = Path(argv[1])
    packet = json.loads(path.read_text(encoding="utf-8"))
    errors = validate(packet)
    if errors:
        print("FAIL")
        for error in errors:
            print(f"- {error}")
        return 1
    print("PASS")
    return 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv))
