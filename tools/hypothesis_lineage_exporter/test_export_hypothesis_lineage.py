#!/usr/bin/env python3
"""Regression tests for hypothesis_lineage_exporter."""

from __future__ import annotations

import json
import subprocess
import sys
import tempfile
from pathlib import Path

THIS_DIR = Path(__file__).resolve().parent
CLI = THIS_DIR / "export_hypothesis_lineage.py"
FIXTURES = THIS_DIR / "fixtures.synthetic.json"


def run_cli(path: Path, *extra: str) -> subprocess.CompletedProcess[str]:
    return subprocess.run(
        [sys.executable, str(CLI), str(path), *extra],
        check=False,
        text=True,
        capture_output=True,
    )


def test_fixture_exports_and_blocks_expected_packets() -> None:
    result = run_cli(FIXTURES)
    assert result.returncode == 0, result.stderr
    payload = json.loads(result.stdout)

    by_id = {item["hypothesis_id"]: item for item in payload}
    assert by_id["HYP-SYN-001"]["admission"] == "exported"
    assert by_id["HYP-SYN-002"]["admission"] == "exported"

    incomplete = by_id["HYP-SYN-BLOCK-001"]
    assert incomplete["admission"] == "blocked"
    assert "missing_measurable_variables" in incomplete["review_flags"]
    assert "missing_evidence_refs" in incomplete["review_flags"]
    assert "missing_falsification_route" in incomplete["review_flags"]

    unsafe = by_id["HYP-SYN-BLOCK-002"]
    assert unsafe["admission"] == "blocked"
    assert "blocked_source_status" in unsafe["review_flags"]
    assert "blocked_privacy_status" in unsafe["review_flags"]
    assert "blocked_claim_status" in unsafe["review_flags"]


def test_fail_on_blocked_uses_nonzero_exit() -> None:
    result = run_cli(FIXTURES, "--fail-on-blocked")
    assert result.returncode == 2


def test_missing_required_field_is_blocked() -> None:
    with tempfile.TemporaryDirectory() as temp_dir:
        path = Path(temp_dir) / "bad.json"
        path.write_text(json.dumps([{"hypothesis_id": "HYP-MISSING"}]), encoding="utf-8")
        result = run_cli(path)

    assert result.returncode == 0
    payload = json.loads(result.stdout)
    assert payload[0]["admission"] == "blocked"
    assert "missing_field:domain" in payload[0]["review_flags"]


def test_every_output_has_required_labels() -> None:
    result = run_cli(FIXTURES)
    payload = json.loads(result.stdout)
    required = {
        "source_status",
        "claim_status",
        "privacy_status",
        "missingness",
        "revision_reason",
        "implementation_status",
        "testability",
        "next_executable_action",
    }
    for item in payload:
        assert required.issubset(item.keys())


if __name__ == "__main__":
    tests = [
        test_fixture_exports_and_blocks_expected_packets,
        test_fail_on_blocked_uses_nonzero_exit,
        test_missing_required_field_is_blocked,
        test_every_output_has_required_labels,
    ]
    for test in tests:
        test()
    print(f"ok - {len(tests)} tests passed")
