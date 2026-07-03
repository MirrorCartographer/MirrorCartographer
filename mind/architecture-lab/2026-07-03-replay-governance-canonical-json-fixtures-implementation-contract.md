# MC Architecture Lab — Canonical JSON Replay Implementation Contract

Date: 2026-07-03
Status: proposed
Artifact type: prototype plan + requirements update
Public-safety level: public-safe; no private user material, health material, identity material, or conversational raw content included.

## Architecture question researched

How should MC implement `tools/replay-governance-canonical-json-fixtures.mjs` so it validates replay-result envelopes, generates CI-safe Markdown from JSON, emits GitHub annotations from normalized checks, and preserves stable exit behavior for pass, replay-failure, and schema-invalid cases?

## Sources consulted

- GitHub Actions workflow commands documentation, especially annotations and job summaries via `GITHUB_STEP_SUMMARY`.
- Node.js process documentation for stable exit behavior through `process.exitCode`.
- JSON Schema output guidance, especially the need for a usable output shape rather than leaking raw validator internals.
- RFC 8785 / JSON Canonicalization Scheme for deterministic serialization and cross-runtime hash policy.
- 2026 GitHub Actions reliability/security research noting that workflow complexity and weak artifact integrity patterns increase maintenance and supply-chain risk.

## Useful concepts extracted

### 1. One source of truth, multiple projections

Replay must produce one canonical JSON replay-result envelope first. Markdown summaries and GitHub annotation commands are generated views of that envelope, not separate logic paths.

Required output order:

1. validate fixture input;
2. run canonicalization/hash check;
3. normalize check records;
4. emit `governance.canonical-json.replay.result.v1` JSON;
5. derive Markdown summary from the JSON;
6. derive GitHub annotations from the same checks;
7. set stable exit behavior.

### 2. Exit behavior is part of the artifact contract

The replay tool must not call `process.exit()` from deep validation code. It should set `process.exitCode` at the outer command boundary so cleanup, summary writing, and artifact emission are still possible.

Stable exit classes:

- `0` — all replay cases passed and the result envelope is schema-valid.
- `1` — at least one replay case failed, but the replay-result envelope itself is valid.
- `2` — tool/config/schema error; the tool cannot produce a trustworthy replay-result envelope.

### 3. Normalized checks are the shared intermediate layer

Each replay observation becomes a normalized check before any output format is written.

Minimum normalized check fields:

- `code` — stable machine code such as `GOVERNANCE_CANONICAL_JSON_REPLAY/HASH_MISMATCH`.
- `severity` — `notice`, `warning`, or `error`.
- `message` — short human fix text.
- `fixturePath` — repository-relative path when available.
- `jsonPointer` — pointer into the fixture/result when available.
- `expected` — optional public-safe expected value.
- `actual` — optional public-safe actual value.

### 4. Markdown must be generated, not authored by hand

The CI summary is a maintainer repair surface, but it is not authoritative. It must include:

- total fixture count;
- pass/fail/schema-invalid counts;
- status table;
- top failing checks;
- stable exit class;
- path to the emitted JSON result envelope.

The summary must avoid raw private data and must avoid dumping large JSON blobs.

### 5. GitHub annotations are repair pointers, not the record

Annotations should point to the fixture file and line when known. They should include the stable check code in the title or message. They should not contain unescaped multiline JSON or raw validator traces.

### 6. Schema-invalid is different from replay-failed

A canonicalization mismatch means the replay system worked and detected a failure. A schema-invalid replay-result means the governance reporting layer itself is broken.

This distinction matters because downstream graph tooling can safely consume a valid failure envelope but must reject a schema-invalid result.

## Implementation contract

Create `tools/replay-governance-canonical-json-fixtures.mjs` as a read-only deterministic replay command.

### Required CLI behavior

Recommended flags:

- `--fixtures mind/fixtures/governance.canonical-json.v1`
- `--result-out mind/generated/governance.canonical-json.replay.result.v1.json`
- `--summary-out mind/generated/governance.canonical-json.replay.summary.md`
- `--schema mind/schemas/governance.canonical-json.replay.result.v1.schema.json`
- `--emit-github-annotations auto|never|always`

### Required phases

