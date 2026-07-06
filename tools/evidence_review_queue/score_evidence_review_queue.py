#!/usr/bin/env python3
"""Score public-safe evidence packets into Mirror Cartographer review queues.

This module intentionally uses only the Python standard library so it can run in
minimal automation environments.
"""

from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path
from typing import Any, Dict, Iterable, List

VALID_SOURCE_STATUS = {"primary", "secondary", "preprint", "institutional", "synthetic", "unknown"}
VALID_CLAIM_STATUS = {"unreviewed", "bounded", "overclaim", "contradicted", "unsupported"}
VALID_PRIVACY_STATUS = {"public_safe", "deidentified", "private_or_sensitive"}
VALID_EVIDENCE_STRENGTH = {"high", "moderate", "low", "unknown"}


class PacketError(ValueError):
    """Raised when a packet is structurally invalid."""


def _require_string(packet: Dict[str, Any], key: str) -> str:
    value = packet.get(key)
    if not isinstance(value, str) or not value.strip():
        raise PacketError(f"{packet.get('id', '<missing-id>')}: {key} must be a non-empty string")
    return value.strip()


def _require_list(packet: Dict[str, Any], key: str) -> List[Any]:
    value = packet.get(key)
    if not isinstance(value, list):
        raise PacketError(f"{packet.get('id', '<missing-id>')}: {key} must be a list")
    return value


def validate_packet_shape(packet: Dict[str, Any]) -> None:
    """Validate minimum packet shape before scoring."""
    if not isinstance(packet, dict):
        raise PacketError("packet must be an object")

    _require_string(packet, "id")
    source_status = _require_string(packet, "source_status")
    claim_status = _require_string(packet, "claim_status")
    privacy_status = _require_string(packet, "privacy_status")
    evidence_strength = _require_string(packet, "evidence_strength")
    _require_string(packet, "falsification_route")
    _require_string(packet, "revision_reason")

    if source_status not in VALID_SOURCE_STATUS:
        raise PacketError(f"{packet['id']}: invalid source_status {source_status!r}")
    if claim_status not in VALID_CLAIM_STATUS:
        raise PacketError(f"{packet['id']}: invalid claim_status {claim_status!r}")
    if privacy_status not in VALID_PRIVACY_STATUS:
        raise PacketError(f"{packet['id']}: invalid privacy_status {privacy_status!r}")
    if evidence_strength not in VALID_EVIDENCE_STRENGTH:
        raise PacketError(f"{packet['id']}: invalid evidence_strength {evidence_strength!r}")

    measurable_variables = _require_list(packet, "measurable_variables")
    if not measurable_variables or not all(isinstance(v, str) and v.strip() for v in measurable_variables):
        raise PacketError(f"{packet['id']}: measurable_variables must contain non-empty strings")

    missingness = _require_list(packet, "missingness")
    if not all(isinstance(v, str) and v.strip() for v in missingness):
        raise PacketError(f"{packet['id']}: missingness entries must be non-empty strings")

    reproducibility = packet.get("reproducibility")
    if not isinstance(reproducibility, dict):
        raise PacketError(f"{packet['id']}: reproducibility must be an object")
    for key in ("open_code", "open_data", "protocol_available"):
        if not isinstance(reproducibility.get(key), bool):
            raise PacketError(f"{packet['id']}: reproducibility.{key} must be boolean")


def score_packet(packet: Dict[str, Any]) -> Dict[str, Any]:
    """Return score, queue, and reasons for one evidence packet."""
    validate_packet_shape(packet)

    reasons: List[str] = []

    if packet["privacy_status"] == "private_or_sensitive":
        return {
            "packet_id": packet["id"],
            "score": 0,
            "queue": "blocked_privacy_or_advice",
            "reasons": ["privacy boundary violation blocks scoring"],
        }

    if packet["claim_status"] == "overclaim":
        return {
            "packet_id": packet["id"],
            "score": 0,
            "queue": "blocked_privacy_or_advice",
            "reasons": ["overclaim status blocks promotion until narrowed"],
        }

    score = 0

    source_points = {
        "primary": 25,
        "institutional": 20,
        "preprint": 14,
        "secondary": 10,
        "synthetic": 8,
        "unknown": -10,
    }[packet["source_status"]]
    score += source_points
    reasons.append(f"source_status={packet['source_status']} contributes {source_points}")

    strength_points = {"high": 25, "moderate": 16, "low": 6, "unknown": -8}[packet["evidence_strength"]]
    score += strength_points
    reasons.append(f"evidence_strength={packet['evidence_strength']} contributes {strength_points}")

    repro = packet["reproducibility"]
    for key, points in (("open_code", 8), ("open_data", 8), ("protocol_available", 9)):
        if repro[key]:
            score += points
            reasons.append(f"reproducibility.{key}=true contributes {points}")
        else:
            score -= 2
            reasons.append(f"reproducibility.{key}=false contributes -2")

    if packet["claim_status"] == "bounded":
        score += 15
        reasons.append("bounded claim contributes 15")
    elif packet["claim_status"] == "contradicted":
        score += 12
        reasons.append("contradicted claim contributes 12 for falsification value")
    elif packet["claim_status"] == "unsupported":
        score -= 10
        reasons.append("unsupported claim contributes -10")
    else:
        score -= 5
        reasons.append("unreviewed claim contributes -5")

    variable_bonus = min(len(packet["measurable_variables"]), 3) * 4
    score += variable_bonus
    reasons.append(f"measurable variable count contributes {variable_bonus}")

    missing_penalty = len(packet["missingness"]) * 6
    score -= missing_penalty
    reasons.append(f"missingness contributes -{missing_penalty}")

    score = max(0, min(100, score))

    if packet["source_status"] == "unknown" or packet["evidence_strength"] == "unknown":
        queue = "needs_normalization"
    elif packet["claim_status"] == "contradicted":
        queue = "falsification_priority"
    elif score >= 70 and packet["claim_status"] == "bounded" and not packet["missingness"]:
        queue = "promote_candidate"
    else:
        queue = "needs_more_evidence"

    return {"packet_id": packet["id"], "score": score, "queue": queue, "reasons": reasons}


def score_packets(packets: Iterable[Dict[str, Any]]) -> List[Dict[str, Any]]:
    return [score_packet(packet) for packet in packets]


def main(argv: List[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description="Score MC evidence packets into review queues.")
    parser.add_argument("input_json", help="Path to a JSON array of evidence packets")
    args = parser.parse_args(argv)

    try:
        packets = json.loads(Path(args.input_json).read_text(encoding="utf-8"))
        if not isinstance(packets, list):
            raise PacketError("input JSON must be an array of packets")
        results = score_packets(packets)
    except (OSError, json.JSONDecodeError, PacketError) as exc:
        print(f"ERROR: {exc}", file=sys.stderr)
        return 2

    print(json.dumps(results, indent=2, sort_keys=True))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
