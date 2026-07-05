# GHF Check-Code Contract Test Implementation Plan

Date: 2026-07-05
Status: design pattern / prototype plan
Scope: public-safe MC governance architecture

## Architecture question

How should MC implement `tools/governance-validation/ghf-check-code-contract.test.mjs` and the `test:governance` script as the first executable governance validation layer without prematurely promoting test-local diagnostics into the append-only governance check registry?

## Why this needs deeper understanding

The expected-fixture verifier now spans three custody surfaces:

1. `tools/lib/governance-replay-checks.mjs` owns canonical check-code identity.
2. `mind/fixtures/governance.expected-fixture-pairs.v1.json` declares intended expected-fixture outcomes.
3. `mind/schemas/governance.expected-fixture-compare.result.v1.schema.json` constrains emitted compare-result records.

If any `GHF_*` code drifts across these surfaces, dashboard ingestion and later byte-comparison validation can silently disagree about what happened. The contract test should catch that drift before the compare tool exists.

## Current repo facts

- `package.json` currently defines `test:agency`, `fixture-parity:smoke`, and `verify:agency`, but not `test:governance`.
- The replay-check helper defines the `expectedFixture` prefix as `GHF` and already registers expected-fixture manifest and pair codes.
- The expected-fixture pair manifest uses `GHF_PAIR_MATCHED`, `GHF_PAIR_DRIFTED`, `GHF_PAIR_GENERATED_MISSING`, and `GHF_PAIR_EXPECTED_MISSING` for pair outcomes.
- The compare-result schema constrains pair-result `check_code` values to the canonical `GHF_*` names and separately constrains unlisted generated output records to `GHF_UNLISTED_GENERATED_OUTPUT`.

## Research basis

### Node native test runner

Node's built-in test runner supports `node --test`, test files, subtests, and the `node:test` module. This is enough for a zero-dependency governance contract test and avoids introducing a test framework before the repo needs one.

Useful concept extracted: make the first governance test a direct Node test file rather than a custom validator CLI. A test file is easier to wire into `npm run test:governance` and easier to keep separate from production compare-tool behavior.

### npm scripts

The repo already uses npm scripts as stable task entry points. The governance layer should follow that pattern with a narrowly scoped script:

`"test:governance": "node --test tools/governance-validation/*.test.mjs"`

Useful concept extracted: the script is a human/CI entry point, not a governance artifact. It should not emit durable result JSON yet.

### JSON Schema 2020-12 enum and const modeling

The schemas use `const` and `enum` as identity constraints. The contract test should inspect those constraints as data and compare them to the registry and manifest references.

Useful concept extracted: `enum`/`const` values are not comments. They are executable identity boundaries and should be tested as such.

### GitHub Actions output safety

GitHub Actions supports annotations, masking, and summaries, but this first test should not emit workflow commands or annotations. It should fail through Node assertion output only.

Useful concept extracted: keep workflow output emission in a later adapter. The first contract test should be local, deterministic, and public-safe by construction.

### Agentic workflow-injection research

Recent 2026 research on agentic workflow injection shows that repository automation using agent-generated or untrusted text can create prompt-to-script and prompt-to-agent risks. This supports keeping test diagnostics bounded to public-safe, repo-relative facts rather than interpolating raw file bodies or external event content.

Useful concept extracted: diagnostics should identify missing or extra code symbols, not raw content from fixtures, issue bodies, or runtime paths.

## Contract-test design

### File to add later

`tools/governance-validation/ghf-check-code-contract.test.mjs`

### Script to add later

`package.json`:

`"test:governance": "node --test tools/governance-validation/*.test.mjs"`

Optional later integration:

`"verify:governance": "npm run test:governance"`

Do not add `verify` integration until the first test passes locally and in CI.

## Test responsibilities

The first test should prove these invariants:

### 1. Registry owns canonical `GHF_*` identity

Load `CHECK_CODES` from `tools/lib/governance-replay-checks.mjs`.

Derive:

- `registryGhfCodes = Object.keys(CHECK_CODES).filter(code => code.startsWith('GHF_'))`

Assert that every key equals its embedded `definition.code`.

Why: prevents alias keys and value drift.

### 2. Manifest references only registry-owned codes

Read and parse `mind/fixtures/governance.expected-fixture-pairs.v1.json`.

Collect pair fields:

- `on_match_check_code`
- `on_drift_check_code`
- `on_missing_generated_check_code`
- `on_missing_expected_check_code`

