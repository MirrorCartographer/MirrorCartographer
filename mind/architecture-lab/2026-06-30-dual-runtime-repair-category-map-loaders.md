# Dual-runtime repair-category map loaders

Date: 2026-06-30

## Architecture question

How should MC implement the dual-runtime repair-category map loaders and first parity tests so both adapters prove they are using the same governed category source before generating canonical repair receipts?

## Research summary

Current sources point to one stable design constraint: raw validator evidence is structurally useful, but not stable enough to be the convergence contract.

- JSON Schema 2020-12 describes output in terms of keyword location, absolute keyword location, instance location, and nested error structures. That makes location and keyword identity the durable evidence layer, while human error text remains secondary.
- Ajv exposes `keyword`, `instancePath`, `schemaPath`, and keyword-specific `params`. It also allows messages to be omitted, which confirms that message text cannot define repair identity.
- python-jsonschema exposes `ValidationError.validator`, `absolute_path`, `absolute_schema_path`, `context`, and related fields. This confirms Python can emit comparable structural atoms without copying Ajv's raw shape.
- RFC 8785 reinforces recursive object-key ordering for canonical JSON. For MC, this means loader-produced indexes and later receipts should be deterministic even when runtime object insertion behavior differs.
- Recent JSON Schema research continues to show that schema validation has non-trivial keyword interaction and validator behavior risk. MC should therefore treat validator convergence as governed evidence, not as a content-truth oracle.

## Change in understanding

The shared repair-category map is not just configuration. It is a governance boundary between raw validators and canonical receipts.

Previous frame:

raw Ajv/Python capture -> adapter-local keyword mapping -> receipt

Revised frame:

raw Ajv/Python capture -> structural error atom -> validated shared category map -> deterministic category lookup -> receipt

That means receipt generators must not contain duplicated keyword-to-category tables. They must call a loader that proves:

1. The map validates against `repair-category-map.v1.schema.json`.
2. Every category id is unique.
3. Active category count remains inside policy.
4. Every keyword mapping targets a known category.
5. Every validator keyword is mapped once.
6. The `unknown` fallback mapping exists.
7. The resulting indexes are stable and sorted before downstream receipt creation.

## Implemented GitHub artifacts

### Node loader

Path: `tools/agency-validation/repair-category-map-loader.mjs`

Adds:

- `loadRepairCategoryMap()`
- `assertValidRepairCategoryMap()`
- `buildRepairCategoryMapIndexes()`
- `categoryForValidatorKeyword()`
- `RepairCategoryMapError`

The loader reuses the existing Node path authority and schema registry. It rejects invalid category maps before any canonical repair receipt generator can use them.

### Python loader

Path: `tools/agency-validation/python_repair_category_map_loader.py`

Adds:

- `load_repair_category_map()`
- `assert_valid_repair_category_map()`
- `build_repair_category_map_indexes()`
- `category_for_validator_keyword()`
- `RepairCategoryMapError`

The loader reuses the Python path authority and offline schema registry. It sorts validation errors and index keys to keep behavior byte-stable across repeated local runs.

### Node parity tests

Path: `tools/agency-validation/repair-category-map-loader.test.mjs`

Covers:

- shared map loads and builds stable indexes
- known keyword lookup maps `required` to `missing_required_field`
- unknown keyword lookup falls back to `unmapped_validator_signal`
- unknown category references are rejected
- duplicate keyword mappings are rejected

### Python parity tests

Path: `tools/agency-validation/python_repair_category_map_loader.test.py`

Covers the same invariants as the Node tests so both runtimes prove they are using the same governed category source.

## Durable rule added to the MC mind

Receipt generation must depend on loader output, not direct JSON imports of `mind/config/repair-category-map.v1.json`.

Any future receipt generator should accept a loaded category map or call the runtime loader internally. It should not duplicate the keyword mapping table, category metadata, fallback behavior, or policy checks.

## Public-safety boundary

This layer only maps validator infrastructure signals into public-safe repair categories. It does not infer private intent, diagnose a person, judge symbolic truth, or decide whether a scenario is psychologically safe. Schema failure means contract repair is needed, not that a human meaning claim is false.

## Next research question

How should MC implement `canonical_repair_receipt_generator.py` and `canonical-repair-receipt-generator.mjs` so both runtimes consume the shared map loader, emit the same category sets for seeded raw captures, and serialize receipt comparison inputs in deterministic RFC-8785-compatible order?
