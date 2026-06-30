import pytest
from referencing.exceptions import NoSuchResource

from python_schema_registry import build_python_registry, get_python_validator, load_json_file, load_schema_records


RAW_CAPTURE_SCHEMA_ID = "https://mirrorcartographer.dev/schemas/raw-validator-error-capture.v1.schema.json"
REPAIR_MAP_SCHEMA_ID = "https://mirrorcartographer.dev/schemas/repair-category-map.v1.schema.json"


def test_loads_schema_records_with_unique_ids():
    records = load_schema_records()
    ids = [record.id for record in records]
    assert RAW_CAPTURE_SCHEMA_ID in ids
    assert REPAIR_MAP_SCHEMA_ID in ids
    assert len(ids) == len(set(ids))
    assert all(record.repo_path.startswith("mind/schemas/") for record in records)


def test_registry_is_in_memory_and_does_not_fetch_network():
    registry, records = build_python_registry()
    assert len(records) > 0
    assert registry.contents(RAW_CAPTURE_SCHEMA_ID)["$id"] == RAW_CAPTURE_SCHEMA_ID

    with pytest.raises(NoSuchResource):
        registry.contents("https://example.com/not-registered.schema.json")


def test_returns_validator_for_registered_schema():
    validator = get_python_validator(REPAIR_MAP_SCHEMA_ID)
    instance = load_json_file("mind/config/repair-category-map.v1.json")
    errors = sorted(validator.iter_errors(instance), key=lambda error: list(error.absolute_path))
    assert errors == []


def test_rejects_unknown_schema_id():
    with pytest.raises(KeyError):
        get_python_validator("https://example.com/missing.schema.json")
