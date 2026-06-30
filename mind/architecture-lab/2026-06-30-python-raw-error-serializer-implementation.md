# Python raw-error serializer implementation

Date: 2026-06-30

## Architecture question

How should MC implement `python_raw_error_serializer.py` and its first tests so the serializer emits valid `raw-validator-error-capture.v1` JSON for the three seed fixtures and stays byte-stable across repeated local runs?

## Short answer

Implement the Python serializer as a deterministic evidence adapter.

It converts `jsonschema.ValidationError` objects into MC's raw evidence envelope while refusing to make human-readable messages, raw error order, or heuristic best-match selection into CI truth. CI should later validate the capture envelope and compare canonical repair receipts, not this raw error language.

## Current sources checked

- `python-jsonschema` 4.26.0 documents structural `ValidationError` fields: `validator`, `validator_value`, `path`, `absolute_path`, `json_path`, `schema_path`, `absolute_schema_path`, `context`, `cause`, and `parent`.
- The same documentation marks `best_match` as a heuristic whose result may change between versions, so MC must not use it for convergence.
- RFC 6901 defines JSON Pointer escaping: `~` becomes `~0`; `/` becomes `~1`; root is the empty string.
- JSON Schema 2020-12 validation output is structured around validation result units and locations, supporting MC's split between raw captures, canonical receipts, and reviewer reports.

## What changed in understanding

The serializer is not just formatting. It is a trust boundary between a mutable validator library and durable CI evidence.

That creates four implementation constraints:

1. **Location is structural:** derive instance and schema JSON Pointers from `absolute_path` and `absolute_schema_path`/`schema_path`.
2. **Message is debug-only:** preserve `message` only inside `message_policy` with `message_is_ci_invariant: false`.
3. **Context is required evidence:** preserve `ValidationError.context` for `anyOf`/`oneOf` and similar applicator failures.
4. **Output must be byte-stable:** deterministic IDs, sorted serialized errors, bounded value summaries, no full instance/schema dumps by default.

## GitHub implementation added

### `tools/agency-validation/python_raw_error_serializer.py`

Adds these functions:

- `json_pointer_from_path_segments(segments)`
- `safe_json_value_summary(value, max_chars=240, max_items=12)`
- `serialize_nested_validation_error(error, source_order=0, include_message=True, depth=0)`
- `serialize_validation_error(error, fixture_id, source_order=0, include_message=True, depth=0)`
- `serialize_validation_errors(errors, fixture_id, include_message=True)`
- `build_python_raw_error_capture(...)`

Core behavior:

- RFC 6901 pointer escaping.
- Stable raw IDs using SHA-256 over fixture id, source order, keyword, instance pointer, and schema pointer.
- Bounded summaries for `validator_value` so captures do not dump private or oversized values.
- Nested context preservation for compound schema failures.
- Output sorting by instance pointer, schema pointer, keyword, and original source order.
- Capture envelopes compatible with `raw-validator-error-capture.v1.schema.json`.

### `tools/agency-validation/python_raw_error_serializer.test.py`

Adds first structural tests:

- root type failure uses root pointer and `type` keyword;
- required failure points at root object and `/required` schema keyword;
- property names with `/` and `~` are RFC 6901 escaped;
- `anyOf` preserves nested context errors;
- oversized validator values are summarized, not dumped;
- repeated runs produce equal capture objects.

## Durable requirement update

MC validation infrastructure now has this requirement:

> Python raw validator errors must be serialized through deterministic structural fields, bounded debug summaries, and explicit message-policy flags. Raw `jsonschema` message text, raw iteration order, and `best_match` are never CI convergence targets.

## Public-safety boundary

The implementation stores fixture/schema paths, IDs, hashes, locations, keywords, bounded parameter summaries, and optional debug messages. It does not dump complete private fixture bodies or schema bodies by default.

## Next research question

How should MC add the Python path authority and schema registry files so the serializer can be run end-to-end against the three seed fixtures with the same no-network, repo-relative trust boundary already created for Node/Ajv?
