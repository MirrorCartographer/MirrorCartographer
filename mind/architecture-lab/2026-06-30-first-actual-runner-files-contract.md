# First actual agency validation runner files contract

Date: 2026-06-30
Status: implementation contract
Scope: public-safe MC architecture lab

## Architecture question

How should MC implement the first actual `tools/agency-validation` runner files so the three seed fixtures produce real raw captures, canonical repair receipts, a self-validating manifest, a self-validating convergence report, and a Markdown report in one command?

## Research basis

Current sources checked:

- JSON Schema Draft 2020-12 core and output model: https://json-schema.org/draft/2020-12/json-schema-core
- Ajv API reference, especially validation errors and `ErrorObject`: https://ajv.js.org/api.html#validation-errors
- python-jsonschema 4.26.0 error handling and `ValidationError` attributes: https://python-jsonschema.readthedocs.io/en/stable/errors/
- GitHub Actions secure-use reference: https://docs.github.com/en/actions/reference/security/secure-use
- Recent 2026 research on agentic workflow injection risk in GitHub Actions: https://arxiv.org/abs/2605.07135

## Useful concepts extracted

1. JSON Schema output is a report format, not a meaning engine.
   - Draft 2020-12 defines basic, detailed, and verbose output structures.
   - MC should borrow the location vocabulary: keyword location, absolute keyword location, instance location, nested errors.
   - MC should not require both validators to emit the same native output shape.

2. Ajv and python-jsonschema expose different native evidence.
   - Ajv errors expose `keyword`, `instancePath`, `schemaPath`, `params`, and optional `message`.
   - python-jsonschema exposes `validator`, `validator_value`, `path`, `schema_path`, `absolute_path`, `absolute_schema_path`, `json_path`, `context`, and `cause`.
   - Therefore the runner must normalize evidence into MC-owned canonical categories before CI interpretation.

3. Raw messages are debugging material, not CI targets.
   - Error message text may be useful to humans but should not be asserted as stable.
   - CI should assert schema validity, expected-output pack match, canonical repair category convergence, and self-validation of reports.

4. CI must be minimal and low privilege.
   - GitHub recommends least-privilege `GITHUB_TOKEN` permissions.
   - Third-party actions should be pinned to full-length commit SHAs when used.
   - Workflows should avoid untrusted context in inline shell scripts.
   - For MC, the first runner should be local-first and require no secrets.

5. Agentic workflow injection changes the trust boundary.
   - The paired runner must not ingest issue text, PR text, comments, chat exports, or personal material as executable instructions.
   - Fixtures stay synthetic, abstracted, and public-safe.

## Changed understanding

The runner should not be built as an agent, evaluator, symbolic interpreter, or therapeutic analysis process. It should be a deterministic evidence harness.

The minimum useful implementation is not “validate fixture and print errors.” It is a five-layer output contract:

1. raw validator captures,
2. canonical repair receipts,
3. run manifest,
4. convergence report JSON,
5. reviewer-readable Markdown report.

The manifest and convergence report schemas already exist and should become the runner’s self-check gate. If those reports are invalid, CI must stop before interpreting convergence status.

## Required repository files

Add this directory:

- `tools/agency-validation/`

Required first files:

- `tools/agency-validation/README.md`
- `tools/agency-validation/package.json`
- `tools/agency-validation/requirements.txt`
- `tools/agency-validation/run-agency-validation.mjs`
- `tools/agency-validation/py_validate_fixture.py`
- `tools/agency-validation/lib/load-json.mjs`
- `tools/agency-validation/lib/run-ajv.mjs`
- `tools/agency-validation/lib/run-python-jsonschema.mjs`
- `tools/agency-validation/lib/normalize-error.mjs`
- `tools/agency-validation/lib/write-reports.mjs`
- `tools/agency-validation/lib/self-validate-reports.mjs`

Optional first CI file, only after local command works:

- `.github/workflows/agency-validation.yml`

## Dependency pinning policy

First implementation should pin exact package versions, then update intentionally.

Node:

- `ajv` pinned to an exact version.
- `ajv-formats` pinned to an exact version only if format assertions are enabled.

Python:

- `jsonschema==4.26.0` or current checked version at implementation time.
- `referencing` should be included only if directly needed for local reference loading.

GitHub Actions:

- Prefer no third-party actions except official setup actions.
- If third-party actions are added later, pin to full-length commit SHA.
- Set default workflow permissions to read-only.

## One-command target

