# Artifact Manifest Helper Replay Implementation Plan

Date: 2026-07-03
Status: architecture-lab / public-safe

## Architecture question

How should MC implement `tools/replay-governance-artifact-manifest-helper-fixtures.mjs` so it emits the `governance.artifact-manifest-helper.replay.result.v1` envelope, writes a redacted Markdown summary, emits GitHub annotations from normalized checks, and proves deterministic exit behavior for pass, expected-failure, unsafe-blocked, schema-invalid, and unexpected-failure cases?

## Research basis

Current source review produced five useful implementation constraints:

1. GitHub annotations are stdout workflow commands. They support normalized `error`, `warning`, and `notice` channels, but they should receive already-redacted messages rather than raw fixture payloads.
   - Source: https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-commands
2. GitHub job summaries are Markdown written to `GITHUB_STEP_SUMMARY`. They are useful for high-level run status, but the summary file is still a publication surface; do not write unsafe fixture paths, raw user text, secrets, or untrusted diagnostic blobs into it.
   - Source: https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-commands#adding-a-job-summary
3. Node should prefer `process.exitCode` over direct `process.exit()` when output must flush cleanly before termination.
   - Source: https://nodejs.org/api/process.html#processexitcode
4. Hashing should continue to use Node `crypto.createHash('sha256')` for byte-level artifact custody.
   - Source: https://nodejs.org/api/crypto.html#cryptocreatehashalgorithm-options
5. Provenance thinking should record digests for artifacts and generated configuration surfaces that matter to later verification, but should avoid over-recording noisy intermediate details.
   - Source: https://slsa.dev/spec/v1.0/provenance

Recent GitHub Actions research also reinforces the design direction: workflows with excess complexity and weak security hygiene create reliability and maintenance risk. MC should keep CI thin and move domain semantics into versioned replay tools and typed artifacts rather than YAML logic.

## Useful concepts extracted

### 1. Replay result as event envelope, not log dump

The CLI should write a stable JSON envelope:

- `schema_id`
- `tool_id`
- `tool_version`
- `run_status`
- `fixture_count`
- `checks[]`
- `outputs[]`
- `manifest_digest`
- `redaction_policy`

The envelope is the authoritative result. Console output, GitHub annotations, and Markdown summary are renderings of that envelope.

### 2. Normalized check codes

Each check must use a stable code namespace:

- `GAMH_REPLAY_PASS`
- `GAMH_EXPECTED_FAILURE_CONFIRMED`
- `GAMH_UNSAFE_INPUT_BLOCKED`
- `GAMH_SCHEMA_INVALID`
- `GAMH_UNEXPECTED_FAILURE`
- `GAMH_OUTPUT_DIGEST_MISMATCH`
- `GAMH_SUMMARY_REDACTION_REQUIRED`

The check message must be safe to publish. The private/raw diagnostic, if ever preserved, must stay out of the summary and default annotations.

### 3. Five deterministic exit classes

The tool should separate semantic replay outcomes from process failure:

| Class | Meaning | Exit |
|---|---|---:|
| `pass` | all pass fixtures passed and expected failures were confirmed | 0 |
| `expected-failure` | expected-fail fixtures failed in the expected way | 0 |
| `unsafe-blocked` | unsafe fixture was blocked by policy | 0 when expected, 1 when unexpected |
| `schema-invalid` | output envelope or manifest violates schema | 2 |
| `unexpected-failure` | runtime exception, wrong failure mode, digest mismatch, or unhandled state | 1 |

This lets CI block real governance drift without breaking because a negative fixture did its job.

### 4. Redacted Markdown summary

The summary should contain only:

- title
- run status
- fixture counts by class
- check counts by severity
- artifact directory path, if public-safe and repo-relative
- manifest digest
- top normalized check codes

It must not include raw fixture JSON, absolute paths, environment values, personal references, secrets, or model-generated private reasoning.

### 5. Thin CI harness

GitHub Actions should call the replay CLI and upload the artifact directory. It should not recalculate replay status, rebuild the manifest, parse raw fixtures, or duplicate path rules. The tool owns the domain semantics.

## Proposed implementation pattern

Create `tools/replay-governance-artifact-manifest-helper-fixtures.mjs` with this structure:

1. Load fixture documents from `mind/fixtures/governance.replay.artifact.manifest-helper.v1/`.
2. For each fixture:
   - validate fixture shape;
   - create a temporary output tree under a deterministic repo-relative artifact root;
   - invoke `tools/lib/governance-artifact-manifest.mjs`;
   - compare actual result against expected status and digest fields;
   - convert all findings into normalized checks.
3. Build a replay-result envelope.
4. Validate the envelope against `mind/schemas/governance.artifact-manifest-helper.replay.result.v1.schema.json`.
5. Write:
   - `artifacts/governance/artifact-manifest-helper-replay/result.json`
   - `artifacts/governance/artifact-manifest-helper-replay/summary.md`
   - `artifacts/governance/artifact-manifest-helper-replay/manifest.json`
6. Emit GitHub annotations from normalized public-safe checks when `GITHUB_ACTIONS=true`.
7. Append `summary.md` to `GITHUB_STEP_SUMMARY` when present.
8. Set `process.exitCode` according to the deterministic exit table.

## Public-safety requirements

The replay tool must treat these as block conditions:

- absolute local filesystem paths in public outputs;
- environment variable values;
- raw fixture body in Markdown or annotation text;
- names, emails, locations, health details, or private project memoir content;
- unbounded exception stack traces in generated artifacts;
- non-repo-relative artifact paths.

Failures should be represented as check codes and short sanitized messages.

## Acceptance criteria

- Running the tool twice on the same fixtures produces byte-identical `result.json` and `summary.md`, except fields explicitly marked volatile. Prefer no volatile fields in v1.
- Expected negative fixtures return exit code 0 when their expected failure mode is confirmed.
- Schema-invalid result envelopes return exit code 2.
- Unexpected runtime failures return exit code 1.
- GitHub annotations are generated only from `checks[]` entries whose `public_safe` field is true.
- Markdown summary never includes raw fixture JSON.
- Artifact manifest generation is called through `tools/lib/governance-artifact-manifest.mjs`; replay code does not duplicate manifest hashing/path logic.

## Durable decision

Implement helper replay as a small governance compiler CLI. Its output contract is the replay-result envelope plus manifest directory. CI is only a caller and carrier.

## Next architecture question

How should MC define the first executable fixture set for artifact-manifest-helper replay so pass, expected-failure, unsafe-blocked, schema-invalid, and unexpected-failure paths are all proven without storing unsafe raw examples in the public repository?
