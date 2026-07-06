#!/usr/bin/env python3
"""Validate Mirror Cartographer animal-health evidence packets.

This gate is intentionally conservative. It is not a medical or veterinary
advisor. It checks whether an animal-care research packet is structured enough
for evidence organization, collaborator review, or discovery-memory admission.
"""

from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path
from typing import Any

try:
    from jsonschema import Draft202012Validator
except ImportError as exc:  # pragma: no cover
    raise SystemExit(
        "Missing dependency: jsonschema. Install with `python -m pip install jsonschema`."
    ) from exc

ROOT = Path(__file__).resolve().parent
SCHEMA_PATH = ROOT / "animal_health_evidence_packet_schema.json"

FORBIDDEN_ACTION_TERMS = {
    "change meds",
    "stop medication",
    "start medication",
    "diagnose",
    "cure guaranteed",
    "replace vet",
    "avoid vet",
}

REQUIRED_BOUNDARY_TERMS = {
    "veterinary",
    "review",
}


def load_json(path: Path) -> Any:
    with path.open("r", encoding="utf-8") as handle:
        return json.load(handle)


def normalize_text(value: Any) -> str:
    if isinstance(value, str):
        return value.lower()
    if isinstance(value, dict):
        return " ".join(normalize_text(v) for v in value.values())
    if isinstance(value, list):
        return " ".join(normalize_text(v) for v in value)
    return ""


def domain_checks(packet: dict[str, Any]) -> list[str]:
    errors: list[str] = []
    text = normalize_text(packet)

    for term in sorted(FORBIDDEN_ACTION_TERMS):
        if term in text:
            errors.append(f"forbidden veterinary action term found: {term!r}")

    evidence_boundary = packet.get("evidence_boundary", {})
    if evidence_boundary.get("requires_veterinary_review") is not True:
        errors.append("requires_veterinary_review must be true")

    boundary_text = normalize_text(evidence_boundary)
    for term in REQUIRED_BOUNDARY_TERMS:
        if term not in boundary_text:
            errors.append(f"evidence boundary must explicitly include {term!r}")

    privacy = packet.get("privacy_boundary", {})
    if privacy.get("raw_data_allowed") is not False:
        errors.append("raw_data_allowed must be false for public-safe MC packets")

    if packet.get("evidence_strength") == "high" and packet.get("source_status") in {
        "synthetic_fixture",
        "market_secondary",
        "preprint_caveated",
    }:
        errors.append("high evidence strength is not allowed for synthetic, secondary-market, or caveated preprint packets")

    modalities = {entry.get("name") for entry in packet.get("data_modalities", []) if isinstance(entry, dict)}
    if "clinical_record" not in modalities and packet.get("claim_status") == "research_organization":
        errors.append("research-organization packets should include clinical_record as one modality")

    return errors


def validate_packet(packet: dict[str, Any]) -> list[str]:
    schema = load_json(SCHEMA_PATH)
    validator = Draft202012Validator(schema)
    errors = [
        f"schema:{'/'.join(str(p) for p in error.absolute_path) or '<root>'}: {error.message}"
        for error in sorted(validator.iter_errors(packet), key=lambda e: list(e.absolute_path))
    ]
    errors.extend(f"domain:{message}" for message in domain_checks(packet))
    return errors


def main() -> int:
    parser = argparse.ArgumentParser(description="Validate MC animal-health evidence packets.")
    parser.add_argument("packet_json", type=Path, help="Path to a packet JSON file or fixture list.")
    parser.add_argument("--fixtures", action="store_true", help="Input is a fixture list with expected pass/fail values.")
    args = parser.parse_args()

    payload = load_json(args.packet_json)

    if args.fixtures:
        failures = 0
        for fixture in payload:
            packet = fixture["packet"]
            expected = fixture["expected"]
            errors = validate_packet(packet)
            actual = "pass" if not errors else "fail"
            if actual != expected:
                failures += 1
                print(f"FAIL {fixture['name']}: expected {expected}, got {actual}")
                for error in errors:
                    print(f"  - {error}")
            else:
                print(f"PASS {fixture['name']}: {actual}")
        return 1 if failures else 0

    errors = validate_packet(payload)
    if errors:
        print("INVALID animal-health evidence packet")
        for error in errors:
            print(f"- {error}")
        return 1

    print("VALID animal-health evidence packet")
    return 0


if __name__ == "__main__":
    sys.exit(main())
