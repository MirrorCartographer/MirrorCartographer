#!/usr/bin/env python3
"""Public-safe Mirror Cartographer promotion gate.

This validator decides whether an already-validated discovery artifact may move to
the next discovery rung. It does not evaluate scientific truth. It enforces
publication safety, testability, provenance labels, and explicit next action.
"""

from __future__ import annotations

import json
import sys
from dataclasses import dataclass, asdict
from pathlib import Path
from typing import Any, Dict, Iterable, List

ALLOWED_ARTIFACT_TYPES = {
    "phenomenon",
    "hypothesis",
    "mechanism",
    "prediction",
    "dataset_schema",
    "evaluation_harness",
    "prototype",
    "evidence_crosswalk",
    "collaboration_profile",
    "contradiction_record",
}

ALLOWED_SOURCE_STATUS = {"synthetic", "public", "primary", "secondary"}
BLOCKED_CLAIM_STATUS = {
    "unsupported",
    "private",
    "raw_transcript",
    "medical_advice",
    "veterinary_advice",
}
REQUIRED_FIELDS = {
    "artifact_id",
    "artifact_type",
    "source_status",
    "claim_status",
    "privacy_status",
    "missingness",
    "implementation_status",
    "testability",
    "falsification_route",
    "next_executable_action",
}


@dataclass(frozen=True)
class PromotionResult:
    artifact_id: str
    decision: str
    errors: List[str]
    warnings: List[str]


def _text(value: Any) -> str:
    return value if isinstance(value, str) else ""


def evaluate_packet(packet: Dict[str, Any]) -> PromotionResult:
    errors: List[str] = []
    warnings: List[str] = []

    missing = sorted(field for field in REQUIRED_FIELDS if field not in packet)
    if missing:
        errors.append("missing_required_fields:" + ",".join(missing))

    artifact_id = _text(packet.get("artifact_id")) or "UNKNOWN"

    if packet.get("artifact_type") not in ALLOWED_ARTIFACT_TYPES:
        errors.append("unknown_artifact_type")

    if packet.get("source_status") not in ALLOWED_SOURCE_STATUS:
        errors.append("invalid_source_status")

    if packet.get("privacy_status") != "public":
        errors.append("privacy_status_not_public")

    if packet.get("claim_status") in BLOCKED_CLAIM_STATUS:
        errors.append("blocked_claim_status")

    if _text(packet.get("testability")) != "falsifiable_or_evaluable":
        warnings.append("testability_not_ready")

    if not _text(packet.get("falsification_route")).strip():
        warnings.append("missing_falsification_route")

    if not _text(packet.get("next_executable_action")).strip():
        warnings.append("missing_next_executable_action")

    if errors:
        decision = "BLOCK"
    elif warnings:
        decision = "REVISE"
    else:
        decision = "PROMOTE"

    return PromotionResult(
        artifact_id=artifact_id,
        decision=decision,
        errors=errors,
        warnings=warnings,
    )


def evaluate_packets(packets: Iterable[Dict[str, Any]]) -> Dict[str, Any]:
    results = [evaluate_packet(packet) for packet in packets]
    return {
        "schema_version": "1.0",
        "record_type": "promotion_gate_report",
        "privacy_status": "public",
        "source_status": "synthetic_or_public_input",
        "claim_status": "validation_report",
        "summary": {
            "total": len(results),
            "promote": sum(r.decision == "PROMOTE" for r in results),
            "revise": sum(r.decision == "REVISE" for r in results),
            "block": sum(r.decision == "BLOCK" for r in results),
        },
        "results": [asdict(result) for result in results],
    }


def _load_packets(path: Path) -> List[Dict[str, Any]]:
    data = json.loads(path.read_text(encoding="utf-8"))
    if isinstance(data, dict) and "fixtures" in data:
        return [fixture["packet"] for fixture in data["fixtures"]]
    if isinstance(data, dict) and "packets" in data:
        return data["packets"]
    if isinstance(data, list):
        return data
    raise ValueError("input must be a fixture set, packet list, or object with packets")


def main(argv: List[str]) -> int:
    if len(argv) != 2:
        print("usage: validate_promotion_decision.py <packets-or-fixtures.json>", file=sys.stderr)
        return 2
    report = evaluate_packets(_load_packets(Path(argv[1])))
    print(json.dumps(report, indent=2, sort_keys=True))
    return 1 if report["summary"]["block"] else 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv))
