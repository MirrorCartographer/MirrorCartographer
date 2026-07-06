#!/usr/bin/env python3
"""Validate Mirror Cartographer agent-boundary packets.

This validator turns the hypothesis below into an executable test:

Hypothesis: human-AI sensemaking improves when user-stated content,
assistant inference, tool observations, system context, external sources, and
synthetic fixtures keep explicit downstream-use boundaries before memory or
hypothesis promotion.

The script is intentionally dependency-light and public-safe. It checks the
core role/use policy in addition to the minimal required packet fields.
"""

from __future__ import annotations

import json
import sys
from pathlib import Path
from typing import Any, Dict, Iterable, List, Tuple

ROLE_ALLOWED_USE = {
    "user_stated": {"quote_as_user_statement", "exclude_from_memory"},
    "assistant_inferred": {"use_as_inference", "exclude_from_memory"},
    "tool_observed": {"use_as_tool_result", "exclude_from_memory"},
    "system_generated": {"use_as_system_context", "exclude_from_memory"},
    "external_source": {"use_as_tool_result", "exclude_from_memory"},
    "synthetic_fixture": {"use_as_synthetic_test", "exclude_from_memory"},
}

PROHIBITED_GLOBAL_ALLOWED_USE = {
    "use_as_diagnosis",
    "use_as_treatment_advice",
    "store_as_private_memory",
    "collapse_into_observation",
    "promote_without_source",
}

REQUIRED_PACKET_FIELDS = {
    "schema_version",
    "packet_id",
    "hypothesis_id",
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
    "boundary_segments",
}


def load_fixtures(path: Path) -> List[Dict[str, Any]]:
    with path.open("r", encoding="utf-8") as handle:
        payload = json.load(handle)
    if not isinstance(payload, list):
        raise ValueError("Fixture file must contain a JSON array")
    return payload


def validate_packet(packet: Dict[str, Any]) -> Tuple[bool, List[str]]:
    errors: List[str] = []

    missing = sorted(REQUIRED_PACKET_FIELDS - set(packet))
    if missing:
        errors.append(f"missing required packet fields: {', '.join(missing)}")

    if packet.get("privacy_status") == "private_rejected":
        errors.append("private_rejected packets must not enter public-safe research memory")

    variables = packet.get("measurable_variables", [])
    if not isinstance(variables, list) or len(variables) < 2:
        errors.append("packet requires at least two measurable variables")

    falsification = packet.get("falsification_route", "")
    if not isinstance(falsification, str) or len(falsification.strip()) < 20:
        errors.append("packet requires an explicit falsification route")

    segments = packet.get("boundary_segments", [])
    if not isinstance(segments, list) or not segments:
        errors.append("packet requires at least one boundary segment")
        return False, errors

    for index, segment in enumerate(segments):
        prefix = f"segment[{index}]"
        role = segment.get("agent_role")
        allowed = set(segment.get("allowed_downstream_use", []))
        prohibited = set(segment.get("prohibited_downstream_use", []))

        if role not in ROLE_ALLOWED_USE:
            errors.append(f"{prefix}: unknown agent_role {role!r}")
            continue

        disallowed_by_role = sorted(allowed - ROLE_ALLOWED_USE[role])
        if disallowed_by_role:
            errors.append(
                f"{prefix}: role {role!r} cannot allow downstream use(s): "
                + ", ".join(disallowed_by_role)
            )

        globally_forbidden = sorted(allowed & PROHIBITED_GLOBAL_ALLOWED_USE)
        if globally_forbidden:
            errors.append(
                f"{prefix}: globally forbidden allowed_downstream_use: "
                + ", ".join(globally_forbidden)
            )

        contradictions = sorted(allowed & prohibited)
        if contradictions:
            errors.append(
                f"{prefix}: same use appears as both allowed and prohibited: "
                + ", ".join(contradictions)
            )

        if role == "assistant_inferred" and "quote_as_user_statement" in allowed:
            errors.append(f"{prefix}: assistant inference cannot be quoted as user statement")
        if role == "tool_observed" and "collapse_into_observation" in allowed:
            errors.append(f"{prefix}: tool output cannot be collapsed into observation")
        if role == "synthetic_fixture" and "quote_as_user_statement" in allowed:
            errors.append(f"{prefix}: synthetic fixture cannot be quoted as user statement")

    return not errors, errors


def run_fixture_file(path: Path) -> int:
    fixtures = load_fixtures(path)
    failures: List[str] = []

    for fixture in fixtures:
        name = fixture.get("name", "<unnamed>")
        expected = fixture.get("expected")
        packet = fixture.get("packet")
        if expected not in {"pass", "fail"}:
            failures.append(f"{name}: expected must be 'pass' or 'fail'")
            continue
        if not isinstance(packet, dict):
            failures.append(f"{name}: packet must be an object")
            continue

        valid, errors = validate_packet(packet)
        actual = "pass" if valid else "fail"
        if actual != expected:
            failures.append(
                f"{name}: expected {expected}, got {actual}; errors={errors or 'none'}"
            )

    if failures:
        print("Agent Boundary Gate: FAIL")
        for failure in failures:
            print(f"- {failure}")
        return 1

    print(f"Agent Boundary Gate: PASS ({len(fixtures)} fixtures)")
    return 0


def main(argv: Iterable[str]) -> int:
    args = list(argv)
    fixture_path = Path(args[0]) if args else Path(__file__).with_name("fixtures.synthetic.json")
    return run_fixture_file(fixture_path)


if __name__ == "__main__":
    raise SystemExit(main(sys.argv[1:]))
