#!/usr/bin/env python3
"""Mirror Cartographer integrated gate validator.

Keeps medical, animal-care, symbolic, longitudinal, and human-AI sensemaking
packets in research-organization territory. This is not diagnosis, treatment,
veterinary advice, or factual discovery proof.
"""
from __future__ import annotations

import copy
import json
import sys
from pathlib import Path
from typing import Any

BLOCKED_DECISIONS_WITH_FLAGS = {"pass"}
MISSINGNESS_STATES = {"observed", "unknown", "not_collected", "redacted", "not_applicable"}


def load_json(path: str | Path) -> dict[str, Any]:
    with open(path, "r", encoding="utf-8") as handle:
        return json.load(handle)


def resolve_gate_spec(gate: str, registry: dict[str, Any]) -> dict[str, Any] | None:
    spec = registry.get("gates", {}).get(gate)
    if not spec:
        return None
    if "$ref" in spec:
        return registry.get("gates", {}).get(spec["$ref"])
    return spec


def expand_packets(fixture: dict[str, Any], registry: dict[str, Any]) -> list[dict[str, Any]]:
    packets: list[dict[str, Any]] = []
    for packet in fixture.get("packets", []):
        if packet.get("gate") != "*":
            packets.append(packet)
            continue
        for gate in registry.get("gates", {}):
            expanded = copy.deepcopy(packet)
            expanded["gate"] = gate
            expanded["packet_id"] = expanded["packet_id"].replace("*", gate)
            packets.append(expanded)
    return packets


def validate_packet(packet: dict[str, Any], registry: dict[str, Any]) -> list[str]:
    errors: list[str] = []
    packet_id = packet.get("packet_id", "<no-id>")
    gate_spec = resolve_gate_spec(packet.get("gate"), registry)
    if not gate_spec:
        return [f"{packet_id}: unknown gate {packet.get('gate')!r}"]

    for field in gate_spec["required_packet_fields"]:
        if field not in packet:
            errors.append(f"{packet_id}: missing required field {field}")

    for label in gate_spec["required_labels"]:
        if not packet.get(label):
            errors.append(f"{packet_id}: empty label {label}")

    decision = packet.get("decision")
    if decision not in gate_spec["allowed_decisions"]:
        errors.append(f"{packet_id}: invalid decision {decision!r}")

    flags = set(packet.get("boundary_flags") or [])
    blocked = flags.intersection(gate_spec["blocked_boundary_flags"])
    if blocked and decision in BLOCKED_DECISIONS_WITH_FLAGS:
        errors.append(f"{packet_id}: blocked flags passed: {sorted(blocked)}")

    observations = packet.get("observations") or []
    if not observations:
        errors.append(f"{packet_id}: observations required")

    observed_count = 0
    for index, obs in enumerate(observations):
        state = obs.get("missingness")
        if state not in MISSINGNESS_STATES:
            errors.append(f"{packet_id}: observation {index} has invalid missingness {state!r}")
        if state == "observed":
            observed_count += 1
            for key in ("variable", "value", "unit"):
                if key not in obs:
                    errors.append(f"{packet_id}: observed observation {index} missing {key}")
        elif obs.get("value") in (0, False, "absent", "none"):
            errors.append(f"{packet_id}: missingness collapsed into absence at observation {index}")

    if decision == "pass" and observed_count == 0:
        errors.append(f"{packet_id}: pass requires at least one observed variable")

    if decision == "pass" and not packet.get("measurable_variables"):
        errors.append(f"{packet_id}: pass requires measurable variables")

    return errors


def validate_fixture(registry_path: str | Path, fixture_path: str | Path) -> tuple[int, list[str]]:
    registry = load_json(registry_path)
    fixture = load_json(fixture_path)
    all_errors: list[str] = []
    valid_seen = 0
    invalid_rejected = 0

    for packet in expand_packets(fixture, registry):
        errors = validate_packet(packet, registry)
        is_intentionally_invalid = ".invalid." in packet.get("packet_id", "")
        if is_intentionally_invalid:
            if errors:
                invalid_rejected += 1
            else:
                all_errors.append(f"{packet.get('packet_id')}: intentionally invalid packet was accepted")
        else:
            valid_seen += 1
            all_errors.extend(errors)

    expected_gate_count = len(registry.get("gates", {}))
    if valid_seen != expected_gate_count:
        all_errors.append(f"expected {expected_gate_count} valid packets, saw {valid_seen}")
    if invalid_rejected != expected_gate_count:
        all_errors.append(f"expected {expected_gate_count} invalid rejections, saw {invalid_rejected}")

    return (0 if not all_errors else 1), all_errors


def main(argv: list[str]) -> int:
    base = Path(__file__).resolve().parent
    registry_path = Path(argv[1]) if len(argv) > 1 else base / "gate_registry.json"
    fixture_path = Path(argv[2]) if len(argv) > 2 else base / "fixtures.synthetic.json"
    code, errors = validate_fixture(registry_path, fixture_path)
    if errors:
        print("MC gate integration failed:")
        for error in errors:
            print(f"- {error}")
    else:
        print("MC gate integration passed.")
    return code


if __name__ == "__main__":
    raise SystemExit(main(sys.argv))
