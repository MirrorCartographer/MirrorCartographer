#!/usr/bin/env python3
"""Validate Mirror Cartographer Agent Judgment Gate packets.

This public-safe CLI intentionally uses only the Python standard library. It checks the
schema-level requirements that matter for discovery-memory admission: ambiguity handling,
artifact grounding, atomic fact checks, measurable variables, privacy boundary, and a
falsification route.
"""
from __future__ import annotations

import argparse
import json
import re
import sys
from pathlib import Path
from typing import Any

ALLOWED_DOMAINS = {
    "cure_discovery_infrastructure",
    "scientific_ai",
    "medical_ai_evidence_organization",
    "mechanistic_biology",
    "neuroscience",
    "longitudinal_health_data",
    "animal_health_research_infrastructure",
    "hci",
    "privacy_preserving_memory",
    "hypothesis_generation",
}
ALLOWED_SOURCE_STATUS = {"primary", "preprint", "institutional", "benchmark", "dataset", "synthetic", "mixed"}
ALLOWED_CLAIM_STATUS = {"hypothesis", "testable_design_implication", "supported_infrastructure_pattern", "contradicted", "inconclusive"}
ALLOWED_PRIVACY_STATUS = {"public_safe", "synthetic_only", "deidentified", "reject_private"}
ALLOWED_IMPLEMENTATION_STATUS = {"proposed", "implemented", "validated", "rejected"}
ALLOWED_EVIDENCE_STRENGTH = {"low", "moderate", "high"}
ALLOWED_ARTIFACT_TYPES = {"paper", "dataset", "benchmark", "code", "figure", "table", "protocol", "web_reference", "synthetic_fixture"}
ALLOWED_SUPPORT_STATUS = {"supported", "partial", "unsupported", "contradicted"}
PACKET_ID_RE = re.compile(r"^[a-z0-9][a-z0-9_.-]+$")


def _is_nonempty_string(value: Any, min_len: int = 1) -> bool:
    return isinstance(value, str) and len(value.strip()) >= min_len


