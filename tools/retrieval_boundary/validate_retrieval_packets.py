#!/usr/bin/env python3
"""
Mirror Cartographer Retrieval Boundary Validator

Validates public-safe retrieval packets and enforces boundary routing rules before
claims can enter discovery memory.

This script intentionally uses only the Python standard library so it can run in
minimal environments. It performs structural checks tailored to the companion
schema plus MC-specific safety and overclaim rules.
"""

from __future__ import annotations

from dataclasses import dataclass
from datetime import datetime
from typing import Any, Dict, List, Tuple
import argparse
import json
import sys

ALLOWED_SOURCE_STATUS = {
    "primary_source",
    "secondary_source",
    "preprint",
    "dataset",
    "benchmark",
    "open_source_tool",
    "synthetic_fixture",
    "unknown",
}

ALLOWED_CLAIM_STATUS = {
    "observed",
    "replicated",
    "hypothesis",
    "speculative",
    "contradicted",
    "insufficient_evidence",
}

ALLOWED_PRIVACY_STATUS = {
    "public_safe",
    "synthetic_only",
    "deidentified_public",
    "blocked_private_or_sensitive",
}

ALLOWED_ROUTES = {
    "accept_to_memory",
    "accept_to_review_queue",
    "route_to_contradiction_ledger",
    "reject_private_or_sensitive",
    "reject_overclaim",
}

ALLOWED_INFERENCE = {
    "index_only",
    "organize_evidence",
    "generate_hypothesis",
    "generate_test",
    "do_not_infer",
}

WEAK_SOURCE_STATES = {"preprint", "unknown", "synthetic_fixture"}
WEAK_CLAIM_STATES = {"speculative", "insufficient_evidence"}
ACCEPT_ROUTES = {"accept_to_memory"}


@dataclass
class ValidationResult:
    packet_id: str
    valid: bool
    route: str
    errors: List[str]
    warnings: List[str]


def _is_nonempty_string(value: Any, min_length: int = 1) -> bool:
    return isinstance(value, str) and len(value.strip()) >= min_length


def _parse_datetime(value: Any) -> bool:
    if not isinstance(value, str):
        return False
    try:
        datetime.fromisoformat(value.replace("Z", "+00:00"))
        return True
    except ValueError:
        return False


def _require_keys(obj: Dict[str, Any], keys: List[str], prefix: str, errors: List[str]) -> None:
    for key in keys:
        if key not in obj:
            errors.append(f"{prefix}: missing required key '{key}'")


