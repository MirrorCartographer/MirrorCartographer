#!/usr/bin/env python3
"""Export public-safe Mirror Cartographer claim packets as a dependency graph.

This tool is intentionally conservative. It does not make medical, veterinary,
or scientific claims. It only routes packets for review readiness.
"""

from __future__ import annotations

import argparse
import json
import sys
from collections import Counter
from pathlib import Path
from typing import Any, Dict, List

SAFE_PRIVACY = {"public_safe", "synthetic", "redacted"}
BLOCKED_PRIVACY = {"private", "unknown"}
BLOCKED_CLAIMS = {"advice", "cure_claim"}
VALID_EDGE_TYPES = {"depends_on", "contradicts"}


def load_json(path: str) -> Dict[str, Any]:
    with Path(path).open("r", encoding="utf-8") as handle:
        data = json.load(handle)
    if not isinstance(data, dict):
        raise ValueError("Input must be a JSON object.")
    return data


def normalize_list(value: Any) -> List[str]:
    if value is None:
        return []
    if not isinstance(value, list):
        return ["__INVALID_LIST__"]
    return [str(item) for item in value]


def packet_blockers(packet: Dict[str, Any], known_ids: set[str]) -> List[str]:
    blockers: List[str] = []
    if not packet.get("id"):
        blockers.append("missing_id")
    if packet.get("privacy_status") in BLOCKED_PRIVACY:
        blockers.append("blocked_privacy_status")
    if packet.get("privacy_status") not in SAFE_PRIVACY | BLOCKED_PRIVACY:
        blockers.append("unknown_privacy_label")
    if packet.get("claim_status") in BLOCKED_CLAIMS:
        blockers.append("blocked_claim_status")
    if "missingness" not in packet or not isinstance(packet.get("missingness"), list):
        blockers.append("missing_explicit_missingness_array")
    for field in VALID_EDGE_TYPES:
        refs = normalize_list(packet.get(field, []))
        if refs == ["__INVALID_LIST__"]:
            blockers.append(f"invalid_{field}_list")
        for ref in refs:
            if ref != "__INVALID_LIST__" and ref not in known_ids:
                blockers.append(f"unresolved_{field}:{ref}")
    if not str(packet.get("next_action", "")).strip():
        blockers.append("missing_next_action")
    return blockers


def export_graph(data: Dict[str, Any]) -> Dict[str, Any]:
    run_id = str(data.get("run_id", "unknown_run"))
    packets = data.get("packets", [])
    if not isinstance(packets, list):
        raise ValueError("Input field 'packets' must be an array.")

    known_ids = {str(packet.get("id")) for packet in packets if isinstance(packet, dict) and packet.get("id")}
    nodes: List[Dict[str, Any]] = []
    edges: List[Dict[str, str]] = []
    blocked_nodes: List[Dict[str, Any]] = []
    review_ready_nodes: List[Dict[str, Any]] = []

    for packet in packets:
        if not isinstance(packet, dict):
            blocked_nodes.append({"id": "__invalid_packet__", "blockers": ["packet_not_object"]})
            continue

        packet_id = str(packet.get("id", ""))
        blockers = packet_blockers(packet, known_ids)
        missingness = normalize_list(packet.get("missingness", []))
        node = {
            "id": packet_id,
            "kind": packet.get("kind", "unknown"),
            "title": packet.get("title", ""),
            "claim_status": packet.get("claim_status", "unknown"),
            "privacy_status": packet.get("privacy_status", "unknown"),
            "source_status": packet.get("source_status", "unknown"),
            "missingness": missingness,
            "blockers": blockers,
            "next_action": packet.get("next_action", ""),
        }
        nodes.append(node)

        for ref in normalize_list(packet.get("depends_on", [])):
            if ref != "__INVALID_LIST__":
                edges.append({"from": ref, "to": packet_id, "type": "depends_on"})
        for ref in normalize_list(packet.get("contradicts", [])):
            if ref != "__INVALID_LIST__":
                edges.append({"from": packet_id, "to": ref, "type": "contradicts"})

        if blockers:
            blocked_nodes.append({"id": packet_id, "blockers": blockers})
        elif packet.get("kind") in {"hypothesis", "review_packet", "falsification_task"}:
            review_ready_nodes.append({"id": packet_id, "next_action": packet.get("next_action", "")})

    summary = {
        "node_count": len(nodes),
        "edge_count": len(edges),
        "blocked_count": len(blocked_nodes),
        "review_ready_count": len(review_ready_nodes),
        "kinds": dict(Counter(node["kind"] for node in nodes)),
    }
    return {
        "run_id": run_id,
        "nodes": nodes,
        "edges": edges,
        "blocked_nodes": blocked_nodes,
        "review_ready_nodes": review_ready_nodes,
        "summary": summary,
    }


def main(argv: List[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description="Export MC claim dependency graph JSON.")
    parser.add_argument("input_json", help="Path to dependency packet JSON file.")
    args = parser.parse_args(argv)
    try:
        result = export_graph(load_json(args.input_json))
    except Exception as exc:  # pragma: no cover - CLI guard
        print(json.dumps({"error": str(exc)}, indent=2), file=sys.stderr)
        return 2
    print(json.dumps(result, indent=2, sort_keys=True))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
