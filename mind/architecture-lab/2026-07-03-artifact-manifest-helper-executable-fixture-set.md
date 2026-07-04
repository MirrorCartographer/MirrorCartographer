# Artifact Manifest Helper Executable Fixture Set

Status: design-pattern / prototype-plan
Public-safety: public-safe, no private user material, no raw unsafe strings

## Architecture question

How should MC define the first executable fixture set for artifact-manifest-helper replay so pass, expected-failure, unsafe-blocked, schema-invalid, and unexpected-failure paths are all proven without storing unsafe raw examples in the public repository?

## Research basis

Current sources checked during this run:

- GitHub Actions workflow commands support notices, warnings, errors, and file/line annotations; these should be emitted from normalized checks rather than raw exception logs.
- GitHub Actions `add-mask` redacts registered values, but it must be applied before a value is output; this means MC should not rely on masking as the primary public-safety boundary.
- GitHub job summaries are Markdown files written through `GITHUB_STEP_SUMMARY`, grouped into the workflow summary, isolated by step, and limited to 1 MiB per step; summary generation must therefore be compact and redacted by construction.
- GitHub workflow artifacts support explicit `retention-days`; replay artifacts should be short-retention operational evidence, not permanent records of unsafe inputs.
- Node `path.normalize()` resolves `.` and `..` segments and collapses separators; this supports path tests, but helper replay must still assert MC-specific policy because normalizing alone does not define public-safe artifact paths.
- JSON Schema 2020-12 recommends standard output formats so validation results can be interpreted across implementations; MC replay results should stay small, normalized, and schema-shaped.
- Recent GitHub Actions reliability/security research continues to point toward least-privilege, low-complexity workflows and reduced attack surface rather than complex CI scripts.

## Existing repository facts this design must respect

The helper already defines the safety-relevant kernel:

- `normalizeArtifactPath(relativePath)` rejects empty paths, backslashes, absolute paths, home paths, drive-letter paths, and root escapes.
- `scanArtifactPublicSafety(...)` scans declared text artifacts for secret-like assignments, private key blocks, and absolute home paths, and reports checks without copying offending content.
- `buildArtifactManifest(...)` sorts described files and derives manifest public-safety status from scan results.
- `writeArtifactManifest(...)` writes canonical manifest bytes through the canonical JSON helper.

The replay-result schema already requires an envelope with:

- `summary.status`, `passed`, `expectedFailures`, `unsafeBlocked`, `schemaInvalid`, and `unexpectedFailures` counts.
- `exitBehavior.exitCode` and the stable policy `0-pass-1-replay-or-schema-failure`.
- `publicSafety.redactionPolicy` fixed to `no-raw-unsafe-inputs-in-result-or-summary`.
- Per-fixture `expected` values: `pass`, `expected-failure`, `unsafe-blocked`, `schema-invalid`.
- Per-fixture `actual` values adding `unexpected-failure`.

The existing pass fixture proves only the minimal public-safe success path. It writes `result.json` and `summary.md`, expects manifest schema `governance.replay.artifact.manifest.v1`, expects `publicSafetyStatus: pass`, expects sorted paths, and forbids volatile fields such as `generatedAt`, `hostname`, `username`, `absolutePath`, `runUrl`, and `branch`.

## Useful concepts extracted

### 1. Fixture files should describe scenarios, not contain raw hazards

Unsafe examples must be symbolic fixtures. The fixture should declare a scenario such as `unsafePatternCase: secret-like-assignment` and let the replay tool synthesize the hazard in memory or in an ephemeral temp directory that is never committed. The replay result must report only the case id, normalized check code, path, and redacted message.

Rule: committed fixtures may name hazard classes; they must not store realistic tokens, keys, passwords, home paths, or copied private strings.

### 2. Expected failure is different from unsafe blocked

The replay tool needs two negative classes:

- `expected-failure`: a safe invalid helper input proves deterministic helper error behavior, such as a missing declared file or invalid relative artifact path.
- `unsafe-blocked`: a generated text artifact triggers public-safety scanning and proves that the manifest helper blocks output without copying the unsafe content into replay results or summaries.

