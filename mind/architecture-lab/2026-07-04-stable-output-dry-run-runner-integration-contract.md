# Stable output dry-run runner integration contract

Public-safe durable artifact. Contains no private user material.

## Architecture question

How should MC integrate `tools/lib/stable-governance-output.mjs` into the dry-run skeleton runner so `result.json`, `summary.md`, and output-record manifests become byte-identical fixtures without changing the replay-result schema or check taxonomy?

## Current-source research basis

Sources checked on 2026-07-04:

- GitHub Actions workflow commands documentation: annotations are emitted through workflow-command syntax, `add-mask` masks values in logs, and job summaries are written through `GITHUB_STEP_SUMMARY`.
  - https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-commands
- Node.js `crypto` documentation: `createHash()` is the built-in digest primitive for SHA-family hashes.
  - https://nodejs.org/api/crypto.html
- Node.js `process` documentation: runner exit behavior should be represented with `process.exitCode` at the outer process boundary, not inside deterministic output helpers.
  - https://nodejs.org/api/process.html
- SLSA provenance v1.0: build/provenance subjects use artifact names and digests, reinforcing that byte identity should be represented as explicit output records.
  - https://slsa.dev/spec/v1.0/provenance
- 2026 GitHub Actions agentic workflow injection research: untrusted GitHub context can cross prompt/script boundaries, so public summaries and annotations must be treated as an injection-sensitive output surface, not passive logs.

## Existing MC constraints

`tools/lib/stable-governance-output.mjs` already provides the shared deterministic boundary:

- stable sorted JSON with final newline
- SHA-256 byte digests
- public-text redaction
- public-safe scalar/object sanitization
- repository-relative POSIX path normalization
- Markdown table escaping
- per-output records and records manifests

`tools/lib/governance-replay-checks.mjs` already provides the shared check boundary:

- append-only check codes
- normalized categories, states, severities, and expectedness
- public-safe messages and safe details
- GitHub/dashboard emission hints
- fatality detection
- Markdown check rendering

The runner must integrate both helpers without merging their responsibilities.

## Changed understanding

The dry-run skeleton runner should not be treated as a placeholder for later real replay. It should be the first byte-custody proof for the whole replay family.

The correct boundary is:

`symbolic descriptors -> normalized checks -> deterministic event envelope -> deterministic Markdown summary -> deterministic output-record manifest -> process exit decision`

The runner owns orchestration. The helpers own stable primitives.

## Design pattern

Name: dry-run byte-custody shell.

Intent: prove deterministic replay output before unsafe temp synthesis or helper execution exists.

### Non-negotiable separations

1. Domain state is not process outcome.
   A dry-run can observe expected failure, unsafe-blocked, or schema-invalid states while still producing a successful governance proof.

2. Output bytes are not logs.
   `result.json`, `summary.md`, and `manifest.json` are durable artifacts with explicit byte lengths and SHA-256 digests.

3. Redaction is not Markdown escaping.
   Public-safe classification must happen before any table, annotation, or summary rendering.

4. Check taxonomy is not runner-local control flow.
   The runner may choose which checks to emit, but it must not create ad hoc status strings.

5. Exit behavior is the last boundary.
   The runner calculates outputs first, writes deterministic artifacts, then applies default-vs-sentinel exit behavior from normalized fatal checks.

## Required dry-run outputs

For each deterministic dry-run execution, the runner should write exactly these artifacts unless explicitly configured otherwise:

1. `result.json`
   - schema id from the existing replay-result contract
   - runner id and mode: `dry-run`
   - descriptor set identity using repository-relative paths only
   - normalized checks array
   - check summary from `summarizeChecks()`
   - output records array for summary/result/manifest candidates
   - no wall-clock timestamp
   - no host path
   - no environment dump
   - no raw unsafe fixture material

2. `summary.md`
   - public-safe title
   - descriptor count
   - check summary counts
   - normalized check table
   - output-record table
   - no untrusted raw descriptor body
   - no absolute local path

