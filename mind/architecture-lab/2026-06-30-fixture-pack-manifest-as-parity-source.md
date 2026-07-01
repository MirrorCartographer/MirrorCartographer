# Fixture-pack manifest as parity source design

Date: 2026-06-30
Status: architecture note / prototype contract
Scope: public-safe MC architecture; no private user material

## Architecture question

How should MC implement `fixture-pack.v1.json` and the first `valid-empty` plus `required-type-enum` raw captures so the manifest itself becomes the single source of truth for cross-runtime receipt parity tests?

## Research basis

Current source review focused on four boundaries:

1. JSON Schema 2020-12 output structure: the spec defines output locations such as keyword relative location, keyword absolute location, instance location, errors / annotations, and nested results. This supports a validator-neutral evidence vocabulary above runtime-specific error objects.
2. Ajv error objects: Ajv exposes native structural fields such as `keyword`, `instancePath`, `schemaPath`, `params`, and `message`.
3. python-jsonschema error objects: python-jsonschema exposes `ValidationError` fields such as `validator`, `validator_value`, `absolute_path`, `absolute_schema_path`, `json_path`, `context`, `cause`, `instance`, and `schema`.
4. RFC 8785 JSON Canonicalization Scheme: canonical JSON uses deterministic serialization rules, including lexicographic property ordering, which is the correct model for byte-stable fixture manifests and expected receipts.

Useful references:

- https://json-schema.org/draft/2020-12/json-schema-core
- https://ajv.js.org/api.html
- https://python-jsonschema.readthedocs.io/en/stable/errors/
- https://www.rfc-editor.org/rfc/rfc8785

## Changed understanding

The fixture pack should not be treated as sample data. It is a governed parity instrument.

The important separation is:

raw validator capture = runtime-specific evidence
canonical repair receipt = governed shared interpretation
fixture-pack manifest = single source of truth for what must be compared

Therefore, parity tests should not infer fixture identity, schema path, expected category set, or expected receipt path from folder names alone. The manifest should declare those explicitly. Folder layout is a convenience; the manifest is authority.

## Design rule

`fixture-pack.v1.json` must be loaded before any parity test runs. It must define every fixture, every raw capture path, every expected receipt path, and the exact comparison mode.

Test code may iterate the manifest. It may not discover extra captures from the filesystem and silently include them.

This prevents accidental expansion, stale fixtures, or runtime-specific files from becoming undeclared test inputs.

## Proposed repository layout

- `test-fixtures/agency-validation/fixture-pack.v1.json`
- `test-fixtures/agency-validation/raw-captures/valid-empty/python.raw-capture.v1.json`
- `test-fixtures/agency-validation/raw-captures/valid-empty/node.raw-capture.v1.json`
- `test-fixtures/agency-validation/raw-captures/required-type-enum/python.raw-capture.v1.json`
- `test-fixtures/agency-validation/raw-captures/required-type-enum/node.raw-capture.v1.json`
- `test-fixtures/agency-validation/expected-receipts/valid-empty/canonical-repair-receipt.v1.json`
- `test-fixtures/agency-validation/expected-receipts/required-type-enum/canonical-repair-receipt.v1.json`

## Manifest contract

The manifest should include:

- `schema_version`: fixed string, `fixture-pack.v1`
- `pack_id`: stable identifier for this fixture pack
- `description`: public-safe reason for the pack
- `canonicalization`: expected deterministic serialization rule, initially `rfc8785-compatible`
- `fixtures`: ordered array sorted by `fixture_id`

Each fixture should include:

- `fixture_id`: stable kebab-case id
- `purpose`: short reason the fixture exists
- `schema_ref`: local schema `$id` or repo-relative schema path used to generate raw captures
- `instance_ref`: repo-relative instance path, if the fixture has a source instance
- `raw_captures`: object with required `python` and `node` entries
- `expected_receipt_ref`: repo-relative expected receipt path
- `expected_category_set`: sorted list of governed repair categories
- `comparison`: object declaring what parity means

Initial comparison modes:

- `receipt_category_set_equal`: required for invalid fixtures
- `receipt_byte_stable`: required for all fixtures after canonical serialization
- `raw_capture_not_compared`: always true; raw captures are evidence, not convergence targets

## Seed fixture: valid-empty

Purpose: prove that both runtimes can process an empty valid case without inventing repair categories.

Expected behavior:

- Python raw capture may have no errors.
- Node raw capture may have no errors.
- Canonical receipt has zero repairs.
- Expected category set is empty.
- This fixture catches accidental default-category injection.

## Seed fixture: required-type-enum

Purpose: prove that intentionally different raw error shapes can converge on the same governed category set.

The instance should trigger at least these categories:

- `missing-required-field`
- `type-mismatch`
- `enum-violation`

Expected behavior:

- Python raw capture may include `validator`, path deque data, and nested context structures.
- Node raw capture may include Ajv `keyword`, `instancePath`, `schemaPath`, and `params`.
- Canonical receipt groups both runtimes into the same sorted category set.
- Raw message text is retained only as bounded evidence summary, not as test authority.

## Implementation plan

1. Add `fixture-pack.v1.schema.json` under `mind/schemas/` if no existing manifest schema exists.
2. Add `fixture-pack.v1.json` under `test-fixtures/agency-validation/`.
3. Add the two seed fixture folders.
4. Add minimal raw captures by hand only if generated captures do not exist yet; mark them as seed captures.
5. Add expected receipt files using canonical key order.
6. Update Python and Node parity tests to read fixtures only from the manifest.
7. Fail CI if a raw capture exists under the fixture tree but is not declared in the manifest.
8. Fail CI if a manifest entry points to a missing file.
9. Fail CI if expected category sets are unsorted or contain unknown categories.
10. Fail CI if the generated receipt differs from the expected receipt after canonical serialization.

## Requirements update

MC agency-validation parity tests must treat `fixture-pack.v1.json` as authoritative. A test fixture is valid only when declared in the manifest, present on disk, linked to expected receipts, and mapped to governed repair categories. Raw capture shape differences between Python and Node are allowed. Canonical receipt category-set differences are not allowed unless the manifest explicitly marks the fixture as exploratory.

## Non-goals

- Do not compare raw Ajv and python-jsonschema error objects for equality.
- Do not depend on error message wording.
- Do not depend on filesystem discovery order.
- Do not include private conversation content, personal health content, or user-identifying material in fixtures.

## Acceptance criteria

- `valid-empty` produces an empty canonical category set in both runtimes.
- `required-type-enum` produces the same sorted category set in both runtimes.
- All fixture paths are repo-relative and pass path-authority checks.
- The manifest validates before runtime-specific generators execute.
- The manifest is the only source of fixture enumeration.
- Generated receipts are byte-stable after canonical serialization.

## Next architecture question

How should MC define `fixture-pack.v1.schema.json` so manifest authority, repo-relative path safety, declared-runtime coverage, expected category-set ordering, and undeclared-file detection are enforceable before parity tests generate receipts?