Rule: expected helper errors can include safe fixture paths. Unsafe-blocked errors can include only redacted check messages.

### 3. Schema-invalid must prove envelope discipline, not schema chaos

The `schema-invalid` path should not depend on malformed JSON if avoidable. It should use a fixture that intentionally requests a replay envelope mutation such as `omitRequiredField: summary` or `badStatus: maybe`, then verify that the tool catches its own invalid result before publishing it as a normal artifact.

Rule: schema-invalid fixtures test the replay tool's output contract, not the manifest helper's domain behavior.

### 4. Unexpected failure should be a harness self-check, not a normal fixture success

`unexpected-failure` is needed to prove exit behavior and annotations, but it should not be treated as an expected passing CI case unless the replay tool supports a `--self-test-unexpected-failure` or fixture-local `expectHarnessFailure: true` mode that prevents it from polluting normal CI.

Rule: default replay fixture set should pass while containing expected failures and unsafe blocks. Unexpected-failure proof should be runnable locally or in a dedicated negative CI job that expects exit code 1.

### 5. Redacted Markdown summary is a first-class output

The replay summary should render counts and normalized check codes, not exception stacks or fixture content. It should be safe to append to `GITHUB_STEP_SUMMARY` unchanged.

Required summary sections:

- status line
- fixture count table
- check-code table
- artifact paths table
- redaction note: unsafe inputs are never copied into result JSON, annotations, or summary Markdown

### 6. Annotations are projections of checks

The tool should emit GitHub annotations only from normalized checks already present in the replay-result envelope. This prevents CI from becoming a second semantics layer.

Projection rule:

- `notice` for expected negative cases that behaved correctly
- `warning` for schema-invalid self-checks that are intentionally contained
- `error` for unexpected failure, unsafe detail leakage, or result-envelope invalidity

## Proposed executable fixture set

Directory:

`mind/fixtures/governance.artifact-manifest-helper.replay.fixture-set.v1/`

### 1. `pass-minimal-file-set.json`

Purpose: existing minimal success fixture can be reused as the baseline.

Expected: `pass`

Must prove:

- deterministic manifest generation
- sorted manifest file paths
- sha256 digests for generated files
- absence of volatile fields
- public-safety status `pass`

### 2. `expected-failure-invalid-path.json`

Purpose: prove helper rejects invalid declared artifact paths.

Expected: `expected-failure`

Safe committed payload:

- `caseId: expected-failure-invalid-path`
- `invalidPathCase: parent-directory-escape`
- `expectedCheckCode: GOVERNANCE_MANIFEST_HELPER_EXPECTED_FAILURE`
- `expectedHelperCode: GOVERNANCE_ARTIFACT_PATH_INVALID`

No raw path traversal string has to be stored in the committed fixture. The tool can map `parent-directory-escape` to a synthetic temp-only path during execution.

### 3. `unsafe-blocked-secret-like-assignment.json`

Purpose: prove public-safety blocking without committed unsafe examples.

Expected: `unsafe-blocked`

Safe committed payload:

- `caseId: unsafe-blocked-secret-like-assignment`
- `unsafePatternCase: secret-like-assignment`
- `expectedCheckCode: GOVERNANCE_MANIFEST_HELPER_UNSAFE_BLOCKED`
- `expectedHelperCheckCode: GOVERNANCE_ARTIFACT_PUBLIC_SAFETY_BLOCK`

The replay tool should synthesize a benign placeholder hazard in temp output, block it, delete or overwrite temp contents if needed, and report only the redacted check.

### 4. `schema-invalid-result-envelope.json`

Purpose: prove the replay tool detects an invalid replay-result envelope before treating it as a valid governance artifact.

Expected: `schema-invalid`

Safe committed payload:

- `caseId: schema-invalid-result-envelope`
- `resultMutation: omit-summary-status`
- `expectedCheckCode: GOVERNANCE_MANIFEST_HELPER_SCHEMA_INVALID`

The mutation is structural and contains no private or unsafe content.

### 5. `unexpected-failure-sentinel.json`

