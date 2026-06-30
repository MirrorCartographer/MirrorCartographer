# Canonical repair receipt schema

## Architecture question

How should MC define `canonical-repair-receipt.v1.schema.json` so receipt identity, evidence references, category governance, and byte-stable ordering are enforceable before convergence comparison runs?

## Research basis

Current sources point to the same implementation boundary:

- JSON Schema 2020-12 output examples preserve `keywordLocation`, `absoluteKeywordLocation`, `instanceLocation`, nested `errors`, and `valid` state. MC should keep those concepts, but use its own receipt format because Ajv and python-jsonschema expose different native shapes.
- Ajv exposes validation failures through `errors` arrays containing validator-specific error objects. These are useful evidence, not stable convergence targets.
- python-jsonschema `ValidationError` exposes structural attributes such as `validator`, `path`, `schema_path`, `absolute_path`, `absolute_schema_path`, `json_path`, and nested `context`. These should feed evidence references and pointer locations, not reviewer-facing truth claims.
- RFC 8785 JSON Canonicalization Scheme confirms the value of recursive lexicographic object-key ordering while preserving array order unless a schema explicitly defines a sorted array contract.
- Modern JSON Schema research shows validator behavior can be complex under newer features such as dynamic references, so MC should compare canonical receipts rather than raw validator behavior.

## Useful concepts extracted

### 1. Receipt is the CI comparison unit

Raw captures remain debugging evidence. The canonical repair receipt is the normalized, validator-neutral object that CI compares.

Flow:

raw validator capture -> structural adapter -> governed repair category -> canonical repair receipt -> convergence report

### 2. Identity must exclude volatile fields

`created_at` is allowed for human traceability, but it must not define convergence identity. Stable identity should be derived from:

- validator id
- fixture id
- schema id
- raw capture id or hash
- sorted repair category content
- raw evidence ids

### 3. Categories must remain governed

A receipt can name a `category_id`, but the generator must verify that the category exists in `mind/config/repair-category-map.v1.json`. Unknown categories are adapter debt and should map to `unmapped_validator_signal` until governance adds a new active category.

### 4. Evidence references must point back to raw captures

The receipt should not copy full raw errors. It should preserve:

- `raw_error_id`
- raw validator keyword
- instance pointer
- schema pointer
- optional nested raw error indexes

This keeps reports small and diffable while preserving a path back to full debug evidence.

### 5. Byte-stability requires declared ordering

The schema now declares the ordering contract:

- object keys: recursive lexicographic ordering
- canonical repairs: `category_id`, `instance_pointer`, `schema_pointer`, `first_raw_error_id`
- evidence refs inside a repair: `raw_error_id`
- semantic arrays: preserve order unless the schema names them as sorted receipt arrays

## Durable artifact added

Added schema:

`mind/schemas/canonical-repair-receipt.v1.schema.json`

Commit:

`efe869ab75fcafae5ca6a0e62c7600fbe2551158`

## Design impact

MC now has a missing middle artifact between raw validator captures and convergence reports:

- `raw-validator-error-capture.v1` stores library-specific evidence.
- `canonical-repair-receipt.v1` stores validator-neutral repair atoms.
- `agency-convergence-report.v1` can compare categories and evidence references without reading raw message wording.

This makes convergence review more stable because CI no longer has to compare raw Ajv and python-jsonschema errors directly.

## Public-safety boundary

The receipt schema is infrastructure-only. It must not include private scenario text, personal material, medical material, or symbolic interpretation. It only records schema-path, instance-path, category, and evidence-reference metadata.

## Implementation requirements

The first receipt generator should:

1. Load a raw capture.
2. Load `repair-category-map.v1.json`.
3. Map each raw error by keyword and structural context.
4. Group equivalent raw errors into canonical repairs.
5. Sort repairs deterministically.
6. Emit valid `canonical-repair-receipt.v1` JSON.
7. Reject unknown category ids unless they are explicitly mapped to `unmapped_validator_signal`.
8. Treat messages as debug-only.
9. Keep timestamps outside convergence identity.

## Next question

How should MC implement `canonical_repair_receipt_generator.py` and its Node parity equivalent so Ajv and python-jsonschema raw captures produce byte-stable receipts with matching category sets for the three seed fixtures?
