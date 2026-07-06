#!/usr/bin/env python3
"""
Validate MC Evidence Temporality Gate packets.

Purpose:
- Keep longitudinal and causal-sequence hypotheses from being promoted when event order is unknown.
- Preserve missingness distinctions: unknown/not_collected/redacted are not absence.
- Enforce public-safe research-organization boundaries for medical and animal-care adjacent packets.

No medical, treatment, or veterinary advice is produced by this script.
"""

from __future__ import annotations

import json
import re
import sys
from datetime import datetime
from pathlib import Path
from typing import Any, Iterable

FORBIDDEN_ADVICE_TERMS = re.compile(
    r"\b(diagnose|diagnosis|treat|treatment|cure\s+with|dose|dosage|prescribe|urgent\s+care|emergency|vet\s+now|give\s+\d+)\b",
    re.IGNORECASE,
)

VALID_PUBLIC_PRIVACY = {"public_safe", "deidentified"}
NON_ORDERED_TIME_STATUS = {"unknown", "not_collected", "redacted"}
NON_OBSERVED_MISSINGNESS = {"unknown", "not_collected", "redacted"}


def load_packets(path: Path) -> list[dict[str, Any]]:
    with path.open("r", encoding="utf-8") as handle:
        data = json.load(handle)
    if isinstance(data, dict):
        return [data]
    if isinstance(data, list):
        return data
    raise ValueError("Input must be a packet object or list of packet objects")


def parse_time(anchor: str | None) -> datetime | None:
    if anchor is None:
        return None
    normalized = anchor.replace("Z", "+00:00")
    try:
        return datetime.fromisoformat(normalized)
    except ValueError:
        return None


def text_fields(packet: dict[str, Any]) -> Iterable[str]:
    for key in ("hypothesis_claim", "revision_reason", "temporal_question", "falsification_route", "next_executable_action"):
        value = packet.get(key)
        if isinstance(value, str):
            yield value
    for event in packet.get("events", []):
        if isinstance(event, dict):
            label = event.get("label")
            if isinstance(label, str):
                yield label


def validate_packet(packet: dict[str, Any]) -> list[str]:
    errors: list[str] = []
    packet_id = packet.get("packet_id", "<missing>")

    if packet.get("privacy_status") not in VALID_PUBLIC_PRIVACY:
        errors.append(f"{packet_id}: privacy_status blocks public-safe evidence routing")

    if packet.get("claim_status") not in {"research_organization", "question_prep", "simulation_only", "hypothesis"}:
        errors.append(f"{packet_id}: unsupported claim_status")

    if packet.get("missingness_policy") not in {"unknown_is_not_absent", "not_collected_is_not_negative_evidence"}:
        errors.append(f"{packet_id}: missingness_policy must prevent absence collapse")

    boundary = packet.get("boundary_policy", {})
    for flag in ("no_diagnosis", "no_treatment", "no_veterinary_advice", "public_safe_only"):
        if boundary.get(flag) is not True:
            errors.append(f"{packet_id}: boundary_policy.{flag} must be true")

    combined_text = " ".join(text_fields(packet))
    if FORBIDDEN_ADVICE_TERMS.search(combined_text):
        errors.append(f"{packet_id}: advice-like term detected; route to question-prep boundary review")

    events = packet.get("events", [])
    if not isinstance(events, list) or len(events) < 2:
        errors.append(f"{packet_id}: at least two events required for temporality testing")
        return errors

    parsed_times: list[datetime] = []
    for index, event in enumerate(events):
        event_id = event.get("event_id", f"event-index-{index}")
        time_status = event.get("time_status")
        time_anchor = event.get("time_anchor")
        evidence_status = event.get("evidence_status")
        missingness_state = event.get("missingness_state")

        parsed = parse_time(time_anchor)
        if time_status == "known" and parsed is None:
            errors.append(f"{packet_id}/{event_id}: known time_status requires parseable time_anchor")
        if time_status in NON_ORDERED_TIME_STATUS and time_anchor is not None:
            errors.append(f"{packet_id}/{event_id}: unknown/not_collected/redacted time must not carry a concrete time_anchor")
        if time_status in NON_ORDERED_TIME_STATUS:
            errors.append(f"{packet_id}/{event_id}: event order is not usable for sequence interpretation")
        if parsed is not None:
            parsed_times.append(parsed)

        if evidence_status in {"absent", "not_assessed"} and missingness_state in NON_OBSERVED_MISSINGNESS:
            errors.append(f"{packet_id}/{event_id}: absence/not_assessed conflicts with non-observed missingness")

        measured_variables = event.get("measured_variables", [])
        if not measured_variables:
            errors.append(f"{packet_id}/{event_id}: measured_variables required")
        for variable in measured_variables:
            if variable.get("value_status") == "missing" and variable.get("unit") and missingness_state == "observed":
                errors.append(f"{packet_id}/{event_id}: missing value cannot be treated as observed measurement")

    if len(parsed_times) >= 2 and parsed_times != sorted(parsed_times):
        errors.append(f"{packet_id}: event time_anchor values must be chronological")

    measurable = packet.get("measurable_variables", [])
    if not isinstance(measurable, list) or len(set(measurable)) < 2:
        errors.append(f"{packet_id}: at least two unique measurable variables required")

    falsification = packet.get("falsification_route", "")
    if not isinstance(falsification, str) or "fail" not in falsification.lower():
        errors.append(f"{packet_id}: falsification_route must specify a failure condition")

    return errors


def main(argv: list[str]) -> int:
    if len(argv) != 2:
        print("Usage: validate_evidence_temporality_packets.py <packet-or-fixtures.json>", file=sys.stderr)
        return 2

    packets = load_packets(Path(argv[1]))
    all_errors: list[str] = []
    for packet in packets:
        all_errors.extend(validate_packet(packet))

    if all_errors:
        for error in all_errors:
            print(f"FAIL: {error}")
        return 1

    print(f"PASS: {len(packets)} evidence temporality packet(s) validated")
    return 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv))
