# Governance fixture replay result schema and tool contract

Date: 2026-07-03
Status: Proposed
Public-safety class: public-safe architecture note

## Architecture question

How should MC define `tools/replay-governance-adr-index-fixtures.mjs` and `governance.fixture.replay.result.v1.schema.json` so replay failures are reported as stable governance artifacts rather than ad hoc test output?

## Research basis

Current source concepts reviewed:

- JSON Schema Draft 2020-12 defines schema output formats and minimum information for validation output. Useful concept: validation results should be structured data, not only console text. Source: https://json-schema.org/draft/2020-12/json-schema-core#section-12
- Node's built-in test runner supports structured test execution and snapshot concepts. Useful concept: executable fixture replay should be deterministic and replayable across local and CI contexts. Source: https://nodejs.org/api/test.html
- GitHub Actions workflow commands support annotations and job summaries. Useful concept: CI can expose human-readable repair guidance while preserving machine-readable artifacts separately. Source: https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-commands
- RFC 8785 defines JSON Canonicalization Scheme. Useful concept: result hashes should be computed over canonical JSON so ordering differences do not create false fixture failures. Source: https://www.rfc-editor.org/rfc/rfc8785
- Recent GitHub Actions reliability research indicates workflow complexity is associated with failure and maintenance risk. Useful concept: MC should keep replay workflow behavior simple, explicit, and low-dependency. Source: https://arxiv.org/abs/2605.26825

## Decision

MC fixture replay should emit a versioned result envelope:

`governance.fixture.replay.result.v1`

The replay result envelope is the source of truth. Markdown summaries, console logs, and GitHub annotations are generated views.

## What changed in understanding

Previous ADR-index work defined the check envelope and the need for fixture replay. The missing layer was the replay-result contract itself.

The corrected architecture is:

```text
ADR fixtures
  -> replay tool
  -> canonical JSON replay result
  -> generated Markdown summary
  -> CI annotations and exit code
```

This prevents three failure modes:

1. Console-only failures that humans can read but machines cannot compare.
2. Snapshot-only failures that machines can compare but humans cannot repair quickly.
3. CI-only failures that disappear outside GitHub Actions.

## Added schema

Path:

`mind/schemas/governance.fixture.replay.result.v1.schema.json`

Purpose:

- Capture stable run identity.
- Capture tool identity and command surface.
- Capture fixture-root and fixture-set hash.
- Capture per-case status, expected hash, actual hash, and public-safe diagnostics.
- Capture generated JSON and Markdown output paths.
- Capture stable `GOVERNANCE_FIXTURE_REPLAY/*` checks.
- Preserve deterministic exit behavior with `exitCode: 0 | 1`.

## Added first fixture

Path:

`mind/fixtures/governance.fixture.replay.result.v1/pass-empty-replay-result.json`

Purpose:

A minimal passing fixture proves the schema can represent a valid replay run even before warning and failure cases are added.

## Tool contract for `tools/replay-governance-adr-index-fixtures.mjs`

The replay tool should:

1. Read fixture cases from a declared fixture root.
2. Sort fixture paths bytewise by normalized relative path.
3. Execute each fixture case without mutating source fixture files.
4. Emit a canonical JSON result conforming to `governance.fixture.replay.result.v1.schema.json`.
5. Generate a Markdown summary from the JSON result.
6. Compute hashes using RFC 8785-compatible canonical JSON.
7. Return exit code `0` only when all required pass/fail/warn expectations match.
8. Return exit code `1` when any fixture expectation fails or any public-safety diagnostic fails.
9. Avoid private/personal material in diagnostics; diagnostics must name architecture structures, paths, and check codes only.
10. Avoid graph database dependencies; this is a deterministic file compiler and replay harness.

## Stable check-code namespace

Initial check codes:

- `GOVERNANCE_FIXTURE_REPLAY/CASES_DISCOVERED`
- `GOVERNANCE_FIXTURE_REPLAY/CASE_EXPECTATION_MATCHED`
- `GOVERNANCE_FIXTURE_REPLAY/CASE_EXPECTATION_MISMATCH`
- `GOVERNANCE_FIXTURE_REPLAY/RESULT_SCHEMA_VALID`
- `GOVERNANCE_FIXTURE_REPLAY/MARKDOWN_SUMMARY_EMITTED`
- `GOVERNANCE_FIXTURE_REPLAY/PUBLIC_SAFE_DIAGNOSTICS`
- `GOVERNANCE_FIXTURE_REPLAY/STABLE_EXIT_CODE`

## Output policy

Machine-readable output:

`mind/reports/governance.fixture.replay.result.v1/latest.json`

Human-readable output:

`mind/reports/governance.fixture.replay.result.v1/latest.md`

CI annotations may be emitted, but they must be derived from the JSON result. They are not authoritative.

## Compatibility requirement

Any future replay-result schema change must be backed by a machine-readable ADR and must declare whether old replay results remain valid, require migration, or become archived history.

## Next implementation step

Create `tools/replay-governance-adr-index-fixtures.mjs` with a dry-run mode that loads the pass-empty fixture, validates it against the replay-result schema, and emits both JSON and Markdown outputs without touching ADR source fixtures.
