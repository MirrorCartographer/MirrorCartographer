# Byte verifier postwrite gate plan

Date: 2026-07-05
Status: design pattern / prototype plan
Public-safety level: public-safe; private material abstracted

## Architecture question

How should MC implement the expected-fixture byte verifier so it calls the compare-result validator as a postwrite gate, writes deterministic result JSON and Markdown summary, and fails CI when validation fails without duplicating schema validation logic?

## Current repo facts

- `package.json` already exposes `test:governance` and `verify:governance`, so the first verifier can join the existing governance validation lane instead of inventing another test surface.
- `package.json` already declares `ajv` as a dev dependency, but the verifier should not import Ajv directly. Schema custody already lives in `tools/governance-validation/validate-compare-result.mjs`.
- `validate-compare-result.mjs` exposes `validateCompareResult(...)`, loads the compare-result schema plus replay-check schema into Ajv2020, rejects non-repository-relative result paths, and returns public-safe validation reports.
- The compare-result schema defines the emitted custody document as a byte-comparison result, not provenance. It requires `comparison_policy`, `summary`, `pairs`, `checks`, and `public_safety`, and it constrains pair states/check codes such as `GHF_PAIR_MATCHED`, `GHF_PAIR_DRIFTED`, `GHF_PAIR_GENERATED_MISSING`, and `GHF_PAIR_EXPECTED_MISSING`.

## Research basis

- Node's `crypto.createHash()` returns a `Hash` object and is the appropriate native primitive for deterministic SHA-256 byte digests.
- Node's `fs.readdir` / `fsPromises.readdir` can list directories recursively, but the verifier should still normalize and sort repository-relative paths because filesystem traversal order is not the custody contract.
- GitHub Actions job summaries are Markdown written to `GITHUB_STEP_SUMMARY`; summaries are per-step, size-limited, and automatically mask secrets, but MC should still avoid placing secrets, absolute paths, or raw fixture bodies in the summary.
- SLSA provenance treats `subject` as build-output artifact identity. MC compare results must stay below that claim: they are custody comparison facts and may later feed provenance, but they are not provenance themselves.
- Recent agentic workflow-injection research makes a useful design constraint explicit: CI artifacts and summaries consumed by agents must be treated as public output surfaces, not private scratch space.

## Useful concepts extracted

### 1. Three-stage verifier boundary

The byte verifier should execute as three explicit stages:

1. **Input custody**: load the already-validated expected-fixture pair manifest. Do not reimplement manifest schema rules inside the verifier.
2. **Byte custody**: read only the listed generated/expected files and compute `{ sha256, size_bytes }` for each side.
3. **Schema custody**: write result JSON, call `validateCompareResult({ resultPath })`, then fail closed if the validator does not return `state: "passed"`.

The verifier owns byte facts. The validator owns schema facts.

### 2. Postwrite validation, not prewrite prediction

The verifier must validate the exact JSON file it wrote, not an in-memory object it intends to write. This catches serialization mistakes, path-format drift, missing properties, enum mismatches, and accidental unsafe output before CI treats the result as ingestible.

### 3. Deterministic output contract

The result writer should make output stable across machines:

- sort pairs by manifest order, then by pair id only if a stable fallback is required;
- sort unlisted generated outputs lexicographically by repository-relative POSIX path;
- use lowercase hex SHA-256;
- write final JSON with two-space indentation and a trailing newline;
- write Markdown from the validated result object, not from raw fixture bodies;
- never include absolute paths in result JSON, validation reports, annotations, or summaries.

### 4. Failure ordering

Recommended precedence:

1. manifest invalid or cannot be loaded;
2. listed pair missing generated file;
3. listed pair missing expected file;
4. generated output exists under generated root but is not listed in the manifest;
5. listed pair digest drift;
6. result JSON failed schema validation;
7. internal error.

This ordering protects the dashboard from ambiguous states. A run with unlisted generated output should not be reported as merely `failed_drift`.

### 5. Public-safe summary shape

The Markdown summary should report counts and repository-relative paths only:

- total pair count;
- matched/drifted/missing counts;
- unlisted generated output count;
- result JSON path;
- validation state;
- a bounded table of failing pair ids and repository-relative paths.

It must not include fixture contents, raw JSON bodies, absolute runner paths, environment variables, tokens, or private notes.

## Proposed file/API plan

### New executable

`tools/governance-validation/compare-governance-expected-fixtures.mjs`

Suggested CLI:

`node tools/governance-validation/compare-governance-expected-fixtures.mjs --manifest mind/fixtures/governance.expected-fixture-pairs.v1.json --result-out artifacts/governance/expected-fixture-compare-result.json --summary-out artifacts/governance/expected-fixture-compare-summary.md`

### Exported functions

- `compareExpectedFixtures({ repoRoot, manifestPath, resultOutPath, summaryOutPath })`
- `digestFile({ repoRoot, repoRelativePath })`
- `findUnlistedGeneratedOutputs({ repoRoot, generatedRoot, listedGeneratedPaths })`
- `writeCompareResult({ resultOutPath, result })`
- `writeCompareSummary({ summaryOutPath, result, validationReport })`

### Imports allowed

- `node:crypto` for SHA-256.
- `node:fs/promises` for read/stat/write/readdir/mkdir.
- `node:path` and `node:url` for containment and CLI detection.
- `./validate-compare-result.mjs` for the postwrite schema gate.
- Existing manifest loader, once present. Until then, the implementation should remain a plan rather than inventing manifest validation inside this verifier.

### Imports disallowed

- Ajv/Ajv2020 directly in the verifier.
- Child-process shell invocation for validation.
- Any semantic review modules.
- Any provenance writer.

## Result-state mapping

- All pairs matched and no unlisted outputs: `passed`.
- One or more digest mismatches: `failed_drift`.
- One or more generated files missing: `failed_missing`.
- One or more expected files missing: `failed_missing`.
- Any generated-root file not declared by manifest: `failed_unlisted_output`.
- Manifest loader failure: `failed_manifest_invalid`.
- Postwrite validator failure: fail CI and emit an internal validation report; do not publish the invalid result as dashboard-ingestible.

## Required tests before implementation is considered complete

1. matched pair writes schema-valid result and summary;
2. drifted pair emits `GHF_PAIR_DRIFTED` and fails process;
3. missing generated emits `GHF_PAIR_GENERATED_MISSING`;
4. missing expected emits `GHF_PAIR_EXPECTED_MISSING`;
5. unlisted generated output is detected and takes precedence over drift;
6. result JSON is validated after write by `validateCompareResult`, not by duplicated Ajv logic;
7. malformed postwrite result causes fail-closed process exit;
8. summary escapes Markdown table cells and does not emit raw fixture bodies;
9. absolute input/output paths are rejected or redacted before any public report is written;
10. deterministic JSON snapshot is stable across repeated runs.

## Implementation decision

Do not implement the byte verifier until the manifest loader exists as an executable interface. The next best GitHub artifact is this prototype plan because it locks the boundary between byte custody and schema custody without prematurely duplicating manifest validation.

## Next research question

How should MC implement the expected-fixture pair manifest loader interface so the byte verifier can consume a normalized manifest object, including manifest SHA-256, repository-relative roots, declared pair list, and canonical GHF check codes, without duplicating schema or path-containment logic?
