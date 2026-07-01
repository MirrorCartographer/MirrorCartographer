# Fake-adapter injection surface for `run-fixture-parity.test.mjs`

## Architecture question

How should MC design the minimal fake-adapter injection surface for `run-fixture-parity.test.mjs` so failure modes can be tested without leaking test-only flags into the public CLI or weakening the parser membrane?

## Research basis

Current source review focused on the safe seam between public CLI behavior and test-only failure injection:

- Node's built-in test runner exposes per-test mocking through the test context and `MockTracker`, but `mock.module()` is still marked early-development and requires the `--experimental-test-module-mocks` flag. MC should avoid depending on experimental module mocking for the core parity-runner harness.
- Node ESM supports `import.meta.main`, allowing a module to export importable functions while running side effects only when invoked as the entry point. This is the right shape for a runner that must be callable by CLI, tests, and later CI wrappers without duplicating logic.
- Node docs recommend `process.exitCode` over direct `process.exit()` in ordinary CLI flows because synchronous exit can truncate stdout/stderr. MC should keep exit decisions as returned values inside the importable runner core and set `process.exitCode` only at the CLI entry membrane.
- `util.parseArgs` remains the public strict parser membrane. Test-only failure modes must not be represented as parser flags because that would make adapter internals part of the public CLI surface.

Sources reviewed:

- Node.js Test Runner documentation: `node:test`, `MockTracker`, and `mock.module()`.
- Node.js ESM documentation: `import.meta.main` and side-effect-free imports.
- Node.js Process documentation: `process.exitCode` and graceful process exit.
- Node.js Utilities documentation: `util.parseArgs` strict public argument parsing.

## Useful concepts extracted

### 1. Public CLI flags are a product contract

`--manifest`, `--report-out`, `--mode`, `--strict`, and `--help` belong to the public runner contract. Failure-injection controls such as `forceCategoryMismatch`, `corruptReport`, `skipRuntime`, or `throwOnWrite` must never appear in `argv`.

Reason: once a flag exists, CI workflows and repair agents may accidentally depend on it. That turns fake-adapter calibration knobs into public architecture.

### 2. Use an importable runner core

The runner should split into two layers:

1. `main(argv = process.argv.slice(2), io = defaultIo, adapters = defaultAdapters)`
2. `if (import.meta.main) { process.exitCode = await main(...) }`

The core returns a structured result:

- `exitCode`
- `consoleLine`
- `reportPath`
- `report`
- `errorCode` when applicable

The entry point performs side effects only after the core has produced a stable result.

### 3. Inject capabilities, not scenarios

Tests should inject a small capability object, not many boolean knobs:

- `readText(path)`
- `writeText(path, text)`
- `now()`
- `makeAdapters()`
- `validateReport(report)`
- `stdout(line)`
- `stderr(line)`

Fake scenarios live inside test-local injected implementations. The production runner never names them.

Bad shape:

- `--fake-mismatch`
- `--fake-corrupt-report`
- `process.env.MC_FAKE_PARITY_MODE`
- public parser support for adapter errors

Good shape:

- `runFixtureParity(argv, { io: failingWriteIo, adapters: mismatchAdapters })`
- parser remains unaware that failure injection exists
- tests assert public outcomes, not private knobs

### 4. Prefer plain dependency injection over experimental module mocks

Because Node's `mock.module()` is still early-development and requires an experimental flag, MC should not require it for baseline tests. The runner should be testable through explicit dependency injection with stable built-in Node primitives.

Module mocks may be useful later for compatibility tests, but the durable architecture should not depend on them.

### 5. The fake adapter has one public mode, many private test behaviors

The CLI may expose `--mode fake` as a normal runner mode because fake mode itself is part of the staged rollout. But fake failure behaviors are private to tests.

Public:

- `--mode fake`
- `--mode real` later

Private test injection:

- adapter returns extra category
- adapter omits one runtime
- adapter emits unsorted category set
- report validator rejects a deliberately malformed report
- writer throws deterministic I/O error

### 6. Parser membrane stays first

No injected adapter, file reader, report writer, or clock should run until CLI parsing and repo-relative path safety pass. Parser-only failures still exit `2` and must prove that no fixture file was read.

This keeps the boundary:

raw argv → strict public parser → safe config → injected IO/adapters → staged report → exit result

## Durable design pattern

**Public membrane, private calibration seam**

Expose only stable user/CI behavior at the CLI. Place all fake failure controls behind an importable function boundary as injected capabilities. Tests calibrate the runner by swapping capabilities; CI and users call the same public CLI without seeing adapter internals.

## Implementation requirements

### `tools/agency-validation/run-fixture-parity.mjs`

Must export:

- `runFixtureParity(argv, capabilities = defaultCapabilities)`
- `fixtureParityExitCodes`
- `defaultCapabilities`

May export:

- `buildFailureReport(...)`
- `compareCategorySets(...)`
- `stableStringify(...)`

Entry-point behavior:

- only runs when `import.meta.main` is true;
- calls `runFixtureParity(process.argv.slice(2))`;
- writes compact console output through the default capability;
- sets `process.exitCode` from the returned result;
- does not call `process.exit()`.

### Capability contract

Minimum capability shape:

- `io.readText(repoRelativePath)` returns UTF-8 text;
- `io.writeText(repoRelativePath, content)` writes UTF-8 text;
- `io.stdout(line)` writes one summary line;
- `io.stderr(line)` writes compact error text when needed;
- `clock.nowIso()` returns a deterministic ISO timestamp in tests;
- `adapters.generateReceipts(fixture, manifest, config)` returns runtime category sets;
- `reportValidator.validate(report)` returns `{ valid: true }` or `{ valid: false, errors: [...] }`.

### Test harness shape

`tools/agency-validation/run-fixture-parity.test.mjs` should use `node:test` and `node:assert/strict` with in-memory capability doubles:

- memory filesystem for manifest and reports;
- deterministic clock;
- fake adapters for pass and category mismatch;
- failing writer for exit `3`;
- rejecting report validator for exit `4`;
- counters proving parser errors do not call file reads or adapters.

### Explicit non-requirements

- Do not use adapter-specific public CLI flags.
- Do not use environment variables for failure injection.
- Do not require `--experimental-test-module-mocks` for ordinary tests.
- Do not make console output the test oracle; inspect the returned result and JSON report.
- Do not include personal or private source material in fixtures, logs, or reports.

## Acceptance criteria

The fake-adapter injection design is ready when:

- unknown public flags still fail at parser level with exit `2`;
- parser failure tests prove zero manifest reads and zero adapter calls;
- a passing fake adapter exits `0` and writes a report;
- a mismatching fake adapter exits `1` without any public mismatch flag;
- a failing writer exits `3` from injected IO, not from path tricks;
- a rejecting report validator exits `4` from injected validation, not from malformed CLI;
- all test-only behavior is expressible through injected capabilities;
- the public CLI help text contains no fake failure controls.

## Next research question

How should MC implement the importable `runFixtureParity(argv, capabilities)` core and its first in-memory `node:test` harness so the fake-adapter injection seam becomes executable without changing the already-strict public CLI parser?
