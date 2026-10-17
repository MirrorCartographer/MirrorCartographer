#!/usr/bin/env python3
from __future__ import annotations

import hashlib
import json
import re
import sys
from pathlib import Path

DIGEST = re.compile(r"^sha256:[0-9a-f]{64}$")
REQUIRED_TOP_LEVEL = {
    "schema", "receipt_id", "capability", "authority", "ownership_boundary",
    "external_dependencies", "exit_paths", "adversarial_evidence",
    "remaining_risks", "next_falsifiable_step", "continuity", "receipt_digest"
}


def canonical_digest(value: object) -> str:
    encoded = json.dumps(value, sort_keys=True, separators=(",", ":")).encode("utf-8")
    return "sha256:" + hashlib.sha256(encoded).hexdigest()


def validate(receipt: dict) -> list[str]:
    failures: list[str] = []
    missing = sorted(REQUIRED_TOP_LEVEL - set(receipt))
    if missing:
        failures.append("missing:" + ",".join(missing))
    if receipt.get("schema") != "foundation.sovereignty-receipt.v1":
        failures.append("schema")
    if receipt.get("authority") != "foundation":
        failures.append("authority")

    boundary = receipt.get("ownership_boundary", {})
    if not boundary.get("software_control_plane"):
        failures.append("software-control-plane")
    if not boundary.get("not_claimed"):
        failures.append("physical-boundary")

    if not receipt.get("exit_paths"):
        failures.append("exit-path")
    if not receipt.get("next_falsifiable_step"):
        failures.append("next-falsifiable-step")

    evidence = receipt.get("adversarial_evidence", [])
    if not evidence:
        failures.append("adversarial-evidence")
    for index, item in enumerate(evidence):
        if not item.get("claim") or not item.get("test"):
            failures.append(f"evidence-{index}-incomplete")
        if item.get("result") not in {"pass", "fail", "unresolved"}:
            failures.append(f"evidence-{index}-result")

    continuity = receipt.get("continuity", {})
    if not isinstance(continuity.get("generation"), int) or continuity.get("generation", 0) < 1:
        failures.append("generation")
    if len(continuity.get("public_views_added", [])) != 2:
        failures.append("exactly-two-public-views")

    supplied = receipt.get("receipt_digest", "")
    if not DIGEST.match(supplied):
        failures.append("receipt-digest-format")
    unsigned = dict(receipt)
    unsigned.pop("receipt_digest", None)
    if supplied != canonical_digest(unsigned):
        failures.append("receipt-digest-mismatch")
    return failures


def main() -> int:
    if len(sys.argv) != 2:
        print("usage: validate_ledger.py RECEIPT.json", file=sys.stderr)
        return 2
    receipt = json.loads(Path(sys.argv[1]).read_text())
    failures = validate(receipt)
    if failures:
        print("REJECT")
        for failure in failures:
            print(f"- {failure}")
        return 1
    print("ACCEPT")
    print(f"capability={receipt['capability']}")
    print("continuity=verified")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
