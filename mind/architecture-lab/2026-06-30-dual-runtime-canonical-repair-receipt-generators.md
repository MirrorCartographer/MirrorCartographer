# Dual-runtime canonical repair receipt generator pattern

Date: 2026-06-30
Status: architecture note / implementation contract
Public-safety level: public-safe; no private scenario content; no personal material

## Architecture question

How should MC implement Python and Node canonical repair receipt generators so both consume the shared repair-category-map loader and emit matching category sets in deterministic RFC-8785-compatible order?

## Why this needed deeper understanding

The latest architecture thread established three boundaries:

1. Raw validator capture is evidence, not convergence.
2. `repair-category-map.v1.json` is a governed policy source, not duplicated runtime logic.
3. `canonical-repair-receipt.v1.schema.json` is the first compare-ready artifact.

The missing piece is the adapter/generator layer. Without a strict generator contract, Python and Node can silently diverge even while using the same category map. Drift can appear through different raw error order, different nested-error shapes, different path encodings, optional message text, format-checker configuration, or local hashing differences.

## Current source concepts extracted

### JSON Schema 2020-12 output model

JSON Schema 2020-12 frames validator output around keyword location, instance location, annotations/errors, and nested results. MC should map those concepts into its own neutral receipt fields instead of relying on any one library's native output shape.

Useful concept: compare location/category/error atoms, not human messages.

Source: https://json-schema.org/draft/2020-12/json-schema-core

### Ajv error objects

Ajv exposes structural error properties including `keyword`, `instancePath`, `schemaPath`, and `params`; `message` is optional and may be excluded. MC should treat `message` as debug-only and map primarily from structural fields.

Useful concept: Ajv raw errors are already close to MC's structural atom model, but `params` should be preserved only as bounded evidence, not used as free-form truth.

Source: https://ajv.js.org/api.html

### python-jsonschema ValidationError

python-jsonschema exposes `validator`, `validator_value`, `absolute_path`, `absolute_schema_path`, and nested `context`. Its own documentation shows that messages for compound failures are not enough by themselves and that `context` carries sub-errors.

Useful concept: Python raw errors need flattening into parent/child structural atoms while preserving nested links. Compound keywords should not be collapsed into a single vague error if sub-error keywords provide repair evidence.

Source: https://python-jsonschema.readthedocs.io/en/stable/errors/

### RFC 8785 JSON Canonicalization Scheme

JCS requires recursive lexicographic object-key ordering while preserving array element order. Since MC wants byte-stable receipts, generators must sort declared receipt arrays before serialization, then use recursive key sorting for object serialization.

Useful concept: object-key canonicalization is not enough. Arrays that are semantically sets must have explicit project sort keys before serialization.

Source: https://www.rfc-editor.org/rfc/rfc8785

## Updated understanding

The canonical repair receipt generator is not a validator and not a judge. It is a deterministic adapter.

It performs this flow:

raw validator capture → structural error atoms → shared category-map loader output → grouped canonical repairs → schema-valid receipt → convergence-ready byte output

The generator must be intentionally boring. Its value comes from reducing validator-specific noise without erasing evidence. It should not invent repair categories, interpret private content, call an LLM, or decide whether a scenario is symbolically true.

## Required generator contract

### 1. Shared loader is mandatory

Both generators must receive category policy through the existing loader layer:

- Node: `repair-category-map-loader.mjs`
- Python: `python_repair_category_map_loader.py`

Receipt generator code must not directly parse `mind/config/repair-category-map.v1.json` except through those loaders.

### 2. Input is normalized raw capture, not live validator object

The generator should consume saved raw capture JSON, not live Ajv or python-jsonschema objects. That keeps validation and receipt generation separable.

Minimum expected raw capture fields:

- validator id
- capture id
- fixture ref
- schema ref
- raw errors
- raw error ids
- instance pointer or path segments
- schema pointer or path segments
- keyword / validator keyword
- optional params / validator value summary
- optional nested raw error references

### 3. Structural atom model

Each raw error becomes one or more structural atoms:

- `raw_error_id`
- `validator_keyword`
- `instance_pointer`
- `schema_pointer`
- `nested_raw_error_indexes`
- `validator_id`
- `debug_message_present` boolean only; not message text as convergence input
- bounded `params_summary` where useful

Messages may be preserved in raw captures for human debugging, but receipt identity and category convergence must not depend on them.

### 4. Category mapping

Mapping order:

1. Try exact keyword mapping from loaded `keyword_mappings`.
2. If compound keyword has nested context, map child atoms too, then include parent compound boundary only when it adds repair value.
3. If keyword is unknown, map to `unmapped_validator_signal`.
4. If raw capture indicates schema/reference/dialect failure before fixture validation, map to `schema_reference_or_dialect`.
5. If category sets differ between runtimes for the same fixture, convergence report later maps the comparison failure to `validator_convergence_gap`; individual generators should not self-invent that category unless their own input is explicitly a convergence-comparison raw capture.

