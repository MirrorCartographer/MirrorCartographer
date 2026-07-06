#!/usr/bin/env python3
"""Validate Assay Readout Fitness packets.

This validator is intentionally dependency-light except for jsonschema.
It blocks discovery-memory promotion when a hypothesis names a measurement
but does not show that the measurement can distinguish mechanism from proxy,
noise, confounding, or timing artifacts.
"""
from __future__ import annotations

import json
import sys
from pathlib import Path

try:
    from jsonschema import Draft202012Validator
except ImportError as exc:  # pragma: no cover
    raise SystemExit("Install jsonschema to validate packets: pip install jsonschema") from exc

ROOT = Path(__file__).resolve().parent
SCHEMA_PATH = ROOT / "assay_readout_fitness_packet.schema.json"


def load_json(path: Path) -> dict:
    with path.open("r", encoding="utf-8") as handle:
        return json.load(handle)


def validate_packet(packet_path: Path) -> list[str]:
    schema = load_json(SCHEMA_PATH)
    packet = load_json(packet_path)
    validator = Draft202012Validator(schema)
    errors = sorted(validator.iter_errors(packet), key=lambda error: list(error.path))
    messages = []
    for error in errors:
        location = "/".join(str(part) for part in error.path) or "<root>"
        messages.append(f"{location}: {error.message}")

    readout_fitness = packet.get("readout_fitness", {})
    if readout_fitness.get("distinguishes_mechanism_from_proxy") is not True:
        messages.append("readout_fitness/distinguishes_mechanism_from_proxy: must be true for promotion")

    if packet.get("privacy_status") == "unknown_reject":
        messages.append("privacy_status: unknown_reject packets cannot be promoted")

    return messages


def main(argv: list[str]) -> int:
    if len(argv) != 2:
        print("Usage: validate_assay_readout_fitness_packet.py <packet.json>", file=sys.stderr)
        return 2

    packet_path = Path(argv[1])
    errors = validate_packet(packet_path)
    if errors:
        print("INVALID assay-readout-fitness packet:")
        for message in errors:
            print(f"- {message}")
        return 1

    print("VALID assay-readout-fitness packet")
    return 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv))
