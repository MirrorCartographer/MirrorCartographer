# Run Fixture Parity In-Memory Test Harness

## Architecture question

How should MC implement the first in-memory `run-fixture-parity.test.mjs` harness so parser failures, output writing, compact summaries, and no-fixture-read guarantees are proven before adding manifest validation or fake adapters?

## Research basis

- Node's built-in test runner supports `describe` and `it` aliases, so this harness can remain dependency-free and consistent with the existing parser tests.
- Node's strict assertion module provides stable structural and equality checks without pulling in Jest, Vitest, or assertion-layer dependencies.
- The current runner is already importable through `runFixtureParity(argv, capabilities)`, which makes direct in-memory capability injection safer than process-level CLI spawning.
- The current shell accepts injected `stdout`, `stderr`, `writeJson`, and `repoRoot` capabilities. That is enough to prove behavior without reading fixture files.

## Design decision

Treat the first runner harness as a **pre-manifest membrane test**, not as fixture parity validation.

The test harness must prove the runner boundary in this order:

1. Help exits successfully without writing a report.
2. Valid public CLI args produce a schema-shaped preflight pass report.
3. Custom `--report-out` is honored only after parser normalization.
4. Rejected public CLI args become deterministic `cli-parse` reports.
5. Internal shell errors route to `runnerInternalError`.
6. No test path reads fixture contents before manifest validation exists.

## Implemented artifact

Added:

- `tools/agency-validation/run-fixture-parity.test.mjs`

The harness uses a tiny recorder capability object:

- `stdout(text)` appends to `calls.stdout`.
- `stderr(text)` appends to `calls.stderr`.
- `writeJson(path, value)` appends to `calls.writes`.
- `readFixture(path)` records an attempted read and throws.

`readFixture` is intentionally not consumed by the current runner. Its presence documents the future capability seam and turns any premature fixture-read coupling into an immediate test smell once manifest work begins.

## Understanding change

Before this step, `run-fixture-parity.mjs` was executable but not yet proven as a membrane. It could parse and emit reports, but the architecture had no durable proof that the shell stayed inside its intended responsibilities.

After this step, the shell has a testable contract:

raw argv -> parser membrane -> report write / summary output -> stable exit code

It still does **not** validate manifests, read fixtures, invoke fake adapters, invoke real adapters, or compare receipts. That restraint is useful. It prevents the runner from becoming a mixed validator/generator/comparator before the gates are individually executable.

## Public-safety rule

All test inputs are abstract fixture paths and adapter names. No personal conversation content, private symbols, or user-specific material is encoded in the runner tests.

## Next architecture question

How should MC wire this dependency-free runner harness into the repository verification surface so parser and runner-shell contracts run in CI without forcing the full Next.js build path or hiding parity failures behind unrelated application failures?
