# Expected Fixture Byte Verifier Implementation Contract

## Architecture question

How should MC implement the actual expected-fixture byte verifier so it consumes the already-validated manifest, computes deterministic SHA-256 digests, emits schema-aligned `GHF_*` checks, rejects unlisted generated outputs, and writes result JSON plus Markdown summary without duplicating the GHF contract test or manifest-loader logic?

## Public-safe scope

This note contains no private personal material, no raw fixture bodies, no absolute runtime paths, and no secret values. It treats fixtures as public API custody surfaces only.

## Finding

The verifier should be a byte-custody layer between declaration validation and dashboard ingestion. Its responsibility is not to decide whether generated content is semantically correct. Its responsibility is to prove whether the files intentionally declared by the manifest are byte-identical to their expected fixtures, whether any declared file is missing, and whether generated output exists outside the manifest boundary.

The verifier should therefore be implemented as a small orchestration tool with four strict phases:

1. Load an already validated manifest through `loadExpectedFixturePairManifest()`.
2. Read bytes only for manifest-approved pair paths and generated-root output inventory.
3. Produce deterministic pair results, unlisted-output results, and normalized `GHF_*` checks.
4. Write schema-aligned result JSON and escaped Markdown summary.

## Current repository constraints

- `package.json` already exposes `test:governance` and `verify:governance`, so this verifier can join governance validation without introducing a new validation namespace.
- `mind/fixtures/governance.expected-fixture-pairs.v1.json` declares three public-safe fixture pairs under generated and expected roots.
- `mind/schemas/governance.expected-fixture-compare.result.v1.schema.json` already constrains the result envelope, pair states, digest shape, public-safety flags, and canonical `GHF_*` names.
- `tools/governance-validation/ghf-check-code-contract.test.mjs` is only a symbol-consistency sentinel. The verifier must not duplicate its cross-surface checks.

## Research concepts extracted

### Stable digest semantics

Use Node's built-in `crypto` module with `sha256` and hex output for file byte digests. The digest should be computed from raw bytes, not parsed JSON or normalized Markdown. For determinism, each file digest record should contain only:

- `sha256`
- `size_bytes`

No absolute path, file body, local mtime, inode, user, hostname, or transient runner metadata should enter the result.

### Repository-relative path custody

The manifest and compare-result schema both use repository-relative paths. The verifier should preserve that boundary:

- Accept only repository-relative manifest paths after loader validation.
- Resolve paths internally for reads.
- Emit only repository-relative paths.
- Treat path containment as loader territory, not comparator territory, unless the comparator is defending its generated-root inventory walk.

### Generated-root inventory without new dependency

Because the project currently avoids adding extra dependencies for this layer, generated-output inventory should use Node filesystem primitives. Do not rely on shell `find` output because ordering, quoting, and platform behavior are easier to destabilize. The inventory function should:

- recursively walk `generated_root`,
- include files only,
- sort repository-relative paths lexicographically,
- ignore directories,
- compare the result set against manifest-declared generated paths.

### Check-code emission map

The verifier should convert states to canonical registry-backed check codes:

| Condition | Pair state / output state | Check code |
|---|---|---|
| generated and expected exist and sha256 matches | `matched` | `GHF_PAIR_MATCHED` |
| generated and expected exist and sha256 differs | `drifted` | `GHF_PAIR_DRIFTED` |
| generated missing | `missing_generated` | `GHF_PAIR_GENERATED_MISSING` |
| expected missing | `missing_expected` | `GHF_PAIR_EXPECTED_MISSING` |
| generated output not declared by manifest | unlisted output | `GHF_UNLISTED_GENERATED_OUTPUT` |
| manifest loader rejects declaration | result-level failure | `GHF_MANIFEST_SCHEMA_INVALID` or related loader code |

The pair-level code should come from the pair's declared `on_*_check_code` fields, not from a hardcoded parallel table, so the manifest remains the custody declaration.

### Result-state precedence

Result state should be derived deterministically using ordered precedence:

