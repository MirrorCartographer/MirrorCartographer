# MC Architecture Lab — run-fixture-parity thin orchestrator

Date: 2026-07-01
Public-safety status: public-safe; private/personal material abstracted

## Architecture question

How should MC implement `run-fixture-parity.mjs` as a thin orchestrator with staged gates, deterministic failure reports, and fake adapters before wiring real Python/Node receipt generators?

## Research basis

Current source review focused on four implementation constraints:

1. JSON Schema 2020-12 output is location-oriented. Useful validation evidence is structured around `keywordLocation`, `absoluteKeywordLocation`, `instanceLocation`, `valid`, nested `errors`, and annotations. This supports treating fixture parity as a comparison over declared structural locations, not human wording.
2. Ajv exposes raw errors as `ErrorObject` values with `keyword`, `instancePath`, `schemaPath`, and `params`. This confirms that the Node adapter can produce structural atoms without depending on message text.
3. python-jsonschema exposes `ValidationError` attributes including `validator`, `absolute_path`, and `absolute_schema_path`. This confirms that the Python adapter can produce parallel structural atoms even when raw shape differs from Ajv.
4. RFC 8785 JSON Canonicalization Scheme requires recursive lexicographic object-property sorting and preserving array element order. This confirms that deterministic reports must sort object keys and must never sort arrays unless the array semantics themselves are declared sortable.

## Changed understanding

The runner should not be a validator, receipt generator, or semantic repair judge.

It should be an evidence gate that calls already-defined boundaries in a strict sequence:

`fixture-pack manifest -> manifest validation -> declared file inventory check -> expected receipt validation -> adapter execution -> generated receipt validation -> canonical category-set comparison -> deterministic failure report`

This changes the role of `run-fixture-parity.mjs` from "script that compares JSON" to "staged authority boundary."

The runner should know:

- where the fixture manifest is;
- which runtime adapters are declared by each fixture;
- which expected receipt file belongs to each fixture;
- how to load and validate JSON files through existing schema/path authority helpers;
- how to write stable pass/fail reports.

The runner should not know:

- how Ajv describes an error;
- how python-jsonschema describes an error;
- how raw validator errors map to MC repair categories;
- how canonical repair receipts are internally generated.

## Durable design pattern

### Pattern name

Staged Evidence Gate Orchestrator

### Intent

Create a runner that proves all upstream artifacts are governed before any cross-runtime comparison is trusted.

### Forces

- Raw validator outputs differ by runtime.
- Expected fixture receipts are test oracles, not production run receipts.
- Production receipts must validate against production receipt schema.
- Category set equality must be deterministic even when raw error ordering differs.
- Failure output must be stable enough to review in GitHub diffs.
- The first implementation should support fake adapters so runner behavior can be tested before real generator behavior becomes a moving part.

### Boundaries

1. Manifest authority boundary
   - Load `mind/fixtures/agency-validation/fixture-pack.v1.json`.
   - Validate it against `mind/schemas/fixture-pack.v1.schema.json`.
   - Reject undeclared fixture files discovered under the fixture root.

2. Expected oracle boundary
   - Load each `expectedReceiptPath` declared by the manifest.
   - Validate expected receipts against `mind/schemas/fixture-expected-receipt.v1.schema.json`.
   - Treat expected receipts as category-set oracles only.

3. Adapter boundary
   - In phase one, call fake adapters that return deterministic receipt-shaped JSON.
   - In phase two, swap fake adapters for real Node/Python receipt generators.
   - Adapter return shape must be file-like JSON, never direct comparison objects.

4. Production receipt boundary
   - Validate generated receipts against `mind/schemas/canonical-repair-receipt.v1.schema.json`.
   - Reject generated receipts that pass category comparison but fail production schema authority.

5. Comparison boundary
   - Compare `fixtureId`, `runtimeId`, and sorted canonical category sets.
   - Ignore message wording and raw error order.
   - Fail if generated categories are missing, extra, duplicated, or unordered where schema requires order.

6. Report boundary
   - Emit one deterministic report with stable top-level fields.
   - Report all failures; do not stop at the first fixture unless manifest validation itself fails.
   - Use explicit failure codes.

## Prototype runner contract

Recommended CLI:

