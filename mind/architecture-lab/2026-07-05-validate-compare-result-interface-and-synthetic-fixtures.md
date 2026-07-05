# Validate Compare Result Interface and Synthetic Fixtures

## Architecture question

How should MC define the minimal `validate-compare-result.mjs` interface and synthetic validation fixtures so the validator proves local `$id` reference resolution, public-safe diagnostics, and fail-closed behavior without touching expected/generated fixture bytes?

## Research answer

Build the validator as a governance-validation boundary with a tiny CLI/module surface, an explicit local schema bundle, and synthetic result fixtures that exercise schema reference resolution without invoking byte comparison.

The validator should prove that result JSON is dashboard-ingestible only after it satisfies the compare-result schema and the referenced replay-check schema. It must not become a fixture verifier, byte comparator, provenance generator, or GitHub Actions emitter.

## Useful concepts extracted

### 1. Compile schemas once behind a validation boundary

Ajv's schema-management guidance favors a single validation module that owns schema compilation and reuses validation functions. MC should use that shape: `tools/governance-validation/validate-compare-result.mjs` owns Ajv/Ajv2020 and compiled validators; `compare-governance-expected-fixtures.mjs` remains a deterministic writer.

Implementation implication:

- add Ajv only to the validator layer;
- do not import Ajv from the byte verifier;
- expose a small function such as `validateCompareResult({ repoRoot, resultPath })`;
- optionally expose a CLI wrapper for CI.

### 2. `$id` is an identifier, not permission to fetch remotely

The compare-result schema references `https://mirrorcartographer.dev/schemas/governance.replay.check.v1.schema.json`. JSON Schema 2020-12 defines identifiers and references, but retrieval behavior is implementation-dependent. MC should resolve known schema IDs from a local allowlist and never fetch schemas from the network in this path.

Minimum local bundle:

- `https://mirrorcartographer.dev/schemas/governance.expected-fixture-compare.result.v1.schema.json` -> `mind/schemas/governance.expected-fixture-compare.result.v1.schema.json`
- `https://mirrorcartographer.dev/schemas/governance.replay.check.v1.schema.json` -> `mind/schemas/governance.replay.check.v1.schema.json`

### 3. Synthetic fixtures should test validation semantics, not fixture bytes

Node's native test runner is already used by the GHF contract sentinel. The next test file should stay in `tools/governance-validation` and use tiny synthetic JSON documents created in temporary test directories. These documents should imitate compare-result outputs but never read the real expected/generated fixture roots.

Required synthetic cases:

1. **valid-minimal-pass**: one matched pair, one `GHF_PAIR_MATCHED` check, valid replay-check object.
2. **missing-required-field**: omit a top-level required property such as `public_safety`; validator fails closed.
3. **bad-referenced-check**: include a check with invalid `schema` or invalid `code` shape; proves referenced replay-check schema is active.
4. **absolute-path-leak**: include `/tmp/private/path` or a drive-prefixed path in a schema-constrained path field; validator fails and reports only repository-relative fixture name plus JSON Pointer.
5. **unknown-schema-ref-disabled**: temporarily request a non-allowlisted schema ID and prove the validator rejects it without network access.

### 4. Diagnostics are a public output surface

GitHub Actions job summaries and annotations are repository-visible output surfaces. The validator should return public-safe diagnostics, not raw JSON slices. Diagnostic shape should include:

- `state`: `passed` or `failed_schema_validation`;
- `schema_id`;
- `result_path`, repository-relative only;
- `error_count`;
- `errors`: bounded list of `{ instancePath, schemaPath, keyword, message }`;
- no raw fixture body;
- no absolute runtime path;
- no secret-like value;
- no private/person-identifying material.

### 5. Fail closed before dashboard ingestion

If the result JSON cannot be parsed, the schema cannot be loaded from the allowlist, a referenced schema is missing, or validation fails, the validator must return a failing status. The byte verifier can preserve its result file for debugging, but dashboard ingestion should consume only validator-passed results.

## Proposed interface

### Module

`tools/governance-validation/validate-compare-result.mjs`

Exports:

- `validateCompareResult({ repoRoot, resultPath, schemaBundle })`
- `createCompareResultValidator({ repoRoot, schemaBundle })`
- `DEFAULT_SCHEMA_BUNDLE`

Return value:

```json
{
  "schema": "governance.compare-result-validation.report.v1",
  "state": "passed",
  "schema_id": "https://mirrorcartographer.dev/schemas/governance.expected-fixture-compare.result.v1.schema.json",
  "result_path": "artifacts/governance/expected-fixture-compare-result.json",
  "error_count": 0,
  "errors": []
}
```

Allowed failing states:

- `failed_json_parse`
- `failed_schema_load`
- `failed_schema_validation`
- `failed_internal_error`

### CLI

Suggested CLI contract:

`node tools/governance-validation/validate-compare-result.mjs artifacts/governance/expected-fixture-compare-result.json`

Exit behavior:

- `0` when validation passes;
- `1` when validation fails closed;
- print only the public-safe validation report as JSON;
- never print the raw result body.

## Prototype test plan

Add:

`tools/governance-validation/validate-compare-result.test.mjs`

Test boundaries:

- uses `node:test` and `node:assert/strict`;
- uses temporary directories for synthetic result files;
- imports the validator module;
- reads only schema files from `mind/schemas`;
- never reads `mind/fixtures/governance.expected-fixture-pairs.v1.json`;
- never reads generated or expected fixture bytes;
- asserts that diagnostic paths are repository-relative and bounded.

## Requirements update

1. The compare-result validator must own Ajv/Ajv2020 use.
2. The byte verifier must not import Ajv in its first implementation.
3. Schema references must resolve only from a local `$id` allowlist.
4. The validator must not perform network retrieval.
5. Synthetic validation fixtures must not read or depend on expected/generated fixture bytes.
6. Diagnostics must be public-safe, bounded, and path-redacted to repository-relative form.
7. Validation failure must block dashboard ingestion.
8. The validator report should remain separate from `governance.replay.check.v1` unless a future schema explicitly promotes it.

## What changed in understanding

The next executable layer is not the byte verifier. It is a narrow schema-custody validator that proves the output envelope and nested check objects are valid before any dashboard or later provenance-adjacent system consumes them. This makes the compare pipeline layered:

1. GHF symbol sentinel proves code identity consistency.
2. Manifest loader proves declaration custody.
3. Byte verifier writes deterministic compare facts.
4. Postwrite validator proves schema custody.
5. Emitter/dashboard consumes only validator-passed results.

## Next research question

How should MC add Ajv/Ajv2020 as the smallest explicit dev dependency and implement `validate-compare-result.mjs` plus synthetic tests while keeping validator reports public-safe and separate from governance replay checks?

## Source anchors

- Ajv schema management and single-validator-module guidance: https://ajv.js.org/guide/managing-schemas.html
- JSON Schema 2020-12 identifier/reference behavior: https://json-schema.org/draft/2020-12/json-schema-core
- Node native test runner: https://nodejs.org/api/test.html
- GitHub Actions workflow commands, masking, and job summaries: https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-commands
- Modern JSON Schema validation complexity context: https://arxiv.org/abs/2307.10034
