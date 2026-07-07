#!/usr/bin/env python3
"""Validate MC contradiction-ledger fixtures.

This validator keeps contradiction records in research-organization territory.
It does not provide diagnosis, treatment, veterinary advice, dosage guidance,
emergency triage, cure certainty, or discovery proof.
"""
from __future__ import annotations

import json
import sys
from pathlib import Path
from typing import Any

REQUIRED_TOP_LEVEL_LABELS = [
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

REQUIRED_ENTRY_FIELDS = [
    "entry_id",
    "domain",
    "contradiction_statement",
    "side_a",
    "side_b",
    "privacy_status",
    "measurable_variables",
    "allowed_route",
    "blocked_route",
    "falsification_route",
    "next_executable_action",
    "decision",
]

REQUIRED_SIDE_FIELDS = [
    "claim",
    "source_status",
    "claim_status",
    "missingness",
    "evidence_boundary",
]

SAFE_ROUTES = {
    "contradiction_ledger",
    "question_prep",
    "research_question",
    "longitudinal_observation",
    "blocked_packet",
    "evidence_table",
}

UNSAFE_ROUTES = {
    "public_discovery_claim",
    "diagnosis_or_treatment_claim",
    "veterinary_instruction",
    "cure_claim",
    "certainty_memory",
}

MISSINGNESS_STATES = {
    "observed",
    "unknown",
    "not_collected",
    "redacted",
    "not_applicable",
}

BLOCKED_TERMS = {
    "diagnosis",
    "treatment",
    "dosage_guidance",
    "emergency_triage",
    "veterinary_advice",
    "cure_certainty",
    "discovery_proof",
    "unsupported_causality",
    "symbolic_certainty",
    "private_identifier_retention",
    "missingness_as_absence",
}


def load_fixture(path: Path) -> dict[str, Any]:
    with path.open("r", encoding="utf-8") as handle:
        return json.load(handle)


def has_text(value: Any) -> bool:
    return isinstance(value, str) and bool(value.strip())


def validate_side(entry_id: str, label: str, side: dict[str, Any]) -> list[str]:
    errors: list[str] = []
    for field in REQUIRED_SIDE_FIELDS:
        if field not in side:
            errors.append(f"{entry_id}: {label} missing {field}")
    missingness = side.get("missingness")
    if missingness not in MISSINGNESS_STATES:
        errors.append(f"{entry_id}: {label} invalid missingness {missingness!r}")
    if missingness == "unknown" and side.get("claim_status") in {"proven", "certain", "confirmed_cause"}:
        errors.append(f"{entry_id}: {label} collapses unknown missingness into certainty")
    if not has_text(side.get("evidence_boundary")):
        errors.append(f"{entry_id}: {label} requires evidence_boundary text")
    return errors


def validate_entry(entry: dict[str, Any]) -> list[str]:
    errors: list[str] = []
    entry_id = entry.get("entry_id", "<no-entry-id>")
    intentionally_invalid = ".invalid." in entry_id

    for field in REQUIRED_ENTRY_FIELDS:
        if field not in entry:
            errors.append(f"{entry_id}: missing required field {field}")

    for side_name in ("side_a", "side_b"):
        side = entry.get(side_name)
        if not isinstance(side, dict):
            errors.append(f"{entry_id}: {side_name} must be object")
        else:
            errors.extend(validate_side(entry_id, side_name, side))

    if entry.get("privacy_status") != "public-safe synthetic only":
        errors.append(f"{entry_id}: privacy_status must remain public-safe synthetic only")

    variables = entry.get("measurable_variables") or []
    if entry.get("decision") == "pass" and len(variables) < 2:
        errors.append(f"{entry_id}: passing entry requires at least two measurable variables")

    allowed_route = entry.get("allowed_route")
    blocked_route = entry.get("blocked_route")
    if entry.get("decision") == "pass" and allowed_route not in SAFE_ROUTES:
        errors.append(f"{entry_id}: passing entry cannot route to {allowed_route!r}")
    if entry.get("decision") == "pass" and blocked_route not in UNSAFE_ROUTES:
        errors.append(f"{entry_id}: passing entry must name an unsafe blocked_route")

    blocked_present = set(entry.get("blocked_claim_classes_present") or [])
    if entry.get("decision") == "pass" and blocked_present.intersection(BLOCKED_TERMS):
        errors.append(f"{entry_id}: passing entry contains blocked claim classes {sorted(blocked_present)}")

    if entry.get("decision") == "pass" and entry.get("falsification_route") in {"none", "none supplied", ""}:
        errors.append(f"{entry_id}: passing entry requires falsification route")
    if entry.get("decision") == "pass" and entry.get("next_executable_action") in {"none", "none supplied", ""}:
        errors.append(f"{entry_id}: passing entry requires next executable action")

    if intentionally_invalid:
        return [] if errors else [f"{entry_id}: intentionally invalid entry was accepted"]
    return errors


def validate_fixture(fixture: dict[str, Any]) -> list[str]:
    errors: list[str] = []
    for label in REQUIRED_TOP_LEVEL_LABELS:
        if label not in fixture:
            errors.append(f"fixture missing top-level label {label}")

    entries = fixture.get("ledger_entries")
    if not isinstance(entries, list) or not entries:
        errors.append("fixture requires non-empty ledger_entries")
        return errors

    valid_count = 0
    invalid_count = 0
    for entry in entries:
        if ".invalid." in entry.get("entry_id", ""):
            invalid_count += 1
        else:
            valid_count += 1
        errors.extend(validate_entry(entry))

    if valid_count < 2:
        errors.append("fixture should contain at least two valid entries")
    if invalid_count < 1:
        errors.append("fixture should contain at least one intentionally invalid entry")
    return errors


def main(argv: list[str]) -> int:
    base = Path(__file__).resolve().parent
    fixture_path = Path(argv[1]) if len(argv) > 1 else base / "contradiction_ledger_fixture.json"
    errors = validate_fixture(load_fixture(fixture_path))
    if errors:
        print("MC contradiction ledger validation failed:")
        for error in errors:
            print(f"- {error}")
        return 1
    print("MC contradiction ledger validation passed.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv))