Purpose: prove deterministic exit behavior for a true harness failure.

Expected: `unexpected-failure`

Safe committed payload:

- `caseId: unexpected-failure-sentinel`
- `mode: self-test-only`
- `injectUnexpectedFailure: true`
- `expectedExitCode: 1`

This fixture should not be part of default CI. It should run only when explicitly requested, for example `--include-unexpected-failure-sentinel`.

## Replay tool requirements update

Target tool:

`tools/replay-governance-artifact-manifest-helper-fixtures.mjs`

Minimum behavior:

1. Load fixture descriptors from the fixture-set directory.
2. Reject committed fixture content that matches unsafe patterns before execution.
3. For each fixture, create an isolated temp artifact root.
4. Generate safe files or temp-only synthetic invalid/unsafe cases according to symbolic fixture fields.
5. Call the existing helper functions rather than duplicating manifest logic.
6. Normalize each outcome into the replay-result schema.
7. Validate the replay-result envelope before writing it as an artifact.
8. Write `result.json`, `summary.md`, and `manifest.json` in the stable artifact directory layout.
9. Emit annotations only from normalized checks.
10. Append `summary.md` to `GITHUB_STEP_SUMMARY` when present.
11. Exit `0` only when the result envelope is valid, no unexpected failures occurred, and no redaction leak was detected.
12. Exit `1` for replay failure, schema-invalid envelope publication attempts, unsafe detail leakage, or unexpected failure.

## Check-code vocabulary

Replay-level normalized checks:

- `GOVERNANCE_MANIFEST_HELPER_PASS`
- `GOVERNANCE_MANIFEST_HELPER_EXPECTED_FAILURE`
- `GOVERNANCE_MANIFEST_HELPER_UNSAFE_BLOCKED`
- `GOVERNANCE_MANIFEST_HELPER_SCHEMA_INVALID`
- `GOVERNANCE_MANIFEST_HELPER_UNEXPECTED_FAILURE`
- `GOVERNANCE_MANIFEST_HELPER_REDACTION_LEAK`
- `GOVERNANCE_MANIFEST_HELPER_FIXTURE_SCHEMA_INVALID`

Helper-level codes may be stored as nested metadata only when public-safe, for example `GOVERNANCE_ARTIFACT_PATH_INVALID` or `GOVERNANCE_ARTIFACT_PUBLIC_SAFETY_BLOCK`.

## Public-safety rules

- Never commit raw unsafe strings just to test scanners.
- Never copy offending content into `result.json`, `summary.md`, annotations, issue text, or future dashboard records.
- Never include absolute local paths in durable artifacts.
- Never include usernames, hostnames, run URLs, branch names, wall-clock timestamps, or environment dumps in deterministic governance fixtures.
- Prefer symbolic hazard classes plus temp-only synthesis.
- Treat `add-mask` as defense in depth, not as the proof boundary.

## Acceptance criteria

The first executable fixture set is complete when:

- Default replay runs the pass, expected-failure, unsafe-blocked, and schema-invalid cases and exits `0` when all behave as expected.
- The optional unexpected-failure sentinel exits `1` only when explicitly enabled.
- `result.json` validates against `governance.artifact-manifest-helper.replay.result.v1.schema.json`.
- `summary.md` contains no raw fixture body, unsafe string, exception stack, absolute path, or environment value.
- `manifest.json` is generated by `tools/lib/governance-artifact-manifest.mjs`.
- File digests are stable across repeated local runs with the same fixture set.
- GitHub annotations are generated from normalized checks only.

## Durable decision

The fixture set should be a public-safe scenario corpus. It should prove behavior through symbolic case descriptors and temp-only generated files, not through committed dangerous examples. This keeps MC's governance evidence useful for CI and future dashboard ingestion while preserving the public-safety boundary.

## Next architecture question

How should MC implement the first executable `tools/replay-governance-artifact-manifest-helper-fixtures.mjs` so it consumes symbolic fixture descriptors, synthesizes temp-only negative cases, writes `result.json`, `summary.md`, and `manifest.json`, and preserves stable default-vs-sentinel exit behavior?
