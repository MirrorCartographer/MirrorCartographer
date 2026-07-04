# Governance Artifact Manifest Helper Fixture Replay

## Architecture question

How should MC define `tools/replay-governance-artifact-manifest-helper-fixtures.mjs` so helper fixtures can be executed locally and in CI, proving pass/fail behavior, deterministic manifest bytes, public-safety blocking, and schema compatibility before domain replay tools depend on the helper?

## Research basis

- Node.js file-system promises expose stable primitives for directory creation, reading, and writing; the replay tool should keep filesystem behavior explicit rather than hiding it behind test-runner magic. Source: https://nodejs.org/api/fs.html
- Node.js `crypto.createHash()` provides the SHA-256 digest primitive needed for byte-level artifact verification. Source: https://nodejs.org/api/crypto.html#cryptocreatehashalgorithm-options
- GitHub Actions workflow commands support annotations and `GITHUB_STEP_SUMMARY`; replay output should emit normalized annotations and a Markdown summary instead of relying only on raw logs. Source: https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-commands
- GitHub Actions `permissions` can be scoped; the CI harness for replay should run with read-only contents unless a later artifact-attestation workflow explicitly requires more. Source: https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-syntax
- JSON Schema 2020-12 is sufficient for validating replay result envelopes, manifest fixtures, and failure objects, but schemas must stay bounded and operationally simple. Source: https://json-schema.org/draft/2020-12/json-schema-core
- SLSA provenance models build outputs as subjects with digests; MC should align manifest entries to that shape without claiming full SLSA provenance until the workflow actually creates attestations. Source: https://slsa.dev/spec/v1.1/provenance
- Recent GitHub Actions reliability/security studies report workflow complexity, permissions, and artifact integrity as practical failure points; MC should keep this replay as a small CLI with stable artifact contracts rather than a large workflow. Sources: https://arxiv.org/abs/2605.26825 and https://arxiv.org/abs/2601.14455

## Updated understanding

The manifest helper replay is not another domain compiler. It is a boundary test for the custody kernel. Its job is to prove that the shared helper can take a small declared file set and produce the same public-safe manifest envelope every time, while rejecting unsafe or ambiguous paths before downstream compilers trust it.

The replay tool should therefore be designed around four invariants:

1. **Deterministic bytes**: each replay fixture must declare expected `manifest.json` canonical bytes or expected SHA-256 digest, not just semantic equality.
2. **Public-safety first**: path validation must run before file reads, hashing, summary generation, or annotation emission.
3. **Schema compatibility**: generated manifest envelopes and replay result envelopes must validate against their schemas before being written as passing artifacts.
4. **CI-thinness**: GitHub Actions should only execute the CLI, upload the produced artifact directory, and display the produced summary; it should not duplicate layout or validation logic.

## Durable design pattern

### Pattern name

Custody-kernel fixture replay

### Intent

Verify a shared artifact-manifest helper before any domain-specific replay tool depends on it.

### Scope

This pattern applies to:

- `tools/lib/governance-artifact-manifest.mjs`
- `tools/replay-governance-artifact-manifest-helper-fixtures.mjs`
- manifest-helper fixtures under `mind/fixtures/governance.replay.artifact.manifest-helper.v1/`
- future domain replay tools, including canonical JSON replay, ADR-index replay, and governance graph replay

### Non-goals

- Do not compile ADRs.
- Do not compile the governance graph.
- Do not perform personal-context analysis.
- Do not publish private paths, local absolute paths, environment variables, secrets, usernames, emails, or machine-specific metadata.
- Do not depend on network access.

## Proposed replay tool contract

`tools/replay-governance-artifact-manifest-helper-fixtures.mjs` should support:

- `--fixtures <dir>`: fixture directory; default `mind/fixtures/governance.replay.artifact.manifest-helper.v1`.
- `--out <dir>`: output artifact directory; default `artifacts/governance-artifact-manifest-helper-replay`.
- `--summary <path>`: Markdown summary path; default `<out>/summary.md`.
- `--result <path>`: replay result JSON path; default `<out>/result.json`.
- `--manifest <path>`: generated manifest path; default `<out>/manifest.json`.
- `--strict`: fail on unknown fixture fields.
- `--no-annotations`: suppress GitHub annotation commands for local quiet runs.

