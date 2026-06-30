# Repair Category Adapter Test Fixture Alignment

## Architecture question

How should MC implement the first `repair-category-map` adapter test fixture so Ajv and python-jsonschema errors converge on the same category while preserving raw evidence for debugging?

## Research summary

Current sources reinforce a narrow adapter design:

- JSON Schema 2020-12 defines output as validation result information, with minimum fields for keyword location, instance location, and error or annotation output. MC should treat this as structured evidence, not final reviewer language.
- Ajv exposes validator-specific error objects with fields such as keyword, instance path, schema path, params, and message.
- python-jsonschema exposes `ValidationError` attributes such as validator, validator_value, absolute_path, absolute_schema_path, message, context, and cause.
- JSON-Schema-Test-Suite uses language-agnostic fixtures to keep validation behavior comparable across implementations, which is the correct pattern for MC's paired-validator runner.
- Recent JSON Schema research keeps showing that modern schema semantics and validator behavior can be complex at boundaries, especially around newer/dynamic features. MC should keep the first adapter test small and avoid testing semantic edge cases before baseline convergence exists.

## Finding in current GitHub mind

The repair category map and canonical validation-error schema had drifted apart.

The governed map defines active categories such as:

- `missing_required_field`
- `wrong_value_type`
- `closed_value_set_mismatch`
- `format_boundary`
- `pattern_or_shape_mismatch`
- `unexpected_extra_field`
- `array_cardinality_or_uniqueness`
- `string_or_number_bounds`
- `compound_schema_boundary`
- `schema_reference_or_dialect`
- `validator_convergence_gap`
- `unmapped_validator_signal`

But the previous `canonical-validation-error.v1.schema.json` still used older categories such as `wrong_type`, `unsupported_value`, `format_warning`, and `unknown_validation_failure`.

That would make the first adapter test fail for the wrong reason: schema/category drift instead of actual validator divergence.

## Durable change made

Updated:

`mind/schemas/canonical-validation-error.v1.schema.json`

Changes:

1. Replaced the `repair_category` enum with the active category IDs from `mind/config/repair-category-map.v1.json`.
2. Expanded `canonical_keyword` to cover every keyword currently mapped by `repair-category-map.v1.json`, including `propertyNames`, `unevaluatedProperties`, numeric bounds, conditional keywords, `$ref`, and `$schema`.
3. Expanded `machine_action.action` so repair receipts can express category-level actions without inventing new categories:
   - `normalize_format`
   - `adjust_array`
   - `adjust_bounds`
   - `record_divergence`
4. Added an explicit description that the duplicated enum is intentional so CI can detect category drift at schema-validation time.

## Adapter test design pattern

The first adapter test should be a convergence test, not a full runner.

Minimum test pack:

1. **Required-field convergence**
   - Broken fixture omits one required field.
   - Ajv raw keyword: `required`.
   - python-jsonschema raw validator: `required`.
   - Expected MC category: `missing_required_field`.
   - CI compares category only.
   - Report preserves raw paths, params, and messages.

2. **Format-boundary divergence**
   - Fixture contains a boundary value such as date-time/URI/email that depends on format policy.
   - Expected MC category: `format_boundary` or `validator_convergence_gap`, depending on whether both validators are configured equivalently.
   - CI must not claim either validator proves symbolic truth.

3. **Unmapped-signal guard**
   - Inject one unknown or unsupported raw keyword into adapter-unit tests without changing the schema fixture.
   - Expected MC category: `unmapped_validator_signal`.
   - This proves new validator output becomes adapter debt rather than category sprawl.

## CI rule

CI should pass only when:

- every raw validator error maps to one governed category;
- Ajv and python-jsonschema converge on the expected category for non-divergent fixtures;
- intentional divergence is recorded with raw evidence;
- no report uses validator agreement as a claim about agency truth, symbolic truth, or final reviewer label.

CI should fail when:

- `canonical-validation-error.v1.schema.json` contains categories not present in `repair-category-map.v1.json`;
- `repair-category-map.v1.json` contains active categories missing from the canonical error schema;
- a raw validator keyword falls to `unmapped_validator_signal` in a non-intentional test;
- a report drops raw evidence needed for debugging.

## Public-safety rule

The adapter test should use structural fixture failures only: missing fields, wrong value types, format boundaries, and unknown validator signals. It should not introduce vivid manipulation scenarios or private/personal material. The point is to test the validator infrastructure, not the emotional content layer.

## Next implementation step

Create a small adapter unit fixture file with paired raw Ajv/python-jsonschema error examples for the same missing-required-field case and an expected canonical output object that validates against `canonical-validation-error.v1.schema.json`.

The next research question:

How should MC design the raw-error capture format for paired Ajv and python-jsonschema outputs so reports preserve enough debugging detail without locking CI to unstable validator message wording?
