#!/usr/bin/env python3
"""Regression tests for collaboration role boundary validation."""
from __future__ import annotations

import importlib.util
import json
from pathlib import Path

HERE = Path(__file__).resolve().parent
MODULE_PATH = HERE / "validate_role_boundary_packet.py"
FIXTURE_PATH = HERE / "fixtures.synthetic.json"

spec = importlib.util.spec_from_file_location("validate_role_boundary_packet", MODULE_PATH)
module = importlib.util.module_from_spec(spec)
assert spec and spec.loader
spec.loader.exec_module(module)


def load_fixtures():
    return json.loads(FIXTURE_PATH.read_text(encoding="utf-8"))


def test_valid_packets_pass():
    fixtures = load_fixtures()
    for packet in fixtures["valid_packets"]:
        errors = module.validate_packet(packet)
        assert errors == [], f"{packet['packet_id']} failed with {errors}"


def test_invalid_packets_fail_for_expected_reason():
    fixtures = load_fixtures()
    for item in fixtures["invalid_packets"]:
        errors = module.validate_packet(item["packet"])
        joined = "|".join(errors)
        assert item["expected_failure_contains"] in joined, (item["name"], errors)


def test_private_data_cannot_be_promoted_as_public_safe():
    packet = load_fixtures()["valid_packets"][0]
    mutated = json.loads(json.dumps(packet))
    mutated["privacy_boundary"]["allowed_data"].append("raw health logs")
    errors = module.validate_packet(mutated)
    assert "public_safe_packet_allows_private_data" in errors


def test_required_roles_are_enforced():
    packet = load_fixtures()["valid_packets"][0]
    mutated = json.loads(json.dumps(packet))
    mutated["collaboration_roles"] = [
        role for role in mutated["collaboration_roles"] if role["role"] != "curator"
    ]
    errors = module.validate_packet(mutated)
    assert any(error.startswith("missing_required_roles") for error in errors)


if __name__ == "__main__":
    test_valid_packets_pass()
    test_invalid_packets_fail_for_expected_reason()
    test_private_data_cannot_be_promoted_as_public_safe()
    test_required_roles_are_enforced()
    print("ok")
