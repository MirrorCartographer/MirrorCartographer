#!/usr/bin/env python3
"""Validate Mirror Cartographer longitudinal signal packets.

This validator is public-safe by design. It rejects packets that preserve
absolute time, private-blocked status, raw transcript leakage, or missing
operational variables. It supports discovery infrastructure only; it does not
produce medical, veterinary, financial, or personal advice.
"""

from __future__ import annotations

import argparse
import json
import re
import sys
from pathlib import Path
from typing import Any

ALLOWED_SOURCE_STATUS = {
    "synthetic",
    "public_dataset",
    "public_literature",
    "deidentified_user_derived",
    "unknown",
}

ALLOWED_CLAIM_STATUS = {
    "observation",
    "candidate_hypothesis",
    "mechanistic_model",
    "prediction",
    "test_result",
    "inconclusive",
    "contradicted",
    "supported",
}

ALLOWED_PRIVACY_STATUS = {"public_safe", "deidentified", "private_blocked"}
ALLOWED_IMPLEMENTATION_STATUS = {"fixture", "prototype", "validated", "rejected"}
ALLOWED_SIGNAL_DOMAINS = {
    "scientific_reasoning",
    "medical_ai_evidence_organization",
    "animal_care_evidence_organization",
    "nervous_system_modeling",
    "human_ai_sensemaking",
    "symbolic_to_operational_translation",
    "collaboration_readiness",
}
ALLOWED_TIME_GRANULARITY = {"event_order", "day_index", "week_index", "month_index", "study_visit"}
ALLOWED_TEST_TYPES = {
    "schema_validation",
    "longitudinal_trend_check",
    "contradiction_check",
    "privacy_check",
    "human_review",
}
ALLOWED_VALUE_TYPES = {"binary", "ordinal", "count", "duration", "ratio", "category", "text_label"}
ALLOWED_RELATIONSHIPS = {"supports", "weakens", "tests", "generates", "contradicts"}
ALLOWED_ADVICE_BOUNDARIES = {"research_organization_only", "question_prep_only", "not_applicable"}

PRIVATE_FIELD_TERMS = {
    "raw_transcript",
    "name",
    "address",
    "diagnosis",
    "pet_identifier",
    "exact_location",
    "financial_detail",
}

ABSOLUTE_TIME_RE = re.compile(
    r"(20\\d{2}[-/]\\d{1,2}[-/]\\d{1,2})|(?:\\d{1,2}:\\d{2})|(?:T\\d{2}:\\d{2}:\\d{2})"
)
PACKET_ID_RE = re.compile(r"^lsp_[a-z0-9_\\-]{8,80}$")
HYPOTHESIS_ID_RE = re.compile(r"^hyp_[a-z0-9_\\-]{6,80}$")


def _require(condition: bool, errors: list[str], message: str) -> None:
    if not condition:
        errors.append(message)


def _is_nonempty_string(value: Any, min_len: int = 1) -> bool:
    return isinstance(value, str) and len(value.strip()) >= min_len


