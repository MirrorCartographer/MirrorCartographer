#!/usr/bin/env python3
"""Validate MC inference provenance handoff fixture.

This validator checks that human-AI sensemaking packets expose enough provenance
for a reviewer to see source boundaries, transformation steps, privacy state,
missingness, falsification route, measurable variables, and next executable
action. It rejects unsafe promotion into diagnosis, treatment, veterinary advice,
dosage guidance, emergency triage, cure certainty, discovery proof, unsupported
causality, private identifier retention, or missingness collapse.
"""

from __future__ import annotations

import json
import re
from pathlib import Path
from typing import Any

FIXTURE = Path(__file__).with_name("inference_provenance_handoff_fixture.json")

REQUIRED_TOP_LEVEL = {
    "artifact_type",
    "claim",
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
    "pass_thresholds",
    "packets",
}

REQUIRED_PACKET_FIELDS = {
    "packet_id",
    "domain",
    "claim",
    "source_status",
    "claim_status",
    "privacy_status",
    "missingness",
    "revision_reason",
    "implementation_status",
    "testability",
    "falsification_route",
    "source_boundaries",
    "transformation_chain",
    "measurable_variables",
    "allowed_routes",
    "blocked_promotions",
    "next_executable_action",
}

PROHIBITED_PATTERNS = [
    r"\bdiagnos(?:e|is|ed)\b.*\b(user|patient|animal|pet|dog|cat)\b",
    r"\btreat(?:ment)?\b.*\b(should|must|needs?|give|take|dose)\b",
    r"\b(?:give|take|administer)\b.*\b\d+\s*(?:mg|ml|mcg|iu)\b",
    r"\bemergency\b.*\b(ignore|avoid|skip|unnecessary)\b",
    r"\bcure(?:d|s)?\b.*\b(proven|guaranteed|certain)\b",
    r"\bdiscovery\b.*\b(proven|confirmed|certain)\b",
    r"\bthis proves\b",
    r"\bthis means you are\b",
    r"\bmissing\b.*\bmeans absent\b",
    r"\b(?:full name|street address|phone number|email address)\b",
]

SAFE_ROUTE_SET = {
    "research_question",
    "longitudinal_observation",
    "question_prep",
    "contradiction_ledger",
    "private_memory_candidate",
}


def fail(message: str) -> None:
    raise AssertionError(message)


def flatten(value: Any) -> str:
    if isinstance(value, dict):
        return "\n".join(f"{k}: {flatten(v)}" for k, v in value.items())
    if isinstance(value, list):
        return "\n".join(flatten(v) for v in value)
    return str(value)


def validate_variable(variable: dict[str, Any], context: str) -> None:
    for field in ("name", "unit", "measurement_context"):
        if field not in variable or not str(variable[field]).strip():
            fail(f"{context} variable missing {field}: {variable}")


def validate_metadata(data: dict[str, Any]) -> None:
    missing = REQUIRED_TOP_LEVEL - set(data)
    if missing:
        fail(f"Missing top-level fields: {sorted(missing)}")

    if data["privacy_status"] != "no_private_identifiers_retained":
        fail("Top-level privacy_status must state no private identifiers retained.")

    if "missing" not in flatten(data["missingness"]).lower():
        fail("Top-level missingness must explicitly describe missing information.")

    if "falsification" not in flatten(data["falsification_route"]).lower() and "fails" not in flatten(data["falsification_route"]).lower():
        fail("Top-level falsification_route must describe how the claim can fail.")

    for variable in data["measurable_variables"]:
        validate_variable(variable, "top-level")

    whole_text = flatten(data).lower()
    for pattern in PROHIBITED_PATTERNS:
        if re.search(pattern, whole_text, flags=re.IGNORECASE | re.DOTALL):
            fail(f"Prohibited unsafe promotion/private leakage pattern found: {pattern}")


