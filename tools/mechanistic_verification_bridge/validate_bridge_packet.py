#!/usr/bin/env python3
"""Validate Mirror Cartographer mechanistic verification bridge packets.

This validator intentionally uses only the Python standard library so it can run
in lightweight environments without dependency installation. It performs the
schema-critical checks needed before a generated hypothesis can enter discovery
memory.

Usage:
  python tools/mechanistic_verification_bridge/validate_bridge_packet.py \
    tools/mechanistic_verification_bridge/fixtures.synthetic.json
"""

from __future__ import annotations

import json
import re
import sys
from pathlib import Path
from typing import Any, Dict, Iterable, List, Tuple

SOURCE_STATUS = {"primary", "secondary", "preprint", "institutional", "benchmark", "synthetic", "mixed"}
CLAIM_STATUS = {"candidate", "mechanistic_model", "prediction_ready", "test_ready", "supported", "contradicted", "inconclusive", "overclaimed"}
PRIVACY_STATUS = {"public_safe", "synthetic_only", "deidentified", "requires_partition", "reject_private"}
IMPLEMENTATION_STATUS = {"planned", "schema_only", "fixture_only", "implemented", "validated", "blocked"}
EVIDENCE_STRENGTH = {"none", "low", "moderate", "high"}
ADMISSION_DECISION = {"admit_to_hypothesis_backlog", "hold_for_missingness", "route_to_contradiction_ledger", "reject_private", "reject_overclaim"}
VERIFICATION_MODALITY = {"schema_validation", "simulation", "benchmark", "literature_crosswalk", "human_review", "prospective_observation", "mixed"}
MEASUREMENT_TYPE = {"binary", "count", "ordinal", "continuous", "categorical", "text_label"}

PACKET_RE = re.compile(r"^mvb_[a-z0-9_\-]{6,80}$")
HYP_RE = re.compile(r"^hyp_[a-z0-9_\-]{6,80}$")


def _is_nonempty_string(value: Any, min_len: int = 1) -> bool:
    return isinstance(value, str) and len(value.strip()) >= min_len


def _require_enum(errors: List[str], packet: Dict[str, Any], field: str, allowed: Iterable[str]) -> None:
    if packet.get(field) not in allowed:
        errors.append(f"{field} must be one of {sorted(allowed)}")