1. `failed_manifest_invalid`
2. `failed_unlisted_output`
3. `failed_missing`
4. `failed_drift`
5. `failed_internal_error`
6. `passed`

The implementation should never emit `passed` if any check has failure severity.

### Markdown summary boundary

The Markdown summary is a review surface, not an evidence surface. It should be escaped GitHub-flavored Markdown with no raw fixture body and no HTML. It should include:

- result state,
- manifest id,
- pair counts,
- drift/missing/unlisted counts,
- a compact table of repository-relative paths and check codes,
- pointer to the JSON result file as the machine-readable authority.

### CI output safety

GitHub Actions summaries and annotations are useful human surfaces, but they are also workflow output surfaces. The verifier should avoid interpolating untrusted fixture bodies or raw generated content into summaries or annotations. It should write only bounded metadata and repository-relative paths.

## Implementation contract

### Proposed files

- `tools/governance-validation/compare-governance-expected-fixtures.mjs`
- `tools/lib/expected-fixture-byte-compare.mjs`
- `tools/governance-validation/expected-fixture-byte-compare.test.mjs`
- `artifacts/governance-validation/expected-fixture-compare-result.json` generated by script, not committed unless intentionally fixture-promoted
- `artifacts/governance-validation/expected-fixture-compare-summary.md` generated by script, not committed unless intentionally fixture-promoted

### Script interface

The script should support explicit arguments with deterministic defaults:

- `--manifest mind/fixtures/governance.expected-fixture-pairs.v1.json`
- `--result-out artifacts/governance-validation/expected-fixture-compare-result.json`
- `--summary-out artifacts/governance-validation/expected-fixture-compare-summary.md`

It should exit nonzero for drift, missing files, unlisted generated output, manifest invalidity, or internal errors. It should set `process.exitCode`, not call `process.exit()` from deep library code.

### Library responsibilities

`tools/lib/expected-fixture-byte-compare.mjs` should export pure-ish functions with injectable filesystem operations where useful:

- `sha256Bytes(buffer)`
- `digestFile(readFile, repoRoot, repositoryRelativePath)`
- `inventoryGeneratedOutputs(fsAdapter, repoRoot, generatedRoot)`
- `compareExpectedFixturePairs(validatedManifest, options)`
- `buildExpectedFixtureCompareResult(compareModel, options)`
- `renderExpectedFixtureCompareSummary(result)`

### Non-responsibilities

The byte verifier must not:

- bless/update expected fixtures,
- parse fixture semantics,
- infer fixture pairs from directory shape,
- invent new `GHF_*` codes,
- validate the entire JSON Schema itself unless the manifest loader/result writer explicitly owns that boundary,
- emit absolute runtime paths,
- include raw fixture body snippets,
- claim SLSA provenance.

## Minimal test plan

1. Matched pair fixture: same bytes produce `matched`, `GHF_PAIR_MATCHED`, matching digests, and passed summary counts.
2. Drift fixture: different bytes produce `drifted`, `GHF_PAIR_DRIFTED`, and `failed_drift` result state.
3. Missing generated: expected exists, generated missing produces `missing_generated`, `GHF_PAIR_GENERATED_MISSING`, and `failed_missing`.
4. Missing expected: generated exists, expected missing produces `missing_expected`, `GHF_PAIR_EXPECTED_MISSING`, and `failed_missing`.
5. Unlisted generated output: generated-root inventory contains an undeclared file and result state becomes `failed_unlisted_output`.
6. Public-safe output: result and summary contain no absolute temp path and no fixture body substring.
7. Deterministic ordering: pair results and unlisted outputs are sorted by manifest order first, then path order for inventory-only findings.

## Durable decision

Implement the verifier as a deterministic byte-custody orchestrator that consumes the manifest loader output and emits a compare-result document. Keep semantic validation, fixture blessing, provenance generation, and dashboard interpretation as separate layers.

## Next research question

How should MC validate the compare-result JSON after writing it, given that the schema references `governance.replay.check.v1.schema.json`, without forcing the first byte verifier to import Ajv or reimplement full schema resolution?