1. Discover fixture files in stable lexicographic order.
2. Parse fixture JSON and reject invalid JSON as `SCHEMA_OR_TOOL_ERROR`.
3. Validate fixture shape against the fixture schema if available.
4. Canonicalize fixture `input` with `tools/lib/governance-canonical-json.mjs`.
5. Compute SHA-256 hash over canonical UTF-8 bytes.
6. Compare canonical string and hash against expected fixture values.
7. Normalize checks.
8. Build replay-result envelope.
9. Validate replay-result envelope against `governance.canonical-json.replay.result.v1.schema.json`.
10. Write canonical JSON result envelope.
11. Write generated Markdown summary.
12. Emit GitHub annotations only from normalized checks.
13. Set `process.exitCode` according to the stable exit classes.

## Stable check-code namespace

Use only the following initial codes unless an ADR adds more:

- `GOVERNANCE_CANONICAL_JSON_REPLAY/PASS`
- `GOVERNANCE_CANONICAL_JSON_REPLAY/FIXTURE_JSON_INVALID`
- `GOVERNANCE_CANONICAL_JSON_REPLAY/FIXTURE_SCHEMA_INVALID`
- `GOVERNANCE_CANONICAL_JSON_REPLAY/CANONICAL_STRING_MISMATCH`
- `GOVERNANCE_CANONICAL_JSON_REPLAY/HASH_MISMATCH`
- `GOVERNANCE_CANONICAL_JSON_REPLAY/RESULT_SCHEMA_INVALID`
- `GOVERNANCE_CANONICAL_JSON_REPLAY/UNSUPPORTED_NUMBER`
- `GOVERNANCE_CANONICAL_JSON_REPLAY/UNSUPPORTED_VALUE`
- `GOVERNANCE_CANONICAL_JSON_REPLAY/TOOL_EXCEPTION`

## Public-safety requirements

The replay tool may report fixture paths, schema paths, JSON Pointers, check codes, hashes, and short repair messages.

The replay tool must not emit:

- private conversational text;
- health, identity, relationship, or location specifics;
- raw large fixture payloads in Markdown summaries;
- unbounded validator traces;
- secrets, environment variables, tokens, or local absolute paths.

## Acceptance tests

The first implementation is accepted when these cases are stable:

### Pass case

Input fixture canonicalizes to the expected canonical JSON and expected SHA-256 hash.

Expected behavior:

- result status: `passed`;
- exit code: `0`;
- generated Markdown contains count table;
- no error annotations.

### Replay failure case

Input fixture canonicalizes successfully but expected hash or expected canonical string is wrong.

Expected behavior:

- result status: `failed`;
- exit code: `1`;
- valid replay-result JSON envelope;
- one or more normalized error checks;
- Markdown summary points to the fixture path;
- GitHub annotation title includes the stable check code.

### Schema/tool error case

Fixture JSON is invalid or replay-result envelope fails its own schema.

Expected behavior:

- result status: `schema_invalid` or `tool_error`;
- exit code: `2`;
- best-effort summary emitted if safe;
- downstream graph/index compilers must not consume the result as valid governance evidence.

## Design pattern added

### Governance Replay Compiler Pattern

A governance replay tool should be structured as:

`fixtures -> deterministic compiler -> normalized checks -> canonical JSON envelope -> generated human/CI surfaces`

The JSON envelope is the authoritative artifact. Markdown and annotations are projections. Exit codes are an explicit compatibility contract.

## What changed in understanding

The implementation should not be optimized around developer convenience. It should be optimized around durable governance evidence.

The key architectural boundary is this:

- canonical JSON helper proves byte-stable serialization;
- replay fixture corpus proves expected behavior;
- replay result envelope proves the proof ran;
- Markdown and annotations help a human repair the failed proof.

That makes canonicalization a reusable governance dependency rather than a hidden utility.

## Files this contract expects next

- `tools/replay-governance-canonical-json-fixtures.mjs`
- `mind/generated/governance.canonical-json.replay.result.v1.json`
- `mind/generated/governance.canonical-json.replay.summary.md`
- additional negative fixtures for canonical string mismatch, hash mismatch, invalid fixture JSON, and unsupported numeric edge cases.

## Next research question

How should MC define the first executable `tools/replay-governance-canonical-json-fixtures.mjs` implementation and minimal fixture set so the tool can run locally and in GitHub Actions without adding unnecessary workflow complexity or weakening public-safety guarantees?
