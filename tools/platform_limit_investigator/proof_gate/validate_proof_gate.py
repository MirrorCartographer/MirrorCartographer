#!/usr/bin/env python3
"""Detect stale verification claims that contradict recorded CI success."""
from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path
from typing import Any

ALLOWED_STATUSES = {"success", "failure", "pending", "unknown", "skipped"}


def find_stale_claims(manifest: Any, record_text: str) -> list[dict[str, str]]:
    if not isinstance(manifest, dict):
        raise ValueError("manifest root must be an object")
    checks = manifest.get("checks")
    if not isinstance(checks, dict) or not checks:
        raise ValueError("manifest.checks must be a non-empty object")
    if not isinstance(record_text, str):
        raise ValueError("verification record must be text")

    findings: list[dict[str, str]] = []
    folded_record = record_text.casefold()
    for check_name, spec in checks.items():
        if not isinstance(check_name, str) or not check_name.strip():
            raise ValueError("check names must be non-empty strings")
        if not isinstance(spec, dict):
            raise ValueError(f"checks.{check_name} must be an object")
        status = spec.get("status")
        if not isinstance(status, str) or status not in ALLOWED_STATUSES:
            raise ValueError(f"checks.{check_name}.status must be one of {sorted(ALLOWED_STATUSES)}")
        phrases = spec.get("stale_phrases", [])
        if not isinstance(phrases, list) or any(not isinstance(p, str) or not p.strip() for p in phrases):
            raise ValueError(f"checks.{check_name}.stale_phrases must be a list of non-empty strings")
        if status != "success":
            continue
        for phrase in phrases:
            if phrase.casefold() in folded_record:
                findings.append({"check": check_name, "phrase": phrase})
    return findings


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("manifest", type=Path, help="JSON manifest of check statuses and stale phrases")
    parser.add_argument("record", type=Path, help="Markdown verification record to inspect")
    parser.add_argument("--expect-stale", default=None, help="comma-separated check names expected to have stale claims")
    args = parser.parse_args(argv)

    try:
        manifest = json.loads(args.manifest.read_text(encoding="utf-8"))
        record = args.record.read_text(encoding="utf-8")
        findings = find_stale_claims(manifest, record)
    except (OSError, json.JSONDecodeError, ValueError) as exc:
        print(f"INVALID: {exc}", file=sys.stderr)
        return 2

    found_checks = sorted({f["check"] for f in findings})
    for finding in findings:
        print(f"STALE: check={finding['check']} contradicts successful status; phrase={finding['phrase']!r}")

    if args.expect_stale is not None:
        expected = sorted({part.strip() for part in args.expect_stale.split(",") if part.strip()})
        if found_checks == expected:
            print("EXPECTED DIAGNOSTIC: stale proof-gate claims match the fixture")
            return 0
        print(f"UNEXPECTED DIAGNOSTIC: expected checks {expected}, found {found_checks}", file=sys.stderr)
        return 1

    if findings:
        return 1
    print("CONSISTENT: no configured stale-success claims found")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
