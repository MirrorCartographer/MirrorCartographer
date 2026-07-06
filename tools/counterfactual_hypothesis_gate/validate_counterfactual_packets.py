#!/usr/bin/env python3
"""Validate Mirror Cartographer counterfactual hypothesis packets.

This tool is public-safe discovery infrastructure. It does not provide medical,
veterinary, or treatment advice. It checks whether a candidate hypothesis packet
contains enough alternative-explanation structure to support falsifiable research
organization.
"""

from __future__ import annotations

import json
import re
import sys
from pathlib import Path
from typing import Any, Dict, List, Tuple

ALLOWED_DOMAINS = {
    "cure_discovery_infrastructure",
    "medical_ai_evidence_organization",
    "scientific_reasoning",
    "nervous_system_cognition_models",
    "animal_care_evidence_maps",
    "human_ai_sensemaking",
    "privacy_preserving_longitudinal_datasets",
    "symbolic_to_operational_translation",
}

ALLOWED_SOURCE_STATUS = {"synthetic", "public_primary", "public_secondary", "mixed_public", "unknown"}
ALLOWED_CLAIM_STATUS = {"hypothesis", "test_fixture", "validated", "rejected", "needs_revision"}
ALLOWED_PRIVACY_STATUS = {"public_safe", "deidentified", "reject_private"}
ALLOWED_MISSINGNESS = {"none_known", "declared", "unknown"}
ALLOWED_IMPLEMENTATION_STATUS = {"fixture_only", "validator_ready", "ci_ready"}
ALLOWED_DIRECTIONS = {"increase", "decrease", "change", "no_change", "unknown"}

PRIVATE_PATTERNS = [
    re.compile(r"\b\d{3}-\d{2}-\d{4}\b"),
    re.compile(r"\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b", re.I),
    re.compile(r"\b\d{3}[-. ]\d{3}[-. ]\d{4}\b"),
]

ADVICE_TERMS = {
    "diagnose",
    "diagnosis",
    "treat",
    "treatment",
    "dose",
    "dosage",
    "prescribe",
    "cure this patient",
    "cure this animal",
    "emergency",
    "urgent care",
}


def _text_values(value: Any) -> List[str]:
    if isinstance(value, str):
        return [value]
    if isinstance(value, list):
        out: List[str] = []
        for item in value:
            out.extend(_text_values(item))
        return out
    if isinstance(value, dict):
        out = []
        for item in value.values():
            out.extend(_text_values(item))
        return out
    return []


