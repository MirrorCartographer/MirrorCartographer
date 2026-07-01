# Fake-adapter `run-fixture-parity.mjs` shell contract

## Architecture question

How should MC implement the first fake-adapter `run-fixture-parity.mjs` shell so it imports the public CLI parser, emits stable exit codes, validates its own failure report schema, and proves staged gates without invoking real Python or Node receipt generators?

## Research basis

Current source review focused on the narrow implementation boundary for a dependency-light Node runner:

- Node's built-in test runner supports direct command-line execution, test reporters, and mock/test-context primitives, so the runner shell can be proven with `node:test` before external adapters are introduced.
- Node `util.parseArgs` is the right public CLI membrane because it supports strict option parsing and throws on unknown flags when configured that way.
- Node `process.exitCode` is safer than immediate `process.exit()` for this runner, because it lets file writes and stdout/stderr finish naturally while still producing deterministic CI status.
- GitHub Actions treats non-zero exit codes as failed actions/check steps, so the runner must map failures to a small stable exit-code table instead of allowing arbitrary thrown errors to define CI behavior.
- Existing MC fixture-pack policy already requires no network, path authority, public-safe abstracted fixtures, and category comparison instead of raw validator message comparison.
- Existing MC failure-report schema already separates machine-readable evidence from console output and requires staged gates, ordered evidence, safety policy, and report-validation visibility.

## Useful concepts extracted

### 1. Shell first, adapters later

The first executable runner should not validate JSON Schema semantics, call Ajv, call Python, or generate production receipts. It should only prove the outer orchestration contract:

CLI parser → manifest read → fake runtime receipt synthesis → staged gate report → self-check report shape → JSON write → compact console summary → stable exit code

This prevents early adapter defects from being confused with runner-boundary defects.

### 2. Fake adapters are calibration fixtures, not validator substitutes

Fake adapters should be deterministic functions over the fixture manifest:

- `valid-empty` returns an empty category set for both runtimes.
- `required-type-enum` returns `["enum", "required", "type"]` for both runtimes.
- An injected test mode may deliberately omit a runtime, add an unexpected category, or corrupt ordering to prove gate failure behavior.

The fake layer may read the manifest and expected receipt files, but it must not read raw captures as if they were validator truth. Raw captures remain evidence fixtures for later real adapter integration.

### 3. Report validation must be visible even before Ajv is wired

The self-validation gate should be present in the emitted report from the start. During the fake-runner phase, it can use a minimal structural checker that enforces the MC schema's critical invariants:

- required top-level fields exist;
- `runner.runner_id` is `run-fixture-parity`;
- `overall_status` is `pass` or `fail`;
- every gate has `gate_id`, `stage`, `status`, and `evidence`;
- failed reports include `summary.first_failed_gate_id`;
- pass reports have zero failed gates and zero failed fixtures;
- paths remain repo-relative and inside public-safe fixture/report boundaries.

Later, this checker is replaced or supplemented by full JSON Schema validation. The contract should not pretend minimal self-checking is equivalent to production schema validation.

### 4. Exit codes are part of the public API

Stable proposed exit codes:

| Code | Meaning | Console shape |
|---:|---|---|
| 0 | all gates pass | `fixture parity: pass` |
| 1 | parity or gate failure | `fixture parity: fail <first_failed_gate_id>` |
| 2 | CLI/config preflight failure | `fixture parity: cli-error <code>` |
| 3 | report could not be written | `fixture parity: io-error <code>` |
| 4 | report self-validation failed | `fixture parity: report-invalid <gate_id>` |

The runner should set `process.exitCode`, write the JSON report when possible, and keep the console line intentionally short. CI and later repair agents should consume the JSON report, not scrape console text.

### 5. Gate stages should be append-only

The fake runner should emit the same gate order the real runner will use:

1. `manifest-validation`
2. `path-authority`
3. `expected-receipt-validation`
4. `generated-receipt-validation`
5. `category-set-comparison`
6. `report-validation`

If a gate fails, later dependent gates are marked `not-run`, not omitted. This makes missing evidence visible and keeps ordering deterministic.

## Implementation plan

### New file

`tools/agency-validation/run-fixture-parity.mjs`

Responsibilities:

1. Import `parseFixtureParityCli`, `FixtureParityCliError`, and `fixtureParityCliUsage` from `fixture-parity-cli.mjs`.
2. Parse `process.argv.slice(2)`.
3. On `--help`, print usage and set exit code `0`.
4. On parser error, emit a minimal failure report if `--report-out` was safely recoverable; otherwise print a compact CLI error and set exit code `2`.
5. Read the fixture manifest declared by the parser config.
6. Validate only enough manifest shape for fake mode to run.
7. Produce fake generated category sets from manifest `expected_category_set`.
8. Compare generated category sets to expected category sets with sorted deterministic arrays.
9. Emit all gates in fixed stage order.
10. Run minimal report self-check.
11. Write JSON report with lexicographically stable object keys.
12. Print one compact console line.
13. Set `process.exitCode` from the stable exit-code table.

### New test file

`tools/agency-validation/run-fixture-parity.test.mjs`

Test only runner shell semantics:

- help path exits `0` and does not read fixtures;
- unknown flags exit `2` through parser membrane;
- default fake run passes against the seed fixture manifest;
- deliberate category mismatch exits `1` and writes first failed gate;
- deliberate report corruption exits `4`;
- unwritable report path exits `3` without losing the compact console summary;
- generated report has every gate in fixed order, including `not-run` gates after a failure.

### Avoid for now

- Do not invoke Ajv or Python.
- Do not compare raw validator messages.
- Do not introduce adapter-specific CLI flags.
- Do not add network access.
- Do not hide gate failures in thrown stack traces.

## Durable design pattern

**Calibrated shell before real adapters**

For cross-runtime MC architecture, prove the membrane before proving the semantic core. A fake adapter is acceptable only when it is explicitly named, deterministic, public-safe, and incapable of masquerading as real validation. The runner's first job is not to know whether a schema violation is real; its first job is to preserve evidence, ordering, path safety, report shape, and CI meaning under controlled conditions.

## Acceptance criteria

The runner shell is ready to merge when:

- `node tools/agency-validation/run-fixture-parity.mjs --mode fake` writes a report and exits `0` against the seed fixture pack.
- parser failures exit `2` without reading fixture files.
- fake category mismatch exits `1` with a deterministic `category-set-comparison` failure.
- the report includes all six gates in fixed order.
- the console output stays one short line plus optional help text.
- no personal/private material appears in fixtures, reports, or logs.

## Next research question

How should MC design the minimal fake-adapter injection surface for `run-fixture-parity.test.mjs` so failure modes can be tested without leaking test-only flags into the public CLI or weakening the parser membrane?
