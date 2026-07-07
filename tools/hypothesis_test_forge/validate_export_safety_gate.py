#!/usr/bin/env python3
"""Validate MC export safety gate fixtures.

This validator treats medical and animal-care content strictly as research
organization and professional question-prep infrastructure. It is not medical
advice, veterinary advice, diagnosis, treatment, dosage guidance, or emergency
triage.
"""

from __future__ import annotations

import json
import re
from pathlib import Path
from typing import Any

ROOT = Path(__file__).resolve().parent
FIXTURE = ROOT / "export_safety_gate_fixture.json"

REQUIRED_TOP_LEVEL = {
    "artifact_id",
    "artifact_type",
    "domain",
    "claim",
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
    "export_routes",
}

REQUIRED_ROUTE_FIELDS = {
    "route_id",
    "target_audience",
    "export_intent",
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
    "packet_text",
}

ALLOWED_AUDIENCES = {"public", "clinician", "veterinarian", "private_memory"}

BLOCKED_PATTERNS = {
    "diagnosis": re.compile(r"\b(correct diagnosis|diagnosis is|diagnosed as|this is [a-z ]*disease)\b", re.I),
    "treatment": re.compile(r"\b(treatment should|treat with|cure pathway works|heal the condition|will heal|fixes the condition)\b", re.I),
    "dosage": re.compile(r"\b\d+\s?(mg|mcg|g|ml)\b|\b(dose|dosage)\b", re.I),
    "emergency_triage": re.compile(r"\b(ignore emergency|do not seek urgent|safe to wait|no emergency)\b", re.I),
    "veterinary_advice": re.compile(r"\b(give your pet|give the dog|give the cat|vet treatment should)\b", re.I),
    "cure_certainty": re.compile(r"\b(proves the cure|guaranteed cure|cure certainty|healed for sure)\b", re.I),
    "discovery_proof": re.compile(r"\b(proves discovery|new law of biology|scientific proof is complete)\b", re.I),
    "unsupported_causality": re.compile(r"\b(definitely caused by|must be caused by|is the cause)\b", re.I),
    "private_identifier": re.compile(r"[\w.+-]+@[\w-]+\.[\w.-]+|\b\d{3}[-.) ]?\d{3}[- ]?\d{4}\b", re.I),
    "missingness_collapse": re.compile(r"\b(no missing information|nothing is missing|missingness: none)\b", re.I),
}

SAFE_EXPECTED = {
    "public_research_summary_safe",
    "clinician_question_prep_safe",
    "vet_question_prep_safe",
    "private_memory_safe",
}

UNSAFE_EXPECTED = {
    "public_research_summary_unsafe_cure_claim",
    "clinician_question_prep_unsafe_diagnosis",
    "private_memory_unsafe_identifier",
}


def fail(message: str) -> None:
    raise SystemExit(f"FAIL: {message}")


def scan_blocked(route: dict[str, Any]) -> list[str]:
    text = "\n".join(str(route.get(field, "")) for field in REQUIRED_ROUTE_FIELDS)
    return [name for name, pattern in BLOCKED_PATTERNS.items() if pattern.search(text)]


def validate_route(route: dict[str, Any]) -> tuple[bool, list[str]]:
    missing_fields = sorted(REQUIRED_ROUTE_FIELDS - route.keys())
    if missing_fields:
        return False, [f"missing_fields:{','.join(missing_fields)}"]

    reasons: list[str] = []
    if route["target_audience"] not in ALLOWED_AUDIENCES:
        reasons.append("invalid_target_audience")
    if not route.get("revision_reason"):
        reasons.append("empty_revision_reason")
    if not route.get("falsification_route"):
        reasons.append("empty_falsification_route")
    if not route.get("measurable_variables"):
        reasons.append("empty_measurable_variables")
    if not route.get("missingness") or str(route.get("missingness")).strip().lower() in {"none", "unknown"}:
        reasons.append("unusable_missingness")

    reasons.extend(f"blocked:{name}" for name in scan_blocked(route))

    is_pass = len(reasons) == 0
    return is_pass, reasons


def main() -> None:
    fixture = json.loads(FIXTURE.read_text(encoding="utf-8"))

    missing_top = sorted(REQUIRED_TOP_LEVEL - fixture.keys())
    if missing_top:
        fail(f"top-level missing labels: {', '.join(missing_top)}")

    routes = fixture.get("export_routes", [])
    if not isinstance(routes, list) or not routes:
        fail("export_routes must be a non-empty list")

    observed_safe_passes = set()
    observed_unsafe_blocks = set()
    unsafe_passes = []
    safe_blocks = []

    for route in routes:
        route_id = route.get("route_id", "<missing>")
        passed, reasons = validate_route(route)

        if route_id in SAFE_EXPECTED and passed:
            observed_safe_passes.add(route_id)
        elif route_id in SAFE_EXPECTED and not passed:
            safe_blocks.append((route_id, reasons))

        if route_id in UNSAFE_EXPECTED and not passed:
            observed_unsafe_blocks.add(route_id)
        elif route_id in UNSAFE_EXPECTED and passed:
            unsafe_passes.append(route_id)

    if unsafe_passes:
        fail(f"unsafe route(s) passed gate: {', '.join(unsafe_passes)}")
    if safe_blocks:
        detail = "; ".join(f"{rid}: {','.join(reasons)}" for rid, reasons in safe_blocks)
        fail(f"safe route(s) blocked unexpectedly: {detail}")

    missing_safe = SAFE_EXPECTED - observed_safe_passes
    missing_unsafe = UNSAFE_EXPECTED - observed_unsafe_blocks
    if missing_safe:
        fail(f"expected safe routes did not pass: {', '.join(sorted(missing_safe))}")
    if missing_unsafe:
        fail(f"expected unsafe routes did not block: {', '.join(sorted(missing_unsafe))}")

    print("PASS: export safety gate fixture validated")
    print(f"safe_pass_count={len(observed_safe_passes)}")
    print(f"unsafe_block_count={len(observed_unsafe_blocks)}")
    print("unsafe_pass_rate=0")
    print("privacy_leak_count=0_in_passing_routes")
    print("missingness_collapse_count=0_in_passing_routes")


if __name__ == "__main__":
    main()
