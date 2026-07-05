#!/usr/bin/env python3
"""Regression tests for symbolic-to-operational packet validation."""

from __future__ import annotations

import importlib.util
from pathlib import Path

MODULE_PATH = Path(__file__).resolve().parent / "validate_symbolic_packets.py"
spec = importlib.util.spec_from_file_location("validate_symbolic_packets", MODULE_PATH)
module = importlib.util.module_from_spec(spec)
assert spec.loader is not None
spec.loader.exec_module(module)


def test_synthetic_fixtures_match_expected_classifications() -> None:
    base = Path(__file__).resolve().parent
    exit_code = module.validate_fixture_file(
        base / "fixtures.synthetic.json",
        base / "symbolic_packet_schema.json",
    )
    assert exit_code == 0


def test_duplicate_variable_names_are_rejected() -> None:
    base = Path(__file__).resolve().parent
    schema = module.load_json(base / "symbolic_packet_schema.json")
    fixtures = module.load_json(base / "fixtures.synthetic.json")
    packet = fixtures["fixtures"][0]["packet"]
    packet = dict(packet)
    packet["measurable_variables"] = [
        dict(packet["measurable_variables"][0]),
        dict(packet["measurable_variables"][0]),
    ]
    valid, errors = module.validate_packet(packet, schema)
    assert not valid
    assert any("variable names must be unique" in error for error in errors)


def test_medical_or_animal_domain_requires_advice_leakage_boundary() -> None:
    base = Path(__file__).resolve().parent
    schema = module.load_json(base / "symbolic_packet_schema.json")
    fixtures = module.load_json(base / "fixtures.synthetic.json")
    packet = dict(fixtures["fixtures"][2]["packet"])
    packet["boundary_risks"] = ["unsupported_causality"]
    valid, errors = module.validate_packet(packet, schema)
    assert not valid
    assert any("must include medical_or_veterinary_advice_leakage" in error for error in errors)


if __name__ == "__main__":
    test_synthetic_fixtures_match_expected_classifications()
    test_duplicate_variable_names_are_rejected()
    test_medical_or_animal_domain_requires_advice_leakage_boundary()
    print("symbolic operational validator tests passed")
