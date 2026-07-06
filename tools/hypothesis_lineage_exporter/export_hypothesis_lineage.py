#!/usr/bin/env python3
"""Export public-safe hypothesis packets into auditable lineage packets.

Engineering utility for Mirror Cartographer. It validates and transforms packet
metadata for later review gates. It does not provide care instructions.
"""

from __future__ import annotations

import argparse
import json
import re
import sys
from dataclasses import dataclass
from pathlib import Path
from typing import Any, Dict, Iterable, List

REQUIRED_FIELDS = [
    "hypothesis_id",
    "domain",
    "origin_component",
    "claim_text",
    "claim_status",
    "source_status",
    "privacy_status",
    "missingness",
    "variables",
    "evidence_refs",
    "contradiction_refs",
    "falsification_route",
    "next_executable_action",
]

ALLOWED_DOMAINS = {
    "longitudinal_pattern_tracking",
    "evidence_boundary_routing",
    "hypothesis_generation",
    "falsification",
    "medical_scientific_literature",
    "animal_care_evidence",
    "privacy_preserving_research_memory",
    "collaboration_readiness",
}

BLOCKED_SOURCE_MARKERS = {"raw_private", "private", "unredacted", "transcript_raw"}
BLOCKED_PRIVACY_MARKERS = {"private_raw", "identifying", "exact_timestamp", "contact_info"}
BLOCKED_CLAIM_MARKERS = {"advice_like", "diagnostic_assertion", "directive", "causal_certainty"}
DIRECTIVE_LANGUAGE = re.compile(r"\b(should|must|certainly|guarantees|proves cause)\b", re.I)


@dataclass(frozen=True)
class ExportDecision:
    admission: str
    review_flags: List[str]


def _as_list(value: Any) -> List[Any]:
    return value if isinstance(value, list) else []


def validate_packet(packet: Dict[str, Any]) -> ExportDecision:
    flags: List[str] = []

    for field in REQUIRED_FIELDS:
        if field not in packet:
            flags.append(f"missing_field:{field}")

    if flags:
        return ExportDecision("blocked", flags)

    source_status = str(packet.get("source_status", "")).lower()
    privacy_status = str(packet.get("privacy_status", "")).lower()
    claim_status = str(packet.get("claim_status", "")).lower()
    claim_text = str(packet.get("claim_text", ""))

    if packet["domain"] not in ALLOWED_DOMAINS:
        flags.append("invalid_domain")
    if source_status in BLOCKED_SOURCE_MARKERS:
        flags.append("blocked_source_status")
    if privacy_status in BLOCKED_PRIVACY_MARKERS:
        flags.append("blocked_privacy_status")
    if claim_status in BLOCKED_CLAIM_MARKERS:
        flags.append("blocked_claim_status")
    if DIRECTIVE_LANGUAGE.search(claim_text):
        flags.append("directive_or_certainty_language")
    if not _as_list(packet.get("variables")):
        flags.append("missing_measurable_variables")
    if not _as_list(packet.get("evidence_refs")):
        flags.append("missing_evidence_refs")
    if not _as_list(packet.get("missingness")):
        flags.append("missing_missingness_statement")
    if not str(packet.get("falsification_route", "")).strip():
        flags.append("missing_falsification_route")
    if not str(packet.get("next_executable_action", "")).strip():
        flags.append("missing_next_executable_action")

    return ExportDecision("blocked" if flags else "exported", flags)


def export_lineage(packet: Dict[str, Any]) -> Dict[str, Any]:
    decision = validate_packet(packet)
    hypothesis_id = str(packet.get("hypothesis_id", "UNKNOWN"))
    origin = str(packet.get("origin_component", "unknown_origin"))

    return {
        "lineage_id": f"LIN-{hypothesis_id}",
        "hypothesis_id": hypothesis_id,
        "domain": packet.get("domain"),
        "admission": decision.admission,
        "lineage_chain": [origin, "hypothesis_lineage_exporter"],
        "source_status": packet.get("source_status"),
        "claim_status": packet.get("claim_status"),
        "privacy_status": packet.get("privacy_status"),
        "missingness": packet.get("missingness", []),
        "revision_reason": "export auditable hypothesis lineage while preserving evidence and privacy boundaries",
        "implementation_status": "executable_cli_validator_exporter",
        "testability": "python tools/hypothesis_lineage_exporter/test_export_hypothesis_lineage.py",
        "review_flags": decision.review_flags,
        "next_executable_action": packet.get("next_executable_action") if decision.admission == "exported" else "repair packet before export",
    }


def load_packets(path: Path) -> List[Dict[str, Any]]:
    data = json.loads(path.read_text(encoding="utf-8"))
    if not isinstance(data, list):
        raise ValueError("input must be a JSON array of hypothesis packets")
    for index, item in enumerate(data):
        if not isinstance(item, dict):
            raise ValueError(f"packet at index {index} is not an object")
    return data


def main(argv: Iterable[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description="Export MC hypothesis lineage packets")
    parser.add_argument("input_json", type=Path)
    parser.add_argument("--fail-on-blocked", action="store_true")
    args = parser.parse_args(list(argv) if argv is not None else None)

    packets = load_packets(args.input_json)
    exported = [export_lineage(packet) for packet in packets]
    json.dump(exported, sys.stdout, indent=2, sort_keys=True)
    sys.stdout.write("\n")

    if args.fail_on_blocked and any(item["admission"] == "blocked" for item in exported):
        return 2
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
