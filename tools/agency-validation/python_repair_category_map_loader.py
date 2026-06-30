"""Governed repair-category map loader for Python receipt generation.

The loader validates the shared map against its schema, builds deterministic
indexes, and rejects governance drift before Python/jsonschema raw captures are
mapped into canonical repair receipts.
"""

from __future__ import annotations

from dataclasses import dataclass
from types import MappingProxyType
from typing import Any, Mapping

from jsonschema.exceptions import ValidationError

from python_schema_registry import get_python_validator, load_json_file


DEFAULT_REPAIR_CATEGORY_MAP_PATH = "mind/config/repair-category-map.v1.json"
REPAIR_CATEGORY_MAP_SCHEMA_ID = "https://mirrorcartographer.dev/schemas/repair-category-map.v1.schema.json"


class RepairCategoryMapError(ValueError):
    """Raised when the shared repair-category map violates loader invariants."""

    def __init__(self, code: str, message: str, details: Mapping[str, Any] | None = None) -> None:
        super().__init__(message)
        self.code = code
        self.details = dict(details or {})


@dataclass(frozen=True)
class RepairCategoryMapIndexes:
    schema_version: str
    categories_by_id: Mapping[str, Mapping[str, Any]]
    mappings_by_keyword: Mapping[str, Mapping[str, Any]]
    active_category_ids: tuple[str, ...]


@dataclass(frozen=True)
class LoadedRepairCategoryMap:
    source_path: str
    map: Mapping[str, Any]
    indexes: RepairCategoryMapIndexes


def _freeze_mapping(mapping: dict[str, Any]) -> Mapping[str, Any]:
    return MappingProxyType(dict(sorted(mapping.items(), key=lambda item: item[0])))


def assert_valid_repair_category_map(
    category_map: Mapping[str, Any],
    *,
    source_path: str = DEFAULT_REPAIR_CATEGORY_MAP_PATH,
) -> Mapping[str, Any]:
    """Validate schema shape and governance invariants for the shared map."""

    validator = get_python_validator(REPAIR_CATEGORY_MAP_SCHEMA_ID)
    errors = sorted(
        validator.iter_errors(category_map),
        key=lambda error: (list(error.absolute_path), list(error.absolute_schema_path), str(error.validator)),
    )
    if errors:
        raise RepairCategoryMapError(
            "SCHEMA_INVALID",
            "Repair category map does not match repair-category-map.v1.schema.json.",
            {
                "source_path": source_path,
                "errors": [_schema_error_summary(error) for error in errors],
            },
        )

    categories: dict[str, Mapping[str, Any]] = {}
    for category in category_map["categories"]:
        category_id = category["category_id"]
        if category_id in categories:
            raise RepairCategoryMapError("DUPLICATE_CATEGORY", f"Duplicate category_id: {category_id}", {"source_path": source_path})
        categories[category_id] = category

    active_count = sum(1 for category in categories.values() if category["status"] == "active")
    max_active = category_map["category_policy"]["max_active_categories"]
    if active_count > max_active:
        raise RepairCategoryMapError(
            "ACTIVE_CATEGORY_LIMIT",
            "Active category count exceeds category_policy.max_active_categories.",
            {"source_path": source_path, "active_count": active_count, "max_active_categories": max_active},
        )

    keyword_mappings: dict[str, Mapping[str, Any]] = {}
    for mapping in category_map["keyword_mappings"]:
        keyword = mapping["validator_keyword"]
        category_id = mapping["canonical_category_id"]
        if category_id not in categories:
            raise RepairCategoryMapError(
                "UNKNOWN_CATEGORY_REFERENCE",
                f"Keyword {keyword} references unknown category {category_id}.",
                {"source_path": source_path},
            )
        if keyword in keyword_mappings:
            raise RepairCategoryMapError("DUPLICATE_KEYWORD_MAPPING", f"Duplicate validator_keyword mapping: {keyword}", {"source_path": source_path})
        keyword_mappings[keyword] = mapping

    if "unknown" not in keyword_mappings:
        raise RepairCategoryMapError("NO_FALLBACK_MAPPING", "Repair category map must include an unknown fallback mapping.", {"source_path": source_path})

    return category_map


def _schema_error_summary(error: ValidationError) -> dict[str, Any]:
    return {
        "validator": str(error.validator),
        "instance_path": list(error.absolute_path),
        "schema_path": list(error.absolute_schema_path),
    }


def build_repair_category_map_indexes(category_map: Mapping[str, Any]) -> RepairCategoryMapIndexes:
    assert_valid_repair_category_map(category_map)
    categories_by_id = _freeze_mapping({category["category_id"]: category for category in category_map["categories"]})
    mappings_by_keyword = _freeze_mapping({mapping["validator_keyword"]: mapping for mapping in category_map["keyword_mappings"]})
    active_category_ids = tuple(sorted(category_id for category_id, category in categories_by_id.items() if category["status"] == "active"))
    return RepairCategoryMapIndexes(
        schema_version=str(category_map["schema_version"]),
        categories_by_id=categories_by_id,
        mappings_by_keyword=mappings_by_keyword,
        active_category_ids=active_category_ids,
    )


def load_repair_category_map(map_path: str = DEFAULT_REPAIR_CATEGORY_MAP_PATH) -> LoadedRepairCategoryMap:
    category_map = load_json_file(map_path)
    assert_valid_repair_category_map(category_map, source_path=map_path)
    return LoadedRepairCategoryMap(
        source_path=map_path,
        map=category_map,
        indexes=build_repair_category_map_indexes(category_map),
    )


def category_for_validator_keyword(
    validator_keyword: str,
    loaded_map: LoadedRepairCategoryMap | None = None,
) -> tuple[Mapping[str, Any], Mapping[str, Any]]:
    loaded = loaded_map or load_repair_category_map()
    mapping = loaded.indexes.mappings_by_keyword.get(validator_keyword) or loaded.indexes.mappings_by_keyword.get("unknown")
    if mapping is None:
        raise RepairCategoryMapError(
            "NO_FALLBACK_MAPPING",
            "Repair category map must include an unknown fallback mapping.",
            {"validator_keyword": validator_keyword, "source_path": loaded.source_path},
        )
    category = loaded.indexes.categories_by_id.get(mapping["canonical_category_id"])
    if category is None:
        raise RepairCategoryMapError(
            "BROKEN_MAPPING_INDEX",
            f"Mapping {validator_keyword} resolved to missing category {mapping['canonical_category_id']}.",
            {"validator_keyword": validator_keyword, "source_path": loaded.source_path},
        )
    return mapping, category
