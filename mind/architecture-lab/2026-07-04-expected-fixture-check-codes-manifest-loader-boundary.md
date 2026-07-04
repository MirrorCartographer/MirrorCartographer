# Expected-fixture check codes and manifest-loader boundary

Public-safe architecture note. No private user material is included.

## Architecture question

How should MC update `tools/lib/governance-replay-checks.mjs` with append-only `GHF_*` expected-fixture check codes and implement the first schema-validating manifest loader so invalid manifests fail before any fixture file is read?

## Research basis

- JSON Schema 2020-12 defines JSON Schema as a media type for describing the structure of JSON data and includes expected validation output concepts. MC should keep manifest validation as a first-class contract boundary rather than a helper side effect.
- GitHub Actions workflow commands support summaries, annotations, and masking. MC should emit expected-fixture failures through normalized checks that can be safely rendered to summaries and annotations without leaking untrusted content.
- Node filesystem/path APIs are sufficient for an offline manifest loader, but path handling must stay repository-relative and deterministic.
- SLSA provenance models subjects with digests. MC should treat generated-vs-expected fixture pairs as future provenance subjects: each compared artifact has a stable path and byte digest, not just pass/fail text.
- Recent GitHub Actions security research on agentic workflow injection reinforces the need to validate machine-readable manifests before consuming files or running downstream logic influenced by repository content.

## Useful concepts extracted

1. **Schema-before-I/O**: load the pair manifest as data, validate it against `governance.expected-fixture-pairs.v1.schema.json`, validate every declared check code against the append-only registry, and only then read any generated or expected fixture file.
2. **Expected fixture as public API**: a fixture pair is not just a test convenience. It declares a generated path, an expected path, artifact kind, comparison method, public API status, and failure semantics.
3. **Append-only check taxonomy**: `GHF_*` codes must join the same normalized check stream as replay, schema, manifest, public-safety, and GitHub Actions checks. The human text can improve, but code meaning cannot drift.
4. **Manifest-scoped comparison**: the verifier should compare only files declared by the manifest, then separately reject unlisted generated outputs when `unexpected_output_policy` is `reject`.
5. **Safe failure ordering**: invalid manifest, unknown check code, unsafe path, missing generated file, missing expected file, and byte drift are distinct states. They should not collapse into one generic error.

## Implemented change

The replay-check schema now permits the `GHF` prefix and adds two expected-fixture categories:

- `expected_fixture.manifest`
- `expected_fixture.compare`

The shared check helper now exposes the expected-fixture prefix and registers these append-only codes:

- `GHF_MANIFEST_SCHEMA_VALID`
- `GHF_MANIFEST_SCHEMA_INVALID`
- `GHF_PAIR_MATCHED`
- `GHF_PAIR_DRIFTED`
- `GHF_PAIR_GENERATED_MISSING`
- `GHF_PAIR_EXPECTED_MISSING`
- `GHF_UNLISTED_GENERATED_OUTPUT`

These codes make the already-declared fixture pair manifest executable without inventing tool-local strings.

## Loader boundary contract

The first loader should be a small pure boundary inside `tools/compare-governance-expected-fixtures.mjs` or a shared helper later if reuse emerges.

Required steps:

1. Resolve the manifest path from an explicit CLI argument or a deterministic default.
2. Reject absolute paths, home-relative paths, Windows drive paths, backslashes, `..`, and double slashes before file reads.
3. Read only the manifest file.
4. Parse JSON with a public-safe parse error converted to `GHF_MANIFEST_SCHEMA_INVALID`.
5. Validate against `mind/schemas/governance.expected-fixture-pairs.v1.schema.json`.
6. Validate all `on_*_check_code` values against `CHECK_CODES` before reading fixture files.
7. Validate pair IDs are unique.
8. Validate generated and expected paths stay under `generated_root` and `expected_root` respectively.
9. Only after all above checks pass, read generated and expected fixture files for byte comparison.
10. Emit normalized checks and deterministic result/summary files using `stable-governance-output.mjs`.

## Non-goals for the first loader

- No update/bless mode.
- No directory-inferred fixture discovery except the explicit unlisted-generated-output rejection pass.
- No wall-clock timestamps.
- No raw validator stack traces in summaries.
- No private examples or user-specific symbolic content.

## Acceptance criteria

- An invalid manifest emits `GHF_MANIFEST_SCHEMA_INVALID` and exits before reading any fixture pair file.
- A valid manifest emits `GHF_MANIFEST_SCHEMA_VALID` before comparison checks.
- Unknown `GHF_*` or other check codes fail before fixture reads.
- Matching files emit `GHF_PAIR_MATCHED` with public-safe path and SHA-256 details.
- Drift emits `GHF_PAIR_DRIFTED` with generated and expected SHA-256 digests but no raw content diff.
- Missing generated or expected files emit their specific missing-file codes.
- Extra generated files emit `GHF_UNLISTED_GENERATED_OUTPUT` when the manifest policy is `reject`.
- Fatal checks set `process.exitCode = 1`; the process does not call immediate `process.exit()`.

## Design consequence

Expected-fixture verification becomes a **schema-gated custody verifier**. The verifier cannot accidentally expand its own scope by scanning directories first, and it cannot silently bless drift because update mode remains absent.

## Next research question

How should MC implement `loadExpectedFixturePairManifest()` and its minimal validation tests so schema validation, registry validation, root containment checks, and pre-I/O failure ordering are provable before byte comparison logic is added?