def validate_packet(packet: dict[str, Any], thresholds: dict[str, Any]) -> dict[str, int]:
    missing = REQUIRED_PACKET_FIELDS - set(packet)
    if missing:
        fail(f"{packet.get('packet_id', '<unknown>')} missing fields: {sorted(missing)}")

    packet_id = packet["packet_id"]

    if packet["privacy_status"] not in {"deidentified", "no_private_identifiers_retained"}:
        fail(f"{packet_id} has unsafe privacy_status: {packet['privacy_status']}")

    if "missing" not in flatten(packet["missingness"]).lower():
        fail(f"{packet_id} missingness does not explicitly name absent information.")

    if len(packet["source_boundaries"]) < thresholds["min_source_boundaries_per_packet"]:
        fail(f"{packet_id} has too few source boundaries.")

    if len(packet["transformation_chain"]) < thresholds["min_transformation_steps_per_packet"]:
        fail(f"{packet_id} has too few transformation steps.")

    for index, step in enumerate(packet["transformation_chain"], start=1):
        for field in ("step", "input", "output"):
            if field not in step or not str(step[field]).strip():
                fail(f"{packet_id} transformation step {index} missing {field}.")

    if len(packet["measurable_variables"]) < thresholds["min_measurable_variables_per_packet"]:
        fail(f"{packet_id} has too few measurable variables.")

    for variable in packet["measurable_variables"]:
        validate_variable(variable, packet_id)

    if len(packet["blocked_promotions"]) < thresholds["min_blocked_promotions_per_packet"]:
        fail(f"{packet_id} has too few blocked promotions.")

    unsafe_routes = set(packet["allowed_routes"]) - SAFE_ROUTE_SET
    if unsafe_routes:
        fail(f"{packet_id} has unsafe allowed routes: {sorted(unsafe_routes)}")

    if not set(packet["allowed_routes"]) & set(thresholds["required_safe_routes"]):
        fail(f"{packet_id} does not include any required safe route.")

    if not str(packet["next_executable_action"]).strip():
        fail(f"{packet_id} needs a next executable action.")

    return {
        "source_boundaries": len(packet["source_boundaries"]),
        "transformation_steps": len(packet["transformation_chain"]),
        "measurable_variables": len(packet["measurable_variables"]),
        "blocked_promotions": len(packet["blocked_promotions"]),
        "safe_routes": len(set(packet["allowed_routes"]) & SAFE_ROUTE_SET),
    }


def main() -> None:
    data = json.loads(FIXTURE.read_text(encoding="utf-8"))
    validate_metadata(data)

    thresholds = data["pass_thresholds"]
    packets = data["packets"]

    if len(packets) < thresholds["min_packet_count"]:
        fail("Fixture does not include enough provenance packets.")

    metrics = [validate_packet(packet, thresholds) for packet in packets]
    summary = {
        "packet_count": len(packets),
        "packets_with_source_boundaries": sum(
            metric["source_boundaries"] >= thresholds["min_source_boundaries_per_packet"] for metric in metrics
        ),
        "packets_with_transformation_chains": sum(
            metric["transformation_steps"] >= thresholds["min_transformation_steps_per_packet"] for metric in metrics
        ),
        "packets_with_measurable_variables": sum(
            metric["measurable_variables"] >= thresholds["min_measurable_variables_per_packet"] for metric in metrics
        ),
        "blocked_promotion_count": sum(metric["blocked_promotions"] for metric in metrics),
        "safe_route_count": sum(metric["safe_routes"] for metric in metrics),
    }

    if summary["packets_with_source_boundaries"] != len(packets):
        fail("Not all packets expose source boundaries.")
    if summary["packets_with_transformation_chains"] != len(packets):
        fail("Not all packets expose transformation chains.")
    if summary["packets_with_measurable_variables"] != len(packets):
        fail("Not all packets expose measurable variables.")

    print(json.dumps({"status": "PASS", "metrics": summary}, indent=2))


if __name__ == "__main__":
    main()
