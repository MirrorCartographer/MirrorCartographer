#!/usr/bin/env python3
"""Validate public-safe Mirror Cartographer mechanism graph packets.

This validator is intentionally dependency-free so it can run in constrained
CI environments. It checks structural validity, graph references, minimal
causal reachability, public-safety markers, and discovery-pipeline labels.
"""

from __future__ import annotations

import json
import sys
from pathlib import Path
from typing import Any, Dict, Iterable, List, Set

REQUIRED_FIELDS = {
    "schema_version",
    "record_type",
    "graph_id",
    "hypothesis_id",
    "nodes",
    "edges",
    "observable_outputs",
    "required_measurements",
    "known_alternatives",
    "source_status",
    "claim_status",
    "privacy_status",
    "missingness",
    "revision_reason",
    "implementation_status",
    "testability",
    "falsification_route",
    "next_executable_action",
}

NODE_TYPES = {"entity", "process", "measurement", "condition"}
EDGE_RELATIONS = {"causes", "modulates", "correlates", "enables", "inhibits"}
CONFIDENCE = {"low", "moderate", "high"}
SOURCE_STATUS = {"primary", "secondary", "preprint", "synthetic"}
CLAIM_STATUS = {"proposed", "unsupported", "supported", "contradicted", "superseded"}
IMPLEMENTATION_STATUS = {"planned", "implemented", "validated"}
PRIVATE_MARKERS = {
    "user-specific",
    "private transcript",
    "household",
    "address",
    "phone",
    "email",
    "financial",
    "credential",
    "relationship",
    "animal-care",
    "medical record",
    "location detail",
}


def _walk_strings(value: Any) -> Iterable[str]:
    if isinstance(value, str):
        yield value
    elif isinstance(value, dict):
        for child in value.values():
            yield from _walk_strings(child)
    elif isinstance(value, list):
        for child in value:
            yield from _walk_strings(child)


def _has_private_marker(packet: Dict[str, Any]) -> bool:
    text = "\n".join(_walk_strings(packet)).lower()
    return any(marker in text for marker in PRIVATE_MARKERS)


def _reachable(start: str, adjacency: Dict[str, List[str]], targets: Set[str]) -> bool:
    seen: Set[str] = set()
    stack = [start]
    while stack:
        node = stack.pop()
        if node in targets:
            return True
        if node in seen:
            continue
        seen.add(node)
        stack.extend(adjacency.get(node, []))
    return False


def validate_packet(packet: Dict[str, Any]) -> Dict[str, Any]:
    errors: List[str] = []
    warnings: List[str] = []

    missing = sorted(REQUIRED_FIELDS - set(packet))
    if missing:
        errors.append(f"missing_required_fields: {missing}")

    if packet.get("record_type") != "mechanism_graph":
        errors.append("record_type_must_be_mechanism_graph")

    if packet.get("source_status") not in SOURCE_STATUS:
        errors.append("invalid_source_status")
    if packet.get("claim_status") not in CLAIM_STATUS:
        errors.append("invalid_claim_status")
    if packet.get("privacy_status") != "public":
        errors.append("privacy_status_must_be_public")
    if packet.get("implementation_status") not in IMPLEMENTATION_STATUS:
        errors.append("invalid_implementation_status")

    if _has_private_marker(packet):
        errors.append("private_or_user_specific_marker_detected")

    nodes = packet.get("nodes", [])
    edges = packet.get("edges", [])
    outputs = packet.get("observable_outputs", [])

    if not isinstance(nodes, list) or len(nodes) < 2:
        errors.append("at_least_two_nodes_required")
        nodes = []
    if not isinstance(edges, list) or len(edges) < 1:
        errors.append("at_least_one_edge_required")
        edges = []
    if not isinstance(outputs, list) or len(outputs) < 1:
        errors.append("at_least_one_observable_output_required")
        outputs = []
    if not packet.get("required_measurements"):
        errors.append("required_measurements_required")
    if not packet.get("known_alternatives"):
        errors.append("known_alternatives_required")
    if not str(packet.get("falsification_route", "")).strip():
        errors.append("falsification_route_required")

    node_ids: Set[str] = set()
    measurement_nodes: Set[str] = set()
    for node in nodes:
        if not isinstance(node, dict):
            errors.append("node_must_be_object")
            continue
        node_id = node.get("id")
        node_type = node.get("type")
        if not node_id:
            errors.append("node_missing_id")
            continue
        if node_id in node_ids:
            errors.append(f"duplicate_node_id: {node_id}")
        node_ids.add(node_id)
        if node_type not in NODE_TYPES:
            errors.append(f"invalid_node_type: {node_id}")
        if node_type == "measurement":
            measurement_nodes.add(node_id)

    adjacency: Dict[str, List[str]] = {node_id: [] for node_id in node_ids}
    for edge in edges:
        if not isinstance(edge, dict):
            errors.append("edge_must_be_object")
            continue
        source = edge.get("source")
        target = edge.get("target")
        if source not in node_ids:
            errors.append(f"edge_source_missing_node: {source}")
        if target not in node_ids:
            errors.append(f"edge_target_missing_node: {target}")
        if edge.get("relation") not in EDGE_RELATIONS:
            errors.append(f"invalid_edge_relation: {edge.get('relation')}")
        if edge.get("confidence") not in CONFIDENCE:
            errors.append(f"invalid_edge_confidence: {edge.get('confidence')}")
        if source in node_ids and target in node_ids:
            adjacency.setdefault(source, []).append(target)

    if node_ids and not measurement_nodes:
        errors.append("at_least_one_measurement_node_required")

    for output in outputs:
        if not isinstance(output, dict) or not output.get("variable") or not output.get("units"):
            errors.append("observable_output_requires_variable_and_units")

    for edge in edges:
        if isinstance(edge, dict) and edge.get("relation") in {"causes", "modulates", "enables", "inhibits"}:
            source = edge.get("source")
            if source in node_ids and measurement_nodes and not _reachable(source, adjacency, measurement_nodes):
                errors.append(f"causal_edge_cannot_reach_measurement: {source}")

    if len(edges) > 0 and len(node_ids) > 0:
        touched = {edge.get("source") for edge in edges if isinstance(edge, dict)} | {edge.get("target") for edge in edges if isinstance(edge, dict)}
        disconnected = sorted(node_ids - touched)
        if disconnected:
            warnings.append(f"disconnected_nodes: {disconnected}")

    return {
        "status": "PASS" if not errors else "FAIL",
        "errors": errors,
        "warnings": warnings,
        "metrics": {
            "node_count": len(node_ids),
            "edge_count": len(edges),
            "measurement_node_count": len(measurement_nodes),
            "observable_output_count": len(outputs),
        },
    }


def main(argv: List[str]) -> int:
    if len(argv) != 2:
        print("Usage: validate_mechanism_graph.py <packet-or-fixtures.json>", file=sys.stderr)
        return 2

    path = Path(argv[1])
    data = json.loads(path.read_text(encoding="utf-8"))
    cases = data if isinstance(data, list) else [{"case_id": "single_packet", "expected_status": None, "packet": data}]

    reports = []
    exit_code = 0
    for case in cases:
        report = validate_packet(case["packet"])
        expected = case.get("expected_status")
        if expected and report["status"] != expected:
            exit_code = 1
            report["fixture_mismatch"] = {"expected": expected, "actual": report["status"]}
        reports.append({"case_id": case.get("case_id"), **report})

    print(json.dumps(reports, indent=2, sort_keys=True))
    return exit_code


if __name__ == "__main__":
    raise SystemExit(main(sys.argv))
