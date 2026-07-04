# Artifact Manifest Helper Runner Skeleton Stage Plan

Public-safe: this note contains no private or personal source material. It abstracts the architecture into reusable governance tooling.

## Architecture question

How should MC design the first executable runner skeleton for `tools/replay-governance-artifact-manifest-helper-fixtures.mjs` so the stage machine can be implemented incrementally with dry-run checks first, then deterministic artifact writing, then manifest custody, without changing the public replay-result contract?

## Current finding

The runner should be implemented as a stable orchestration shell before it becomes a full fixture executor. The shell owns the public replay-result contract and delegates domain work to narrow stages. This prevents the output contract from changing every time descriptor synthesis, manifest generation, schema validation, or GitHub Actions emission changes.

## Researched concepts

### 1. Exit behavior must be derived late

Node supports assigning `process.exitCode` so the process can finish naturally after pending writes instead of terminating synchronously. For this runner, that means `result.json`, `summary.md`, and `manifest.json` should be written before the final exit code is set.

Design rule: never call `process.exit()` inside stage functions. Stages return normalized checks; the top-level runner derives `process.exitCode` after all safe artifacts are written.

### 2. GitHub Actions output is presentation, not state

GitHub Actions annotations and job summaries are line-oriented presentation channels. They should be generated from normalized checks, not from raw thrown errors or descriptor bodies. This keeps dashboard ingestion, local replay, and CI display consistent.

Design rule: `summary.md` and workflow annotations are projections of the same check stream that appears in `result.json`.

### 3. Schema validation is an input and output boundary

JSON Schema 2020-12 supports explicit vocabularies and output-oriented validation semantics. MC should treat schemas as boundaries between stages, not as generic runtime comments.

Design rule: descriptor validation, replay-result validation, check validation, and manifest validation should each emit checks with stable codes; they should not throw raw validation text into public artifacts.

### 4. Provenance should bind subjects by digest

SLSA provenance models build outputs as subjects identified by name and digest. MC's artifact manifest should do the same at the smaller governance-runner scale: every persisted artifact is named, typed, byte-counted, and SHA-256 digested.

Design rule: `manifest.json` must be the custody object for `result.json`, `summary.md`, and any auxiliary files. It should not be hand-assembled in the runner if `tools/lib/governance-artifact-manifest.mjs` can own that boundary.

### 5. Workflow complexity is itself a risk surface

Recent GitHub Actions research shows workflow maintenance and reliability degrade as workflows become more complex, and 2026 agentic workflow research identifies prompt-to-agent and prompt-to-script injection paths when untrusted repository/event text reaches agentic tools or scripts.

Design rule: keep the runner deterministic, local-first, and fixture-descriptor-driven. Avoid consuming issue bodies, PR text, comments, environment secrets, or other mutable workflow context as fixture instructions.

## Existing repository boundary

`tools/lib/governance-replay-checks.mjs` already defines the shared check registry, states, severities, expectedness values, public-safe redaction, location normalization, fatality detection, and Markdown rendering. The runner skeleton should import this rather than creating local error strings.

`tools/lib/governance-artifact-manifest.mjs` already owns deterministic manifest creation, path normalization, SHA-256 file digests, public-safety scanning, and atomic `manifest.json` writes. The runner skeleton should call this helper instead of duplicating custody logic.

## Proposed runner skeleton

The first executable version should be intentionally boring. It should prove the contract before full behavior.

### Command shape

`node tools/replay-governance-artifact-manifest-helper-fixtures.mjs --descriptor <path> --out <dir> [--sentinel-exit] [--dry-run]`

Required behavior:

1. Resolve repository-relative descriptor path.
2. Validate descriptor against the symbolic descriptor schema.
3. Create a stage context with `descriptorId`, `fixtureClass`, `outDir`, `sentinelExit`, `dryRun`, and `checks`.
4. Emit only normalized checks.
5. In dry-run mode, write `result.json` and `summary.md`, but skip temp synthesis and manifest custody.
6. In write mode, synthesize only public-safe temp cases, execute helper behavior, write `result.json`, write `summary.md`, then call the manifest helper.
7. Derive exit code from the final check stream.

