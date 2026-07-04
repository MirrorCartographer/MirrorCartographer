# Expected Fixture Manifest Loader Validation Tests

Date: 2026-07-04
Status: architecture-lab note
Public-safety: public-safe; no private user material

## Architecture question

How should MC implement `loadExpectedFixturePairManifest()` and its minimal validation tests so schema validation, registry validation, root containment checks, and pre-I/O failure ordering are provable before byte comparison logic is added?

## Current repo context

The repository already contains:

- `mind/schemas/governance.expected-fixture-pairs.v1.schema.json`, which declares a public-safe expected-vs-generated fixture pair manifest with repository-relative roots, explicit pair paths, fixed `unexpected_output_policy: "reject"`, and verify-only update policy.
- `mind/fixtures/governance.expected-fixture-pairs.v1.json`, which declares the first three intentional public API fixture pairs for dry-run replay output.
- `tools/lib/governance-replay-checks.mjs`, which now includes the `GHF_*` expected-fixture check codes.

The missing durable boundary is not byte comparison yet. The missing boundary is a loader that turns a manifest file into a validated, normalized, public-safe declaration and refuses to read generated or expected fixture bytes until the declaration itself is safe.

## Research basis

Current sources reviewed:

- JSON Schema 2020-12 core: validation outputs are intended to be platform-independent, and consumers need a standard minimum output shape to interpret validation results.
- JSON Schema 2020-12 validation vocabulary: schemas are assertion contracts, not merely documentation.
- Ajv documentation: draft 2020-12 is not backward-compatible with earlier drafts and needs the draft-2020-12 Ajv class rather than sharing a validator instance with older drafts.
- Node.js filesystem documentation: `fs.readFile()` reads entire file contents, returns raw bytes when no encoding is supplied, and directory read behavior has platform-specific edge cases.
- Node.js path documentation: `path.resolve()` produces absolute normalized paths; `path.relative()` can expose containment escapes through `..`-prefixed results; `path.sep` differs by platform.
- GitHub Actions workflow command documentation: logs, summaries, annotations, and masks are active emission surfaces, so loader failures must emit normalized public-safe checks rather than raw exception strings.
- Recent 2025-2026 JSON Schema research: compiled or normalized validation can improve correctness/performance, but MC should first keep the loader small, fixed-schema, and audit-friendly before optimizing.

## Useful concepts extracted

### 1. Loader as gate, not helper

`loadExpectedFixturePairManifest()` should be treated as a governance gate. Its first job is to decide whether the manifest may authorize any further fixture reads. It should not compare bytes, scan generated directories, write summaries, or update fixtures.

### 2. Four validation layers

The loader needs four ordered validation layers:

1. **JSON parse validation** — reject malformed JSON before schema validation.
2. **Schema validation** — validate against `governance.expected-fixture-pairs.v1.schema.json` using a draft-2020-12 validator.
3. **Registry validation** — verify every declared check code is present in `CHECK_CODES`, and verify each declared pair uses the expected fixture compare codes.
4. **Root containment validation** — resolve each root and pair path against the repository root, then prove every generated path is under `generated_root` and every expected path is under `expected_root`.

Only after all four pass may the verifier read `generated_path` or `expected_path` bytes.

### 3. Pre-I/O failure ordering

The loader must separate declaration reads from fixture reads:

Allowed before validation passes:

- Read manifest JSON.
- Read schema JSON.
- Import the check-code registry.

Forbidden before validation passes:

- Read generated fixture files.
- Read expected fixture files.
- Scan generated output directories.
- Compute generated/expected byte hashes.
- Emit drift/match checks.

This ordering is testable by injecting a filesystem adapter that records attempted file reads.

### 4. Stable normalized return object

The loader should return a frozen object shaped for later verifier use:

- `manifest`: parsed manifest object.
- `manifestPath`: repository-relative manifest path.
- `repositoryRoot`: absolute resolved root, not emitted in public summaries.
- `generatedRootAbs`: absolute generated root, private runtime-only.
- `expectedRootAbs`: absolute expected root, private runtime-only.
- `pairs`: normalized pair records containing public relative paths plus private absolute paths.
- `checks`: normalized checks created during loading.

Public summaries should use repository-relative paths only. Absolute paths must not leave the process.

### 5. Path containment rule

Use a containment predicate equivalent to:

