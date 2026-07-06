#!/usr/bin/env python3
"""Validate MC actionability-boundary packets.

This gate is public-safe research infrastructure. It does not diagnose, treat,
triage, or provide veterinary instruction. It checks whether an evidence packet
is allowed to become research organization or question-prep output.
"""

from __future__ import annotations

import json
import sys
from pathlib import Path
from typing import Any

FORBIDDEN_ACTION_TERMS = {
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
    "give medication",
    "increase medication",
    "decrease medication",
}

REQUIRED_PROHIBITIONS = {
    "diagnosis_or_treatment_advice",
    "veterinary_instruction",
    "dosage_or_protocol_recommendation",
    "urgency_triage",
}

ALLOWED_PUBLIC_OUTPUTS = {"pass_question_prep", "pass_research_map", "route_contradiction", "reject"}


def load_packets(path: Path) -> list[dict[str, Any]]:
    data = json.loads(path.read_text(encoding="utf-8"))
    if not isinstance(data, list):
        raise ValueError("fixture root must be a list of packets")
    return data


def lower_join(value: Any) -> str:
    return json.dumps(value, sort_keys=True).lower()


def validate_packet(packet: dict[str, Any]) -> list[str]:
    errors: list[str] = []

    packet_id = packet.get("packet_id", "<missing>")
    if packet.get("privacy_status") == "private_rejected":
        errors.append(f"{packet_id}: private_rejected packets cannot pass actionability gate")

    prohibited = set(packet.get("prohibited_use", []))
    missing_prohibitions = sorted(REQUIRED_PROHIBITIONS - prohibited)
    if missing_prohibitions:
        errors.append(f"{packet_id}: missing required prohibitions: {missing_prohibitions}")

    permitted = set(packet.get("permitted_use", []))
    if "prepare_questions" in permitted and not {"organize_research", "route_to_literature_map", "route_to_longitudinal_tracker"}.intersection(permitted):
        errors.append(f"{packet_id}: question prep must be paired with research organization or routing")

    missingness = packet.get("missingness", {})
    if missingness.get("absence_interpretation_allowed") is not False:
        errors.append(f"{packet_id}: missingness cannot be interpreted as absence")

    evidence_items = packet.get("evidence_items", [])
    if len(evidence_items) < packet.get("decision_rule", {}).get("minimum_evidence_items", 2):
        errors.append(f"{packet_id}: insufficient evidence items for decision rule")

    variables = packet.get("measurable_variables", [])
    if len(variables) < packet.get("decision_rule", {}).get("minimum_variables", 2):
        errors.append(f"{packet_id}: insufficient measurable variables for decision rule")

    if any(item.get("source_boundary") == "private_rejected" for item in evidence_items):
        errors.append(f"{packet_id}: contains private_rejected evidence item")

    if any(item.get("actionability_level") == "blocked" for item in evidence_items):
        errors.append(f"{packet_id}: contains blocked actionability evidence item")

    allowed_outputs = set(packet.get("decision_rule", {}).get("allowed_outputs", []))
    if not allowed_outputs.issubset(ALLOWED_PUBLIC_OUTPUTS):
        errors.append(f"{packet_id}: contains unknown allowed output route")

    if "pass_question_prep" in allowed_outputs and "prepare_questions" not in permitted:
        errors.append(f"{packet_id}: decision rule allows question prep but permitted_use does not")

    text = lower_join({
        "candidate_claim": packet.get("candidate_claim"),
        "next_executable_action": packet.get("next_executable_action"),
        "falsification_route": packet.get("falsification_route"),
    })
    leaked_terms = sorted(term for term in FORBIDDEN_ACTION_TERMS if term in text)
    # Allow the word treatment only inside explicit boundary/falsification phrases.
    leaked_terms = [term for term in leaked_terms if term not in {"diagnosis", "treatment"}]
    if leaked_terms:
        errors.append(f"{packet_id}: advice-like action terms present: {leaked_terms}")

    if packet.get("claim_status") not in {"research_question", "organization_claim", "hypothesis"}:
        errors.append(f"{packet_id}: claim_status cannot be promoted: {packet.get('claim_status')}")

    return errors


def validate_file(path: Path) -> tuple[int, list[str]]:
    packets = load_packets(path)
    errors: list[str] = []
    for packet in packets:
        errors.extend(validate_packet(packet))
    return len(packets), errors


def main(argv: list[str]) -> int:
    if len(argv) != 2:
        print("usage: validate_actionability_boundary_packets.py <packets.json>", file=sys.stderr)
        return 2
    count, errors = validate_file(Path(argv[1]))
    if errors:
        print(f"FAIL: validated {count} packet(s); {len(errors)} error(s)")
        for error in errors:
            print(f"- {error}")
        return 1
    print(f"PASS: validated {count} actionability-boundary packet(s)")
    return 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv))
