# GHF Check-Code Contract Test Executable Layer

Date: 2026-07-05
Status: implemented as first executable governance validation layer
Public-safety classification: public-safe; no private/personal material; no fixture bodies; no absolute runtime paths

## Architecture question

How should MC implement `tools/governance-validation/ghf-check-code-contract.test.mjs` and update `package.json` in one minimal step while avoiding Ajv and fixture byte reads?

## Research basis

Current implementation guidance came from four source families:

1. Node native test runner: use `node --test` and `node:test` for a dependency-light executable sentinel.
2. JSON Schema identity semantics: use stable `const` and `enum` values as schema-level identity surfaces rather than fuzzy names.
3. GitHub Actions output safety: keep later CI output compatible with notice/warning/error/summary surfaces and avoid leaking secrets or local runtime details.
4. Recent workflow reliability research: prefer small, narrow workflow language surfaces because larger and more complex GitHub Actions workflows correlate with higher failure and maintenance risk.

## Useful concepts extracted

- A governance validation test can be valuable before full schema validation exists if it checks symbol identity across custody surfaces.
- This layer should not create new `GHF_*` diagnostic codes. Test-local assertion messages are enough until a failure state becomes a durable product/runtime check.
- The registry owns append-only check identity. The manifest declares intended expected-fixture outcomes. The compare-result schema constrains emitted result records.
- The first executable layer should not read generated or expected fixture bytes. Reading fixture bytes belongs to the later verifier.
- Ajv should remain out of this test. This is not schema validation; it is cross-surface symbol consistency.

## Implemented change

Added:

- `tools/governance-validation/ghf-check-code-contract.test.mjs`

Updated:

- `package.json`

New scripts:

- `test:governance`: `node --test tools/governance-validation/*.test.mjs`
- `verify:governance`: `npm run test:governance`

## Contract enforced

The test currently enforces four invariants:

1. Every `GHF_*` registry key matches its own `definition.code` value.
2. The expected-fixture pair manifest uses only registered `GHF_*` codes.
3. The expected-fixture compare-result schema uses only registered `GHF_*` codes.
4. Every manifest outcome code is representable in the compare-result schema before verifier emission.

## Boundary deliberately preserved

This commit does not:

- add Ajv;
- validate full JSON Schema structure;
- compare fixture bytes;
- read generated or expected fixture files;
- add new governance check codes;
- emit GitHub Actions annotations;
- produce a dashboard result file.

## New understanding

The governance stack now has a small executable sentinel before byte custody. That matters because a future verifier can fail early if the symbolic contract drifts, instead of discovering the drift after fixture comparison has already begun. The shape is now:

1. Registry custody: `tools/lib/governance-replay-checks.mjs`
2. Declaration custody: `mind/fixtures/governance.expected-fixture-pairs.v1.json`
3. Result-shape custody: `mind/schemas/governance.expected-fixture-compare.result.v1.schema.json`
4. Executable symbol sentinel: `tools/governance-validation/ghf-check-code-contract.test.mjs`
5. Later byte custody: `compare-governance-expected-fixtures.mjs`

## Next research question

How should MC implement the actual expected-fixture byte verifier so it consumes the already-validated manifest, computes deterministic SHA-256 digests, emits schema-aligned `GHF_*` checks, rejects unlisted generated outputs, and writes result JSON plus Markdown summary without duplicating this contract test or manifest-loader logic?
