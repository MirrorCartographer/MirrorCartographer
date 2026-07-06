#!/usr/bin/env python3
"""Executable tests for the MC Actionability Boundary Gate."""

from __future__ import annotations

import copy
import importlib.util
from pathlib import Path

HERE = Path(__file__).resolve().parent
VALIDATOR_PATH = HERE / "validate_actionability_boundary_packets.py"
FIXTURE_PATH = HERE / "fixtures.synthetic.json"

spec = importlib.util.spec_from_file_location("validator", VALIDATOR_PATH)
validator = importlib.util.module_from_spec(spec)
assert spec.loader is not None
spec.loader.exec_module(validator)


def load_named_packets():
    packets = validator.load_packets(FIXTURE_PATH)
    return {packet["packet_id"]: packet for packet in packets}


def test_public_question_prep_packet_passes():
    packets = load_named_packets()
    errors = validator.validate_packet(packets["abg_public_question_prep_pass_001"])
    assert errors == []


def test_private_advice_packet_fails():
    packets = load_named_packets()
    errors = validator.validate_packet(packets["abg_private_advice_reject_001"])
    assert any("private_rejected" in error for error in errors)
    assert any("blocked actionability" in error for error in errors)
    assert any("claim_status cannot be promoted" in error for error in errors)


def test_missingness_as_absence_is_rejected():
    packets = load_named_packets()
    packet = copy.deepcopy(packets["abg_public_question_prep_pass_001"])
    packet["packet_id"] = "abg_missingness_bad_001"
    packet["missingness"]["absence_interpretation_allowed"] = True
    errors = validator.validate_packet(packet)
    assert any("missingness cannot be interpreted as absence" in error for error in errors)


def test_question_prep_without_research_route_is_rejected():
    packets = load_named_packets()
    packet = copy.deepcopy(packets["abg_public_question_prep_pass_001"])
    packet["packet_id"] = "abg_unrouted_question_prep_bad_001"
    packet["permitted_use"] = ["prepare_questions"]
    errors = validator.validate_packet(packet)
    assert any("question prep must be paired" in error for error in errors)


def test_required_prohibitions_are_enforced():
    packets = load_named_packets()
    packet = copy.deepcopy(packets["abg_public_question_prep_pass_001"])
    packet["packet_id"] = "abg_missing_prohibition_bad_001"
    packet["prohibited_use"] = ["diagnosis_or_treatment_advice"]
    errors = validator.validate_packet(packet)
    assert any("missing required prohibitions" in error for error in errors)


def run_all_tests():
    test_public_question_prep_packet_passes()
    test_private_advice_packet_fails()
    test_missingness_as_absence_is_rejected()
    test_question_prep_without_research_route_is_rejected()
    test_required_prohibitions_are_enforced()


if __name__ == "__main__":
    run_all_tests()
    print("PASS: actionability boundary gate tests")
