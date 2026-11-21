#!/usr/bin/env python3
"""Validate public-safe self-map and platform-limitation JSON packets offline."""

from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path

CLAIM_STATUSES = {
    "observed", "inferred", "hypothesis", "metaphor", "unknown", "disconfirmed"
}
SELF_MAP_REQUIRED = {
    "packet_type", "id", "created_at", "privacy", "claims", "domains"
}
LIMITATION_REQUIRED = {
    "packet_type", "id", "created_at", "privacy", "environment",
    "intended_capability", "observed_failure", "category", "tests",
    "workaround", "residual_risk", "next_experiment"
}
DOMAINS = {"state", "conditions", "interpretation", "pattern", "values", "agency"}
LIMITATION_CATEGORIES = {
    "ui", "context", "attachment", "tool", "connector_permission", "api",
    "runtime", "policy", "credentials", "rate_limit", "unknown"
}
PRIVATE_MARKERS = {
    "password", "access_token", "refresh_token", "private_key", "api_key",
    "secret_key", "authorization"
}


def validate(packet: object, kind: str) -> list[str]:
    errors: list[str] = []
    if not isinstance(packet, dict):
        return ["top-level JSON value must be an object"]

    required = SELF_MAP_REQUIRED if kind == "self_map" else LIMITATION_REQUIRED
    missing = sorted(required - packet.keys())
    if missing:
        errors.append("missing required fields: " + ", ".join(missing))

    expected_type = kind
    if packet.get("packet_type") != expected_type:
        errors.append(f"packet_type must be {expected_type!r}")

    for field in ("id", "created_at"):
        if field in packet and not isinstance(packet[field], str):
            errors.append(f"{field} must be a string")

    if packet.get("privacy") not in {"public", "redacted", "private"}:
        errors.append("privacy must be public, redacted, or private")

    serialized = json.dumps(packet, ensure_ascii=False).lower()
    if any(marker in serialized for marker in PRIVATE_MARKERS):
        errors.append("possible credential field/value detected; inspect and remove secrets")

    if kind == "self_map":
        claims = packet.get("claims")
        if not isinstance(claims, list) or not claims:
            errors.append("claims must be a non-empty list")
        else:
            for index, claim in enumerate(claims):
                if not isinstance(claim, dict):
                    errors.append(f"claims[{index}] must be an object")
                    continue
                if not isinstance(claim.get("text"), str) or not claim["text"].strip():
                    errors.append(f"claims[{index}].text must be a non-empty string")
                if claim.get("status") not in CLAIM_STATUSES:
                    errors.append(f"claims[{index}].status is not a recognized evidence status")
                if not isinstance(claim.get("source"), str) or not claim["source"].strip():
                    errors.append(f"claims[{index}].source must identify provenance")
                if "confidence" in claim:
                    confidence = claim["confidence"]
                    if not isinstance(confidence, (int, float)) or not 0 <= confidence <= 1:
                        errors.append(f"claims[{index}].confidence must be between 0 and 1")
        domains = packet.get("domains")
        if not isinstance(domains, list) or not domains:
            errors.append("domains must be a non-empty list")
        elif any(domain not in DOMAINS for domain in domains):
            errors.append("domains contains an unsupported domain")
    else:
        if packet.get("category") not in LIMITATION_CATEGORIES:
            errors.append("category must be a recognized limitation category")
        for field in ("environment", "intended_capability", "observed_failure",
                      "workaround", "residual_risk", "next_experiment"):
            if field in packet and (not isinstance(packet[field], str) or not packet[field].strip()):
                errors.append(f"{field} must be a non-empty string")
        if not isinstance(packet.get("tests"), list):
            errors.append("tests must be a list, including an empty list when no tests ran")
        if packet.get("privacy") == "public" and packet.get("category") == "unknown":
            errors.append("public unknown-category reports should be reviewed or redacted before publication")

    return errors


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("packet", type=Path, help="path to a JSON packet")
    parser.add_argument("--kind", choices=("self_map", "limitation"), default="self_map")
    args = parser.parse_args()

    try:
        packet = json.loads(args.packet.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        print(f"ERROR: cannot read valid JSON: {exc}", file=sys.stderr)
        return 1

    errors = validate(packet, args.kind)
    if errors:
        for error in errors:
            print(f"ERROR: {error}", file=sys.stderr)
        return 1
    print(f"VALID: {args.kind} packet {packet.get('id', '(no id)')}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
