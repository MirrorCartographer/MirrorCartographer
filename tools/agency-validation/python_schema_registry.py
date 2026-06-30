"""Offline JSON Schema registry for MC agency validation.

Loads the same repo-local schema inventory used by the Node/Ajv side and exposes
an immutable referencing.Registry for python-jsonschema validators. No network
retrieval is configured.
"""

from __future__ import annotations

import json
from dataclasses import dataclass
from pathlib import Path
from typing import Any, Iterable

from jsonschema import Draft202012Validator
from referencing import Registry, Resource
from referencing.jsonschema import DRAFT202012

from python_path_authority import assert_safe_repo_relative_path, repo_relative_display_path


DEFAULT_SCHEMA_DIR = "mind/schemas"


@dataclass(frozen=True)
class SchemaRecord:
    repo_path: str
    id: str
    schema: dict[str, Any]


def _list_json_files(directory: Path) -> list[Path]:
    return sorted(path for path in directory.rglob("*.json") if path.is_file())


def load_json_file(repo_relative_path: str) -> Any:
    absolute_path = assert_safe_repo_relative_path(repo_relative_path, must_end_with=".json")
    return json.loads(absolute_path.read_text(encoding="utf-8"))


def load_schema_records(schema_dir: str = DEFAULT_SCHEMA_DIR) -> list[SchemaRecord]:
    schema_root = assert_safe_repo_relative_path(schema_dir)
    records: list[SchemaRecord] = []
    seen: set[str] = set()

    for absolute_path in _list_json_files(schema_root):
        repo_path = repo_relative_display_path(absolute_path)
        schema = json.loads(absolute_path.read_text(encoding="utf-8"))
        schema_id = schema.get("$id")
        if not isinstance(schema_id, str) or not schema_id:
            raise ValueError(f"Schema {repo_path} must define a string $id for deterministic registration.")
        if schema_id in seen:
            raise ValueError(f"Duplicate schema $id: {schema_id}")
        seen.add(schema_id)
        records.append(SchemaRecord(repo_path=repo_path, id=schema_id, schema=schema))

    return records


def build_python_registry(schema_dir: str = DEFAULT_SCHEMA_DIR) -> tuple[Registry, list[SchemaRecord]]:
    records = load_schema_records(schema_dir)
    resources: Iterable[tuple[str, Resource]] = (
        (record.id, DRAFT202012.create_resource(record.schema)) for record in records
    )
    registry = Registry().with_resources(resources)
    return registry, records


def get_python_validator(schema_id: str, schema_dir: str = DEFAULT_SCHEMA_DIR) -> Draft202012Validator:
    registry, records = build_python_registry(schema_dir)
    schema_by_id = {record.id: record.schema for record in records}
    if schema_id not in schema_by_id:
        raise KeyError(f"Schema not registered: {schema_id}")
    Draft202012Validator.check_schema(schema_by_id[schema_id])
    return Draft202012Validator(schema_by_id[schema_id], registry=registry)
