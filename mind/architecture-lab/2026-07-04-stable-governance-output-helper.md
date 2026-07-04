# Stable governance output helper

Public-safe durable artifact. Contains no private user material.

## Architecture question

How should MC design `stable-governance-output.mjs` so stable JSON serialization, Markdown escaping, SHA-256 byte digests, POSIX path normalization, and output redaction can be shared without becoming domain-specific?

## Current-source research basis

- Node `crypto.createHash()` supports streaming/hash construction for deterministic digests; this makes SHA-256 byte custody a runtime primitive instead of a fixture convention.
- Node `path.posix` provides POSIX path behavior independent of host platform; replay outputs should not inherit Windows or local-host separator behavior.
- Node `process.exitCode` should remain a runner-level concern; stable output helpers should return deterministic data and avoid terminating the process.
- GitHub Actions workflow commands support annotations, masking, and job summaries; helper output must therefore prepare public-safe strings and tables before any CI emission.
- JSON Schema 2020-12 and current JSON Schema research reinforce that schemas and validation outputs should be explicit contracts, but deterministic byte production must be handled separately from schema validity.
- Recent GitHub Actions security research continues to show that automation boundaries need least-privilege and injection-resistant output practices; summaries and annotations are an output surface, not neutral logs.

## Extracted concepts

1. Stable bytes are a custody boundary.
   JSON validity alone does not prove byte-identical replay. MC needs canonical ordering, final newline behavior, and digest calculation as shared primitives.

2. Redaction must happen before formatting.
   Markdown escaping is not redaction. A value should be classified public-safe first, then escaped for table or annotation surfaces.

3. POSIX paths are part of the public contract.
   Repository artifacts should use repository-relative POSIX paths only. Host absolute paths, parent traversal, duplicate separators, and local usernames must never enter durable artifacts.

4. The helper must stay domain-neutral.
   It should not know about ADR replay, canonical replay, artifact-manifest replay, or descriptor classes. It should only provide stable serialization, digesting, redaction, path normalization, Markdown formatting, and output-record manifests.

5. Process exit behavior stays outside.
   The helper returns records and errors. Runners decide default-vs-sentinel exit codes.

## Implementation added

Added `tools/lib/stable-governance-output.mjs`.

Exports:

- `StableGovernanceOutputError`
- `STABLE_OUTPUT_SCHEMA_ID`
- `assertStableJsonValue(value, pointer)`
- `stableSortValue(value)`
- `stableJson(value, options)`
- `sha256Hex(bytes)`
- `hasUnsafePublicText(value)`
- `redactPublicText(value, fallback)`
- `sanitizePublicScalar(value)`
- `sanitizePublicObject(value, options)`
- `normalizeRepositoryPath(input)`
- `markdownEscape(value)`
- `markdownTable(headers, rows)`
- `stableOutputRecord({ kind, path, body, safeDetails })`
- `recordsManifest(records)`

## Design pattern

Name: stable output boundary helper.

Use this helper whenever a replay tool writes `result.json`, `summary.md`, `manifest.json`, annotation text, or dashboard-ingestible records.

Required order:

1. Construct domain object.
2. Sanitize public strings and scalar detail fields.
3. Normalize repository-relative path.
4. Serialize with sorted keys and final newline.
5. Hash exact emitted bytes.
6. Emit output records and record manifests.
7. Let the runner decide annotations and exit code.

## Non-goals

- No schema validation engine.
- No GitHub Actions command emission.
- No fixture synthesis.
- No unsafe raw payload persistence.
- No runner exit behavior.

## Acceptance requirements for next implementation

- Dry-run runner imports this helper instead of local serialization code.
- `result.json` and `summary.md` are byte-identical across two executions with identical descriptors.
- Output records include byte length and SHA-256 digest.
- Absolute paths and secret-like values are redacted before Markdown rendering.
- Runner preserves normalized-check contract from `tools/lib/governance-replay-checks.mjs`.

## Next research question

How should MC integrate `tools/lib/stable-governance-output.mjs` into the dry-run skeleton runner so `result.json`, `summary.md`, and output-record manifests become byte-identical fixtures without changing the replay-result schema or check taxonomy?
