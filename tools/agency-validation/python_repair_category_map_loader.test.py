from __future__ import annotations

import copy

import pytest

from python_repair_category_map_loader import (
    DEFAULT_REPAIR_CATEGORY_MAP_PATH,
    RepairCategoryMapError,
    assert_valid_repair_category_map,
    category_for_validator_keyword,
    load_repair_category_map,
)


def test_loads_governed_repair_category_map_and_builds_stable_indexes() -> None:
    loaded = load_repair_category_map(DEFAULT_REPAIR_CATEGORY_MAP_PATH)

    assert loaded.map["schema_version"] == "repair-category-map.v1"
    assert "missing_required_field" in loaded.indexes.categories_by_id
    assert loaded.indexes.mappings_by_keyword["required"]["canonical_category_id"] == "missing_required_field"
    assert list(loaded.indexes.active_category_ids) == sorted(loaded.indexes.active_category_ids)


def test_maps_known_and_unknown_validator_keywords_through_same_governed_source() -> None:
    loaded = load_repair_category_map()
    known_mapping, known_category = category_for_validator_keyword("required", loaded)
    unknown_mapping, unknown_category = category_for_validator_keyword("futureValidatorKeyword", loaded)

    assert known_mapping["canonical_category_id"] == "missing_required_field"
    assert known_category["category_id"] == "missing_required_field"
    assert unknown_mapping["validator_keyword"] == "unknown"
    assert unknown_category["category_id"] == "unmapped_validator_signal"


def test_rejects_mappings_that_point_at_unknown_categories() -> None:
    loaded = load_repair_category_map()
    broken = copy.deepcopy(dict(loaded.map))
    broken["keyword_mappings"] = list(broken["keyword_mappings"]) + [
        {
            "validator_keyword": "brokenKeyword",
            "canonical_category_id": "not_a_real_category",
            "mapping_confidence": "boundary",
            "notes": "intentional test failure",
        }
    ]

    with pytest.raises(RepairCategoryMapError) as exc_info:
        assert_valid_repair_category_map(broken)

    assert exc_info.value.code == "UNKNOWN_CATEGORY_REFERENCE"


def test_rejects_duplicate_validator_keyword_mappings() -> None:
    loaded = load_repair_category_map()
    broken = copy.deepcopy(dict(loaded.map))
    broken["keyword_mappings"] = list(broken["keyword_mappings"]) + [copy.deepcopy(broken["keyword_mappings"][0])]

    with pytest.raises(RepairCategoryMapError) as exc_info:
        assert_valid_repair_category_map(broken)

    assert exc_info.value.code == "DUPLICATE_KEYWORD_MAPPING"
