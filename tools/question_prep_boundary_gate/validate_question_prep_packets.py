#!/usr/bin/env python3
"""Validate MC question-prep boundary packets.

Purpose:
Convert medical/animal-care/scientific observations into research question-prep
infrastructure while rejecting diagnosis, treatment, dosage, emergency-triage,
private-identifier, or certainty-claim leakage.

This is public-safe research organization infrastructure only.
"""

from __future__ import annotations

import json
import re
import sys
from pathlib import Path
from typing import Any

ALLOWED_DOMAINS = {
    "medical_ai_evidence_organization",
    "animal_care_evidence_organization",
    "scientific_reasoning",
    "human_ai_sensemaking",
    "privacy_preserving_longitudinal_data",
}

ALLOWED_SOURCE_STATUS = {
    "synthetic",
    "primary_source_mapped",
    "institutional_source_mapped",
    "literature_grounded",
    "unknown",
}

ALLOWED_CLAIM_STATUS = {
    "hypothesis",
    "test_fixture",
    "validated_in_synthetic",
    "rejected",
    "needs_review",
}

ALLOWED_PRIVACY_STATUS = {
    "public_safe_synthetic",
    "public_safe_deidentified",
    "reject_private_or_identifying",
}

FORBIDDEN_OUTPUTS_REQUIRED = {
    "diagnosis",
    "treatment_plan",
    "dosage",
}

ADVICE_LEAK_PATTERNS = [
    re.compile(r"\b(start|stop|increase|decrease|give|administer|prescribe|treat)\b", re.I),
    re.compile(r"\b(immediately|emergency|urgent|ER|go to the vet now|go to the doctor now)\b", re.I),
    re.compile(r"\bmg\b|\bml\b|\bdose\b|\bdosage\b", re.I),
    re.compile(r"\bdiagnos(e|is|ed)\b", re.I),
    re.compile(r"\bdefinitely\b|\bcertainly\b|\bguarantees?\b|\bcure\b", re.I),
]


def advice_leak_count(packet: dict[str, Any]) -> int:
    text_parts: list[str] = [
        str(packet.get("claim", "")),
        str(packet.get("falsification_route", "")),
    ]
    for question in packet.get("questions", []):
        if isinstance(question, dict):
            text_parts.append(str(question.get("question", "")))
    text = "\n".join(text_parts)
    return sum(1 for pattern in ADVICE_LEAK_PATTERNS if pattern.search(text))


def validate_packet(packet: dict[str, Any]) -> list[str]:
    errors: list[str] = []

    required = [
        "schema_version",
        "packet_id",
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
        "evidence_boundary",
        "questions",
        "prohibited_outputs",
    ]
    for field in required:
        if field not in packet:
            errors.append(f"missing required field: {field}")

    if errors:
        return errors

    if packet["schema_version"] != "1.0.0":
        errors.append("schema_version must be 1.0.0")
    if not re.match(r"^qprep_[a-z0-9_\-]+$", str(packet["packet_id"])):
        errors.append("packet_id must match qprep_[a-z0-9_-]+")
    if packet["domain"] not in ALLOWED_DOMAINS:
        errors.append("domain is not allowed")
    if len(str(packet["claim"])) < 20:
        errors.append("claim must be at least 20 characters")
    if packet["source_status"] not in ALLOWED_SOURCE_STATUS:
        errors.append("source_status is not allowed")
    if packet["claim_status"] not in ALLOWED_CLAIM_STATUS:
        errors.append("claim_status is not allowed")
    if packet["privacy_status"] != "public_safe_synthetic" and packet["privacy_status"] != "public_safe_deidentified":
        errors.append("privacy_status must be public-safe to pass")
    if packet["testability"] not in {"executable", "semi_executable"}:
        errors.append("testability must be executable or semi_executable")
    if len(str(packet["falsification_route"])) < 20:
        errors.append("falsification_route must be explicit")

    missingness = packet.get("missingness", {})
    if not isinstance(missingness, dict):
        errors.append("missingness must be an object")
    else:
        if missingness.get("absence_interpretation_allowed") is not False:
            errors.append("absence_interpretation_allowed must be false")
        if missingness.get("state") not in {"complete_for_synthetic_test", "partial", "unknown", "redacted"}:
            errors.append("missingness.state is not allowed")

    variables = packet.get("measurable_variables", [])
    if not isinstance(variables, list) or not variables:
        errors.append("at least one measurable variable is required")
    else:
        variable_names = set()
        for variable in variables:
            if not isinstance(variable, dict):
                errors.append("each measurable variable must be an object")
                continue
            name = variable.get("name")
            if not isinstance(name, str) or len(name) < 2:
                errors.append("each measurable variable needs a name")
            else:
                variable_names.add(name)
            if variable.get("measurement_type") not in {"count", "boolean", "duration", "ordinal", "categorical", "free_text_bounded"}:
                errors.append(f"variable {name} has invalid measurement_type")
    
    boundary = packet.get("evidence_boundary", {})
    if not isinstance(boundary, dict):
        errors.append("evidence_boundary must be an object")
    else:
        forbidden = set(boundary.get("forbidden_use", []))
        required_forbidden = {"diagnosis", "treatment", "replace_professional_judgment"}
        if not required_forbidden.issubset(forbidden):
            errors.append("evidence_boundary must forbid diagnosis, treatment, and replacement of professional judgment")
        if boundary.get("requires_professional_review") is not True:
            errors.append("requires_professional_review must be true")

    prohibited_outputs = set(packet.get("prohibited_outputs", []))
    if not FORBIDDEN_OUTPUTS_REQUIRED.issubset(prohibited_outputs):
        errors.append("prohibited_outputs must include diagnosis, treatment_plan, and dosage")

    for question in packet.get("questions", []):
        if not isinstance(question, dict):
            errors.append("each question must be an object")
            continue
        if len(str(question.get("question", ""))) < 12:
            errors.append("question text too short")
        linked_variable = question.get("linked_variable")
        if variables and linked_variable not in {v.get("name") for v in variables if isinstance(v, dict)}:
            errors.append(f"question linked_variable not declared: {linked_variable}")

    leaks = advice_leak_count(packet)
    if leaks > 0:
        errors.append(f"advice/certainty leakage detected: {leaks}")

    return errors


def load_packets(path: Path) -> list[dict[str, Any]]:
    data = json.loads(path.read_text(encoding="utf-8"))
    if isinstance(data, dict):
        return [data]
    if isinstance(data, list):
        packets = []
        for item in data:
            if isinstance(item, dict) and "packet" in item:
                packets.append(item["packet"])
            elif isinstance(item, dict):
                packets.append(item)
            else:
                raise ValueError("list entries must be packet objects or fixture objects")
        return packets
    raise ValueError("input must be a packet object or list")


def main(argv: list[str]) -> int:
    if len(argv) != 2:
        print("Usage: validate_question_prep_packets.py <packet-or-fixtures.json>")
        return 2

    packets = load_packets(Path(argv[1]))
    failed = False
    for idx, packet in enumerate(packets):
        errors = validate_packet(packet)
        if errors:
            failed = True
            print(f"packet[{idx}] FAIL")
            for error in errors:
                print(f"  - {error}")
        else:
            print(f"packet[{idx}] PASS")
    return 1 if failed else 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv))
