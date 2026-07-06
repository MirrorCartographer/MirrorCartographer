#!/usr/bin/env python3
"""Regression tests for the open-ended task gate."""

from __future__ import annotations

import json
from pathlib import Path

from validate_open_ended_task_packet import validate_packet

HERE = Path(__file__).resolve().parent


def test_fixtures() -> None:
    payload = json.loads((HERE / "fixtures.synthetic.json").read_text(encoding="utf-8"))
    for fixture in payload["fixtures"]:
        errors = validate_packet(fixture["packet"])
        actual = "pass" if not errors else "fail"
        assert actual == fixture["expected"], (fixture["name"], errors)


def test_raw_private_data_rejected() -> None:
    packet = json.loads((HERE / "fixtures.synthetic.json").read_text(encoding="utf-8"))["fixtures"][0]["packet"]
    packet["dataset_boundary"]["raw_private_data_allowed"] = True
    errors = validate_packet(packet)
    assert any("raw private data" in error for error in errors)


if __name__ == "__main__":
    test_fixtures()
    test_raw_private_data_rejected()
    print("OK open-ended task gate tests passed")
