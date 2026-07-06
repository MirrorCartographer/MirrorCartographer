#!/usr/bin/env python3
"""Regression tests for the public-safe mechanism graph validator."""

from __future__ import annotations

import json
import subprocess
import sys
import unittest
from pathlib import Path

HERE = Path(__file__).resolve().parent
VALIDATOR = HERE / "validate_mechanism_graph.py"
FIXTURES = HERE / "fixtures.synthetic.json"


class MechanismGraphValidatorTests(unittest.TestCase):
    def setUp(self) -> None:
        self.fixtures = json.loads(FIXTURES.read_text(encoding="utf-8"))

    def test_fixture_expectations_match_validator_output(self) -> None:
        result = subprocess.run(
            [sys.executable, str(VALIDATOR), str(FIXTURES)],
            check=False,
            capture_output=True,
            text=True,
        )
        self.assertEqual(result.returncode, 0, result.stderr + result.stdout)
        reports = json.loads(result.stdout)
        by_case = {report["case_id"]: report for report in reports}
        for fixture in self.fixtures:
            self.assertEqual(
                by_case[fixture["case_id"]]["status"],
                fixture["expected_status"],
                fixture["case_id"],
            )

    def test_private_marker_is_rejected(self) -> None:
        result = subprocess.run(
            [sys.executable, str(VALIDATOR), str(FIXTURES)],
            check=True,
            capture_output=True,
            text=True,
        )
        reports = json.loads(result.stdout)
        private_case = next(report for report in reports if report["case_id"] == "invalid_private_marker")
        self.assertIn("private_or_user_specific_marker_detected", private_case["errors"])

    def test_valid_case_has_measurement_reachable_from_causal_path(self) -> None:
        result = subprocess.run(
            [sys.executable, str(VALIDATOR), str(FIXTURES)],
            check=True,
            capture_output=True,
            text=True,
        )
        reports = json.loads(result.stdout)
        valid_case = next(report for report in reports if report["case_id"] == "valid_minimal_public_mechanism")
        self.assertEqual(valid_case["status"], "PASS")
        self.assertEqual(valid_case["metrics"]["measurement_node_count"], 1)
        self.assertEqual(valid_case["metrics"]["observable_output_count"], 1)


if __name__ == "__main__":
    unittest.main()
