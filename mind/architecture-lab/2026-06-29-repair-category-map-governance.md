# Repair Category Map Governance Pattern

## Architecture question

How should MC design `repair-category-map.v1.json` so CI stays stable without creating category sprawl?

## Research basis

Current validator guidance points to one central constraint: validators expose useful evidence, but they do not expose stable reviewer language.

Useful concepts extracted:

1. JSON Schema 2020-12 defines output formats and minimum information such as keyword location, instance location, errors, annotations, and nested results. MC should preserve these as evidence, not display raw validator noise as final reviewer language.
   Source: https://json-schema.org/draft/2020-12/json-schema-core

2. Ajv exposes structured error objects including keyword, instancePath, schemaPath, params, and message. That is enough for deterministic mapping, but message text and params are implementation-specific.
   Source: https://ajv.js.org/api.html#validation-errors

3. python-jsonschema exposes ValidationError fields such as message, validator, validator_value, path, schema_path, instance, schema, context, and cause. That supports normalization but does not guarantee the same shape as Ajv.
   Source: https://python-jsonschema.readthedocs.io/en/stable/errors/

4. JSON-Schema-Test-Suite is validator-neutral: it compares expected validation outcomes without requiring every implementation to produce identical internal error wording. MC should follow that pattern for convergence tests.
   Source: https://github.com/json-schema-org/JSON-Schema-Test-Suite

5. Recent JSON Schema research reinforces that modern JSON Schema can have complex behavior around dynamic references and annotation-dependent keywords. MC should avoid making raw modern-keyword behavior the public reviewer surface.
   Source: https://arxiv.org/abs/2503.11288

## Changed understanding

The repair-category map should not be a growing list of every validator keyword. It should be a small governed translation layer:

- raw validator output = evidence
- canonical repair category = stable CI comparison target
- reviewer repair prompt = human-readable next action
- non-meaning statement = guardrail against fake authority

The important design move is not classification precision. The important design move is limiting what the category is allowed to mean.

A schema failure means: "this fixture is not yet reviewable under the current contract."

A schema failure must not mean: "this fixture is unsafe," "this symbolic reading is false," or "the machine has decided the agency boundary."

## Design pattern

### Stable Repair Category Adapter

Pipeline:

1. Run fixture through each pinned validator.
2. Capture raw validator evidence.
3. Convert each raw error into a canonical validation error envelope.
4. Map the raw validator keyword into one governed repair category.
5. Compare canonical categories across validators.
6. Emit a repair receipt that tells reviewers what to fix and what not to infer.

### Sprawl control

A new category is allowed only when all are true:

- At least two real fixture failures cannot be repaired clearly by an existing category.
- The proposed category has one reviewer-facing repair sentence that works across Ajv and python-jsonschema.
- The proposed category has a non-meaning statement that prevents overclaiming.
- The category improves reviewer actionability, not just taxonomy neatness.

## Implemented artifacts

Added:

- `mind/schemas/repair-category-map.v1.schema.json`
- `mind/config/repair-category-map.v1.json`

The config currently defines twelve active categories:

1. `missing_required_field`
2. `wrong_value_type`
3. `closed_value_set_mismatch`
4. `format_boundary`
5. `pattern_or_shape_mismatch`
6. `unexpected_extra_field`
7. `array_cardinality_or_uniqueness`
8. `string_or_number_bounds`
9. `compound_schema_boundary`
10. `schema_reference_or_dialect`
11. `validator_convergence_gap`
12. `unmapped_validator_signal`

## Requirements update

MC validation CI should compare canonical repair categories, not raw validator messages.

MC validation reports should include:

- validator name and version
- raw validator keyword
- instance path
- schema path
- canonical repair category
- repair prompt
- non-meaning statement
- convergence status

MC validation reports should reject:

- raw error text as the primary reviewer surface
- category creation without fixture evidence
- LLM-generated categories without schema-governed review
- validator agreement as proof of symbolic truth

## Next implementation step

Build a small adapter test that takes one Ajv-style `required` error and one python-jsonschema-style `required` error, maps both to `missing_required_field`, and emits a convergence report showing same canonical category, different raw evidence.

## Next research question

How should MC implement the first `repair-category-map` adapter test fixture so Ajv and python-jsonschema errors converge on the same category while preserving enough raw evidence for debugging?
