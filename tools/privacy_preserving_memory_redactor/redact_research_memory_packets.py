#!/usr/bin/env python3
"""
Privacy Preserving Memory Redactor for Mirror Cartographer.

This CLI converts candidate research-memory packets into public-safe memory-ready,
private-review, or boundary-review routes. It is intentionally dependency-free so
it can run in simple CI and local environments.
"""

from __future__ import annotations

import argparse
import json
import re
import sys
from pathlib import Path
from typing import Any, Dict, Iterable, List, Tuple

COMPONENT = "privacy_preserving_memory_redactor"

REQUIRED_FIELDS = {
    "packet_id",
    "domain",
    "source_status",
    "claim_status",
    "privacy_status",
    "text",
    "missingness",
    "revision_reason",
}

BOUNDED_CLAIM_STATUSES = {
    "observation_only",
    "bounded_summary",
    "bounded_hypothesis",
    "needs_review",
    "unverified",
}

PUBLIC_SAFE_PRIVACY_STATUSES = {
    "synthetic",
    "synthetic_public_safe",
    "public_safe",
    "redacted_public_safe",
}

IDENTIFIER_PATTERNS: List[Tuple[str, re.Pattern[str], str]] = [
    (
        "email_address",
        re.compile(r"\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b", re.IGNORECASE),
        "[REDACTED_EMAIL]",
    ),
    (
        "phone_like_contact",
        re.compile(r"(?<!\d)(?:\+?1[-.\s]?)?(?:\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4})(?!\d)"),
        "[REDACTED_PHONE]",
    ),
    (
        "street_address_like_phrase",
        re.compile(r"\b\d{1,6}\s+[A-Z][A-Za-z0-9.'-]*(?:\s+[A-Z][A-Za-z0-9.'-]*){0,4}\s+(?:Street|St|Avenue|Ave|Road|Rd|Drive|Dr|Lane|Ln|Court|Ct|Boulevard|Blvd)\b", re.IGNORECASE),
        "[REDACTED_ADDRESS]",
    ),
    (
        "exact_date_of_birth",
        re.compile(r"\b(?:date of birth|dob|born)\s*[:\-]?\s*\d{4}-\d{2}-\d{2}\b", re.IGNORECASE),
        "[REDACTED_DOB]",
    ),
    (
        "full_name_marker",
        re.compile(r"\bfull name marker\s+[A-Z][A-Za-z'-]+(?:\s+[A-Z][A-Za-z'-]+){1,4}\b", re.IGNORECASE),
        "[REDACTED_FULL_NAME]",
    ),
    (
        "private_relay_address",
        re.compile(r"\b[A-Z0-9._%+-]+@privaterelay\.appleid\.com\b", re.IGNORECASE),
        "[REDACTED_PRIVATE_RELAY]",
    ),
]

BOUNDARY_TERMS: List[Tuple[str, re.Pattern[str]]] = [
    ("diagnosis_language", re.compile(r"\bdiagnos(?:e|is|ed|ing)\b", re.IGNORECASE)),
    ("treatment_language", re.compile(r"\btreat(?:s|ed|ing|ment)?\b", re.IGNORECASE)),
    ("cure_certainty", re.compile(r"\b(?:cure|cured|healed|heals)\b", re.IGNORECASE)),
    ("directive_medical_language", re.compile(r"\bshould\s+take\b", re.IGNORECASE)),
    ("medical_advice_phrase", re.compile(r"\bmedical advice\b", re.IGNORECASE)),
    ("veterinary_advice_phrase", re.compile(r"\bveterinary advice\b", re.IGNORECASE)),
]


def load_packets(path: Path) -> List[Dict[str, Any]]:
    try:
        data = json.loads(path.read_text(encoding="utf-8"))
    except json.JSONDecodeError as exc:
        raise SystemExit(f"Invalid JSON: {exc}") from exc
    if not isinstance(data, list):
        raise SystemExit("Input must be a JSON array of packet objects.")
    return data


def require_shape(packet: Dict[str, Any]) -> List[str]:
    missing = sorted(REQUIRED_FIELDS - set(packet))
    risks = [f"missing_required_field:{field}" for field in missing]
    if "missingness" in packet and not isinstance(packet["missingness"], list):
        risks.append("missingness_not_array")
    if "missingness" in packet and isinstance(packet["missingness"], list) and not packet["missingness"]:
        risks.append("missingness_empty")
    if "text" in packet and not isinstance(packet["text"], str):
        risks.append("text_not_string")
    return risks


