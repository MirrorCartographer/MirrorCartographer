# Lockfile provenance exit-code and check-code namespace contract

Date: 2026-07-02
Status: proposed architecture contract
Lane: schema-governance
Public-safety: no private user material; repository/process architecture only

## Research question

How should MC define the stable exit-code table and `checks[].code` namespace for `check-lockfile-provenance.mjs` so CI can route failures cleanly before standalone validator generation begins?

## Sources checked

- Node.js process documentation, current v26.4.0: `process.exitCode` should be set when allowing graceful process termination; `process.exit()` can truncate asynchronous stdout/stderr writes. Node also reserves several low exit codes for its own runtime failure categories and signal exits use values above 128.
  - https://nodejs.org/api/process.html#processexitcode
  - https://nodejs.org/api/process.html#exit-codes
- GitHub Actions documentation: GitHub Actions treats exit code `0` as success and any nonzero integer as failure. The check run status is binary even when the internal tool has richer error categories.
  - https://docs.github.com/en/actions/how-tos/create-and-publish-actions/set-exit-codes
- FreeBSD `sysexits(3)`: conventional command-line error classes begin at `64`, reducing collision risk with other program statuses; `EX_USAGE=64`, `EX_DATAERR=65`, and `EX_NOINPUT=66` map cleanly to CLI misuse, invalid input data, and missing/unreadable input.
  - https://man.freebsd.org/cgi/man.cgi?query=sysexits&sektion=3

## Useful concepts extracted

1. CI does not need many exit codes.
   GitHub Actions only distinguishes success from failure at the check-run boundary. Detailed failure routing belongs in machine-readable JSON output, not in an expanding process exit-code matrix.

2. Avoid Node-reserved low codes.
   Node uses low process exit codes for runtime, parse, fatal, invalid-argument, debugger, and top-level-await failure modes. MC should not overload those meanings unless the Node runtime itself produced them.

3. Prefer sysexits-inspired categories for tool-owned failures.
   Codes in the `64+` range are conventional for command-line tools and reduce collision with Node runtime meanings. MC can use a small sysexits-inspired table while keeping exact diagnostics in report checks.

4. Preserve stdout integrity.
   `check-lockfile-provenance.mjs` should write the complete JSON report, set `process.exitCode`, and let Node terminate naturally. It should avoid `process.exit()` except for unrecoverable bootstrap states where no report can be safely emitted.

## Decision

MC should use a small, stable exit-code surface and a larger stable `checks[].code` namespace.

Exit code answers: "Can CI continue?"

`checks[].code` answers: "Which contract failed, and where should a maintainer look?"

## Exit-code table v1

| Exit code | Name | Meaning | Report required? | Typical routing |
|---:|---|---|---|---|
| 0 | `OK` | All lockfile provenance checks passed. | yes | allow validator generation |
| 64 | `USAGE_ERROR` | Checker invoked with unsupported flags, bad mode, or invalid output option. | best effort | fix command invocation |
| 65 | `PROVENANCE_DATA_ERROR` | Required provenance input exists but fails contract: Ajv wrong lane, package/lock mismatch, malformed lockfile, unsupported lockfile version, missing package metadata. | yes | fix package/lock/provenance state |
| 66 | `PROVENANCE_INPUT_MISSING` | Required input file is absent or unreadable, especially `package.json` or `package-lock.json`. | yes when possible | create/restore required input |
| 70 | `CHECKER_INTERNAL_ERROR` | Checker bug or unexpected exception not attributable to repository input. | best effort | fix checker implementation |

### Explicit non-goals

- Do not create a unique exit code for every lockfile failure.
- Do not use Node-reserved low codes for MC-owned contract failures.
- Do not use exit codes above 128 for normal checker failures; those are conventionally signal-related.
- Do not let validator generation run after any nonzero checker exit.

## `checks[].code` namespace v1

Format:

`LOCKFILE_PROVENANCE/<DOMAIN>/<CHECK>`

Rules:

- Uppercase ASCII only.
- Slash-separated, exactly three segments.
- Stable once published.
- Codes describe contract identity, not changing prose.
- The report may add human-readable `message`, `details`, and `path` fields, but CI routing should key on `code`.

