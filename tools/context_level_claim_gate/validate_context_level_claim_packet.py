#!/usr/bin/env python3
"""Validate context-level claim packets for public-safe discovery memory promotion."""

from __future__ import annotations

import json
import re
import sys
from pathlib import Path
from typing import Any

SCHEMA_PATH = Path(__file__).with_name("context_level_claim_schema.json")
DIRECT_IDENTIFIER_PATTERN = re.compile(r"[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}|\b\d{3}[-.]?\d{2}[-.]?\d{4}\b", re.I)


def load_json(path: Path) -> Any:
    return json.loads(path.read_text(encoding="utf-8"))


def require(condition: bool, message: str) -> None:
    if not condition:
        raise ValueError(message)


def validate_against_minimal_schema(packet: dict[str, Any], schema: dict[str, Any]) -> None:
    required = schema["required"]
    missing = [field for field in required if field not in packet]
    require(not missing, f"Missing required fields: {', '.join(missing)}")

    allowed = set(schema["properties"])
    extra = sorted(set(packet) - allowed)
    require(not extra, f"Unexpected fields: {', '.join(extra)}")

    for field, spec in schema["properties"].items():
        if field not in packet:
            continue
        if "enum" in spec:
            require(packet[field] in spec["enum"], f"{field} must be one of {spec['enum']}")
        if spec.get("type") == "string":
            require(isinstance(packet[field], str), f"{field} must be a string")
            if "minLength" in spec:
                require(len(packet[field]) >= spec["minLength"], f"{field} is too short")
        if spec.get("type") == "object":
            require(isinstance(packet[field], dict), f"{field} must be an object")
            nested_missing = [name for name in spec.get("required", []) if name not in packet[field]]
            require(not nested_missing, f"{field} missing: {', '.join(nested_missing)}")


def validate_domain_rules(packet: dict[str, Any]) -> None:
    raw = json.dumps(packet, sort_keys=True)
    require(not DIRECT_IDENTIFIER_PATTERN.search(raw), "Packet contains a direct identifier")

    privacy = packet["privacy_boundary"]
    require(privacy["direct_identifiers"] != "present_block", "Direct identifiers block promotion")
    require(packet["privacy_status"] in {"public_safe_synthetic", "typed_placeholder_only", "aggregate_only"}, "privacy_status is not promotion-safe")

    context_level = packet["context_level"]
    claim_level = packet["claim_level"]
    promotion = packet["cross_level_promotion"]

    if context_level != claim_level:
        require(promotion["attempted"] is True, "Cross-level mismatch must be explicitly marked attempted")
        require(len(promotion["bridge_rationale"]) >= 20, "Cross-level bridge rationale is required")
        require(len(promotion["validation_required"]) >= 20, "Cross-level validation route is required")
    else:
        require(promotion["attempted"] is False, "Same-level packet should not mark cross-level promotion")

    require(
        "falsif" in packet["falsification_route"].lower() or "fail" in packet["falsification_route"].lower(),
        "falsification_route must name a failure/falsification condition",
    )

    if packet["claim_status"] == "medical_or_veterinary_advice":
        raise ValueError("Medical/veterinary advice is blocked; only research-organization packets are allowed")


def validate_packet(path: Path) -> dict[str, Any]:
    schema = load_json(SCHEMA_PATH)
    packet = load_json(path)
    require(isinstance(packet, dict), "Packet must be a JSON object")
    validate_against_minimal_schema(packet, schema)
    validate_domain_rules(packet)
    return packet


def main(argv: list[str]) -> int:
    if len(argv) != 2:
        print("Usage: validate_context_level_claim_packet.py <packet.json>", file=sys.stderr)
        return 2
    try:
        packet = validate_packet(Path(argv[1]))
    except Exception as exc:  # noqa: BLE001
        print(f"INVALID: {exc}", file=sys.stderr)
        return 1
    print(json.dumps({"status": "valid", "packet_id": packet["packet_id"], "claim_level": packet["claim_level"]}, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv))
