#!/usr/bin/env python3
"""Validate Mirror Cartographer control-condition packets.

This validator is intentionally dependency-free. It checks the subset of the
schema that is most important for discovery-safety: public-safe status,
explicit missingness, measurable variables, controls, expected outcomes,
null-result handling, and falsification route.
"""

from __future__ import annotations

import json
import sys
from pathlib import Path
from typing import Any

ALLOWED_DOMAINS = {
    "cure_discovery_infrastructure",
    "medical_ai_evidence_organization",
    "scientific_reasoning",
    "nervous_system_cognition_model",
    "animal_care_evidence_map",
    "human_ai_sensemaking",
    "privacy_preserving_longitudinal_dataset",
    "symbolic_to_operational_translation",
}

ALLOWED_PRIVACY = {"public_safe", "synthetic_only", "deidentified_public_safe"}
ALLOWED_SOURCE = {"synthetic", "public_primary", "public_secondary", "mixed_public", "unknown"}
ALLOWED_CLAIM = {"hypothesis", "testable_claim", "supported", "contradicted", "inconclusive"}
ALLOWED_MISSINGNESS = {"observed", "not_observed", "unknown", "not_collected", "redacted", "not_applicable"}
REQUIRED_CONTROL_FIELDS = ("positive_control", "negative_control", "counterfactual_control")
REQUIRED_EXPECTED_FIELDS = ("pass_pattern", "fail_pattern", "decision_rule")

PRIVATE_MARKERS = (
    "address", "phone", "email", "ssn", "social security", "diagnose me",
    "treat me", "dosage", "prescribe", "my dog", "my cat", "my chart",
)


def _has_text(value: Any, min_len: int = 1) -> bool:
    return isinstance(value, str) and len(value.strip()) >= min_len


def validate_packet(packet: dict[str, Any]) -> list[str]:
    errors: list[str] = []

    if packet.get("schema_version") != "1.0.0":
        errors.append("schema_version must be 1.0.0")
    if not _has_text(packet.get("packet_id"), 8):
        errors.append("packet_id must be at least 8 characters")
    if not _has_text(packet.get("claim"), 20):
        errors.append("claim must be at least 20 characters")
    if packet.get("domain") not in ALLOWED_DOMAINS:
        errors.append("domain is not allowed")
    if packet.get("source_status") not in ALLOWED_SOURCE:
        errors.append("source_status is not allowed")
    if packet.get("claim_status") not in ALLOWED_CLAIM:
        errors.append("claim_status is not allowed")
    if packet.get("privacy_status") not in ALLOWED_PRIVACY:
        errors.append("privacy_status must be public-safe")

    joined_text = json.dumps(packet, sort_keys=True).lower()
    leaked = [marker for marker in PRIVATE_MARKERS if marker in joined_text]
    if leaked:
        errors.append(f"private_or_advice_marker_present: {', '.join(leaked)}")

    missingness = packet.get("missingness")
    if not isinstance(missingness, dict):
        errors.append("missingness must be an object")
    else:
        if missingness.get("declared") is not True:
            errors.append("missingness.declared must be true")
        states = missingness.get("states_allowed")
        if not isinstance(states, list) or len(set(states)) < 3:
            errors.append("missingness.states_allowed must contain at least 3 distinct states")
        else:
            invalid_states = sorted(set(states) - ALLOWED_MISSINGNESS)
            if invalid_states:
                errors.append(f"unknown missingness states: {invalid_states}")
            if not ({"unknown", "not_collected"} & set(states)):
                errors.append("missingness must include unknown or not_collected")
        if missingness.get("absence_policy") != "absence_must_not_be_inferred_from_missingness":
            errors.append("missingness absence_policy must block absence inference")

    variables = packet.get("measurable_variables")
    if not isinstance(variables, list) or len(variables) < 2:
        errors.append("at least two measurable_variables are required")
    else:
        names: set[str] = set()
        for idx, variable in enumerate(variables):
            if not isinstance(variable, dict):
                errors.append(f"variable {idx} must be an object")
                continue
            name = variable.get("name")
            if not _has_text(name, 2):
                errors.append(f"variable {idx} missing name")
            elif name in names:
                errors.append(f"duplicate variable name: {name}")
            else:
                names.add(name)
            for field in ("measurement_type", "unit_or_scale", "sampling_rule"):
                if not _has_text(variable.get(field), 1 if field != "sampling_rule" else 8):
                    errors.append(f"variable {idx} missing {field}")

    controls = packet.get("control_conditions")
    if not isinstance(controls, dict):
        errors.append("control_conditions must be an object")
    else:
        for field in REQUIRED_CONTROL_FIELDS:
            if not _has_text(controls.get(field), 12):
                errors.append(f"control_conditions.{field} is required")

    expected = packet.get("expected_result")
    if not isinstance(expected, dict):
        errors.append("expected_result must be an object")
    else:
        for field in REQUIRED_EXPECTED_FIELDS:
            if not _has_text(expected.get(field), 12):
                errors.append(f"expected_result.{field} is required")

    for field in ("revision_reason", "null_result_handling", "falsification_route"):
        if not _has_text(packet.get(field), 20):
            errors.append(f"{field} must be at least 20 characters")
    if not _has_text(packet.get("next_executable_action"), 12):
        errors.append("next_executable_action must be at least 12 characters")

    if packet.get("testability") not in {"executable", "semi_executable", "not_testable_rejected"}:
        errors.append("testability is not allowed")
    if packet.get("implementation_status") not in {"specified", "implemented", "validated"}:
        errors.append("implementation_status is not allowed")

    return errors


def main(argv: list[str]) -> int:
    if len(argv) != 2:
        print("Usage: validate_control_condition_packets.py <packets.json>", file=sys.stderr)
        return 2

    packet_path = Path(argv[1])
    packets = json.loads(packet_path.read_text(encoding="utf-8"))
    if isinstance(packets, dict):
        packets = [packets]
    if not isinstance(packets, list):
        print("Top-level JSON must be a packet object or list of packets", file=sys.stderr)
        return 2

    failures = 0
    for index, packet in enumerate(packets):
        if not isinstance(packet, dict):
            print(f"[{index}] FAIL: packet is not an object")
            failures += 1
            continue
        errors = validate_packet(packet)
        packet_id = packet.get("packet_id", f"index-{index}")
        if errors:
            failures += 1
            print(f"[{packet_id}] FAIL")
            for error in errors:
                print(f"  - {error}")
        else:
            print(f"[{packet_id}] PASS")

    return 1 if failures else 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv))
