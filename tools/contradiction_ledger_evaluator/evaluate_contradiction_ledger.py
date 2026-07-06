#!/usr/bin/env python3
"""Evaluate public-safe Mirror Cartographer contradiction ledger packets.

This tool is intentionally dependency-free so it can run in simple CI jobs.
It performs research-organization routing only and does not produce medical or
veterinary advice.
"""

from __future__ import annotations

import argparse
import json
import re
import sys
from pathlib import Path
from typing import Any, Dict, List, Tuple

BLOCKED_CLAIM_STATUSES = {"advice", "cure_claim"}
ALLOWED_DOMAINS = {"human_pattern", "animal_care", "literature", "system_eval"}
ALLOWED_PRIVACY = {"public_safe", "contains_private_residue"}
ALLOWED_CLAIM_STATUS = {"hypothesis", "observation", "advice", "cure_claim", "uncertain"}
UNSAFE_TEXT_PATTERNS = [
    re.compile(r"\b(cure|heals?|treats?|diagnose|diagnosis|prescribe|guaranteed|will fix)\b", re.I),
    re.compile(r"\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b", re.I),
    re.compile(r"\b\d{3}[-. ]?\d{2}[-. ]?\d{4}\b"),
    re.compile(r"\b\d{1,5}\s+[A-Z][a-z]+\s+(Street|St|Road|Rd|Avenue|Ave|Lane|Ln|Drive|Dr)\b"),
]


def text_fields(packet: Dict[str, Any]) -> str:
    parts: List[str] = []
    for key in ("claim_under_review", "supporting_signal", "contradicting_signal", "falsification_action"):
        value = packet.get(key)
        if isinstance(value, str):
            parts.append(value)
    return "\n".join(parts)


def has_unsafe_text(packet: Dict[str, Any]) -> bool:
    joined = text_fields(packet)
    return any(pattern.search(joined) for pattern in UNSAFE_TEXT_PATTERNS)


def require_string(packet: Dict[str, Any], key: str, reasons: List[str]) -> None:
    value = packet.get(key)
    if not isinstance(value, str) or not value.strip():
        reasons.append(f"missing_or_empty:{key}")


def require_string_list(packet: Dict[str, Any], key: str, reasons: List[str], minimum: int = 1) -> None:
    value = packet.get(key)
    if not isinstance(value, list) or len([item for item in value if isinstance(item, str) and item.strip()]) < minimum:
        reasons.append(f"insufficient:{key}")


def evaluate_packet(packet: Dict[str, Any]) -> Dict[str, Any]:
    reasons: List[str] = []

    require_string(packet, "id", reasons)
    require_string(packet, "claim_under_review", reasons)
    require_string(packet, "supporting_signal", reasons)
    require_string(packet, "contradicting_signal", reasons)
    require_string(packet, "comparison_design", reasons)
    require_string(packet, "falsification_action", reasons)
    require_string_list(packet, "measurable_variables", reasons, minimum=2)
    require_string_list(packet, "source_refs", reasons, minimum=1)

    domain = packet.get("domain")
    privacy_status = packet.get("privacy_status")
    claim_status = packet.get("claim_status")

    if domain not in ALLOWED_DOMAINS:
        reasons.append("invalid:domain")
    if privacy_status not in ALLOWED_PRIVACY:
        reasons.append("invalid:privacy_status")
    if claim_status not in ALLOWED_CLAIM_STATUS:
        reasons.append("invalid:claim_status")

    if privacy_status == "contains_private_residue":
        reasons.append("blocked:private_residue")
    if claim_status in BLOCKED_CLAIM_STATUSES:
        reasons.append(f"blocked:{claim_status}")
    if has_unsafe_text(packet):
        reasons.append("blocked:unsafe_text_pattern")

    blocked = any(reason.startswith("blocked:") for reason in reasons)
    insufficient_sources = "insufficient:source_refs" in reasons
    insufficient_variables = "insufficient:measurable_variables" in reasons
    missing_core_text = any(reason.startswith("missing_or_empty:") for reason in reasons)
    invalid_schema = any(reason.startswith("invalid:") for reason in reasons)

    if blocked:
        route = "blocked_public_export"
    elif invalid_schema or missing_core_text or insufficient_variables:
        route = "needs_normalization"
    elif insufficient_sources:
        route = "needs_evidence"
    else:
        route = "ready_for_falsification"

    return {
        "id": packet.get("id", "<missing>"),
        "route": route,
        "reasons": sorted(set(reasons)) or ["passes_contradiction_gate"],
    }


def evaluate_packets(packets: List[Dict[str, Any]]) -> Dict[str, Any]:
    results = [evaluate_packet(packet) for packet in packets]
    counts: Dict[str, int] = {}
    for item in results:
        counts[item["route"]] = counts.get(item["route"], 0) + 1
    return {"counts": counts, "results": results}


def load_packets(path: Path) -> List[Dict[str, Any]]:
    try:
        raw = json.loads(path.read_text(encoding="utf-8"))
    except json.JSONDecodeError as exc:
        raise SystemExit(f"Invalid JSON: {exc}") from exc
    if not isinstance(raw, list):
        raise SystemExit("Input JSON must be an array of packet objects.")
    if not all(isinstance(item, dict) for item in raw):
        raise SystemExit("Every packet must be a JSON object.")
    return raw


def format_text(report: Dict[str, Any]) -> str:
    lines = ["Contradiction Ledger Evaluation", ""]
    lines.append("Counts:")
    for route in sorted(report["counts"]):
        lines.append(f"- {route}: {report['counts'][route]}")
    lines.append("")
    lines.append("Results:")
    for item in report["results"]:
        lines.append(f"- {item['id']}: {item['route']} ({', '.join(item['reasons'])})")
    return "\n".join(lines)


def main(argv: List[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description="Evaluate MC contradiction ledger packets.")
    parser.add_argument("input", help="Path to contradiction ledger JSON array.")
    parser.add_argument("--json", action="store_true", help="Emit machine-readable JSON report.")
    args = parser.parse_args(argv)

    packets = load_packets(Path(args.input))
    report = evaluate_packets(packets)
    if args.json:
        print(json.dumps(report, indent=2, sort_keys=True))
    else:
        print(format_text(report))
    return 0


if __name__ == "__main__":
    sys.exit(main())
