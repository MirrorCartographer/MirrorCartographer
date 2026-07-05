# Expected fixture pair manifest loader interface contract

Date: 2026-07-05
Status: design pattern / executable interface contract
Public-safety level: public-safe; private material abstracted

## Architecture question

How should MC implement the expected-fixture pair manifest loader interface so the byte verifier can consume a normalized manifest object, including manifest SHA-256, repository-relative roots, declared pair list, and canonical `GHF_*` check codes, without duplicating schema or path-containment logic?

## Current repo facts

- `package.json` now declares `ajv` as a dev dependency and exposes `test:governance` / `verify:governance`, so the loader can use the same governance validation lane instead of creating another validation surface.
- `tools/governance-validation/validate-compare-result.mjs` already uses `Ajv2020`, loads local schemas by `$id`, rejects non-repository-relative paths, and redacts public diagnostics. The loader should reuse the same safety vocabulary but must not call the compare-result validator.
- `governance.expected-fixture-compare.result.v1.schema.json` expects the later compare result to include manifest metadata, including `schema_version`, `manifest_id`, `path`, `generated_root`, `expected_root`, and optional `manifest_sha256`.
- The byte verifier plan says implementation should wait until the manifest loader exists, because the verifier must consume normalized declarations and avoid owning manifest schema/path logic.

## Research basis

- Node path behavior is platform-sensitive; `path.relative(from, to)` computes a relative path after resolving both inputs, and `path.resolve(...)` constructs normalized absolute paths. This supports a containment check based on resolved root plus `relative` result, not string prefix matching.
- Ajv draft-2020-12 must use the draft-2020-12 Ajv class and cannot be mixed with previous JSON Schema drafts in the same Ajv instance. The manifest loader should therefore own an isolated `Ajv2020` instance for the manifest schema.
- Ajv treats schema `$id` values as schema identifiers/cache keys; a URI-shaped `$id` is not permission to fetch over the network. The loader should add local schema files explicitly and verify `$id` equality before compilation.
- GitHub Actions secure-use guidance treats some workflow contexts as untrusted input. MC should apply the same stance to manifest contents: schema-valid declarations are still untrusted until path containment and registry checks pass.
- GitHub job summaries are Markdown emitted through `GITHUB_STEP_SUMMARY`, grouped into workflow summaries, and can persist as public output surfaces. Loader diagnostics must therefore be bounded, redacted, and repository-relative.
- 2026 research on agentic workflow injection shows that AI-assisted CI workflows can turn repository text and derived outputs into security-sensitive control inputs. MC should treat manifest files and validation reports as agent-consumed custody surfaces, not private scratch files.

## Useful concepts extracted

### 1. Loader as declaration-custody normalizer

The loader should not compare bytes, bless fixtures, inspect generated directories, write result JSON, write Markdown summaries, or emit provenance-like claims. Its one job is to convert a repository-relative manifest path into a normalized, schema-valid, containment-checked declaration object.

### 2. Public object / private internals split

The loader needs absolute paths internally to read the schema/manifest and later allow the verifier to read fixture bytes safely. Those absolute paths must not appear in public return fields, checks, thrown user-facing errors, summary data, or result JSON.

Recommended split:

- public fields: repository-relative POSIX paths, manifest id, schema version, pair ids, artifact kinds, comparison mode, policy constants, canonical check codes, manifest SHA-256;
- private fields: resolved absolute repo root, resolved schema path, resolved manifest path, resolved generated root, resolved expected root, resolved generated/expected pair paths.

The exported API can return both, but private fields must be under a clearly named internal key such as `internalResolvedPaths`, and any later emitter must be forbidden from serializing that key.

### 3. Schema validation before semantic validation

Validation order should be:

1. validate `repoRoot`, `manifestPath`, and `schemaPath` inputs;
2. resolve and contain schema/manifest files under `repoRoot`;
3. read schema and manifest text only;
4. compute `manifest_sha256` from raw manifest bytes before parsing;
5. parse schema JSON and manifest JSON with redacted parse failures;
6. verify schema `$id` equals the expected manifest schema id;
7. compile with an isolated `Ajv2020` instance;
8. validate manifest shape;
9. validate canonical `GHF_*` references against the registry;
10. resolve generated/expected roots;
11. resolve each pair path and assert containment under the correct declared root;
12. return normalized declarations plus one `GHF_MANIFEST_SCHEMA_VALID` check.

This order keeps declaration custody ahead of byte custody.

### 4. Manifest digest belongs to the loader

The compare-result schema has a `manifest_sha256` field in its manifest section. The loader is the right owner because it reads the manifest bytes before validation. The byte verifier should receive this digest from the loader, not recompute it separately.

Digest rule:

- SHA-256 over the exact raw UTF-8 manifest file bytes as read from disk;
- lowercase hex;
- no canonicalization before hashing;
- included in public normalized manifest metadata only after the manifest passes schema, registry, and containment validation.

### 5. Check-code custody must be registry-backed

The loader should validate only the manifest-side check-code declarations required for later byte comparison:

- manifest schema valid/invalid codes;
- pair matched;
- pair drifted;
- pair generated missing;
- pair expected missing;
- unlisted generated output policy code if declared by the manifest.

The loader must not invent test-local diagnostic codes. Unknown codes make the manifest invalid before any fixture bytes are read.

