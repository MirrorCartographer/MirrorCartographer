# Artifact Manifest Helper Runner Implementation Contract

Date: 2026-07-04
Status: proposed durable architecture note
Public-safety class: public-safe / abstracted / no private user material

## Architecture question

How should MC implement `tools/replay-governance-artifact-manifest-helper-fixtures.mjs` so it validates symbolic descriptors, synthesizes temp-only cases, emits normalized replay-result envelopes, creates redacted summaries, writes `manifest.json`, and preserves stable default-vs-sentinel exit behavior across all five descriptor classes?

## Research basis

Current-source review focused on executable boundaries, CI safety, and artifact custody:

1. Node filesystem primitives support temporary workspace creation and cleanup. The runner can use `fsPromises.mkdtemp` for isolated synthesis and `fsPromises.rm` for cleanup instead of committing raw negative examples.
2. Node path and crypto APIs provide the deterministic implementation primitives: normalized path handling and SHA-256 byte digest generation.
3. GitHub Actions workflow commands support annotations, masking, and job summaries. MC should generate annotations and summaries from normalized replay checks, not raw runtime exceptions or synthesized unsafe strings.
4. JSON Schema 2020-12 defines structured validation and output concepts. MC should validate descriptors and result envelopes before persistent artifacts become authoritative.
5. SLSA provenance models output subjects through names and digest maps. MC should treat `result.json`, `summary.md`, and `manifest.json` as custody subjects with stable byte counts and SHA-256 digests.
6. Recent GitHub Actions research on agentic workflow injection strengthens the rule that CI must not pass untrusted event text into scripts, prompts, summaries, or annotations without normalization and redaction.

Sources consulted:

- Node.js filesystem documentation, including `fsPromises.mkdtemp` and `fsPromises.rm`: https://nodejs.org/api/fs.html#fspromisesmkdtempprefix-options
- Node.js path normalization documentation: https://nodejs.org/api/path.html#pathnormalizepath
- Node.js crypto hash documentation: https://nodejs.org/api/crypto.html#cryptocreatehashalgorithm-options
- GitHub Actions workflow commands, annotations, masking, and job summaries: https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-commands
- JSON Schema 2020-12 core: https://json-schema.org/draft/2020-12/json-schema-core
- SLSA provenance v1.0 subject/digest model: https://slsa.dev/spec/v1.0/provenance
- Wang et al., 2026, “Demystifying and Detecting Agentic Workflow Injection Vulnerabilities in GitHub Actions”: https://arxiv.org/abs/2605.07135
- Valenzuela-Toledo et al., 2024, “The Hidden Costs of Automation: An Empirical Study on GitHub Actions Workflow Maintenance”: https://arxiv.org/abs/2409.02366

## Useful concepts extracted

### 1. The runner is a boundary compiler

The runner should not be a general test harness. It should compile typed symbolic descriptors into temporary concrete cases, run the manifest helper, and compile observed behavior back into a public-safe replay event.

Boundary map:

- Input boundary: committed symbolic descriptors.
- Synthesis boundary: temp-only generated concrete files and bad cases.
- Execution boundary: helper invocation and observed behavior.
- Persistence boundary: normalized `result.json`, redacted `summary.md`, and digest-bearing `manifest.json`.
- CI boundary: annotations and job summary derived only from persistent public-safe artifacts.

### 2. Descriptor validation must occur before synthesis

The runner should validate every descriptor before it creates any concrete runtime input. Invalid descriptors should produce a schema-invalid fixture result, not a partial temp workspace that can leak details.

Required behavior:

- Valid descriptors enter synthesis.
- Invalid descriptors become normalized `schema_invalid` events.
- Invalid descriptor details are reduced to stable check codes and schema paths.
- No raw invalid descriptor body is copied into summaries or annotations.

### 3. Synthesis must be table-driven and closed-world

The runner should implement a closed mapping from symbolic input to concrete temp-only material. It should reject unknown symbols before synthesis.

Initial symbolic mapping:

- `SAFE_MINIMAL_FILE_SET` -> create a tiny safe directory with one or two deterministic UTF-8 files.
- `SYMBOLIC_PATH_ESCAPE` -> synthesize a traversal-like path only inside temp space; persist only the symbol and check code.
- `SYMBOLIC_SECRETLIKE_VALUE` -> synthesize a token-shaped value only inside temp space; persist only a redacted label.
- `SYMBOLIC_SCHEMA_MISSING_REQUIRED_FIELD` -> produce a descriptor-shape failure without copying raw descriptor text.
- `SYMBOLIC_UNEXPECTED_FAILURE_SENTINEL` -> trigger the intentional sentinel path only when the runner mode allows it.

### 4. Result envelope is the source of truth

`result.json` should be written first and should be the only source for `summary.md`, CI annotations, and manifest metadata.

The envelope should include:

- `schema_version`.
- `tool_name` and `tool_version`.
- `run_mode`: `default` or `sentinel-unexpected-failure`.
- `overall_status`: `pass`, `failed`, `schema_invalid`, `unsafe_blocked`, or `sentinel_failed_as_expected`.
- `public_safety_status`: `passed` or `blocked`.
- `fixtures`: array of normalized fixture outcomes.
- `checks`: normalized check objects with stable codes.
- `artifacts`: relative paths for emitted files.

### 5. Redaction scanning is an invariant, not a best effort

The runner should scan every persistent output before final success. It should block finalization if output contains absolute paths, home-directory fragments, environment variable values, token-like strings, raw synthesized hostile strings, raw temp directory names, or stack traces.

