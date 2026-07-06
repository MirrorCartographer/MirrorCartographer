#!/usr/bin/env python3
"""Validate MC evidence granularity packets.

This gate is research-organization infrastructure. It does not provide medical,
mental-health, or veterinary diagnosis, treatment, dosage, or urgency advice.
"""

from __future__ import annotations

import json
import sys
from pathlib import Path
from typing import Any

ALLOWED_SOURCE_STATUS = {
    "synthetic_fixture",
    "user_stated",
    "tool_output",
    "literature_summary",
    "measured_observation",
}
ALLOWED_CLAIM_STATUS = {
    "hypothesis",
    "question_prep",
    "research_organization",
    "rejected",
    "needs_review",
}
ALLOWED_PRIVACY_STATUS = {
    "public_safe_synthetic",
    "deidentified",
    "private_rejected",
    "contains_sensitive_detail",
}
BLOCKED_PRIVACY_STATUS = {"private_rejected", "contains_sensitive_detail"}
ATOMIC_GRANULARITIES = {"atomic", "session"}
SUMMARY_OR_AMBIGUOUS = {"daily_summary", "multi_day_summary", "literature_level", "ambiguous"}


def fail(packet_id: str, message: str) -> str:
    return f"{packet_id}: {message}"


def validate_packet(packet: dict[str, Any]) -> list[str]:
    packet_id = str(packet.get("packet_id", "<missing-packet-id>"))
    errors: list[str] = []

    required = [
        "packet_id",
        "claim",
        "source_status",
        "claim_status",
        "privacy_status",
        "missingness",
        "revision_reason",
        "implementation_status",
        "testability",
        "falsification_route",
        "evidence_units",
        "aggregation_rule",
        "measurable_variables",
        "next_executable_action",
    ]
    for key in required:
        if key not in packet:
            errors.append(fail(packet_id, f"missing required field: {key}"))

    if packet.get("source_status") not in ALLOWED_SOURCE_STATUS:
        errors.append(fail(packet_id, "invalid source_status"))
    if packet.get("claim_status") not in ALLOWED_CLAIM_STATUS:
        errors.append(fail(packet_id, "invalid claim_status"))
    privacy_status = packet.get("privacy_status")
    if privacy_status not in ALLOWED_PRIVACY_STATUS:
        errors.append(fail(packet_id, "invalid privacy_status"))
    if privacy_status in BLOCKED_PRIVACY_STATUS:
        errors.append(fail(packet_id, "private or sensitive packet must not enter public evidence memory"))

    missingness = packet.get("missingness", {})
    if not isinstance(missingness, dict):
        errors.append(fail(packet_id, "missingness must be an object"))
    elif missingness.get("absence_interpretation_allowed") is not False:
        errors.append(fail(packet_id, "missingness must not be interpreted as absence"))

    units = packet.get("evidence_units", [])
    if not isinstance(units, list) or len(units) < 2:
        errors.append(fail(packet_id, "at least two evidence units are required"))
        units = []

    atomic_count = 0
    ambiguous_count = 0
    unsupported_scope_count = 0
    standalone_false_count = 0
    granularities: set[str] = set()
    for unit in units:
        if not isinstance(unit, dict):
            errors.append(fail(packet_id, "evidence unit must be an object"))
            continue
        granularity = unit.get("granularity")
        granularities.add(str(granularity))
        if granularity in ATOMIC_GRANULARITIES:
            atomic_count += 1
        if granularity in SUMMARY_OR_AMBIGUOUS:
            ambiguous_count += 1
        if unit.get("supports_claim_scope") is not True:
            unsupported_scope_count += 1
        if unit.get("can_stand_alone") is not True:
            standalone_false_count += 1

    rule = packet.get("aggregation_rule", {})
    if not isinstance(rule, dict):
        errors.append(fail(packet_id, "aggregation_rule must be an object"))
        rule = {}

    min_atomic = rule.get("minimum_atomic_units")
    if isinstance(min_atomic, int) and atomic_count < min_atomic:
        errors.append(fail(packet_id, f"only {atomic_count} atomic/session units; requires {min_atomic}"))
    if rule.get("blocks_mixed_granularity_without_label") is not True:
        errors.append(fail(packet_id, "mixed granularity must be explicitly blocked unless labeled"))
    if ambiguous_count and rule.get("method") not in {"evidence_table", "needs_review", "none"}:
        errors.append(fail(packet_id, "ambiguous or summary units cannot use promotion-style aggregation"))
    if unsupported_scope_count:
        errors.append(fail(packet_id, f"{unsupported_scope_count} evidence units do not support claim scope"))
    if standalone_false_count and packet.get("claim_status") not in {"question_prep", "needs_review", "rejected"}:
        errors.append(fail(packet_id, "non-standalone units must be downgraded to question_prep/needs_review/rejected"))

    measurable_variables = packet.get("measurable_variables", [])
    if not isinstance(measurable_variables, list) or "atomic_unit_count" not in measurable_variables:
        errors.append(fail(packet_id, "measurable_variables must include atomic_unit_count"))

    return errors


def main(path: str) -> int:
    packets = json.loads(Path(path).read_text(encoding="utf-8"))
    if isinstance(packets, dict):
        packets = [packets]
    all_errors: list[str] = []
    for packet in packets:
        all_errors.extend(validate_packet(packet))
    if all_errors:
        for error in all_errors:
            print(error)
        return 1
    print(f"validated {len(packets)} evidence granularity packet(s)")
    return 0


if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("usage: validate_evidence_granularity_packets.py <packets.json>")
        raise SystemExit(2)
    raise SystemExit(main(sys.argv[1]))
