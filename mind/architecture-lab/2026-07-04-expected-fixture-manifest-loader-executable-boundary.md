# Expected fixture manifest loader executable boundary

Status: durable architecture note / prototype plan
Public-safety: public-safe; no private user material

## Architecture question

How should MC implement the first executable `tools/lib/expected-fixture-pair-manifest-loader.mjs` using Ajv draft-2020-12, injectable filesystem reads, normalized governance checks, and path-containment tests while keeping all absolute runtime paths out of public output?

## Answer

Implement the loader as a pre-I/O contract gate. It should accept only repository-relative public-safe manifest paths, read only the schema and manifest through injected readers, validate the manifest before any fixture bytes are read, normalize all validation failures into `GHF_*` governance checks, and return repository-relative resolved pair records for the later byte verifier.

The loader must not compare bytes. Its job is declaration custody: prove that the fixture-pair declaration is schema-valid, uses registered check codes, stays inside declared generated/expected roots, has unique pair identifiers, and can be safely handed to the byte-comparison stage.

## Useful concepts extracted from research

1. Draft 2020-12 must be isolated in its own Ajv instance. Ajv treats draft-2020-12 as incompatible with earlier JSON Schema versions in the same instance, so the loader should construct a dedicated validator for `governance.expected-fixture-pairs.v1.schema.json`.

2. Schema validation is necessary but not sufficient. JSON Schema can enforce object shape, enums, path-string patterns, required fields, and conditional requirements; code must still enforce registry membership, duplicate detection, root containment, and public output redaction.

3. Path containment must use normalized resolved paths internally, then discard absolute paths at the emission boundary. The loader may use absolute paths to prevent traversal, but returned checks and summaries must contain only repository-relative paths or JSON pointers.

4. GitHub Actions output is an attack and leakage surface. Any later annotations or summaries should be derived from normalized checks; do not echo raw Ajv errors, raw paths, event context, secrets, or host paths.

5. Recent agentic workflow research reinforces the need to treat workflow inputs, generated outputs, issue text, PR text, and agent-derived content as untrusted. The loader should not read fixture contents until declaration validity is proven.

## Loader API shape

```text
loadExpectedFixturePairManifest({
  repoRoot,
  schemaPath = 'mind/schemas/governance.expected-fixture-pairs.v1.schema.json',
  manifestPath = 'mind/fixtures/governance.expected-fixture-pairs.v1.json',
  readTextFile,
  pathAdapter,
  ajvFactory,
  checkRegistry
}) -> {
  ok,
  manifest?,
  pairs?,
  checks,
  diagnostics
}
```

Notes:

- `repoRoot` may be absolute internally, but must never be emitted.
- `readTextFile` is injectable so tests can prove failure ordering without touching the real filesystem.
- `pathAdapter` can default to Node `path`, but tests should inject a deterministic adapter where needed.
- `checkRegistry` defaults to `CHECK_CODES` from `governance-replay-checks.mjs`.
- `diagnostics` must be scalar and public-safe only.

## Required validation order

1. Normalize and containment-check `schemaPath` and `manifestPath` against `repoRoot`.
2. Read schema text.
3. Parse schema JSON.
4. Read manifest text.
5. Parse manifest JSON.
6. Validate manifest with a dedicated Ajv draft-2020-12 instance.
7. If invalid, return `GHF_MANIFEST_SCHEMA_INVALID` and stop before any fixture file reads.
8. Validate every pair check-code reference against `CHECK_CODES`.
9. Validate unique pair ids.
10. Validate generated paths are contained by `generated_root` and expected paths are contained by `expected_root`.
11. Return `GHF_MANIFEST_SCHEMA_VALID` plus normalized pair records.

## Pre-I/O failure rule

A manifest that fails schema validation, registry validation, duplicate-id validation, or root-containment validation must fail before generated or expected fixture file bytes are opened. Tests should prove this with an injected filesystem reader that records every attempted path.

Expected read set for invalid manifest cases:

```text
schema file
manifest file
```

Forbidden read set for invalid manifest cases:

```text
generated fixture file
expected fixture file
```

## Path safety contract

Accept repository-relative paths that already satisfy the schema pattern, then enforce containment with resolved paths.

Internal algorithm:

```text
repoAbsolute = resolve(repoRoot)
candidateAbsolute = resolve(repoAbsolute, relativePath)
contained = candidateAbsolute === repoAbsolute || candidateAbsolute starts with repoAbsolute + separator
```

Emission rule:

- public checks may include `location.path` as the original repository-relative path;
- public checks may include `location.jsonPointer` for schema validation errors;
- public checks must not include `candidateAbsolute`, `repoAbsolute`, current working directory, usernames, home directories, temp directories, or process environment values.

## Check mapping

Use these existing append-only check codes:

- `GHF_MANIFEST_SCHEMA_VALID` when the manifest passes schema and loader-level declaration validation.
- `GHF_MANIFEST_SCHEMA_INVALID` when schema validation, JSON parsing, registry validation, duplicate ids, or containment validation fail before fixture reads.
- `GHF_PAIR_MATCHED`, `GHF_PAIR_DRIFTED`, `GHF_PAIR_GENERATED_MISSING`, `GHF_PAIR_EXPECTED_MISSING`, and `GHF_UNLISTED_GENERATED_OUTPUT` are reserved for the later byte-comparison verifier, not the loader.

## Minimal tests

1. Valid manifest returns `ok: true`, one `GHF_MANIFEST_SCHEMA_VALID` check, normalized pair records, and no absolute paths.
2. Invalid JSON returns `ok: false`, one `GHF_MANIFEST_SCHEMA_INVALID` check, and no fixture reads.
3. Schema-invalid manifest returns `ok: false`, includes a JSON pointer, and no fixture reads.
4. Unknown check code returns `ok: false`, emits `GHF_MANIFEST_SCHEMA_INVALID`, and no fixture reads.
5. Duplicate pair id returns `ok: false`, emits `GHF_MANIFEST_SCHEMA_INVALID`, and no fixture reads.
6. Generated path outside `generated_root` returns `ok: false`, emits `GHF_MANIFEST_SCHEMA_INVALID`, and no fixture reads.
7. Expected path outside `expected_root` returns `ok: false`, emits `GHF_MANIFEST_SCHEMA_INVALID`, and no fixture reads.
8. Absolute runtime path redaction test: checks and diagnostics serialize without `/home/`, `/Users/`, `C:\\Users\\`, temp directories, or secret-like tokens.

## Prototype implementation plan

1. Create `tools/lib/expected-fixture-pair-manifest-loader.mjs`.
2. Import `createReplayCheck`, `createProblemCheck`, and `CHECK_CODES` from `tools/lib/governance-replay-checks.mjs`.
3. Import `Ajv2020` from `ajv/dist/2020.js`.
4. Implement `parseJsonPublicSafe(text, label)` that throws a public-safe parse error with no raw text echo.
5. Implement `resolveRepoRelative(repoRoot, relativePath)` that returns an internal absolute path and public relative path.
6. Implement `assertContained(parentRelative, childRelative, pointer)` for root containment.
7. Implement `validatePairRegistryReferences(pair, pointer)` for check-code references.
8. Implement `loadExpectedFixturePairManifest()` using the required validation order.
9. Add tests with injected file reads and path adapters before wiring the loader into the verifier.

## Non-goals

- No byte comparison.
- No update/bless mode.
- No GitHub annotation emission.
- No generated/expected fixture reads during loader validation.
- No private symbolic material or personal context in fixtures.

## Acceptance criteria

- A malformed or schema-invalid manifest cannot cause fixture reads.
- Returned output contains only public-safe scalar diagnostics and repository-relative paths.
- All check-code references are verified against the append-only registry.
- The loader can be tested without real filesystem access.
- The loader output is stable enough for the byte verifier to consume without re-validating declaration semantics.

## Next implementation target

Build the executable loader and tests, then wire the loader into `tools/compare-governance-expected-fixtures.mjs` as the first phase of verify-only fixture comparison.