If scanning fails:

- `result.json` should record `public_safety_status: blocked` if it can be safely written.
- `summary.md` should state only that public-safety blocking occurred.
- Exit code should be `1` unless the runner failed before a safe envelope could be written, in which case exit code should be `3`.

### 6. Exit behavior must separate default governance from sentinel proof

Default mode should prove normal contract behavior. Sentinel mode should intentionally prove that unexpected-failure handling returns a stable nonzero code.

Exit map:

- `0`: all default-mode fixtures behaved as expected and artifacts passed schema and redaction.
- `1`: default-mode fixture mismatch, schema-invalid envelope, unsafe persistence, or manifest failure.
- `2`: sentinel mode successfully produced the intentional unexpected-failure proof.
- `3`: infrastructure failure before a valid public-safe envelope could be written.

## Requirements update

### CLI contract

`tools/replay-governance-artifact-manifest-helper-fixtures.mjs` should accept:

- `--fixtures <dir>`: directory of descriptor JSON files.
- `--out <dir>`: artifact output directory.
- `--mode default|sentinel-unexpected-failure`, default `default`.
- `--ci-annotations auto|off`, default `auto`.
- `--summary-format markdown`, initially the only supported format.
- `--strict-public-safety true|false`, default `true`; false should be local-debug only and must never be used by CI.

### Processing contract

For each descriptor:

1. Read descriptor bytes.
2. Validate descriptor schema.
3. Convert descriptor validity into a fixture lifecycle state.
4. For valid descriptors, create an isolated temp workspace.
5. Synthesize concrete input from the descriptor symbol through a closed mapping.
6. Invoke `tools/lib/governance-artifact-manifest.mjs` directly as a module or through a narrow function boundary.
7. Normalize helper output or error into stable check codes.
8. Compare actual status and check codes with expected descriptor status and codes.
9. Delete temp workspace in a `finally` path.
10. Append only public-safe fixture outcome to the replay envelope.

### Artifact contract

The runner writes one artifact directory:

- `result.json`: authoritative replay envelope.
- `summary.md`: redacted human summary generated from `result.json` only.
- `manifest.json`: digest inventory for `result.json` and `summary.md`; self-inclusion must remain explicitly versioned and may be deferred to avoid circular digest ambiguity.

### Annotation contract

GitHub annotations should be generated only from:

- fixture id,
- normalized check code,
- public-safe short message,
- committed descriptor file path when safe.

Annotations must not include:

- raw synthesized input,
- raw exception text,
- local temp path,
- environment values,
- full stack trace,
- private user text.

### CI contract

The future workflow should be thin:

1. Check out the repository with least privilege.
2. Run the replay tool in default mode.
3. Upload the artifact directory.
4. Append `summary.md` to the job summary.
5. Let the tool’s exit code decide pass/fail.

CI should not duplicate fixture semantics, redaction logic, path constants, manifest generation, or annotation mapping.

## Design pattern added

### Pattern: Descriptor-to-Event Governance Compiler

Use this when MC needs durable evidence of unsafe-input handling without making unsafe examples durable.

Pattern stages:

1. Store typed symbolic intent.
2. Generate concrete negative material only in temp space.
3. Run the domain helper.
4. Collapse observations into stable codes.
5. Redact before persistence.
6. Digest emitted artifacts.
7. Let CI display only the redacted event.

This preserves adversarial coverage while keeping the public repository safe and reviewable.

## What changed in understanding

Before this pass, the runner could be understood as the next executable script in the fixture chain. The stronger architecture is that the runner is a custody-preserving compiler: it transforms symbolic test intent into temporary evidence and then into durable, redacted governance facts.

The key shift is that MC should not treat redaction as an output filter. Redaction must be part of the state machine. The runner is only successful when unsafe material was never allowed to cross from the synthesis boundary into the persistence boundary.

## Prototype plan

1. Create `tools/replay-governance-artifact-manifest-helper-fixtures.mjs`.
2. Import or wrap `tools/lib/governance-artifact-manifest.mjs` through a narrow function API.
3. Add a descriptor loader that records source path and bytes but never emits raw bytes to summaries.
4. Add a minimal JSON Schema validator path for descriptors and replay result envelopes.
5. Add a closed `input_symbol` synthesizer table.
6. Add temp workspace lifecycle using `mkdtemp` and cleanup with recursive removal.
7. Add normalized check-code mapping.
8. Add public-safety scanner before final artifact success.
9. Write `result.json`.
10. Generate `summary.md` from the result envelope.
11. Generate `manifest.json` last.
12. Add local commands for default and sentinel modes.
13. Add CI only after local deterministic behavior is proven.

## Acceptance checks

- Default replay exits `0` with all five descriptor classes handled safely, excluding sentinel-only execution unless explicitly requested.
- Sentinel mode exits `2` only for the intentional unexpected-failure proof.
- Invalid descriptors produce normalized schema-invalid fixture events.
- Unsafe symbolic inputs are synthesized only in temp workspaces.
- Temp workspace paths never appear in persistent artifacts.
- `summary.md` contains no more detail than `result.json`.
- `manifest.json` records stable paths, byte counts, SHA-256 digests, and generator identity.
- GitHub annotations contain only fixture ids, safe source paths, stable codes, and redacted short messages.

## Next research question

How should MC design the replay result envelope state machine and normalized check-code taxonomy so descriptor validation, helper execution, public-safety blocking, manifest generation, and sentinel behavior all produce stable, dashboard-ingestible statuses without exploding into ad hoc error strings?
