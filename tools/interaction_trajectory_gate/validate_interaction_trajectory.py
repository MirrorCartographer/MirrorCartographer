#!/usr/bin/env python3
"""Validate Mirror Cartographer interaction trajectory packets.

This gate scores whether a human-AI sensemaking interaction moved a research
state toward measurable, bounded, falsifiable discovery infrastructure without
increasing privacy risk or promoting unsupported claims.
"""

from __future__ import annotations

import json
import sys
from pathlib import Path
from typing import Any

REQUIRED_KEYS = {
    "schema_version",
    "packet_id",
    "source_status",
    "claim_status",
    "privacy_status",
    "interaction_window",
    "research_state_before",
    "research_state_after",
    "trajectory_metrics",
    "sensemaking_events",
    "falsification_route",
    "missingness",
    "revision_reason",
    "implementation_status",
}

VALID_SOURCE_STATUS = {"synthetic", "public_research", "mixed_public_synthetic"}
VALID_CLAIM_STATUS = {"infrastructure_hypothesis", "evaluation_claim", "prototype_requirement"}
VALID_PRIVACY_STATUS = {"public_safe", "deidentified", "reject_private"}


def _fail(errors: list[str], message: str) -> None:
    errors.append(message)


def validate_packet(packet: dict[str, Any]) -> list[str]:
    errors: list[str] = []
    missing = REQUIRED_KEYS - set(packet)
    if missing:
        _fail(errors, f"missing required keys: {sorted(missing)}")
        return errors

    if packet["schema_version"] != "1.0.0":
        _fail(errors, "schema_version must be 1.0.0")
    if not str(packet["packet_id"]).startswith("itp_"):
        _fail(errors, "packet_id must start with itp_")
    if packet["source_status"] not in VALID_SOURCE_STATUS:
        _fail(errors, "invalid source_status")
    if packet["claim_status"] not in VALID_CLAIM_STATUS:
        _fail(errors, "invalid claim_status")
    if packet["privacy_status"] not in VALID_PRIVACY_STATUS:
        _fail(errors, "invalid privacy_status")
    if packet["privacy_status"] == "reject_private":
        _fail(errors, "private packets must not enter public-safe trajectory memory")

    window = packet["interaction_window"]
    if not isinstance(window, dict) or window.get("turn_count", 0) < 2:
        _fail(errors, "interaction_window.turn_count must be >= 2")

    before = packet["research_state_before"]
    after = packet["research_state_after"]
    for name, state in (("before", before), ("after", after)):
        if not isinstance(state, dict):
            _fail(errors, f"research_state_{name} must be object")
            continue
        if len(state.get("claim", "")) < 8:
            _fail(errors, f"research_state_{name}.claim too short")
        if not isinstance(state.get("measurable_variables"), list):
            _fail(errors, f"research_state_{name}.measurable_variables must be list")
        if state.get("evidence_boundary") not in {"unbounded", "bounded", "verified"}:
            _fail(errors, f"research_state_{name}.evidence_boundary invalid")
        if not isinstance(state.get("falsification_route_present"), bool):
            _fail(errors, f"research_state_{name}.falsification_route_present must be boolean")

    metrics = packet["trajectory_metrics"]
    if metrics.get("privacy_risk_delta", 1) > 0:
        _fail(errors, "privacy_risk_delta must not increase")
    if metrics.get("unsupported_promotion_count", 1) > 0:
        _fail(errors, "unsupported_promotion_count must be zero")
    if metrics.get("measurability_delta", 0) <= 0:
        _fail(errors, "measurability_delta must be positive")
    if metrics.get("falsifiability_delta", 0) <= 0 and not after.get("falsification_route_present"):
        _fail(errors, "trajectory must improve or preserve explicit falsifiability")
    if metrics.get("drift_count", 0) > 0 and metrics.get("claim_stability_delta", 0) < 0:
        _fail(errors, "negative claim stability with drift is rejected")

    if after.get("evidence_boundary") == "verified":
        checked_events = [
            event for event in packet.get("sensemaking_events", [])
            if event.get("verification_status") in {"source_checked", "test_checked"}
        ]
        if not checked_events:
            _fail(errors, "verified boundary requires source_checked or test_checked event")

    if len(after.get("measurable_variables", [])) == 0:
        _fail(errors, "research_state_after requires at least one measurable variable")
    if not after.get("falsification_route_present"):
        _fail(errors, "research_state_after requires falsification_route_present=true")
    if len(packet.get("falsification_route", "")) < 20:
        _fail(errors, "falsification_route too short")
    if not packet.get("sensemaking_events"):
        _fail(errors, "at least one sensemaking_event is required")

    return errors


def load_packets(path: Path) -> list[dict[str, Any]]:
    data = json.loads(path.read_text())
    if isinstance(data, list) and data and "packet" in data[0]:
        return [item["packet"] for item in data]
    if isinstance(data, list):
        return data
    return [data]


def main(argv: list[str]) -> int:
    if len(argv) != 2:
        print("usage: validate_interaction_trajectory.py <packet-or-fixtures.json>", file=sys.stderr)
        return 2
    path = Path(argv[1])
    packets = load_packets(path)
    failed = 0
    for packet in packets:
        errors = validate_packet(packet)
        if errors:
            failed += 1
            print(f"FAIL {packet.get('packet_id', '<unknown>')}: " + "; ".join(errors))
        else:
            print(f"PASS {packet.get('packet_id')}")
    return 1 if failed else 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv))
