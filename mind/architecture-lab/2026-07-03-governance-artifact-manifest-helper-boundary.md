# Governance Artifact Manifest Helper Boundary

Date: 2026-07-03
Status: proposed design pattern and implementation boundary
Public safety: public-safe; no private user material; no personal identifiers; no raw session content.

## Architecture question

How should MC define a shared `tools/lib/governance-artifact-manifest.mjs` helper so canonical JSON replay, ADR index replay, and future governance graph replay all emit compatible manifest directories without coupling their domain-specific check schemas?

## Current-source research basis

- Node's file system API provides stable primitives for directory creation, file reads/writes, stats, real paths, and atomic rename-style finalization. The helper should rely on these primitives rather than workflow-owned layout reconstruction.
- Node's `crypto.createHash()` remains the correct local primitive for SHA-256 byte digests of generated files.
- SLSA provenance distinguishes artifact identity, subjects, materials, builder identity, and build metadata. MC does not need full SLSA attestation for this helper, but it should borrow the separation between artifact facts and domain-specific build meaning.
- GitHub Actions artifact and attestation documentation reinforce the same split: CI may upload, retain, attest, or summarize artifacts, but the producing tool should own the artifact's internal manifest and file-level meaning.
- JSON Schema 2020-12 supports typed validation boundaries, but schema complexity should remain shallow for governance artifacts so failures are predictable and human-fixable.
- Recent GitHub Actions security research continues to show that over-broad CI authority is a real risk; MC should keep the helper local, deterministic, and least-privilege-friendly rather than making CI mutate governance metadata.

Reference URLs:

- https://nodejs.org/api/fs.html
- https://nodejs.org/api/crypto.html
- https://slsa.dev/spec/v1.1/provenance
- https://docs.github.com/en/actions/security-for-github-actions/using-artifact-attestations/use-artifact-attestations
- https://json-schema.org/draft/2020-12/json-schema-core
- https://arxiv.org/abs/2512.11602
- https://arxiv.org/abs/2606.06767

## Updated understanding

The shared manifest helper should be a small custody kernel. It should not understand canonical JSON replay results, ADR index rules, graph edge semantics, or future dashboard-specific views. It should only know how to turn an already-produced artifact directory into a stable, public-safe, digest-verifiable manifest directory.

That means MC should separate three layers:

1. Domain compiler layer: canonical replay, ADR replay, graph replay, or another governance compiler produces domain outputs and domain checks.
2. Manifest helper layer: common helper records the output files, roles, byte sizes, SHA-256 digests, public-safety scan status, schema id, producer id, deterministic generation policy, and expected exit behavior.
3. CI/dashboard layer: GitHub Actions and future dashboards consume the manifest. They do not recreate layout constants and do not reinterpret domain checks.

The important architecture constraint is inversion of ownership: domain tools supply declared file roles and status; the helper verifies and records file facts. The helper must not infer domain status from filenames or parse domain-specific schemas.

## Design pattern: domain-agnostic artifact custody helper

### Helper responsibility

`tools/lib/governance-artifact-manifest.mjs` should own:

- resolving a relative artifact root;
- rejecting absolute path leakage in manifest fields;
- normalizing slash-separated relative paths;
- sorting files deterministically by path;
- computing byte sizes from the exact files on disk;
- computing SHA-256 from exact file bytes;
- scanning generated text files for public-safety blocks;
- constructing a manifest envelope;
- validating the manifest against `governance.replay.artifact.manifest.v1.schema.json`;
- writing `manifest.json.tmp` and atomically finalizing `manifest.json`;
- returning normalized helper-level checks.

### Helper non-responsibility

The helper must not own:

- canonical JSON fixture semantics;
- ADR lifecycle semantics;
- graph node or edge semantics;
- GitHub annotation formatting;
- Markdown summary wording;
- CI artifact upload behavior;
- dashboard ingestion policy beyond stable manifest fields;
- raw private-session inspection.

### Proposed public API

The helper should expose a narrow module API:

- `normalizeArtifactPath(relativePath)`
- `resolveArtifactRoot(outDir)`
- `describeArtifactFile({ root, path, role, mediaType })`
- `hashFileSha256(filePath)`
- `scanArtifactPublicSafety({ root, files, policy })`
- `buildArtifactManifest({ artifactKind, producer, root, files, summary, exitBehavior, publicSafety })`
- `validateArtifactManifest({ manifest, schema })`
- `writeArtifactManifest({ root, manifest })`
- `createArtifactManifestDirectory({ root, files, manifestInput, schema })`

