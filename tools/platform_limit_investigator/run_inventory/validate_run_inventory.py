#!/usr/bin/env python3
"""Compare two saved GitHub Actions run inventories without network access."""
from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path
from typing import Any


def _ids(records: Any, label: str) -> list[str]:
    if not isinstance(records, list):
        raise ValueError(f"{label} must be a list")
    result: list[str] = []
    for index, record in enumerate(records):
        if not isinstance(record, dict):
            raise ValueError(f"{label}[{index}] must be an object")
        run_id = record.get("id")
        if isinstance(run_id, bool) or not isinstance(run_id, (str, int)):
            raise ValueError(f"{label}[{index}].id must be a string or integer, not Boolean")
        normalized = str(run_id).strip()
        if not normalized:
            raise ValueError(f"{label}[{index}].id must not be blank")
        if normalized in result:
            raise ValueError(f"{label} contains duplicate run id {normalized}")
        result.append(normalized)
    return result


def compare_inventory(payload: Any) -> tuple[list[str], list[str]]:
    if not isinstance(payload, dict):
        raise ValueError("root must be an object")
    if "full_api_runs" not in payload or "connector_runs" not in payload:
        raise ValueError("root must contain full_api_runs and connector_runs")
    full_ids = _ids(payload["full_api_runs"], "full_api_runs")
    connector_ids = _ids(payload["connector_runs"], "connector_runs")
    unexpected = sorted(set(connector_ids) - set(full_ids))
    if unexpected:
        raise ValueError("connector inventory contains IDs absent from full API inventory: " + ", ".join(unexpected))
    missing = sorted(set(full_ids) - set(connector_ids))
    return missing, full_ids


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("fixture", type=Path, help="JSON file with full_api_runs and connector_runs arrays")
    parser.add_argument(
        "--expect-missing",
        default=None,
        help="comma-separated missing run IDs expected in a diagnostic fixture; without this, any omission fails",
    )
    args = parser.parse_args(argv)

    try:
        payload = json.loads(args.fixture.read_text(encoding="utf-8"))
        missing, full_ids = compare_inventory(payload)
    except (OSError, json.JSONDecodeError, ValueError) as exc:
        print(f"INVALID: {exc}", file=sys.stderr)
        return 2

    if missing:
        print("INCOMPLETE: connector inventory omits run IDs present in full API inventory: " + ", ".join(missing))
    else:
        print(f"COMPLETE: all {len(full_ids)} run IDs are represented in both inventories")

    if args.expect_missing is not None:
        expected = sorted({part.strip() for part in args.expect_missing.split(",") if part.strip()})
        if missing == expected:
            print("EXPECTED DIAGNOSTIC: observed omissions match the synthetic fixture")
            return 0
        print("UNEXPECTED DIAGNOSTIC: expected missing IDs " + repr(expected), file=sys.stderr)
        return 1

    return 1 if missing else 0


if __name__ == "__main__":
    raise SystemExit(main())