Assert every referenced `GHF_*` code exists in `registryGhfCodes`.

Why: the manifest cannot declare outcomes unknown to the append-only registry.

### 3. Compare-result schema pair codes are registry-owned

Read and parse `mind/schemas/governance.expected-fixture-compare.result.v1.schema.json`.

Collect:

- `$defs.pairResult.properties.check_code.enum`
- `$defs` or properties containing `const: "GHF_UNLISTED_GENERATED_OUTPUT"`

Assert every schema-constrained `GHF_*` code exists in `registryGhfCodes`.

Why: dashboard-ingestible result objects cannot emit non-registry codes.

### 4. Manifest pair outcome codes are schema-allowed where appropriate

The manifest's pair-level outcome codes must be a subset of the compare-result schema's pair-result `check_code.enum`.

Expected subset:

- `GHF_PAIR_MATCHED`
- `GHF_PAIR_DRIFTED`
- `GHF_PAIR_GENERATED_MISSING`
- `GHF_PAIR_EXPECTED_MISSING`

Why: pair comparison can be generated directly from manifest declarations without translation aliases.

### 5. Unlisted-output code is schema-owned and registry-owned, not manifest-pair-owned

Assert:

- `GHF_UNLISTED_GENERATED_OUTPUT` exists in registry.
- `GHF_UNLISTED_GENERATED_OUTPUT` appears in the compare-result schema for `unlisted_generated_outputs`.
- `GHF_UNLISTED_GENERATED_OUTPUT` is not required in pair manifest rows.

Why: unlisted output is a directory policy failure, not a pair outcome.

### 6. Test-local diagnostics stay test-local

The test may use assertion messages such as:

- `missing registry code referenced by manifest`
- `schema allows GHF code not present in registry`
- `manifest pair code not allowed by pair-result schema`

Do not add these diagnostic phrases as governance replay codes.

Why: the append-only registry should describe product/governance outcomes, not every implementation-test failure.

## Public-safety constraints

The test should not print:

- absolute runtime paths
- raw fixture file bodies
- environment variables
- token-like strings
- private/personal material

The test may print:

- repo-relative file paths
- `GHF_*` symbol names
- counts of missing/extra symbols
- stable schema/member paths such as `$defs.pairResult.properties.check_code.enum`

## Implementation sketch

Use only Node built-ins:

- `node:test`
- `node:assert/strict`
- `node:fs/promises`
- `node:path`
- `node:url`

Pseudo-structure:

1. Resolve repo root from `import.meta.url` using a fixed relative walk from `tools/governance-validation`.
2. Import `CHECK_CODES`.
3. Parse manifest JSON.
4. Parse compare-result schema JSON.
5. Extract `GHF_*` references recursively from schema `const` and `enum` values.
6. Run focused tests for registry self-consistency, manifest-to-registry consistency, schema-to-registry consistency, and manifest-to-schema consistency.

## Non-goals

This test must not:

- validate the full manifest schema
- read generated or expected fixture bytes
- compute SHA-256 digests
- write result JSON
- emit GitHub Actions commands
- create or bless fixture updates
- add new `GHF_*` codes automatically

## Acceptance criteria

The implementation is ready when:

1. `npm run test:governance` executes the Node test runner over `tools/governance-validation/*.test.mjs`.
2. The test fails if a manifest pair references a non-registry `GHF_*` code.
3. The test fails if the compare-result schema allows a non-registry `GHF_*` code.
4. The test fails if the manifest pair outcome codes are not allowed by the pair-result schema enum.
5. The test output contains only public-safe, repo-relative paths and `GHF_*` symbols.
6. No new governance replay code is added merely for the test's own assertion failures.

## Durable understanding change

The first executable governance layer should be a symbol-consistency sentinel, not a fixture verifier. It should validate that the vocabulary shared by registry, manifest, and compare-result schema is coherent before any later loader or byte-comparison tool reads fixture contents.

This preserves the architecture boundary:

- registry = identity owner
- manifest = intended fixture outcome declaration
- compare-result schema = dashboard/result emission constraint
- contract test = cross-surface coherence sentinel

## Next research question

How should MC implement `tools/governance-validation/ghf-check-code-contract.test.mjs` and update `package.json` in one minimal commit, including recursive schema `GHF_*` extraction and public-safe assertion messages, while avoiding Ajv and fixture byte reads?