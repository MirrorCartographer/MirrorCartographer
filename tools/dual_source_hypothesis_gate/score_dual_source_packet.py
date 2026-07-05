#!/usr/bin/env python3
"""Score Mirror Cartographer dual-source hypothesis packets.

Public-safe purpose:
Require a candidate hypothesis to have both textual grounding and structured
variable support before it can enter discovery memory. This is research
organization infrastructure, not medical, veterinary, or treatment advice.
"""

from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path
from typing import Any, Dict, Iterable, List

PUBLIC_SAFE_VALUES = {"public", "public_safe", "public_safe_synthetic", "synthetic"}
REJECTING_PRIVACY_VALUES = {"private", "private_or_identifying", "identifying", "raw_transcript"}


def classify_packet(packet: Dict[str, Any]) -> str:
    """Return one deterministic classification for a hypothesis packet."""
    privacy_status = str(packet.get("privacy_status", "")).strip().lower()
    if privacy_status in REJECTING_PRIVACY_VALUES or privacy_status not in PUBLIC_SAFE_VALUES:
        return "reject_privacy"

    self_eval = packet.get("self_evaluation") or {}
    if float(self_eval.get("privacy_risk", 1.0)) > 0.0:
        return "reject_privacy"
    if float(self_eval.get("overclaim_risk", 1.0)) >= 0.7:
        return "reject_overclaim"

    text = packet.get("textual_support") or {}
    structured = packet.get("structured_support") or {}
    variables = structured.get("variables") or []

    if not text.get("supports_claim"):
        return "reject_missing_textual_support"
    if int(text.get("citation_count", 0)) < 1:
        return "reject_missing_textual_support"
    if not structured.get("supports_claim") or len(variables) < 2:
        return "reject_missing_structured_support"
    if float(self_eval.get("testability", 0.0)) < 0.6:
        return "reject_low_testability"

    return "admit"


def score_packet(packet: Dict[str, Any]) -> Dict[str, Any]:
    classification = classify_packet(packet)
    expected = packet.get("expected_classification")
    return {
        "id": packet.get("id"),
        "classification": classification,
        "expected_classification": expected,
        "passed_fixture_expectation": expected is None or expected == classification,
    }


def load_packets(path: Path) -> List[Dict[str, Any]]:
    data = json.loads(path.read_text(encoding="utf-8"))
    if isinstance(data, dict):
        return [data]
    if isinstance(data, list):
        return data
    raise ValueError("Input must be a JSON object or array of objects")


def main(argv: Iterable[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description="Score dual-source hypothesis packets")
    parser.add_argument("path", help="JSON packet or fixture array")
    parser.add_argument("--strict", action="store_true", help="Exit nonzero when fixture expectations fail")
    args = parser.parse_args(list(argv) if argv is not None else None)

    packets = load_packets(Path(args.path))
    results = [score_packet(packet) for packet in packets]
    print(json.dumps(results, indent=2, sort_keys=True))

    if args.strict and not all(item["passed_fixture_expectation"] for item in results):
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
