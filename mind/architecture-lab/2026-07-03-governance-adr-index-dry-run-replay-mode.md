# Governance ADR Index Dry-Run Replay Mode

Date: 2026-07-03
Status: proposed
Artifact type: prototype plan + requirements update
Public-safety level: public-safe; private/personal source material must remain abstracted

## Architecture question

How should MC implement `tools/replay-governance-adr-index-fixtures.mjs` dry-run mode so it validates replay-result fixtures, emits canonical JSON plus Markdown summaries, and proves stable exit behavior before real ADR index compilation is wired in?

## Research basis

Current-source review focused on four implementation constraints:

1. Node's built-in test runner now exposes stable test execution, snapshot testing, mock timers, and test stream events. MC can use this for replay verification without adding a test framework dependency.
2. GitHub Actions supports workflow annotations and job summaries. MC should separate machine-readable result artifacts from generated Markdown summaries.
3. RFC 8785 JSON Canonicalization Scheme gives the deterministic serialization model needed before hashing or snapshot comparison.
4. JSON Schema Draft 2020-12 defines validation vocabulary and output concepts, but recent JSON Schema complexity research cautions against advanced dynamic-reference patterns in governance schemas.

## Change in understanding

The replay tool should not be treated as a normal unit-test wrapper. It is a governance compiler harness.

Previous model:

`fixtures -> test output`

Refined model:

`fixtures -> canonical replay-result JSON -> generated Markdown summary -> stable exit code`

This means dry-run mode must prove the reporting contract before the real ADR index builder is attached. The fixture replay result becomes the governed artifact; terminal text is only a view.

## Dry-run contract

`tools/replay-governance-adr-index-fixtures.mjs --dry-run` must:

1. Load replay fixture definitions from a deterministic fixture directory.
2. Validate every fixture against `governance.fixture.replay.result.v1.schema.json`.
3. Canonicalize the replay-result JSON using an RFC 8785-compatible serializer.
4. Emit a Markdown summary derived only from the canonical result object.
5. Produce stable exit behavior:
   - `0` when all required fixtures match expected status.
   - `1` when any required fixture fails validation, output comparison, or expected exit behavior.
   - `2` only for tool misuse, such as invalid CLI flags or unreadable configured paths.
6. Avoid timestamps, environment-specific absolute paths, random IDs, locale-sensitive sorting, and unordered object traversal in governed outputs.

## Required output files

Dry-run mode should be able to write these outputs under a caller-selected output directory:

- `governance.fixture.replay.result.v1.json`
- `governance.fixture.replay.summary.md`
- `governance.fixture.replay.exit-code.txt`

The JSON result is authoritative. Markdown and exit-code text are generated views for CI and human review.

## Replay-result shape requirements

The replay result should include:

- `schemaVersion`
- `runId`, deterministic in dry-run mode
- `mode`, with value `dry-run`
- `tool`, with name and version
- `summary`, including fixture counts by status
- `fixtures[]`, sorted by fixture id
- `checks[]`, sorted by severity, code, fixture id, and path
- `outputs[]`, including JSON and Markdown output descriptors
- `canonicalization`, including algorithm identifier and hash fields
- `exitBehavior`, including expected and actual exit codes

## Stable check-code namespace

Use `GOVERNANCE_FIXTURE_REPLAY/*` for replay harness checks, separate from `GOVERNANCE_ADR_INDEX/*` builder checks.

Initial check codes:

- `GOVERNANCE_FIXTURE_REPLAY/FIXTURE_SCHEMA_INVALID`
- `GOVERNANCE_FIXTURE_REPLAY/CANONICAL_JSON_MISMATCH`
- `GOVERNANCE_FIXTURE_REPLAY/MARKDOWN_SUMMARY_MISMATCH`
- `GOVERNANCE_FIXTURE_REPLAY/EXIT_CODE_MISMATCH`
- `GOVERNANCE_FIXTURE_REPLAY/UNSTABLE_ORDERING`
- `GOVERNANCE_FIXTURE_REPLAY/TOOL_USAGE_INVALID`

## Markdown summary requirements

The Markdown summary should be intentionally boring and deterministic:

1. Title line: `# Governance Fixture Replay Summary`
2. Status line: `Status: pass|warn|fail`
3. Counts table: total, passed, warned, failed, skipped
4. Fixture table sorted by fixture id
5. Check table sorted by severity, code, fixture id, and path
6. No private context, raw personal material, timestamps, local machine paths, or environment variables

## CI pattern

In GitHub Actions, the workflow should:

1. Run the replay tool.
2. Upload the canonical JSON result as an artifact.
3. Append the Markdown summary to `$GITHUB_STEP_SUMMARY`.
4. Convert checks into GitHub workflow annotations only after the canonical JSON exists.
5. Fail the job based on the replay result, not on ad hoc stdout parsing.

## Public-safety rule

Fixture replay must never require private chat history, private health details, personal names, or raw user-specific material. Fixtures should use synthetic ADR ids, synthetic artifact ids, and abstract governance examples.

## Implementation sequence

1. Add `governance.fixture.replay.result.v1.schema.json` if not already present.
2. Add three dry-run fixtures:
   - pass: empty replay result
   - warn: deprecated but valid fixture
   - fail: expected exit-code mismatch
3. Implement canonical JSON serialization helper.
4. Implement Markdown summary renderer from canonical result object.
5. Implement CLI dry-run mode with stable exit-code mapping.
6. Add Node test runner replay tests without introducing a graph database or separate test framework.
7. Wire GitHub Actions only after local dry-run outputs are stable.

## Design decision

Dry-run mode is accepted as a required intermediate stage before real ADR index compilation. It reduces blast radius by proving schema, summary, canonicalization, and exit behavior independently.

## Next research question

How should MC define the canonical JSON helper and hash policy shared by `build-governance-graph.mjs`, `build-governance-adr-index.mjs`, and `replay-governance-adr-index-fixtures.mjs` so all governance tools compute identical hashes across Node versions and CI environments?
