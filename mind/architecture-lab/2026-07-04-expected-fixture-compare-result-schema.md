# Expected-fixture compare result schema

## Architecture question

How should MC define `governance.expected-fixture-compare.result.v1.schema.json` so byte-comparison results can be schema-validated, dashboard-ingested, and later linked to artifact manifests without pretending to be full SLSA provenance?

## Research basis

Current sources reviewed:

- JSON Schema draft 2020-12 core and output model: schemas are JSON documents for validating and annotating JSON instances; the spec also defines expected output structures and minimum information for validation results.
- SLSA provenance v1.0: provenance uses subjects with digest maps to bind named artifacts to content digests, but provenance also includes builder and build metadata. MC should borrow digest vocabulary without claiming provenance.
- GitHub Actions workflow commands: summaries, annotations, and masking are output surfaces; public output must avoid absolute paths, secrets, and raw untrusted bodies.
- RFC 9457 Problem Details: `type`, `title`, `detail`, and `instance` provide a stable machine-readable error shape, but MC should use it only as an internal problem-record shape because this verifier is not an HTTP API.
- Recent agentic workflow-injection research: repository automation that consumes generated or untrusted text can create prompt-to-script and prompt-to-agent risk; result files must therefore be constrained to normalized facts, stable codes, and public-safe details.

## Understanding change

The expected-fixture comparison result is not a log, not a semantic review, and not provenance. It is a narrow custody document that says:

1. which validated manifest was used;
2. which declared public API fixture pairs were compared;
3. what SHA-256 byte digests and byte sizes were observed;
4. which normalized `GHF_*` checks were emitted;
5. whether unlisted generated outputs existed;
6. whether public-safety boundaries were preserved.

This separates three layers that were previously easy to collapse:

- declaration custody: the manifest declares intentional fixture pairs;
- byte custody: the verifier compares bytes and digests for only those pairs;
- provenance custody: a future build/release system may link subjects and attestations, but this result schema must not claim builder identity, build reproducibility, or supply-chain authenticity.

## Added artifact

Added schema:

- `mind/schemas/governance.expected-fixture-compare.result.v1.schema.json`

The schema defines:

- `schema_version`: fixed to `governance.expected-fixture-compare.result.v1`;
- `tool`: verify-only `compare-governance-expected-fixtures` metadata;
- `manifest`: manifest identity, repository-relative path, roots, and optional manifest SHA-256;
- `comparison_policy`: `byte_sha256`, `reject` unexpected outputs, `verify_only`, repository-relative paths only, and explicit `comparison_result_not_slsa_provenance` boundary;
- `result_state`: passed, drift, missing file, unlisted output, manifest invalid, or internal error;
- `summary`: bounded counts for dashboard ingestion;
- `pairs`: per-pair state with generated/expected digest records;
- `unlisted_generated_outputs`: rejected generated files outside the manifest pair set;
- `checks`: normalized replay checks using `governance.replay.check.v1`;
- `public_safety`: explicit booleans forbidding absolute paths, raw fixture bodies, secrets, and private/personal material.

## Design constraints

1. The schema records digests and sizes, not raw fixture content.
2. All file paths are repository-relative and reject absolute paths, drive-letter paths, backslashes, traversal, and duplicate slashes.
3. Pair results require both generated and expected digests only when the pair matched or drifted.
4. Missing-file states only require the digest side that actually exists.
5. Unlisted generated outputs are visible as rejected public-safe path/digest records.
6. The result can be dashboard-ingested without reading raw artifacts.
7. The result can later be referenced by an artifact manifest or provenance layer without being mistaken for an attestation.

## Implementation implication

The next verifier should write this result only after manifest validation succeeds. If manifest validation fails, the result may still use `failed_manifest_invalid`, but it must not include fixture byte digests from generated or expected files because fixture comparison has not legally started.

## Next research question

How should MC implement the first `compare-governance-expected-fixtures.mjs` result writer so `governance.expected-fixture-compare.result.v1` is emitted deterministically, validates against its schema, emits stable Markdown summaries, and preserves the boundary between compare-result digests and future provenance subjects?
