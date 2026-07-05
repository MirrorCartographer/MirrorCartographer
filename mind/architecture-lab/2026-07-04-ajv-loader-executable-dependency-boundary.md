# Ajv loader executable dependency boundary

Date: 2026-07-04

## Architecture question researched

How should MC add Ajv as an explicit development dependency and implement the first executable expected-fixture pair manifest loader plus tests without changing the fixture comparison contract?

## Public-safe decision

Treat the expected-fixture manifest loader as a small declaration-custody boundary. Its first implementation should validate the manifest declaration before reading any generated or expected fixture bytes. The loader should not compare fixture contents yet, should not write update/bless output, and should not leak absolute runtime paths into public result objects.

## Current repo observation

`package.json` does not currently declare Ajv. Because the manifest schema targets JSON Schema draft 2020-12, Ajv must be added intentionally rather than assumed transitively. The implementation should use the Ajv 2020 class in the loader or inject it from tests, but the durable repo contract should prefer an explicit dev dependency.

## Useful concepts extracted

1. **Draft isolation**
   - Ajv treats draft 2020-12 as not backwards-compatible with earlier JSON Schema drafts.
   - The loader should create/use an Ajv 2020 validator for the expected-fixture manifest schema only.
   - Do not mix draft-07, 2019-09, and 2020-12 schemas in one validator instance unless deliberately supported.

2. **Schema validation is necessary but not sufficient**
   - JSON Schema validates structure, required fields, enums, and declared patterns.
   - It should not be treated as the whole security boundary for repository path safety.
   - After schema validation, perform registry validation and root-containment validation in code.

3. **Pre-I/O failure ordering**
   - Load manifest JSON.
   - Parse JSON.
   - Validate against `governance.expected-fixture-pairs.v1.schema.json`.
   - Validate every check code against the governance replay check registry.
   - Normalize and containment-check every generated and expected path under allowed repo roots.
   - Only after those checks may the verifier read fixture bytes.

4. **Path custody**
   - Normalize to POSIX-style repository-relative paths for public output.
   - Use resolved absolute paths internally only.
   - Reject absolute paths, empty paths, drive-letter paths, backslash paths, `..` traversal, and paths whose resolved form escapes the allowed root.

5. **Public output redaction**
   - Result checks may include schema pointer, manifest pair id, check code, and sanitized repo-relative path.
   - Result checks must not include local workspace paths, environment variable values, usernames, temp directories, or raw exception stacks.

6. **No update mode in the first loader**
   - The first executable boundary should only prove declaration custody.
   - Any later fixture update/bless mode should be a separate, manual, CI-blocked command with explicit human intent.

## Proposed implementation plan

### Dependency update

Add Ajv to `devDependencies`:

- `ajv`: pinned or semver-compatible v8 line.

Add scripts only after the loader and tests exist:

- `test:expected-fixtures`: `node --test tools/lib/expected-fixture-pair-manifest-loader.test.mjs`

### New module

`tools/lib/expected-fixture-pair-manifest-loader.mjs`

Exports:

- `loadExpectedFixturePairManifest(options)`
- `validateExpectedFixturePairManifest(options)`
- `normalizeRepoRelativePath(pathValue)`
- `resolveContainedRepoPath({ repoRoot, allowedRoot, repoRelativePath })`

Required injected options:

- `repoRoot`
- `manifestPath`
- `schemaPath`
- `readTextFile`
- `checkRegistry`
- optional `createAjv2020`

Return shape:

- `{ ok: true, manifest, pairs, checks: [] }`
- `{ ok: false, manifest: null, pairs: [], checks }`

Checks should use existing `GHF_*` expected-fixture check codes and stable governance check normalization.

### Minimal tests

`tools/lib/expected-fixture-pair-manifest-loader.test.mjs`

Required cases:

1. Valid minimal manifest returns `ok: true` and normalized pair paths.
2. Invalid JSON fails before schema validation and before fixture reads.
3. Schema-invalid manifest fails before registry validation and before fixture reads.
4. Unknown check code fails after schema validation and before path reads.
5. Path traversal fails containment checks.
6. Absolute path fails containment checks.
7. Backslash path fails path normalization.
8. Public checks do not include absolute repo root or temp directory fragments.

## Durable boundary statement

The expected-fixture loader is not a comparator. It is the gate that converts a manifest from untrusted JSON text into a schema-valid, registry-valid, repo-contained fixture-pair declaration. Byte comparison should depend on this loader, not duplicate its validation rules.

## Next implementation target

Create the loader module and tests, then update `package.json` with Ajv and a test script. Keep the fixture-comparison contract unchanged: no update mode, no directory inference, no generated/expected byte reads until declaration custody passes.

## Next research question

How should MC design the first byte-comparison verifier around the validated manifest pairs so it computes stable SHA-256 digests, emits deterministic `GHF_PAIR_MATCH` / `GHF_PAIR_DRIFT` checks, rejects unlisted generated outputs, and writes public-safe summaries without duplicating loader validation logic?