`createArtifactManifestDirectory` should be the high-level entrypoint used by replay tools. Lower-level functions should remain testable, but domain compilers should usually call only the high-level function.

### Input contract from domain tools

Each domain tool should pass:

- `artifactKind`, such as `governance.canonical-json.replay` or `governance.adr-index.replay`;
- `producer.tool`, such as `tools/replay-governance-canonical-json-fixtures.mjs`;
- `producer.version`, pinned to a governance string, not package version drift;
- a list of generated files with relative paths and roles;
- `summary.primaryStatus`, using stable status words;
- `exitBehavior.expectedExitCode`;
- `publicSafety.policy`, using a shared policy id.

The domain tool may include domain-specific checks in its own output files, but the manifest helper should only reference those files by role and digest.

### Output contract

The helper should create or finalize:

- `manifest.json`, canonical JSON;
- helper-level check records returned to the caller;
- no Markdown and no GitHub workflow commands.

The helper may validate that required roles exist, but the required role set should be provided by the domain tool or schema, not hard-coded globally. Canonical replay may require `replay-result`, `checks`, `annotations`, and `summary`; ADR replay may later require different domain files.

## Boundary rules

### Determinism

No wall-clock timestamp, absolute local path, host name, username, run URL, branch name, or environment secret should enter the manifest. If an execution-time concept is needed, the helper should record policy labels such as `deterministic-build-no-wall-clock` rather than time values.

### Digest policy

Digest file bytes after the domain tool has finalized each file. Do not hash parsed JSON values. Do not trust caller-provided byte counts or hashes. The helper is the authority for file facts.

### Path policy

All manifest paths must be relative to the artifact root, use forward slashes, and reject `..`, empty segments, backslashes, drive letters, home-directory expansions, and absolute paths.

### Safety policy

The helper should scan all text-like generated files before final manifest write. It should return stable public-safety check codes without copying offending secrets or private strings into the check body.

Suggested helper-level check codes:

- `GOVERNANCE_ARTIFACT_PATH_INVALID`
- `GOVERNANCE_ARTIFACT_FILE_MISSING`
- `GOVERNANCE_ARTIFACT_DIGEST_UNREADABLE`
- `GOVERNANCE_ARTIFACT_PUBLIC_SAFETY_BLOCK`
- `GOVERNANCE_ARTIFACT_MANIFEST_SCHEMA_INVALID`
- `GOVERNANCE_ARTIFACT_MANIFEST_WRITE_FAILED`

### CI policy

GitHub Actions should call the domain replay tool. The domain replay tool should call the helper. CI should upload the resulting directory and surface generated summaries. CI should not patch `manifest.json`, infer digests, or rewrite paths.

## Implementation plan

1. Add `tools/lib/governance-artifact-manifest.mjs` as a dependency-free ESM helper using Node `fs`, `path`, and `crypto` only.
2. Add a minimal helper fixture directory under `mind/fixtures/governance.replay.artifact.manifest-helper.v1/` with one passing file-set descriptor.
3. Patch `tools/replay-governance-canonical-json-fixtures.mjs` so it passes already-written files into the helper instead of owning manifest creation inline.
4. Add a design note or negative fixture for invalid relative paths.
5. Later patch ADR replay to use the same helper once ADR replay is executable.

## Acceptance checks

- Two runs over identical artifact files produce byte-identical `manifest.json`.
- The helper never includes absolute local paths.
- The helper computes every digest from file bytes on disk.
- The helper sorts manifest file records by relative path.
- The helper rejects unsafe path segments before hashing.
- The helper validates the final manifest before atomic finalization.
- The helper returns stable check codes for helper failures.
- The helper does not parse or reinterpret domain-specific check schemas.
- GitHub Actions can consume the directory without duplicating path constants.

## Next research question

How should MC define the first executable `tools/lib/governance-artifact-manifest.mjs` implementation and minimal helper fixtures so path normalization, byte digests, public-safety blocks, and schema validation are proven before canonical JSON replay and ADR replay depend on it?
