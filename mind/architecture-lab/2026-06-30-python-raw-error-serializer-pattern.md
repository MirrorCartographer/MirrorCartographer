# Python raw-error serializer pattern

Date: 2026-06-30

## Architecture question

How should MC define the Python raw-error serializer for `jsonschema.ValidationError` so it preserves useful debugging evidence without tying CI to message wording or error ordering?

## Short answer

Serialize Python validation errors as a stable evidence envelope, not as reviewer language and not as the CI target.

The serializer should walk `ValidationError` objects into `raw-validator-error-capture.v1` records using structural fields first:

1. `validator` -> `keyword`
2. `absolute_path` / `path` -> instance JSON Pointer and path segments
3. `absolute_schema_path` / `schema_path` -> schema JSON Pointer and path segments
4. `json_path` -> optional debug locator
5. `validator_value` -> keyword-specific raw parameter, redacted only if it becomes too large
6. `context` -> nested raw errors for compound keywords such as `anyOf` and `oneOf`
7. `message` -> debug-only string with `message_is_ci_invariant: false`
8. `cause` -> debug metadata only, never a repair-category determinant

CI should compare canonical repair receipts generated from governed repair categories. Raw Python captures remain a diagnostic trail.

## Current repo state this extends

The existing raw capture schema already separates raw evidence from CI assertions:

- `mind/schemas/raw-validator-error-capture.v1.schema.json`
- `mind/architecture-lab/2026-06-30-raw-validator-error-capture-format.md`
- `mind/architecture-lab/2026-06-30-python-parity-registry-and-offline-runner-boundary.md`

This note adds the missing Python-side serializer contract so the next code files can be written without guessing.

## Useful concepts extracted from current sources

### Python `ValidationError` has stable structural fields

`jsonschema.ValidationError` exposes the failed keyword (`validator`), failed keyword value (`validator_value`), instance path (`path`, `absolute_path`, `json_path`), schema path (`schema_path`, `absolute_schema_path`), nested subschema errors (`context`), and non-validation cause (`cause`).

The serializer should prefer these structured fields over the human-readable `message`.

### `context` is evidence, not noise

For compound applicators such as `anyOf` and `oneOf`, the parent error can be too generic. Python `jsonschema` keeps subschema failures in `context`. MC should preserve them as nested raw errors because they explain why a branch failed.

Nested errors should not be sorted by message. Use deterministic structural ordering only:

1. instance pointer
2. schema pointer
3. keyword
4. original enumeration index as `source_order`

### `best_match` is not a CI primitive

`jsonschema.exceptions.best_match` is documented as a heuristic whose result may change between versions. MC may use this only for reviewer summaries later, never for convergence status.

### JSON Schema output formats support MC's split

JSON Schema 2020-12 defines validation output as structured units with locations, validity, and nested results. This supports MC's three-layer model:

- raw validator captures for debugging;
- canonical repair receipts for CI;
- Markdown reports for reviewers.

### Security/resource boundary remains active

The serializer must not dump complete instance or schema objects by default. Python errors expose `instance` and `schema`, but storing full values can leak private data or create giant artifacts. MC should store locations, keyword values, and bounded summaries instead.

## Serializer contract

Create `tools/agency-validation/python_raw_error_serializer.py` with these public functions:

- `json_pointer_from_path_segments(segments)`
- `safe_json_value_summary(value, max_chars=240, max_items=12)`
- `serialize_validation_error(error, source_order=0, include_message=True, depth=0)`
- `serialize_validation_errors(errors, include_message=True)`
- `build_python_raw_error_capture(...)`

### Required serialized raw error shape

Each serialized Python error must produce a `raw_errors[]` item compatible with `raw-validator-error-capture.v1.schema.json`:

- `raw_error_id`: deterministic ID derived from validator name, fixture id, source order, keyword, instance pointer, and schema pointer.
- `keyword`: `error.validator` when present; otherwise `unknown`.
- `instance_location.pointer`: JSON Pointer derived from `error.absolute_path`.
- `instance_location.json_path`: `error.json_path` when present.
- `instance_location.path_segments`: list from `error.absolute_path`.
- `schema_location.pointer`: JSON Pointer derived from `error.schema_path` or `error.absolute_schema_path`.
- `schema_location.absolute_pointer`: JSON Pointer derived from `error.absolute_schema_path` when available.
- `schema_location.path_segments`: list from schema path.
- `message_policy.message_captured`: boolean.
- `message_policy.message_is_ci_invariant`: always `false`.
- `message_policy.message`: optional debug-only message.
- `raw_params.validator_value_summary`: bounded summary of `error.validator_value`.
- `raw_params.cause_type`: optional class name of `error.cause`.
- `raw_params.source_order`: original enumeration index before deterministic report sorting.
- `nested_raw_errors`: recursive context errors with bounded depth.

### JSON Pointer rules

Use RFC-style JSON Pointer escaping:

- `~` becomes `~0`
- `/` becomes `~1`
- root path is the empty string
- integer path segments are rendered as decimal strings

Do not use Python `json_path` as the primary CI location because it is library-specific. Store it only as optional debug evidence.

## Stability rules

The serializer must obey these invariants:

1. **No message dependency**: repair category mapping may look at keyword and location, not message text.
2. **No order dependency**: raw source order can be stored, but convergence cannot depend on raw iteration order.
3. **No full object dumps**: avoid serializing full `error.instance` or `error.schema` by default.
4. **No heuristic dependency**: do not use `best_match` for CI.
5. **No remote resolution**: Python validator construction must use the local registry from the parity boundary.
6. **No private material**: fixtures and reports remain abstract and public-safe.

## Minimal test cases

Add tests that construct synthetic Draft 2020-12 failures and assert serialized structure:

1. Root type failure: root pointer is `""`, keyword is `type`.
2. Nested required failure: instance pointer points to object location; schema pointer ends in `/required`.
3. Property type failure: instance pointer includes escaped property names when needed.
4. Compound `anyOf` failure: parent has `nested_raw_errors` from `context`.
5. Message mutation test: changing `error.message` does not change canonical repair category input.
6. Source order test: reversing input errors does not change sorted canonical receipts.
7. Oversized value test: `validator_value_summary` is bounded and does not dump full data.

## Prototype implementation sketch

The first implementation should be deliberately small:

- Load schema and fixture through Python path authority.
- Build validator through Python schema registry.
- Run `Draft202012Validator.iter_errors(instance)`.
- Enumerate errors once to attach `source_order`.
- Serialize raw errors.
- Sort for output using `(instance_pointer, schema_pointer, keyword, source_order)`.
- Write capture JSON.
- Validate capture JSON against `raw-validator-error-capture.v1.schema.json` before returning success.

## Durable requirement update

MC validation infrastructure now has this requirement:

> Python validation errors must be serialized through structural fields and bounded debug metadata. Human-readable messages, raw iteration order, and heuristic `best_match` output are never CI truth targets. Full instance/schema values are not captured by default.

## Next research question

How should MC implement `python_raw_error_serializer.py` and its first tests so the serializer emits valid `raw-validator-error-capture.v1` JSON for the three seed fixtures and stays byte-stable across repeated local runs?

## Sources consulted

- Python `jsonschema` documentation: `ValidationError` fields, `context`, `cause`, `ErrorTree`, and `best_match` heuristic behavior.
- JSON Schema 2020-12 core specification: output formatting, minimum location fields, nested results, output structures, and security considerations.
- Existing MC artifacts: raw validator capture schema and Python parity/offline runner boundary.
