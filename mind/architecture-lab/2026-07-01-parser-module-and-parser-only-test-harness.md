# Parser module and parser-only test harness

Date: 2026-07-01
Status: architecture decision / prototype plan
Public-safety level: public-safe, no private session material

## Architecture question

How should MC implement the importable parser module and parser-only test harness using Node's built-in test runner so CLI/path failures are proven without invoking the fixture parity runner or reading fixture files?

## Finding

Treat the CLI parser as a pure preflight contract, not as a side effect of the fixture parity runner.

The parser should convert raw argv into a typed runner config or a deterministic parser failure. It must reject unsafe paths, unknown flags, unsupported modes, and adapter-leaking options before any fixture manifest, expected receipt, raw capture, or schema file is read.

## Current-source concepts extracted

1. `util.parseArgs` gives MC a standard-library parser boundary. Its strict mode rejects unknown arguments and type mismatches, and `allowPositionals` can keep positional arguments out of the runner contract.
2. `process.argv` includes the Node executable and script path before user arguments, so the importable parser should accept an explicit argv slice instead of reading global process state internally.
3. `path.resolve` normalizes a path into an absolute path; repo-scope safety should compare resolved paths against the resolved repository root before returning any path to downstream gates.
4. Node's built-in test runner can execute targeted parser-only test files with `node --test`, allowing the parser to be proven without invoking the full parity runner.
5. GitHub Actions treats non-zero process exit codes as failed steps, so parser failures should map to the existing runner exit-code contract only at the CLI wrapper layer, not inside the pure parser module.

## Design decision

Split implementation into three layers:

- `fixture-parity-cli.mjs`: pure importable module; no file reads; no process exit; no console writes.
- `run-fixture-parity.mjs`: thin executable wrapper; calls the parser, writes reports, emits compact console output, sets exit code.
- `fixture-parity-cli.test.mjs`: parser-only harness; passes synthetic argv arrays and temporary repo-root strings; asserts typed success or deterministic failure objects.

## Proposed public API

Function name:

`parseFixtureParityCli(argv, options)`

Inputs:

- `argv`: array of strings, already sliced to user arguments.
- `options.repoRoot`: absolute or resolvable repository root used as the path authority.
- `options.defaults`: optional defaults for manifest and report output paths.

Return shape:

- success: `{ ok: true, config }`
- failure: `{ ok: false, failure }`

No throwing for expected user input errors. Throwing is reserved for programmer errors such as non-array argv or missing repoRoot.

## Required accepted flags

- `--manifest <repo-relative path>`
- `--report-out <repo-relative path>`
- `--mode fake|real`
- `--strict true|false`
- `--help`

## Required rejected inputs

- Unknown flags.
- Positional arguments.
- Absolute user-supplied paths.
- Path traversal outside repo root.
- Empty path strings.
- Paths containing NUL bytes.
- Adapter-specific flags such as `--node-generator`, `--python-generator`, `--ajv`, or `--jsonschema`.
- Unsupported modes or strictness values.

## Path safety rule

For each user-supplied path:

1. Reject if empty.
2. Reject if absolute.
3. Reject if it contains a NUL byte.
4. Resolve against repo root.
5. Confirm the resolved path is inside repo root or equal to repo root only when the option explicitly allows a directory root.
6. Return both the original repo-relative path and the resolved absolute path in config.

This prevents the runner from reading or writing outside the public repository boundary even if CI is invoked from an unexpected working directory.

## Deterministic failure object

Each parser failure should include:

- `stage`: always `cli-parse`.
- `code`: stable enum such as `unknown-flag`, `positional-argument`, `unsafe-path`, `unsupported-mode`, `invalid-boolean`.
- `option`: the flag involved, when applicable.
- `received`: redacted or public-safe string value, when useful.
- `message`: short human-readable explanation.

The full runner can later wrap this into `fixture-parity-failure-report.v1.json` without scraping console text.

## Parser-only test matrix

Success cases:

- default config with empty argv.
- explicit safe manifest path.
- explicit safe report output path.
- fake mode.
- real mode.
- strict true.
- strict false.

Failure cases:

- unknown flag rejects before runner starts.
- positional arg rejects.
- absolute manifest path rejects.
- `../outside.json` rejects.
- path with NUL rejects.
- empty manifest path rejects.
- unsupported mode rejects.
- invalid strictness rejects.
- adapter-leaking flags reject.

## Implementation requirement

The parser-only test harness must not import the runner, load fixture manifests, validate schemas, spawn Python, invoke Ajv, or read raw captures. It should import only the parser module plus Node standard-library test/assert/path utilities.

## Durable MC meaning

The parser becomes the first membrane in the evidence gate:

raw argv -> strict public parser -> repo-safe typed config -> runner gates -> JSON evidence report

That membrane keeps accidental local convenience from becoming long-term CI contract drift.

## Next research question

How should MC implement the actual `fixture-parity-cli.mjs` parser module and parser-only `node:test` file so the architecture note becomes executable code without requiring additional dependencies?
