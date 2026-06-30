# MC Architecture Lab — Canonical Repair Receipt Generator Parity Contract

Date: 2026-06-30
Status: durable design pattern / prototype plan
Scope: public-safe architecture only. No private scenario content, user health content, or personal material is included.

## Architecture question

How should MC implement `canonical_repair_receipt_generator.py` and its Node parity equivalent so Ajv and python-jsonschema raw captures produce byte-stable receipts with matching category sets for the three seed fixtures?

## Why this needed deeper research

The previous layer created `canonical-repair-receipt.v1.schema.json`, but the schema alone does not define the adapter algorithm. The dangerous gap is allowing two implementations to both emit schema-valid receipts while disagreeing about:

- which raw error fields are authoritative,
- how compound errors are flattened,
- how category IDs are selected,
- how receipt and repair IDs are derived,
- whether raw message text or raw error order leaks into convergence identity.

The generator must be a deterministic adapter, not a validator, judge, or symbolic interpretation layer.

## Current-source research summary

Sources reviewed:

- JSON Schema Draft 2020-12 core output model: https://json-schema.org/draft/2020-12/json-schema-core
- Ajv API validation errors: https://ajv.js.org/api.html#validation-errors
- python-jsonschema validation error attributes: https://python-jsonschema.readthedocs.io/en/stable/errors/
- RFC 8785 JSON Canonicalization Scheme: https://www.rfc-editor.org/rfc/rfc8785
- Modern JSON Schema validation complexity research: https://arxiv.org/abs/2307.10034

Useful concepts extracted:

1. JSON Schema output vocabulary names the durable machine fields MC should imitate: keyword location, absolute keyword location, instance location, nested results, and error/annotation separation.
2. Ajv exposes structured `ErrorObject` fields: `keyword`, `instancePath`, `schemaPath`, and `params`; messages are optional/debug fields, not adapter truth.
3. python-jsonschema exposes `ValidationError.validator`, `absolute_path`, `absolute_schema_path`, `context`, `validator_value`, and `cause`; nested context is structural evidence, not a separate truth source.
4. RFC 8785 makes canonical JSON ordering explicit enough for cross-runtime byte-stability, but MC should avoid floats and ambiguous numeric identity in receipt identity material.
5. Modern JSON Schema includes dynamic references and annotation-dependent behavior that can make raw error topology complex; MC should keep the first generator keyword-mapping-only and treat dynamic/reference failures as infrastructure categories until explicit fixture evidence exists.

## Understanding change

The generator should not try to make Python and Node produce identical raw errors. It should make them produce identical governed repair category sets from structurally equivalent raw evidence.

The receipt generator is therefore a four-stage adapter:

1. Intake raw capture.
2. Extract structural error atoms.
3. Map atoms through `repair-category-map.v1`.
4. Emit canonical, byte-stable repair receipts.

Raw captures remain evidence. Canonical receipts become CI comparison material.

## Contract: canonical repair receipt generator v1

### Inputs

Required inputs:

- `raw_capture`: one `raw-validator-error-capture.v1` JSON document.
- `repair_category_map`: `mind/config/repair-category-map.v1.json`.
- `fixture_ref`: fixture ID, repo-relative fixture path, optional sha256.
- `schema_ref`: schema ID, repo-relative schema path, optional sha256.
- `raw_capture_path`: repo-relative output path under `mind/reports/agency-validation/runs/.../raw/`.

Forbidden inputs for v1 identity:

- raw human message text,
- validator-native error order,
- wall-clock timestamp,
- host absolute paths,
- network-fetched schemas,
- LLM interpretation,
- private scenario content.

### Structural error atom

Both implementations should convert raw validator evidence into this internal shape before mapping:

- `raw_error_id`
- `keyword`
- `instance_pointer`
- `schema_pointer`
- `absolute_schema_location` when available
- `nested_raw_error_indexes` for context children
- `params_summary` limited to bounded public-safe values
- `source_validator_id`

This atom is internal. It does not need its own schema until the runner needs to persist intermediate output.

### Mapping rule

For every structural atom:

1. Read `keyword`.
2. Look up `keyword` in `repair_category_map.keyword_mappings`.
3. If found, copy `canonical_category_id` and `mapping_confidence`.
4. If not found, use `unmapped_validator_signal` with `mapping_confidence: boundary`.
5. If the atom indicates schema loading, dialect, unresolved reference, or validator infrastructure failure, use `schema_reference_or_dialect` even if the originating library exposes a different local keyword.
6. For compound keywords (`anyOf`, `oneOf`, `allOf`, `not`, `if`, `then`, `else`), preserve nested raw evidence references but do not explode one compound boundary into multiple independent repairs unless the raw capture contains child errors with independently mapped keywords.

### Repair grouping rule

The generator should group atoms into canonical repairs by this tuple:

- `category_id`
- `instance_pointer`
- `schema_pointer`
- sorted set of direct evidence `keyword`s

