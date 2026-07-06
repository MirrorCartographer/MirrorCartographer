#!/usr/bin/env python3
"""Validate Mirror Cartographer symbolic-to-operational translation packets.

This gate keeps symbolic language useful for discovery work without allowing it to
become an unsupported claim, private-memory leak, or single-story interpretation.
It intentionally uses only Python standard-library checks so it can run anywhere.
"""

from __future__ import annotations

import json
import sys
from pathlib import Path
from typing import Any

ALLOWED_SOURCE_STATUS = {"synthetic", "public", "deidentified_user_stated", "assistant_inferred"}
ALLOWED_CLAIM_STATUS = {"research_question", "hypothesis", "operational_mapping", "unsupported"}
ALLOWED_PRIVACY_STATUS = {"public_safe", "deidentified", "private_rejected"}
ALLOWED_DOMAINS = {
    "cognition",
    "nervous_system_model",
    "scientific_reasoning",
    "human_ai_sensemaking",
    "animal_care_research_org",
    "medical_evidence_org",
    "privacy_preserving_dataset",
}
ALLOWED_MISSINGNESS = {"none", "unknown", "not_collected", "redacted", "not_applicable"}
ALLOWED_VARIABLE_MISSINGNESS = {"unknown", "not_collected", "redacted", "not_applicable"}

ADVICE_TERMS = {
    "diagnose", "diagnosis", "treat", "treatment", "cure", "dosage", "dose",
    "urgent", "emergency", "prescribe", "medication", "veterinary advice", "medical advice",
}


def _contains_advice_language(value: Any) -> bool:
    text = json.dumps(value, sort_keys=True).lower()
    return any(term in text for term in ADVICE_TERMS)


def validate_packet(packet: dict[str, Any]) -> list[str]:
    errors: list[str] = []

    required = [
        "packet_id", "source_status", "claim_status", "privacy_status",
        "symbolic_input", "operational_translation", "ambiguity_controls",
        "measurable_variables", "missingness", "falsification_route",
        "next_executable_action",
    ]
    for key in required:
        if key not in packet:
            errors.append(f"missing required field: {key}")

    if errors:
        return errors

    if packet["source_status"] not in ALLOWED_SOURCE_STATUS:
        errors.append("invalid source_status")
    if packet["claim_status"] not in ALLOWED_CLAIM_STATUS:
        errors.append("invalid claim_status")
    if packet["privacy_status"] not in ALLOWED_PRIVACY_STATUS:
        errors.append("invalid privacy_status")
    if packet["privacy_status"] == "private_rejected":
        errors.append("private_rejected packets cannot pass public-safe gate")
    if packet["missingness"] not in ALLOWED_MISSINGNESS:
        errors.append("invalid missingness")

    symbolic = packet.get("symbolic_input", {})
    if symbolic.get("domain") not in ALLOWED_DOMAINS:
        errors.append("invalid symbolic domain")
    if not symbolic.get("symbol_label") or not symbolic.get("symbol_phrase"):
        errors.append("symbol label and phrase are required")

    translation = packet.get("operational_translation", {})
    for key in ["observable_behavior", "candidate_mechanism", "nonclaim_boundary"]:
        if not isinstance(translation.get(key), str) or len(translation[key].strip()) < 8:
            errors.append(f"operational_translation.{key} is too weak")

    boundary = translation.get("nonclaim_boundary", "").lower()
    if "not" not in boundary and "research" not in boundary:
        errors.append("nonclaim_boundary must explicitly limit overclaiming")

    ambiguity = packet.get("ambiguity_controls", {})
    alternatives = ambiguity.get("alternative_interpretations", [])
    observations = ambiguity.get("disambiguating_observations", [])
    if not isinstance(alternatives, list) or len(alternatives) < 2:
        errors.append("at least two alternative interpretations are required")
    if not isinstance(observations, list) or len(observations) < 1:
        errors.append("at least one disambiguating observation is required")

    variables = packet.get("measurable_variables", [])
    if not isinstance(variables, list) or len(variables) < 2:
        errors.append("at least two measurable variables are required")
    else:
        names = set()
        for index, variable in enumerate(variables):
            prefix = f"measurable_variables[{index}]"
            for key in ["name", "unit", "collection_method", "allowed_missingness"]:
                if key not in variable:
                    errors.append(f"{prefix} missing {key}")
            name = variable.get("name")
            if name in names:
                errors.append(f"{prefix} duplicate variable name")
            names.add(name)
            if variable.get("allowed_missingness") not in ALLOWED_VARIABLE_MISSINGNESS:
                errors.append(f"{prefix} invalid allowed_missingness")

    if len(str(packet.get("falsification_route", "")).strip()) < 12:
        errors.append("falsification_route is required and must be concrete")
    if len(str(packet.get("next_executable_action", "")).strip()) < 8:
        errors.append("next_executable_action is required")

    if _contains_advice_language(packet):
        boundary_text = json.dumps(translation, sort_keys=True).lower()
        allowed_research_framing = "not" in boundary_text or "research organization" in boundary_text
        if not allowed_research_framing:
            errors.append("advice-like language lacks explicit research/nonclaim boundary")

    return errors


def main() -> int:
    if len(sys.argv) != 2:
        print("usage: validate_symbolic_operational_packets.py <fixtures-or-packet-json>")
        return 2

    path = Path(sys.argv[1])
    data = json.loads(path.read_text())
    cases = data if isinstance(data, list) else [{"case_id": "packet", "should_pass": True, "packet": data}]

    failures = 0
    for case in cases:
        errors = validate_packet(case["packet"])
        passed = not errors
        expected = bool(case.get("should_pass", True))
        if passed != expected:
            failures += 1
            print(f"FAIL {case.get('case_id')}: expected {expected}, got {passed}; errors={errors}")
        else:
            print(f"PASS {case.get('case_id')}: {'valid' if passed else 'rejected as expected'}")

    return 1 if failures else 0


if __name__ == "__main__":
    raise SystemExit(main())