def redact_identifiers(text: str) -> Tuple[str, List[str]]:
    redacted = text
    risks: List[str] = []
    # Specific private relay first would be hidden by email; run all and retain all risk classes.
    for risk_name, pattern, replacement in IDENTIFIER_PATTERNS:
        if pattern.search(redacted) or pattern.search(text):
            risks.append(risk_name)
        redacted = pattern.sub(replacement, redacted)
    return redacted, sorted(set(risks))


def detect_boundary_risks(text: str) -> List[str]:
    return sorted({risk for risk, pattern in BOUNDARY_TERMS if pattern.search(text)})


def normalize_packet(packet: Dict[str, Any]) -> Dict[str, Any]:
    packet_id = str(packet.get("packet_id", "unknown_packet"))
    text = packet.get("text", "") if isinstance(packet.get("text", ""), str) else ""
    shape_risks = require_shape(packet)
    redacted_text, identifier_risks = redact_identifiers(text)
    boundary_risks = detect_boundary_risks(text)

    claim_status = str(packet.get("claim_status", "missing_claim_status"))
    privacy_status = str(packet.get("privacy_status", "missing_privacy_status"))
    source_status = str(packet.get("source_status", "missing_source_status"))
    revision_reason = str(packet.get("revision_reason", "missing_revision_reason"))
    missingness = packet.get("missingness", []) if isinstance(packet.get("missingness", []), list) else []

    detected_risks = sorted(set(shape_risks + identifier_risks + boundary_risks))

    if shape_risks or identifier_risks or privacy_status not in PUBLIC_SAFE_PRIVACY_STATUSES:
        route = "private_review_required"
        severity = "block"
        normalized_privacy = "redacted_private_review_required" if identifier_risks else privacy_status
    elif boundary_risks or claim_status not in BOUNDED_CLAIM_STATUSES:
        route = "boundary_review_required"
        severity = "warn"
        normalized_privacy = privacy_status
    else:
        route = "memory_ready"
        severity = "pass"
        normalized_privacy = "redacted_public_safe" if redacted_text != text else privacy_status

    return {
        "packet_id": packet_id,
        "domain": packet.get("domain", "missing_domain"),
        "route": route,
        "severity": severity,
        "redacted_text": redacted_text,
        "detected_risks": detected_risks,
        "source_status": source_status,
        "claim_status": claim_status,
        "privacy_status": normalized_privacy,
        "missingness": missingness,
        "revision_reason": revision_reason,
        "implementation_status": "executable_cli_normalizer",
        "testability": "python tools/privacy_preserving_memory_redactor/test_redact_research_memory_packets.py",
        "next_executable_action": next_action(route),
    }


def next_action(route: str) -> str:
    if route == "memory_ready":
        return "admit to public-safe research memory or downstream evidence mapping"
    if route == "boundary_review_required":
        return "send through claim boundary normalizer and falsification runner before reuse"
    return "keep out of public memory until identifiers and private residue are manually reviewed"


def summarize(packets: Iterable[Dict[str, Any]]) -> Dict[str, Any]:
    summary = {
        "total": 0,
        "routes": {},
        "severities": {},
    }
    for packet in packets:
        summary["total"] += 1
        summary["routes"][packet["route"]] = summary["routes"].get(packet["route"], 0) + 1
        summary["severities"][packet["severity"]] = summary["severities"].get(packet["severity"], 0) + 1
    return summary


def run(input_path: Path) -> Dict[str, Any]:
    normalized = [normalize_packet(packet) for packet in load_packets(input_path)]
    return {
        "component": COMPONENT,
        "source_status": "assistant_generated_public_safe_component",
        "claim_status": "privacy_preserving_research_memory_gate_not_medical_or_veterinary_advice",
        "privacy_status": "redacts_or_blocks_private_residue_before_public_reuse",
        "missingness": "requires explicit missingness array on every packet",
        "revision_reason": "prevent private residue and cure/advice overclaims from entering longitudinal research memory",
        "implementation_status": "executable_cli_with_fixtures_and_tests",
        "testability": "python tools/privacy_preserving_memory_redactor/test_redact_research_memory_packets.py",
        "next_executable_action": "wire before retrieval, collaborator export, and hypothesis generation",
        "summary": summarize(normalized),
        "packets": normalized,
    }


def main(argv: List[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description="Redact and route MC research-memory packets.")
    parser.add_argument("input", type=Path, help="Path to JSON packet array")
    parser.add_argument("--out", type=Path, help="Optional output JSON path")
    args = parser.parse_args(argv)

    result = run(args.input)
    rendered = json.dumps(result, indent=2, sort_keys=True)
    if args.out:
        args.out.write_text(rendered + "\n", encoding="utf-8")
    else:
        print(rendered)
    return 0


if __name__ == "__main__":
    sys.exit(main())
