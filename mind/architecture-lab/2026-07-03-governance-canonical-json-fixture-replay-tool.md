# Governance canonical JSON fixture replay tool contract

## Architecture question

How should MC define `tools/replay-governance-canonical-json-fixtures.mjs` so canonicalization failures, passing hash cases, and future cross-runtime edge cases are replayed as stable governance artifacts before graph and ADR compilers depend on the helper?

## Public-safety position

This artifact is public-safe. It defines deterministic tooling behavior for governance fixtures only. It does not include private user material, personal narrative content, unreduced chat excerpts, or sensitive symbolic mappings.

## Research basis

Current implementation should align with these public constraints:

- RFC 8785 / JSON Canonicalization Scheme: canonical JSON must produce a stable representation suitable for cryptographic operations. MC already narrowed the helper to a governance-safe subset: JSON-only data, UTF-8 bytes, recursively sorted object keys, preserved array order, and stable SHA-256 URI output.
- Node.js test runner: snapshot testing is now non-experimental in current Node documentation, but its default snapshot serializer uses `JSON.stringify(value, null, 2)`, which is not the MC canonicalization contract. MC can use the Node test runner as the harness, but canonical fixture replay must compare against `canonicalize()` output, not default test-runner snapshots.
- GitHub Actions workflow commands: error annotations can point to repository files and lines, while job summaries can hold Markdown for maintainers. MC should keep machine-readable JSON as the source of truth and generate Markdown summaries only as a view.
- JSON Schema Draft 2020-12 output guidance: validation output should be platform-independent and convertible to JSON. Replay output should follow the same design principle: stable JSON first, environment-specific logs second.
- Recent GitHub Actions research: workflow automation has ongoing maintenance and security costs. Governance replay should minimize CI coupling, avoid untrusted prompt or script input, and emit stable artifacts that can be audited without hidden runner behavior.

## Useful concepts extracted

### Replay is a compiler check, not a unit test

A unit test asks whether code behaves correctly in one runtime. Governance fixture replay asks whether a durable artifact contract still holds across tools, CI, and future compiler layers.

The replay tool should therefore emit a governed result object even when it fails. Failure is data, not just console output.

### Canonical JSON snapshots must be canonical, not pretty

Node's test runner can manage execution, but its default snapshot serialization is not sufficient because it relies on pretty `JSON.stringify()`. MC fixture replay must compare exact canonical strings, exact `sha256:` outputs, and exact governance error codes.

### Three replay classes are required

1. `pass`: input canonicalizes to `expectedCanonicalJson` and hashes to `expectedSha256`.
2. `fail-expected-error`: input is expected to fail canonicalization with `expectedErrorCode`.
3. `fail-unexpected`: fixture metadata is valid but replay behavior differs from the expected output.

The third class should fail CI and write a stable result artifact.

### Human summaries are generated views

The replay result JSON is authoritative. Markdown job summaries are derived from it and should include only:

- total fixture count
- pass / fail / expected-error counts
- stable check codes
- fixture path
- short public-safe reason

Markdown must not include raw private input values if future fixtures ever come from sensitive test sets.

## Proposed tool

`tools/replay-governance-canonical-json-fixtures.mjs`

### Inputs

Default fixture root:

`mind/fixtures/governance.canonical-json.v1/`

Optional flags:

- `--fixture-root <path>`
- `--result-out <path>`
- `--summary-out <path>`
- `--strict`

### Outputs

Default generated outputs:

- `mind/generated/governance.canonical-json.replay.result.v1.json`
- `mind/generated/governance.canonical-json.replay.summary.md`

The generated JSON should be canonicalized before write when possible, but file readability may use a final trailing newline.

### Exit behavior

- Exit `0` when all fixtures replay as expected.
- Exit `1` when any replay mismatch, schema-invalid fixture, missing fixture, duplicate case ID, or tool execution error occurs.
- Never use environment-dependent exit codes.

### Stable check codes

Required v1 codes:

- `GOVERNANCE_CANONICAL_JSON_REPLAY/FIXTURES_DISCOVERED`
- `GOVERNANCE_CANONICAL_JSON_REPLAY/FIXTURE_SCHEMA_INVALID`
- `GOVERNANCE_CANONICAL_JSON_REPLAY/DUPLICATE_CASE_ID`
- `GOVERNANCE_CANONICAL_JSON_REPLAY/CANONICAL_JSON_MISMATCH`
- `GOVERNANCE_CANONICAL_JSON_REPLAY/SHA256_MISMATCH`
- `GOVERNANCE_CANONICAL_JSON_REPLAY/EXPECTED_ERROR_CODE_MISMATCH`
- `GOVERNANCE_CANONICAL_JSON_REPLAY/UNEXPECTED_CANONICALIZATION_ERROR`
- `GOVERNANCE_CANONICAL_JSON_REPLAY/UNEXPECTED_SUCCESS`
- `GOVERNANCE_CANONICAL_JSON_REPLAY/SUMMARY_WRITTEN`
- `GOVERNANCE_CANONICAL_JSON_REPLAY/RESULT_WRITTEN`

## Proposed result object shape

```json
{
  "schemaVersion": "governance.canonical-json.replay.result.v1",
  "tool": "tools/replay-governance-canonical-json-fixtures.mjs",
  "status": "pass",
  "fixtureRoot": "mind/fixtures/governance.canonical-json.v1",
  "totals": {
    "fixtures": 1,
    "passed": 1,
    "failed": 0,
    "expectedErrors": 0
  },
  "checks": [
    {
      "code": "GOVERNANCE_CANONICAL_JSON_REPLAY/FIXTURES_DISCOVERED",
      "severity": "info",
      "message": "Discovered canonical JSON fixtures.",
      "path": "mind/fixtures/governance.canonical-json.v1"
    }
  ],
  "cases": [
    {
      "caseId": "pass-object-key-order",
      "fixturePath": "mind/fixtures/governance.canonical-json.v1/pass-object-key-order.json",
      "status": "pass",
      "actualSha256": "sha256:43258cff783fe7036d8a43033f830adfc60ec037382473548ac742b888292777"
    }
  ]
}
```

## Replay algorithm

1. Discover fixture files recursively under the fixture root.
2. Sort paths lexically using normalized POSIX-style separators.
3. Parse JSON with ordinary `JSON.parse()`; duplicate object names are treated as already collapsed at the parsed-data boundary and should be covered by future raw-source linting if needed.
4. Validate every fixture against `governance.canonical-json.v1.schema.json`.
5. Enforce unique `caseId` values.
6. For fixtures with `expectedErrorCode`, run `canonicalize(input)` and require that it throws `GovernanceCanonicalJsonError` with the exact expected code.
7. For passing fixtures, require exact match against `expectedCanonicalJson` and `expectedSha256`.
8. Build a replay result object with stable codes, stable sorted case order, and public-safe messages.
9. Write the result JSON and generated Markdown summary.
10. Emit GitHub annotation lines only from the stable result object.
11. Exit based on result status.

## Requirements update

1. Canonical JSON fixture replay must be introduced before graph and ADR compilers rely on canonical hashes in CI.
2. Replay output must be deterministic across Node versions that support the selected ECMAScript and Node APIs.
3. The replay tool must import `tools/lib/governance-canonical-json.mjs`; it must not reimplement canonicalization.
4. The replay tool must compare exact canonical strings, exact `sha256:` URI strings, and exact error codes.
5. The replay result JSON is the source of truth; Markdown summaries and GitHub annotations are generated views.
6. Replay cases must be ordered by normalized fixture path, then `caseId`.
7. Fixture inputs must remain public-safe unless a future private test harness is explicitly separated from the public governance corpus.
8. Generated summaries must not print raw fixture input by default.
9. Future Unicode, numeric, and object-key-order edge cases must be added as fixtures before they are relied on by governance graph or ADR-index tools.
10. Node snapshot testing may be used only as a secondary developer convenience, not as the canonical replay format.

## Minimal implementation plan

1. Add `mind/schemas/governance.canonical-json.replay.result.v1.schema.json`.
2. Add a passing replay-result fixture for the current object-key-order case.
3. Add `tools/replay-governance-canonical-json-fixtures.mjs` with read-only replay and generated-output writing.
4. Add a CI job that runs the replay tool and uploads/writes the generated Markdown summary to `GITHUB_STEP_SUMMARY` when available.
5. Add negative fixtures for non-finite numbers, lone surrogate strings, unsupported object values, and mismatched expected hash.
6. Wire graph and ADR-index compilers to depend on canonical replay passing before their own fixture replay begins.

## Next architecture question

How should MC define `governance.canonical-json.replay.result.v1.schema.json` and the first pass/fail replay-result fixtures so canonical replay failures become first-class governance artifacts with stable status, stable check codes, and CI-safe generated summaries?