def validate_packet(packet: Dict[str, Any]) -> ValidationResult:
    errors: List[str] = []
    warnings: List[str] = []

    required = [
        "schema_version",
        "packet_id",
        "created_utc",
        "source_status",
        "claim_status",
        "privacy_status",
        "missingness",
        "revision_reason",
        "implementation_status",
        "testability",
        "evidence_strength",
        "retrieval_context",
        "claim",
        "evidence_items",
        "boundary_decision",
        "falsification_route",
        "measurable_variables",
        "next_executable_action",
    ]
    _require_keys(packet, required, "packet", errors)

    packet_id = str(packet.get("packet_id", "unknown"))

    if packet.get("schema_version") != "1.0.0":
        errors.append("packet: schema_version must equal 1.0.0")
    if not _is_nonempty_string(packet.get("packet_id"), 9) or not packet_id.startswith("rp_"):
        errors.append("packet: packet_id must start with rp_ and be descriptive")
    if not _parse_datetime(packet.get("created_utc")):
        errors.append("packet: created_utc must be ISO8601 datetime")
    if packet.get("source_status") not in ALLOWED_SOURCE_STATUS:
        errors.append("packet: source_status is not allowed")
    if packet.get("claim_status") not in ALLOWED_CLAIM_STATUS:
        errors.append("packet: claim_status is not allowed")
    if packet.get("privacy_status") not in ALLOWED_PRIVACY_STATUS:
        errors.append("packet: privacy_status is not allowed")

    missingness = packet.get("missingness")
    if not isinstance(missingness, list) or not missingness or not all(_is_nonempty_string(x, 3) for x in missingness):
        errors.append("packet: missingness must be a non-empty list of strings")

    for key in ["revision_reason", "falsification_route", "next_executable_action"]:
        if not _is_nonempty_string(packet.get(key), 10):
            errors.append(f"packet: {key} must be a meaningful string")

    retrieval_context = packet.get("retrieval_context", {})
    if not isinstance(retrieval_context, dict):
        errors.append("retrieval_context: must be object")
        retrieval_context = {}
    _require_keys(retrieval_context, ["domain", "retrieval_question", "intended_memory_route"], "retrieval_context", errors)

    claim = packet.get("claim", {})
    if not isinstance(claim, dict):
        errors.append("claim: must be object")
        claim = {}
    _require_keys(claim, ["plain_language_summary", "operational_form", "allowed_inference_level"], "claim", errors)
    if claim.get("allowed_inference_level") not in ALLOWED_INFERENCE:
        errors.append("claim: allowed_inference_level is not allowed")

    evidence_items = packet.get("evidence_items")
    if not isinstance(evidence_items, list) or not evidence_items:
        errors.append("evidence_items: must be a non-empty list")
        evidence_items = []
    for index, item in enumerate(evidence_items):
        if not isinstance(item, dict):
            errors.append(f"evidence_items[{index}]: must be object")
            continue
        _require_keys(item, ["item_id", "citation_or_source_ref", "evidence_type", "supports_claim", "limitations"], f"evidence_items[{index}]", errors)
        limitations = item.get("limitations")
        if not isinstance(limitations, list) or not limitations:
            errors.append(f"evidence_items[{index}]: limitations must be non-empty")

    measurable_variables = packet.get("measurable_variables")
    if not isinstance(measurable_variables, list) or not measurable_variables:
        errors.append("measurable_variables: must be a non-empty list")
    else:
        for index, variable in enumerate(measurable_variables):
            if not isinstance(variable, dict):
                errors.append(f"measurable_variables[{index}]: must be object")
                continue
            _require_keys(variable, ["name", "measurement_type", "expected_direction"], f"measurable_variables[{index}]", errors)

    boundary = packet.get("boundary_decision", {})
    if not isinstance(boundary, dict):
        errors.append("boundary_decision: must be object")
        boundary = {}
    _require_keys(boundary, ["route", "reason", "blocked_terms_present", "requires_human_review"], "boundary_decision", errors)
    route = str(boundary.get("route", "unknown"))
    if route not in ALLOWED_ROUTES:
        errors.append("boundary_decision: route is not allowed")

    # MC-specific boundary rules.
    privacy_status = packet.get("privacy_status")
    source_status = packet.get("source_status")
    claim_status = packet.get("claim_status")
    evidence_strength = packet.get("evidence_strength")
    allowed_inference = claim.get("allowed_inference_level")

    if privacy_status == "blocked_private_or_sensitive" and route != "reject_private_or_sensitive":
        errors.append("boundary rule: blocked privacy status must route to reject_private_or_sensitive")

    if privacy_status in {"public_safe", "synthetic_only", "deidentified_public"} and route == "reject_private_or_sensitive":
        warnings.append("boundary warning: privacy rejection route used without blocked privacy status")

    weak_or_uncertain = (
        source_status in WEAK_SOURCE_STATES
        or claim_status in WEAK_CLAIM_STATES
        or evidence_strength in {"weak", "unknown", "synthetic"}
    )
    high_inference = allowed_inference in {"generate_hypothesis", "generate_test"}
    if weak_or_uncertain and high_inference and route in ACCEPT_ROUTES:
        errors.append("boundary rule: weak or uncertain evidence with high inference cannot accept_to_memory")

    if claim_status == "contradicted" and route != "route_to_contradiction_ledger":
        errors.append("boundary rule: contradicted claims must route to contradiction ledger")

    if route == "accept_to_memory" and boundary.get("requires_human_review") is True:
        errors.append("boundary rule: packets requiring human review cannot directly accept_to_memory")

    if route == "accept_to_memory" and allowed_inference == "do_not_infer":
        errors.append("boundary rule: do_not_infer packets cannot accept_to_memory")

    return ValidationResult(
        packet_id=packet_id,
        valid=not errors,
        route=route,
        errors=errors,
        warnings=warnings,
    )


def load_packets(path: str) -> List[Tuple[str, Dict[str, Any]]]:
    with open(path, "r", encoding="utf-8") as handle:
        payload = json.load(handle)

    if isinstance(payload, dict) and "fixtures" in payload:
        return [(row.get("expected_result", "unknown"), row["packet"]) for row in payload["fixtures"]]
    if isinstance(payload, dict) and "packet_id" in payload:
        return [("unspecified", payload)]
    if isinstance(payload, list):
        return [("unspecified", row) for row in payload]
    raise ValueError("Input must be a packet, a list of packets, or a fixture file with fixtures[].packet")


def main(argv: List[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description="Validate MC retrieval boundary packets.")
    parser.add_argument("path", help="Path to a retrieval packet JSON file or synthetic fixture file.")
    parser.add_argument("--expect-fixtures", action="store_true", help="Also verify each fixture route equals expected_result.")
    args = parser.parse_args(argv)

    packets = load_packets(args.path)
    results: List[Dict[str, Any]] = []
    exit_code = 0

    for expected, packet in packets:
        result = validate_packet(packet)
        expected_match = expected == "unspecified" or result.route == expected
        if args.expect_fixtures and not expected_match:
            result.errors.append(f"fixture expected route {expected}, got {result.route}")
            result.valid = False
        if not result.valid:
            exit_code = 1
        results.append(
            {
                "packet_id": result.packet_id,
                "valid": result.valid,
                "route": result.route,
                "expected_result": expected,
                "errors": result.errors,
                "warnings": result.warnings,
            }
        )

    print(json.dumps({"results": results}, indent=2, ensure_ascii=False))
    return exit_code


if __name__ == "__main__":
    raise SystemExit(main())
