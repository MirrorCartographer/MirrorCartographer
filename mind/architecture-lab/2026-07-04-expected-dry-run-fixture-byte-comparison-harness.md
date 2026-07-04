# Expected dry-run fixture byte-comparison harness contract

Public-safe: this note contains no private user material. It describes the next architecture boundary for MC governance replay tooling.

## Architecture question researched

How should MC define checked-in expected dry-run fixture outputs and a byte-comparison harness so fixture updates are intentional, reviewable, and resistant to accidental regeneration drift?

## Current repository context

MC already has two required primitives:

- `tools/lib/stable-governance-output.mjs` provides deterministic JSON sorting, newline-terminated serialization, SHA-256 byte digests, repository-relative POSIX path normalization, Markdown escaping, public-safety redaction, and output-record manifests.
- `tools/lib/governance-replay-checks.mjs` provides the append-only normalized check taxonomy, fatality detection, safe details, location normalization, and Markdown rendering.

The missing boundary is not another formatter. The missing boundary is an executable fixture policy: generated outputs must be compared against checked-in expected bytes, and expected fixture changes must be deliberate.

## Research basis

Current public documentation and research point to the following constraints:

- GitHub Actions workflow commands can emit notices, warnings, errors, masked values, and job summaries; summaries are written through `GITHUB_STEP_SUMMARY`, while annotations are emitted through workflow-command syntax. Source: https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-commands
- Node exposes SHA-256 hashing through `node:crypto`, and `process.exitCode` allows deterministic failure signaling without immediate hard exit. Sources: https://nodejs.org/api/crypto.html and https://nodejs.org/api/process.html
- Git `diff --no-index` compares two filesystem paths and implies an exit code that can be used as a byte/regeneration drift gate. Source: https://git-scm.com/docs/git-diff
- SLSA provenance models outputs as named subjects with digests, which maps cleanly to MC's output-record manifests without claiming full provenance before custody exists. Source: https://slsa.dev/spec/v1.1/provenance
- Recent GitHub Actions reliability research finds that workflow complexity correlates with higher maintenance and failure risk; the harness should therefore stay small, explicit, and file-oriented instead of becoming a complex workflow language. Sources: https://arxiv.org/abs/2605.26825 and https://arxiv.org/abs/2602.14572

## Useful concepts extracted

### 1. Expected bytes are the contract

The dry-run skeleton should write generated outputs into a temporary or ignored actual-output directory, then compare each actual file to a checked-in expected file. The pass condition is byte identity, not semantic equivalence.

Required expected files:

- `mind/fixtures/governance.artifact-manifest-helper.replay.dry-run.expected/result.json`
- `mind/fixtures/governance.artifact-manifest-helper.replay.dry-run.expected/summary.md`
- `mind/fixtures/governance.artifact-manifest-helper.replay.dry-run.expected/output-records.manifest.json`

Optional later expected files:

- `annotations.ndjson`
- `exit-contract.json`
- `descriptor-order.json`

### 2. Regeneration is a separate, intentional mode

The harness needs two modes:

- `check`: generate actual outputs, compare to checked-in expected outputs, fail on drift.
- `update`: regenerate expected outputs intentionally, then emit a normalized check saying expected fixtures were updated.

`update` should never run silently in CI. CI should only run `check`.

### 3. Diff output is diagnostic, not contractual

Human-readable diff output is useful, but it should not become part of the replay-result contract because diff formatting varies by tool and context. The durable contract should store:

- expected path
- actual path
- expected SHA-256
- actual SHA-256
- expected byte length
- actual byte length
- comparison status

### 4. Stable ordering must happen before writing

The runner should sort descriptors and output records before byte serialization. Directory traversal order, platform path separators, and object insertion order must not decide fixture bytes.

### 5. The harness emits normalized checks only

No tool-local error strings. Every comparison result should emit `governance.replay.check.v1` objects.

Recommended new check codes for the append-only registry:

- `GHR_EXPECTED_FIXTURE_MATCHED`: expected and actual bytes matched.
- `GHR_EXPECTED_FIXTURE_DRIFT`: expected and actual bytes differed.
- `GHR_EXPECTED_FIXTURE_MISSING`: a required expected file was absent.
- `GHR_EXPECTED_FIXTURE_UPDATED`: expected output was intentionally regenerated.
- `GHR_DESCRIPTOR_ORDER_STABLE`: descriptor ordering was normalized before output.

### 6. Host-specific data is prohibited

Expected dry-run outputs must exclude:

- wall-clock timestamps
- absolute filesystem paths
- runner names
- host OS metadata
- random IDs
- unordered object dumps
- raw unsafe symbolic content
- private/personal material

Allowed data:

- schema IDs
- public-safe check codes
- stable descriptor IDs
- repository-relative POSIX paths
- SHA-256 digests of public-safe generated bytes
- deterministic byte lengths
- deterministic summary counts

## Proposed implementation pattern

### File layout

```text
tools/replay-governance-artifact-manifest-helper-fixtures.mjs
tools/compare-governance-expected-fixtures.mjs
mind/fixtures/governance.artifact-manifest-helper.replay.dry-run.expected/result.json
mind/fixtures/governance.artifact-manifest-helper.replay.dry-run.expected/summary.md
mind/fixtures/governance.artifact-manifest-helper.replay.dry-run.expected/output-records.manifest.json
```

### Comparison record shape

```json
{
  "schema": "governance.expected_fixture.comparison.v1",
  "fixtureId": "artifact-manifest-helper.dry-run.v1",
  "path": "mind/fixtures/governance.artifact-manifest-helper.replay.dry-run.expected/result.json",
  "status": "matched",
  "expected": {
    "bytesSha256": "sha256:...",
    "byteLength": 0
  },
  "actual": {
    "bytesSha256": "sha256:...",
    "byteLength": 0
  }
}
```

Status enum:

- `matched`
- `drifted`
- `missing_expected`
- `missing_actual`
- `updated`

### Exit behavior

Default CI `check` behavior:

- all expected files matched: exit `0`
- missing expected file: exit `1`
- drifted expected file: exit `1`
- unexpected runner error: exit `1`

Sentinel mode:

- intentionally observed drift may exit `0` only when the fixture descriptor says drift is expected.
- any unregistered drift exits `1`.

### Review policy

Expected fixture updates are acceptable only when the pull request or commit clearly shows:

1. the runner or schema contract changed intentionally;
2. expected fixture files changed in the same commit;
3. comparison records explain the new digests;
4. the summary remains public-safe;
5. no host-specific data appears in expected outputs.

## Requirements update

MC governance replay tools should treat expected fixtures as public API snapshots. A generated fixture output is not trusted until it can be reproduced byte-for-byte from symbolic descriptors using shared stable-output and replay-check helpers.

Minimum acceptance criteria for the first harness:

- Generates dry-run outputs into a disposable actual-output directory.
- Compares actual bytes against checked-in expected bytes.
- Uses `stableJson`, `sha256Hex`, `stableOutputRecord`, and `recordsManifest` for every deterministic output.
- Emits normalized replay checks for matched, drifted, missing, and updated fixtures.
- Produces a public-safe Markdown summary.
- Avoids wall-clock, host-specific, absolute-path, random, private, or unsafe raw data.
- Fails CI on unapproved drift.
- Supports an explicit local update mode without making update mode the CI default.

## Implementation sequence

1. Add expected dry-run fixture directory with initial `result.json`, `summary.md`, and `output-records.manifest.json`.
2. Add `tools/compare-governance-expected-fixtures.mjs` using stable-output primitives.
3. Extend `governance-replay-checks.mjs` append-only with the five expected-fixture check codes.
4. Wire dry-run runner to write actual outputs and comparison records.
5. Add CI check mode only after local byte identity is proven.

## Next research question

How should MC implement `tools/compare-governance-expected-fixtures.mjs` and extend `governance-replay-checks.mjs` with expected-fixture check codes while keeping update mode impossible to run accidentally in CI?