`node tools/agency-validation/run-fixture-parity.mjs --manifest mind/fixtures/agency-validation/fixture-pack.v1.json --mode fake --report tmp/fixture-parity-report.json`

Recommended modes:

- `fake`: no real validators; verifies runner gates and report behavior.
- `real`: calls actual Node and Python generators.

Recommended exit behavior:

- `0`: every gate passed and every declared runtime matched its expected category set.
- `1`: at least one fixture/runtime comparison failed.
- `2`: manifest, schema, path authority, or inventory gate failed.
- `3`: runner invocation/configuration failed.

## Deterministic report shape

Stable field order should be:

1. `schemaVersion`
2. `runnerId`
3. `mode`
4. `manifestPath`
5. `status`
6. `summary`
7. `fixtures`
8. `failures`

Recommended failure object fields:

1. `code`
2. `fixtureId`
3. `runtimeId`
4. `path`
5. `expected`
6. `actual`
7. `detail`

Recommended failure codes:

- `MANIFEST_SCHEMA_INVALID`
- `UNDECLARED_FILE_FOUND`
- `EXPECTED_RECEIPT_SCHEMA_INVALID`
- `ADAPTER_EXECUTION_FAILED`
- `GENERATED_RECEIPT_SCHEMA_INVALID`
- `CATEGORY_SET_MISMATCH`
- `CATEGORY_SET_ORDER_INVALID`
- `DUPLICATE_CATEGORY_FOUND`

## Fake adapter phase

Fake adapters should read only the manifest-declared fixture id and produce deterministic generated receipts. They should include one intentionally failing scenario in tests so the runner proves it can emit a useful failure report.

Minimum fake adapter cases:

1. `valid-empty`
   - expected category set: empty
   - generated Node category set: empty
   - generated Python category set: empty

2. `required-type-enum`
   - expected category set: required, type, enum categories as declared by existing expected fixture receipt
   - generated Node category set: same categories, deliberately different raw evidence references
   - generated Python category set: same categories, deliberately different raw evidence references

3. `forced-mismatch-test-only`
   - not part of production fixture pack
   - test-local fake case that returns an extra category to prove deterministic report failure behavior

## Implementation requirements update

Add these requirements before wiring real generators:

REQ-FIXTURE-PARITY-001: The parity runner MUST validate the fixture manifest before reading any fixture-declared file.

REQ-FIXTURE-PARITY-002: The parity runner MUST reject undeclared files under the fixture root, except files explicitly ignored by a committed allowlist.

REQ-FIXTURE-PARITY-003: The parity runner MUST validate expected fixture receipts against the fixture expected receipt schema.

REQ-FIXTURE-PARITY-004: The parity runner MUST validate generated receipts against the production canonical repair receipt schema.

REQ-FIXTURE-PARITY-005: The parity runner MUST compare category sets after schema validation and MUST NOT compare validator message strings.

REQ-FIXTURE-PARITY-006: The parity runner MUST preserve runtime distinction in reporting. A Node pass must not hide a Python failure, and a Python pass must not hide a Node failure.

REQ-FIXTURE-PARITY-007: The parity runner MUST produce deterministic report JSON suitable for GitHub diff review.

REQ-FIXTURE-PARITY-008: The first implementation SHOULD include fake adapters so runner gate behavior can be tested independently from receipt generator correctness.

## Minimal roadmap

1. Create `tools/agency-validation/run-fixture-parity.mjs`.
2. Create fake adapter helpers under `tools/agency-validation/fixture-parity-fakes.mjs` or inside test-only fixtures.
3. Add a fixture parity test file that runs fake mode and asserts:
   - clean pass report;
   - deterministic mismatch report;
   - manifest-schema invalid gate;
   - expected-receipt-schema invalid gate;
   - generated-receipt-schema invalid gate.
4. Wire real Node receipt generator.
5. Wire real Python receipt generator through a child-process boundary.
6. Keep the orchestrator thin; move adapter-specific logic out of the runner.

## Public-safe abstraction note

This artifact does not include private user data, personal narrative material, or emotionally identifying examples. It describes only general architecture for cross-runtime validation parity in MC.

## Next research question

How should MC define the deterministic failure report schema for `run-fixture-parity.mjs` so CI, humans, and later agentic repair tools can consume the same parity evidence without depending on console output?
