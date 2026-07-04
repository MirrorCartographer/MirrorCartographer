# Expected Fixture Comparison Helper Update-Mode Contract

Date: 2026-07-04
Status: design contract
Public safety: public-safe; no private examples, secrets, raw user content, or unsafe fixture payloads

## Architecture question

How should MC implement `tools/compare-governance-expected-fixtures.mjs` and extend `governance-replay-checks.mjs` with expected-fixture check codes while keeping update mode impossible to run accidentally in CI?

## Research basis

Current references checked during this pass:

- GitHub Actions `workflow_dispatch` inputs support typed manual inputs, and the `inputs` context preserves Boolean values as Booleans. Manual inputs are bounded by documented limits: 25 top-level properties and 65,535 payload characters.
- GitHub Actions exposes `GITHUB_ACTIONS=true` when running inside Actions, which gives a reliable environment signal for separating local developer update mode from CI verification mode.
- `git diff --exit-code` exits with `1` when differences exist and `0` when no differences exist, which matches the expected-fixture verification contract.
- GitHub workflow commands support `add-mask`, and values must be masked before they are printed. Workflow commands can also be stopped with a unique token when logging untrusted text.
- Recent 2026 GitHub Actions research on agentic workflow injection argues that untrusted event context can cross prompt/script boundaries, so fixture comparison output must stay public-safe, structured, and non-executing.

## Decision

The comparison helper should be a verifier by default and an updater only under an explicit local-only gate.

Default behavior:

1. Read expected fixture output directories.
2. Run or consume actual dry-run output directories.
3. Compare files by normalized POSIX-relative path.
4. Compare bytes, not parsed semantics, for files whose contract is byte stability.
5. Emit normalized checks through `tools/lib/governance-replay-checks.mjs`.
6. Write a public-safe `comparison-result.json` and `comparison-summary.md`.
7. Exit `0` only when all expected files match and no fatal checks exist.
8. Exit nonzero when expected fixtures drift, required files are missing, unexpected files appear, schema validation fails, or unsafe output is detected.

Update behavior:

1. Disabled by default.
2. Forbidden when `GITHUB_ACTIONS=true` unless a future repository policy explicitly defines a protected manual workflow. The current contract keeps it local-only.
3. Requires an explicit CLI flag: `--update-expected-fixtures`.
4. Requires a second confirmation token: `MC_EXPECTED_FIXTURE_UPDATE=I_UNDERSTAND_THIS_REWRITES_PUBLIC_API_FIXTURES`.
5. Requires a clean working tree before update and a dirty working tree after update unless no changes were needed.
6. Writes only allowlisted expected fixture paths.
7. Refuses path traversal, absolute paths, symlinks, and generated paths outside the expected fixture root.
8. Produces a deterministic update summary that names paths and digests, not private content.

## Why this matters

Expected fixtures are public API snapshots. If they can be regenerated casually, then a broken runner can rewrite the proof of correctness. The correct model is:

- `compare` proves current behavior still matches the contract.
- `update` changes the contract and must be reviewable.
- CI may verify the contract.
- Local/manual update may propose a contract change.
- No automated CI path should silently bless drift.

## Proposed helper interface

```text
node tools/compare-governance-expected-fixtures.mjs \
  --actual out/governance-replay/dry-run \
  --expected test/fixtures/governance-replay/dry-run/expected \
  --result out/governance-replay/comparison-result.json \
  --summary out/governance-replay/comparison-summary.md
```

Optional update mode:

```text
MC_EXPECTED_FIXTURE_UPDATE=I_UNDERSTAND_THIS_REWRITES_PUBLIC_API_FIXTURES \
node tools/compare-governance-expected-fixtures.mjs \
  --actual out/governance-replay/dry-run \
  --expected test/fixtures/governance-replay/dry-run/expected \
  --result out/governance-replay/comparison-result.json \
  --summary out/governance-replay/comparison-summary.md \
  --update-expected-fixtures
```

## Required check-code additions

Add these to `tools/lib/governance-replay-checks.mjs` under an expected-fixture prefix such as `EXPECTED_FIXTURE_*`.

