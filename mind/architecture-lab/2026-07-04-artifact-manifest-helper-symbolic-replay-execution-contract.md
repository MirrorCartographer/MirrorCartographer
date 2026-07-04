# Artifact Manifest Helper Symbolic Replay Execution Contract

Date: 2026-07-04
Status: proposed durable architecture note
Public-safety class: public-safe / abstracted / no private user material

## Architecture question

How should MC implement the first executable `tools/replay-governance-artifact-manifest-helper-fixtures.mjs` so it consumes symbolic fixture descriptors, synthesizes temp-only negative cases, writes `result.json`, `summary.md`, and `manifest.json`, and preserves stable default-vs-sentinel exit behavior?

## Research basis

Current-source review focused on five implementation constraints:

1. Node filesystem primitives support isolated temporary workspaces through `fsPromises.mkdtemp`, deterministic cleanup through recursive removal, and path handling through `path.normalize`. This supports synthetic negative cases that never need to be committed as raw dangerous examples.
2. Node `crypto.createHash` provides the stable SHA-256 byte digest primitive needed for deterministic manifest entries.
3. GitHub Actions workflow commands support annotations, masking, and job summaries; summaries should receive redacted Markdown, while annotations should be emitted from normalized check codes rather than raw error text.
4. JSON Schema 2020-12 defines validation output formats and minimum result information; MC replay envelopes should follow that spirit but keep its own compact public-safe event model.
5. SLSA provenance models subjects with digest maps, which confirms the design choice that manifests should identify emitted files by path, byte count, and digest rather than by mutable CI metadata.

Sources consulted:
- Node.js filesystem documentation, including `fsPromises.mkdtemp` and related file operations: https://nodejs.org/api/fs.html#fspromisesmkdtempprefix-options
- Node.js path normalization documentation: https://nodejs.org/api/path.html#pathnormalizepath
- Node.js crypto hash documentation: https://nodejs.org/api/crypto.html#cryptocreatehashalgorithm-options
- GitHub Actions workflow commands, annotations, masking, and job summaries: https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-commands
- GitHub Actions artifact sharing and retention behavior: https://docs.github.com/en/actions/tutorials/store-and-share-data
- GitHub Actions token permission guidance: https://docs.github.com/en/actions/tutorials/authenticate-with-github_token
- JSON Schema 2020-12 core, especially output formatting: https://json-schema.org/draft/2020-12/json-schema-core
- SLSA provenance v1.0 subject/digest model: https://slsa.dev/spec/v1.0/provenance
- Valenzuela-Toledo et al., 2024, on GitHub Actions workflow maintenance cost: https://arxiv.org/abs/2409.02366
- Attouche et al., 2023, on modern JSON Schema formalization and complexity: https://arxiv.org/abs/2307.10034
- Baazizi et al., 2026, on JSON Schema inclusion and normalization: https://arxiv.org/abs/2603.25306

## Useful concepts extracted

### 1. Symbolic fixtures are descriptors, not exploit samples

The repository should store fixture intent, expected status, and public-safe symbolic input classes. It should not store raw path traversal strings, private paths, tokens, secrets, hostile filenames, or representative sensitive payloads.

Descriptor fields should include:

- `fixture_id`: stable kebab-case identifier.
- `case_class`: one of `pass`, `expected_failure`, `unsafe_blocked`, `schema_invalid`, `unexpected_failure_sentinel`.
- `input_symbol`: public-safe symbol such as `SAFE_MINIMAL_FILE_SET`, `SYMBOLIC_PATH_ESCAPE`, `SYMBOLIC_SECRETLIKE_VALUE`, or `SYMBOLIC_SCHEMA_MISSING_REQUIRED_FIELD`.
- `expected_status`: stable replay status.
- `expected_check_codes`: stable normalized codes.
- `summary_policy`: `redacted_only` unless the case is fully safe.

### 2. Negative cases should be synthesized only inside a temp workspace

The runner should map symbolic descriptors to generated runtime inputs inside an OS temp directory, run the helper, capture normalized results, and remove the workspace. Raw generated unsafe strings should not be written to committed fixtures, `summary.md`, or GitHub annotations.

Required invariant:

- Temporary negative material may exist during process execution.
- Only normalized codes and redacted labels may persist.
- Generated temp paths must be excluded from final artifacts.

### 3. Replay output is a public-safe event envelope

The script should write these artifacts in one replay output directory:

- `result.json`: complete machine-readable replay envelope.
- `summary.md`: redacted human-readable run summary.
- `manifest.json`: digest inventory for the emitted artifacts.

`result.json` should be the authority. `summary.md` and annotations are renderings of `result.json`; they must never contain more detail than the JSON envelope.

### 4. Exit behavior needs two modes

Default mode should fail only on implementation-breaking conditions:

- unexpected pass/fail mismatch,
- unsafe material persisted,
- schema-invalid replay envelope,
- manifest generation failure,
- tool crash.

Sentinel mode should intentionally prove an unexpected-failure path and return a stable nonzero exit code. This mode is useful for CI contract tests but should not be enabled in normal governance replay.

