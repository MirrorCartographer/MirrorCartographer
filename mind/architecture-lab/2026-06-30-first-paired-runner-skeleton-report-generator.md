# First Paired Runner Skeleton + Report Generator

Date: 2026-06-30
Status: Architecture plan ready for implementation
Public-safety level: public-safe; no private or personal material included

## Architecture question

How should Mirror Cartographer implement the first paired validator runner skeleton that writes a valid run manifest, raw capture pair, convergence report JSON, and Markdown reviewer report for the three seed fixtures while keeping GitHub Actions minimal and pinned?

## Research basis

Current sources reviewed:

1. JSON Schema Draft 2020-12 Core, especially output formatting and minimum output information: https://json-schema.org/draft/2020-12/json-schema-core
2. Ajv API documentation for validation error objects: https://ajv.js.org/api.html#error-objects
3. python-jsonschema documentation for `ValidationError` fields and error trees: https://python-jsonschema.readthedocs.io/en/stable/errors/
4. GitHub Actions secure-use guidance, including pinning third-party actions to full-length commit SHAs: https://docs.github.com/en/actions/reference/security/secure-use
5. GitHub Actions workflow syntax and `permissions` behavior: https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-syntax
6. 2026 research on agentic workflow injection in GitHub Actions: https://arxiv.org/abs/2605.07135
7. 2026 research comparing GitHub Actions security scanners and common weaknesses such as excessive permissions and ambiguous versions: https://arxiv.org/abs/2601.14455

## Useful concepts extracted

### 1. The runner should be a small deterministic evidence machine

The runner must not interpret symbolic truth. It should only answer:

- Did each fixture validate under Ajv?
- Did each fixture validate under python-jsonschema?
- What raw errors did each library produce?
- What canonical repair categories did MC map those errors into?
- Did the canonical categories converge with the expected-output pack?
- Were all generated reports themselves schema-valid?

This keeps the infrastructure layer narrow and reviewable.

### 2. JSON Schema output locations matter more than messages

JSON Schema 2020-12 defines output concepts such as instance location, keyword location, absolute schema location, annotations, errors, and nested results. The stable parts for MC are locations and keywords, not prose error messages. Raw messages should remain debug evidence only.

### 3. Ajv and python-jsonschema should be treated as independent witnesses

Ajv exposes error objects with fields such as `keyword`, `instancePath`, `schemaPath`, `params`, and `message`. python-jsonschema exposes `ValidationError` fields such as `message`, `path`, `schema_path`, `validator`, `validator_value`, `instance`, `schema`, and nested `context`.

The runner should normalize these into MC-owned canonical records, while preserving raw evidence for debugging.

### 4. CI should fail only on governed contracts

CI should fail when:

- a fixture expected to pass fails after normalization;
- a fixture expected to fail does not produce the expected canonical repair category;
- Ajv and python-jsonschema disagree where convergence is required;
- generated manifest/report files do not validate against MC schemas;
- the runner cannot produce complete artifacts.

CI should not fail because raw validator messages changed wording.

### 5. GitHub Actions must be deliberately boring

The workflow should be minimal, pinned, and least-privilege:

- read-only repository permissions by default;
- no write token for validation jobs;
- no untrusted issue/comment/body text passed into an agentic step;
- pinned third-party actions by full-length commit SHA where used;
- pinned Node/Python dependency versions;
- no network dependency during validation beyond dependency installation;
- uploaded artifacts only for report review.

This matters because recent GitHub Actions research shows that agentic workflows create new injection paths when untrusted event context reaches prompts, scripts, tools, or privileged workflow logic.

## Implementation target

Create a runner that can process the existing seed pack:

- `mind/fixtures/agency-near-miss/v1/seed-001-valid-choice-preserving-caution.json`
- `mind/fixtures/agency-near-miss/v1/seed-002-broken-missing-evidence.json`
- `mind/fixtures/agency-near-miss/v1/seed-003-divergent-format-boundary.json`
- `mind/fixtures/agency-near-miss/v1/expected-output-pack.seed-001-003.json`

The runner should write a deterministic output directory shaped like this:

- `mind/reports/agency-validation/latest/run-manifest.json`
- `mind/reports/agency-validation/latest/convergence-report.json`
- `mind/reports/agency-validation/latest/convergence-report.md`
- `mind/reports/agency-validation/latest/raw/seed-001-valid-choice-preserving-caution.ajv.json`
- `mind/reports/agency-validation/latest/raw/seed-001-valid-choice-preserving-caution.python-jsonschema.json`
- `mind/reports/agency-validation/latest/raw/seed-002-broken-missing-evidence.ajv.json`
- `mind/reports/agency-validation/latest/raw/seed-002-broken-missing-evidence.python-jsonschema.json`
- `mind/reports/agency-validation/latest/raw/seed-003-divergent-format-boundary.ajv.json`
- `mind/reports/agency-validation/latest/raw/seed-003-divergent-format-boundary.python-jsonschema.json`

