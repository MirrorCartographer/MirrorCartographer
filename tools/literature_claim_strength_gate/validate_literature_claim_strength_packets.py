#!/usr/bin/env python3
"""
Mirror Cartographer Literature Claim Strength Gate.

Purpose:
  Prevent medical, animal-care, and discovery research maps from promoting
  weak, private, advice-like, single-source, or missingness-collapsed packets.

This is research-organization infrastructure only. It does not diagnose,
treat, triage, or provide veterinary/medical advice.
"""
from __future__ import annotations

import json
import sys
from pathlib import Path
from typing import Any, Dict, List, Tuple


BOUNDARY_TERMS = {
    "diagnose",
    "diagnosis",
    "treat",
    "treatment",
    "dose",
    "dosage",
    "prescribe",
    "urgent",
    "emergency",
    "cure",
    "healed",
    "give ",
    "should take",
    "should give",
    "safe to give",
}

PROMOTABLE = {"promote_to_question_prep", "hold_for_more_sources"}


def load_json(path: str | Path) -> Any:
    return json.loads(Path(path).read_text(encoding="utf-8"))


def text_blob(packet: Dict[str, Any]) -> str:
    return json.dumps(packet, sort_keys=True).lower()


def validate_packet(packet: Dict[str, Any]) -> Tuple[bool, List[str]]:
    errors: List[str] = []

    if packet.get("privacy_status") == "private_rejected":
        errors.append("private_rejected packets cannot be promoted or stored in public research memory")

    evidence_items = packet.get("evidence_items", [])
    if len(evidence_items) < 2:
        errors.append("at least two evidence items are required to avoid single-source promotion")

    source_types = {item.get("source_type") for item in evidence_items}
    if packet.get("claim_status") in {"literature_supported_association", "mechanistic_hypothesis"}:
        if source_types <= {"synthetic"}:
            errors.append("literature/mechanistic claims cannot rely only on synthetic sources")

    if not packet.get("missingness", {}).get("known_missing_fields"):
        errors.append("known_missing_fields must be explicit; empty missingness hides uncertainty")

    if packet.get("missingness", {}).get("absence_interpretation") not in {
        "not_absence_of_effect",
        "not_absence_of_symptom",
        "not_applicable",
    }:
        errors.append("absence_interpretation must block missingness-as-absence")

    variables = packet.get("measurable_variables", [])
    if len(variables) < 2:
        errors.append("at least two measurable variables are required")
    if any(v.get("collection_boundary") == "not_collectable" for v in variables):
        errors.append("not_collectable variables cannot support an executable test packet")

    falsification = packet.get("falsification_route", {})
    if not falsification.get("would_weaken_claim") or not falsification.get("would_block_promotion"):
        errors.append("falsification route must include weaken and block conditions")

    decision = packet.get("promotion_decision")
    if decision in PROMOTABLE and packet.get("privacy_status") != "public_safe":
        errors.append("only public_safe packets may enter promotable research routes")

    blob = text_blob(packet)
    if any(term in blob for term in BOUNDARY_TERMS) and packet.get("promotion_decision") == "promote_to_question_prep":
        errors.append("medical/veterinary boundary terminology detected in a promotable packet")

    if packet.get("claim_status") in {"unsupported", "contradicted"} and decision != "route_to_contradiction_ledger":
        errors.append("unsupported or contradicted claims must route to contradiction ledger")

    return not errors, errors


def validate_fixture_file(path: str | Path) -> int:
    fixtures = load_json(path)
    failures = 0
    for fixture in fixtures:
        ok, errors = validate_packet(fixture["packet"])
        expected = bool(fixture["should_pass"])
        if ok != expected:
            failures += 1
            print(f"FAIL {fixture['name']}: expected {expected}, got {ok}")
            for error in errors:
                print(f"  - {error}")
        else:
            print(f"PASS {fixture['name']}")
    return failures


def main(argv: List[str]) -> int:
    path = argv[1] if len(argv) > 1 else Path(__file__).with_name("fixtures.synthetic.json")
    return 1 if validate_fixture_file(path) else 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv))
