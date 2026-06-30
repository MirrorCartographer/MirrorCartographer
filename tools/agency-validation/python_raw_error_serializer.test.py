from jsonschema import Draft202012Validator

from python_raw_error_serializer import (
    build_python_raw_error_capture,
    json_pointer_from_path_segments,
    safe_json_value_summary,
    serialize_validation_errors,
)


def collect_errors(schema, instance):
    return list(Draft202012Validator(schema).iter_errors(instance))


def test_json_pointer_escapes_rfc6901_tokens():
    assert json_pointer_from_path_segments([]) == ""
    assert json_pointer_from_path_segments(["a/b", "c~d", 0]) == "/a~1b/c~0d/0"


def test_root_type_failure_serializes_root_pointer_and_type_keyword():
    schema = {"$schema": "https://json-schema.org/draft/2020-12/schema", "type": "object"}
    errors = collect_errors(schema, [])

    serialized = serialize_validation_errors(errors, fixture_id="root-type")

    assert serialized[0]["keyword"] == "type"
    assert serialized[0]["instance_location"]["pointer"] == ""
    assert serialized[0]["message_policy"]["message_is_ci_invariant"] is False


def test_required_failure_uses_object_location_and_required_schema_pointer():
    schema = {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "type": "object",
        "required": ["evidence"],
    }
    errors = collect_errors(schema, {})

    serialized = serialize_validation_errors(errors, fixture_id="missing-evidence")

    assert serialized[0]["keyword"] == "required"
    assert serialized[0]["instance_location"]["pointer"] == ""
    assert serialized[0]["schema_location"]["absolute_pointer"].endswith("/required")


def test_property_path_uses_json_pointer_escaping():
    schema = {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "type": "object",
        "properties": {"a/b~c": {"type": "string"}},
    }
    errors = collect_errors(schema, {"a/b~c": 7})

    serialized = serialize_validation_errors(errors, fixture_id="escaped-prop")

    assert serialized[0]["keyword"] == "type"
    assert serialized[0]["instance_location"]["pointer"] == "/a~1b~0c"


def test_anyof_context_is_preserved_as_nested_evidence():
    schema = {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "anyOf": [{"type": "string"}, {"type": "integer", "minimum": 10}],
    }
    errors = collect_errors(schema, 3)

    serialized = serialize_validation_errors(errors, fixture_id="anyof-context")

    assert serialized[0]["keyword"] == "anyOf"
    assert "nested_raw_errors" in serialized[0]
    assert {entry["keyword"] for entry in serialized[0]["nested_raw_errors"]} >= {"type", "minimum"}


def test_safe_summary_bounds_large_values():
    value = {f"key-{index}": "x" * 200 for index in range(30)}

    summary = safe_json_value_summary(value, max_chars=120, max_items=5)

    assert summary["truncated"] is True
    assert "sha256_16" in summary
    assert "x" * 200 not in str(summary)


def test_capture_is_byte_stable_for_repeated_runs():
    schema = {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "type": "object",
        "required": ["evidence"],
    }
    instance = {}
    errors_a = collect_errors(schema, instance)
    errors_b = collect_errors(schema, instance)

    capture_a = build_python_raw_error_capture(
        fixture_id="seed-002-broken-missing-evidence",
        fixture_path="mind/fixtures/agency-near-miss/v1/seed-002-broken-missing-evidence.json",
        schema_id="https://mirrorcartographer.dev/schemas/raw-validator-error-capture.v1.schema.json",
        schema_path="mind/schemas/raw-validator-error-capture.v1.schema.json",
        errors=errors_a,
        fixture_content=instance,
        schema_content=schema,
    )
    capture_b = build_python_raw_error_capture(
        fixture_id="seed-002-broken-missing-evidence",
        fixture_path="mind/fixtures/agency-near-miss/v1/seed-002-broken-missing-evidence.json",
        schema_id="https://mirrorcartographer.dev/schemas/raw-validator-error-capture.v1.schema.json",
        schema_path="mind/schemas/raw-validator-error-capture.v1.schema.json",
        errors=errors_b,
        fixture_content=instance,
        schema_content=schema,
    )

    assert capture_a == capture_b
    assert capture_a["validation_policy"]["error_order_is_asserted"] is False
    assert capture_a["normalization_guardrail"]["raw_messages_do_not_define_repair_category"] is True