1. Resolve repository root once.
2. Resolve candidate path against repository root.
3. Compute `path.relative(rootAbs, candidateAbs)`.
4. Reject if the relative result is empty only when a file is expected, starts with `..`, or is absolute.
5. Normalize emitted paths to POSIX-style `/` separators.

This protects against path traversal, accidental absolute paths, and Windows-vs-POSIX separator drift.

### 6. Check-code semantics

Recommended loader check mapping:

- Manifest parse error: `GHF_MANIFEST_SCHEMA_INVALID`.
- Schema validation failure: `GHF_MANIFEST_SCHEMA_INVALID`.
- Unknown pair check code: `GHF_MANIFEST_SCHEMA_INVALID` for v1, because an unregistered code means the declaration cannot be trusted.
- Root containment escape: `GHF_MANIFEST_SCHEMA_INVALID` for v1, because the manifest has passed JSON Schema syntax but failed the stronger execution contract.
- Successful validation: `GHF_MANIFEST_SCHEMA_VALID`.

Future versions may split registry and containment codes, but v1 should avoid expanding the taxonomy until actual verifier failure cases prove the need.

## Proposed implementation shape

Add a small loader module, preferably:

`tools/lib/expected-fixture-pair-manifest-loader.mjs`

Exports:

- `loadExpectedFixturePairManifest(options)`
- `assertPathContained({ repositoryRoot, rootPath, candidatePath, kind })`
- `normalizeRepositoryPath(pathValue)`

`loadExpectedFixturePairManifest(options)` accepts:

- `repositoryRoot` — default `process.cwd()`.
- `manifestPath` — default `mind/fixtures/governance.expected-fixture-pairs.v1.json`.
- `schemaPath` — default `mind/schemas/governance.expected-fixture-pairs.v1.schema.json`.
- `readTextFile` — injectable async function for tests.
- `checkCodes` — default `CHECK_CODES`.
- `createCheck` — default `createReplayCheck`.

The loader should not import or call the future byte comparator.

## Minimal validation tests

Add tests before byte-comparison logic exists:

1. **valid-minimal-manifest-loads**
   - Given the checked-in minimal manifest, loader returns normalized pairs and one `GHF_MANIFEST_SCHEMA_VALID` check.
   - No generated or expected fixture file is read.

2. **malformed-json-fails-before-fixture-reads**
   - Given invalid JSON, loader returns/throws a public-safe failure mapped to `GHF_MANIFEST_SCHEMA_INVALID`.
   - Read log contains only manifest and schema reads, depending on implementation ordering.

3. **schema-invalid-fails-before-fixture-reads**
   - Remove `pairs` or change `unexpected_output_policy` from `reject`.
   - Loader fails before any declared fixture read.

4. **unknown-check-code-fails-before-fixture-reads**
   - Change `on_match_check_code` to `GHF_FAKE_CODE`.
   - Loader fails before fixture reads.

5. **generated-path-outside-root-fails-before-fixture-reads**
   - Use a schema-valid repository-relative path that is outside `generated_root` but inside the repo.
   - Loader fails before fixture reads.

6. **expected-path-outside-root-fails-before-fixture-reads**
   - Same for `expected_path` vs `expected_root`.

7. **absolute-path-never-emitted**
   - Force a failure and assert Markdown/result-safe details include only repository-relative paths and public-safe check codes.

## Acceptance criteria

The loader is acceptable when:

- It validates with a draft-2020-12 validator.
- It emits normalized checks, not raw thrown errors.
- It proves invalid manifests fail before generated/expected fixture bytes are read.
- It keeps absolute paths runtime-private.
- It returns deterministic pair ordering exactly as declared by the manifest.
- It is small enough to audit without understanding the future comparator.

## What this changes in understanding

Expected-fixture verification should be built in two separate phases:

1. **Declaration custody** — prove the manifest is schema-valid, registry-valid, path-contained, and public-safe.
2. **Byte custody** — compare generated and expected bytes only after the declaration custody gate passes.

This prevents the verifier from accidentally turning malformed or hostile manifest content into file-system authority.

## Next research question

How should MC implement the first executable `tools/lib/expected-fixture-pair-manifest-loader.mjs` using Ajv draft-2020-12, injectable filesystem reads, normalized governance checks, and path-containment tests while keeping all absolute runtime paths out of public output?
