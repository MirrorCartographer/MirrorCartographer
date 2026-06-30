# Raw Validator Error Capture Format

## Architecture question

How should MC design the raw-error capture format for paired Ajv and python-jsonschema outputs so reports preserve debugging detail without locking CI to unstable validator message wording?

## Short answer

MC should split validator evidence into two layers:

1. `raw-validator-error-capture.v1` stores library-specific evidence for debugging.
2. `canonical-validation-error.v1` stores the normalized repair category used by CI and reviewer reports.

Raw messages, raw error ordering, and validator-specific nested structures are evidence, not contracts. CI should assert convergence on canonical repair categories, declared validation policy, and fixture/schema identity.

## Research basis

- JSON Schema 2020-12 defines output structures with `keywordLocation`, `instanceLocation`, nested `errors`, and output validation schemas. This gives MC a standard vocabulary for location-bearing validation results without requiring every library to expose identical raw objects.
- Ajv exposes `ErrorObject` fields including `keyword`, `instancePath`, `schemaPath`, `params`, optional `propertyName`, optional `message`, and optional verbose fields. This is good evidence, but not stable reviewer language.
- python-jsonschema exposes `ValidationError` attributes including `message`, `validator`, `validator_value`, `path`, `schema_path`, `absolute_path`, `absolute_schema_path`, `json_path`, `context`, and `cause`. This preserves richer path/context detail but uses a different object model than Ajv.
- JSON-Schema-Test-Suite treats implementations as language-agnostic and explicitly recognizes optional/configuration-dependent areas such as `format` validation. MC should copy that posture: declare policy and compare intended validation behavior, not implementation noise.
- Recent JSON Schema research reinforces that modern schema behavior can be complex across implementations, especially with annotation-dependent keywords and validator optimizations. MC should therefore minimize brittle assumptions in CI.

Source URLs:

- https://json-schema.org/draft/2020-12/json-schema-core
- https://ajv.js.org/api.html#validation-errors
- https://python-jsonschema.readthedocs.io/en/stable/errors/
- https://github.com/json-schema-org/JSON-Schema-Test-Suite
- https://arxiv.org/abs/2503.11288
- https://arxiv.org/abs/2503.02770

## Design decision

Add a new raw evidence schema:

`mind/schemas/raw-validator-error-capture.v1.schema.json`

This schema captures:

- validator identity: `name`, `version`, `runtime`, `dialect`
- validation policy: format assertion mode, all-errors mode, message capture mode, and the explicit rule that raw order is not asserted
- fixture and schema references: path, ID, optional content hash
- validation result: valid flag and error count
- raw errors: keyword, instance location, schema location, raw params, optional raw message, optional nested errors
- guardrails: raw messages do not define repair category; raw order does not define convergence; validator agreement does not score symbolic truth

## Stable fields MC should keep

### From Ajv

- `keyword` maps to the first repair-category lookup key.
- `instancePath` maps to `instance_location.pointer`.
- `schemaPath` maps to `schema_location.pointer`.
- `params` maps to `raw_params`.
- `message` may be captured only as debug-only text.
- `propertyName` may help repair `propertyNames` failures.

### From python-jsonschema

- `validator` maps to the first repair-category lookup key.
- `path` / `absolute_path` map to instance path segments and pointer.
- `schema_path` / `absolute_schema_path` map to schema path segments and pointer.
- `json_path` may be preserved as optional debug location.
- `validator_value` may be stored inside `raw_params` when useful.
- `context` maps to `nested_raw_errors` for compound schema failures.
- `message` may be captured only as debug-only text.

## Fields MC should not make brittle

Do not make these CI invariants:

- exact raw message wording
- raw error array order
- exact nested error order under compound keywords
- presence of optional verbose fields
- format validation results unless policy explicitly says format assertions are enabled for both validators
- validator-specific branch selection wording for `anyOf`, `oneOf`, `allOf`, `if`, `then`, `else`, or `not`

## Adapter rule

The adapter should generate three artifacts per fixture pack:

1. Ajv raw capture: `*.ajv.raw-error-capture.json`
2. python-jsonschema raw capture: `*.python-jsonschema.raw-error-capture.json`
3. convergence report: normalized categories, divergence status, and reviewer-readable repair receipts

The raw capture files are for debugging and provenance. The convergence report is for CI and human review.

## Public-safety boundary

The raw capture schema must not store private user text. Fixture content should remain synthetic or abstracted. If a future fixture comes from a private conversation, the runner should store only fixture ID, path, hash, schema path, and abstract repair category unless the content has been explicitly public-sanitized.

## What changed in understanding

The prior `canonical-validation-error.v1` schema already had a `source_error` object, but that object is too small to serve as the full raw evidence layer. It works as a compact receipt envelope. MC now needs a separate raw capture artifact so debugging can be rich while reviewer language stays stable.

This prevents two failure modes:

1. brittle CI that fails when a validator changes message wording; and
2. over-normalized reports that hide the raw evidence needed to fix the adapter.

## Implementation requirements

- Add `raw-validator-error-capture.v1.schema.json`.
- Keep `canonical-validation-error.v1.schema.json` as the repair receipt contract.
- Update the paired runner plan so raw capture files are generated before canonical normalization.
- Require every convergence report to include links or paths to both raw captures.
- Fail CI on canonical category mismatch, missing raw capture, missing declared validation policy, or undeclared format policy mismatch.
- Do not fail CI on raw message mismatch or raw order mismatch.

## Next research question

How should MC implement the first paired runner output directory layout and naming convention so raw captures, canonical repair receipts, and Markdown convergence reports remain easy to diff across CI runs?
