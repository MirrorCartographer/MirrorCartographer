#!/usr/bin/env python3
"""Validate public-safe longitudinal observation windows for Mirror Cartographer.

This validator is intentionally conservative. It does not infer medical or
veterinary meaning. It only decides whether a packet is structurally safe enough
for downstream pattern tracking, falsification routing, and evidence review.
"""

from __future__ import annotations

import json
import re
import sys
from datetime import date
from pathlib import Path
from typing import Any, Dict, List, Tuple

PUBLIC_SAFE_PRIVACY = {"synthetic_public_safe", "deidentified_public_safe", "public_safe"}
ALLOWED_CLAIM_STATUS = {"observation_window", "candidate_signal", "needs_more_data"}
PRIVATE_RESIDUE_KEYS = {
    "name",
    "full_name",
    "email",
    "phone",
    "address",
    "street_address",
    "medical_record_number",
    "mrn",
    "account_id",
    "raw_message",
    "private_note",
    "clinician_instruction",
    "veterinarian_instruction",
}
REQUIRED_TOP_LEVEL = {
    "packet_id",
    "domain",
    "source_status",
    "claim_status",
    "privacy_status",
    "missingness",
    "revision_reason",
    "implementation_status",
    "testability",
    "next_executable_action",
    "subject_scope",
    "variable",
    "unit",
    "baseline_window",
    "comparison_window",
    "observations",
    "falsification_route",
}
DATE_RE = re.compile(r"^\d{4}-\d{2}-\d{2}$")


def parse_date(value: Any) -> date | None:
    if not isinstance(value, str) or not DATE_RE.match(value):
        return None
    try:
        return date.fromisoformat(value)
    except ValueError:
        return None


def has_private_residue(value: Any) -> List[str]:
    """Return dotted key paths that contain prohibited public-memory fields."""
    found: List[str] = []

    def walk(node: Any, path: str) -> None:
        if isinstance(node, dict):
            for key, child in node.items():
                child_path = f"{path}.{key}" if path else str(key)
                if str(key).lower() in PRIVATE_RESIDUE_KEYS:
                    found.append(child_path)
                walk(child, child_path)
        elif isinstance(node, list):
            for index, child in enumerate(node):
                walk(child, f"{path}[{index}]")

    walk(value, "")
    return found


def validate_window(name: str, window: Any) -> Tuple[List[str], date | None, date | None]:
    errors: List[str] = []
    if not isinstance(window, dict):
        return [f"{name} must be an object"], None, None

    start = parse_date(window.get("start_date"))
    end = parse_date(window.get("end_date"))
    if start is None:
        errors.append(f"{name}.start_date must be ISO YYYY-MM-DD")
    if end is None:
        errors.append(f"{name}.end_date must be ISO YYYY-MM-DD")
    if start and end and end < start:
        errors.append(f"{name}.end_date must be on or after start_date")

    count = window.get("observation_count")
    if not isinstance(count, int) or count < 3:
        errors.append(f"{name}.observation_count must be integer >= 3")

    return errors, start, end


def validate_packet(packet: Dict[str, Any]) -> Dict[str, Any]:
    errors: List[str] = []

    missing_keys = sorted(REQUIRED_TOP_LEVEL - set(packet.keys()))
    if missing_keys:
        errors.append("missing required fields: " + ", ".join(missing_keys))

    residue = has_private_residue(packet)
    if residue:
        errors.append("private residue fields present: " + ", ".join(residue))

    if packet.get("privacy_status") not in PUBLIC_SAFE_PRIVACY:
        errors.append("privacy_status must be public-safe")

    if packet.get("claim_status") not in ALLOWED_CLAIM_STATUS:
        errors.append("claim_status must be observation_window, candidate_signal, or needs_more_data")

    missingness = packet.get("missingness")
    if not isinstance(missingness, dict):
        errors.append("missingness must be an object")
    else:
        if missingness.get("status") != "explicit":
            errors.append("missingness.status must be explicit")
        if not isinstance(missingness.get("missing_count"), int) or missingness.get("missing_count") < 0:
            errors.append("missingness.missing_count must be integer >= 0")
        reason = missingness.get("reason")
        if not isinstance(reason, str) or not reason.strip():
            errors.append("missingness.reason must be non-empty")

    baseline_errors, baseline_start, baseline_end = validate_window("baseline_window", packet.get("baseline_window"))
    comparison_errors, comparison_start, comparison_end = validate_window("comparison_window", packet.get("comparison_window"))
    errors.extend(baseline_errors)
    errors.extend(comparison_errors)

    if baseline_start and baseline_end and comparison_start and comparison_end:
        overlap = baseline_start <= comparison_end and comparison_start <= baseline_end
        if overlap:
            errors.append("baseline_window and comparison_window must not overlap")

    observations = packet.get("observations")
    if not isinstance(observations, list) or not observations:
        errors.append("observations must be a non-empty list")
    else:
        dated_values = 0
        for index, obs in enumerate(observations):
            if not isinstance(obs, dict):
                errors.append(f"observations[{index}] must be an object")
                continue
            if parse_date(obs.get("date")) is None:
                errors.append(f"observations[{index}].date must be ISO YYYY-MM-DD")
            if not isinstance(obs.get("value"), (int, float)) or isinstance(obs.get("value"), bool):
                errors.append(f"observations[{index}].value must be numeric")
            else:
                dated_values += 1
            if not isinstance(obs.get("source_kind"), str) or not obs.get("source_kind").strip():
                errors.append(f"observations[{index}].source_kind must be non-empty")
        if dated_values < 3:
            errors.append("at least three numeric observations are required")

    for field in ["source_status", "revision_reason", "implementation_status", "testability", "next_executable_action", "variable", "unit", "falsification_route"]:
        if not isinstance(packet.get(field), str) or not packet.get(field, "").strip():
            errors.append(f"{field} must be non-empty")

    status = "PASS" if not errors else "FAIL"
    return {
        "packet_id": packet.get("packet_id", "<missing>"),
        "status": status,
        "errors": errors,
        "route": "longitudinal_signal_triage" if status == "PASS" else "repair_required",
    }


def validate_packets(packets: Any) -> List[Dict[str, Any]]:
    if not isinstance(packets, list):
        return [{"packet_id": "<root>", "status": "FAIL", "errors": ["root must be a JSON array"], "route": "repair_required"}]
    results: List[Dict[str, Any]] = []
    for packet in packets:
        if not isinstance(packet, dict):
            results.append({"packet_id": "<non-object>", "status": "FAIL", "errors": ["packet must be object"], "route": "repair_required"})
        else:
            results.append(validate_packet(packet))
    return results


def main(argv: List[str]) -> int:
    if len(argv) != 2:
        print("Usage: validate_longitudinal_windows.py <packets.json>", file=sys.stderr)
        return 2

    path = Path(argv[1])
    packets = json.loads(path.read_text(encoding="utf-8"))
    results = validate_packets(packets)
    print(json.dumps({"results": results}, indent=2, sort_keys=True))
    return 0 if all(result["status"] == "PASS" for result in results) else 1


if __name__ == "__main__":
    raise SystemExit(main(sys.argv))
