#!/usr/bin/env python3
"""Score Mirror Cartographer collaboration-readiness packets.

This gate is for public-safe discovery infrastructure. It blocks outreach or
collaboration packets that leak private identifiers, blur source status with
claim status, omit artifacts, lack falsification, or turn medical/veterinary
research organization into advice.
"""

from __future__ import annotations

import argparse
import json
import re
import sys
from pathlib import Path
from typing import Any

ALLOWED_TARGET_TYPES = {
    "research_lab",
    "clinical_research_group",
    "veterinary_research_group",
    "grant_program",
    "benchmark_program",
    "open_source_project",
    "dataset_steward",
    "hci_group",
}
ALLOWED_SOURCE_STATUS = {"public", "preprint", "institutional", "synthetic", "mixed_public"}
ALLOWED_CLAIM_STATUS = {"hypothesis_only", "observational", "inconclusive", "supported", "contradicted"}
ALLOWED_PRIVACY_STATUS = {"public_safe", "synthetic_only", "deidentified_public"}
PRIVATE_PATTERNS = [
    re.compile(r"[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}"),
    re.compile(r"\b\d{3}[-.]\d{3}[-.]\d{4}\b"),
    re.compile(r"\b\d{3}-\d{2}-\d{4}\b"),
]
ADVICE_TERMS = {
    "diagnose",
    "treat",
    "prescribe",
    "dose",
    "dosage",
    "cure this patient",
    "cure this animal",
}


def _flatten_strings(value: Any) -> list[str]:
    if isinstance(value, str):
        return [value]
    if isinstance(value, list):
        out: list[str] = []
        for item in value:
            out.extend(_flatten_strings(item))
        return out
    if isinstance(value, dict):
        out: list[str] = []
        for item in value.values():
            out.extend(_flatten_strings(item))
        return out
    return []


def _has_private_identifier(packet: dict[str, Any]) -> bool:
    text = "\n".join(_flatten_strings(packet))
    return any(pattern.search(text) for pattern in PRIVATE_PATTERNS)


def _has_advice_leak(packet: dict[str, Any]) -> bool:
    boundary = str(packet.get("medical_or_veterinary_boundary", "")).lower()
    return any(term in boundary for term in ADVICE_TERMS)


def score_packet(packet: dict[str, Any]) -> dict[str, Any]:
    errors: list[str] = []
    warnings: list[str] = []

    if not isinstance(packet.get("packet_id"), str) or not packet["packet_id"].startswith("crg_"):
        errors.append("packet_id must start with crg_")
    if packet.get("target_type") not in ALLOWED_TARGET_TYPES:
        errors.append("target_type is not allowed")
    if not isinstance(packet.get("target_name_public"), str) or len(packet["target_name_public"]) < 4:
        errors.append("target_name_public is required")
    if packet.get("source_status") not in ALLOWED_SOURCE_STATUS:
        errors.append("source_status is not allowed")
    if packet.get("claim_status") not in ALLOWED_CLAIM_STATUS:
        errors.append("claim_status is not allowed")
    if packet.get("privacy_status") not in ALLOWED_PRIVACY_STATUS:
        errors.append("privacy_status is not allowed")

    evidence_basis = packet.get("evidence_basis")
    if not isinstance(evidence_basis, list) or not evidence_basis:
        errors.append("evidence_basis must contain at least one source or artifact basis")

    artifact_paths = packet.get("artifact_paths")
    if not isinstance(artifact_paths, list) or not artifact_paths:
        errors.append("artifact_paths must contain at least one executable or reviewable artifact path")
    elif not all(isinstance(path, str) and len(path) >= 3 for path in artifact_paths):
        errors.append("artifact_paths must be strings")

    for field in (
        "collaboration_fit",
        "requested_contribution",
        "falsification_route",
        "next_executable_action",
        "medical_or_veterinary_boundary",
    ):
        if not isinstance(packet.get(field), str) or len(packet[field]) < 12:
            errors.append(f"{field} must be explicit")

    missingness = packet.get("missingness")
    if not isinstance(missingness, list) or not missingness:
        errors.append("missingness must contain at least one known gap")

    if _has_private_identifier(packet):
        errors.append("private identifier detected")
    if _has_advice_leak(packet):
        errors.append("advice leakage detected in medical_or_veterinary_boundary")

    if packet.get("claim_status") == "supported" and packet.get("source_status") == "synthetic":
        warnings.append("synthetic source cannot independently establish supported external claim")

    score = 100 - (25 * len(errors)) - (5 * len(warnings))
    score = max(score, 0)
    return {
        "packet_id": packet.get("packet_id", "unknown"),
        "passes": not errors,
        "score": score,
        "errors": errors,
        "warnings": warnings,
    }


def _records_from_payload(payload: Any) -> list[dict[str, Any]]:
    if isinstance(payload, list):
        return payload
    if isinstance(payload, dict):
        if "valid_packets" in payload:
            return list(payload.get("valid_packets", []))
        if "packet_id" in payload:
            return [payload]
    raise ValueError("Input must be a packet, packet list, or fixture file with valid_packets.")


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description="Score MC collaboration-readiness packets.")
    parser.add_argument("path", type=Path, help="JSON packet, packet list, or fixture file")
    args = parser.parse_args(argv)

    payload = json.loads(args.path.read_text(encoding="utf-8"))
    packets = _records_from_payload(payload)
    results = [score_packet(packet) for packet in packets]
    print(json.dumps(results, indent=2, sort_keys=True))
    return 0 if all(result["passes"] for result in results) else 1


if __name__ == "__main__":
    raise SystemExit(main())