def validate_packet(packet: Dict[str, Any]) -> Tuple[bool, List[str]]:
    errors: List[str] = []

    required = [
        "packet_id",
        "schema_version",
        "hypothesis_claim",
        "domain",
        "source_status",
        "claim_status",
        "privacy_status",
        "missingness",
        "revision_reason",
        "measurable_variables",
        "primary_explanation",
        "alternative_explanations",
        "discriminating_tests",
        "falsification_route",
        "implementation_status",
    ]
    for key in required:
        if key not in packet:
            errors.append(f"missing required field: {key}")

    if errors:
        return False, errors

    if packet["schema_version"] != "1.0.0":
        errors.append("schema_version must be 1.0.0")
    if not re.match(r"^cfhg_[a-z0-9_\-]+$", str(packet["packet_id"])):
        errors.append("packet_id must start with cfhg_ and use lowercase safe characters")
    if packet["domain"] not in ALLOWED_DOMAINS:
        errors.append("domain is not allowed")
    if packet["source_status"] not in ALLOWED_SOURCE_STATUS:
        errors.append("source_status is not allowed")
    if packet["claim_status"] not in ALLOWED_CLAIM_STATUS:
        errors.append("claim_status is not allowed")
    if packet["privacy_status"] not in ALLOWED_PRIVACY_STATUS:
        errors.append("privacy_status is not allowed")
    if packet["privacy_status"] == "reject_private":
        errors.append("privacy_status rejects public discovery-memory admission")
    if packet["implementation_status"] not in ALLOWED_IMPLEMENTATION_STATUS:
        errors.append("implementation_status is not allowed")

    missingness = packet.get("missingness", {})
    if not isinstance(missingness, dict):
        errors.append("missingness must be an object")
    else:
        if missingness.get("status") not in ALLOWED_MISSINGNESS:
            errors.append("missingness.status is not allowed")
        if "known_gaps" not in missingness or not isinstance(missingness.get("known_gaps"), list):
            errors.append("missingness.known_gaps must be a list")

    variables = packet.get("measurable_variables", [])
    if not isinstance(variables, list) or len(variables) < 2:
        errors.append("at least two measurable_variables are required")
    else:
        for index, variable in enumerate(variables):
            if not isinstance(variable, dict):
                errors.append(f"measurable_variables[{index}] must be an object")
                continue
            if not variable.get("name"):
                errors.append(f"measurable_variables[{index}].name is required")
            if len(str(variable.get("measurement_method", ""))) < 8:
                errors.append(f"measurable_variables[{index}].measurement_method is too short")
            if variable.get("expected_direction") not in ALLOWED_DIRECTIONS:
                errors.append(f"measurable_variables[{index}].expected_direction is not allowed")

    primary = packet.get("primary_explanation", {})
    if not isinstance(primary, dict):
        errors.append("primary_explanation must be an object")
    else:
        if len(str(primary.get("statement", ""))) < 20:
            errors.append("primary_explanation.statement is too short")
        if len(str(primary.get("support_boundary", ""))) < 10:
            errors.append("primary_explanation.support_boundary is too short")

    alternatives = packet.get("alternative_explanations", [])
    if not isinstance(alternatives, list) or len(alternatives) < 2:
        errors.append("at least two alternative_explanations are required")
    else:
        primary_statement = str(primary.get("statement", "")).strip().lower()
        for index, alt in enumerate(alternatives):
            if not isinstance(alt, dict):
                errors.append(f"alternative_explanations[{index}] must be an object")
                continue
            statement = str(alt.get("statement", "")).strip()
            if len(statement) < 15:
                errors.append(f"alternative_explanations[{index}].statement is too short")
            if statement.lower() == primary_statement:
                errors.append(f"alternative_explanations[{index}] duplicates the primary explanation")
            if len(str(alt.get("why_plausible", ""))) < 10:
                errors.append(f"alternative_explanations[{index}].why_plausible is too short")
            if len(str(alt.get("what_would_distinguish_it", ""))) < 10:
                errors.append(f"alternative_explanations[{index}].what_would_distinguish_it is too short")

    tests = packet.get("discriminating_tests", [])
    variable_names = {str(v.get("name")) for v in variables if isinstance(v, dict)}
    if not isinstance(tests, list) or len(tests) < 1:
        errors.append("at least one discriminating_tests entry is required")
    else:
        for index, test in enumerate(tests):
            if not isinstance(test, dict):
                errors.append(f"discriminating_tests[{index}] must be an object")
                continue
            if len(str(test.get("test_name", ""))) < 3:
                errors.append(f"discriminating_tests[{index}].test_name is too short")
            if test.get("variable") not in variable_names:
                errors.append(f"discriminating_tests[{index}].variable must reference a measurable variable")
            if len(str(test.get("passing_pattern", ""))) < 8:
                errors.append(f"discriminating_tests[{index}].passing_pattern is too short")
            if len(str(test.get("failing_pattern", ""))) < 8:
                errors.append(f"discriminating_tests[{index}].failing_pattern is too short")
            if str(test.get("passing_pattern", "")).lower() == str(test.get("failing_pattern", "")).lower():
                errors.append(f"discriminating_tests[{index}] has identical pass and fail patterns")

    if len(str(packet.get("falsification_route", ""))) < 20:
        errors.append("falsification_route is too short")

    all_text = "\n".join(_text_values(packet))
    for pattern in PRIVATE_PATTERNS:
        if pattern.search(all_text):
            errors.append("packet contains a direct private identifier pattern")
            break

    lowered = all_text.lower()
    for term in ADVICE_TERMS:
        if term in lowered:
            errors.append(f"packet contains advice-like term: {term}")
            break

    return not errors, errors


def load_cases(path: Path) -> List[Dict[str, Any]]:
    with path.open("r", encoding="utf-8") as handle:
        data = json.load(handle)
    if isinstance(data, list):
        return data
    if isinstance(data, dict) and "packet" in data:
        return [{"case_id": data.get("packet_id", "single_packet"), "expected_valid": True, "packet": data}]
    raise ValueError("Input must be a fixture list or a single packet object")


def main(argv: List[str]) -> int:
    if len(argv) != 2:
        print("Usage: validate_counterfactual_packets.py <fixtures-or-packet.json>")
        return 2

    cases = load_cases(Path(argv[1]))
    failed = 0
    results = []
    for case in cases:
        is_valid, errors = validate_packet(case["packet"])
        expected = bool(case.get("expected_valid", True))
        ok = is_valid == expected
        if not ok:
            failed += 1
        results.append({
            "case_id": case.get("case_id", "unnamed"),
            "expected_valid": expected,
            "actual_valid": is_valid,
            "ok": ok,
            "errors": errors,
        })

    print(json.dumps({"failed": failed, "results": results}, indent=2))
    return 1 if failed else 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv))
