# Fixture parity CLI output contract

Date: 2026-07-01
Status: architecture contract
Scope: public-safe MC architecture lab artifact

## Architecture question

How should MC define the concrete CLI surface and output path contract for `run-fixture-parity.mjs` so local developers, GitHub Actions, and later repair agents all call the same runner without adapter-specific flags leaking into CI workflows?

## Research basis

Current source checks used for this note:

- Node.js `process.argv` documents that the first argument is the Node executable, the second is the program entry point, and remaining values are user CLI arguments. This supports a thin explicit parser around `process.argv.slice(2)` rather than hidden environment-only control.
- Node.js `util.parseArgs` returns structured `values`, `positionals`, and optional ordered `tokens`, which is enough for a no-dependency runner CLI with deterministic option handling.
- Node.js process guidance recommends setting `process.exitCode` and letting the process exit naturally when possible, because direct `process.exit()` can truncate asynchronous stdout writes.
- GitHub Actions treats exit code `0` as success and any nonzero exit code as failure, so the runner must keep stable failure-code meaning while preserving detailed evidence in JSON.

## Useful concepts extracted

### 1. One public runner command

The runner should expose one stable command surface:

`node tools/agency-validation/run-fixture-parity.mjs --manifest mind/fixtures/agency-validation/fixture-pack.v1.json --report-out artifacts/fixture-parity/report.v1.json`

Optional flags may tune runner behavior, but adapter-specific configuration must stay behind internal adapter registry/config files.

Allowed public CLI flags:

- `--manifest <repo-relative-path>`: required path to `fixture-pack.v1.json`.
- `--report-out <repo-relative-path>`: required path for the machine-readable failure/success evidence report.
- `--mode <fake|real>`: optional runner mode, default `fake` until real adapters are wired.
- `--format <json|summary>`: optional console verbosity, default `summary`.
- `--strict`: optional boolean forcing undeclared-file and schema-gate failures to block immediately.
- `--help`: prints usage only; exits `0`.

Forbidden public CLI flags:

- `--node-adapter`
- `--python-adapter`
- `--ajv-path`
- `--python-jsonschema-path`
- `--category-map`
- runtime-specific schema-loader overrides

Reason: the CI workflow, local developer command, and future repair-agent call should not know the adapter topology. The runner owns orchestration; adapters are internal implementation details.

### 2. Output path authority

The `--report-out` value is not a log destination. It is the durable evidence artifact path for the run.

Rules:

- Path must be repo-relative.
- Path must not escape the repo root through `..` traversal.
- Directory creation is allowed only under approved artifact roots such as `artifacts/fixture-parity/` or `.mc-artifacts/fixture-parity/`.
- The file name should include the report schema version, for example `report.v1.json`.
- A successful run may still write a report, but failure evidence must always be written before setting nonzero `process.exitCode`.

### 3. Console output is not evidence

Console output should be short, stable, and human-readable.

Recommended success output:

`fixture-parity ok: fixtures=2 runtimes=2 report=artifacts/fixture-parity/report.v1.json`

Recommended failure output:

`fixture-parity failed: stage=compare-canonical-category-sets failures=1 report=artifacts/fixture-parity/report.v1.json`

The console summary may name the first failing gate, count failures, and point to the report path. It must not become the canonical evidence format.

### 4. Stable exit-code contract

Use a narrow exit-code map:

- `0`: all gates passed.
- `1`: parity or validation failure represented in a valid report.
- `2`: CLI usage/configuration error, such as missing `--manifest` or unsafe `--report-out`.
- `3`: runner internal error where a complete valid report could not be written.

This keeps CI simple while preserving diagnostic detail inside the JSON report.

### 5. Adapter encapsulation

The runner should load an internal adapter registry such as:

`tools/agency-validation/adapters/fixture-parity-adapters.v1.json`

That registry may define fake adapters now and real Python/Node generators later. The public command stays unchanged.

Required adapter registry properties:

- runtime id: `node` or `python`
- adapter kind: `fake` or `real`
- invocation entry point
- expected input contract
- expected output contract
- public-safe failure normalization rules

## Decision

MC should treat `run-fixture-parity.mjs` as a stable CLI boundary and evidence-writer, not a bag of runtime-specific flags.

The CLI boundary is:

`manifest + report-out + mode + strictness -> staged gates -> JSON report + compact summary + stable exit code`

The runner should never expose adapter paths or implementation libraries through CI-facing flags. Those belong in governed repo config so future repair agents can operate against one stable invocation contract.

## Implementation requirements to add next

1. Implement `parseFixtureParityCli(argv)` using Node built-ins.
2. Reject unknown public flags by default.
3. Validate `--manifest` and `--report-out` as safe repo-relative paths.
4. Ensure the failure report is written before `process.exitCode` is set for represented failures.
5. Use `process.exitCode`, not direct `process.exit()`, after writing stdout/report content.
6. Keep console output one line for success and one or two lines for failure.
7. Add tests proving local and CI calls use the same command surface.

## Public-safety note

This contract contains no private user material. It describes a generic validation runner architecture and durable evidence boundary.

## Next research question

How should MC implement `parseFixtureParityCli(argv)` and repo-relative path safety tests so the runner rejects unsafe paths, unknown flags, and adapter-leaking options before any fixture file is read?
