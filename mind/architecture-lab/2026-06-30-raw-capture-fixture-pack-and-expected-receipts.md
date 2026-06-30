# Raw-capture fixture pack and expected receipt contract

Date: 2026-06-30
Status: architecture note / fixture contract
Public-safety level: public-safe; synthetic fixtures only; no personal, therapeutic, diagnostic, or private scenario material

## Architecture question

How should MC define the exact raw-capture fixture pack and expected receipt files so Python and Node canonical repair receipt generators can be tested against intentionally different raw error shapes before wiring into the full end-to-end runner?

## Why this needed deeper understanding

The previous architecture note defined the generator contract but left one implementation risk unresolved: if Python and Node tests use identical normalized raw captures, they can pass while hiding the real problem. Ajv and python-jsonschema do not emit the same native error shape. MC should test the disagreement on purpose.

The fixture layer must therefore prove four things:

1. Runtime-specific raw evidence can differ.
2. Message wording and raw error order do not define identity.
3. Shared category governance produces the same canonical category sets.
4. Expected receipts are comparison artifacts, not private meaning artifacts.

## Current source concepts extracted

### JSON Schema 2020-12 output model

JSON Schema 2020-12 describes validator output in terms of keyword locations, instance locations, nested results, and error details. MC should use those as conceptual anchors for fixture coverage, but not assume every validator uses the official recommended output format natively.

Source: https://json-schema.org/draft/2020-12/json-schema-core

Useful concept: fixture expectations should normalize around keyword, instance location, schema location, and nested error structure.

### Ajv error objects

Ajv exposes structural error objects with fields such as `keyword`, `instancePath`, `schemaPath`, and keyword-specific `params`. Its documentation also notes that `message` is optional depending on options.

Source: https://ajv.js.org/api.html

Useful concept: Ajv fixtures should preserve `params` as bounded evidence while ensuring `message` mutation cannot change expected receipts.

### python-jsonschema ValidationError

python-jsonschema exposes `validator`, `validator_value`, `absolute_path`, `absolute_schema_path`, and nested `context`. Compound validators such as `anyOf` can carry sub-errors in `context`.

Source: https://python-jsonschema.readthedocs.io/en/stable/errors/

Useful concept: Python fixtures should include at least one nested compound case where child errors carry the useful repair category evidence.

### RFC 8785 JSON Canonicalization Scheme

RFC 8785 defines deterministic JSON canonicalization through strict JSON serialization constraints and lexicographic object-key ordering. It does not decide semantic ordering for arrays.

Source: https://www.rfc-editor.org/rfc/rfc8785

Useful concept: expected receipts need explicit project-level array ordering before canonical serialization. Object-key sorting alone is insufficient.

## Updated understanding

The fixture pack is not sample data. It is a drift detector.

Its purpose is to make runtime-specific disagreement visible at the raw layer and impossible at the canonical layer, unless the shared category map or generator contract changes deliberately.

MC should define the pack as a two-level test spine:

raw capture pair -> canonical receipt pair -> category-set comparison

The raw captures may differ. The canonical receipt byte output may differ where validator identity or raw capture identity is included. The canonical category set for paired fixtures must match.

## Fixture directory contract

Create the fixture pack under:

- `tools/agency-validation/test-fixtures/raw-captures/`
- `tools/agency-validation/test-fixtures/expected-receipts/`
- `tools/agency-validation/test-fixtures/expected-category-sets/`

Do not place private or live MC sessions in these fixtures. All instance data must be synthetic and dull by design.

## Exact raw-capture fixture pack

### 1. Valid empty case

Files:

- `raw-captures/valid-empty.python.raw.json`
- `raw-captures/valid-empty.ajv.raw.json`

Purpose:

- Prove both generators can emit a schema-valid empty receipt.
- Prove zero raw errors still creates useful configuration evidence.

Expected canonical behavior:

- `validation_result.valid = true`
- `raw_error_count = 0`
- `canonical_repair_count = 0`
- `canonical_repairs = []`
- expected category set: `[]`

Synthetic instance shape:

- object with `id`, `status`, and `evidence_items`
- all fields valid

### 2. Required/type/enum case

Files:

- `raw-captures/required-type-enum.python.raw.json`
- `raw-captures/required-type-enum.ajv.raw.json`