Recommended exit map:

- `0`: all normal fixtures behaved as expected.
- `1`: unexpected fixture result, schema-invalid envelope, or unsafe persistence.
- `2`: sentinel mode successfully produced the intentional unexpected-failure condition.
- `3`: runner infrastructure error before a valid envelope could be written.

### 5. CI should stay thin

The workflow should call the runner, upload the artifact directory, and publish the runner-produced summary. It should not duplicate fixture semantics, path layout, redaction rules, or manifest logic. This follows the prior MC principle that CI is a harness, not a governance compiler.

## Requirements update

### Runner input contract

`tools/replay-governance-artifact-manifest-helper-fixtures.mjs` should accept:

- `--fixtures <dir>`: directory of symbolic fixture descriptors.
- `--out <dir>`: artifact output directory.
- `--mode default|sentinel-unexpected-failure`.
- `--summary-format markdown`, initially only Markdown.
- `--ci-annotations auto|off`, default `auto` when `GITHUB_ACTIONS=true`.

### Runner processing contract

For each fixture:

1. Load descriptor.
2. Validate descriptor shape before synthesis.
3. Create temp workspace.
4. Synthesize input from `input_symbol`.
5. Execute manifest helper.
6. Normalize result into stable check codes.
7. Verify expected status and expected codes.
8. Scan persistent outputs for unsafe raw material.
9. Delete temp workspace.
10. Append sanitized fixture result to replay envelope.

### Persistent artifact contract

The runner must write:

- `result.json` with stable status, fixture results, normalized checks, tool version, public-safety verdict, and artifact paths.
- `summary.md` generated from `result.json` only.
- `manifest.json` generated by `tools/lib/governance-artifact-manifest.mjs` over the final artifact directory.

The manifest should cover at least `result.json` and `summary.md`. Whether it self-includes `manifest.json` should be explicitly versioned; initial implementation may omit self-inclusion to avoid circular digest ambiguity.

### Public-safety contract

The runner must block these from persistent outputs:

- absolute local paths,
- home-directory fragments,
- environment variable values,
- token-like values,
- raw synthesized hostile path strings,
- private user text,
- full stack traces unless reduced to stable code and public-safe location.

### Fixture-set contract

Minimum first executable fixture set:

1. `pass-minimal-file-set`: safe files produce manifest successfully.
2. `expected-failure-invalid-path`: symbolic invalid path is synthesized temp-only and reported as expected failure.
3. `unsafe-blocked-secretlike-value`: symbolic secretlike input is synthesized temp-only and blocked from persistent artifacts.
4. `schema-invalid-missing-required-field`: descriptor intentionally violates descriptor schema and is reported without leaking raw details.
5. `unexpected-failure-sentinel`: only active in sentinel mode; proves nonzero exit behavior.

## Design pattern added

### Pattern: Symbolic Negative Fixture Replay

Use when a governance helper must prove rejection behavior for unsafe input without committing unsafe examples.

Structure:

- Committed fixture: symbolic descriptor.
- Runtime: synthesize unsafe material inside temp workspace.
- Execution: invoke helper and normalize outcome.
- Persistence: store only redacted status and stable check codes.
- CI: upload replay artifacts, not raw generated inputs.

For MC, this pattern becomes the bridge between strong adversarial testing and public-safe repository hygiene.

## What changed in understanding

Before this pass, the runner was understood mainly as an executor for helper fixtures. After research, the better architecture is: the runner is a small public-safety compiler. It translates symbolic test intent into temporary concrete cases, then compiles the observed behavior back into a redacted governance event envelope. This keeps the repository safe while still proving that the helper rejects bad inputs.

The main distinction is that negative examples do not need to be durable; negative behavior does. MC should persist behavior evidence, not the raw hazardous material used to trigger that behavior.

## Implementation plan

1. Add a descriptor schema for helper replay fixtures.
2. Add the five minimal symbolic fixtures.
3. Implement the runner with temp-workspace synthesis and cleanup.
4. Add redaction scanning before any artifact is finalized.
5. Generate `result.json` first.
6. Generate `summary.md` only from `result.json`.
7. Generate `manifest.json` last using the shared manifest helper.
8. Add a thin GitHub Actions workflow that calls the runner in default mode.
9. Add a separate local-only or explicitly named sentinel command for nonzero exit proof.

## Acceptance checks

- Normal replay exits `0`.
- Sentinel replay exits `2` only when intentionally requested.
- No committed fixture contains raw unsafe strings.
- No output artifact contains raw temp path, secretlike value, or synthesized hostile string.
- `summary.md` can be posted to `GITHUB_STEP_SUMMARY` without further filtering.
- GitHub annotations are generated only from stable check codes and public-safe fixture IDs.
- `manifest.json` records emitted artifact paths, byte counts, SHA-256 digests, and generator identity.

## Next research question

How should MC define the symbolic fixture descriptor schema and the first five descriptor files so the runner has a typed, versioned input boundary before executable implementation begins?