### Stage machine

| Stage | Input | Output | Failure representation |
|---|---|---|---|
| `loadDescriptor` | descriptor path | parsed descriptor | `GHR_UNEXPECTED_FAILURE` only if the file cannot be read |
| `validateDescriptor` | parsed descriptor | typed descriptor | `GHR_DESCRIPTOR_VALID` or schema-invalid check |
| `prepareWorkspace` | out dir | clean output directory | unexpected failure check |
| `synthesizeFixture` | typed descriptor | temp-only concrete case | expected failure, unsafe blocked, or unexpected failure check |
| `runHelper` | concrete case | helper result | helper execution check |
| `compileResultEnvelope` | checks + context | `result.json` object | contract violation check if invalid |
| `renderSummary` | checks | `summary.md` | public-safe projection only |
| `writeManifest` | output files | `manifest.json` | manifest created or manifest invalid check |
| `deriveExit` | checks + sentinel flag | exit code | sentinel-stable check |

### Contract-first implementation phases

#### Phase 1 — dry-run skeleton

Implement CLI parsing, descriptor loading, normalized check creation, result envelope writing, summary rendering, and late `process.exitCode` derivation. No temp negative synthesis yet.

Minimum output files:

- `result.json`
- `summary.md`

No `manifest.json` in dry-run mode unless the runner writes deterministic stub artifacts.

#### Phase 2 — deterministic artifact writing

Add deterministic output ordering and stable canonical JSON writing. At this point, repeated runs over the same descriptor should produce byte-identical `result.json` and `summary.md`, excluding intentionally variable fields. Prefer no wall-clock fields.

#### Phase 3 — manifest custody

Call `createArtifactManifestDirectory` with `result.json` and `summary.md`. Manifest generation becomes a required stage for non-dry-run mode.

Minimum manifest file set:

- `result.json` as `replay-result`
- `summary.md` as `redacted-summary`

#### Phase 4 — temp-only negative synthesis

Add symbolic fixture synthesis for the five descriptor classes: pass, expected failure, unsafe blocked, schema invalid observed, and unexpected failure sentinel. Unsafe raw material must never be committed or copied into public artifacts.

#### Phase 5 — CI projection

Add GitHub annotation emission by mapping checks through `check.emission.githubAnnotation`. The CI output remains a projection, not source-of-truth state.

## Result-envelope rule

The runner's result envelope should answer four separate questions:

1. What did the descriptor request?
2. What stage state was observed?
3. Which normalized checks prove the state?
4. Which artifacts were written and digested?

It should not contain raw unsafe examples, host absolute paths, secrets, user-specific material, workflow event bodies, or uncapped error messages.

## Exit-code rule

Default mode:

- Exit `0` when all failures are expected governance observations.
- Exit non-zero only for unexpected failures or contract violations.

Sentinel mode:

- Exit non-zero when the descriptor class intentionally proves non-green behavior.
- Emit `GHR_SENTINEL_EXIT_STABLE` when the sentinel behavior matches the descriptor.

This makes routine governance replay green while still allowing CI to prove that red-path semantics work.

## Implementation requirements

1. Runner stages must return checks, not throw public strings.
2. Top-level `main()` may catch errors, convert them to `createProblemCheck(...)`, write safe artifacts when possible, and then set `process.exitCode`.
3. Descriptor validation must happen before temp synthesis.
4. Public-safety blocking must happen before persistence.
5. Manifest custody must happen after all primary artifacts are written.
6. GitHub annotations must be generated from normalized checks only.
7. The runner must not read GitHub issue bodies, PR descriptions, comments, or arbitrary workflow event JSON as fixture instructions.

## Durable decision

MC should implement the runner as a contract-preserving stage shell first. The first commit should not attempt full helper execution. It should prove stable CLI shape, normalized check stream, redacted `summary.md`, `result.json`, and late exit derivation. Full descriptor synthesis and manifest custody can then be added without changing the public replay-result schema.

## Next research question

How should MC define the exact `result.json` envelope fields for the dry-run runner skeleton so they are minimal, schema-compatible, deterministic, and sufficient for later manifest custody and dashboard ingestion without introducing wall-clock or host-specific data?