Purpose:

- Prove common scalar/object shape errors converge even when Python and Ajv encode missing-property details differently.

Required raw signals:

- missing required field
- wrong primitive type
- enum violation

Expected categories:

- required-field-missing category from the governed map
- type-mismatch category from the governed map
- enum-or-allowed-value category from the governed map

Acceptance rule:

- Raw ordering may differ.
- Native error messages may differ.
- Expected category set must match exactly.

### 3. Additional properties / closed shape case

Files:

- `raw-captures/additional-property.python.raw.json`
- `raw-captures/additional-property.ajv.raw.json`

Purpose:

- Prove MC catches boundary drift when an instance includes undeclared fields.
- This is a common governance case because unrecognized fields can hide accidental schema expansion.

Required raw signal:

- `additionalProperties` or equivalent validator keyword

Expected categories:

- additional-or-unevaluated-property category from the governed map

Acceptance rule:

- Evidence refs must preserve the extra property name only if bounded and synthetic.
- The receipt must not echo large object values.

### 4. Nested anyOf compound case

Files:

- `raw-captures/nested-anyof.python.raw.json`
- `raw-captures/nested-anyof.ajv.raw.json`

Purpose:

- Prove compound parent errors do not erase child repair evidence.
- Python may expose child failures through `context`; Ajv may expose nested or separate errors depending on options.

Required raw signals:

- parent `anyOf` failure
- at least two child failures with distinct useful keywords, such as `required` and `type`

Expected categories:

- compound-schema-branch-mismatch category from the governed map, if the map defines it
- child required-field-missing category
- child type-mismatch category

Acceptance rule:

- Child keyword evidence must survive into `keyword_basis` or evidence refs.
- Parent-only vague receipt is a failure.

### 5. Format checker disabled boundary case

Files:

- `raw-captures/format-disabled.python.raw.json`
- `raw-captures/format-disabled.ajv.raw.json`

Purpose:

- Prove format behavior is explicit configuration evidence, not an accidental runtime assumption.

Required raw signal:

- No validation error when format checking is intentionally disabled, or a config-boundary raw capture if the test runner expects format checking.

Expected categories:

- If disabled: `[]`
- If enabled unexpectedly: schema/configuration boundary category

Acceptance rule:

- Fixture manifest must state `format_checker = disabled` or equivalent.
- A runtime silently enabling format checks must fail parity.

### 6. Unknown keyword / fallback case

Files:

- `raw-captures/unknown-keyword.python.raw.json`
- `raw-captures/unknown-keyword.ajv.raw.json`

Purpose:

- Prove new or unmapped validator signals fail safe instead of being dropped.

Required raw signal:

- synthetic validator keyword not present in `repair-category-map.v1.json`

Expected categories:

- `unmapped_validator_signal`

Acceptance rule:

- The generator must not invent a new category.
- The fixture should fail differently only if governance updates the category map.

### 7. Message mutation case

Files:

- `raw-captures/message-mutation.base.python.raw.json`
- `raw-captures/message-mutation.changed.python.raw.json`
- `raw-captures/message-mutation.base.ajv.raw.json`
- `raw-captures/message-mutation.changed.ajv.raw.json`

Purpose:

- Prove human message text is debug-only.

Expected behavior:

- Base and changed captures produce the same category set.
- Base and changed captures produce the same repair identities if raw capture id is excluded from repair identity.
- Receipt identity may differ only if raw capture id is intentionally part of receipt identity.

Acceptance rule:

- Tests must compare repair identities separately from whole receipt ids.

### 8. Raw order mutation case

Files:

- `raw-captures/raw-order.base.python.raw.json`
- `raw-captures/raw-order.shuffled.python.raw.json`
- `raw-captures/raw-order.base.ajv.raw.json`
- `raw-captures/raw-order.shuffled.ajv.raw.json`

Purpose:

- Prove array order in raw validator output is not convergence identity.

Expected behavior:

- Sorted canonical repairs match.
- Category set matches.
- Repair ids match.

Acceptance rule:

- If shuffled raw errors alter canonical repair order or repair identity, the generator sorting contract is wrong.

## Expected receipt files

For each raw capture pair, create expected receipts under:

