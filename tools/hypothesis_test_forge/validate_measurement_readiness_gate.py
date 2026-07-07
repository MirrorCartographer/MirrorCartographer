#!/usr/bin/env python3
"""
Validate the MC measurement readiness gate fixture.

This validator checks research-organization infrastructure only. It does not
provide medical advice, veterinary advice, diagnosis, treatment, dosage guidance,
or emergency triage.
"""

from __future__ import annotations

import json
import sys
from pathlib import Path
from typing import Any

ROOT = Path(__file__).resolve().parent
FIXTURE = ROOT / "measurement_readiness_gate_fixture.json"

TOP_LEVEL_REQUIRED = [
    "source_status",
    "claim_status",
    "privacy_status",
    "missingness",
    "revision_reason",
    "implementation_status",
    "testability",
    "falsification_route",
    "measurable_variables",
    "next_executable_action",
]

PACKET_REQUIRED = TOP_LEVEL_REQUIRED + [
    "operational_definitions",
    "measurement_instruments",
    "sampling_plan",
    "decision_thresholds",
    "confounders",
    "disconfirmation_criteria",
    "intended_route",
]

BLOCKED_TERMS = [
    "diagnosis",
    "treatment",
    "dosage",
    "emergency",
    "veterinary advice",
    "proves a cure",
    "discovery proof",
    "actionable guidance",
]

SAFE_ROUTES = {
    "research_map",
    "experiment_design",
    "question_prep",
    "private_longitudinal_memory",
}


def load_fixture() -> dict[str, Any]:
    with FIXTURE.open("r", encoding="utf-8") as handle:
        return json.load(handle)


def require_nonempty(value: Any) -> bool:
    if value is None:
        return False
    if isinstance(value, str):
        return bool(value.strip())
    if isinstance(value, (list, dict)):
        return len(value) > 0
    return True


def contains_blocked_text(packet: dict[str, Any]) -> list[str]:
    haystack = json.dumps(packet, ensure_ascii=False).lower()
    return [term for term in BLOCKED_TERMS if term in haystack]


def validate_packet(packet: dict[str, Any]) -> tuple[bool, list[str]]:
    errors: list[str] = []

    for field in PACKET_REQUIRED:
        if field not in packet:
            errors.append(f"missing required field: {field}")
        elif not require_nonempty(packet[field]):
            errors.append(f"empty required field: {field}")

    if packet.get("privacy_status") not in {"synthetic_no_identifiers", "deidentified", "private_memory_only"}:
        errors.append("privacy_status is not an allowed safe state")

    if packet.get("intended_route") not in SAFE_ROUTES:
        errors.append(f"unsafe or unsupported intended_route: {packet.get('intended_route')}")

    blocked = contains_blocked_text(packet)
    if blocked:
        errors.append("blocked terms present: " + ", ".join(blocked))

    if "missingness" in packet and "absent" in str(packet["missingness"]).lower():
        errors.append("missingness may be collapsed into absence")

    return (not errors, errors)


def main() -> int:
    fixture = load_fixture()
    errors: list[str] = []

    for field in TOP_LEVEL_REQUIRED:
        if field not in fixture:
            errors.append(f"top-level missing required field: {field}")
        elif not require_nonempty(fixture[field]):
            errors.append(f"top-level empty required field: {field}")

    packets = fixture.get("packets", [])
    if not packets:
        errors.append("fixture has no packets")

    results: dict[str, Any] = {}
    for packet in packets:
        packet_id = packet.get("packet_id", "<missing_id>")
        ok, packet_errors = validate_packet(packet)
        results[packet_id] = {"passes": ok, "errors": packet_errors}

    expected = {
        "pass_symbolic_to_operational_measurement_ready": True,
        "fail_missing_thresholds": False,
        "fail_unsafe_promotion": False,
    }

    for packet_id, expected_pass in expected.items():
        actual = results.get(packet_id, {}).get("passes")
        if actual is None:
            errors.append(f"missing expected packet: {packet_id}")
        elif actual != expected_pass:
            errors.append(
                f"unexpected result for {packet_id}: expected {expected_pass}, got {actual}; "
                f"details={results.get(packet_id)}"
            )

    print(json.dumps({"fixture": FIXTURE.name, "results": results, "errors": errors}, indent=2))
    return 1 if errors else 0


if __name__ == "__main__":
    sys.exit(main())