Rationale: Ajv and python-jsonschema may emit different nested context trees. Grouping by category and structural location is more stable than grouping by raw hierarchy.

Boundary case:

- If a compound parent and child errors both exist, child keyword repairs may be emitted only when they point to concrete instance/schema locations and map to active categories. The compound parent remains one repair when it conveys branch-selection ambiguity.

### Stable ID rule

Use the same ID algorithm in Python and Node:

- Canonicalize the identity material as JSON with lexicographic object-key ordering.
- Use UTF-8 bytes.
- Hash with SHA-256.
- Truncate the lowercase hex digest to 24 characters for readable IDs.

`repair_id` material:

- `algorithm_id`
- `category_id`
- `fixture_id`
- `schema_id`
- `instance_pointer`
- `schema_pointer`
- sorted `raw_error_id`s
- sorted `keyword_basis`

Format:

- `repair-<24 hex chars>`

`receipt_id` material:

- `algorithm_id`
- `validator_id`
- `capture_id`
- `fixture_id`
- `schema_id`
- sorted `repair_id`s
- sorted `category_id`s
- `valid`
- `raw_error_count`

Format:

- `crr-<24 hex chars>`

Timestamp is permitted in `created_at` for traceability but must not enter either ID hash or convergence comparison.

### Sorting rule

Sort repairs by:

1. `category_id`
2. `instance_location.pointer`
3. `schema_location.pointer`
4. first `evidence_refs.raw_error_id`

Sort evidence refs by:

1. `raw_error_id`
2. `keyword`

Sort keyword basis lexicographically.

Object keys must be serialized with recursive lexicographic ordering when computing hashes and when writing byte-stable JSON output.

### Valid fixture rule

If the raw capture reports valid with zero errors:

- `canonical_repairs` must be `[]`.
- `validation_result.valid` must be `true`.
- `validation_result.raw_error_count` must be `0`.
- `validation_result.canonical_repair_count` must be `0`.

The generator must not fabricate a success repair.

### Message handling rule

Messages may remain in raw captures for debugging. They must not be used for:

- `category_id`,
- `repair_id`,
- `receipt_id`,
- convergence comparison,
- pass/fail status.

A future reviewer summary may quote or paraphrase messages, but this belongs in Markdown reporting, not canonical receipt identity.

## Implementation plan

### Python file

Create:

`tools/agency-validation/canonical_repair_receipt_generator.py`

Required public functions:

- `load_repair_category_map(path_authority, repo_relative_path)`
- `structural_atoms_from_raw_capture(raw_capture)`
- `map_atom_to_category(atom, category_map)`
- `build_canonical_repairs(raw_capture, category_map, fixture_ref, schema_ref)`
- `build_canonical_receipt(raw_capture, category_map, fixture_ref, schema_ref, raw_capture_path)`
- `canonical_json_bytes(value)`
- `stable_hash_id(prefix, identity_material)`

### Node file

Create:

`tools/agency-validation/canonical-repair-receipt-generator.mjs`

Required exports should mirror Python names using JS conventions:

- `loadRepairCategoryMap`
- `structuralAtomsFromRawCapture`
- `mapAtomToCategory`
- `buildCanonicalRepairs`
- `buildCanonicalReceipt`
- `canonicalJsonBytes`
- `stableHashId`

### First tests

Python:

`tools/agency-validation/canonical_repair_receipt_generator.test.py`

Node:

`tools/agency-validation/canonical-repair-receipt-generator.test.mjs`

Test requirements:

1. Valid capture emits zero repairs.
2. `required` maps to `missing_required_field`.
3. `type` maps to `wrong_value_type`.
4. Unknown keyword maps to `unmapped_validator_signal`.
5. Message text change does not alter receipt ID.
6. Raw error order change does not alter category set.
7. Hash output is stable across two repeated runs.
8. Generated receipt validates against `canonical-repair-receipt.v1.schema.json`.

### First convergence criterion

The first end-to-end success condition is not identical raw output.

Success means:

- Python and Node receipts are schema-valid.
- Both contain the same sorted category IDs for each fixture.
- Both contain the same valid/invalid status for each fixture.
- Any difference in raw error count is reported as diagnostic, not automatic failure, unless a fixture explicitly requires raw-count parity.

## Durable design pattern

Name: Validator-Neutral Receipt Adapter

Pattern:

- Preserve raw validator evidence.
- Normalize only structural atoms.
- Map atoms through governed categories.
- Compare canonical receipts, not raw validator errors.
- Treat disagreement as adapter evidence before treating it as content evidence.

Anti-patterns:

- comparing Ajv and python-jsonschema messages,
- using raw error list order as CI truth,
- collapsing compound schema errors without nested evidence references,
- letting a valid fixture generate a positive repair object,
- letting LLM language decide category identity.

## Next architecture question

How should MC implement the first cross-runtime receipt parity test fixture pack so Python and Node receive intentionally different raw error shapes but must converge on the same canonical category set and receipt comparison rules?
