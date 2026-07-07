#!/usr/bin/env python3
"""Validate public-safe outcome measure dictionaries for Mirror Cartographer.

This tool is research-organization infrastructure only. It is not medical advice,
veterinary advice, diagnosis, treatment guidance, or proof of cure.
"""

from __future__ import annotations

import argparse
import json
import re
import sys
from pathlib import Path
from typing import Any, Dict, List

REQUIRED_FIELDS = [
    "measure_id",
    "domain",
    "label",
    "unit",
    "directionality",
    "collection_method",
    "source_status",
    "claim_status",
    "privacy_status",
    "missingness",
]

ALLOWED_DIRECTIONS = {"higher_is_more", "higher_is_less", "neutral"}
SAFE_CLAIM_STATUSES = {"measurement_definition", "observation", "hypothesis"}
UNSAFE_WORDS = re.compile(
    r"\b(cure|cured|guarantee|diagnose|diagnosis|treat|treatment|prescribe|advice|proof)\b",
    re.IGNORECASE,
)
IDENTIFIER_PATTERNS = [
    re.compile(r"\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b", re.IGNORECASE),
    re.compile(r"\b\d{3}[-.]\d{3}[-.]\d{4}\b"),
    re.compile(r"\b\d{1,5}\s+[A-Za-z0-9 .'-]+\s+(Street|St|Road|Rd|Avenue|Ave|Lane|Ln|Drive|Dr)\b", re.IGNORECASE),
]


def has_text(value: Any) -> bool:
    return isinstance(value, str) and bool(value.strip())


def has_direct_identifier(measure: Dict[str, Any]) -> bool:
    joined = " ".join(str(measure.get(field, "")) for field in ["label", "description", "collection_method"])
    return any(pattern.search(joined) for pattern in IDENTIFIER_PATTERNS)


def has_numeric_scale(measure: Dict[str, Any]) -> bool:
    return isinstance(measure.get("scale_min"), (int, float)) and isinstance(measure.get("scale_max"), (int, float)) and measure["scale_min"] < measure["scale_max"]


def has_allowed_values(measure: Dict[str, Any]) -> bool:
    values = measure.get("allowed_values")
    return isinstance(values, list) and len(values) > 0 and all(isinstance(v, (str, int, float, bool)) for v in values)


def route_measure(measure: Dict[str, Any]) -> Dict[str, Any]:
    blockers: List[str] = []
    missing_fields = [field for field in REQUIRED_FIELDS if field not in measure]

    if missing_fields:
        return build_route(measure, "missingness_blocked", missing_fields, ["missing_required_fields"], "Required fields are absent.")

    missingness = measure.get("missingness")
    if not isinstance(missingness, list):
        return build_route(measure, "missingness_blocked", [], ["missingness_not_array"], "Missingness must be an explicit array.")
    if missingness:
        return build_route(measure, "missingness_blocked", [], list(missingness), "Measure carries unresolved missingness.")

    if measure.get("privacy_status") != "public_safe" or has_direct_identifier(measure):
        return build_route(measure, "privacy_blocked", [], ["privacy_not_public_safe"], "Measure contains private residue or a non-public privacy status.")

    text_for_claim = " ".join(str(measure.get(field, "")) for field in ["label", "description", "claim_status"])
    if measure.get("claim_status") not in SAFE_CLAIM_STATUSES or UNSAFE_WORDS.search(text_for_claim):
        return build_route(measure, "claim_blocked", [], ["unsafe_claim_framing"], "Measure contains advice, diagnosis, treatment, cure, proof, or overclaim language.")

    if measure.get("directionality") not in ALLOWED_DIRECTIONS:
        blockers.append("invalid_directionality")
    if not has_text(measure.get("label")):
        blockers.append("missing_label")
    if not has_text(measure.get("unit")):
        blockers.append("missing_unit")
    if not has_text(measure.get("collection_method")):
        blockers.append("missing_collection_method")
    if not (has_numeric_scale(measure) or has_allowed_values(measure)):
        blockers.append("missing_scale_or_allowed_values")

    if blockers:
        return build_route(measure, "needs_operational_definition", [], blockers, "Measure lacks a bounded operational definition.")

    return build_route(
        measure,
        "accepted_measure",
        [],
        [],
        "Measure has bounded scale, unit, directionality, collection method, and public-safe labels.",
    )


def build_route(measure: Dict[str, Any], route: str, missing_fields: List[str], blockers: List[str], reason: str) -> Dict[str, Any]:
    return {
        "measure_id": measure.get("measure_id", "unknown_measure"),
        "route": route,
        "missing_fields": missing_fields,
        "blockers": blockers,
        "source_status": measure.get("source_status", "unknown"),
        "claim_status": measure.get("claim_status", "unknown"),
        "privacy_status": measure.get("privacy_status", "unknown"),
        "missingness": measure.get("missingness", ["missingness_absent"]),
        "revision_reason": reason,
        "implementation_status": "executable_cli",
        "testability": "python tools/outcome_measure_dictionary_validator/test_validate_outcome_measure_dictionary.py",
        "next_executable_action": next_action(route),
    }


def next_action(route: str) -> str:
    return {
        "accepted_measure": "Use as an allowed variable in observation streams and effect-window comparison.",
        "needs_operational_definition": "Add unit, bounds, directionality, and collection protocol before longitudinal use.",
        "privacy_blocked": "Redact or replace private residue before reuse.",
        "claim_blocked": "Rewrite as measurement definition without advice, diagnosis, treatment, cure, proof, or certainty language.",
        "missingness_blocked": "Resolve missing required fields or missingness labels before reuse.",
    }.get(route, "Route to manual review.")


def evaluate(measures: List[Dict[str, Any]]) -> Dict[str, Any]:
    routes = [route_measure(measure) for measure in measures]
    summary: Dict[str, int] = {}
    for item in routes:
        summary[item["route"]] = summary.get(item["route"], 0) + 1
    return {
        "component": "outcome_measure_dictionary_validator",
        "summary": summary,
        "measure_routes": routes,
    }


def load_input(path: Path) -> List[Dict[str, Any]]:
    data = json.loads(path.read_text(encoding="utf-8"))
    if not isinstance(data, list):
        raise ValueError("Input must be a JSON array of measure definitions.")
    if not all(isinstance(item, dict) for item in data):
        raise ValueError("Every measure definition must be a JSON object.")
    return data


def main(argv: List[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description="Validate public-safe Mirror Cartographer outcome measure dictionaries.")
    parser.add_argument("input", type=Path, help="Path to outcome measure dictionary JSON file.")
    parser.add_argument("--output", type=Path, help="Optional path for JSON output.")
    args = parser.parse_args(argv)

    try:
        result = evaluate(load_input(args.input))
    except Exception as exc:  # deterministic CLI failure surface
        print(json.dumps({"component": "outcome_measure_dictionary_validator", "error": str(exc)}, indent=2), file=sys.stderr)
        return 2

    text = json.dumps(result, indent=2, sort_keys=True)
    if args.output:
        args.output.write_text(text + "\n", encoding="utf-8")
    else:
        print(text)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
