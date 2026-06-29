# Canonical Validation Error Adapter Pattern

Date: 2026-06-29
Status: Architecture Lab Pattern
Privacy posture: public-safe, no personal examples, no private session material

## Architecture question

How should MC define `canonical-validation-error.v1` as a machine-readable schema and generate paired Ajv / python-jsonschema test reports proving the same broken fixture maps to the same repair category across libraries?

## Researched basis

Current JSON Schema 2020-12 defines standard validation output expectations, including flag, basic, detailed, and verbose structures. It also specifies minimum useful debugging information: keyword location, instance location, error or annotation, and nested results. Ajv and python-jsonschema expose related information, but not in identical shapes. Ajv reports fields such as `keyword`, `instancePath`, `schemaPath`, `params`, and optional `message`. python-jsonschema reports a richer Python exception object with `validator`, `validator_value`, `path`, `absolute_path`, `schema_path`, `absolute_schema_path`, `context`, and `message`.

The key risk is treating raw validator errors as the product interface. Raw errors are library-specific, sometimes cryptic, and can shift when the validator changes. MC needs stable repair language so fixture authors and reviewers see the same category even when the underlying library differs.

## Changed understanding

Before: validator errors were treated as already-close to repair receipts.

After: validator errors are evidence, not the durable artifact. MC needs a canonical adapter layer that maps heterogeneous validator fields into a stable envelope:

1. source validator evidence
2. canonical JSON Pointer locations
3. canonical keyword
4. repair category
5. severity
6. reviewer message
7. machine action
8. agency guardrail stating that validation does not decide symbolic truth or agency label

This keeps the schema layer honest. It can say whether a fixture is shaped correctly enough to review. It cannot say whether the scenario is emotionally, symbolically, or socially true.

## Design pattern

### Stable Repair Category Adapter

Raw validator output enters the adapter. The adapter preserves minimal source evidence, then normalizes into MC-owned repair categories.

Required adapter inputs:

- validator name
- validator version
- raw keyword
- raw instance path
- raw schema path
- raw params or equivalent
- raw message, if available

Required canonical outputs:

- `canonical_location.instance_pointer`
- `canonical_location.schema_pointer`
- `canonical_location.field_name`
- `canonical_keyword`
- `repair_category`
- `severity`
- `reviewer_message`
- `machine_action`

### Canonical category map v1

| Validator signal | Canonical keyword | Repair category | Default severity | Reviewer message shape |
| --- | --- | --- | --- | --- |
| `required` | `required` | `missing_required_field` | `repair_before_review` | Add the missing required field: `<field>`. |
| `type` | `type` | `wrong_type` | `repair_before_review` | Change `<field>` to the expected type. |
| `enum` | `enum` | `unsupported_value` | `repair_before_review` | Choose an allowed value for `<field>`. |
| `const` | `const` | `constant_mismatch` | `repair_before_review` | Use the required constant value for `<field>`. |
| `additionalProperties` | `additionalProperties` | `extra_field` | `repair_before_review` | Remove unsupported field `<field>`. |
| `minItems` | `minItems` | `too_few_items` | `repair_before_review` | Add enough items to `<field>`. |
| `maxItems` | `maxItems` | `too_many_items` | `repair_before_review` | Remove excess items from `<field>`. |
| `minLength` | `minLength` | `text_too_short` | `repair_before_review` | Expand `<field>` enough to be reviewable. |
| `maxLength` | `maxLength` | `text_too_long` | `repair_before_review` | Shorten `<field>` without losing reviewable evidence. |
| `pattern` | `pattern` | `pattern_mismatch` | `repair_before_review` | Rewrite `<field>` to match the expected identifier or pointer pattern. |
| `format` | `format` | `format_warning` | `warn_reviewer` | Check the format of `<field>`; validators may differ. |
| `oneOf` / `anyOf` | `oneOf` / `anyOf` | `ambiguous_branch_failure` | `block_review` | The fixture matches no valid branch or too many branches; inspect branch evidence. |
| schema-invalid exception | `schema` | `schema_contract_error` | `block_review` | The schema contract is invalid; repair the schema before validating fixtures. |
| unknown | `unknown` | `unknown_validation_failure` | `manual_review` | Inspect the raw validation evidence. |

## Paired validator test plan

Create one intentionally broken fixture with the same minimal defect in both validator runs:

- missing `expected_agency_state`
- invalid `fixture_id` pattern
- extra field `private_notes`

Expected normalized categories:

- missing `expected_agency_state` → `missing_required_field`
- invalid `fixture_id` → `pattern_mismatch`
- extra `private_notes` → `extra_field`

The Ajv and python-jsonschema raw reports may differ, but the canonical output must converge on the same three repair categories.

## Prototype report shape

A paired test report should include:

- fixture id
- schema id
- validator runs
- raw error count per validator
- canonical error list per validator
- convergence result
- divergence notes
- reviewer-facing repair receipt

Convergence is not symbolic correctness. It only means both libraries identify equivalent structural repair needs.

## Implementation added

Added machine-readable schema:

`mind/schemas/canonical-validation-error.v1.schema.json`

## Requirements update

MC validation tooling should not display raw Ajv or python-jsonschema errors as the primary reviewer interface. Raw errors should be preserved for debugging, but public-facing repair receipts must be generated from `canonical-validation-error.v1`.

## Next research question

How should MC implement the paired validator runner and fixture-level convergence report so CI can prove Ajv and python-jsonschema map the same broken fixture into the same repair categories without making validator agreement a proxy for symbolic truth?
