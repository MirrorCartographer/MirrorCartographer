#!/usr/bin/env python3
"""Validate MC evidence-routing fixture.

This validator tests research-organization routing only. It does not produce
medical advice, veterinary advice, diagnosis, treatment, dosage guidance, or
emergency triage.
"""
from __future__ import annotations

import json
import sys
from pathlib import Path
from typing import Any

REQUIRED_LABELS = [
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

BLOCKED_NON_BLOCK_DESTINATIONS = {
    "research_question",
    "longitudinal_observation",
    "contradiction_ledger",
}


def load_fixture(path: Path) -> dict[str, Any]:
    with path.open("r", encoding="utf-8") as handle:
        return json.load(handle)


def has_conflicting_observed_values(observations: list[dict[str, Any]]) -> bool:
    seen: dict[str, set[str]] = {}
    for obs in observations:
        if obs.get("missingness") != "observed":
            continue
        variable = obs.get("variable")
        value = repr(obs.get("value"))
        if variable is None:
            continue
        seen.setdefault(variable, set()).add(value)
    return any(len(values) > 1 for values in seen.values())


def infer_destination(packet: dict[str, Any], blocked_flags: set[str]) -> str:
    flags = set(packet.get("boundary_flags") or [])
    if flags.intersection(blocked_flags):
        return "blocked_packet"
    observations = packet.get("observations") or []
    if has_conflicting_observed_values(observations):
        return "contradiction_ledger"
    if "time_between_events_days" in {obs.get("variable") for obs in observations}:
        return "longitudinal_observation"
    return "research_question"


def validate_packet(packet: dict[str, Any], fixture: dict[str, Any]) -> list[str]:
    errors: list[str] = []
    packet_id = packet.get("packet_id", "<no-id>")
    allowed_destinations = set(fixture["allowed_destinations"])
    missingness_states = set(fixture["missingness_states"])
    blocked_flags = set(fixture["blocked_boundary_flags"])

    for label in REQUIRED_LABELS:
        if label not in packet:
            errors.append(f"{packet_id}: missing required label {label}")

    proposed = packet.get("proposed_destination")
    expected = packet.get("expected_destination")
    if proposed not in allowed_destinations:
        errors.append(f"{packet_id}: invalid proposed destination {proposed!r}")
    if expected not in allowed_destinations:
        errors.append(f"{packet_id}: invalid expected destination {expected!r}")

    flags = set(packet.get("boundary_flags") or [])
    if flags.intersection(blocked_flags) and proposed in BLOCKED_NON_BLOCK_DESTINATIONS:
        errors.append(f"{packet_id}: blocked boundary flags routed to {proposed}")

    observations = packet.get("observations") or []
    if not observations:
        errors.append(f"{packet_id}: observations required")

    observed_count = 0
    for index, obs in enumerate(observations):
        state = obs.get("missingness")
        if state not in missingness_states:
            errors.append(f"{packet_id}: observation {index} invalid missingness {state!r}")
        if state == "observed":
            observed_count += 1
            for key in ("variable", "value", "unit"):
                if key not in obs:
                    errors.append(f"{packet_id}: observed observation {index} missing {key}")
        elif obs.get("value") in ("absent", "confirmed", "none", 0, False):
            errors.append(f"{packet_id}: missingness collapsed into certainty or absence at observation {index}")

    if proposed != "blocked_packet" and not packet.get("measurable_variables"):
        errors.append(f"{packet_id}: non-blocked packet requires measurable variables")
    if proposed != "blocked_packet" and observed_count == 0:
        errors.append(f"{packet_id}: non-blocked packet requires at least one observed variable")

    inferred = infer_destination(packet, blocked_flags)
    if inferred != expected:
        errors.append(f"{packet_id}: inferred {inferred}, expected {expected}")
    if proposed != expected:
        errors.append(f"{packet_id}: proposed {proposed}, expected {expected}")

    return errors


def validate_fixture(path: Path) -> tuple[int, list[str]]:
    fixture = load_fixture(path)
    errors: list[str] = []
    hypothesis = fixture.get("hypothesis", {})
    for label in REQUIRED_LABELS:
        if label not in hypothesis:
            errors.append(f"hypothesis: missing required label {label}")

    valid_seen = 0
    invalid_rejected = 0
    for packet in fixture.get("packets", []):
        packet_errors = validate_packet(packet, fixture)
        intentionally_invalid = ".invalid." in packet.get("packet_id", "")
        if intentionally_invalid:
            if packet_errors:
                invalid_rejected += 1
            else:
                errors.append(f"{packet.get('packet_id')}: intentionally invalid packet was accepted")
        else:
            valid_seen += 1
            errors.extend(packet_errors)

    if valid_seen < 4:
        errors.append(f"expected at least 4 valid routing packets, saw {valid_seen}")
    if invalid_rejected < 1:
        errors.append("expected at least 1 invalid packet rejection")

    metrics = {
        "valid_packets_seen": valid_seen,
        "invalid_packets_rejected": invalid_rejected,
        "total_errors": len(errors),
    }
    if errors:
        print("MC evidence routing validation failed:")
        for error in errors:
            print(f"- {error}")
        print(json.dumps(metrics, indent=2, sort_keys=True))
        return 1, errors

    print("MC evidence routing validation passed.")
    print(json.dumps(metrics, indent=2, sort_keys=True))
    return 0, []


def main(argv: list[str]) -> int:
    base = Path(__file__).resolve().parent
    fixture_path = Path(argv[1]) if len(argv) > 1 else base / "evidence_routing_fixture.json"
    code, _errors = validate_fixture(fixture_path)
    return code


if __name__ == "__main__":
    raise SystemExit(main(sys.argv))
