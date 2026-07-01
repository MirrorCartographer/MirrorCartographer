# Run Fixture Parity Core Capability Injection

Status: architecture pattern / prototype plan
Date: 2026-07-01
Public-safety level: abstracted implementation architecture only

## Architecture question

How should MC implement the importable `runFixtureParity(argv, capabilities)` core and its first in-memory `node:test` harness so fake-adapter failure modes become executable without adding test-only public CLI flags or weakening the strict parser membrane?

## Finding

The runner should be split into three explicit layers:

1. Public CLI membrane
   - Owns argv parsing, public flags, help text, and repo-relative path normalization.
   - Rejects adapter-specific flags before fixture files are read.
   - Keeps the already-created `parseFixtureParityCli(argv)` module as the only public input surface.

2. Importable runner core
   - Exposes `runFixtureParity(argv, capabilities = defaultCapabilities)`.
   - Calls the parser first.
   - Never reads process globals except through injected defaults.
   - Returns a structured result object instead of calling `process.exit()`.

3. Thin executable wrapper
   - Detects direct execution.
   - Calls `runFixtureParity(process.argv.slice(2), defaultCapabilities)`.
   - Writes the report and compact console summary through injected IO.
   - Assigns `process.exitCode` from the returned result.

This makes test failures private capability behavior, not public CLI behavior.

## Useful concepts extracted from current sources

- Node's built-in test runner includes mocking and test context tools, but the safer design here is not to monkeypatch process or file-system globals. Dependency injection gives deterministic tests with less runtime state leakage.
- `util.parseArgs` supports strict public option parsing, so parser rejection remains the first executable safety boundary.
- `process.exitCode` lets the wrapper report CI status without forcing immediate process termination from the importable core.
- `import.meta.main` provides a direct-execution boundary for ES modules, making the CLI wrapper callable as a script while keeping the core importable for tests.

Sources consulted:

- Node.js Test Runner documentation: https://nodejs.org/api/test.html
- Node.js `util.parseArgs` documentation: https://nodejs.org/api/util.html#utilparseargsconfig
- Node.js `process.exitCode` documentation: https://nodejs.org/api/process.html#processexitcode
- Node.js ECMAScript modules / `import.meta.main` documentation: https://nodejs.org/api/esm.html#importmetamain

## Capability surface

`runFixtureParity(argv, capabilities)` should accept one object with these public-internal capabilities:

- `repoRoot`: repository root used by the parser path safety layer.
- `readJson(path)`: reads parsed JSON from a repo-relative path.
- `writeJson(path, value)`: writes deterministic JSON report output.
- `validateSchema(schemaPath, value)`: validates JSON and returns stable machine evidence, not raw validator wording.
- `listDeclaredFixtureFiles(manifest)`: derives the manifest inventory.
- `listActualFixtureFiles(scopePath)`: enumerates repo fixture files for undeclared-file checks.
- `generateReceipt(runtime, fixture, context)`: fake or real adapter seam.
- `compareCategorySets(expected, actual)`: deterministic category evidence.
- `now()`: deterministic timestamp if later needed.
- `hash(value)`: deterministic command/file fingerprinting.
- `stdout(text)` and `stderr(text)`: wrapper-visible output sinks.

The public CLI must not expose any capability selectors. Tests inject fake capabilities directly through module import.

## Runner return contract

The core should return:

- `exitCode`: stable CI integer.
- `status`: `pass` or `fail`.
- `report`: JSON object intended to validate against `fixture-parity-failure-report.v1.schema.json`.
- `consoleSummary`: compact human string.
- `parsedConfig`: normalized parser output when parsing succeeds.

The core should throw only for programmer misuse such as non-array argv or missing required capabilities. Expected runner failures become report gates, not uncaught exceptions.

## Staged gate order

1. `cli-parse`
   - Parser succeeds or returns a parser failure report.

2. `manifest-validation`
   - Manifest file exists and validates.

3. `path-authority`
   - All declared paths stay repo-relative and all actual fixture files are declared.

4. `expected-receipt-validation`
   - Expected oracle receipts validate against fixture receipt schema.

5. `generated-receipt-validation`
   - Fake or real generated receipts validate against production receipt schema.

6. `category-set-comparison`
   - Expected and generated category sets match in deterministic sorted order.

7. `report-validation`
   - The emitted report validates against the failure report schema before being written.

If a required earlier gate fails, later gates should be recorded as `not-run` so repair agents can distinguish blocked work from passed work.

## First in-memory `node:test` harness

Create `tools/agency-validation/run-fixture-parity.test.mjs` with dependency-free tests:

- parser errors become exit code `2`, no fixture read.
- missing manifest becomes exit code `3`, report includes `manifest-validation` failure.
- undeclared file becomes exit code `4`, report includes `path-authority` failure.
- fake adapter throws becomes exit code `5`, report includes `adapter-error` evidence.
- category mismatch becomes exit code `6`, report includes sorted missing/unexpected categories.
- all fake receipts match becomes exit code `0`, report validates and console summary is short.

The tests should pass in memory by injecting fake `readJson`, `writeJson`, `validateSchema`, file listing, and receipt generation capabilities.

## Implementation boundary

Recommended files:

- `tools/agency-validation/run-fixture-parity.mjs`
- `tools/agency-validation/run-fixture-parity.test.mjs`

Do not modify `fixture-parity-cli.mjs` unless the runner reveals a parser bug. The parser is the membrane; the runner core is the evidence machine behind it.

## Public-safe rule

Fixture data remains synthetic and abstract. Reports should name fixture ids, schema paths, and category ids, not personal/private source material.

## Next research question

How should MC map fixture parity runner failure classes to stable exit codes and report gate ids so local developers, GitHub Actions, and later repair agents receive the same machine-readable failure semantics?
