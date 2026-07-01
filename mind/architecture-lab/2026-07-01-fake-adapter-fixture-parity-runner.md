# Fake-adapter fixture parity runner design

Date: 2026-07-01
Status: architecture pattern / prototype plan
Public-safety: contains no private user material, no personal case content, and no raw conversational data.

## Architecture question

How should MC implement the first fake-adapter version of `run-fixture-parity.mjs` so every staged gate and exit code can be tested before wiring real Python and Node receipt generators?

## Research basis

Current sources reviewed:

- GitHub Actions exit-code behavior: exit code `0` means success; any nonzero exit code marks the action/check as failed and can cancel or skip dependent work.
- Node.js process semantics: `process.exit()` terminates synchronously and can truncate pending stdout/stderr writes; Node recommends setting `process.exitCode` and allowing graceful termination in most situations.
- Ajv error shape: Ajv exposes structured validation errors with `keyword`, `instancePath`, `schemaPath`, `params`, optional `message`, and optional verbose fields.
- python-jsonschema error shape: `ValidationError` exposes structural fields such as `validator`, `validator_value`, `absolute_path`, `absolute_schema_path`, `context`, and `message`; its `best_match` helper is explicitly heuristic and may change across versions.
- RFC 9457 problem details: durable error artifacts should be machine-readable and stable enough for independent consumers, not just human console text.

## Useful concepts extracted

1. Console output is not the evidence artifact. It is only a short human summary.
2. CI exit code is not the evidence artifact. It is only a binary gate signal.
3. The JSON failure report is the authoritative evidence artifact.
4. The fake adapter should not emulate Ajv or python-jsonschema raw internals too closely; that would create false confidence.
5. The fake adapter should emit controlled canonical receipts or controlled failures, so the orchestrator’s gate behavior can be proven independently from validator behavior.
6. The runner must validate its own failure report before returning a nonzero status, otherwise failed evidence may itself be malformed.
7. Node runner code should prefer `process.exitCode = code` after all file writes and console writes are complete, rather than `process.exit(code)`.

## Design pattern

Name: staged fake-adapter evidence gate.

Pipeline:

1. Read CLI args and repo-relative paths.
2. Validate path scope.
3. Load fixture-pack manifest.
4. Validate manifest against `fixture-pack.v1.schema.json`.
5. Validate every expected fixture receipt against `fixture-expected-receipt.v1.schema.json`.
6. Invoke fake Node adapter.
7. Invoke fake Python adapter.
8. Validate generated production-shaped receipts against `canonical-repair-receipt.v1.schema.json`.
9. Compare generated category sets against expected category sets.
10. Compare Node-generated category sets against Python-generated category sets.
11. Write `fixture-parity-failure-report.v1.json` on failure.
12. Validate the failure report against `fixture-parity-failure-report.v1.schema.json`.
13. Print a compact summary.
14. Set `process.exitCode`.

## Fake-adapter contract

The fake adapter is selected with an explicit mode, not by modifying fixtures.

Required modes:

- `pass`: emit the expected receipt category sets for every fixture.
- `category_mismatch`: emit one fixture with a deterministic wrong category set.
- `missing_fixture`: omit one fixture result.
- `malformed_receipt`: emit one structurally invalid receipt.
- `adapter_crash`: return a controlled adapter failure object without throwing past the orchestrator boundary.

The runner should have no hidden randomness. Every fake failure must be selected by mode and fixture id.

## Exit-code contract

Suggested stable codes:

- `0`: all gates pass.
- `1`: parity mismatch or expected test failure.
- `2`: invalid CLI usage or unsafe path.
- `3`: manifest or expected receipt schema failure.
- `4`: adapter invocation failure.
- `5`: generated receipt schema failure.
- `6`: failure report could not be written or did not validate.

Rule: if the failure report itself fails validation, the runner must return `6`, because evidence production failed.

## Failure report requirements

Failure reports must include:

- schema id/version
- runner name and version
- run id or deterministic local run label
- stage that failed
- exit code selected
- fixture ids affected
- expected category set
- actual category set by runtime
- repo-relative paths only
- no raw private instance values
- short human message
- machine-readable error objects

## Implementation notes for `run-fixture-parity.mjs`

The first implementation should be a thin orchestrator. It should not contain category mapping logic, JSON Schema validation logic beyond invoking the schema validator, or canonical receipt generation logic.

Pseudocode structure:

- `main()` parses args, runs gates, writes summary, sets `process.exitCode`.
- `runGate(name, fn)` returns a normalized gate result.
- `loadJson(path)` only reads and parses.
- `validateJson(schemaPath, value)` returns normalized validation errors.
- `runFakeAdapter(runtime, mode, manifest)` returns generated receipt objects or adapter failure objects.
- `compareCategorySets(expected, actualByRuntime)` returns deterministic mismatch objects.
- `writeFailureReport(result)` writes and validates the report.

Deterministic ordering rules:

- fixture ids sorted lexicographically
- runtimes ordered as `node`, then `python`
- categories sorted lexicographically
- paths normalized to forward-slash repo-relative strings
- report errors sorted by `stage`, then `fixture_id`, then `runtime`, then `path`

## Acceptance criteria

The prototype is ready when tests can prove:

1. `pass` mode exits `0` and writes no failure report.
2. `category_mismatch` exits `1` and writes a valid failure report.
3. `missing_fixture` exits `1` and writes a valid failure report.
4. `malformed_receipt` exits `5` and writes a valid failure report.
5. `adapter_crash` exits `4` and writes a valid failure report.
6. invalid CLI/path exits `2`.
7. invalid manifest or expected receipt exits `3`.
8. intentionally malformed failure-report construction exits `6`.

## Change in understanding

Before this pass, the runner was framed as a thin orchestrator. The deeper distinction is that the fake-adapter version is an *orchestrator calibration harness*. Its job is not to validate MC semantics; its job is to prove that evidence gates, failure reports, and CI signals behave deterministically before the real Python and Node generators are connected.

This prevents a common architecture mistake: wiring real validators into an unproven runner and then being unable to distinguish generator defects from orchestration defects.

## Next architecture question

How should MC define the concrete CLI surface and output path contract for `run-fixture-parity.mjs` so local developers, GitHub Actions, and later repair agents all call the same runner without adapter-specific flags leaking into CI workflows?
