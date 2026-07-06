#!/usr/bin/env python3
"""Validate Mirror Cartographer proxy/endpoint separation packets.

No third-party dependencies. This validator intentionally performs semantic checks
that JSON Schema alone cannot express without custom keywords.
"""
from __future__ import annotations

import json
import sys
from pathlib import Path
from typing import Any

ALLOWED_DOMAINS = {
    "scientific_ai",
    "medical_research",
    "veterinary_research",
    "mechanistic_biology",
    "neuroscience",
    "longitudinal_health",
    "hci",
    "privacy_memory",
}
ALLOWED_MEMORY_ACTIONS = {
    "hold_as_hypothesis",
    "promote_to_discovery_candidate",
    "reject_as_endpoint_confusion",
    "route_to_human_review",
}
ADVICE_LIKE_TERMS = ("diagnose", "treat", "cure", "dose", "prescribe", "heal", "guide care")
PROMOTION_ACTIONS = {"promote_to_discovery_candidate"}


def _err(errors: list[str], path: str, message: str) -> None:
    errors.append(f"{path}: {message}")


def _require_string(obj: dict[str, Any], key: str, path: str, errors: list[str], min_len: int = 1) -> str:
    value = obj.get(key)
    if not isinstance(value, str) or len(value.strip()) < min_len:
        _err(errors, f"{path}.{key}", f"must be a string with length >= {min_len}")
        return ""
    return value.strip()


def validate_packet(packet: dict[str, Any]) -> list[str]:
    errors: list[str] = []

    packet_id = _require_string(packet, "packet_id", "$", errors, 12)
    if packet_id and not packet_id.startswith("pep-"):
        _err(errors, "$.packet_id", "must start with 'pep-'")

    domain = _require_string(packet, "domain", "$", errors)
    if domain and domain not in ALLOWED_DOMAINS:
        _err(errors, "$.domain", f"must be one of {sorted(ALLOWED_DOMAINS)}")

    claim = packet.get("claim")
    if not isinstance(claim, dict):
        _err(errors, "$.claim", "must be an object")
        claim = {}
    statement = _require_string(claim, "statement", "$.claim", errors, 20)
    mechanism = _require_string(claim, "mechanistic_basis", "$.claim", errors, 20)
    scope = _require_string(claim, "scope_boundary", "$.claim", errors, 20)

    proxy_signals = packet.get("proxy_signals")
    if not isinstance(proxy_signals, list) or not proxy_signals:
        _err(errors, "$.proxy_signals", "must contain at least one proxy signal")
        proxy_signals = []
    for index, signal in enumerate(proxy_signals):
        path = f"$.proxy_signals[{index}]"
        if not isinstance(signal, dict):
            _err(errors, path, "must be an object")
            continue
        _require_string(signal, "name", path, errors, 3)
        _require_string(signal, "measurement", path, errors, 10)
        _require_string(signal, "why_only_proxy", path, errors, 20)
        _require_string(signal, "failure_mode", path, errors, 20)

    endpoints = packet.get("target_endpoints")
    if not isinstance(endpoints, list) or not endpoints:
        _err(errors, "$.target_endpoints", "must contain at least one target endpoint")
        endpoints = []
    for index, endpoint in enumerate(endpoints):
        path = f"$.target_endpoints[{index}]"
        if not isinstance(endpoint, dict):
            _err(errors, path, "must be an object")
            continue
        _require_string(endpoint, "name", path, errors, 3)
        _require_string(endpoint, "measurement", path, errors, 10)
        _require_string(endpoint, "minimum_followup", path, errors, 5)
        _require_string(endpoint, "promotion_threshold", path, errors, 15)

    horizon = packet.get("time_horizon")
    if not isinstance(horizon, dict):
        _err(errors, "$.time_horizon", "must be an object")
        horizon = {}
    proxy_window = _require_string(horizon, "proxy_window", "$.time_horizon", errors, 5)
    endpoint_window = _require_string(horizon, "endpoint_window", "$.time_horizon", errors, 5)
    _require_string(horizon, "reason_endpoint_needs_longer_window", "$.time_horizon", errors, 20)
    if proxy_window and endpoint_window and proxy_window == endpoint_window:
        _err(errors, "$.time_horizon", "endpoint_window must differ from proxy_window")

    validation = packet.get("validation_plan")
    if not isinstance(validation, dict):
        _err(errors, "$.validation_plan", "must be an object")
        validation = {}
    _require_string(validation, "dataset_boundary", "$.validation_plan", errors, 20)
    _require_string(validation, "comparison_logic", "$.validation_plan", errors, 20)
    confounders = validation.get("confounders")
    if not isinstance(confounders, list) or not confounders:
        _err(errors, "$.validation_plan.confounders", "must list at least one confounder")
    if validation.get("review_required") is not True:
        _err(errors, "$.validation_plan.review_required", "must be true for cure/discovery-adjacent packets")

    falsification = _require_string(packet, "falsification_route", "$", errors, 30)
    memory_action = _require_string(packet, "memory_action", "$", errors)
    if memory_action and memory_action not in ALLOWED_MEMORY_ACTIONS:
        _err(errors, "$.memory_action", f"must be one of {sorted(ALLOWED_MEMORY_ACTIONS)}")

    combined_text = " ".join([statement, mechanism, scope, falsification]).lower()
    if any(term in combined_text for term in ADVICE_LIKE_TERMS) and "research" not in scope.lower():
        _err(errors, "$.claim.scope_boundary", "advice-like language requires explicit research-only boundary")

    if memory_action in PROMOTION_ACTIONS:
        # Promotion requires endpoint-specific threshold plus review and falsification language.
        if not endpoints or validation.get("review_required") is not True:
            _err(errors, "$.memory_action", "promotion requires endpoint evidence and human/reviewer review")
        if "reject" not in falsification.lower() and "revise" not in falsification.lower():
            _err(errors, "$.falsification_route", "promotion-capable packets must state reject or revise conditions")

    return errors


def main(argv: list[str]) -> int:
    if len(argv) != 2:
        print("usage: validate_proxy_endpoint_packet.py <packet-or-fixtures.json>", file=sys.stderr)
        return 2
    path = Path(argv[1])
    data = json.loads(path.read_text(encoding="utf-8"))
    items = data if isinstance(data, list) else [{"name": path.name, "packet": data, "should_pass": True}]
    failed = False
    for item in items:
        packet = item.get("packet", item)
        should_pass = bool(item.get("should_pass", True))
        errors = validate_packet(packet)
        passed = not errors
        print(f"{item.get('name', packet.get('packet_id', 'packet'))}: {'PASS' if passed else 'FAIL'}")
        for error in errors:
            print(f"  - {error}")
        if passed != should_pass:
            failed = True
            print(f"  expected {'PASS' if should_pass else 'FAIL'}")
    return 1 if failed else 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv))
