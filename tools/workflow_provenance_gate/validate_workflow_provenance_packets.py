#!/usr/bin/env python3
"""
Mirror Cartographer workflow provenance gate.

Validates public-safe discovery workflow packets before they can be promoted into
research memory. This is research-organization infrastructure, not medical,
veterinary, or treatment advice.
"""

from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path
from typing import Any

ALLOWED_WORKFLOW_STAGES = {
    "unresolved_phenomenon_map",
    "hypothesis_generation",
    "mechanistic_model",
    "falsifiable_prediction",
    "dataset_or_fixture",
    "evaluation_harness",
    "prototype_tool",
    "evidence_crosswalk",
    "collaborator_path",
    "contradiction_ledger",
}

PUBLIC_ALLOWED_PRIVACY = {"public_safe", "deidentified", "synthetic_only"}

REQUIRED_PACKET_FIELDS = {
    "schema_version",
    "packet_id",
    "hypothesis_id",
    "workflow_stage",
    "source_status",
    "claim_status",
    "privacy_status",
    "missingness",
    "revision_reason",
    "implementation_status",
    "evidence_strength",
    "agent_actions",
    "evidence_objects",
    "validation_objects",
    "measurable_variables",
    "falsification_route",
    "next_executable_action",
}

PRIVATE_MARKERS = {
    "diagnosis",
    "treatment plan",
    "home address",
    "phone number",
    "ssn",
    "social security",
    "raw transcript",
    "personal medical record",
    "veterinary advice",
}


def load_json(path: Path) -> Any:
    with path.open("r", encoding="utf-8") as handle:
        return json.load(handle)


def text_contains_private_marker(value: Any) -> bool:
    if isinstance(value, str):
        lower = value.lower()
        return any(marker in lower for marker in PRIVATE_MARKERS)
    if isinstance(value, dict):
        return any(text_contains_private_marker(v) for v in value.values())
    if isinstance(value, list):
        return any(text_contains_private_marker(v) for v in value)
    return False


def validate_packet(packet: dict[str, Any]) -> list[str]:
    errors: list[str] = []
    missing_fields = sorted(REQUIRED_PACKET_FIELDS - set(packet))
    if missing_fields:
        errors.append(f"missing required fields: {', '.join(missing_fields)}")
        return errors

    if packet["schema_version"] != "1.0.0":
        errors.append("schema_version must be 1.0.0")

    if packet["workflow_stage"] not in ALLOWED_WORKFLOW_STAGES:
        errors.append("workflow_stage is not recognized")

    if packet["privacy_status"] not in PUBLIC_ALLOWED_PRIVACY:
        errors.append("privacy_status is not public-safe")

    if not isinstance(packet["agent_actions"], list) or len(packet["agent_actions"]) == 0:
        errors.append("at least one agent action is required")

    if not isinstance(packet["evidence_objects"], list) or len(packet["evidence_objects"]) == 0:
        errors.append("at least one evidence object is required")

    if not isinstance(packet["validation_objects"], list) or len(packet["validation_objects"]) == 0:
        errors.append("at least one validation object is required")

    if not isinstance(packet["measurable_variables"], list) or len(packet["measurable_variables"]) == 0:
        errors.append("at least one measurable variable is required")

    if len(str(packet["falsification_route"])) < 20:
        errors.append("falsification_route must be explicit")

    unsupported_transitions = 0
    if packet.get("claim_status") in {"supported", "bounded"}:
        if len(packet.get("evidence_objects", [])) == 0 or len(packet.get("validation_objects", [])) == 0:
            unsupported_transitions += 1
    if unsupported_transitions:
        errors.append("bounded/supported claim lacks evidence or validation objects")

    if text_contains_private_marker(packet):
        errors.append("packet contains blocked private/advice-like markers")

    for idx, action in enumerate(packet.get("agent_actions", [])):
        if action.get("input_boundary") == "private_blocked":
            errors.append(f"agent_actions[{idx}] uses private_blocked input")

    return errors


def iter_fixture_packets(data: Any) -> list[tuple[str, str | None, dict[str, Any]]]:
    if isinstance(data, dict) and "packet" not in data:
        return [(data.get("packet_id", "packet"), None, data)]
    if isinstance(data, dict) and "packet" in data:
        return [(data.get("name", "fixture"), data.get("expected"), data["packet"])]
    if isinstance(data, list):
        out = []
        for index, item in enumerate(data):
            if isinstance(item, dict) and "packet" in item:
                out.append((item.get("name", f"fixture_{index}"), item.get("expected"), item["packet"]))
            elif isinstance(item, dict):
                out.append((item.get("packet_id", f"packet_{index}"), None, item))
            else:
                raise TypeError(f"fixture item {index} is not an object")
        return out
    raise TypeError("input must be a packet object or list of fixtures")


def main() -> int:
    parser = argparse.ArgumentParser(description="Validate MC workflow provenance packets.")
    parser.add_argument("path", type=Path, help="JSON packet or synthetic fixture file")
    parser.add_argument("--check-fixture-expectations", action="store_true")
    args = parser.parse_args()

    data = load_json(args.path)
    failures = 0
    for name, expected, packet in iter_fixture_packets(data):
        errors = validate_packet(packet)
        passed = not errors
        print(json.dumps({"name": name, "passed": passed, "errors": errors}, indent=2))
        if args.check_fixture_expectations and expected in {"pass", "fail"}:
            expected_pass = expected == "pass"
            if passed != expected_pass:
                failures += 1
        elif not passed:
            failures += 1
    return 1 if failures else 0


if __name__ == "__main__":
    sys.exit(main())
