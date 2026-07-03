# Governance ADR Index Fixture Replay Contract

Date: 2026-07-03

Status: proposed

Public safety: this artifact contains only abstract architecture guidance. It does not include private user material, personal source content, or sensitive operational data.

## Architecture question researched

How should MC define `build-governance-adr-index.mjs` fixture replay so passing, warning, and failing cases produce stable check envelopes, stable Markdown summaries, and stable exit behavior across Node versions and CI environments?

## Current-source research basis

- Node.js test runner documentation now includes stable snapshot testing and configurable snapshot path behavior. This is useful, but MC should avoid depending on Node's snapshot file format as the canonical evidence source; snapshot files should be a convenience view, not the replay contract.
- GitHub Actions workflow commands support structured error annotations with file and line metadata. These are useful for maintainer repair loops, but they should be generated from MC's own check envelope rather than becoming the source of truth.
- GitHub Actions job summaries are Markdown written through `GITHUB_STEP_SUMMARY`; they are isolated per step and size-limited. This reinforces that CI Markdown must be treated as a derived human view, not as durable governance state.
- RFC 8785 JSON Canonicalization Scheme defines deterministic property sorting and a hashable JSON representation. MC should use canonical JSON semantics for fixture hashes, expected-output comparison, and replay proof.
- Recent JSON Schema complexity research cautions against unnecessary dynamic-reference and annotation-dependent complexity in validation-heavy systems. MC fixture replay should keep schemas direct, closed, and boring.

## Updated understanding

The ADR index builder needs fixture replay as an invariant boundary:

```text
fixture input corpus
        |
        v
build-governance-adr-index.mjs
        |
        +--> governance.adr.index.v1.json
        +--> governance.adr.index.check.v1.json
        +--> governance.adr.index.summary.md
        +--> process exit code
```

The important change is that replay must compare all four observable outputs:

1. the generated ADR index,
2. the machine-readable check envelope,
3. the human-readable Markdown summary,
4. the process exit behavior.

A fixture is not complete if it only validates JSON shape. It must prove that the builder emits the same canonical result every time, with the same check codes, same sorted paths, same summary sections, and same exit rule.

## Design pattern

Name: deterministic multi-channel fixture replay

Intent: prevent governance tooling from drifting into a state where machine output, CI annotations, Markdown summaries, and shell behavior disagree.

Rule: all human-facing outputs are derived from the check envelope, and the check envelope is derived from canonical builder execution.

## Required fixture classes

### 1. Passing fixture

Purpose: proves normal generation.

Expected properties:

- `status`: `pass`
- `severity_counts.error`: `0`
- exit code: `0`
- summary contains an explicit pass heading
- generated index hash matches expected canonical hash
- no warning or error annotations are emitted

### 2. Warning fixture

Purpose: proves recoverable governance concerns without blocking CI.

Expected properties:

- `status`: `warning`
- exit code: `0`
- at least one warning check code
- summary includes a warning table with code, path, and repair hint
- generated index is still emitted if the warning does not compromise graph validity

Candidate warning checks:

- `GOVERNANCE_ADR_INDEX/PUBLIC_SAFETY_REVIEW_RECOMMENDED`
- `GOVERNANCE_ADR_INDEX/DEPRECATED_STATUS_USED`
- `GOVERNANCE_ADR_INDEX/OPTIONAL_COMPATIBILITY_BOUNDARY_MISSING`

### 3. Failing fixture

Purpose: proves blocking integrity failures.

Expected properties:

- `status`: `fail`
- exit code: `1`
- at least one error check code
- summary includes an error table with repair hint
- generated index is not emitted, or is emitted only under an explicit `partial` flag

Candidate error checks:

- `GOVERNANCE_ADR_INDEX/DUPLICATE_ADR_ID`
- `GOVERNANCE_ADR_INDEX/MISSING_EDGE_ENDPOINT`
- `GOVERNANCE_ADR_INDEX/INVALID_LIFECYCLE_TRANSITION`
- `GOVERNANCE_ADR_INDEX/PUBLIC_SAFETY_FIELD_REQUIRED`
- `GOVERNANCE_ADR_INDEX/SCHEMA_VALIDATION_FAILED`

