# Paired Runner Output Directory Layout Pattern

Date: 2026-06-30
Status: Architecture pattern
Public-safety level: public-safe; no private session content, personal material, or raw user text

## Architecture question

How should MC implement the first paired validator runner output directory layout and naming convention so raw captures, canonical repair receipts, and Markdown convergence reports stay easy to diff across CI runs?

## Finding

MC should treat validator output as a layered evidence bundle, not as a single report file.

The directory layout should separate:

1. stable CI truth targets,
2. raw validator debug evidence,
3. reviewer-facing Markdown,
4. run metadata and artifact manifests.

The central rule is: CI compares canonical repair categories and fixture IDs. Humans inspect Markdown. Debuggers inspect raw captures. No layer should pretend to decide symbolic truth.

## Current-source concepts extracted

### 1. JSON Schema output gives a location vocabulary, not stable human language

JSON Schema 2020-12 defines output structures that include validation state, keyword locations, absolute keyword locations, instance locations, errors, annotations, and nested results. The spec examples show `keywordLocation`, `absoluteKeywordLocation`, `instanceLocation`, and `error` fields. This gives MC a portable location grammar, but validator-specific error messages still vary.

Useful MC concept: preserve location fields as evidence, but normalize reviewer-facing repair categories separately.

### 2. Detailed outputs make error association easier than flat dumps

JSON Schema's detailed output form exists because hierarchical output can show when multiple errors share a structural cause. MC should keep this lesson even if Ajv and python-jsonschema expose different raw structures.

Useful MC concept: convergence reports should group by fixture, instance location, and canonical repair category, not by raw error order.

### 3. Optional/config-dependent validator behavior must be explicit

JSON-Schema-Test-Suite separates optional tests and notes that optional format tests require implementations to enable format validation where supported. MC already has a divergent format-boundary fixture, so reports must make the format-validation policy visible rather than hide it.

Useful MC concept: every run must include `format_policy`, `validator_versions`, and `dialect` in metadata.

### 4. CI artifacts expire and may omit hidden files by default

GitHub artifact upload behavior includes configurable retention, hidden-file handling, overwrite behavior, and artifact IDs. Hidden files are ignored by default to avoid accidental sensitive upload. MC should avoid dotfile-dependent report content and should write durable summaries into the repo when the output represents architecture knowledge, while using CI artifacts only for run products.

Useful MC concept: outputs should not depend on hidden directories or temporary artifact retention for long-term memory.

### 5. JUnit XML is for CI interoperability, not MC semantics

Pytest can emit JUnitXML for CI systems. Its docs warn that extra properties/attributes can break strict schema verification in some CI tools. MC can emit JUnitXML as an auxiliary machine-readable test result, but it should not be the semantic convergence report.

Useful MC concept: keep MC's convergence JSON as the source of meaning; JUnitXML is only a CI compatibility sidecar.

## Required output layout

Recommended root:

`mind/reports/agency-validation/v1/<run_id>/`

Where `run_id` is stable enough to sort, but not so detailed that it creates noisy paths:

`YYYYMMDDTHHMMSSZ-<short_commit>-<fixture_pack_id>`

Example:

`mind/reports/agency-validation/v1/20260630T055223Z-abc1234-seed-001-003/`

Inside each run directory:

- `manifest.json`
- `convergence-report.v1.json`
- `convergence-report.v1.md`
- `junit.xml` optional CI sidecar
- `raw/ajv/<fixture_id>.raw-validator-error-capture.v1.json`
- `raw/python-jsonschema/<fixture_id>.raw-validator-error-capture.v1.json`
- `canonical/ajv/<fixture_id>.canonical-validation-error.v1.json`
- `canonical/python-jsonschema/<fixture_id>.canonical-validation-error.v1.json`
- `receipts/<fixture_id>.repair-receipt.v1.json`

## Naming rules

1. `fixture_id` must match the fixture file stem.
2. Use kebab-case for public file paths.
3. Include schema major version in report filenames.
4. Do not include raw validator messages in filenames.
5. Do not include private prompt text, user names, or symbolic session content in paths.
6. Keep run directories sortable by UTC timestamp.
7. Use a short commit SHA or content hash to bind the run to code state.
8. Use the fixture pack ID, not an invented theme name, to bind the run to expected outputs.

## Manifest contract

`manifest.json` should include:

- `run_id`
- `created_at_utc`
- `repository_commit`
- `fixture_pack_id`
- `fixture_pack_path`
- `schema_dialect`
- `format_policy`
- `validators`
  - `name`
  - `version`
  - `runtime`
  - `configuration_summary`
- `outputs`
  - relative path list
- `ci_policy`
  - `assertion_target`: `canonical_repair_categories`
  - `raw_error_policy`: `debug_evidence_only`
  - `markdown_policy`: `reviewer_summary_only`
- `public_safety`
  - `contains_private_session_content`: false
  - `contains_raw_user_text`: false
  - `path_redaction_checked`: true

## Convergence JSON contract

`convergence-report.v1.json` should be the CI truth surface.

It should include:

- fixture-level pass/fail,
- expected canonical categories,
- actual canonical categories per validator,
- convergence status,
- divergence reason when allowed,
- pointers to raw capture files,
- pointers to canonical files,
- pointer to the repair receipt.

It should not include long raw validator messages except by reference to raw capture files.

## Markdown report contract

`convergence-report.v1.md` should answer four questions for a human reviewer:

1. What fixture was tested?
2. Did Ajv and python-jsonschema converge after normalization?
3. If not, is the divergence expected, policy-based, or a defect?
4. What repair action should a schema author take?

Markdown should summarize the canonical categories and link to relative raw evidence paths. It should not become the authoritative CI object.

## CI assertion rule

CI should fail only when:

- a required file is missing,
- a report does not validate against its schema,
- a fixture expected to converge does not converge after normalization,
- a fixture expected to diverge does not expose a declared divergence reason,
- canonical category output differs from expected output,
- metadata required for reproducibility is absent.

CI should not fail because:

- Ajv and python-jsonschema use different message wording,
- raw errors appear in a different order,
- optional format behavior differs where the fixture declares that policy boundary,
- Markdown wording changes while JSON truth surfaces are stable.

## Prototype plan

1. Add `agency-validation-run-manifest.v1.schema.json`.
2. Add `agency-convergence-report.v1.schema.json`.
3. Implement runner output using the directory layout above.
4. Validate every generated JSON file against its schema.
5. Upload the run directory as a GitHub Actions artifact with explicit retention.
6. Commit only durable architecture examples or blessed baseline reports, not every CI run.
7. Add one `README.md` under `mind/reports/agency-validation/v1/` explaining that ephemeral CI artifacts are not the GitHub mind.

## Design decision

Do not store routine CI run outputs permanently in the GitHub mind. Store schemas, contracts, seed fixtures, and selected baseline reports. Routine run outputs should be uploaded as CI artifacts. Durable learning should be promoted back into `mind/architecture-lab/` or `mind/schemas/` only when it changes the architecture.

## Public-safe abstraction

The pattern is about validating synthetic agency-near-miss fixtures. It does not encode private user material, emotional session content, or personal data. Any future fixture derived from a real interaction must be abstracted into synthetic structure before entering this pipeline.

## Next research question

How should MC define `agency-validation-run-manifest.v1.schema.json` and `agency-convergence-report.v1.schema.json` so the runner can validate its own reports before CI interprets convergence status?
