#!/usr/bin/env python3
"""Validate Mirror Cartographer collaboration role boundary packets.

This validator is intentionally dependency-light. It performs semantic checks that
are not expressible in the JSON schema alone, including required role coverage,
public-safe privacy boundaries, and non-advice claim routing.
"""
from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path
from typing import Any, Dict, Iterable, List

REQUIRED_ROLES = {"observer", "ideator", "verifier", "curator"}
BLOCKED_ALLOWED_DATA_TERMS = {
    "raw health logs",
    "raw medical record",
    "private medical record",
    "private veterinary record",
    "identifying collaborator details",
    "unredacted transcript",
}
DISALLOWED_SOURCE_TYPES = {"uncited model assertion", "private medical record", "private veterinary record"}


def load_json(path: Path) -> Any:
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except json.JSONDecodeError as exc:
        raise SystemExit(f"invalid_json: {path}: {exc}") from exc


def normalize_terms(values: Iterable[str]) -> set[str]:
    return {str(value).strip().lower() for value in values}


def validate_packet(packet: Dict[str, Any]) -> List[str]:
    errors: List[str] = []

    roles = packet.get("collaboration_roles", [])
    role_names = {role.get("role") for role in roles if isinstance(role, dict)}
    missing_roles = sorted(REQUIRED_ROLES - role_names)
    if missing_roles:
        errors.append(f"missing_required_roles:{','.join(missing_roles)}")

    if len(roles) < 4:
        errors.append("too_few_collaboration_roles")

    for role in roles:
        if not isinstance(role, dict):
            errors.append("role_entry_not_object")
            continue
        if role.get("handoff_required") is True and not role.get("failure_if_missing"):
            errors.append(f"handoff_without_failure_mode:{role.get('role', 'unknown')}")

    privacy = packet.get("privacy_boundary", {})
    privacy_status = privacy.get("privacy_status")
    allowed_data = normalize_terms(privacy.get("allowed_data", []))
    blocked_data = normalize_terms(privacy.get("blocked_data", []))

    if privacy_status in {"public_safe", "synthetic_only"} and allowed_data & BLOCKED_ALLOWED_DATA_TERMS:
        errors.append("public_safe_packet_allows_private_data")

    if privacy_status != "public_safe" and packet.get("review_decision", {}).get("decision") == "promote":
        errors.append("promoted_packet_not_public_safe")

    if not blocked_data or blocked_data == {"none"}:
        errors.append("blocked_data_boundary_missing")

    evidence = packet.get("evidence_boundary", {})
    allowed_sources = normalize_terms(evidence.get("source_types_allowed", []))
    if allowed_sources & DISALLOWED_SOURCE_TYPES:
        errors.append("disallowed_source_type_marked_allowed")

    min_grounding = str(evidence.get("minimum_grounding", "")).lower()
    if "plausible" in min_grounding and "source" not in min_grounding:
        errors.append("plausibility_used_as_grounding")

    claim = packet.get("claim_boundary", {})
    if claim.get("medical_advice_risk") and packet.get("review_decision", {}).get("decision") == "promote":
        errors.append("medical_advice_risk_promoted")
    if claim.get("animal_care_advice_risk") and packet.get("review_decision", {}).get("decision") == "promote":
        errors.append("animal_care_advice_risk_promoted")

    labels = packet.get("labels", {})
    falsification_route = str(labels.get("falsification_route", "")).strip().lower()
    if not falsification_route or falsification_route == "none":
        errors.append("falsification_route_missing")

    next_action = str(packet.get("review_decision", {}).get("next_executable_action", "")).strip().lower()
    if not next_action or next_action in {"use it", "none", "n/a"}:
        errors.append("next_executable_action_not_specific")

    return errors


def iter_packets(payload: Any) -> Iterable[Dict[str, Any]]:
    if isinstance(payload, dict) and "valid_packets" in payload:
        for packet in payload.get("valid_packets", []):
            yield packet
        for item in payload.get("invalid_packets", []):
            if isinstance(item, dict) and isinstance(item.get("packet"), dict):
                yield item["packet"]
        return
    if isinstance(payload, list):
        for packet in payload:
            yield packet
        return
    if isinstance(payload, dict):
        yield payload
        return
    raise SystemExit("unsupported_payload_shape")


def main() -> int:
    parser = argparse.ArgumentParser(description="Validate collaboration role boundary packets.")
    parser.add_argument("path", type=Path, help="JSON packet or fixture file")
    parser.add_argument("--expect-valid", action="store_true", help="Exit nonzero if any packet fails")
    args = parser.parse_args()

    payload = load_json(args.path)
    results = []
    had_errors = False
    for packet in iter_packets(payload):
        packet_id = packet.get("packet_id", "unknown")
        errors = validate_packet(packet)
        if errors:
            had_errors = True
        results.append({"packet_id": packet_id, "valid": not errors, "errors": errors})

    print(json.dumps({"results": results}, indent=2, sort_keys=True))
    if args.expect_valid and had_errors:
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
