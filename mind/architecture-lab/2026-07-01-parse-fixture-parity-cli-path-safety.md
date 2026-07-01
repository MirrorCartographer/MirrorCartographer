# Fixture parity CLI path safety contract

Date: 2026-07-01
Status: implementation design pattern
Scope: public-safe MC architecture lab artifact

## Architecture question

How should MC implement `parseFixtureParityCli(argv)` and repo-relative path safety tests so the runner rejects unsafe paths, unknown flags, and adapter-leaking options before any fixture file is read?

## Research basis

Current source checks used for this note:

- Node.js `process.argv` exposes the launched process arguments, where the executable and entry-point occupy the first two positions and the remaining values are user-provided CLI arguments.
- Node.js `util.parseArgs` supports strict parsing and defaults to rejecting unknown arguments when strict mode is enabled. It also defaults positional arguments off when strict mode is true.
- Node.js recommends setting `process.exitCode` and allowing graceful termination where possible, because direct `process.exit()` can truncate pending stdout writes.
- GitHub Actions maps exit code `0` to success and any nonzero exit code to failure, so CLI usage failures need a stable code distinct from parity failures.
- Node.js `path.resolve()` resolves path segments into an absolute normalized path, which supports a root-containment check for repo-relative inputs.

## Useful concepts extracted

### 1. Parser as preflight boundary

`parseFixtureParityCli(argv)` should be the first executable gate in `run-fixture-parity.mjs`.

It should perform only these actions:

1. Parse public CLI arguments.
2. Reject unknown flags.
3. Reject positionals.
4. Reject adapter-leaking flags.
5. Normalize and validate repo-relative paths.
6. Return a typed configuration object or a public-safe usage error.

It must not read the manifest, inspect fixture files, load adapters, validate schemas, or create report directories. Those belong to later runner stages.

### 2. Stable public flag surface

Allowed public flags remain:

- `--manifest <repo-relative-path>`: required.
- `--report-out <repo-relative-path>`: required unless `--help` is present.
- `--mode <fake|real>`: optional, default `fake`.
- `--format <summary|json>`: optional, default `summary`.
- `--strict`: optional boolean.
- `--help`: optional boolean; returns usage intent only.

Forbidden public flags include:

- `--node-adapter`
- `--python-adapter`
- `--ajv-path`
- `--python-jsonschema-path`
- `--category-map`
- `--schema-loader`
- `--raw-capture-loader`
- runtime-specific executable, library, or adapter override flags

Reason: the runner owns orchestration. CI, local developers, and later repair agents should call one stable command without learning internal adapter topology.

### 3. Repo-relative path safety

The parser should treat paths as untrusted input. A path is safe only when all conditions pass:

- It is a non-empty string.
- It is not absolute.
- It does not contain a NUL byte.
- It resolves under the repo root after normalization.
- It does not begin with `..` after computing the relative path from repo root.
- It is not equal to `..`.
- It is not on a different Windows drive or path namespace.
- It uses forward-slash repo path form in returned config.

The helper should conceptually perform:

1. `candidateAbs = path.resolve(repoRoot, inputPath)`.
2. `relative = path.relative(repoRootAbs, candidateAbs)`.
3. Reject if `relative === ""` where a file path is required.
4. Reject if `relative === ".."` or `relative.startsWith("../")` or `path.isAbsolute(relative)`.
5. Return the normalized repo-relative path with POSIX separators.

This is a containment rule, not a string-prefix rule. A plain prefix check can misclassify sibling paths such as `repo-root-evil` as inside `repo-root`.

### 4. Path-specific allowlists

`--manifest` and `--report-out` need different path policies.

Manifest policy:

- Must end with `.json`.
- Should default to `mind/fixtures/agency-validation/fixture-pack.v1.json`.
- Should be allowed only under `mind/fixtures/agency-validation/` for the first implementation.
- Must not point into generated artifact directories.

Report-out policy:

- Must end with `.json`.
- Must be under `artifacts/fixture-parity/` or `.mc-artifacts/fixture-parity/`.
- Should allow parent directory creation later, but the parser itself should not create directories.
- Must not point into `mind/`, `tools/`, source fixtures, or schemas.

### 5. Usage errors as structured data

Parser failures should return a stable error object rather than print directly:

- `kind`: `usage-error`
- `code`: short stable code such as `unknown-flag`, `unsafe-path`, `missing-required-flag`, `forbidden-adapter-flag`, `invalid-enum`, or `unexpected-positional`
- `option`: affected flag when applicable
- `message`: short public-safe explanation
- `exitCode`: `2`

The runner can then print one compact usage line and set `process.exitCode = 2`. This preserves the previous CI contract: usage/configuration errors are distinct from represented parity failures.

### 6. Minimum parser test matrix

Add tests before the runner reads fixture files:

Positive cases:

- accepts default valid manifest and report path
- accepts `--mode fake`
- accepts `--mode real`
- accepts `--format summary`
- accepts `--format json`
- accepts `--strict`
- accepts `--help` without requiring manifest/report-out

Negative cases:

- rejects missing `--manifest`
- rejects missing `--report-out`
- rejects unknown flag
- rejects positional argument
- rejects invalid mode
- rejects invalid format
- rejects absolute manifest path
- rejects absolute report path
- rejects `../` traversal
- rejects normalized traversal such as `mind/fixtures/../..`
- rejects NUL byte in path
- rejects report path outside allowed artifact roots
- rejects manifest path outside fixture root
- rejects forbidden adapter-leaking flags

### 7. Recommended module seam

Create a small importable parser module separate from the executable runner:

- `tools/agency-validation/fixture-parity-cli.mjs`
- exports `parseFixtureParityCli(argv, { repoRoot })`
- exports `safeRepoRelativePath(inputPath, { repoRoot, allowedRoots, requiredExtension, label })`

Then `run-fixture-parity.mjs` can stay thin:

1. Call parser.
2. On usage error: print usage summary, set exit code `2`, stop before file reads.
3. On success: enter staged gates.

This keeps the dangerous boundary testable without invoking adapters or touching the fixture pack.

## Decision

MC should treat CLI parsing and path containment as a first-class safety gate, not incidental runner setup.

The implementation pattern is:

`raw argv -> strict public parser -> safe repo-relative paths -> typed runner config -> staged evidence gates`

No manifest read, adapter load, schema validation, or report write should happen until the parser proves that all path and flag inputs are public, stable, and inside the intended repository boundaries.

## Implementation requirements

1. Add `tools/agency-validation/fixture-parity-cli.mjs`.
2. Use Node built-ins only for the first parser: `node:util`, `node:path`, and optionally `node:url`.
3. Set `strict: true` and `allowPositionals: false` in `parseArgs`.
4. Define allowed flags in one object; do not hand-roll flag scanning except for mapping forbidden adapter flags to clearer errors.
5. Implement path containment with `path.resolve` plus `path.relative`, not simple string prefix checks.
6. Return normalized POSIX-style repo-relative paths in parser output.
7. Keep manifest and report path policies separate.
8. Add parser-only tests that prove no fixture file read is needed for usage errors.
9. Reserve exit code `2` for parser/config failures.
10. Keep adapter details behind internal registry/config, never public CLI flags.

## Public-safety note

This artifact contains no private user material. It describes a generic command-line parser, path containment, and CI contract for a validation runner.

## Next research question

How should MC implement the importable parser module and parser-only test harness using Node's built-in test runner so CLI/path failures are proven without invoking the fixture parity runner or reading fixture files?