| Code | Severity | Category | Meaning |
|---|---:|---|---|
| `EXPECTED_FIXTURE_MATCH` | info | expected_fixture | Actual bytes match expected bytes. |
| `EXPECTED_FIXTURE_DRIFT` | error | expected_fixture | Same path exists, but byte digest differs. |
| `EXPECTED_FIXTURE_MISSING` | error | expected_fixture | Expected path has no actual counterpart. |
| `EXPECTED_FIXTURE_UNEXPECTED` | error | expected_fixture | Actual path has no expected counterpart. |
| `EXPECTED_FIXTURE_UPDATE_REQUESTED` | warning | expected_fixture | Update flag was supplied. |
| `EXPECTED_FIXTURE_UPDATE_BLOCKED_IN_CI` | error | expected_fixture | Update mode was attempted while `GITHUB_ACTIONS=true`. |
| `EXPECTED_FIXTURE_UPDATE_CONFIRMATION_MISSING` | error | expected_fixture | Update flag was supplied without the required confirmation token. |
| `EXPECTED_FIXTURE_UPDATE_WRITTEN` | warning | expected_fixture | Expected fixture file was rewritten intentionally. |
| `EXPECTED_FIXTURE_PATH_UNSAFE` | error | public_safety | Path was absolute, traversing, symlinked, or outside the allowlisted root. |
| `EXPECTED_FIXTURE_SUMMARY_REDACTED` | info | public_safety | Summary omitted raw content and emitted only safe metadata. |

## Result shape

The comparison result should remain small and dashboard-ingestible:

```json
{
  "schema": "governance.expectedFixtureComparison.v1",
  "tool": "compare-governance-expected-fixtures",
  "mode": "verify",
  "state": "passed",
  "actualRoot": "out/governance-replay/dry-run",
  "expectedRoot": "test/fixtures/governance-replay/dry-run/expected",
  "files": [
    {
      "path": "result.json",
      "expectedSha256": "sha256:...",
      "actualSha256": "sha256:...",
      "status": "match"
    }
  ],
  "checks": []
}
```

Rules:

- Paths are POSIX-relative.
- Digests are SHA-256 with a `sha256:` prefix.
- No wall-clock fields.
- No hostnames, usernames, local absolute paths, raw diff content, private messages, or generated unsafe examples.
- If a human needs a diff, the helper can tell them which path drifted and let Git provide review context separately.

## Update-mode state machine

1. Parse arguments.
2. Normalize and verify roots.
3. Detect CI with `process.env.GITHUB_ACTIONS === "true"`.
4. If update flag and CI: emit `EXPECTED_FIXTURE_UPDATE_BLOCKED_IN_CI`; fail.
5. If update flag and confirmation token missing: emit `EXPECTED_FIXTURE_UPDATE_CONFIRMATION_MISSING`; fail.
6. If update flag and roots safe: copy actual bytes over expected bytes for allowlisted paths only.
7. Recompute digests after write.
8. Emit update checks.
9. Exit via `process.exitCode`, not abrupt termination, so summaries and results still flush.

## Public-safety constraints

- Never include raw fixture payloads in annotations or summaries.
- Never emit unified diffs from generated content into workflow logs.
- Prefer path + digest + status.
- Use existing redaction helpers before rendering Markdown.
- If logging any untrusted generated text becomes necessary later, bracket it behind GitHub `stop-commands` behavior and add masking before output.

## Prototype plan

1. Extend `governance-replay-checks.mjs` with the expected-fixture codes above.
2. Implement a pure path collector: `collectFixtureFiles(root)`.
3. Implement byte digesting using the stable governance output helper.
4. Implement comparison result generation without update mode.
5. Add update mode only after verify mode has fixtures.
6. Add tests for:
   - all match;
   - drift;
   - missing expected;
   - unexpected actual;
   - unsafe path;
   - update flag in CI blocked;
   - update flag without confirmation blocked;
   - local update writes expected files.
7. Wire CI to run verify mode only.

## Acceptance criteria

- CI cannot update expected fixtures.
- Default local command cannot update expected fixtures.
- Update mode requires both a flag and exact confirmation token.
- All result files are deterministic.
- Summary files are public-safe and content-redacted.
- Drift emits check objects, not ad hoc strings.
- A reviewer can tell whether a fixture update is a behavior change, not an accidental regeneration.

## Changed understanding

The fixture comparison helper is not just test infrastructure. It is a governance boundary between generated behavior and accepted contract. The core design risk is accidental contract mutation. The helper must therefore make verification easy, update difficult, and review unavoidable.

## Next research question

How should MC implement the first minimal `tools/compare-governance-expected-fixtures.mjs` verifier so it compares byte digests, emits normalized expected-fixture checks, writes deterministic result and summary files, and fails safely before update mode exists?
