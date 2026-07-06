#!/usr/bin/env python3
"""Dependency-free tests for generate_negative_controls.py."""

from __future__ import annotations

import importlib.util
import json
import subprocess
import sys
import tempfile
from pathlib import Path

HERE = Path(__file__).resolve().parent
MODULE_PATH = HERE / "generate_negative_controls.py"
FIXTURE_PATH = HERE / "hypotheses.synthetic.json"

spec = importlib.util.spec_from_file_location("generate_negative_controls", MODULE_PATH)
module = importlib.util.module_from_spec(spec)
assert spec and spec.loader
spec.loader.exec_module(module)


def load_fixture():
    return json.loads(FIXTURE_PATH.read_text(encoding="utf-8"))


def test_generates_three_controls_per_hypothesis():
    payload = load_fixture()
    controls = module.generate_controls(payload)
    assert len(controls) == len(payload["hypotheses"]) * 3
    assert {c["control_type"] for c in controls} >= {
        "missing_required_variable",
        "inverted_support_signal",
        "unrelated_domain_distractor",
    }


def test_controls_are_public_safe_and_non_promotional():
    controls = module.generate_controls(load_fixture())
    for control in controls:
        assert control["privacy_status"] == "synthetic_public_safe"
        assert control["claim_status"] == "engineering_test_only"
        assert control["source_status"] == "assistant_generated_synthetic_fixture"
        assert control["expected_route"] == "falsification_or_reject"
        assert "testability" in control and control["testability"]


def test_rejects_private_or_non_synthetic_input():
    payload = load_fixture()
    payload["hypotheses"][0]["privacy_status"] = "private_raw_user_data"
    try:
        module.generate_controls(payload)
    except ValueError as exc:
        assert "not public-safe synthetic" in str(exc)
    else:
        raise AssertionError("Expected private input rejection")


def test_cli_writes_output_file():
    with tempfile.TemporaryDirectory() as tmpdir:
        output_path = Path(tmpdir) / "negative_controls.json"
        result = subprocess.run(
            [sys.executable, str(MODULE_PATH), str(FIXTURE_PATH), "--output", str(output_path)],
            check=False,
            text=True,
            capture_output=True,
        )
        assert result.returncode == 0, result.stderr
        written = json.loads(output_path.read_text(encoding="utf-8"))
        assert len(written) == 6
        assert all(item["control_id"].startswith("NC-") for item in written)


def run_all():
    test_generates_three_controls_per_hypothesis()
    test_controls_are_public_safe_and_non_promotional()
    test_rejects_private_or_non_synthetic_input()
    test_cli_writes_output_file()
    print("negative_control_fixture_generator tests passed")


if __name__ == "__main__":
    run_all()