- `expected-receipts/<fixture-id>.python.receipt.json`
- `expected-receipts/<fixture-id>.ajv.receipt.json`

Expected receipts should be full schema-valid examples of `canonical-repair-receipt.v1.schema.json`.

They should include:

- `receipt_id`
- `algorithm_id`
- `validator_id`
- `fixture_ref`
- `schema_ref`
- `category_map_ref`
- `category_map_hash`
- `raw_capture_ref`
- `validation_result`
- `canonical_repairs`
- `canonical_repair_count`
- `raw_error_count`

They should not include:

- private session text
- symbolic interpretation
- therapeutic claims
- raw unbounded instance values
- runtime stack traces
- network paths
- absolute local paths

## Expected category-set files

For each paired fixture, create one comparison target under:

- `expected-category-sets/<fixture-id>.categories.json`

The category-set file should be the first cross-runtime assertion artifact.

Minimum shape:

- `fixture_id`
- `schema_ref`
- `category_map_ref`
- `expected_categories`
- `expected_instance_category_pairs`
- `comparison_scope`

Comparison rules:

1. Sort categories lexicographically.
2. Sort instance-category pairs by category id, then instance pointer.
3. Do not include validator id.
4. Do not include raw capture id.
5. Do include category map hash or version.

## Fixture manifest

Create:

- `tools/agency-validation/test-fixtures/fixture-pack.v1.json`

Manifest fields:

- `fixture_pack_id`
- `version`
- `schema_ref`
- `category_map_ref`
- `category_map_hash`
- `format_checker_mode`
- `fixtures`

Each fixture entry:

- `fixture_id`
- `purpose`
- `python_raw_capture`
- `ajv_raw_capture`
- `python_expected_receipt`
- `ajv_expected_receipt`
- `expected_category_set`
- `must_match`
- `may_differ`

`must_match` should include:

- category set
- instance/category pairs
- governed reviewer prompt ids or category ids
- repair ids when raw capture id is not part of repair identity

`may_differ` should include:

- validator id
- raw capture id
- raw error ids
- raw message text
- validator-native params shape
- receipt id if raw capture id participates

## Determinism rules

Before serializing expected receipts:

1. Normalize all instance pointers to RFC 6901 form.
2. Normalize all schema pointers to RFC 6901 form or declared schema-location form.
3. Sort canonical repairs by category id, instance pointer, schema pointer, first raw error id.
4. Sort evidence refs by raw error id, then keyword.
5. Sort keyword basis lexicographically.
6. Serialize object keys using RFC-8785-compatible recursive sorting.
7. Never compare native message text.

## CI acceptance criteria

1. Both runtimes can load the fixture manifest through path authority.
2. Raw capture paths cannot be absolute, URL-based, or `../` escaping.
3. Both generators validate expected receipts against `canonical-repair-receipt.v1.schema.json`.
4. Paired Python/Ajv raw captures converge on the same expected category-set file.
5. Message mutation does not alter repair identity.
6. Raw error shuffling does not alter repair identity.
7. Unknown keywords map only to `unmapped_validator_signal` unless the governed category map changes.
8. Format-checker behavior is declared in the manifest and cannot drift silently.

## Design pattern name

Paired Raw Disagreement Fixture

Definition: a fixture pattern where each runtime preserves its native raw validator shape, but the test suite asserts convergence only after the shared governance adapter emits canonical repair receipts and category-set comparison artifacts.

## Implementation order

1. Add `fixture-pack.v1.json` manifest with empty placeholder paths and governed metadata.
2. Add valid-empty Python and Ajv raw captures.
3. Add valid-empty expected receipts.
4. Add required/type/enum pair.
5. Add expected category-set assertions.
6. Add message mutation and raw order mutation regression pairs.
7. Add nested anyOf case only after basic receipt generation passes.
8. Wire both generators into one parity test command.

## Public-safe boundary

All fixture object names should be generic: `fixture_alpha`, `field_name`, `status`, `mode`, `evidence_items`, `notes`, `metadata`. Do not encode user stories, health examples, therapy examples, animal-health examples, identity claims, or symbolic session material.

## Next architecture question

How should MC implement `fixture-pack.v1.json` and the first `valid-empty` plus `required-type-enum` raw captures so the manifest itself becomes the single source of truth for cross-runtime receipt parity tests?