A later CI version can also write timestamped run directories, but `latest/` is the first diff-friendly target.

## Runner skeleton requirements

### Inputs

The runner accepts:

- fixture schema path;
- expected-output pack path;
- fixture directory path;
- repair-category map path;
- output directory path;
- format-validation policy: strict, relaxed, or off.

Default for the first runner: `format-validation: off`, because the fixture set already contains one divergent format-boundary case and the current goal is adapter convergence, not email/URI/date validation semantics.

### Processing steps

1. Load expected-output pack.
2. Load repair-category map.
3. Load each fixture listed in the pack.
4. Validate fixture with Ajv.
5. Validate fixture with python-jsonschema.
6. Write raw capture files for both validators.
7. Normalize each raw error into `canonical-validation-error.v1`.
8. Compare canonical categories against expected-output pack.
9. Build `agency-validation-run-manifest.v1`.
10. Build `agency-convergence-report.v1`.
11. Validate both generated files against their schemas.
12. Render Markdown reviewer report from the convergence report JSON.
13. Exit nonzero only for governed contract failures.

### Canonical result statuses

Use a small stable set:

- `pass`: fixture and generated reports match governed expectations.
- `expected_failure`: fixture fails exactly as expected and repair categories converge.
- `expected_divergence`: validators differ in a known, documented boundary case.
- `unexpected_failure`: fixture or report failed outside expectations.
- `unexpected_pass`: fixture passed when a failure was expected.
- `unexpected_divergence`: validator disagreement was not declared in expected output.
- `runner_error`: the runner failed before producing complete evidence.

### Markdown report sections

The Markdown report should be readable without opening raw JSON:

1. Run identity
2. Tool versions
3. Format-validation policy
4. Fixture summary table
5. Convergence status
6. Repair categories observed
7. Divergences and why they are acceptable or unacceptable
8. Generated artifact paths
9. CI decision
10. Human reviewer notes

The Markdown report must include a repeated boundary sentence:

Schema convergence means the evidence contract is reviewable. It does not mean the symbolic interpretation is true.

## Minimal GitHub Actions plan

Workflow name: `agency-fixture-validation`

Triggers:

- pull request touching `mind/schemas/**`, `mind/fixtures/**`, `mind/config/**`, `tools/agency-validation/**`, or workflow file;
- manual dispatch;
- optionally push to main after the prototype stabilizes.

Permissions:

- `contents: read`

Jobs:

1. Checkout repository.
2. Set up pinned Node version.
3. Set up pinned Python version.
4. Install pinned dependencies from lockfiles.
5. Run paired validator runner.
6. Validate generated manifest/report JSON.
7. Upload report artifacts.

Security boundary:

- Do not grant write permissions.
- Do not use issue/comment/body text as executable or model-consumed input.
- Do not run agentic tools in the validation workflow.
- Prefer pinned action SHAs for third-party actions.

## Prototype file plan

Add later implementation files:

- `tools/agency-validation/package.json`
- `tools/agency-validation/package-lock.json`
- `tools/agency-validation/pyproject.toml` or `requirements.lock.txt`
- `tools/agency-validation/run-paired-validation.mjs`
- `tools/agency-validation/normalize-ajv-error.mjs`
- `tools/agency-validation/normalize-python-jsonschema.py`
- `tools/agency-validation/render-convergence-markdown.mjs`
- `.github/workflows/agency-fixture-validation.yml`

Keep the first implementation deliberately small. The goal is not a general validation platform. The goal is one reliable loop over the first three fixtures.

## What changed in understanding

Before this step, MC had the schemas and report contract, but not the operational boundary for the first runner. The important refinement is this:

The runner is not a truth engine, not a symbolic judge, and not an agent. It is a deterministic adapter-convergence harness. Its job is to prove that the evidence pipeline is stable enough for a human reviewer to trust the shape of the evidence while still reserving interpretation for the reviewer layer.

That means CI should be boring, narrow, pinned, and least-privilege. The emotionally complex part of MC belongs outside the validator runner. The runner protects that complexity by refusing to pretend it can validate meaning.

## Added durable artifact type

Design pattern / prototype plan:

`Paired Validator Evidence Harness`

Pattern summary:

Use two independent validators as witnesses, preserve their raw outputs, normalize them into MC-owned repair categories, validate the generated reports, and make CI assert only the governed evidence contract.

## Next architecture question

How should MC implement the first actual `tools/agency-validation` runner files so the three seed fixtures produce real raw captures, canonical repair receipts, a self-validating manifest, a self-validating convergence report, and a Markdown report in one command?