def validate_packet(packet: dict[str, Any]) -> list[str]:
    errors: list[str] = []

    required = [
        "packet_id",
        "claim_text",
        "domain",
        "source_status",
        "claim_status",
        "privacy_status",
        "missingness",
        "revision_reason",
        "implementation_status",
        "evidence_strength",
        "ambiguity_decisions",
        "artifact_grounding",
        "atomic_fact_checks",
        "measurable_variables",
        "falsification_route",
        "next_executable_action",
    ]
    for key in required:
        if key not in packet:
            errors.append(f"missing required field: {key}")

    if errors:
        return errors

    packet_id = packet["packet_id"]
    if not _is_nonempty_string(packet_id, 6) or not PACKET_ID_RE.match(packet_id):
        errors.append("packet_id must be at least 6 chars and use lowercase letters, numbers, dots, underscores, or hyphens")

    if not _is_nonempty_string(packet["claim_text"], 20):
        errors.append("claim_text must be at least 20 characters")
    if packet["domain"] not in ALLOWED_DOMAINS:
        errors.append(f"domain is not allowed: {packet['domain']!r}")
    if packet["source_status"] not in ALLOWED_SOURCE_STATUS:
        errors.append(f"source_status is not allowed: {packet['source_status']!r}")
    if packet["claim_status"] not in ALLOWED_CLAIM_STATUS:
        errors.append(f"claim_status is not allowed: {packet['claim_status']!r}")
    if packet["privacy_status"] not in ALLOWED_PRIVACY_STATUS:
        errors.append(f"privacy_status is not allowed: {packet['privacy_status']!r}")
    if packet["implementation_status"] not in ALLOWED_IMPLEMENTATION_STATUS:
        errors.append(f"implementation_status is not allowed: {packet['implementation_status']!r}")
    if packet["evidence_strength"] not in ALLOWED_EVIDENCE_STRENGTH:
        errors.append(f"evidence_strength is not allowed: {packet['evidence_strength']!r}")

    if packet["privacy_status"] == "reject_private":
        errors.append("privacy_status=reject_private blocks public discovery-memory admission")

    missingness = packet["missingness"]
    if not isinstance(missingness, list) or not missingness or not all(_is_nonempty_string(item) for item in missingness):
        errors.append("missingness must be a non-empty list of strings")

    if not _is_nonempty_string(packet["revision_reason"], 15):
        errors.append("revision_reason must be at least 15 characters")
    if not _is_nonempty_string(packet["falsification_route"], 25):
        errors.append("falsification_route must be at least 25 characters")
    if not _is_nonempty_string(packet["next_executable_action"], 15):
        errors.append("next_executable_action must be at least 15 characters")

    ambiguity_decisions = packet["ambiguity_decisions"]
    if not isinstance(ambiguity_decisions, list) or not ambiguity_decisions:
        errors.append("ambiguity_decisions must contain at least one decision")
    else:
        for index, decision in enumerate(ambiguity_decisions):
            if not isinstance(decision, dict):
                errors.append(f"ambiguity_decisions[{index}] must be an object")
                continue
            if not _is_nonempty_string(decision.get("decision"), 8):
                errors.append(f"ambiguity_decisions[{index}].decision is missing or too short")
            alternatives = decision.get("alternatives_considered")
            if not isinstance(alternatives, list) or not alternatives or not all(_is_nonempty_string(a) for a in alternatives):
                errors.append(f"ambiguity_decisions[{index}].alternatives_considered must be a non-empty string list")
            if not _is_nonempty_string(decision.get("why_chosen"), 12):
                errors.append(f"ambiguity_decisions[{index}].why_chosen is missing or too short")
            if not _is_nonempty_string(decision.get("uncertainty_remaining"), 5):
                errors.append(f"ambiguity_decisions[{index}].uncertainty_remaining is missing or too short")

    artifact_grounding = packet["artifact_grounding"]
    artifact_ids: set[str] = set()
    if not isinstance(artifact_grounding, list) or not artifact_grounding:
        errors.append("artifact_grounding must contain at least one artifact")
    else:
        for index, artifact in enumerate(artifact_grounding):
            if not isinstance(artifact, dict):
                errors.append(f"artifact_grounding[{index}] must be an object")
                continue
            if artifact.get("artifact_type") not in ALLOWED_ARTIFACT_TYPES:
                errors.append(f"artifact_grounding[{index}].artifact_type is not allowed")
            artifact_id = artifact.get("artifact_id")
            if not _is_nonempty_string(artifact_id, 3):
                errors.append(f"artifact_grounding[{index}].artifact_id is missing or too short")
            else:
                artifact_ids.add(artifact_id)
            if not _is_nonempty_string(artifact.get("used_for"), 10):
                errors.append(f"artifact_grounding[{index}].used_for is missing or too short")
            if not _is_nonempty_string(artifact.get("not_used_for"), 10):
                errors.append(f"artifact_grounding[{index}].not_used_for is missing or too short")

    atomic_fact_checks = packet["atomic_fact_checks"]
    if not isinstance(atomic_fact_checks, list) or len(atomic_fact_checks) < 2:
        errors.append("atomic_fact_checks must contain at least two atomic facts")
    else:
        supported_count = 0
        for index, fact in enumerate(atomic_fact_checks):
            if not isinstance(fact, dict):
                errors.append(f"atomic_fact_checks[{index}] must be an object")
                continue
            if not _is_nonempty_string(fact.get("fact"), 8):
                errors.append(f"atomic_fact_checks[{index}].fact is missing or too short")
            support_status = fact.get("support_status")
            if support_status not in ALLOWED_SUPPORT_STATUS:
                errors.append(f"atomic_fact_checks[{index}].support_status is not allowed")
            if support_status == "supported":
                supported_count += 1
            supporting_artifact_id = fact.get("supporting_artifact_id")
            if not _is_nonempty_string(supporting_artifact_id, 3):
                errors.append(f"atomic_fact_checks[{index}].supporting_artifact_id is missing or too short")
            elif artifact_ids and supporting_artifact_id not in artifact_ids and not str(supporting_artifact_id).startswith("fixture."):
                errors.append(f"atomic_fact_checks[{index}].supporting_artifact_id does not match a grounded artifact")
            if not _is_nonempty_string(fact.get("contradiction_check"), 8):
                errors.append(f"atomic_fact_checks[{index}].contradiction_check is missing or too short")
        if supported_count < 1:
            errors.append("at least one atomic fact must be supported")

    measurable_variables = packet["measurable_variables"]
    if not isinstance(measurable_variables, list) or len(measurable_variables) < 2 or not all(_is_nonempty_string(v, 3) for v in measurable_variables):
        errors.append("measurable_variables must contain at least two variable names")

    return errors


def load_packets(path: Path) -> list[dict[str, Any]]:
    data = json.loads(path.read_text(encoding="utf-8"))
    if isinstance(data, dict):
        return [data]
    if isinstance(data, list) and all(isinstance(item, dict) for item in data):
        return data
    raise ValueError("input must be a JSON object or a list of JSON objects")


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description="Validate MC Agent Judgment Gate packets")
    parser.add_argument("path", type=Path, help="Path to a packet JSON file or fixture list")
    parser.add_argument("--expect-fixtures", action="store_true", help="Expect packet_id prefixes pass. and fail. to behave accordingly")
    args = parser.parse_args(argv)

    packets = load_packets(args.path)
    failures: dict[str, list[str]] = {}
    fixture_expectation_errors: list[str] = []

    for packet in packets:
        packet_id = str(packet.get("packet_id", "<missing>"))
        errors = validate_packet(packet)
        if errors:
            failures[packet_id] = errors
        if args.expect_fixtures:
            if packet_id.startswith("pass.") and errors:
                fixture_expectation_errors.append(f"{packet_id} expected pass but failed: {errors}")
            if packet_id.startswith("fail.") and not errors:
                fixture_expectation_errors.append(f"{packet_id} expected fail but passed")

    if failures:
        for packet_id, errors in failures.items():
            print(f"FAIL {packet_id}")
            for error in errors:
                print(f"  - {error}")
    else:
        print(f"PASS {len(packets)} packet(s)")

    if fixture_expectation_errors:
        print("FIXTURE EXPECTATION ERRORS")
        for error in fixture_expectation_errors:
            print(f"  - {error}")
        return 1

    if args.expect_fixtures:
        print("Fixture expectations satisfied")
        return 0

    return 1 if failures else 0


if __name__ == "__main__":
    raise SystemExit(main())
