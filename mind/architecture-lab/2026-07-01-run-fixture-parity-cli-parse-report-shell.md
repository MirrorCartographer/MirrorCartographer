# Run Fixture Parity CLI Parse Report Shell

## Architecture question

How should MC implement the first executable `run-fixture-parity.mjs` core so parser exceptions become schema-valid `cli-parse` reports, stable exit codes, and compact console summaries without reading fixture files?

## Research basis

Current Node documentation keeps `process.exitCode` as the safer process termination seam for CLI tools because it lets normal output and async writes complete instead of forcing immediate process termination. The Node `util.parseArgs` API is the right public parser membrane because it supports strict option handling and rejects unknown public flags. Node's built-in test runner supports dependency-light executable verification, which keeps this runner shell aligned with the existing parser-only harness. JSON Schema 2020-12 continues to support the validation vocabulary needed for conditional report shape rules, so `cli-parse` can remain inside the same report family instead of becoming a separate ad hoc error format.

Sources:

- https://nodejs.org/api/process.html#processexitcode
- https://nodejs.org/api/util.html#utilparseargsconfig
- https://nodejs.org/api/test.html
- https://json-schema.org/draft/2020-12/json-schema-core

## Useful concepts extracted

1. CLI parsing is a gate, not setup. Parser exceptions are evidence events and must be represented before fixture-pack resolution.
2. Exit codes are routing labels. Code `2` means `cli-parse` failed; the JSON report carries diagnostics.
3. Console output is only a pointer. The compact summary should say which gate failed and where the report was written.
4. The executable wrapper should only assign `process.exitCode`; the importable core should return `{ exitCode, report, config/error }`.
5. Test-only adapter behavior must stay behind injected capabilities, never behind hidden CLI flags.
6. A pre-fixture report must use `fixture_pack.resolution_status = not-resolved`, zero fixture counts, and `not-run` later gates.

## Implementation added

Added `tools/agency-validation/run-fixture-parity.mjs` as the first executable runner shell.

The runner now:

- imports the existing strict parser from `fixture-parity-cli.mjs`;
- exposes `runFixtureParity(argv, capabilities)` for in-memory tests and later adapter injection;
- maps `FixtureParityCliError` failures into schema-shaped `cli-parse` reports;
- uses stable exit code `2` for CLI parse failure;
- uses stable exit code `8` for unexpected runner internal errors;
- writes JSON evidence to the default report path when parsing fails;
- emits compact stdout/stderr summaries instead of treating console text as evidence;
- assigns `process.exitCode` only in the executable wrapper;
- avoids reading fixture files in this shell layer.

## Boundary decision

This shell intentionally proves only the first membrane:

raw argv -> strict parser -> cli-parse report or typed config

It does not yet validate manifests, invoke fake adapters, compare category sets, or validate the report with an external JSON Schema engine. Those are later gates. This keeps the first executable step small, public-safe, and testable.

## Public-safety rule

Reports must not include private session material, raw personal text, local absolute paths, environment variables, or adapter implementation details. The only durable evidence emitted by this shell is abstract CLI failure class, safe argument name, stable gate id, and repair hint.

## Next implementation target

Add `tools/agency-validation/run-fixture-parity.test.mjs` with in-memory capabilities proving:

1. adapter-specific flags return exit code `2`;
2. unsafe paths return exit code `2`;
3. reports use `fixture_pack.resolution_status = not-resolved` for `cli-parse` failures;
4. later gates are recorded as `not-run`;
5. the executable wrapper never calls `process.exit` directly;
6. successful parser preflight does not read fixture files.

## Next architecture question

How should MC implement the first in-memory `run-fixture-parity.test.mjs` harness so parser failures, output writing, compact summaries, and no-fixture-read guarantees are proven before adding manifest validation or fake adapters?
