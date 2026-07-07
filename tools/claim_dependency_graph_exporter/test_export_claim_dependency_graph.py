#!/usr/bin/env python3
"""Tests for claim dependency graph exporter."""

from __future__ import annotations

import importlib.util
import json
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent
MODULE_PATH = ROOT / "export_claim_dependency_graph.py"
FIXTURE_PATH = ROOT / "fixtures.synthetic.json"

spec = importlib.util.spec_from_file_location("export_claim_dependency_graph", MODULE_PATH)
module = importlib.util.module_from_spec(spec)
assert spec and spec.loader
spec.loader.exec_module(module)


def load_fixture():
    with FIXTURE_PATH.open("r", encoding="utf-8") as handle:
        return json.load(handle)


def test_exports_nodes_and_edges():
    result = module.export_graph(load_fixture())
    assert result["summary"]["node_count"] == 5
    assert result["summary"]["edge_count"] >= 5
    assert any(edge["type"] == "depends_on" for edge in result["edges"])
    assert any(edge["type"] == "contradicts" for edge in result["edges"])


def test_blocks_cure_claim_and_unresolved_dependency():
    result = module.export_graph(load_fixture())
    blocked = {item["id"]: item["blockers"] for item in result["blocked_nodes"]}
    assert "hyp.synthetic.blocked" in blocked
    assert "blocked_claim_status" in blocked["hyp.synthetic.blocked"]
    assert "unresolved_depends_on:missing.synthetic.node" in blocked["hyp.synthetic.blocked"]


def test_review_ready_hypothesis_survives_when_public_safe_and_resolved():
    result = module.export_graph(load_fixture())
    ready_ids = {item["id"] for item in result["review_ready_nodes"]}
    assert "hyp.synthetic.001" in ready_ids


def test_blocks_unknown_privacy():
    data = load_fixture()
    data["packets"].append({
        "id": "obs.synthetic.private",
        "kind": "observation",
        "title": "Unsafe private packet",
        "claim_status": "observation",
        "privacy_status": "unknown",
        "source_status": "unknown",
        "missingness": [],
        "depends_on": [],
        "contradicts": [],
        "next_action": "Redact before reuse."
    })
    result = module.export_graph(data)
    blocked = {item["id"]: item["blockers"] for item in result["blocked_nodes"]}
    assert "blocked_privacy_status" in blocked["obs.synthetic.private"]


def test_cli_outputs_parseable_json():
    completed = subprocess.run(
        [sys.executable, str(MODULE_PATH), str(FIXTURE_PATH)],
        check=True,
        capture_output=True,
        text=True,
    )
    parsed = json.loads(completed.stdout)
    assert parsed["summary"]["blocked_count"] >= 1
    assert parsed["run_id"] == "synthetic.claim_dependency_graph.001"


if __name__ == "__main__":
    test_exports_nodes_and_edges()
    test_blocks_cure_claim_and_unresolved_dependency()
    test_review_ready_hypothesis_survives_when_public_safe_and_resolved()
    test_blocks_unknown_privacy()
    test_cli_outputs_parseable_json()
    print("claim_dependency_graph_exporter tests passed")