### 5. Grouping rules

Canonical repairs should be grouped by:

- `category_id`
- `instance_pointer`
- `schema_pointer`

Within each group:

- collect evidence refs sorted by `raw_error_id`
- collect keyword basis as a unique sorted list
- mapping confidence should choose the most cautious confidence among included mappings, ordered: direct < contextual < boundary < fallback
- reviewer repair prompt and non-meaning must come from the governed category map, not runtime-authored strings

### 6. Deterministic IDs

`repair_id` should be derived from:

- algorithm id
- category id
- fixture id
- schema id
- instance pointer
- schema pointer
- sorted raw error ids
- category map hash

`receipt_id` should be derived from:

- algorithm id
- validator id
- fixture id
- schema id
- raw capture id
- category map hash
- sorted canonical repair identity material

Use SHA-256 and project prefixes already required by `canonical-repair-receipt.v1.schema.json`.

`created_at` is allowed as informational metadata but must not participate in convergence identity.

### 7. Sorting rules before serialization

Sort canonical repairs by:

1. `category_id`
2. `instance_location.pointer`
3. `schema_location.pointer`
4. first `raw_error_id`

Sort evidence refs by:

1. `raw_error_id`
2. `keyword`

Sort keyword basis lexicographically.

Then serialize with recursive object-key ordering. Do not reorder arrays unless the schema declares them as sorted receipt arrays.

### 8. Valid fixture receipt rule

If a fixture is valid:

- `validation_result.valid` is true
- `raw_error_count` is 0
- `canonical_repair_count` is 0
- `canonical_repairs` is an empty array

A valid empty receipt is still useful evidence because it confirms validator/schema/category-map configuration.

## Implementation plan

### Python file

Create:

- `tools/agency-validation/canonical_repair_receipt_generator.py`

Export:

- `load_raw_capture(path_authority, raw_capture_path)`
- `raw_capture_to_atoms(raw_capture)`
- `atoms_to_repairs(atoms, category_map)`
- `build_receipt(raw_capture, repairs, category_map_ref, algorithm_id="canonical-repair-receipt-generator.v1")`
- `canonical_json_bytes(receipt)`

Tests:

- valid capture produces zero repairs
- required/type/enum fixture errors map to expected categories
- nested anyOf errors preserve child keyword evidence
- message text mutation does not change receipt identity
- raw error order mutation does not change receipt identity
- unknown keyword maps to `unmapped_validator_signal`

### Node file

Create:

- `tools/agency-validation/canonical-repair-receipt-generator.mjs`

Export equivalent functions:

- `loadRawCapture(pathAuthority, rawCapturePath)`
- `rawCaptureToAtoms(rawCapture)`
- `atomsToRepairs(atoms, categoryMap)`
- `buildReceipt(rawCapture, repairs, categoryMapRef, algorithmId = "canonical-repair-receipt-generator.v1")`
- `canonicalJsonBytes(receipt)`

Tests should mirror Python with the same fixture pack.

### Shared parity fixture pack

Create small public-safe synthetic captures under:

- `tools/agency-validation/test-fixtures/raw-captures/`

Suggested pack:

1. `valid-empty.python.raw.json`
2. `valid-empty.ajv.raw.json`
3. `required-type-enum.python.raw.json`
4. `required-type-enum.ajv.raw.json`
5. `nested-anyof.python.raw.json`
6. `nested-anyof.ajv.raw.json`
7. `unknown-keyword.python.raw.json`
8. `unknown-keyword.ajv.raw.json`

Expected outputs under:

- `tools/agency-validation/test-fixtures/expected-receipts/`

The fixture content must stay abstract: generic object names, no personal examples, no therapy/diagnostic claims.

## CI acceptance criteria

1. Both generators validate loader output before generating receipts.
2. Both generators validate generated receipts against `canonical-repair-receipt.v1.schema.json`.
3. Python and Node produce matching canonical category sets for paired raw captures.
4. Changing raw message text does not alter receipt identity.
5. Shuffling raw error order does not alter receipt identity.
6. Removing or renaming a category in the map fails before receipt generation.
7. Adding a new raw keyword maps to `unmapped_validator_signal` unless the map is updated through governance.

## Public-safe boundary

This artifact intentionally avoids private content. All examples should use synthetic fixtures such as `fixture-alpha`, `field_name`, `status`, `evidence_items`, and `mode`. The receipt generator should never contain user-specific examples, therapeutic interpretations, health claims, or symbolic assertions.

## Design pattern name

Shared Governance Adapter

Definition: a dual-runtime adapter pattern where each runtime may preserve its own raw evidence shape but must consume one governed policy source and emit a deterministic, schema-valid artifact at the comparison layer.

## Next architecture question

How should MC define the exact raw-capture fixture pack and expected receipt files so Python and Node canonical repair receipt generators can be tested against intentionally different raw error shapes before wiring into the full end-to-end runner?
