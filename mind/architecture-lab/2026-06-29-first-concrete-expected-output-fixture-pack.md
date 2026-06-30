# First Concrete Expected-Output Fixture Pack

## Architecture question

How should MC create the first concrete expected-output JSON pack and three seed fixtures so the runner can be implemented immediately in CI?

## Researched sources

- JSON Schema Draft 2020-12 and its recommended output structure.
- Ajv validation behavior and error object shape.
- python-jsonschema `ValidationError` fields.
- JSON-Schema-Test-Suite style: small fixture cases with explicit expected validity, designed to be validator-neutral.
- Recent structured-output reliability work: schemas improve reviewability, but schema conformance is not the same as semantic correctness.

## Useful concepts extracted

1. Compare canonical categories, not raw validator messages.
   Raw validator output is library-specific. The stable MC layer should compare normalized repair categories.

2. Keep valid, broken, and divergent cases separate.
   A useful seed pack needs one clean pass, one intentional structural failure, and one policy-boundary case.

3. Treat format validation as policy-sensitive.
   Some validators treat `format` as annotation unless strict checking is enabled. CI should surface that as a policy choice, not silently pretend all validators mean the same thing.

4. Preserve raw errors for audit, but do not show them as reviewer language.
   The user-facing repair receipt should be stable and readable. Raw errors remain evidence.

5. State that validation is not symbolic truth.
   A passing fixture only means the object is shaped for review. It does not decide meaning, agency, manipulation, or final label.

## Implementation added

### Seed fixtures

- `mind/fixtures/agency-near-miss/v1/seed-001-valid-choice-preserving-caution.json`
  - Valid baseline.
  - Expected to pass both validators.
  - Tests choice-preserving, uncertainty-stating, non-coercive reflection.

- `mind/fixtures/agency-near-miss/v1/seed-002-broken-missing-evidence.json`
  - Intentionally broken fixture.
  - Missing required evidence object.
  - Expected repair categories: `missing_required_evidence`, `insufficient_choice_surface`.

- `mind/fixtures/agency-near-miss/v1/seed-003-divergent-format-boundary.json`
  - Divergence boundary fixture.
  - Uses `2026-02-30` to test validator/date-format policy differences.
  - Expected repair category: `format_boundary_requires_policy`.

### Expected-output pack

- `mind/fixtures/agency-near-miss/v1/expected-output-pack.seed-001-003.json`
  - Defines CI equivalence as canonical repair-category convergence.
  - Ignores raw message text and raw error order.
  - Preserves instance path, schema path, validator identity, and raw message for audit.
  - Requires every report to include a symbolic-truth disclaimer.

## What changed in understanding

The runner should not start with a large scenario bank. It should start with a small convergence proof:

- one clean fixture proves the schema accepts reviewable shape;
- one broken fixture proves repair receipts work;
- one divergent fixture proves CI can expose validator-policy differences without turning them into false failures.

This converts the architecture from "build validators" into "build a stable agency-review evidence adapter."

## CI acceptance rule

The first runner is ready when it can produce a convergence report showing:

1. Ajv result.
2. python-jsonschema result.
3. Raw errors preserved.
4. Canonical repair categories generated.
5. Expected-output pack comparison.
6. Divergence shown as reviewer-readable policy evidence, not hidden or overruled.

## Public-safety rule

The fixtures must stay abstract. They should test agency-pressure structure without teaching manipulation patterns or embedding private user material.

## Next research question

How should MC implement the first paired validator runner script and convergence report generator in CI, including pinned validator versions, format-validation policy, and a reviewer-readable Markdown/JSON report pair?