## Canonical replay directory layout

```text
test/fixtures/governance.adr.index.replay.v1/
  pass-minimal/
    input/
      adr/
        adr-0001.json
    expected/
      governance.adr.index.v1.json
      governance.adr.index.check.v1.json
      governance.adr.index.summary.md
      exit-code.txt

  warn-public-safety-review/
    input/
      adr/
        adr-0001.json
    expected/
      governance.adr.index.v1.json
      governance.adr.index.check.v1.json
      governance.adr.index.summary.md
      exit-code.txt

  fail-missing-edge-endpoint/
    input/
      adr/
        adr-0001.json
    expected/
      governance.adr.index.check.v1.json
      governance.adr.index.summary.md
      exit-code.txt
```

## Output normalization rules

Before comparison, the replay harness must normalize:

- path separators to `/`,
- line endings to `\n`,
- object property order using RFC 8785-compatible canonicalization,
- arrays by schema-defined deterministic sort keys,
- timestamps to fixture-provided fixed values or omit them entirely,
- absolute paths to repository-relative paths,
- environment-specific Node and OS data out of the canonical envelope.

Forbidden in canonical expected outputs:

- wall-clock timestamps,
- random IDs,
- hostnames,
- absolute local filesystem paths,
- Node minor-version text,
- GitHub run IDs,
- ordering based on filesystem traversal order.

## Stable exit behavior

The builder should use exactly three process-level outcomes:

- `0`: pass or warning; generated artifacts are usable.
- `1`: governance failure; maintainer action required.
- `2`: runner misuse or infrastructure error; command-line arguments, missing fixture directory, unreadable files, or tool crash.

This keeps governance failure distinct from runtime failure.

## Stable check envelope requirements

Every check record should include:

- `code`
- `severity`: `error`, `warning`, or `notice`
- `message`
- `path`
- `json_pointer`, when applicable
- `repair_hint`
- `source_artifact_id`, when applicable
- `related_artifact_ids`, sorted lexicographically

Check records must sort by:

1. severity rank: error, warning, notice,
2. code,
3. path,
4. json pointer,
5. source artifact id.

## Stable Markdown summary requirements

The Markdown summary is generated from the check envelope only.

Required sections:

1. `# Governance ADR Index Replay`
2. `## Result`
3. `## Counts`
4. `## Checks`
5. `## Repair hints`
6. `## Determinism proof`

The summary must not include private data, raw ADR body text, local absolute paths, secrets, or environment identifiers.

## Prototype plan

Add a replay harness with this behavior:

```text
node tools/replay-governance-adr-index-fixtures.mjs \
  --fixtures test/fixtures/governance.adr.index.replay.v1
```

Harness algorithm:

1. discover fixture directories in lexicographic order,
2. run `build-governance-adr-index.mjs` against each fixture input,
3. capture generated index, check envelope, Markdown summary, and exit code,
4. normalize outputs,
5. compare normalized outputs to expected files,
6. emit one replay check envelope for the harness itself,
7. exit `0` only if all fixture cases match.

## Requirements update

- `build-governance-adr-index.mjs` must support fixture-controlled output paths.
- `build-governance-adr-index.mjs` must support deterministic execution with no current-time dependency.
- The check envelope is the source of truth for both annotations and Markdown.
- CI must fail on replay drift before publishing generated governance artifacts.
- Fixture replay must be runnable locally without GitHub Actions.
- GitHub Actions integration may add annotations and summaries, but must not change canonical outputs.

## Roadmap item

Implement `tools/replay-governance-adr-index-fixtures.mjs` after the builder skeleton exists.

Acceptance criteria:

- one passing fixture,
- one warning fixture,
- one failing fixture,
- stable expected check envelope for each fixture,
- stable expected Markdown summary for each fixture,
- stable expected exit code for each fixture,
- local replay command documented,
- CI job added only after local replay passes.

## Next architecture question

How should MC define `tools/replay-governance-adr-index-fixtures.mjs` and its own `governance.fixture.replay.result.v1.schema.json` so replay failures are themselves reported as stable governance artifacts rather than ad hoc test output?
