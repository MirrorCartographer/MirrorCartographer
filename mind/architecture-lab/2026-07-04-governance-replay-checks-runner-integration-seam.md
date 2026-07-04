# Governance replay checks runner integration seam

Status: design pattern / implementation contract
Date: 2026-07-04
Public-safety level: public-safe; no private user material

## Architecture question

How should MC integrate `tools/lib/governance-replay-checks.mjs` into `tools/replay-governance-artifact-manifest-helper-fixtures.mjs` so descriptor validation, temp-only synthesis, helper execution, manifest writing, summary rendering, annotations, and sentinel exit behavior all use normalized checks without duplicating result-state logic?

## Current repository facts

The shared helper already exists at `tools/lib/governance-replay-checks.mjs`. It defines:

- the shared check schema id: `governance.replay.check.v1`
- append-only check prefixes: replay, manifest, schema, public-safety, and actions
- shared categories for descriptor validation, temp synthesis, helper execution, public safety, schema validation, artifact manifest, GitHub Actions emission, exit behavior, and contract checks
- shared states for passed, expected failure observed, unsafe blocked, schema invalid observed, unexpected failure, contract violation, and not applicable
- check creation, public-safe redaction, location normalization, summary counting, fatality detection, and Markdown rendering

The runner `tools/replay-governance-artifact-manifest-helper-fixtures.mjs` does not yet exist. The next implementation should therefore treat this note as the executable seam contract rather than as a retrofit.

## Research basis

Current platform behavior creates four relevant constraints:

1. Node runners should prefer `process.exitCode` over direct `process.exit()` when they need deterministic exit status after stdout or summary output. Direct exit can truncate asynchronous writes; setting `process.exitCode` allows graceful termination after pending output completes.
2. GitHub Actions annotations are emitted through workflow commands such as `::error file=...,line=...::{message}` and can bind diagnostics to repository-relative file locations.
3. GitHub job summaries are written to the `GITHUB_STEP_SUMMARY` environment file, rendered as GitHub-flavored Markdown, grouped on the workflow run page, and limited per step. Summaries are masked, but sensitive material should still be blocked before writing.
4. `add-mask` must be registered before a sensitive value is printed or used in workflow commands; therefore MC should not rely on masking as the primary public-safety boundary. Redaction and symbolic negative fixtures remain the first boundary.
5. JSON Schema 2020-12 defines recommended output formats and an output validation schema, so MC should keep replay-result envelopes structurally typed instead of letting validator-specific raw errors become the durable interface.
6. SLSA provenance models build outputs as subjects. MC manifests should preserve the same conceptual split: result envelope = event; manifest = custody list of emitted artifacts; checks = normalized observations that explain why the event is trusted.
7. 2026 research on agentic GitHub Actions and AI CI/CD prompt injection shows that untrusted repository/event content can become dangerous when it crosses prompt, script, or tool boundaries. The runner must therefore never persist raw unsafe examples and must not turn descriptor content into shell commands.

## Useful concepts extracted

### One check stream, many surfaces

The runner should create one canonical in-memory array of `governance.replay.check.v1` objects. All other outputs must be projections of that array:

- `result.json`: includes checks and aggregate summary
- `summary.md`: rendered from checks with public-safe messages only
- GitHub annotations: emitted from checks whose `emission.githubAnnotation` is not `none`
- exit code: derived from `hasFatalReplayChecks(checks)` plus sentinel mode
- `manifest.json`: records emitted artifact custody, not independent status semantics

No stage may create ad hoc error strings for durable output. Raw caught exceptions may exist only inside the local process and must enter artifacts through `createProblemCheck()` or another normalized check constructor.

### Runner stages

The runner should be organized as an explicit stage machine:

1. `load_descriptors`
   - read symbolic descriptor files
   - create `GHR_DESCRIPTOR_VALID` on valid descriptor structure
   - create `GHR_UNEXPECTED_FAILURE` or future descriptor-specific code on invalid descriptor when not an expected schema-invalid case

2. `synthesize_temp_case`
   - create temp-only concrete file trees from symbolic fixture intent
   - never commit concrete unsafe examples
   - ensure paths remain repository-relative in public output