### 6. Error reports are checks, not exception dumps

The loader should expose a fail-closed report shape that can be used by tests and later CI without leaking runtime internals:

- `state`: `passed` or `failed_manifest_invalid`;
- `checks`: array of governance replay checks;
- `errors`: bounded public diagnostics;
- `manifest_path`: repository-relative path when available;
- no absolute paths;
- no raw file contents;
- no environment variables;
- no stack traces in public fields.

Thrown errors may still exist for programmer misuse, but CLI/user-facing paths should prefer structured reports.

## Proposed executable API

New module:

`tools/lib/expected-fixture-pair-manifest-loader.mjs`

Exports:

- `EXPECTED_FIXTURE_PAIR_MANIFEST_SCHEMA_ID`
- `DEFAULT_EXPECTED_FIXTURE_PAIR_MANIFEST_SCHEMA_PATH`
- `loadExpectedFixturePairManifest(options)`
- `createExpectedFixturePairManifestValidator(options)`
- `isRepositoryRelativePath(value)`
- `assertContainedPath({ repoRoot, basePath, childPath })`
- `safeManifestLoaderMessage(value)`

Suggested primary call:

`loadExpectedFixturePairManifest({ repoRoot, manifestPath, schemaPath, readTextFile, createReplayCheck, knownCheckCodes })`

Required behavior:

- reads only the schema file and manifest file;
- returns normalized pair declarations in manifest order;
- returns manifest metadata with `manifest_sha256`;
- returns declared roots as repository-relative POSIX paths;
- returns internal absolute paths only under a non-serializable/private field or a documented internal field;
- emits `GHF_MANIFEST_SCHEMA_VALID` on success;
- emits `GHF_MANIFEST_SCHEMA_INVALID` on parse, schema, registry, or containment failure;
- never reads generated or expected fixture bytes.

## Proposed normalized return shape

```json
{
  "state": "passed",
  "manifest": {
    "schema_version": "governance.expected-fixture-pairs.v1",
    "manifest_id": "governance-expected-fixture-pairs",
    "path": "mind/fixtures/governance.expected-fixture-pairs.v1.json",
    "generated_root": "artifacts/governance",
    "expected_root": "mind/fixtures/expected/governance",
    "manifest_sha256": "<lowercase sha256>"
  },
  "policies": {
    "comparison": "byte_sha256",
    "unexpected_output_policy": "reject",
    "update_policy": "verify_only",
    "path_policy": "repository_relative_only"
  },
  "pairs": [
    {
      "id": "artifact-manifest-result-json",
      "descriptor_id": "artifact-manifest-helper-dry-run",
      "artifact_kind": "result-json",
      "generated_path": "artifacts/governance/result.json",
      "expected_path": "mind/fixtures/expected/governance/result.json",
      "comparison": "byte_sha256",
      "checks": {
        "matched": "GHF_PAIR_MATCHED",
        "drifted": "GHF_PAIR_DRIFTED",
        "generated_missing": "GHF_PAIR_GENERATED_MISSING",
        "expected_missing": "GHF_PAIR_EXPECTED_MISSING"
      }
    }
  ],
  "checks": [
    {
      "code": "GHF_MANIFEST_SCHEMA_VALID",
      "state": "passed"
    }
  ]
}
```

The example is shape-only. Actual check objects must conform to `governance.replay.check.v1.schema.json`.

## Minimal tests

Create `tools/lib/expected-fixture-pair-manifest-loader.test.mjs` with synthetic temp files and injected readers.

Required test cases:

1. valid manifest returns manifest SHA-256, roots, pairs, and `GHF_MANIFEST_SCHEMA_VALID`;
2. loader reads exactly schema and manifest files, never fixture paths;
3. manifest `$schema` / schema `$id` mismatch fails closed;
4. malformed manifest JSON fails with public-safe parse diagnostic;
5. schema-invalid manifest fails before path containment checks read fixtures;
6. unknown `GHF_*` code fails as manifest invalid;
7. generated path escaping `generated_root` fails;
8. expected path escaping `expected_root` fails;
9. Windows drive paths, backslashes, `~`, `..`, and double slashes are rejected;
10. absolute temp paths and stack traces are absent from public reports.

## Implementation decision

Implement the manifest loader before implementing the byte verifier. The loader is now the missing declaration-custody interface between schema custody and byte custody. The byte verifier should import this loader and the compare-result validator, but should not import Ajv directly and should not re-run manifest path checks.

## Next architecture question

How should MC implement `tools/lib/expected-fixture-pair-manifest-loader.mjs` and its synthetic tests in the smallest commit that proves manifest SHA-256 ownership, Ajv2020 validation, registry-backed `GHF_*` checks, and root containment without touching generated or expected fixture bytes?

## Source links

- Node path documentation: https://nodejs.org/api/path.html
- Ajv JSON Schema draft-2020-12 documentation: https://ajv.js.org/json-schema.html
- Ajv schema management documentation: https://ajv.js.org/guide/managing-schemas.html
- GitHub Actions secure-use reference: https://docs.github.com/en/actions/reference/security/secure-use
- GitHub Actions workflow commands / job summaries: https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-commands
- Agentic Workflow Injection paper: https://arxiv.org/abs/2605.07135
