# Dry-Run Skeleton Writer Determinism Contract

Date: 2026-07-04

Public-safety status: public-safe. This note uses abstract fixture and runner terminology only. It does not include personal material, private project context, secrets, unsafe examples, or raw negative-case payloads.

## Architecture question

How should MC implement the dry-run skeleton writer so stable JSON serialization, stable Markdown rendering, descriptor ordering, and default-vs-sentinel exit behavior are proven with byte-identical fixtures before any temp-only unsafe synthesis is added?

## Research basis

Current source concepts reviewed:

- Node.js `process.exitCode`: prefer setting exit code after writing all deterministic outputs, rather than calling abrupt exit before buffers and file writes are complete. Source: https://nodejs.org/api/process.html#processexitcode
- Node.js `crypto.createHash`: use SHA-256 digests over final UTF-8 bytes to prove byte identity for `result.json`, `summary.md`, and later manifest custody. Source: https://nodejs.org/api/crypto.html#cryptocreatehashalgorithm-options
- GitHub Actions workflow commands: summaries, annotations, masking, and grouped output are separate emission surfaces; the runner should render all from the same normalized check stream rather than from duplicated strings. Source: https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-commands
- JSON Schema 2020-12 output model: validation output should be structured and machine-readable; MC should keep result envelopes minimal and avoid host-specific or wall-clock fields in deterministic fixtures. Source: https://json-schema.org/draft/2020-12/json-schema-core
- Recent GitHub Actions reliability research: larger and more complex workflows correlate with higher failure and maintenance risk, so the runner should remain small, staged, and contract-preserving before adding CI complexity. Source: https://arxiv.org/abs/2605.26825
- Recent GitHub Actions compliance research: permission controls and workflow security practices remain weak in many repositories; MC should avoid making CI emission depend on privileged operations or unredacted logs. Source: https://arxiv.org/abs/2605.02091

## Changed understanding

The dry-run skeleton writer should not be treated as a temporary script. It is the first executable proof that governance replay can produce stable public artifacts without relying on runtime environment details.

The correct boundary is:

`symbolic descriptors -> ordered descriptor index -> normalized checks -> deterministic result envelope -> deterministic summary -> byte digests -> process outcome`

The runner must prove determinism before it proves unsafe-case synthesis. Negative-case synthesis is explicitly out of scope for this phase.

## Design pattern: deterministic dry-run writer

### 1. Canonical descriptor ordering

Inputs must be sorted before evaluation:

1. Normalize descriptor paths to POSIX-style relative paths.
2. Reject absolute paths and parent traversal before sorting.
3. Sort by normalized descriptor path using bytewise lexical order.
4. Never use filesystem discovery order as a semantic signal.

### 2. Stable JSON serialization

The writer must use a local stable serializer instead of plain ad hoc `JSON.stringify` calls.

Required behavior:

- Object keys are emitted in lexical order.
- Arrays preserve semantic order.
- Strings are emitted as JSON strings without post-processing.
- Output ends with exactly one newline.
- No wall-clock timestamps, process IDs, absolute paths, hostname, OS, random IDs, or dependency-version banners are included in golden fixtures.

### 3. Stable Markdown rendering

`summary.md` must be derived from the same result envelope and normalized checks as `result.json`.

Required behavior:

- Fixed heading order.
- Fixed table column order.
- Checks sorted by `check_code`, then normalized descriptor path, then stage.
- Unsafe/private/raw values are never rendered; only public-safe check messages and symbolic descriptor IDs are allowed.
- Output ends with exactly one newline.

### 4. Digest after final bytes

Every deterministic fixture should compute digests over the exact final byte content that would be written to disk.

Required outputs:

- `result_json_sha256`
- `summary_md_sha256`
- optional later: `manifest_json_sha256`

These digests are not provenance yet. They are byte-stability witnesses.

### 5. Exit behavior

The skeleton runner needs two modes:

- Default mode: expected green-path proof exits `0` when all descriptor classes produce expected normalized checks.
- Sentinel mode: intentionally flips one expected condition and must exit nonzero while still writing a complete redacted result envelope and summary.

The runner should set `process.exitCode` only after output writing and digest calculation are complete.

## Minimal dry-run result envelope

The dry-run writer should emit only fields that can stay stable across local and CI execution:

- `schema_version`
- `runner_id`
- `mode`
- `phase`
- `process_outcome`
- `replay_state`
- `descriptor_count`
- `descriptor_index`
- `checks`
- `artifact_digests`

Do not include runtime timing fields until a separate non-golden telemetry envelope exists.

## Implementation requirements

1. Create `tools/replay-governance-artifact-manifest-helper-fixtures.mjs` as a stage shell.
2. Start with dry-run only; no temp-only unsafe synthesis yet.
3. Import `tools/lib/governance-replay-checks.mjs` for check creation and summary rendering, or add a compatibility adapter if the helper needs a small extension.
4. Implement `stableStringify(value)` inside a shared helper only if no existing serializer exists.
5. Write `result.json` and `summary.md` into a deterministic output directory supplied by CLI argument.
6. Compute SHA-256 digests from final bytes.
7. Add one pass fixture proving byte-identical output across two consecutive runs.
8. Add one sentinel fixture proving nonzero exit without losing result files.

## Non-goals

- No unsafe concrete fixtures committed to the repository.
- No temporary negative-case synthesis in this step.
- No CI workflow expansion until local byte-identical fixtures pass.
- No dashboard ingestion until the dry-run envelope is stable.

## Acceptance checks

- Running the skeleton twice against the same symbolic descriptors produces byte-identical `result.json` and `summary.md`.
- Descriptor order is identical regardless of filesystem enumeration order.
- Markdown and JSON are rendered from the same normalized check stream.
- Default mode exits `0` after writing artifacts.
- Sentinel mode exits nonzero after writing artifacts.
- No output contains absolute paths, hostnames, personal data, secrets, raw unsafe examples, or wall-clock timestamps.

## Next research question

How should MC design the shared `stable-governance-output.mjs` helper so stable JSON serialization, Markdown table escaping, SHA-256 byte digests, POSIX path normalization, and output redaction can be reused by artifact-manifest-helper replay, canonical replay, and ADR replay without turning the helper into a domain-specific compiler?