### Exit behavior

- `0`: all fixtures passed and output schemas validated.
- `1`: one or more replay fixtures failed in an expected operational way.
- `2`: tool usage error, schema-invalid fixture, unsafe path, or internal invariant violation.

Exit code `2` should be reserved for conditions that make replay evidence untrustworthy.

## Minimal fixture model

Each helper fixture should contain:

- `fixture_id`: stable kebab-case identifier.
- `case_type`: `pass` or `fail`.
- `input_files`: array of relative paths and UTF-8 content or byte content reference.
- `expected_status`: `passed` or `failed`.
- `expected_checks`: stable check codes expected in the replay result.
- `expected_manifest_sha256`: SHA-256 of canonical `manifest.json` bytes when the case passes.
- `public_safety`: declaration that the fixture contains no private or personal material.

### Required first replay cases

1. `pass-minimal-file-set`
   - two tiny public-safe files
   - stable relative paths
   - expected byte sizes
   - expected SHA-256 digests
   - expected `manifest.json` digest

2. `fail-invalid-path`
   - includes `../` traversal or an absolute path
   - expected status `failed`
   - expected check code `GOVERNANCE_MANIFEST_PATH_UNSAFE`
   - no manifest file emitted for that fixture case

3. `fail-private-looking-path`
   - includes a path segment such as `.env`, `secrets`, or `private`
   - expected status `failed`
   - expected check code `GOVERNANCE_MANIFEST_PUBLIC_SAFETY_BLOCK`

4. `fail-digest-mismatch`
   - declared expected digest does not match generated bytes
   - expected check code `GOVERNANCE_MANIFEST_DIGEST_MISMATCH`

## Replay result envelope requirements

The replay output should include:

- `schema_version`: `governance.artifact-manifest-helper.replay.result.v1`
- `tool`: executable name and semantic tool contract version
- `started_at` and `completed_at`: optional in local output, but excluded from canonical hash fields unless normalized
- `status`: `passed`, `failed`, or `invalid`
- `fixtures`: ordered by `fixture_id`
- `checks`: normalized code, severity, fixture id, path, message, and public-safe details
- `artifacts`: generated artifact file entries with path, bytes, and SHA-256 digest
- `public_safety`: explicit statement that output has been checked for blocked path classes and contains no private source material

## CI guidance

The GitHub Actions workflow should:

- use `permissions: contents: read` by default
- run the replay CLI directly with Node
- upload the entire replay artifact directory
- append the generated `summary.md` to `GITHUB_STEP_SUMMARY`
- avoid re-computing digests or schema validation in YAML
- fail only on the replay tool's stable exit behavior

## Implementation plan

1. Add `tools/replay-governance-artifact-manifest-helper-fixtures.mjs`.
2. Add `mind/schemas/governance.artifact-manifest-helper.replay.result.v1.schema.json` only if existing replay-result schemas cannot be reused cleanly.
3. Expand helper fixtures with `pass-minimal-file-set`, `fail-invalid-path`, `fail-private-looking-path`, and `fail-digest-mismatch`.
4. Ensure the tool imports `tools/lib/governance-artifact-manifest.mjs` instead of duplicating manifest logic.
5. Ensure replay creates `result.json`, `summary.md`, and, when valid, `manifest.json` under a single artifact directory.
6. Add a thin CI workflow only after local fixture replay produces deterministic bytes twice.

## Public-safety rule

This layer must treat all private/personal context as out of scope. Fixtures should use artificial names such as `alpha.txt`, `beta.json`, and `public-note.md`. No real person, animal, address, email, medical fact, local path, account name, or relationship detail belongs in helper fixtures or replay summaries.

## Next architecture question

How should MC define `governance.artifact-manifest-helper.replay.result.v1.schema.json` so helper replay results can represent pass, expected failure, unsafe input, and schema-invalid states without leaking unsafe fixture details into CI summaries or future dashboard ingestion?
