# Fixture Parity Runner: Gated Comparison Pattern

Date: 2026-07-01
Status: architecture pattern / prototype plan
Scope: public-safe MC architecture lab

## Architecture question

How should MC implement the fixture parity runner so it validates the manifest, validates expected receipts, runs both receipt generators, validates generated production receipts, and compares category sets with deterministic failure reports?

## Research basis

Current source concepts used:

- JSON Schema 2020-12 defines validation output around result validity plus keyword and instance locations. The runner should compare structured locations and categories, not validator prose.
- Ajv exposes structured error objects such as keyword, instancePath, schemaPath, params, and message. Message is useful for diagnostics but must not define convergence.
- python-jsonschema exposes ValidationError fields such as validator, validator_value, absolute_path, absolute_schema_path, context, and message. Message is useful for diagnostics but must not define convergence.
- RFC 8785 JSON Canonicalization Scheme defines deterministic JSON serialization rules, including lexicographic object-property ordering, which is the right model for byte-stable fixture evidence.

## Understanding change

The parity runner is not a validator, generator, or repair judge. It is an evidence gate.

The correct boundary is:

manifest authority -> expected-oracle validation -> runtime generation -> production-receipt validation -> canonical category comparison -> deterministic failure report

This prevents three failure modes:

1. Raw-runtime drift being mistaken for semantic disagreement.
2. Fixture files existing in the repo without being declared by the manifest.
3. Expected receipts being accepted even when they weaken production receipt path authority.

## Design pattern

### Gate 1: manifest authority

Input: `mind/fixtures/agency-validation/fixture-pack.v1.json`

Responsibilities:

- validate the manifest against `mind/schemas/fixture-pack.v1.schema.json`;
- reject absolute paths, parent traversal, URL paths, or undeclared files;
- require each fixture to declare expected runtime coverage;
- require each expected receipt path to be declared explicitly;
- fail before executing Python or Node if inventory authority is broken.

### Gate 2: expected oracle validation

Input: expected fixture receipts declared by the manifest.

Responsibilities:

- validate against `mind/schemas/fixture-expected-receipt.v1.schema.json`;
- confirm expected category sets are ordered and unique;
- confirm fixture id and expected receipt id bind to the manifest entry;
- keep expected receipts test-only, not production receipts.

### Gate 3: runtime receipt generation

Inputs:

- runtime raw captures declared by manifest;
- shared repair-category map loader output;
- canonical repair receipt generator for Python;
- canonical repair receipt generator for Node.

Responsibilities:

- run generators only for declared runtimes;
- forbid network access assumptions;
- preserve raw capture paths as evidence references;
- emit production-shaped receipts for generated outputs;
- never map by human-readable error message text.

### Gate 4: generated production receipt validation

Input: generated receipts from Python and Node.

Responsibilities:

- validate generated receipts against `mind/schemas/canonical-repair-receipt.v1.schema.json`;
- enforce production path authority;
- reject missing evidence references;
- reject duplicate repair ids or unordered category groups;
- fail before parity comparison if either runtime emits malformed receipts.

### Gate 5: parity comparison

Comparison unit: category set, grouped by fixture id and runtime.

The first version should compare:

- fixture id;
- declared runtime id;
- ordered canonical repair category ids;
- evidence count per category;
- valid/invalid status.

The first version should not compare:

- raw error message text;
- raw error array order;
- validator-specific schema-path spelling beyond normalized evidence fields;
- byte-for-byte raw captures across runtimes.

### Gate 6: deterministic failure report

Output path proposal:

`mind/reports/agency-validation/fixture-parity-report.v1.json`

Failure report should include:

- `runnerVersion`;
- `fixturePackPath`;
- `categoryMapPath`;
- `generatedAt` or a stable run id if a fully byte-stable report is required;
- `results[]` sorted by fixture id, then runtime id;
- for each fixture: expected categories, Python categories, Node categories;
- `mismatches[]` sorted by fixture id, mismatch kind, runtime id, category id;
- `diagnostics[]` with bounded raw evidence references, not full unbounded raw messages.

For byte-stable CI artifacts, use an explicit `--stable` mode that omits wall-clock timestamps and writes RFC-8785-compatible canonical JSON.

## Prototype command shape

Preferred command name:

`tools/agency-validation/run-fixture-parity.mjs`

Reason: the runner coordinates both runtimes and repo inventory. Node is already a natural orchestration layer for spawning Python and Node receipt generators, reading JSON, and writing deterministic artifacts.

Arguments:

- `--manifest mind/fixtures/agency-validation/fixture-pack.v1.json`
- `--category-map mind/config/repair-category-map.v1.json`
- `--out mind/reports/agency-validation/fixture-parity-report.v1.json`
- `--stable`
- `--fail-on-mismatch`

Exit behavior:

- `0`: all gates pass and category sets match;
- `1`: parity mismatch or validation failure;
- `2`: unsafe path or undeclared inventory detected;
- `3`: runtime execution failure;
- `4`: generator emitted malformed receipt.

## Implementation requirements

1. The runner must use the existing path authority instead of resolving paths ad hoc.
2. The runner must validate the manifest before reading fixture files.
3. The runner must validate expected receipts before running generators.
4. The runner must validate generated receipts before comparison.
5. The runner must compare canonical category ids, not messages.
6. The runner must sort all arrays before writing output.
7. The runner must treat undeclared fixture files as a hard failure when an inventory check mode is enabled.
8. The runner must keep private/personal session material out of fixtures and reports.

## Minimal test pack

First required fixtures:

1. `valid-empty`
   - expected status: valid
   - expected categories: empty
   - purpose: prove no-error receipts converge.

2. `required-type-enum`
   - expected status: invalid
   - expected categories: required, type, enum
   - purpose: prove raw Python/Ajv differences converge at category-set layer.

## Next implementation step

Create `run-fixture-parity.mjs` as a thin orchestrator with fake generator adapters first. The first commit should prove the gates and failure report shape. A later commit should swap fake adapters for the real Python and Node canonical receipt generators.

## Public-safety note

This artifact describes validation architecture only. It contains no private user session text, no personal memory, and no project-sensitive symbolic content.
