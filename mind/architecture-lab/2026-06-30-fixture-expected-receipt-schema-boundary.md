# Fixture expected receipt schema boundary

Date: 2026-06-30

## Architecture question

How should MC define `fixture-expected-receipt.v1.schema.json` or revise `canonical-repair-receipt.v1.schema.json` so expected fixture receipts validate without weakening production run receipt path authority?

## Research basis

Public sources reviewed:

- JSON Schema draft 2020-12 core, especially output formatting and the minimum fields around keyword location, instance location, error or annotation, nested results, and output structure.
- Ajv API documentation for validator error objects, including structural fields such as `keyword`, `instancePath`, `schemaPath`, and `params`.
- python-jsonschema error documentation for `ValidationError` structure, including `validator`, `absolute_path`, `absolute_schema_path`, `context`, and message fields.
- RFC 8785 JSON Canonicalization Scheme for deterministic JSON serialization constraints, especially object member ordering and preserving JSON array semantics.
- MC local schemas: `canonical-repair-receipt.v1.schema.json` and `fixture-pack.v1.schema.json`.

## Finding

The expected fixture receipt is not the same artifact as a production canonical repair receipt.

Production receipts are evidence generated from a concrete validation run. They need strict run-path authority:

- raw capture paths under `mind/reports/agency-validation/runs/.../raw/...`;
- a concrete `source_capture`;
- generator metadata;
- a receipt identifier derived from runtime evidence;
- validation against `canonical-repair-receipt.v1.schema.json`.

Fixture expected receipts are static oracle files used by parity tests. They need different authority:

- fixture-root paths under `mind/fixtures/agency-validation/...`;
- manifest linkage back to `fixture-pack.v1.json`;
- expected category-set assertions;
- explicit comparison policy;
- no requirement to masquerade as a production run receipt.

Therefore the safe design is a separate fixture expectation schema, not loosening the production schema.

## Decision

Add `mind/schemas/fixture-expected-receipt.v1.schema.json`.

This schema validates expected fixture receipts as public-safe test oracle artifacts. It does not replace or weaken `canonical-repair-receipt.v1.schema.json`.

## Boundary rule

Expected fixture receipt:

```text
fixture manifest -> expected category set -> fixture expectation schema
```

Production generated receipt:

```text
raw capture -> canonical repair receipt generator -> production receipt schema
```

Parity test:

```text
expected fixture receipt + generated Node receipt + generated Python receipt
  -> compare canonical category sets
  -> ignore raw message text and raw error order
```

## Useful concepts extracted

1. Separate oracle from evidence.

   The expected receipt is an oracle. The generated receipt is evidence. Blending them would make fixture convenience leak into production authority.

2. Keep source_capture production-only.

   Fixture expectations may reference manifest-declared raw captures, but they should not pretend to be generated from one runtime capture.

3. Compare category sets first.

   The primary parity assertion is that generated runtime receipts converge on `expected_category_set`. Full repair-object equality can be added later as a stricter mode.

4. Preserve deterministic ordering without overclaiming canonicalization.

   RFC-8785-compatible ordering belongs in the writer/comparison layer. The schema can require explicit ordering policy fields, but it cannot itself prove byte-stability.

5. Keep personal material out of fixtures.

   Fixture cases must stay abstract, structural, and public-safe. They should prove validation architecture, not encode private symbolic or emotional content.

## Implemented artifact

Added:

- `mind/schemas/fixture-expected-receipt.v1.schema.json`

The schema includes:

- `schema_version: fixture-expected-receipt.v1`;
- fixture manifest linkage;
- schema and category-map references;
- expectation scope declaring that this is not a production receipt;
- expected validation result;
- expected canonical category set;
- optional expected repair atoms;
- comparison policy that rejects message-text and raw-order dependence;
- ordering policy;
- CI guardrails requiring generated receipts to still validate against the production receipt schema.

## Requirement update

The fixture-pack runner must validate in this order:

1. Validate `fixture-pack.v1.json` against `fixture-pack.v1.schema.json`.
2. Validate each expected receipt against `fixture-expected-receipt.v1.schema.json`.
3. Validate all declared paths through path authority.
4. Generate Node and Python production receipts from raw captures.
5. Validate generated receipts against `canonical-repair-receipt.v1.schema.json`.
6. Compare each generated receipt category set against the expected fixture receipt category set.
7. Fail CI if generated receipts match each other but drift from the manifest-declared expected category set.

## Non-goals

This change does not:

- redefine production receipt identity;
- allow production raw captures under fixture paths;
- compare raw validator messages;
- treat validator ordering as convergence;
- assert symbolic truth, diagnosis, intent, or private interpretation.

## Next research question

How should MC implement the fixture parity runner so it validates the manifest, validates expected receipts, runs both receipt generators, validates generated production receipts, and compares category sets with deterministic failure reports?
