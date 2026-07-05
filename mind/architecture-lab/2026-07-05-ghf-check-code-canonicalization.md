# GHF Check-Code Canonicalization

## Architecture question

How should MC resolve the `GHF_*` check-code naming mismatch across the expected-fixture pair manifest, replay-check registry, and compare-result schema without breaking append-only check semantics or dashboard ingestion?

## Finding

The mismatch was not semantic drift in the fixture system; it was a contract-alignment error between three custody surfaces:

1. The replay-check registry already defines executable check codes for expected-fixture comparison.
2. The expected-fixture pair manifest already references those registry codes.
3. The compare-result schema used older shortened names for pair outcomes and missing-file outcomes.

Because JSON Schema `enum` is an exact fixed-value gate, a schema enum that names non-registry codes would reject otherwise valid compare results or push the result writer to emit non-canonical codes. The safe correction is to canonicalize the result schema to the registry/manifest vocabulary instead of adding aliases.

## Research concepts extracted

- **Enum values are identity boundaries, not labels.** JSON Schema `enum` restricts a field to a fixed set of unique values, so check-code spelling must be treated as API identity.
- **Do not create synonym codes casually.** Extra aliases make dashboard ingestion and historical analysis ambiguous. Append-only semantics should mean new meaning gets a new code; typo correction should align to the already-canonical code.
- **Keep workflow output public-safe.** GitHub Actions workflow commands, annotations, masking, and summaries are stdout/file-mediated surfaces, so stable check-code identity matters when generated output may become annotations or summaries.
- **Keep provenance boundaries separate.** SLSA provenance subjects/digests are stronger artifact-authenticity claims than this compare result. The compare-result schema should continue to describe byte comparison custody only.
- **Recent workflow-injection research increases the value of closed vocabularies.** Agentic workflow injection risk makes schema-gated, registry-backed status vocabularies more important than free-form tool output.

## Decision

Canonical `GHF_*` check codes for expected-fixture pair results are:

- `GHF_PAIR_MATCHED`
- `GHF_PAIR_DRIFTED`
- `GHF_PAIR_GENERATED_MISSING`
- `GHF_PAIR_EXPECTED_MISSING`
- `GHF_MANIFEST_SCHEMA_INVALID`
- `GHF_UNLISTED_GENERATED_OUTPUT`

The schema must use the same names as the replay-check registry and the expected-fixture pair manifest. Do not add compatibility aliases for the older shortened names because the verifier has not shipped yet and no stable downstream result corpus should depend on them.

## Implementation added

Updated `mind/schemas/governance.expected-fixture-compare.result.v1.schema.json` so `pairResult.check_code` accepts the canonical registry/manifest codes:

- Replaced `GHF_PAIR_MATCH` with `GHF_PAIR_MATCHED`.
- Replaced `GHF_PAIR_DRIFT` with `GHF_PAIR_DRIFTED`.
- Replaced `GHF_MISSING_GENERATED_FILE` with `GHF_PAIR_GENERATED_MISSING`.
- Replaced `GHF_MISSING_EXPECTED_FILE` with `GHF_PAIR_EXPECTED_MISSING`.
- Replaced `GHF_MANIFEST_INVALID` with `GHF_MANIFEST_SCHEMA_INVALID`.

## Resulting architecture shift

Expected-fixture comparison now has a single check-code source of truth: the replay-check registry vocabulary, surfaced through the manifest and validated by the compare-result schema.

This keeps the result writer simple: it should copy pair outcome codes from validated manifest descriptors or map pair state to canonical registry codes, then validate the final JSON against the compare-result schema.

## Public-safety boundary

This note intentionally describes only public architecture contracts, schema names, and check-code identifiers. It does not include private fixture bodies, secrets, local absolute paths, or personal material.

## Next research question

How should MC implement a small check-code contract test that loads the replay-check registry, expected-fixture pair manifest, and compare-result schema, then fails if any `GHF_*` code appears in one custody surface but not the appropriate others?