3. `manifest.json`
   - `recordsManifest(records)` output
   - records sorted by normalized path
   - record digests computed over exact bytes that would be or were written

## Minimal stage machine

Stage 1: collect descriptor paths

- Accept explicit descriptor paths or default fixture descriptor glob.
- Normalize every path through `normalizeRepositoryPath()`.
- Sort lexicographically after normalization.
- Emit `GHR_DESCRIPTOR_VALID` only for structurally acceptable descriptor references.

Stage 2: construct dry-run checks

- Use `createReplayCheck()` only.
- Do not emit free-form status strings.
- Use expected fixture class to choose the check state.
- Use safeDetails for descriptor class, fixture id, and expected state only.

Stage 3: construct result object

- Use stable schema-compatible fields only.
- Exclude runtime-only data: current time, host OS, absolute CWD, Node version, environment variables.
- Include deterministic counts and sorted descriptor references.

Stage 4: render summary

- Use `markdownTable()` from `stable-governance-output.mjs` for output-record tables.
- Use `checksToMarkdown()` from `governance-replay-checks.mjs` for check tables unless it is later replaced by a stable-output-backed renderer.
- Summary content must be derivable entirely from `result.json` plus records.

Stage 5: build output records

- Generate candidate bytes first:
  - `resultBytes = stableJson(result)`
  - `summaryBytes = renderSummary(result, recordsWithoutManifest)`
  - `manifest = recordsManifest([...resultRecord, summaryRecord])`
  - `manifestBytes = stableJson(manifest)`
- Then final records include all three artifacts.
- If manifest includes itself, use a two-level model:
  - `outputs.records.json` records result + summary
  - `outputs.manifest.json` records the records file
- Do not use recursive self-digesting manifests.

Stage 6: write or verify

- Dry-run mode may either write to a deterministic output directory or compare against checked-in expected fixtures.
- Verification must compare byte-for-byte strings, not parsed object equality alone.
- A digest mismatch becomes a normalized contract check, not a thrown unclassified error.

Stage 7: decide exit behavior

- Default mode: fatal normalized checks set `process.exitCode = 1`; expected proof states remain exit 0.
- Sentinel mode: intentionally invert or pin specific failure-path behavior only when requested by a documented flag.
- The stable-output helper must never set exit behavior.

## Prototype plan

Create `tools/replay-governance-artifact-manifest-helper-fixtures.mjs` in three increments:

### Increment A: deterministic dry-run shell

- import stable-output helper
- import governance-check helper
- read symbolic descriptor file paths
- emit deterministic `result.json`, `summary.md`, and non-recursive `manifest.json`
- no temp synthesis
- no helper execution
- no GitHub annotation emission

### Increment B: byte fixture proof

- add checked-in expected dry-run output fixtures
- run twice in CI and compare SHA-256 digests
- make mismatches produce normalized `contract_violation` checks

### Increment C: CI emission adapter

- convert normalized checks into GitHub annotations only after artifacts are built
- append `summary.md` to `GITHUB_STEP_SUMMARY`
- mask any values before emission when the runner receives optional external inputs

## Acceptance requirements

- Two identical dry-run inputs produce byte-identical `result.json`, `summary.md`, and `manifest.json`.
- Reordering descriptor arguments does not alter output bytes after normalization.
- Adding an absolute path descriptor fails with a normalized public-safe check and never persists the raw path.
- No artifact contains timestamps, host-specific paths, environment variables, or raw unsafe fixture material.
- `recordsManifest()` is used for custody metadata.
- `hasFatalReplayChecks()` is the only fatality gate for normal mode.
- Sentinel mode is represented as explicit runner configuration, not implicit exception handling.

## Implementation warning

Do not make `manifest.json` self-referential. A file cannot contain a stable digest of its own final bytes without a fixed-point convention. Use a records manifest for sibling outputs, or use a two-level manifest pattern where the top-level custody object records a previously finalized records file.

## Next research question

How should MC define the checked-in expected dry-run fixture outputs and byte-comparison harness so fixture updates are intentional, reviewable, and resistant to accidental regeneration drift?