The first local command should be:

`node tools/agency-validation/run-agency-validation.mjs --pack mind/fixtures/agency-near-miss/v1/expected-output-pack.seed-001-003.json --out mind/reports/agency-validation/runs/local-latest`

Expected behavior:

1. Load expected-output pack.
2. Resolve fixture paths from the pack.
3. Run Ajv against each fixture.
4. Run python-jsonschema against each fixture through the Python helper.
5. Write raw captures for each validator.
6. Normalize each validator’s errors into canonical repair categories.
7. Compare actual canonical categories against expected-output pack.
8. Write `manifest.json`.
9. Write `convergence-report.json`.
10. Write `convergence-report.md`.
11. Validate `manifest.json` against `mind/schemas/agency-validation-run-manifest.v1.schema.json`.
12. Validate `convergence-report.json` against `mind/schemas/agency-convergence-report.v1.schema.json`.
13. Exit nonzero only for unexpected divergence, invalid report shape, missing fixture/schema/config, or validator runtime failure.

## Output directory contract

For a run root such as:

`mind/reports/agency-validation/runs/local-latest`

Write:

- `manifest.json`
- `convergence-report.json`
- `convergence-report.md`
- `raw/ajv.raw-capture.json`
- `raw/python-jsonschema.raw-capture.json`
- `canonical/repair-receipts.json`

The `local-latest` directory is allowed for local development. CI should use immutable run IDs matching the manifest pattern.

## Canonical repair receipt shape

Each receipt should contain:

- `fixture_id`
- `fixture_path`
- `validator_id`
- `valid`
- `canonical_categories`
- `raw_error_ids`
- `normalization_notes`

Each raw error ID should be deterministic:

`<validator_id>:<fixture_id>:<zero_padded_index>`

Example:

`ajv:seed-002-broken-missing-evidence:0001`

## Normalization rule set v1

The adapter should map from validator evidence to governed categories using `mind/config/repair-category-map.v1.json`.

First matching keys:

- Ajv: `keyword`, `instancePath`, `schemaPath`, selected `params` fields.
- python-jsonschema: `validator`, `path`, `schema_path`, `absolute_path`, `absolute_schema_path`, selected `validator_value` fields.

Do not map from human message text unless there is no structured evidence. If message text fallback is used, mark the receipt with `normalization_notes: ["message_text_fallback_used"]` and make CI treat that category as review-required.

## Divergence handling

Divergence classes:

- `none`: both validators converged on expected category or valid state.
- `expected`: expected-output pack declares the divergence as known.
- `unexpected`: validators disagree and the pack does not authorize it.
- `blocked`: runner could not produce valid evidence.

CI fails on:

- `unexpected`
- `blocked`
- invalid manifest schema
- invalid convergence report schema
- missing raw capture
- missing canonical receipt

CI does not fail on:

- different raw error order
- different raw message wording
- different nested error expansion, if normalized category convergence holds
- expected divergence declared in the pack

## Security and privacy boundary

The runner must not:

- read private chat exports,
- read issue bodies as instruction text,
- call external network services during validation,
- use secrets,
- write personal identifiers into reports,
- treat validator agreement as psychological truth, symbolic truth, medical truth, or user intent.

The runner may:

- process synthetic public-safe fixtures,
- store raw validator evidence for debugging,
- mark public-safe reviewer notes,
- produce deterministic local artifacts.

## First implementation acceptance test

The first implementation is acceptable when:

1. One local command produces all required report files.
2. The valid seed fixture passes as valid.
3. The broken seed fixture maps to the expected governed repair category.
4. The divergent seed fixture is marked expected divergence, not silent pass.
5. Both report JSON files self-validate.
6. Markdown report names the status of all three seed fixtures.
7. No report contains private or personal material.

## Implementation order

1. Add `README.md`, `package.json`, and `requirements.txt`.
2. Implement Ajv runner with raw capture only.
3. Implement Python helper with raw capture only.
4. Implement normalization adapter.
5. Implement report writer.
6. Implement report self-validation.
7. Add minimal CI after local command works.

## Durable decision

MC’s paired validator runner is an infrastructure evidence harness. It is not an agent. It exists to make fixture validation reviewable, reproducible, and safe to automate without confusing schema agreement with human meaning.

## Next research question

How should MC write the actual `run-agency-validation.mjs` and `py_validate_fixture.py` implementations so local validation resolves schemas and fixture paths deterministically without network access or brittle absolute paths?
