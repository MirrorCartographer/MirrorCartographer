# Paired Validator Runner CI Implementation Plan

Date: 2026-06-29
Status: Architecture lab / prototype plan
Public-safety posture: public-safe, no private user material, no emotionally vivid manipulation examples

## Architecture question

How should MC implement the first paired validator runner script and convergence report generator in CI, including pinned validator versions, format-validation policy, and reviewer-readable Markdown/JSON report pair?

## Short answer

MC should implement a small, deterministic, dual-runtime validation harness that runs the same fixture pack through Ajv and python-jsonschema, normalizes each validator's raw errors into `canonical-validation-error.v1`, and emits two reports:

1. machine-readable JSON for CI and future dashboards;
2. reviewer-readable Markdown for human repair work.

The runner must not claim symbolic truth. It should only claim that a fixture is structurally reviewable, broken in a known way, or divergent across validator engines after MC normalization.

## Current-source research extracted

### JSON Schema output model

JSON Schema 2020-12 defines validation output as platform-independent and recommends that implementations support standard output structures. It names four output levels: flag, basic, detailed, and verbose. The useful MC concept is: validator output is not naturally uniform, but JSON Schema gives a vocabulary for minimum useful validation reporting.

Useful concept for MC: adopt a validator-neutral internal output envelope rather than exposing library-native output.

Source: https://json-schema.org/draft/2020-12/json-schema-core

### Ajv error model

Ajv returns validation failure through an `errors` array. Each error object includes fields such as `keyword`, `instancePath`, `schemaPath`, `params`, and optionally `message`, plus verbose extras if enabled.

Useful concept for MC: Ajv is strong for JavaScript/Node CI and has stable machine fields, but its messages are not the public repair language.

Source: https://ajv.js.org/api.html#error-objects

### python-jsonschema error model

python-jsonschema exposes `ValidationError` fields such as `message`, `validator`, `validator_value`, `schema_path`, `path`, `json_path`, `instance`, `schema`, `context`, and parent/sub-error relationships.

Useful concept for MC: python-jsonschema gives rich error trees. MC should flatten only what is needed for canonical repair categories and preserve nested context as evidence, not as reviewer-facing truth.

Source: https://python-jsonschema.readthedocs.io/en/stable/errors/

### GitHub Actions hardening

GitHub's secure-use guidance says third-party actions can compromise jobs and recommends pinning actions to a full-length commit SHA for immutable releases. It also recommends auditing action source code and using CODEOWNERS for workflow files.

Useful concept for MC: CI should be boring and locked down. Use pinned versions for runtime dependencies and pin external actions where possible. Treat workflow changes as architecture-sensitive.

Source: https://docs.github.com/en/actions/reference/security/secure-use

### CI maintenance cost

Recent empirical work on GitHub Actions shows workflows create recurring maintenance effort, including bug fixes, dependency changes, and CI/CD improvements. Recent CI caching research also shows that caching improves efficiency but creates its own repeated maintenance pattern.

Useful concept for MC: the first runner should avoid clever caching and oversized automation. Start small, reproducible, and explainable; add caching only after timing data proves it is worth the maintenance burden.

Sources:
- https://arxiv.org/abs/2409.02366
- https://arxiv.org/abs/2604.13129

## What changed in understanding

Before this step, MC had a schema, canonical error envelope, and seed expected-output pack. The missing piece was operational: how to make CI prove useful convergence without turning validator agreement into a false authority.

The refined understanding:

- Validator agreement is an infrastructure signal, not a meaning signal.
- Raw Ajv and python-jsonschema errors are evidence, not reviewer language.
- The normalized category is the stable contract.
- Markdown reports are for repair, JSON reports are for reproducibility.
- Divergence is not always failure; some divergence should be marked expected when it comes from format-validation policy or known library behavior.
- CI should compare ordered sets only after canonicalization, not raw messages or library-specific paths.

## Design pattern: dual-run, normalize, compare, report

### Layer 1: fixture discovery

Input directory:

- `mind/fixtures/agency-near-miss/v1/*.json`

Expected-output pack:

- `mind/fixtures/agency-near-miss/v1/expected-output-pack.seed-001-003.json`

Schema inputs:

- `mind/schemas/agency-near-miss-fixture.v1.schema.json`
- `mind/schemas/canonical-validation-error.v1.schema.json`
- `mind/schemas/agency-validation-report.v1.schema.json`

### Layer 2: validator execution

Run each fixture twice:

- Node runtime: Ajv 2020 mode, allErrors enabled, strict mode enabled unless an existing schema requires an explicit exception.
- Python runtime: jsonschema Draft202012Validator, collect all iterable errors.

Both runners should emit raw evidence files before normalization.

Suggested raw evidence paths:

- `mind/reports/agency-validation/raw/ajv.seed-001-003.json`
- `mind/reports/agency-validation/raw/python-jsonschema.seed-001-003.json`

### Layer 3: canonical normalization

Each raw error maps to `canonical-validation-error.v1`.

Minimum canonical fields:

- `validator_name`
- `validator_version`
- `fixture_id`
- `instance_pointer`
- `schema_pointer`
- `keyword`
- `repair_category`
- `severity`
- `raw_message_hash`
- `raw_evidence_ref`
- `normalization_notes`

Repair categories remain owned by MC, not by Ajv or python-jsonschema.

Initial repair categories:

- `missing_required_evidence`
- `wrong_type`
- `enum_out_of_range`
- `additional_property`
- `format_policy_boundary`
- `schema_reference_failure`
- `unknown_validator_divergence`

### Layer 4: convergence comparison

Compare each fixture against expected output using normalized category sets.

Comparison should check:

- Does each validator produce the expected pass/fail state?
- Does each validator map errors to the expected repair categories?
- Are any divergent categories expected and explained?
- Are any raw errors unmapped?
- Are any expected categories missing?

Do not compare:

- raw message text;
- raw error order;
- stack traces;
- full library-native object equality.

### Layer 5: report generation

Generate paired reports:

- JSON report: `mind/reports/agency-validation/convergence.seed-001-003.v1.json`
- Markdown report: `mind/reports/agency-validation/convergence.seed-001-003.v1.md`

The JSON report supports CI and dashboards. The Markdown report supports reviewers.

Report states:

- `pass`: valid fixture or expected broken fixture matched expected categories.
- `repair_needed`: fixture failed in a way that is structurally clear and mapped.
- `expected_divergence`: validators disagree in a known and documented boundary case.
- `unexpected_divergence`: validators disagree in a way MC has not normalized.
- `adapter_gap`: raw validator error exists but no canonical category maps it.
- `schema_contract_gap`: fixture failure reveals missing information in the schema itself.

## CI policy

### Initial CI job

Name: `agency-fixture-validation`

Trigger:

- pull request touching `mind/schemas/**`, `mind/fixtures/**`, `mind/architecture-lab/**`, or validator scripts;
- manual dispatch;
- push to main for report refresh.

Job matrix:

- Node pinned runtime version.
- Python pinned runtime version.

Dependency policy:

- Pin Ajv major/minor/patch in package lock.
- Pin python-jsonschema major/minor/patch in requirements lock.
- Record runtime versions in every report.
- If a dependency update changes canonical categories, require a report diff and architecture note.

GitHub Actions policy:

- Prefer official actions.
- Pin third-party actions to full-length commit SHA when used.
- Keep workflow permissions minimal.
- Use CODEOWNERS or equivalent review protection for workflow and schema changes.

Format-validation policy:

- Default: format assertions are disabled unless a fixture explicitly opts into a format-boundary test.
- Format-boundary fixtures must declare the policy in the fixture metadata and expected-output pack.
- Any validator difference caused by format policy is `expected_divergence` only when the expected-output pack says so.

## Prototype file plan

### Scripts

Add:

- `mind/tools/agency_validation/run_ajv_validation.mjs`
- `mind/tools/agency_validation/run_python_jsonschema_validation.py`
- `mind/tools/agency_validation/normalize_validation_errors.py`
- `mind/tools/agency_validation/compare_expected_outputs.py`
- `mind/tools/agency_validation/render_convergence_markdown.py`

### Configuration

Add:

- `mind/tools/agency_validation/repair-category-map.v1.json`
- `mind/tools/agency_validation/validator-policy.v1.json`

### CI

Add:

- `.github/workflows/agency-fixture-validation.yml`

### Reports

Generated, not hand-authored:

- `mind/reports/agency-validation/convergence.seed-001-003.v1.json`
- `mind/reports/agency-validation/convergence.seed-001-003.v1.md`

## Acceptance criteria

The first implementation is acceptable when:

1. seed 001 passes both validators;
2. seed 002 fails both validators and maps to `missing_required_evidence`;
3. seed 003 either maps to `expected_divergence` or proves that the fixture should be rewritten;
4. raw validator messages are saved as evidence but not used as reviewer language;
5. CI fails only on `unexpected_divergence`, `adapter_gap`, `schema_contract_gap`, or missing expected categories;
6. Markdown output tells a reviewer what to repair without requiring them to understand Ajv or python-jsonschema internals;
7. JSON output validates against `agency-validation-report.v1.schema.json`.

## Failure handling

If CI fails because of an unexpected validator change, do not immediately loosen the schema. First classify the failure:

- fixture bug;
- schema contract bug;
- canonical adapter bug;
- validator version behavior change;
- format-validation policy conflict;
- real architecture disagreement.

Only after classification should MC update the fixture, schema, adapter, or expected-output pack.

## Public-safe boundary

This runner validates structure around agency-pressure fixtures. It must not contain personal user data, therapy claims, diagnostic claims, or vivid manipulation examples. The fixture language should remain abstract, paired, and review-oriented.

## Next research question

How should MC design the `repair-category-map.v1.json` taxonomy so it is stable enough for CI but flexible enough to absorb new validator behavior, schema gaps, and reviewer disagreement without category sprawl?
