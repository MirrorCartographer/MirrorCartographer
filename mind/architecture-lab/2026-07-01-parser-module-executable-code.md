# Parser Module Executable Code

Date: 2026-07-01

## Architecture question

How should MC implement the actual `fixture-parity-cli.mjs` parser module and parser-only `node:test` file so this becomes executable code without extra dependencies?

## Research basis

Current Node documentation makes `util.parseArgs` sufficient for a dependency-free parser membrane: strict parsing rejects unknown flags and mismatched option types by default, positional arguments can be disabled, and negated boolean options are opt-in through `allowNegative`. Node's built-in test runner can execute standalone test files with `node --test`, and test files that exit with code 0 pass while nonzero exits fail. Node `path.resolve` gives the absolute-path primitive needed for repo-root containment checks. GitHub Actions uses exit code 0 for success and nonzero for failure, so parser failure must eventually become a stable CI code before fixture files are read.

## Useful concepts extracted

1. Parser as first membrane, not runner setup.
   - The parser accepts only the public runner contract: `--manifest`, `--report-out`, `--mode`, `--strict`, and `--help`.
   - Unknown flags fail under `parseArgs({ strict: true })`.
   - Positionals are rejected with `allowPositionals: false`.
   - Negated booleans are rejected with `allowNegative: false` so `--no-strict` cannot silently change the gate model.

2. Adapter leakage rejection.
   - Adapter-specific flags such as `--python-adapter`, `--node-adapter`, `--ajv`, and `--jsonschema` are explicitly rejected before `parseArgs` returns a runner config.
   - This keeps CI, local developers, and later repair agents calling the same public surface.

3. Repo-relative path safety.
   - Paths must be non-empty strings, not absolute, not NUL-containing, and not parent-traversal escapes.
   - Backslashes are normalized into POSIX-style slashes so reports stay stable across platforms.
   - The returned config preserves normalized repo-relative paths rather than leaking host-specific absolute paths into evidence artifacts.

4. Parser-only tests.
   - Tests import the parser module directly.
   - They do not read the fixture manifest, raw captures, schemas, expected receipts, or runner files.
   - This proves the preflight boundary before later staged gates are wired.

## Implemented artifact

Added executable source:

- `tools/agency-validation/fixture-parity-cli.mjs`

Added parser-only tests:

- `tools/agency-validation/fixture-parity-cli.test.mjs`

The module exports:

- `FIXTURE_PARITY_CLI_VERSION`
- `DEFAULT_FIXTURE_PARITY_CONFIG`
- `FixtureParityCliError`
- `parseFixtureParityCli(argv, options)`
- `resolveRepoRelativePath(inputPath, repoRoot, fieldName)`
- `fixtureParityCliUsage()`

## Durable requirement update

`run-fixture-parity.mjs` must import `parseFixtureParityCli` instead of parsing `process.argv` inline. The runner may not add adapter-specific flags to its public CLI. Any real/fake adapter selection must happen behind `--mode`, not through adapter-specific command-line options.

## Acceptance checks

Run parser tests with:

`node --test tools/agency-validation/fixture-parity-cli.test.mjs`

Expected behavior:

- Empty argv returns default manifest/report paths.
- Declared public flags are accepted.
- `--help` returns a help config without requiring fixture paths.
- Unknown flags fail.
- Positionals fail.
- Adapter-leaking flags fail.
- Absolute paths fail.
- Parent traversal fails.
- NUL-containing paths fail.

## Next research question

How should MC implement the first fake-adapter `run-fixture-parity.mjs` shell that imports this parser, emits stable exit codes, validates its failure report schema, and proves staged gates without invoking real Python or Node receipt generators?
