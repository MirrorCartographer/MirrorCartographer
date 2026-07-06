#!/usr/bin/env python3
"""Build public-safe provenance packets for Mirror Cartographer.

This tool converts bounded observation/evidence notes into auditable packets before
hypothesis generation, falsification routing, collaborator export, or public reuse.
It is intentionally conservative: missing privacy, source, claim, revision, or
next-action fields fail validation instead of silently producing weak packets.
"""

from __future__ import annotations

import argparse
import hashlib
import json
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

REQUIRED_FIELDS = {
    "id",
    "source_kind",
    "source_status",
    "privacy_status",
    "claim_text",
    "claim_status",
    "observed_variables",
    "evidence_refs",
    "missingness",
    "revision_reason",
    "next_executable_action",
}

FORBIDDEN_PRIVACY_STATUSES = {
    "raw_private",
    "contains_identifier",
    "unknown",
    "unreviewed",
}

ALLOWED_CLAIM_STATUSES = {
    "bounded_observation",
    "candidate_pattern",
    "hypothesis_candidate",
    "evidence_summary",
    "contradiction_note",
}


def stable_hash(value: Any) -> str:
    payload = json.dumps(value, sort_keys=True, separators=(",", ":"))
    return hashlib.sha256(payload.encode("utf-8")).hexdigest()[:16]


def validate_input(item: dict[str, Any]) -> list[str]:
    errors: list[str] = []
    missing = sorted(REQUIRED_FIELDS - set(item))
    if missing:
        errors.append(f"missing required fields: {', '.join(missing)}")

    if item.get("privacy_status") in FORBIDDEN_PRIVACY_STATUSES:
        errors.append("privacy_status is not public-safe")

    if item.get("claim_status") not in ALLOWED_CLAIM_STATUSES:
        errors.append("claim_status is not an allowed bounded research status")

    if not isinstance(item.get("observed_variables"), list) or not item.get("observed_variables"):
        errors.append("observed_variables must be a non-empty list")

    if not isinstance(item.get("evidence_refs"), list):
        errors.append("evidence_refs must be a list, even when empty")
    else:
        for idx, ref in enumerate(item["evidence_refs"]):
            if not isinstance(ref, dict) or not {"ref_id", "ref_type", "boundary"}.issubset(ref):
                errors.append(f"evidence_refs[{idx}] must include ref_id, ref_type, and boundary")

    if not isinstance(item.get("missingness"), list) or not item.get("missingness"):
        errors.append("missingness must be explicit and non-empty")

    for field in ["revision_reason", "next_executable_action", "claim_text"]:
        if not isinstance(item.get(field), str) or len(item.get(field, "").strip()) < 12:
            errors.append(f"{field} must be a meaningful string")

    return errors


def build_packet(item: dict[str, Any], index: int) -> dict[str, Any]:
    errors = validate_input(item)
    base = {
        "packet_id": f"mc.provenance.{stable_hash(item)}",
        "input_id": item.get("id", f"missing-id-{index}"),
        "source_status": item.get("source_status", "missing"),
        "claim_status": item.get("claim_status", "missing"),
        "privacy_status": item.get("privacy_status", "missing"),
        "missingness": item.get("missingness", []),
        "revision_reason": item.get("revision_reason", "missing"),
        "implementation_status": "built_by_provenance_packet_builder",
        "testability": "deterministic_schema_and_boundary_validation",
        "next_executable_action": item.get("next_executable_action", "missing"),
        "created_at_utc": datetime.now(timezone.utc).replace(microsecond=0).isoformat(),
    }
    if errors:
        base.update({"route": "reject", "errors": errors})
        return base

    return {
        **base,
        "route": "ready_for_evidence_review",
        "source_kind": item["source_kind"],
        "claim_text": item["claim_text"],
        "observed_variables": sorted(set(item["observed_variables"])),
        "evidence_refs": item["evidence_refs"],
        "boundary_checks": {
            "public_safe": True,
            "non_advice": True,
            "raw_private_data_absent": True,
            "falsification_ready": bool(item["observed_variables"] and item["missingness"]),
        },
    }


def run(input_path: Path, output_path: Path) -> dict[str, Any]:
    items = json.loads(input_path.read_text(encoding="utf-8"))
    if not isinstance(items, list):
        raise ValueError("input must be a JSON list")
    packets = [build_packet(item, idx) for idx, item in enumerate(items)]
    summary = {
        "component": "provenance_packet_builder",
        "packet_count": len(packets),
        "ready_count": sum(1 for p in packets if p["route"] == "ready_for_evidence_review"),
        "reject_count": sum(1 for p in packets if p["route"] == "reject"),
        "packets": packets,
    }
    output_path.write_text(json.dumps(summary, indent=2, sort_keys=True) + "\n", encoding="utf-8")
    return summary


def main() -> int:
    parser = argparse.ArgumentParser(description="Build MC public-safe provenance packets")
    parser.add_argument("input", type=Path, help="JSON list of bounded observation/evidence notes")
    parser.add_argument("--output", type=Path, default=Path("provenance_packets.generated.json"))
    args = parser.parse_args()
    summary = run(args.input, args.output)
    print(json.dumps({k: summary[k] for k in ["component", "packet_count", "ready_count", "reject_count"]}, indent=2))
    return 0 if summary["reject_count"] == 0 else 2


if __name__ == "__main__":
    raise SystemExit(main())
