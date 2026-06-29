# Expected-Output Fixture Pack Contract

Date: 2026-06-29
Status: Durable architecture note / schema companion
Public-safety level: public-safe; no private user material; all examples are abstract validation artifacts.

## Architecture question

How should MC define the first expected-output fixture pack so valid, broken, and divergent cases test the adapter without creating brittle CI or hiding meaningful validator disagreement?

## Research basis

Current sources checked:

- JSON Schema 2020-12 core: output formatting defines minimum information such as keyword location, instance location, error or annotation, nested results, and multiple output structures.
- Ajv API documentation: Ajv error objects expose library-specific fields such as `keyword`, `instancePath`, `schemaPath`, `params`, and optional `message`.
- python-jsonschema documentation: `ValidationError` exposes a different error model with `validator`, `validator_value`, `path`, `schema_path`, `absolute_path`, `absolute_schema_path`, and `context`.
- JSON-Schema-Test-Suite: language-agnostic test cases separate schema, data, description, and validity rather than making one validator's native error text the contract.
- Recent structured-output research: schema validity can be high while semantic/value correctness remains lower; structure checks must be reported separately from meaning checks.
- Recent JSON Schema research: modern JSON Schema has complex keyword interactions and validator behavior can differ, so MC should compare normalized expectations rather than raw outputs.

## Change in understanding

The first expected-output pack should not lock CI to exact raw validator messages, exact error ordering, or a single validator's phrasing.

The durable contract should lock only these things:

1. valid controls pass both validators;
2. intentionally broken fixtures do not unexpectedly pass both validators;
3. raw errors normalize into MC repair categories;
4. expected repair-category sets are present;
5. divergence is visible and justified, not silently hidden;
6. reviewer receipts say what to repair without implying symbolic authority.

This makes the pack stable enough for CI but flexible enough to survive normal validator-library differences.

## Design decision

Add a machine-readable expected-output contract:

`mind/schemas/agency-validator-expected-output-pack.v1.schema.json`

This schema defines:

- `run_policy`: required validator pair, comparison unit, and brittleness controls;
- `cases`: valid controls, broken expected cases, divergence-expected cases, and adapter guards;
- `expected_validator_outcome`: per-validator pass/fail expectation plus required repair categories;
- `expected_convergence_state`: whether the case should converge, partially converge, or diverge with an explicit whitelist;
- `brittleness_controls`: forbids exact raw-message and error-order assertions;
- `reviewer_receipt`: human-facing summary, repair instruction, and meaning boundary;
- `authority_boundary`: explicit statement that validation convergence is structural only.

## Fixture pack pattern

### Case type 1: valid control

Purpose: prove the fixture schema still accepts a clean public-safe scenario.

Expected state:

- Ajv: pass
- python-jsonschema: pass
- repair categories: none
- convergence state: `valid_control_passed`

Reviewer meaning: fixture is reviewable, not proven correct.

### Case type 2: broken expected

Purpose: prove both validators catch a simple structural fault and the adapter maps it to the same repair category.

Examples of safe faults:

- missing required field
- wrong type
- unsupported enum value
- extra field under `additionalProperties: false`
- text too short

Expected state:

- both validators fail;
- expected repair category appears;
- convergence state is `converged` or `partially_converged`.

Reviewer meaning: repair the fixture before agency review.

### Case type 3: divergence expected

Purpose: preserve meaningful validator differences instead of hiding them.

Use only when a schema feature or format behavior may vary across libraries.

Expected state:

- divergence must be explicitly whitelisted;
- `divergence_justification` is required by policy;
- reviewer receipt must explain that this is a validator-boundary case, not a symbolic-agency conclusion.

Reviewer meaning: inspect the adapter or schema feature before trusting automated convergence.

### Case type 4: adapter guard

Purpose: prove the adapter fails loudly when it sees unknown raw error shapes.

Expected state:

- adapter failure is captured as a category;
- CI fails unless this case is explicitly marked as an adapter guard;
- no symbolic or agency conclusion is allowed.

Reviewer meaning: update the adapter, not the scenario label.

## CI acceptance rule

CI should pass when:

- schema files compile;
- expected-output pack validates;
- valid controls pass both validators;
- broken expected cases fail at least one validator;
- required repair categories are present after normalization;
- whitelisted divergence includes a clear justification;
- adapter failures are zero except in explicit adapter-guard cases.

CI should fail when:

- a broken case unexpectedly passes both validators;
- a raw validator error cannot normalize;
- required repair categories are missing;
- unwhitelisted divergence appears;
- a test depends on exact raw validator message text;
- a test depends on raw error ordering;
- a report claims label truth, symbolic truth, or user intent.

## Public-safe implementation plan

Add these files next:

- `mind/validation/expected/agency-validator-pack-001.expected.json`
- `mind/validation/fixtures/near-miss/valid/mc-agency-nearmiss-001.valid.json`
- `mind/validation/fixtures/near-miss/broken/mc-agency-nearmiss-001.missing-required-field.json`
- `mind/validation/fixtures/near-miss/broken/mc-agency-nearmiss-001.invalid-enum.json`
- `mind/validation/fixtures/near-miss/divergent/mc-agency-nearmiss-001.format-boundary.json`
- `mind/validation/reports/examples/mc-agency-nearmiss-001.convergence-report.json`

All fixtures should stay abstract and low-vividness. Broken cases should break schema shape, not include vivid manipulative instructions.

## Durable rule

MC should compare validator outputs through the MC canonical repair vocabulary, not through raw library messages.

The expected-output pack is a testing contract for reviewability. It must never become a truth engine for symbolic interpretation, user agency, user intent, or `Caution` vs `Suspect` label correctness.

## Next research question

How should MC create the first concrete expected-output JSON pack and three seed fixtures so the runner can be implemented immediately in CI?
