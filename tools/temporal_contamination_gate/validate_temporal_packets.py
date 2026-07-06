#!/usr/bin/env python3
"""Validate Mirror Cartographer temporal-contamination packets.

The gate protects discovery memory from rewarding late recall as novelty.
It verifies that allowed context sources are not dated after the allowed
source cutoff, and that post-window validation claims contain genuine
post-generation validation targets.
"""

from __future__ import annotations

import argparse
import json
from datetime import date
from pathlib import Path
from typing import Any

ALLOWED_PRIVACY = {"public_safe", "synthetic", "deidentified_public"}


def parse_date(value: str) -> date:
    try:
        return date.fromisoformat(value)
    except ValueError as exc:
        raise ValueError(f"invalid ISO date: {value}") from exc


def validate_packet(packet: dict[str, Any]) -> list[str]:
    errors: list[str] = []

    if packet.get("privacy_status") not in ALLOWED_PRIVACY:
        errors.append("privacy_status must be public-safe, synthetic, or deidentified_public")

    generation = packet.get("generation_window", {})
    generated_at = parse_date(generation.get("generated_at", "0001-01-01"))
    cutoff = parse_date(generation.get("allowed_source_end_date", "0001-01-01"))

    if cutoff >= generated_at:
        errors.append("allowed_source_end_date must be earlier than generated_at")

    has_post_window_validation = False
    has_excluded_future = False

    for window in packet.get("evidence_windows", []):
        window_type = window.get("window_type")
        window_start = parse_date(window.get("start_date", "0001-01-01"))
        window_end = parse_date(window.get("end_date", "0001-01-01"))
        if window_end < window_start:
            errors.append(f"{window_type}: end_date is earlier than start_date")

        for source in window.get("sources", []):
            source_date = parse_date(source.get("date", "0001-01-01"))
            role = source.get("role")

            if role == "allowed_context" and source_date > cutoff:
                errors.append(
                    f"{source.get('source_id')}: allowed_context source is after allowed_source_end_date"
                )
            if role == "validation_target" and source_date <= generated_at:
                errors.append(
                    f"{source.get('source_id')}: validation_target must be after generated_at"
                )
            if role == "validation_target" and source_date > generated_at:
                has_post_window_validation = True
            if role == "excluded_context":
                has_excluded_future = True

    status = packet.get("claim_status")
    if status == "validated_after_window" and not has_post_window_validation:
        errors.append("validated_after_window requires at least one post-generation validation_target")
    if status == "contaminated" and not errors and not has_excluded_future:
        errors.append("contaminated packet should identify a future leakage or excluded future source")

    if not packet.get("measurable_variables"):
        errors.append("at least one measurable variable is required")
    if len(packet.get("falsification_route", "")) < 20:
        errors.append("falsification_route must be explicit")

    return errors


def main() -> int:
    parser = argparse.ArgumentParser(description="Validate temporal contamination packets")
    parser.add_argument("path", type=Path, help="JSON packet or array of packets")
    args = parser.parse_args()

    payload = json.loads(args.path.read_text())
    packets = payload if isinstance(payload, list) else [payload]

    failed = False
    for packet in packets:
        packet_id = packet.get("packet_id", "<missing>")
        errors = validate_packet(packet)
        if errors:
            failed = True
            print(f"FAIL {packet_id}")
            for error in errors:
                print(f"  - {error}")
        else:
            print(f"PASS {packet_id}")

    return 1 if failed else 0


if __name__ == "__main__":
    raise SystemExit(main())
