# Canonical Repair Receipt Generator Pattern

Date: 2026-06-30
Status: proposed implementation pattern
Public-safety posture: public-safe; no private user material; treats validation as infrastructure evidence only.

## Architecture question

How should MC define the first canonical repair receipt generator that maps Python raw captures and Ajv raw captures into governed `repair-category-map.v1` categories without depending on raw message wording?

## Current research basis

- JSON Schema 2020-12 defines recommended output units around validation result, keyword location, instance location, error/annotation detail, and nested causes. This supports a receipt model based on stable structural coordinates rather than human message prose.
- Ajv exposes validation errors as structured objects with fields such as `keyword`, `instancePath`, `schemaPath`, `params`, and optional `message`. This makes `keyword` and pointer-like fields the primary adapter input; `message` stays evidence only.
- python-jsonschema exposes `ValidationError` fields including `validator`, `validator_value`, `path`, `schema_path`, `absolute_path`, `absolute_schema_path`, `context`, `instance`, and `schema`. It explicitly describes `message` as human-readable and notes that `best_match` is a heuristic whose result may change between versions.
- RFC 6901 JSON Pointer escaping gives a deterministic representation for instance/schema coordinates: `~` becomes `~0` and `/` becomes `~1`.
- Modern JSON Schema behavior can be complex around dynamic references and annotation-dependent keywords, so MC should not infer semantic truth from validator agreement.

Sources reviewed:

- https://json-schema.org/draft/2020-12/json-schema-core
- https://ajv.js.org/api.html#validation-errors
- https://python-jsonschema.readthedocs.io/en/stable/errors/
- https://www.rfc-editor.org/rfc/rfc6901
- https://arxiv.org/abs/2307.10034

## Understanding change

Before this step, MC had raw captures and governed repair categories, but the missing bridge was the deterministic receipt generator. The generator is not a judge. It is a translation boundary:

raw validator output -> structural signal extraction -> governed keyword mapping -> canonical repair receipt -> convergence comparison

The receipt should be the first object CI compares. Raw captures remain attached for debugging, but raw order, wording, and library-specific nested formatting must not be CI truth.

## Design pattern

### 1. Inputs

The generator accepts:

- `raw-validator-error-capture.v1` from Ajv
- `raw-validator-error-capture.v1` from python-jsonschema
- `repair-category-map.v1.json`
- fixture identity metadata: fixture id, fixture path, schema id, schema path, validator id, validator version

It must reject:

- raw captures missing validator identity
- raw captures whose fixture/schema identity does not match the run manifest
- category ids not present in the active governed map
- unescaped or non-canonical pointer strings

### 2. Stable mapping keys

Use these fields, in priority order:

1. validator keyword: Ajv `keyword`; Python `validator`
2. instance pointer: Ajv `instancePath`; Python `absolute_path` converted to RFC 6901 pointer
3. schema pointer: Ajv `schemaPath`; Python `absolute_schema_path` converted to RFC 6901 pointer
4. structured params: Ajv `params`; Python derived fields such as missing property, expected type, allowed values, and bounds when safely extractable
5. nested context: preserved for compound schemas but not flattened into independent categories unless the map says to descend

Never use as the primary mapping key:

- `message`
- display order
- stringified full instance
- stringified full schema
- heuristic `best_match`
- LLM interpretation

### 3. Receipt object contract

A canonical receipt should contain:

- `schema_version`: `canonical-repair-receipt.v1`
- `receipt_id`: stable hash of fixture id, validator id, keyword, instance pointer, schema pointer, and canonical category id
- `fixture_id`
- `fixture_path`
- `schema_id`
- `validator`: `ajv` or `python-jsonschema`
- `validator_version`
- `raw_error_id`
- `keyword`
- `instance_pointer`
- `schema_pointer`
- `canonical_category_id`
- `mapping_confidence`
- `repair_label`
- `reviewer_repair_prompt`
- `non_meaning`
- `evidence_refs`: pointer paths into the raw capture, not duplicated raw blobs
- `adapter_notes`: short bounded text

### 4. Compound schema rule

For `anyOf`, `oneOf`, `allOf`, `not`, `if`, `then`, and `else`, the generator should emit one top-level `compound_schema_boundary` receipt and preserve nested child errors as `evidence_refs`. A later adapter version may produce branch-specific child receipts only when branch intent is encoded in the schema or fixture metadata.

This avoids false precision when Ajv and python-jsonschema expose branch failures differently.

### 5. Format rule

For `format`, the generator must record a `format_boundary` category only when the run manifest states that format checking was enabled for that validator. If format policy differs between validators, produce `schema_reference_or_dialect` or configuration failure before fixture failure.

### 6. Unmapped signal rule

Unknown keywords map to `unmapped_validator_signal`. This is adapter debt, not content meaning. The reviewer must first try to map the signal to an existing active category before proposing a new category.

### 7. Convergence comparison

The convergence report should compare normalized receipt sets by:

- fixture id
- schema id
- canonical category id
- instance pointer
- stable keyword group

It should ignore:

- raw message wording
- raw error order
- validator-specific params not normalized into the receipt
- nested error formatting differences

## Prototype implementation plan

1. Add `tools/agency-validation/canonical_repair_receipts.py`.
2. Add `tools/agency-validation/canonical-repair-receipts.mjs` only if Node/Ajv receipt generation must happen separately; otherwise generate all receipts from raw captures in Python for one deterministic implementation.
3. Add `mind/schemas/canonical-repair-receipt.v1.schema.json`.
4. Add tests for the three seed fixtures:
   - required field -> `missing_required_field`
   - wrong type -> `wrong_value_type`
   - extra field -> `unexpected_extra_field`
5. Add one compound schema fixture only after simple receipts are stable.
6. Validate generated receipts against the receipt schema before convergence comparison.
7. Make Markdown reports summarize receipt categories, not raw error messages.

## Acceptance criteria

- Running the generator twice on the same raw captures produces byte-identical receipts.
- Ajv and python-jsonschema raw captures for the same simple fixture converge to the same canonical category.
- Raw messages can change without changing receipt identity, unless the structural fields changed.
- Any unknown keyword produces `unmapped_validator_signal` and fails as adapter debt only when the expected fixture pack does not allow it.
- No receipt claims symbolic truth, clinical meaning, user intent, manipulation, or safety status.

## Durable decision

MC will treat canonical repair receipts as the CI comparison layer. Validators supply evidence; the repair-category map supplies governed language; the receipt generator supplies deterministic translation. Meaning remains outside the validator harness.

## Next research question

How should MC define `canonical-repair-receipt.v1.schema.json` so receipt identity, evidence references, category governance, and byte-stable ordering are enforceable before convergence comparison runs?
