#!/usr/bin/env python3
"""Tests for outcome_measure_dictionary_validator."""

from __future__ import annotations

import json
import subprocess
import sys
import tempfile
from pathlib import Path

TOOLS_DIR = Path(__file__).resolve().parent
SCRIPT = TOOLS_DIR / "validate_outcome_measure_dictionary.py"
FIXTURE = TOOLS_DIR / "fixtures.synthetic.json"


def run_cli(*args: str) -> subprocess.CompletedProcess[str]:
    return subprocess.run(
        [sys.executable, str(SCRIPT), *args],
        text=True,
        capture_output=True,
        check=False,
    )


def test_fixture_routes() -> None:
    result = run_cli(str(FIXTURE))
    assert result.returncode == 0, result.stderr
    payload = json.loads(result.stdout)
    assert payload["component"] == "outcome_measure_dictionary_validator"
    summary = payload["summary"]
    assert summary["accepted_measure"] == 1
    assert summary["needs_operational_definition"] == 1
    assert summary["privacy_blocked"] == 1
    assert summary["claim_blocked"] == 1
    assert summary["missingness_blocked"] == 1


def test_output_file() -> None:
    with tempfile.TemporaryDirectory() as tmp:
        output = Path(tmp) / "routes.json"
        result = run_cli(str(FIXTURE), "--output", str(output))
        assert result.returncode == 0, result.stderr
        assert output.exists()
        payload = json.loads(output.read_text(encoding="utf-8"))
        assert "measure_routes" in payload


def test_non_array_input_rejected() -> None:
    with tempfile.TemporaryDirectory() as tmp:
        path = Path(tmp) / "bad.json"
        path.write_text(json.dumps({"not": "an array"}), encoding="utf-8")
        result = run_cli(str(path))
        assert result.returncode == 2
        assert "Input must be a JSON array" in result.stderr


def test_missingness_absent_blocked() -> None:
    measure = {
        "measure_id": "measure.synthetic.no_missingness",
        "domain": "system_eval",
        "label": "bounded synthetic score",
        "unit": "ordinal_0_5",
        "scale_min": 0,
        "scale_max": 5,
        "directionality": "higher_is_more",
        "collection_method": "observer rating",
        "source_status": "synthetic_fixture",
        "claim_status": "measurement_definition",
        "privacy_status": "public_safe"
    }
    with tempfile.TemporaryDirectory() as tmp:
        path = Path(tmp) / "missingness.json"
        path.write_text(json.dumps([measure]), encoding="utf-8")
        result = run_cli(str(path))
        assert result.returncode == 0
        payload = json.loads(result.stdout)
        assert payload["measure_routes"][0]["route"] == "missingness_blocked"


def test_direct_identifier_blocked() -> None:
    measure = {
        "measure_id": "measure.synthetic.identifier",
        "domain": "human_pattern",
        "label": "synthetic score",
        "description": "Contact test@example.com for private record linkage.",
        "unit": "ordinal_0_5",
        "scale_min": 0,
        "scale_max": 5,
        "directionality": "higher_is_more",
        "collection_method": "observer rating",
        "allowed_values": [],
        "source_status": "synthetic_fixture",
        "claim_status": "measurement_definition",
        "privacy_status": "public_safe",
        "missingness": []
    }
    with tempfile.TemporaryDirectory() as tmp:
        path = Path(tmp) / "identifier.json"
        path.write_text(json.dumps([measure]), encoding="utf-8")
        result = run_cli(str(path))
        assert result.returncode == 0
        payload = json.loads(result.stdout)
        assert payload["measure_routes"][0]["route"] == "privacy_blocked"


def main() -> int:
    tests = [
        test_fixture_routes,
        test_output_file,
        test_non_array_input_rejected,
        test_missingness_absent_blocked,
        test_direct_identifier_blocked,
    ]
    for test in tests:
        test()
    print(f"ok - {len(tests)} tests passed")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
