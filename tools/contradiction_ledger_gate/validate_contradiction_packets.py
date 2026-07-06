#!/usr/bin/env python3
"""
Mirror Cartographer contradiction-ledger validator.

Purpose:
  Preserve disconfirming or failed-result evidence as public-safe research
  infrastructure without promoting private content, narrative-only claims, or
  missingness-as-absence errors.

Usage:
  python tools/contradiction_ledger_gate/validate_contradiction_packets.py \
    tools/contradiction_ledger_gate/fixtures.synthetic.json
"""

from __future__ import annotations

import json
import sys
from pathlib import Path
from typing import Any, Dict, List, Tuple

ALLOWED_CONTRADICTION_TYPES = {
    "direct_disconfirmation",
    "failed_replication",
    "boundary_violation",
    "missingness_reinterpretation",
    "mechanism_mismatch",
    "measurement_invalidated",
    "privacy_partition_required",
}

ALLOWED_SOURCE_STATUS = {
    "synthetic",
    "primary",
    "preprint",
    "benchmark",
    "dataset",
    "institutional",
    "secondary",
}

ALLOWED_CLAIM_STATUS = {
    "rejected",
    "downgraded",
    "requires_revision",
    "requires_partition",
    "inconclusive",
}

ALLOWED_PRIVACY_STATUS = {
    "public_safe",
    "deidentified",
    "synthetic_only",
    "reject_private_content",
}

ALLOWED_MISSINGNESS_STATES = {
    "observed",
    "not_collected",
    "redacted",
    "not_applicable",
    "unknown",
}

REQUIRED_FIELDS = [
    "schema_version",
    "packet_id",
    "hypothesis_id",
    "hypothesis_claim",
    "contradiction_type",
    "source_status",
    "claim_status",
    "privacy_status",
    "missingness",
    "evidence_boundary",
    "measurable_variables",
    "observed_result",
    "expected_result",
    "revision_reason",
    "falsification_route",
    "next_executable_action",
]


def _nonempty_text(value: Any, minimum: int = 1) -> bool:
    return isinstance(value, str) and len(value.strip()) >= minimum


def validate_packet(packet: Dict[str, Any]) -> List[str]:
    errors: List[str] = []

    for field in REQUIRED_FIELDS:
        if field not in packet:
            errors.append(f"missing required field: {field}")

    if errors:
        return errors

    if packet["schema_version"] != "1.0.0":
        errors.append("schema_version must be 1.0.0")

    if not _nonempty_text(packet["packet_id"], 12) or not packet["packet_id"].startswith("clg_"):
        errors.append("packet_id must start with clg_ and be descriptive")

    if not _nonempty_text(packet["hypothesis_id"], 10) or not packet["hypothesis_id"].startswith("hyp_"):
        errors.append("hypothesis_id must start with hyp_ and be descriptive")

    if not _nonempty_text(packet["hypothesis_claim"], 24):
        errors.append("hypothesis_claim must be a substantive public-safe claim")

    if packet["contradiction_type"] not in ALLOWED_CONTRADICTION_TYPES:
        errors.append(f"invalid contradiction_type: {packet['contradiction_type']}")

    if packet["source_status"] not in ALLOWED_SOURCE_STATUS:
        errors.append(f"invalid source_status: {packet['source_status']}")

    if packet["claim_status"] not in ALLOWED_CLAIM_STATUS:
        errors.append(f"invalid claim_status: {packet['claim_status']}")

    if packet["privacy_status"] not in ALLOWED_PRIVACY_STATUS:
        errors.append(f"invalid privacy_status: {packet['privacy_status']}")

    if packet["privacy_status"] == "reject_private_content":
        errors.append("privacy_status reject_private_content cannot be stored in public-safe ledger")

    missingness = packet["missingness"]
    if not isinstance(missingness, dict):
        errors.append("missingness must be an object")
    else:
        state = missingness.get("state")
        interpretation_allowed = missingness.get("interpretation_allowed")
        if state not in ALLOWED_MISSINGNESS_STATES:
            errors.append(f"invalid missingness.state: {state}")
        if not isinstance(interpretation_allowed, bool):
            errors.append("missingness.interpretation_allowed must be boolean")
        if state in {"not_collected", "redacted", "unknown"} and interpretation_allowed is True:
            errors.append("unobserved/redacted/unknown data cannot allow interpretation as evidence")

    boundary = packet["evidence_boundary"]
    if not isinstance(boundary, dict):
        errors.append("evidence_boundary must be an object")
    else:
        if not _nonempty_text(boundary.get("allowed_use"), 12):
            errors.append("evidence_boundary.allowed_use must be explicit")
        if not _nonempty_text(boundary.get("forbidden_use"), 12):
            errors.append("evidence_boundary.forbidden_use must be explicit")

    variables = packet["measurable_variables"]
    if not isinstance(variables, list) or len(variables) < 1:
        errors.append("at least one measurable variable is required")
    else:
        for idx, variable in enumerate(variables):
            if not isinstance(variable, dict):
                errors.append(f"measurable_variables[{idx}] must be an object")
                continue
            if not _nonempty_text(variable.get("name"), 2):
                errors.append(f"measurable_variables[{idx}].name is required")
            if not _nonempty_text(variable.get("measurement"), 8):
                errors.append(f"measurable_variables[{idx}].measurement is required")
            if not _nonempty_text(variable.get("unit_or_scale"), 1):
                errors.append(f"measurable_variables[{idx}].unit_or_scale is required")

    for field in ["expected_result", "observed_result", "revision_reason", "falsification_route", "next_executable_action"]:
        if not _nonempty_text(packet[field], 12):
            errors.append(f"{field} must be explicit and actionable")

    if packet["expected_result"].strip() == packet["observed_result"].strip():
        errors.append("observed_result must differ from expected_result for contradiction-ledger entry")

    return errors


def load_packets(path: Path) -> List[Tuple[str, bool, Dict[str, Any]]]:
    raw = json.loads(path.read_text(encoding="utf-8"))
    if isinstance(raw, dict) and "packet" in raw:
        return [(raw.get("name", path.name), bool(raw.get("should_pass", True)), raw["packet"])]
    if isinstance(raw, list):
        return [(item.get("name", f"fixture_{idx}"), bool(item.get("should_pass", True)), item["packet"]) for idx, item in enumerate(raw)]
    raise ValueError("Input must be a packet fixture object or a list of fixture objects")


def main(argv: List[str]) -> int:
    if len(argv) != 2:
        print("Usage: validate_contradiction_packets.py <fixture_or_packet_json>", file=sys.stderr)
        return 2

    path = Path(argv[1])
    failures = 0

    for name, should_pass, packet in load_packets(path):
        errors = validate_packet(packet)
        passed = not errors
        expectation_met = passed == should_pass
        status = "PASS" if expectation_met else "FAIL"
        print(f"{status} {name}: expected should_pass={should_pass}, validator_passed={passed}")
        if errors:
            for error in errors:
                print(f"  - {error}")
        if not expectation_met:
            failures += 1

    return 1 if failures else 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv))
