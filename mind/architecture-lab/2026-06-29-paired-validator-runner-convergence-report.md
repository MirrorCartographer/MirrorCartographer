# Paired Validator Runner + Convergence Report Pattern

Date: 2026-06-29
Status: Durable architecture note / prototype plan
Public-safety level: public-safe; no private user material; all scenarios remain abstract fixtures.

## Architecture question

How should MC implement the paired validator runner and convergence report so CI proves Ajv and python-jsonschema map the same broken fixture to the same repair categories without treating validator agreement as symbolic truth?

## Research basis

Current sources checked:

- JSON Schema 2020-12 core: defines output formatting concepts and minimum output information such as keyword location, instance location, errors/annotations, nested results, and output structures.
- Ajv API documentation: Ajv validation errors expose `keyword`, `instancePath`, `schemaPath`, `params`, optional `message`, and verbose fields.
- python-jsonschema documentation: `ValidationError` exposes `validator`, `validator_value`, `path`, `schema_path`, `absolute_path`, `absolute_schema_path`, `context`, and related fields.
- JSON-Schema-Test-Suite: provides a language-agnostic pattern for validator-neutral test fixtures.
- 2025-2026 structured-output / JSON Schema research: schema compliance is not equivalent to semantic correctness; validators can differ, and structured-output systems need independent value/meaning review.

## Change in understanding

The paired runner should not ask: `Do Ajv and python-jsonschema produce the same errors?`

They will not, because their native error objects are shaped differently and their messages are not stable API contracts.

The better question is: `After MC adapter normalization, do both validators produce the same canonical repair categories for the same fixture failure?`

That turns validator output into evidence while keeping MC's repair language stable.

## Design pattern

### 1. Two-validator execution

For each fixture candidate:

1. Validate with Ajv using the same JSON Schema dialect target.
2. Validate with python-jsonschema using the corresponding Draft202012Validator.
3. Capture raw validator outputs without exposing them as reviewer-facing truth.
4. Normalize each raw error into `canonical-validation-error.v1`.
5. Group canonical errors into repair categories.
6. Compare category convergence.
7. Generate a convergence report.

### 2. Canonical convergence target

The system should compare these fields, not the native raw messages:

- `fixture_id`
- `schema_id`
- `validator_name`
- `validator_version`
- `instance_pointer`
- `schema_pointer`
- `keyword`
- `repair_category`
- `severity`
- `reviewer_message`
- `raw_error_digest`

Raw messages may be stored in an audit appendix, but should not define convergence.

### 3. Stable repair categories

Initial categories:

- `missing_required_field`
- `wrong_type`
- `invalid_enum`
- `format_or_pattern_mismatch`
- `range_or_length_violation`
- `unexpected_field`
- `schema_logic_failure`
- `ambiguous_validator_output`
- `schema_invalid`
- `adapter_failure`

`ambiguous_validator_output` is not failure-by-default. It means the fixture needs human review or adapter improvement.

### 4. Convergence states

Use these report-level states:

- `converged`: both validators map to the same repair category set.
- `partially_converged`: at least one category matches, but one validator emits additional normalized categories.
- `diverged`: both validators fail, but canonical categories differ.
- `single_validator_failure`: one validator passes and one fails.
- `adapter_failure`: validation ran, but normalization failed.
- `schema_runtime_failure`: schema cannot be loaded or compiled.

### 5. Reviewer boundary

A converged report means only this:

> The fixture is structurally invalid in the same MC repair-language category across both validator paths.

It must not mean:

- the scenario's symbolic meaning is correct,
- the agency label is correct,
- `Caution` vs `Suspect` has been resolved,
- the LLM judge is authoritative,
- the reviewer must agree with the schema.

Schema validates reviewability. Reviewers decide agency meaning.

## Prototype report shape

```json
{
  "report_id": "agency-validator-convergence-001",
  "schema_id": "agency-near-miss-fixture.v1",
  "fixture_id": "near_miss_001_broken_required_field",
  "run_timestamp": "2026-06-29T00:00:00Z",
  "validators": [
    {
      "name": "ajv",
      "version": "recorded-at-runtime",
      "passed": false,
      "canonical_error_count": 1,
      "repair_categories": ["missing_required_field"]
    },
    {
      "name": "python-jsonschema",
      "version": "recorded-at-runtime",
      "passed": false,
      "canonical_error_count": 1,
      "repair_categories": ["missing_required_field"]
    }
  ],
  "convergence_state": "converged",
  "converged_repair_categories": ["missing_required_field"],
  "non_converged_repair_categories": [],
  "reviewer_summary": "Both validators found the fixture missing required schema evidence. Repair the fixture before agency review.",
  "authority_boundary": "Validator convergence establishes structural repairability only; it does not decide symbolic truth or agency label correctness."
}
```

## CI acceptance rule

CI should pass when:

- the schema loads in both validator stacks,
- every valid fixture passes both validators,
- every intentionally broken fixture fails at least one validator,
- every intentionally broken fixture maps to an expected MC repair category,
- adapter failures are zero,
- divergence is either zero or explicitly whitelisted in a reviewer-readable exception file.

CI should fail when:

- a schema cannot compile,
- a raw validator error cannot be normalized,
- a broken fixture passes both validators unexpectedly,
- expected repair categories are missing,
- convergence diverges without an explicit exception note.

## Implementation sketch

### Files to add next

- `mind/validation/fixtures/near-miss/valid/near_miss_001.valid.json`
- `mind/validation/fixtures/near-miss/broken/near_miss_001.missing_required_field.json`
- `mind/validation/expected/near_miss_001.missing_required_field.expected.json`
- `mind/validation/reports/examples/near_miss_001.convergence-report.json`
- `mind/validation/README.md`

### Runner phases

1. Load schema.
2. Load fixture.
3. Run Ajv.
4. Run python-jsonschema.
5. Normalize raw errors into canonical errors.
6. Compare repair-category sets.
7. Emit convergence report.
8. Emit reviewer-facing repair receipt.

## Public-safe rule

Fixture text should stay abstract and non-instructional. The runner can test agency-pressure categories without providing vivid manipulative examples. Broken fixtures should break evidence shape, labels, or provenance fields—not teach coercive phrasing.

## Durable decision

MC should implement a hybrid convergence runner:

- Ajv and python-jsonschema act as independent structural witnesses.
- `canonical-validation-error.v1` is the shared error language.
- convergence reports prove repair-category stability.
- reviewer receipts stay human-readable.
- validator agreement never becomes symbolic authority.

## Next research question

How should MC define the first expected-output fixture pack so valid, broken, and divergent cases test the adapter without creating brittle CI or hiding meaningful validator disagreement?