## Initial code set

| Code | Status on pass | Failure exit | Meaning |
|---|---|---:|---|
| `LOCKFILE_PROVENANCE/INPUT/PACKAGE_JSON_PRESENT` | pass | 66 | `package.json` exists and is readable. |
| `LOCKFILE_PROVENANCE/INPUT/PACKAGE_LOCK_PRESENT` | pass | 66 | `package-lock.json` exists and is readable. |
| `LOCKFILE_PROVENANCE/INPUT/PACKAGE_JSON_PARSEABLE` | pass | 65 | `package.json` parses as JSON. |
| `LOCKFILE_PROVENANCE/INPUT/PACKAGE_LOCK_PARSEABLE` | pass | 65 | `package-lock.json` parses as JSON. |
| `LOCKFILE_PROVENANCE/LOCKFILE/LOCKFILE_VERSION_SUPPORTED` | pass | 65 | Lockfile version is explicitly supported by the checker. |
| `LOCKFILE_PROVENANCE/LOCKFILE/ROOT_PACKAGE_MATCHES` | pass | 65 | Lockfile root package metadata matches `package.json` expectations. |
| `LOCKFILE_PROVENANCE/DEPENDENCY/AJV_DECLARED_DEV_ONLY` | pass | 65 | Ajv is declared under `devDependencies`, not runtime `dependencies`. |
| `LOCKFILE_PROVENANCE/DEPENDENCY/AJV_LOCKED` | pass | 65 | Ajv has a concrete resolved lockfile entry. |
| `LOCKFILE_PROVENANCE/DEPENDENCY/AJV_VERSION_EXTRACTED` | pass | 65 | Checker can extract the exact Ajv version used for validator provenance. |
| `LOCKFILE_PROVENANCE/HASH/PACKAGE_JSON_SHA256` | pass | 65 | Checker computed package manifest SHA-256. |
| `LOCKFILE_PROVENANCE/HASH/PACKAGE_LOCK_SHA256` | pass | 65 | Checker computed lockfile SHA-256. |
| `LOCKFILE_PROVENANCE/OUTPUT/REPORT_SCHEMA_SHAPE` | pass | 70 | Checker produced the required report shape. Failure here means checker implementation fault, not repo input fault. |

## Report behavior requirement

`check-lockfile-provenance.mjs` must emit one JSON report with:

- `report_version`
- `status`
- `exit_code`
- `exit_code_name`
- package and lockfile paths
- package and lockfile SHA-256 values when available
- Ajv provenance when available
- ordered `checks[]` list
- no private or local absolute paths beyond repository-relative file paths

The checker should set `process.exitCode = report.exit_code` after writing the report.

## Design pattern

Treat the checker as a membrane:

Repository state -> read-only provenance checker -> JSON report + stable exit code -> validator generation gate

The membrane does not install packages, mutate lockfiles, import Ajv, generate validators, or run the app build. It only reads repository inputs and classifies whether schema-governance may proceed.

## What changed in understanding

Earlier plans over-weighted exit-code detail. Current research shows that exit codes should remain coarse because CI only treats them as success/failure. The richer and more durable contract is the check-code namespace inside the report. This gives MC stable automation routing without turning Unix process status into a fragile semantic database.

## Implementation implications

1. Add constants for the five exit-code names.
2. Add a frozen code registry for `LOCKFILE_PROVENANCE/*` checks.
3. Sort checks in execution order, not alphabetically, so reports read like a gate trace.
4. Compute the final `exit_code` from the highest-priority failed check category:
   - usage errors before file checks
   - missing/unreadable inputs before malformed data
   - data contract failures before internal shape failures unless the report itself cannot be produced
5. Preserve the dependency-free runner lane: this checker belongs only to schema-governance.

## Next research question

How should MC implement the first `check-lockfile-provenance.mjs` fixture-driven test harness so each exit-code class and each initial `LOCKFILE_PROVENANCE/*` check code is proven with deterministic JSON outputs before Ajv validator generation is introduced?