def validate_packet(packet: dict[str, Any]) -> list[str]:
    """Return a list of validation errors. Empty list means valid."""
    errors: list[str] = []

    required = [
        "schema_version",
        "packet_id",
        "source_status",
        "claim_status",
        "privacy_status",
        "revision_reason",
        "implementation_status",
        "testability",
        "time_index",
        "signal_domain",
        "observable_variables",
        "context_boundaries",
        "missingness",
        "hypothesis_link",
        "falsification_route",
        "next_executable_action",
    ]
    for key in required:
        _require(key in packet, errors, f"missing required field: {key}")
    if errors:
        return errors

    _require(packet["schema_version"] == "1.0.0", errors, "schema_version must be 1.0.0")
    _require(isinstance(packet["packet_id"], str) and bool(PACKET_ID_RE.match(packet["packet_id"])), errors, "packet_id must match lsp_* pattern")
    _require(packet["source_status"] in ALLOWED_SOURCE_STATUS, errors, "invalid source_status")
    _require(packet["claim_status"] in ALLOWED_CLAIM_STATUS, errors, "invalid claim_status")
    _require(packet["privacy_status"] in ALLOWED_PRIVACY_STATUS, errors, "invalid privacy_status")
    _require(packet["privacy_status"] != "private_blocked", errors, "private_blocked packets must not enter public-safe longitudinal memory")
    _require(_is_nonempty_string(packet["revision_reason"], 12), errors, "revision_reason too short")
    _require(packet["implementation_status"] in ALLOWED_IMPLEMENTATION_STATUS, errors, "invalid implementation_status")
    _require(packet["signal_domain"] in ALLOWED_SIGNAL_DOMAINS, errors, "invalid signal_domain")
    _require(_is_nonempty_string(packet["falsification_route"], 16), errors, "falsification_route too short")
    _require(_is_nonempty_string(packet["next_executable_action"], 16), errors, "next_executable_action too short")

    testability = packet["testability"]
    _require(isinstance(testability, dict), errors, "testability must be object")
    if isinstance(testability, dict):
        _require(testability.get("is_testable") is True, errors, "is_testable must be true")
        _require(testability.get("test_type") in ALLOWED_TEST_TYPES, errors, "invalid test_type")
        criteria = testability.get("acceptance_criteria")
        _require(isinstance(criteria, list) and len(criteria) >= 1, errors, "acceptance_criteria must be non-empty list")
        if isinstance(criteria, list):
            for idx, item in enumerate(criteria):
                _require(_is_nonempty_string(item, 8), errors, f"acceptance_criteria[{idx}] too short")

    time_index = packet["time_index"]
    _require(isinstance(time_index, dict), errors, "time_index must be object")
    if isinstance(time_index, dict):
        _require(time_index.get("granularity") in ALLOWED_TIME_GRANULARITY, errors, "invalid time granularity")
        _require(time_index.get("absolute_time_removed") is True, errors, "absolute_time_removed must be true")
        sequence_label = time_index.get("sequence_label")
        _require(_is_nonempty_string(sequence_label, 2), errors, "sequence_label too short")
        if isinstance(sequence_label, str):
            _require(not ABSOLUTE_TIME_RE.search(sequence_label), errors, "sequence_label appears to contain absolute timestamp")

    variables = packet["observable_variables"]
    _require(isinstance(variables, list) and len(variables) >= 1, errors, "observable_variables must be non-empty list")
    if isinstance(variables, list):
        for idx, variable in enumerate(variables):
            _require(isinstance(variable, dict), errors, f"observable_variables[{idx}] must be object")
            if not isinstance(variable, dict):
                continue
            _require(_is_nonempty_string(variable.get("name"), 3), errors, f"observable_variables[{idx}].name too short")
            _require(_is_nonempty_string(variable.get("operational_definition"), 16), errors, f"observable_variables[{idx}].operational_definition too short")
            _require(variable.get("value_type") in ALLOWED_VALUE_TYPES, errors, f"observable_variables[{idx}].value_type invalid")
            _require(_is_nonempty_string(variable.get("unit_or_scale"), 2), errors, f"observable_variables[{idx}].unit_or_scale too short")
            _require(_is_nonempty_string(variable.get("collection_method"), 8), errors, f"observable_variables[{idx}].collection_method too short")

    boundaries = packet["context_boundaries"]
    _require(isinstance(boundaries, dict), errors, "context_boundaries must be object")
    if isinstance(boundaries, dict):
        excluded = boundaries.get("excluded_private_fields")
        allowed = boundaries.get("allowed_public_abstractions")
        _require(isinstance(excluded, list), errors, "excluded_private_fields must be list")
        if isinstance(excluded, list):
            excluded_set = {str(item) for item in excluded}
            _require("raw_transcript" in excluded_set, errors, "raw_transcript must be explicitly excluded")
            _require(bool(excluded_set & PRIVATE_FIELD_TERMS), errors, "at least one known private field must be excluded")
        _require(isinstance(allowed, list) and len(allowed) >= 1, errors, "allowed_public_abstractions must be non-empty list")
        _require(boundaries.get("advice_boundary") in ALLOWED_ADVICE_BOUNDARIES, errors, "invalid advice_boundary")

    _require(isinstance(packet["missingness"], list), errors, "missingness must be list")

    link = packet["hypothesis_link"]
    _require(isinstance(link, dict), errors, "hypothesis_link must be object")
    if isinstance(link, dict):
        _require(isinstance(link.get("hypothesis_id"), str) and bool(HYPOTHESIS_ID_RE.match(link["hypothesis_id"])), errors, "hypothesis_id must match hyp_* pattern")
        _require(link.get("relationship") in ALLOWED_RELATIONSHIPS, errors, "invalid hypothesis relationship")

    return errors


def load_packets(path: Path) -> list[dict[str, Any]]:
    data = json.loads(path.read_text(encoding="utf-8"))
    if isinstance(data, dict):
        return [data]
    if isinstance(data, list):
        # fixture files may wrap packets with name/expect_valid metadata
        packets: list[dict[str, Any]] = []
        for item in data:
            if isinstance(item, dict) and "packet" in item:
                packets.append(item["packet"])
            elif isinstance(item, dict):
                packets.append(item)
            else:
                raise ValueError("packet list must contain objects")
        return packets
    raise ValueError("input must be a packet object or list of packet objects")


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description="Validate public-safe longitudinal signal packets.")
    parser.add_argument("path", type=Path, help="JSON packet or fixture file")
    args = parser.parse_args(argv)

    try:
        packets = load_packets(args.path)
    except Exception as exc:  # pragma: no cover - defensive CLI path
        print(f"load_error: {exc}", file=sys.stderr)
        return 2

    any_errors = False
    for idx, packet in enumerate(packets):
        errors = validate_packet(packet)
        if errors:
            any_errors = True
            print(json.dumps({"index": idx, "packet_id": packet.get("packet_id"), "valid": False, "errors": errors}, indent=2))
        else:
            print(json.dumps({"index": idx, "packet_id": packet.get("packet_id"), "valid": True}, indent=2))

    return 1 if any_errors else 0


if __name__ == "__main__":
    raise SystemExit(main())
