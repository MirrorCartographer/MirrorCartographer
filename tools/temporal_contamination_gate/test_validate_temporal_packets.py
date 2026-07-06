#!/usr/bin/env python3
"""Regression tests for temporal contamination gate."""

from __future__ import annotations

import copy
import json
from pathlib import Path

from validate_temporal_packets import validate_packet

FIXTURE_PATH = Path(__file__).with_name("fixtures.synthetic.json")


def load_packets():
    return json.loads(FIXTURE_PATH.read_text())


def test_pass_pre_window_inference():
    packets = {packet["packet_id"]: packet for packet in load_packets()}
    assert validate_packet(packets["pass_pre_window_inference"]) == []


def test_reject_future_leakage():
    packets = {packet["packet_id"]: packet for packet in load_packets()}
    errors = validate_packet(packets["fail_future_leakage"])
    assert any("allowed_context source is after allowed_source_end_date" in error for error in errors)


def test_reject_validation_without_post_window_target():
    packets = {packet["packet_id"]: packet for packet in load_packets()}
    errors = validate_packet(packets["fail_no_post_window_validation"])
    assert any("validated_after_window requires" in error for error in errors)


def test_reject_private_packet_status():
    packet = copy.deepcopy(load_packets()[0])
    packet["privacy_status"] = "private_raw"
    errors = validate_packet(packet)
    assert any("privacy_status" in error for error in errors)


if __name__ == "__main__":
    test_pass_pre_window_inference()
    test_reject_future_leakage()
    test_reject_validation_without_post_window_target()
    test_reject_private_packet_status()
    print("PASS temporal contamination gate regression tests")
