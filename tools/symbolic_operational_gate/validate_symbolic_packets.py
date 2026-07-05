#!/usr/bin/env python3
"""
Validate Mirror Cartographer symbolic-to-operational packets.

Source status: assistant-generated public-safe implementation.
Claim status: executable validation component for symbolic-to-operational translation.
Privacy status: synthetic/public-safe packets only.
Missingness: not yet wired into CI or reviewer-agreement workflow.
Revision reason: prevent symbolic language from entering discovery memory unless it becomes measurable, bounded, and falsifiable.
Implementation status: runnable CLI validator.
Testability: run `python tools/symbolic_operational_gate/test_validate_symbolic_packets.py`.
Falsification route: fails if unmeasurable, advice-leaking, private, or boundary-free packets pass validation.
Next executable action: connect this validator to MC evidence ingestion before symbolic packets can seed hypotheses.
"""

from __future__ import annotations

import json
import sys
from pathlib import Path
from typing import Any, Dict, List, Tuple

try:
    import jsonschema
except ImportError:  # pragma: no cover
    jsonschema = None

FORBIDDEN_ADVICE_TERMS = {
    "diagnose",
    "diagnosis",
    "treat",
    "treatment",
    "dose",
    "dosage",
    "prescribe",
    "cure",
    "healed",
    "emergency instruction",
    "medical advice",
    "veterinary advice",
}

REQUIRED_BOUNDARY_RISKS_FOR_DOMAINS = {
    "medical_ai_evidence_organization": "medical_or_veterinary_advice_leakage",
    "animal_care_evidence_organization": "medical_or_veterinary_advice_leakage",
}


def load_json(path: Path) -> Any:
    with path.open("r", encoding="utf-8") as handle:
        return json.load(handle)


def text_blob(packet: Dict[str, Any]) -> str:
    return json.dumps(packet, sort_keys=True).lower()


def schema_validate(packet: Dict[str, Any], schema: Dict[str, Any]) -> List[str]:
    if jsonschema is None:
        return [
            "jsonschema package is required for schema validation. Install with: python -m pip install jsonschema"
        ]
    validator = jsonschema.Draft202012Validator(schema)
    errors = []
    for error in sorted(validator.iter_errors(packet), key=lambda e: list(e.path)):
        location = "/".join(str(part) for part in error.path) or "<root>"
        errors.append(f"schema:{location}: {error.message}")
    return errors


def semantic_validate(packet: Dict[str, Any]) -> List[str]:
    errors: List[str] = []
    blob = text_blob(packet)
    domain = packet.get("operational_translation", {}).get("domain")
    risks = set(packet.get("boundary_risks", []))

    if domain in REQUIRED_BOUNDARY_RISKS_FOR_DOMAINS:
        required_risk = REQUIRED_BOUNDARY_RISKS_FOR_DOMAINS[domain]
        if required_risk not in risks:
            errors.append(
                f"semantic:boundary_risks: {domain} packets must include {required_risk}"
            )

    if packet.get("privacy_status") == "synthetic_only" and "private" in blob:
        if "private_detail_leakage" not in risks:
            errors.append(
                "semantic:privacy: packet mentions private content but does not label private_detail_leakage"
            )

    for term in FORBIDDEN_ADVICE_TERMS:
        if term in blob:
            if "medical_or_veterinary_advice_leakage" not in risks:
                errors.append(
                    f"semantic:advice: forbidden advice-like term '{term}' requires advice-leakage risk label"
                )
            if domain in {
                "medical_ai_evidence_organization",
                "animal_care_evidence_organization",
            } and term in {"diagnose", "diagnosis", "treat", "treatment", "dose", "dosage", "prescribe"}:
                errors.append(
                    f"semantic:advice: advice-like term '{term}' is not allowed in medical/animal-care research organization packets"
                )

    variables = packet.get("measurable_variables", [])
    variable_names = [var.get("name", "") for var in variables if isinstance(var, dict)]
    if len(variable_names) != len(set(variable_names)):
        errors.append("semantic:variables: measurable variable names must be unique")

    falsification_route = packet.get("falsification_route", "").lower()
    if "fail" not in falsification_route and "falsif" not in falsification_route:
        errors.append(
            "semantic:falsification_route: must explicitly describe failure or falsification conditions"
        )

    non_literal_boundary = packet.get("operational_translation", {}).get(
        "non_literal_boundary", ""
    ).lower()
    if not any(token in non_literal_boundary for token in ["not literal", "not treated as", "must not", "not a literal"]):
        errors.append(
            "semantic:non_literal_boundary: must explicitly prevent literalizing the symbol"
        )

    return errors


def validate_packet(packet: Dict[str, Any], schema: Dict[str, Any]) -> Tuple[bool, List[str]]:
    errors = schema_validate(packet, schema)
    if not errors:
        errors.extend(semantic_validate(packet))
    return len(errors) == 0, errors


def validate_fixture_file(fixtures_path: Path, schema_path: Path) -> int:
    schema = load_json(schema_path)
    fixture_doc = load_json(fixtures_path)
    failures = 0
    results = []

    for fixture in fixture_doc.get("fixtures", []):
        name = fixture.get("name", "<unnamed>")
        expected = fixture.get("expected_classification")
        packet = fixture.get("packet", {})
        valid, errors = validate_packet(packet, schema)
        observed = "valid" if valid else "invalid"
        passed = observed == expected
        if not passed:
            failures += 1
        results.append(
            {
                "fixture": name,
                "expected": expected,
                "observed": observed,
                "passed": passed,
                "errors": errors,
            }
        )

    print(json.dumps({"results": results, "failure_count": failures}, indent=2))
    return 1 if failures else 0


def main(argv: List[str]) -> int:
    base = Path(__file__).resolve().parent
    if len(argv) == 1:
        fixtures_path = base / "fixtures.synthetic.json"
    elif len(argv) == 2:
        fixtures_path = Path(argv[1])
    else:
        print("Usage: validate_symbolic_packets.py [fixtures.json]", file=sys.stderr)
        return 2

    schema_path = base / "symbolic_packet_schema.json"
    return validate_fixture_file(fixtures_path, schema_path)


if __name__ == "__main__":
    raise SystemExit(main(sys.argv))
