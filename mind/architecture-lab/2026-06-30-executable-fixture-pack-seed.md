# Executable fixture-pack seed

## Architecture question

How should MC implement `fixture-pack.v1.json` plus the first `valid-empty` and `required-type-enum` fixture files so the manifest becomes executable by both Python and Node parity tests without network access?

## Research used

- JSON Schema 2020-12 defines validation output around implementation-interpretable locations, including keyword and instance locations. This supports a manifest that treats location/category evidence as the invariant instead of message wording.
- Ajv exposes raw error objects with `keyword`, `instancePath`, `schemaPath`, `params`, and optional `message`. This supports raw-capture preservation without making messages authoritative.
- python-jsonschema exposes `ValidationError` fields such as path, schema path, absolute schema path, JSONPath, validator, and nested context. This supports intentionally different raw shapes that still converge at the category layer.
- RFC 8785 requires recursive lexicographic object-key sorting while preserving array order. This supports byte-stable fixture and receipt files.

Source URLs:

- https://json-schema.org/draft/2020-12/json-schema-core
- https://ajv.js.org/api.html#validation-errors
- https://python-jsonschema.readthedocs.io/en/stable/errors/
- https://www.rfc-editor.org/rfc/rfc8785

## Useful concepts extracted

1. **Manifest authority before runner authority**
   - The fixture manifest declares which instances, schemas, raw captures, and expected category sets exist.
   - Tests should fail on undeclared files or missing runtime coverage before receipt generation.

2. **Raw divergence is expected evidence, not failure**
   - Ajv and python-jsonschema expose different field names and optional message formats.
   - The raw captures should preserve those differences in public-safe envelopes.
   - Convergence belongs at `expected_category_set`, not at raw message text or raw array order.

3. **Valid fixture needs an empty category set**
   - A valid fixture should prove the zero-repair path.
   - This is necessary because receipt generators can otherwise only be tested against failure paths.

4. **Invalid seed should hit multiple structural categories**
   - The `required-type-enum` fixture intentionally triggers `required`, `type`, and `enum`.
   - This gives the parity runner a minimal but non-trivial category-set comparison.

5. **Public-safe fixture design**
   - Seed data uses abstract infrastructure words only.
   - No private user content, personal scenarios, health data, emotional content, or symbolic interpretations are encoded.

## Implemented durable artifact

Added an executable seed fixture pack:

- `mind/schemas/agency-validation-seed-fixture.v1.schema.json`
- `mind/fixtures/agency-validation/fixture-pack.v1.json`
- `mind/fixtures/agency-validation/instances/valid-empty.json`
- `mind/fixtures/agency-validation/instances/required-type-enum.json`
- `mind/fixtures/agency-validation/raw-captures/valid-empty.ajv.json`
- `mind/fixtures/agency-validation/raw-captures/valid-empty.python-jsonschema.json`
- `mind/fixtures/agency-validation/raw-captures/required-type-enum.ajv.json`
- `mind/fixtures/agency-validation/raw-captures/required-type-enum.python-jsonschema.json`
- `mind/fixtures/agency-validation/expected-receipts/valid-empty.expected.json`
- `mind/fixtures/agency-validation/expected-receipts/required-type-enum.expected.json`

## Design decision

The manifest is now the single public-safe inventory boundary:

`fixture-pack.v1.json -> declared instance/schema/raw captures -> expected category set -> runtime parity test`

The first implementation deliberately keeps hashes optional. Local runners should compute and backfill digest evidence later instead of forcing manual digest maintenance.

## Known follow-up debt

The expected receipt files currently use a lightweight `fixture-expected-receipt.v1` shape because `canonical-repair-receipt.v1.schema.json` requires report-run raw paths under `mind/reports/agency-validation/runs/...`, while this fixture pack stores seed raw captures under `mind/fixtures/agency-validation/raw-captures/...`.

That mismatch is useful architecture signal: MC needs either a separate expected-receipt schema for fixture packs or a revised canonical receipt schema that allows fixture-seed raw capture paths when the receipt is an expected test artifact rather than a run artifact.

## Next research question

How should MC define `fixture-expected-receipt.v1.schema.json` or revise `canonical-repair-receipt.v1.schema.json` so expected fixture receipts can be validated without weakening production run receipt path authority?
