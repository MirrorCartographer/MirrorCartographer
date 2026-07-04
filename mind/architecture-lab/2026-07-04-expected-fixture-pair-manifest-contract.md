# Expected Fixture Pair Manifest Contract

Date: 2026-07-04

Status: architecture contract

Public-safety level: public-safe; contains no private source examples, personal records, or concrete unsafe payloads.

## Architecture question

How should MC define the optional expected-fixture pair manifest so the verifier compares only intentional public API files, rejects unlisted generated outputs, and still allows new fixture additions through a clear reviewable path?

## Research basis

This note is grounded in current behavior and guidance from:

- GitHub Actions `workflow_dispatch` inputs: manual update paths can be explicitly typed, but inputs are limited and must be treated as operator intent rather than proof of safety.
- GitHub Actions workflow commands: summaries, annotations, and masking are log/control-plane surfaces, so generated summary content must stay redacted and deterministic.
- Git `diff --exit-code`: comparison mode should return `0` for no differences and `1` for intentional detected differences; other failures should be modeled as tool/runtime errors.
- SLSA provenance: artifacts are named as subjects with digests, which supports treating expected fixture pairs as named public API subjects rather than implicit directory contents.
- 2026 GitHub Actions workflow-injection research: agentic workflows add prompt-to-agent and prompt-to-script risk surfaces, so fixture update/bless flows must not consume untrusted event text as authority.

## Updated understanding

Expected fixture comparison should not scan every generated file and infer intent from the filesystem. That turns accidental output, debug files, or hostile/untrusted additions into part of the verification boundary.

The safer model is an explicit pair manifest: a checked-in manifest names each generated file that is allowed to be compared, the expected file it must match, the semantic fixture class, and the public-safe check codes that should be emitted on match, drift, missing file, or unexpected output.

This makes expected fixtures a governed public API surface.

## Contract

The manifest is optional at first, but once present it becomes authoritative.

Recommended path:

`mind/fixtures/governance.expected-fixture-pairs.v1.json`

Recommended schema path:

`mind/schemas/governance.expected-fixture-pairs.v1.schema.json`

The verifier must support two modes:

1. No manifest present: compare the original hard-coded minimal dry-run fixture set only.
2. Manifest present: compare exactly the files listed in the manifest and reject generated outputs that are not listed.

## Manifest shape

The manifest should be stable JSON with sorted keys and POSIX-normalized paths.

Required top-level fields:

- `schema_version`: fixed string, `governance.expected-fixture-pairs.v1`.
- `manifest_id`: stable public identifier, e.g. `artifact-manifest-helper-dry-run-fixtures`.
- `description`: public-safe sentence describing the fixture set.
- `generated_root`: directory where fresh runner outputs are written.
- `expected_root`: directory containing checked-in expected outputs.
- `pairs`: non-empty array of explicit file pairs.
- `unexpected_output_policy`: fixed string, `reject`.
- `update_policy`: fixed string, `verify_only_until_explicit_update_workflow_exists`.

Required pair fields:

- `id`: stable kebab-case identifier.
- `descriptor_id`: symbolic descriptor identifier, when applicable.
- `artifact_kind`: enum such as `result-json`, `summary-md`, or `output-record-json`.
- `generated_path`: path under `generated_root`.
- `expected_path`: path under `expected_root`.
- `comparison`: fixed string, `byte_sha256`.
- `public_api`: boolean; must be `true` for files in v1.
- `on_match_check_code`: normalized check code.
- `on_drift_check_code`: normalized check code.
- `on_missing_generated_check_code`: normalized check code.
- `on_missing_expected_check_code`: normalized check code.

Optional pair fields:

- `notes`: short public-safe rationale.
- `schema_ref`: schema path for JSON artifacts.
- `markdown_policy`: for Markdown artifacts, e.g. `escaped_gfm_no_html`.

## Verifier behavior

The verifier should execute these stages in order:

1. Load manifest if present.
2. Validate manifest shape before reading fixture files.
3. Normalize paths and reject absolute paths, `..`, backslashes, control characters, and symlinks.
4. Read only generated and expected files listed by the manifest.
5. Compute SHA-256 byte digests for each side.
6. Emit normalized expected-fixture checks for match, drift, missing generated, missing expected, or invalid manifest.
7. Scan generated output root for unlisted files and reject them with an unexpected-output check.
8. Write deterministic verifier `result.json` and `summary.md`.
9. Set process exit code from normalized fatality rules, not ad hoc exceptions.

## Check-code additions

Extend `tools/lib/governance-replay-checks.mjs` append-only with expected-fixture manifest codes:

- `expected-fixture.manifest.loaded`
- `expected-fixture.manifest.missing-default-set`
- `expected-fixture.manifest.invalid`
- `expected-fixture.pair.matched`
- `expected-fixture.pair.drifted`
- `expected-fixture.pair.generated-missing`
- `expected-fixture.pair.expected-missing`
- `expected-fixture.output.unlisted`
- `expected-fixture.path.rejected`

The important separation is that `pair.drifted` is a domain failure, while `manifest.invalid` and `path.rejected` are safety failures.

## Reviewable addition path

New fixture additions require a three-part diff:

1. Add descriptor or runner behavior that creates the new output.
2. Add checked-in expected output.
3. Add one explicit pair record to the manifest.

A generated output with no manifest pair must fail verification, even if it looks harmless.

## Non-goals

- Do not implement update/bless mode in this step.
- Do not compare private fixtures.
- Do not store raw unsafe examples.
- Do not infer fixture intent from directory traversal alone.
- Do not let workflow event text decide which fixtures are trusted.

## Prototype plan

Next implementation should create `mind/schemas/governance.expected-fixture-pairs.v1.schema.json` and a minimal manifest for the first dry-run fixture outputs.

Then `tools/compare-governance-expected-fixtures.mjs` should be updated to prefer manifest mode while retaining the hard-coded fallback until the manifest exists.

The first CI version should run verify-only. An update workflow may be designed later, but only behind manual dispatch, explicit typed input, non-CI local confirmation, and reviewable Git diff.

## Next research question

How should MC define `governance.expected-fixture-pairs.v1.schema.json` and the first minimal manifest so the verifier can validate intentional fixture pairs before comparison while keeping path safety, check-code references, and future dashboard ingestion stable?
