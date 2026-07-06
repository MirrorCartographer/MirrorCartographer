#!/usr/bin/env python3
"""Regression tests for tools/provenance_packet_builder.py."""

from __future__ import annotations

import importlib.util
import json
import tempfile
from pathlib import Path

ROOT = Path(__file__).resolve().parent
MODULE_PATH = ROOT / "provenance_packet_builder.py"
FIXTURE_PATH = ROOT / "provenance_packet_builder_fixtures.synthetic.json"

spec = importlib.util.spec_from_file_location("provenance_packet_builder", MODULE_PATH)
assert spec and spec.loader
mod = importlib.util.module_from_spec(spec)
spec.loader.exec_module(mod)


def test_synthetic_fixtures_are_ready_for_review() -> None:
    with tempfile.TemporaryDirectory() as td:
        output = Path(td) / "out.json"
        summary = mod.run(FIXTURE_PATH, output)
        assert summary["component"] == "provenance_packet_builder"
        assert summary["packet_count"] == 2
        assert summary["ready_count"] == 2
        assert summary["reject_count"] == 0
        data = json.loads(output.read_text(encoding="utf-8"))
        for packet in data["packets"]:
            assert packet["route"] == "ready_for_evidence_review"
            assert packet["boundary_checks"]["public_safe"] is True
            assert packet["boundary_checks"]["raw_private_data_absent"] is True
            assert packet["missingness"]
            assert packet["next_executable_action"]


def test_rejects_private_or_underbounded_packet() -> None:
    item = {
        "id": "bad.synthetic.001",
        "source_kind": "note",
        "source_status": "synthetic_public_safe",
        "privacy_status": "raw_private",
        "claim_text": "Too short",
        "claim_status": "diagnosis",
        "observed_variables": [],
        "evidence_refs": [{}],
        "missingness": [],
        "revision_reason": "too short",
        "next_executable_action": "too short",
    }
    packet = mod.build_packet(item, 0)
    assert packet["route"] == "reject"
    assert any("privacy_status" in err for err in packet["errors"])
    assert any("claim_status" in err for err in packet["errors"])
    assert any("observed_variables" in err for err in packet["errors"])


if __name__ == "__main__":
    test_synthetic_fixtures_are_ready_for_review()
    test_rejects_private_or_underbounded_packet()
    print("provenance_packet_builder tests passed")