3. `execute_helper`
   - call the artifact manifest helper against the temp file set
   - map expected helper failure to `GHR_EXPECTED_FAILURE_OBSERVED`
   - map unexpected helper failure to `GHR_UNEXPECTED_FAILURE`

4. `public_safety_gate`
   - scan result, summary, and manifest candidate text before write
   - map blocked cases to `GHP_UNSAFE_SYMBOLIC_CASE_BLOCKED`
   - map confirmed clean output to `GHP_PUBLIC_SAFE_OUTPUT_CONFIRMED`

5. `write_manifest`
   - write `manifest.json` after result and summary candidates are produced
   - create `GHM_MANIFEST_CREATED` on deterministic manifest creation
   - create `GHM_MANIFEST_INVALID` on schema or custody mismatch

6. `emit_ci_surfaces`
   - render Markdown using `checksToMarkdown(checks)` or a runner wrapper around it
   - emit GitHub annotations only from normalized check fields
   - avoid writing raw descriptor content, temp paths, stack traces, environment variables, or untrusted strings

7. `derive_exit`
   - default mode: expected negative fixtures are success if their expected state is observed
   - sentinel mode: intentionally returns non-zero only when proving failure propagation
   - always set `process.exitCode`; do not call `process.exit()` in normal paths

### State ownership rule

The helper owns the check taxonomy. The runner owns sequencing. The manifest helper owns file custody. The replay-result schema owns envelope shape. GitHub Actions owns display only.

This avoids the failure mode where the runner becomes a second taxonomy with its own partially compatible state logic.

### Public-safety rule

Unsafe examples may be represented only as symbolic descriptors and temp-only synthesized cases. Durable output may say `unsafe symbolic case was blocked`, but it must not include the raw unsafe payload, absolute local path, secret-like string, token, branch payload, shell payload, or prompt-injection instruction.

### Determinism rule

The same descriptor set must produce stable normalized checks, stable aggregate counts, stable summary text, stable manifest ordering, and stable exit behavior. Timestamps, temp directories, hostnames, and local absolute paths must not enter durable output.

## Required implementation decisions

The runner should implement these decisions first:

- import `createReplayCheck`, `createProblemCheck`, `summarizeChecks`, `hasFatalReplayChecks`, and `checksToMarkdown` from `tools/lib/governance-replay-checks.mjs`
- represent each stage result as `{ stage, checks, artifacts, transient }`
- treat `transient` as non-serializable unless explicitly redacted
- generate one `checks` array and pass it to every projection
- generate `summary` from `summarizeChecks(checks)`
- emit annotations from `check.emission.githubAnnotation`, `check.location`, and `check.publicMessage`
- set `process.exitCode` after writes are complete enough to avoid truncating output
- never persist raw caught exception stack traces

## Minimal prototype plan

1. Add `tools/replay-governance-artifact-manifest-helper-fixtures.mjs` with a no-side-effect dry run mode.
2. Load the five symbolic descriptor fixtures already defined by the previous architecture step.
3. For each descriptor, produce normalized checks only; skip manifest writing in the first commit if necessary.
4. Write `result.json` and `summary.md` to a deterministic output directory.
5. Add manifest writing only after output byte stability is proven.
6. Add a CI workflow step with explicit least-privilege permissions and no secret exposure.
7. Add a sentinel invocation that proves expected non-zero behavior without failing the default green-path replay.

## Acceptance criteria

- No durable output contains private user material, absolute paths, raw secrets, raw unsafe payloads, stack traces, or temp directory names.
- Every durable diagnostic is a `governance.replay.check.v1` object.
- Expected failures, unsafe blocks, and schema-invalid observations can be green-path proofs.
- Unexpected helper failure or manifest contract violation becomes fatal.
- Markdown summary and GitHub annotations are projections of the same check array.
- Default mode exits zero when all expected outcomes are observed.
- Sentinel mode exits non-zero only for the designated sentinel case.

## Next research question

How should MC design the first executable runner skeleton for `tools/replay-governance-artifact-manifest-helper-fixtures.mjs` so the stage machine can be implemented incrementally with dry-run checks first, then deterministic artifact writing, then manifest custody, without changing the public replay-result contract?
