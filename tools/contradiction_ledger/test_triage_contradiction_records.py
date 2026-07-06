#!/usr/bin/env python3
"""Regression tests for triage_contradiction_records.py."""

from __future__ import annotations

import importlib.util
from pathlib import Path

MODULE_PATH = Path(__file__).with_name("triage_contradiction_records.py")
FIXTURE_PATH = Path(__file__).with_name("fixtures.synthetic.json")

spec = importlib.util.spec_from_file_location("triage_contradiction_records", MODULE_PATH)
module = importlib.util.module_from_spec(spec)
assert spec.loader is not None
spec.loader.exec_module(module)


def test_confirmed_contradiction_ranks_above_control() -> None:
    result = module.triage(module.load_records(FIXTURE_PATH))
    items = result["items"]
    assert items[0]["id"] == "cr-2026-07-05-confirmed-validator-regression"
    assert items[0]["queue"] == "open_regression_or_downgrade_task"
    assert items[-1]["id"] == "cr-2026-07-05-control-agreement"
    assert items[-1]["queue"] == "retain_as_control_or_archive"


def test_ambiguous_missing_data_routes_to_measurement_repair() -> None:
    result = module.triage(module.load_records(FIXTURE_PATH))
    by_id = {item["id"]: item for item in result["items"]}
    ambiguous = by_id["cr-2026-07-05-ambiguous-missing-data"]
    assert ambiguous["queue"] == "repair_missing_measurement"
    assert ambiguous["missing_variable_count"] == 1
    assert ambiguous["priority_score"] > by_id["cr-2026-07-05-control-agreement"]["priority_score"]


def test_output_labels_are_public_safe() -> None:
    result = module.triage(module.load_records(FIXTURE_PATH))
    assert result["source_status"] == "repository_internal_public_safe"
    assert result["claim_status"] == "engineering_triage"
    assert result["privacy_status"] == "public_safe"
    assert result["implementation_status"] == "runner_ready"


if __name__ == "__main__":
    test_confirmed_contradiction_ranks_above_control()
    test_ambiguous_missing_data_routes_to_measurement_repair()
    test_output_labels_are_public_safe()
    print("OK contradiction ledger triage tests passed")
