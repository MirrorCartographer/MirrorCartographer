#!/usr/bin/env python3
"""Tests for review_packet_indexer.

Run from repository root:
python tools/review_packet_indexer/test_index_review_packets.py
"""

from __future__ import annotations

import importlib.util
import json
import tempfile
from pathlib import Path

MODULE_PATH = Path(__file__).with_name("index_review_packets.py")
spec = importlib.util.spec_from_file_location("index_review_packets", MODULE_PATH)
module = importlib.util.module_from_spec(spec)
assert spec.loader is not None
spec.loader.exec_module(module)


def test_fixture_routes_are_deterministic() -> None:
    fixture_path = Path(__file__).with_name("fixtures.synthetic.json")
    packets = module.load_packets(fixture_path)
    result = module.build_index(packets)

    assert result["summary"] == {
        "total_packets": 5,
        "ready_for_review": 1,
        "blocked": 1,
        "needs_redaction": 1,
        "missing_required_fields": 1,
    }

    routes = {item["packet_id"]: item["route"] for item in result["index"]}
    assert routes["pkt-public-ready-001"] == "review_queue"
    assert routes["pkt-redact-001"] == "redaction_queue"
    assert routes["pkt-missing-001"] == "missingness_queue"
    assert routes["pkt-blocked-001"] == "blocked_queue"
    assert routes["pkt-incomplete-001"] == "missingness_queue"

    assert [item["packet_id"] for item in result["index"]] == sorted(routes)


def test_unknown_privacy_is_redaction_queue() -> None:
    packet = {
        "packet_id": "pkt-unknown-privacy",
        "domain": "collaboration",
        "source_status": "unknown",
        "claim_status": "review_needed",
        "privacy_status": "unknown",
        "missingness": [],
        "revision_reason": "Synthetic unknown privacy state.",
        "implementation_status": "draft",
        "testability": "Must not be public-reviewed until privacy is resolved.",
        "next_executable_action": "Resolve privacy status.",
    }
    routed = module.route_packet(packet)
    assert routed.route == "redaction_queue"
    assert routed.reason_codes == ["privacy:unknown"]


def test_malformed_json_exits_nonzero() -> None:
    with tempfile.TemporaryDirectory() as tmpdir:
        bad_input = Path(tmpdir) / "bad.json"
        output = Path(tmpdir) / "out.json"
        bad_input.write_text("{not json", encoding="utf-8")
        exit_code = module.main(["--input", str(bad_input), "--output", str(output)])
        assert exit_code == 2
        assert not output.exists()


def test_cli_writes_expected_output() -> None:
    fixture_path = Path(__file__).with_name("fixtures.synthetic.json")
    with tempfile.TemporaryDirectory() as tmpdir:
        output = Path(tmpdir) / "index.json"
        exit_code = module.main(["--input", str(fixture_path), "--output", str(output)])
        assert exit_code == 0
        payload = json.loads(output.read_text(encoding="utf-8"))
        assert payload["summary"]["total_packets"] == 5
        assert payload["index"][0]["packet_id"] == "pkt-blocked-001"


if __name__ == "__main__":
    test_fixture_routes_are_deterministic()
    test_unknown_privacy_is_redaction_queue()
    test_malformed_json_exits_nonzero()
    test_cli_writes_expected_output()
    print("review_packet_indexer tests passed")
