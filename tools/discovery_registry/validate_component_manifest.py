#!/usr/bin/env python3
"""Validate public-safe Mirror Cartographer discovery component manifests.

This validator is intentionally dependency-light. It checks the subset of the
schema needed for registry safety, then performs graph-level checks that JSON
Schema alone cannot express: duplicate IDs, missing dependencies, dependency
cycles, packet compatibility, public privacy status, deterministic execution,
and side-effect boundaries.
"""

from __future__ import annotations

import json
import sys
from dataclasses import dataclass, asdict
from pathlib import Path
from typing import Any, Dict, Iterable, List, Set

REQUIRED_FIELDS = {
    "schema_version",
    "record_type",
    "component_id",
    "name",
    "version",
    "category",
    "accepts",
    "produces",
    "entrypoint",
    "dependencies",
    "deterministic",
    "side_effects",
    "privacy_level",
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

ALLOWED_CATEGORIES = {"validator", "generator", "transform", "evaluation", "prototype", "router"}
ALLOWED_SOURCE_STATUS = {"assistant_generated", "synthetic", "public_source", "mixed_public"}
ALLOWED_CLAIM_STATUS = {"infrastructure", "test_fixture", "prototype", "not_scientific_claim"}
ALLOWED_IMPLEMENTATION_STATUS = {"planned", "implemented", "tested", "deprecated"}
PRIVATE_MARKERS = {
    "private",
    "personal",
    "household",
    "health",
    "animal-care",
    "financial",
    "location",
    "relationship",
    "credential",
    "raw transcript",
}


@dataclass
class ValidationReport:
    status: str
    component_count: int
    errors: List[str]
    warnings: List[str]
    execution_order: List[str]

    def to_dict(self) -> Dict[str, Any]:
        return asdict(self)


def _is_nonempty_string(value: Any) -> bool:
    return isinstance(value, str) and bool(value.strip())


def _validate_manifest_shape(manifest: Dict[str, Any], index: int) -> List[str]:
    errors: List[str] = []
    missing = sorted(REQUIRED_FIELDS - set(manifest))
    if missing:
        errors.append(f"manifest[{index}] missing required fields: {missing}")
        return errors

    if manifest["schema_version"] != "1.0":
        errors.append(f"{manifest.get('component_id', index)} has unsupported schema_version")
    if manifest["record_type"] != "discovery_component_manifest":
        errors.append(f"{manifest.get('component_id', index)} has invalid record_type")
    if manifest["category"] not in ALLOWED_CATEGORIES:
        errors.append(f"{manifest['component_id']} has invalid category")
    if manifest["source_status"] not in ALLOWED_SOURCE_STATUS:
        errors.append(f"{manifest['component_id']} has invalid source_status")
    if manifest["claim_status"] not in ALLOWED_CLAIM_STATUS:
        errors.append(f"{manifest['component_id']} has invalid claim_status")
    if manifest["implementation_status"] not in ALLOWED_IMPLEMENTATION_STATUS:
        errors.append(f"{manifest['component_id']} has invalid implementation_status")
    if manifest["privacy_level"] != "public" or manifest["privacy_status"] != "public_safe":
        errors.append(f"{manifest['component_id']} is not marked public-safe")
    if manifest["side_effects"] is not False:
        errors.append(f"{manifest['component_id']} declares side effects; registry validators must be side-effect-free")
    if manifest["deterministic"] is not True:
        errors.append(f"{manifest['component_id']} is nondeterministic; discovery registry requires deterministic stages")

    for list_field in ("accepts", "produces", "dependencies"):
        if not isinstance(manifest[list_field], list):
            errors.append(f"{manifest['component_id']} field {list_field} must be a list")
    for list_field in ("accepts", "produces"):
        if isinstance(manifest.get(list_field), list) and not manifest[list_field]:
            errors.append(f"{manifest['component_id']} field {list_field} cannot be empty")

    entrypoint = manifest.get("entrypoint")
    if not isinstance(entrypoint, dict):
        errors.append(f"{manifest['component_id']} entrypoint must be an object")
    elif not _is_nonempty_string(entrypoint.get("module")) or not _is_nonempty_string(entrypoint.get("function")):
        errors.append(f"{manifest['component_id']} entrypoint requires module and function")

    joined = json.dumps(manifest, sort_keys=True).lower()
    for marker in PRIVATE_MARKERS:
        if marker in joined and marker not in {"private"}:
            errors.append(f"{manifest['component_id']} contains disallowed marker: {marker}")
    return errors


def _find_cycles(ids: Iterable[str], dependencies: Dict[str, List[str]]) -> List[str]:
    visiting: Set[str] = set()
    visited: Set[str] = set()
    cycles: List[str] = []

    def visit(node: str, path: List[str]) -> None:
        if node in visiting:
            cycle_start = path.index(node) if node in path else 0
            cycles.append(" -> ".join(path[cycle_start:] + [node]))
            return
        if node in visited:
            return
        visiting.add(node)
        for dep in dependencies.get(node, []):
            visit(dep, path + [dep])
        visiting.remove(node)
        visited.add(node)

    for component_id in ids:
        visit(component_id, [component_id])
    return cycles


def _topological_order(ids: Iterable[str], dependencies: Dict[str, List[str]]) -> List[str]:
    ordered: List[str] = []
    visited: Set[str] = set()

    def visit(node: str) -> None:
        if node in visited:
            return
        for dep in dependencies.get(node, []):
            visit(dep)
        visited.add(node)
        ordered.append(node)

    for component_id in ids:
        visit(component_id)
    return ordered


def validate_manifests(manifests: List[Dict[str, Any]]) -> ValidationReport:
    errors: List[str] = []
    warnings: List[str] = []

    if not isinstance(manifests, list) or not manifests:
        return ValidationReport("FAIL", 0, ["input must be a non-empty list of manifests"], [], [])

    for index, manifest in enumerate(manifests):
        if not isinstance(manifest, dict):
            errors.append(f"manifest[{index}] must be an object")
            continue
        errors.extend(_validate_manifest_shape(manifest, index))

    ids = [m.get("component_id") for m in manifests if isinstance(m, dict)]
    duplicate_ids = sorted({component_id for component_id in ids if ids.count(component_id) > 1})
    for component_id in duplicate_ids:
        errors.append(f"duplicate component_id: {component_id}")

    by_id = {m["component_id"]: m for m in manifests if isinstance(m, dict) and "component_id" in m}
    dependencies = {component_id: manifest.get("dependencies", []) for component_id, manifest in by_id.items()}

    for component_id, deps in dependencies.items():
        for dep in deps:
            if dep not in by_id:
                errors.append(f"{component_id} depends on missing component: {dep}")

    if not duplicate_ids:
        cycles = _find_cycles(by_id.keys(), dependencies)
        for cycle in cycles:
            errors.append(f"dependency cycle detected: {cycle}")

    for component_id, manifest in by_id.items():
        accepts = set(manifest.get("accepts", []))
        for dep_id in manifest.get("dependencies", []):
            dep = by_id.get(dep_id)
            if not dep:
                continue
            produced = set(dep.get("produces", []))
            if accepts.isdisjoint(produced):
                errors.append(
                    f"packet incompatibility: {component_id} accepts {sorted(accepts)} "
                    f"but dependency {dep_id} produces {sorted(produced)}"
                )

    execution_order = [] if errors else _topological_order(by_id.keys(), dependencies)
    status = "PASS" if not errors else "FAIL"
    return ValidationReport(status, len(manifests), errors, warnings, execution_order)


def load_fixture_or_manifest(path: Path) -> List[Dict[str, Any]]:
    data = json.loads(path.read_text())
    if isinstance(data, list) and data and isinstance(data[0], dict) and "manifests" in data[0]:
        raise ValueError("fixture file contains cases; tests should pass each case['manifests'] separately")
    if isinstance(data, dict):
        return [data]
    if isinstance(data, list):
        return data
    raise ValueError("expected manifest object or manifest list")


def main(argv: List[str]) -> int:
    if len(argv) != 2:
        print("usage: validate_component_manifest.py <manifest-or-manifest-list.json>", file=sys.stderr)
        return 2
    try:
        manifests = load_fixture_or_manifest(Path(argv[1]))
        report = validate_manifests(manifests)
    except Exception as exc:  # pragma: no cover - CLI safety boundary
        report = ValidationReport("FAIL", 0, [str(exc)], [], [])
    print(json.dumps(report.to_dict(), indent=2, sort_keys=True))
    return 0 if report.status == "PASS" else 1


if __name__ == "__main__":
    raise SystemExit(main(sys.argv))
