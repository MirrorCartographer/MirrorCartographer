# Expected Fixture Pair Schema and Minimal Manifest

Date: 2026-07-04

Status: schema + initial manifest artifact

Public-safety level: public-safe; contains no private source examples, personal records, secrets, absolute local paths, or concrete unsafe payloads.

## Architecture question

How should MC define `governance.expected-fixture-pairs.v1.schema.json` and the first minimal manifest so the verifier can validate intentional fixture pairs before comparison while keeping path safety, check-code references, and future dashboard ingestion stable?

## Research basis

This artifact is grounded in current public sources and prior MC contracts:

- JSON Schema 2020-12 defines dialects, vocabularies, applicators, unevaluated locations, and output concepts. For MC, the useful move is to keep the manifest schema small, explicit, and closed with `additionalProperties: false` rather than relying on ambiguous directory inference.
- SLSA provenance models build outputs as named subjects with digests. For MC, fixture pairs should be treated as explicit public API subjects that later can be mapped into provenance-style custody records.
- GitHub Actions workflow commands expose summaries, annotations, and masking as workflow control-plane surfaces. For MC, any manifest-driven summary must use public-safe, deterministic text only.
- GitHub manual workflow dispatch supports typed manual inputs, but a manual input is operator intent, not proof of safety. MC should keep fixture update/bless mode outside this v1 verifier path until an explicit guarded update workflow exists.
- Recent agentic workflow-injection research shows that AI-assisted GitHub workflows can create prompt-to-agent and prompt-to-script injection surfaces. For MC, fixture manifests must never treat untrusted event text, issue text, pull-request body text, or generated file discovery as authority.

## What changed in understanding

The previous contract established that fixture verification should be manifest-scoped. The deeper schema question clarifies three implementation boundaries:

1. The manifest is a public API declaration, not a convenience index.
2. The verifier must validate intent before reading or comparing files.
3. Dashboard/provenance compatibility starts with stable pair identity, artifact kind, comparison mode, check-code references, and repository-relative path rules.

This shifts the verifier from "compare files in a directory" to "validate a declared custody surface, then compare only that surface."

## Added artifacts

### Schema

Path:

`mind/schemas/governance.expected-fixture-pairs.v1.schema.json`

Purpose:

Defines the closed v1 manifest shape for expected fixture pairs.

Important constraints:

- `schema_version` is fixed to `governance.expected-fixture-pairs.v1`.
- `unexpected_output_policy` is fixed to `reject`.
- `update_policy` is fixed to `verify_only_until_explicit_update_workflow_exists`.
- `pairs` must be a non-empty array.
- Paths must be repository-relative, POSIX-style, non-absolute, non-home-relative, non-Windows-drive, no backslashes, no `..`, and no double slashes.
- Every pair must declare `comparison: byte_sha256`.
- Every v1 pair must declare `public_api: true`.
- JSON-like artifacts require `schema_ref`.
- Markdown artifacts require `markdown_policy: escaped_gfm_no_html`.

### Minimal manifest

Path:

`mind/fixtures/governance.expected-fixture-pairs.v1.json`

Purpose:

Declares the first intentional fixture comparison set for artifact-manifest-helper dry-run outputs.

Initial public API pairs:

1. `pass-public-safe-result-json`
2. `pass-public-safe-summary-md`
3. `pass-public-safe-output-record-json`

These are deliberately minimal: one known-good public-safe descriptor across the three output surfaces that matter for the dry-run skeleton.

## Check-code implication

The minimal manifest references the expected-fixture check-code family using the `GHF_` prefix:

- `GHF_PAIR_MATCHED`
- `GHF_PAIR_DRIFTED`
- `GHF_PAIR_GENERATED_MISSING`
- `GHF_PAIR_EXPECTED_MISSING`

The next helper update should add this prefix and these codes append-only to `tools/lib/governance-replay-checks.mjs`, alongside manifest-level codes such as:

- `GHF_MANIFEST_LOADED`
- `GHF_MANIFEST_INVALID`
- `GHF_OUTPUT_UNLISTED`
- `GHF_PATH_REJECTED`

## Verifier contract update

The verifier should now run this order:

1. Load `mind/fixtures/governance.expected-fixture-pairs.v1.json` if present.
2. Validate it against `mind/schemas/governance.expected-fixture-pairs.v1.schema.json`.
3. Normalize and safety-check all paths before reading files.
4. Reject duplicate pair IDs, duplicate generated paths, and duplicate expected paths.
5. Compare only manifest-listed pairs with byte SHA-256.
6. Scan the generated root and reject unlisted outputs.
7. Emit normalized `GHF_*` checks.
8. Write deterministic verifier `result.json` and `summary.md`.
9. Set `process.exitCode` from normalized fatality rules.

## Design pattern

Name: Explicit Fixture Custody Manifest

Problem:

Directory scanning lets accidental, stale, debug, or attacker-influenced generated files become part of the verification boundary.

Solution:

Represent fixture verification intent as a checked-in, schema-validated, public-safe manifest. The manifest declares each allowed generated output, its expected counterpart, artifact kind, comparison mode, public API status, and normalized check-code outputs.

Result:

Fixture verification becomes intentional, reviewable, byte-stable, and dashboard/provenance-ready.

## Next research question

How should MC update `tools/lib/governance-replay-checks.mjs` with the append-only `GHF_*` expected-fixture check-code family and implement the first schema-validating manifest loader so invalid manifests fail before any fixture file is read?
