# Artifact Manifest Helper Symbolic Fixture Descriptor Schema and Fixtures

Date: 2026-07-04

## Architecture question

How should MC define the symbolic fixture descriptor schema and the first five descriptor files so the runner has a typed, versioned input boundary before executable implementation begins?

## Research basis

This note treats symbolic fixture descriptors as a typed governance input boundary, not as ordinary test data.

Current sources reviewed:

- JSON Schema Draft 2020-12 and the official specification pages: use a current validation dialect, keep descriptor structure explicit, and prefer bounded object shapes over loose payloads.
- GitHub Actions workflow commands and summaries: public CI output should be generated from normalized check codes and redacted summaries, not raw exception payloads.
- Node.js filesystem, path, and crypto APIs: executable replay should synthesize temp-only concrete cases, normalize paths, write deterministic bytes, and compute digests from actual byte content.
- SLSA provenance requirements: artifact descriptors should support later custody and integrity reasoning by making artifact generation inputs explicit and reproducible.

## Useful concepts extracted

### 1. Descriptor, not committed dangerous fixture

The repository should store symbolic instructions. The runner may synthesize concrete negative cases in a temp directory, but the public repo should not store raw parent traversal payloads, secret-like strings, private material, or host-specific stack traces.

### 2. Versioned input boundary

The descriptor schema is a contract:

- `descriptorVersion` fixes the schema family.
- `fixtureId` gives stable identity.
- `caseKind` declares the governance path being exercised.
- `syntheticInput` declares generated files and mutations.
- `expectedOutcome` declares normalized status, exit behavior, check codes, and summary disclosure level.

### 3. Five-path minimal coverage

Before implementing the replay runner, the fixture set should prove the complete event envelope surface:

1. `pass` — deterministic manifest from valid files.
2. `expected-failure` — known invalid input is rejected.
3. `unsafe-blocked` — symbolic unsafe content is blocked without committing unsafe raw examples.
4. `schema-invalid` — descriptor validation failure is normalized.
5. `unexpected-failure` — bounded unexpected failure is reported without leaking raw stack traces.

### 4. Disclosure is part of the fixture

Each descriptor declares `summaryDisclosure`:

- `full-public-safe`
- `redacted-public-safe`
- `status-only`

This prevents the runner from improvising what can be shown in GitHub summaries, annotations, and future dashboard ingestion.

## Implemented durable artifacts

Added schema:

- `mind/schemas/governance.artifact-manifest-helper.symbolic-fixture-descriptor.v1.schema.json`

Added first descriptor fixtures:

- `mind/fixtures/governance.artifact-manifest-helper.symbolic-fixture-descriptor.v1/pass-minimal-valid-file-set.json`
- `mind/fixtures/governance.artifact-manifest-helper.symbolic-fixture-descriptor.v1/fail-invalid-path-traversal.json`
- `mind/fixtures/governance.artifact-manifest-helper.symbolic-fixture-descriptor.v1/fail-unsafe-content-marker.json`
- `mind/fixtures/governance.artifact-manifest-helper.symbolic-fixture-descriptor.v1/fail-schema-invalid-descriptor.json`
- `mind/fixtures/governance.artifact-manifest-helper.symbolic-fixture-descriptor.v1/fail-unexpected-io-error.json`

## Design decision

MC should treat symbolic fixture descriptors as the public-safe source of truth for helper replay. The executable runner should never infer unsafe examples from file names alone. It should read typed descriptors, validate them first, synthesize concrete cases only in an isolated temp directory, then emit normalized result artifacts.

## Runner requirements implied by this artifact

The future runner should:

1. Load all descriptor files from the descriptor fixture directory.
2. Validate each descriptor against `governance.artifact-manifest-helper.symbolic-fixture-descriptor.v1.schema.json`.
3. Create a fresh temp workspace per descriptor.
4. Generate declared files using safe content templates.
5. Apply the declared mutation only in temp space.
6. Invoke the manifest helper boundary.
7. Emit `result.json`, `summary.md`, and `manifest.json`.
8. Derive annotations from `normalizedCheckCodes`.
9. Respect `summaryDisclosure` exactly.
10. Preserve default versus sentinel exit behavior.

## Public-safety rule

No private user material, live secrets, raw credential-shaped strings, real host paths, or raw stack traces belong in descriptor files, fixture outputs, or GitHub summaries. Negative cases must be symbolic at rest and concrete only inside disposable runner temp space.

## Next research question

How should MC implement `tools/replay-governance-artifact-manifest-helper-fixtures.mjs` so it validates symbolic descriptors, synthesizes temp-only cases, emits normalized replay-result envelopes, creates redacted summaries, and proves stable default-vs-sentinel exit behavior across all five descriptor classes?