def validate_packet(packet: Dict[str, Any]) -> Tuple[bool, List[str]]:
    errors: List[str] = []

    required = [
        "schema_version", "packet_id", "hypothesis_id", "hypothesis_text", "source_status",
        "claim_status", "privacy_status", "missingness", "revision_reason", "implementation_status",
        "evidence_strength", "mechanistic_model", "measurable_variables", "verification_plan",
        "falsification_route", "admission_decision", "next_executable_action",
    ]
    for field in required:
        if field not in packet:
            errors.append(f"missing required field: {field}")

    if errors:
        return False, errors

    if packet["schema_version"] != "1.0.0":
        errors.append("schema_version must equal 1.0.0")
    if not isinstance(packet["packet_id"], str) or not PACKET_RE.match(packet["packet_id"]):
        errors.append("packet_id must match mvb_[a-z0-9_-]{6,80}")
    if not isinstance(packet["hypothesis_id"], str) or not HYP_RE.match(packet["hypothesis_id"]):
        errors.append("hypothesis_id must match hyp_[a-z0-9_-]{6,80}")
    if not _is_nonempty_string(packet["hypothesis_text"], 20):
        errors.append("hypothesis_text must be at least 20 characters")

    _require_enum(errors, packet, "source_status", SOURCE_STATUS)
    _require_enum(errors, packet, "claim_status", CLAIM_STATUS)
    _require_enum(errors, packet, "privacy_status", PRIVACY_STATUS)
    _require_enum(errors, packet, "implementation_status", IMPLEMENTATION_STATUS)
    _require_enum(errors, packet, "evidence_strength", EVIDENCE_STRENGTH)
    _require_enum(errors, packet, "admission_decision", ADMISSION_DECISION)

    if not isinstance(packet["missingness"], list) or not packet["missingness"]:
        errors.append("missingness must be a non-empty list")
    elif any(not _is_nonempty_string(item, 3) for item in packet["missingness"]):
        errors.append("each missingness item must be a non-empty string")

    if not _is_nonempty_string(packet["revision_reason"], 10):
        errors.append("revision_reason must be at least 10 characters")
    if not _is_nonempty_string(packet["falsification_route"], 20):
        errors.append("falsification_route must be at least 20 characters")
    if not _is_nonempty_string(packet["next_executable_action"], 10):
        errors.append("next_executable_action must be at least 10 characters")

    model = packet["mechanistic_model"]
    if not isinstance(model, dict):
        errors.append("mechanistic_model must be an object")
    else:
        if not isinstance(model.get("entities"), list) or len(model.get("entities", [])) < 2:
            errors.append("mechanistic_model.entities must contain at least two entities")
        if not isinstance(model.get("relations"), list) or len(model.get("relations", [])) < 1:
            errors.append("mechanistic_model.relations must contain at least one relation")
        if not _is_nonempty_string(model.get("expected_direction"), 3):
            errors.append("mechanistic_model.expected_direction is required")
        if not isinstance(model.get("boundary_conditions"), list) or not model.get("boundary_conditions"):
            errors.append("mechanistic_model.boundary_conditions must be non-empty")

    variables = packet["measurable_variables"]
    if not isinstance(variables, list) or len(variables) < 2:
        errors.append("measurable_variables must contain at least two variables")
    else:
        for idx, variable in enumerate(variables):
            if not isinstance(variable, dict):
                errors.append(f"measurable_variables[{idx}] must be an object")
                continue
            if not _is_nonempty_string(variable.get("name"), 2):
                errors.append(f"measurable_variables[{idx}].name is required")
            if not _is_nonempty_string(variable.get("operational_definition"), 10):
                errors.append(f"measurable_variables[{idx}].operational_definition is required")
            if variable.get("measurement_type") not in MEASUREMENT_TYPE:
                errors.append(f"measurable_variables[{idx}].measurement_type is invalid")

    plan = packet["verification_plan"]
    if not isinstance(plan, dict):
        errors.append("verification_plan must be an object")
    else:
        if plan.get("verification_modality") not in VERIFICATION_MODALITY:
            errors.append("verification_plan.verification_modality is invalid")
        if not isinstance(plan.get("minimum_fixture_cases"), int) or plan.get("minimum_fixture_cases") < 2:
            errors.append("verification_plan.minimum_fixture_cases must be an integer >= 2")
        threshold = plan.get("pass_threshold")
        if not isinstance(threshold, (int, float)) or not 0 <= threshold <= 1:
            errors.append("verification_plan.pass_threshold must be between 0 and 1")
        if not isinstance(plan.get("failure_modes"), list) or not plan.get("failure_modes"):
            errors.append("verification_plan.failure_modes must be non-empty")

    # Cross-field discovery-safety gates.
    if packet["privacy_status"] == "reject_private" and packet["admission_decision"] != "reject_private":
        errors.append("reject_private privacy_status must force admission_decision=reject_private")
    if packet["claim_status"] == "overclaimed" and packet["admission_decision"] != "reject_overclaim":
        errors.append("overclaimed claim_status must force admission_decision=reject_overclaim")
    if packet["claim_status"] == "supported" and packet["evidence_strength"] in {"none", "low"}:
        errors.append("supported claims require moderate or high evidence_strength")
    if packet["claim_status"] in {"supported", "prediction_ready", "test_ready"} and len(packet["measurable_variables"]) < 2:
        errors.append("promoted claims require at least two measurable variables")
    if packet["admission_decision"] == "admit_to_hypothesis_backlog" and packet["privacy_status"] not in {"public_safe", "synthetic_only", "deidentified"}:
        errors.append("hypothesis backlog admission requires public_safe, synthetic_only, or deidentified privacy_status")

    return not errors, errors


def load_packets(path: Path) -> List[Dict[str, Any]]:
    raw = json.loads(path.read_text(encoding="utf-8"))
    if isinstance(raw, dict) and "packet" in raw:
        return [raw]
    if isinstance(raw, list):
        return raw
    raise ValueError("Input must be a packet fixture object or a list of fixture objects")


def main(argv: List[str]) -> int:
    if len(argv) != 2:
        print("usage: validate_bridge_packet.py <fixtures-or-packet.json>", file=sys.stderr)
        return 2

    path = Path(argv[1])
    failures = 0
    for index, fixture in enumerate(load_packets(path)):
        name = fixture.get("name", f"fixture_{index}")
        expected = fixture.get("expected_valid")
        packet = fixture.get("packet", fixture)
        valid, errors = validate_packet(packet)
        if expected is not None and valid != expected:
            failures += 1
            print(f"FAIL {name}: expected_valid={expected}, got={valid}")
            for error in errors:
                print(f"  - {error}")
        else:
            status = "PASS" if valid else "EXPECTED_FAIL"
            print(f"{status} {name}")
            if not valid:
                for error in errors:
                    print(f"  - {error}")

    return 1 if failures else 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv))
