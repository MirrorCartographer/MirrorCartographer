#!/usr/bin/env python3
"""Validate that platform-limit evidence pins source files to immutable Git refs."""
from __future__ import annotations

import argparse
import json
import re
import sys
from collections import defaultdict
from pathlib import Path

SHA40 = re.compile(r"^[0-9a-f]{40}$")
CATEGORIES = {
    "ui", "context", "attachment", "tool", "connector_permission", "api",
    "runtime", "policy", "credentials", "rate_limit", "unknown",
}
REQUIRED = {"packet_type", "id", "privacy", "category", "observation", "evidence"}
RECORD_REQUIRED = {"source", "path", "requested_ref", "commit_sha", "blob_sha"}


def validate(packet: object) -> list[str]:
    errors: list[str] = []
    if not isinstance(packet, dict):
        return ["top-level value must be an object"]

    missing = sorted(REQUIRED - packet.keys())
    if missing:
        errors.append("missing packet fields: " + ", ".join(missing))
    if packet.get("packet_type") != "platform_limit_evidence":
        errors.append("packet_type must be 'platform_limit_evidence'")

    privacy = packet.get("privacy")
    if not isinstance(privacy, str) or privacy not in {"public", "redacted"}:
        errors.append("privacy must be public or redacted")

    category = packet.get("category")
    if not isinstance(category, str) or category not in CATEGORIES:
        errors.append("category must be a recognized limitation category")

    observation = packet.get("observation")
    if not isinstance(observation, str) or not observation.strip():
        errors.append("observation must be a non-empty string")

    evidence = packet.get("evidence")
    if not isinstance(evidence, list) or not evidence:
        errors.append("evidence must be a non-empty list")
        return errors

    for i, record in enumerate(evidence):
        prefix = f"evidence[{i}]"
        if not isinstance(record, dict):
            errors.append(f"{prefix} must be an object")
            continue
        missing_record = sorted(RECORD_REQUIRED - record.keys())
        if missing_record:
            errors.append(f"{prefix} missing fields: " + ", ".join(missing_record))
            continue
        for field in ("source", "path", "requested_ref"):
            value = record.get(field)
            if not isinstance(value, str) or not value.strip():
                errors.append(
                    f"{prefix}.{field} must be a non-empty string; implicit refs are not accepted"
                )
        for field in ("commit_sha", "blob_sha"):
            value = record.get(field)
            if not isinstance(value, str) or not SHA40.fullmatch(value):
                errors.append(
                    f"{prefix}.{field} must be a 40-character lowercase hexadecimal SHA"
                )
    return errors


def divergent_paths(packet: dict) -> dict[str, list[str]]:
    by_path: dict[str, set[str]] = defaultdict(set)
    for record in packet.get("evidence", []):
        if (
            isinstance(record, dict)
            and isinstance(record.get("path"), str)
            and isinstance(record.get("blob_sha"), str)
        ):
            by_path[record["path"]].add(record["blob_sha"])
    return {path: sorted(shas) for path, shas in by_path.items() if len(shas) > 1}


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("packet", type=Path)
    args = parser.parse_args()
    try:
        packet = json.loads(args.packet.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        print(f"ERROR: cannot read valid JSON: {exc}", file=sys.stderr)
        return 1

    errors = validate(packet)
    if errors:
        for error in errors:
            print("ERROR: " + error, file=sys.stderr)
        return 1

    print(
        f"VALID: {len(packet['evidence'])} evidence records have explicit refs "
        "and immutable SHA provenance"
    )
    for path, shas in sorted(divergent_paths(packet).items()):
        print(f"DIVERGENCE: {path} has different blob SHAs across refs: {', '.join(shas)}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
