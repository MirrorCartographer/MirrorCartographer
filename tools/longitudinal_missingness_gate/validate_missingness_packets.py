#!/usr/bin/env python3
"""
Mirror Cartographer Longitudinal Missingness Gate.

Hypothesis under test:
A cure/discovery-oriented longitudinal memory system should reject packets that
collapse missingness states into false absence. Observed, absent, unknown,
not_collected, not_applicable, and redacted must remain distinct before trend,
hypothesis, or evidence-transition scoring.

This validator is intentionally dependency-light. It performs the semantic checks
that matter even when jsonschema is unavailable in a minimal runtime.
"""
from __future__ import annotations

import argparse
import json
import re
import sys
from pathlib import Path
from typing import Any, Iterable

ALLOWED_SOURCE_STATUS = {
    "synthetic",
    "public_dataset",
    "peer_reviewed",
    "institutional",
    "preprint",
    "mixed_public",
}
ALLOWED_CLAIM_STATUS = {
    "testable_infrastructure_claim",
    "unsupported",
    "inconclusive",
    "supported",
    "contradicted",
}
ALLOWED_PRIVACY_STATUS = {
    "public_safe_synthetic",
    "public_safe_deidentified",
    "public",
}
ALLOWED_STATES = {
    "observed",
    "absent",
    "unknown",
    "not_collected",
    "not_applicable",
    "redacted",
}
REQUIRED_PACKET_FIELDS = {
    "schema_version",
    "packet_id",
    "hypothesis_id",
    "source_status",
    "claim_status",
    "privacy_status",
    "revision_reason",
    "observation_window",
    "variables",
    "falsification_route",
    "next_executable_action",
}


def _err(path: str, message: str) -> str:
    return f"{path}: {message}"


def validate_packet(packet: dict[str, Any]) -> list[str]:
    errors: list[str] = []

    missing = REQUIRED_PACKET_FIELDS - set(packet)
    for field in sorted(missing):
        errors.append(_err(field, "required field missing"))

    if packet.get("schema_version") != "1.0.0":
        errors.append(_err("schema_version", "must equal 1.0.0"))

    packet_id = packet.get("packet_id")
    if not isinstance(packet_id, str) or not re.match(r"^lmg-[a-z0-9-]{8,80}$", packet_id):
        errors.append(_err("packet_id", "must match lmg-[a-z0-9-]{8,80}"))

    hypothesis_id = packet.get("hypothesis_id")
    if not isinstance(hypothesis_id, str) or not re.match(r"^hyp-[a-z0-9-]{6,80}$", hypothesis_id):
        errors.append(_err("hypothesis_id", "must match hyp-[a-z0-9-]{6,80}"))

    if packet.get("source_status") not in ALLOWED_SOURCE_STATUS:
        errors.append(_err("source_status", f"must be one of {sorted(ALLOWED_SOURCE_STATUS)}"))
    if packet.get("claim_status") not in ALLOWED_CLAIM_STATUS:
        errors.append(_err("claim_status", f"must be one of {sorted(ALLOWED_CLAIM_STATUS)}"))
    if packet.get("privacy_status") not in ALLOWED_PRIVACY_STATUS:
        errors.append(_err("privacy_status", "must be public-safe"))

    if len(str(packet.get("revision_reason", ""))) < 12:
        errors.append(_err("revision_reason", "must explain why packet exists"))
    if len(str(packet.get("falsification_route", ""))) < 20:
        errors.append(_err("falsification_route", "must be explicit and testable"))
    if len(str(packet.get("next_executable_action", ""))) < 12:
        errors.append(_err("next_executable_action", "must name a next action"))

    window = packet.get("observation_window")
    if not isinstance(window, dict):
        errors.append(_err("observation_window", "must be an object"))
    else:
        start = window.get("start_index")
        end = window.get("end_index")
        if not isinstance(start, int) or not isinstance(end, int) or end < start:
            errors.append(_err("observation_window", "end_index must be >= start_index"))

    variables = packet.get("variables")
    if not isinstance(variables, list) or not variables:
        errors.append(_err("variables", "must contain at least one variable"))
        return errors

    observed_any = False
    missing_state_any = False
    for vi, variable in enumerate(variables):
        prefix = f"variables[{vi}]"
        if not isinstance(variable, dict):
            errors.append(_err(prefix, "must be an object"))
            continue
        name = variable.get("name")
        if not isinstance(name, str) or not re.match(r"^[a-z][a-z0-9_]{2,60}$", name):
            errors.append(_err(f"{prefix}.name", "must be snake_case and stable"))
        values = variable.get("values")
        if not isinstance(values, list) or len(values) < 2:
            errors.append(_err(f"{prefix}.values", "must contain at least two timepoints"))
            continue
        seen_t: set[int] = set()
        for ti, entry in enumerate(values):
            ep = f"{prefix}.values[{ti}]"
            if not isinstance(entry, dict):
                errors.append(_err(ep, "must be an object"))
                continue
            t = entry.get("t")
            if not isinstance(t, int) or t < 0:
                errors.append(_err(f"{ep}.t", "must be a non-negative integer"))
            elif t in seen_t:
                errors.append(_err(f"{ep}.t", "duplicate time index"))
            else:
                seen_t.add(t)
            state = entry.get("state")
            if state not in ALLOWED_STATES:
                errors.append(_err(f"{ep}.state", f"must be one of {sorted(ALLOWED_STATES)}"))
                continue
            if state == "observed":
                observed_any = True
                if "value" not in entry:
                    errors.append(_err(ep, "observed state requires value"))
            if state in {"unknown", "not_collected", "redacted"}:
                missing_state_any = True
                if not str(entry.get("reason", "")).strip():
                    errors.append(_err(ep, f"{state} state requires reason"))
            if state == "absent" and entry.get("value", None) not in (None, False, 0):
                errors.append(_err(ep, "absent state may not carry a positive observation value"))

    if not observed_any:
        errors.append(_err("variables", "at least one observed value is required for longitudinal scoring"))
    if not missing_state_any:
        errors.append(_err("variables", "at least one explicit missingness state is required to exercise the gate"))

    return errors


def load_packets(path: Path) -> Iterable[tuple[str, dict[str, Any], bool | None]]:
    raw = json.loads(path.read_text(encoding="utf-8"))
    if isinstance(raw, list):
        for i, item in enumerate(raw):
            if isinstance(item, dict) and "packet" in item:
                yield str(item.get("name", f"fixture_{i}")), item["packet"], item.get("expect_pass")
            else:
                yield f"packet_{i}", item, None
    elif isinstance(raw, dict):
        yield str(raw.get("packet_id", "packet")), raw, None
    else:
        raise ValueError("Input must be a packet object or list of packet/fixture objects")


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description="Validate MC longitudinal missingness packets.")
    parser.add_argument("path", type=Path, help="JSON packet or fixture file")
    parser.add_argument("--check-fixture-expectations", action="store_true", help="Fail if expect_pass does not match validator result")
    args = parser.parse_args(argv)

    failures = 0
    for name, packet, expect_pass in load_packets(args.path):
        errors = validate_packet(packet)
        passed = not errors
        if args.check_fixture_expectations and expect_pass is not None and bool(expect_pass) != passed:
            failures += 1
            print(f"[EXPECTATION MISMATCH] {name}: expected {expect_pass}, got {passed}")
            for error in errors:
                print(f"  - {error}")
        elif errors:
            failures += 1
            print(f"[FAIL] {name}")
            for error in errors:
                print(f"  - {error}")
        else:
            print(f"[PASS] {name}")

    return 1 if failures else 0


if __name__ == "__main__":
    sys.exit(main())
