#!/usr/bin/env python3
"""Validate MC observation-question triage packets.

This validator is research-organization infrastructure only. It rejects packets
that collapse observation into diagnosis/treatment/veterinary advice, leak private
status into public routes, or use missingness as negative evidence.
"""

from __future__ import annotations

import json
import re
import sys
from pathlib import Path
from typing import Any

BLOCKED_ADVICE_RE = re.compile(
    r"\b(diagnos(e|is|tic)|treat(ment)?|dose|dosage|start medication|stop medication|"
    r"immediately|urgent|emergency|cure|healed|give\s+\d|administer|prescribe)\b",
    re.IGNORECASE,
)
REQUIRED_FORBIDDEN = {
    "diagnosis",
    "treatment",
    "dosage",
    "urgency_instruction",
    "certainty_claim",
    "causal_claim",
}


def load_packets(path: Path) -> list[dict[str, Any]]:
    data = json.loads(path.read_text(encoding="utf-8"))
    if not isinstance(data, list):
        raise ValueError("fixture root must be a list")
    return data


def validate_packet(packet: dict[str, Any]) -> list[str]:
    errors: list[str] = []

    if packet.get("privacy_status") in {"private_rejected", "needs_redaction"}:
        errors.append("privacy_status blocks evidence-map admission")

    missingness = packet.get("missingness", {})
    if missingness.get("absence_interpreted_as_negative") is not False:
        errors.append("missingness must not be interpreted as negative evidence")

    forbidden = set(packet.get("forbidden_outputs", []))
    missing_forbidden = REQUIRED_FORBIDDEN - forbidden
    if missing_forbidden:
        errors.append(f"forbidden_outputs missing required boundaries: {sorted(missing_forbidden)}")

    observations = packet.get("observations", [])
    observation_ids = {obs.get("observation_id") for obs in observations if isinstance(obs, dict)}
    if not observation_ids:
        errors.append("at least one observation is required")

    for obs in observations:
        if obs.get("not_a_diagnosis_or_treatment") is not True:
            errors.append(f"observation {obs.get('observation_id')} lacks boundary marker")
        if BLOCKED_ADVICE_RE.search(obs.get("text", "")):
            errors.append(f"observation {obs.get('observation_id')} contains advice-like language")

    questions = packet.get("clinician_or_research_questions", [])
    if len(questions) < 2:
        errors.append("at least two question-prep items are required")

    for idx, question in enumerate(questions):
        text = question.get("question", "")
        if BLOCKED_ADVICE_RE.search(text):
            errors.append(f"question {idx} contains advice-like language")
        if question.get("boundary") not in {"question_prep_only", "research_organization_only"}:
            errors.append(f"question {idx} lacks safe boundary")
        linked = set(question.get("linked_observation_ids", []))
        if not linked:
            errors.append(f"question {idx} is not linked to observations")
        elif not linked <= observation_ids:
            errors.append(f"question {idx} links to unknown observations: {sorted(linked - observation_ids)}")

    variables = packet.get("measurable_variables", [])
    if len(variables) < 2:
        errors.append("at least two measurable variables are required")

    return errors


def main(argv: list[str]) -> int:
    fixture_path = Path(argv[1]) if len(argv) > 1 else Path(__file__).with_name("fixtures.synthetic.json")
    packets = load_packets(fixture_path)
    failures = {packet.get("packet_id", "<missing>"): validate_packet(packet) for packet in packets}

    for packet_id, errors in failures.items():
        status = "PASS" if not errors else "FAIL"
        print(f"{status} {packet_id}")
        for error in errors:
            print(f"  - {error}")

    unexpected = []
    for packet in packets:
        packet_id = packet.get("packet_id", "")
        errors = failures[packet_id]
        should_fail = "fail" in packet_id
        if should_fail and not errors:
            unexpected.append(f"{packet_id} should have failed")
        if not should_fail and errors:
            unexpected.append(f"{packet_id} should have passed: {errors}")

    if unexpected:
        print("\nUnexpected validation result:")
        for item in unexpected:
            print(f"  - {item}")
        return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv))
