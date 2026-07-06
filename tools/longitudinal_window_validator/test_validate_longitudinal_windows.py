#!/usr/bin/env python3
"""Regression tests for validate_longitudinal_windows.py."""

from __future__ import annotations

import importlib.util
import json
from pathlib import Path

HERE = Path(__file__).resolve().parent
MODULE_PATH = HERE / "validate_longitudinal_windows.py"
FIXTURE_PATH = HERE / "fixtures.synthetic.json"

spec = importlib.util.spec_from_file_location("validate_longitudinal_windows", MODULE_PATH)
module = importlib.util.module_from_spec(spec)
assert spec and spec.loader
spec.loader.exec_module(module)


def load_fixtures():
    return json.loads(FIXTURE_PATH.read_text(encoding="utf-8"))


def test_fixture_expectations():
    results = module.validate_packets(load_fixtures())
    by_id = {result["packet_id"]: result for result in results}
    assert by_id["lw-valid-001"]["status"] == "PASS"
    assert by_id["lw-invalid-overlap-001"]["status"] == "FAIL"
    assert any("must not overlap" in error for error in by_id["lw-invalid-overlap-001"]["errors"])
    assert by_id["lw-invalid-claim-001"]["status"] == "FAIL"
    assert any("claim_status" in error for error in by_id["lw-invalid-claim-001"]["errors"])
    assert any("missingness.status" in error for error in by_id["lw-invalid-claim-001"]["errors"])


def test_private_residue_rejected():
    packet = load_fixtures()[0]
    packet["email"] = "synthetic@example.invalid"
    result = module.validate_packet(packet)
    assert result["status"] == "FAIL"
    assert any("private residue" in error for error in result["errors"])


def test_non_array_root_rejected():
    results = module.validate_packets({"not": "an array"})
    assert results[0]["status"] == "FAIL"
    assert "root must be a JSON array" in results[0]["errors"]


def test_bad_dates_rejected():
    packet = load_fixtures()[0]
    packet["baseline_window"]["start_date"] = "01-01-2026"
    result = module.validate_packet(packet)
    assert result["status"] == "FAIL"
    assert any("baseline_window.start_date" in error for error in result["errors"])


def test_sparse_observations_rejected():
    packet = load_fixtures()[0]
    packet["observations"] = packet["observations"][:2]
    result = module.validate_packet(packet)
    assert result["status"] == "FAIL"
    assert any("at least three numeric observations" in error for error in result["errors"])


def run_all():
    test_fixture_expectations()
    test_private_residue_rejected()
    test_non_array_root_rejected()
    test_bad_dates_rejected()
    test_sparse_observations_rejected()
    print("PASS longitudinal_window_validator regression tests")


if __name__ == "__main__":
    run_all()
