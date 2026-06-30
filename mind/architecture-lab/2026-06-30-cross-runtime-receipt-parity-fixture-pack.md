# Cross-runtime receipt parity fixture pack

Date: 2026-06-30
Status: design pattern / prototype plan
Public safety: contains no private user material, no animal/health data, and no personal chat content. This is an abstract architecture note for MC validation infrastructure.

## Architecture question

How should MC implement the first cross-runtime receipt parity test fixture pack so Python and Node receive intentionally different raw error shapes but must converge on the same canonical category set and receipt comparison rules?

## Short answer

MC should treat cross-runtime parity as a fixture-driven convergence problem:

1. Each runtime may emit different raw validator evidence.
2. Raw evidence is preserved for debugging.
3. A runtime-specific adapter converts raw evidence into structural error atoms.
4. Structural atoms map into governed repair categories.
5. CI compares only canonical repair receipts, never raw validator messages, raw error ordering, or implementation-specific object shape.

The fixture pack should deliberately include cases where Ajv and python-jsonschema expose different error trees, while the final receipt category set remains identical.

## Research basis

Current source review:

- JSON Schema 2020-12 defines recommended output structures and minimum information such as keyword location, instance location, error or annotation text, and nested results. Source: https://json-schema.org/draft/2020-12/json-schema-core
- Ajv exposes validation failures through its `errors` property; those errors are overwritten after each validation call, so raw capture must copy them immediately. Source: https://ajv.js.org/api.html
- python-jsonschema `ValidationError` carries structural fields including `validator`, `validator_value`, `path`, `schema_path`, `absolute_path`, `absolute_schema_path`, `context`, `parent`, and `message`. Source: https://python-jsonschema.readthedocs.io/en/stable/errors/
- RFC 8785 JSON Canonicalization Scheme exists because repeatable hashing/signing requires invariant JSON representation; it uses deterministic property sorting and strict JSON serialization constraints. Source: https://www.rfc-editor.org/rfc/rfc8785
- Modern JSON Schema validation has nontrivial evaluation complexity, especially around newer features such as dynamic references, so the first parity pack should stay deliberately narrow and avoid dynamic reference semantics until the baseline harness is stable. Source: https://arxiv.org/abs/2307.10034

## Useful concepts extracted

### 1. Parity target must be a canonical receipt, not a raw error list

Ajv and python-jsonschema expose different raw fields and nesting behavior. That means parity cannot mean identical raw JSON. Parity means:

- same fixture id;
- same schema id;
- same instance id;
- same governed category ids;
- same canonical JSON Pointer targets where applicable;
- same severity policy;
- same convergence status.

### 2. Raw mismatch is expected evidence, not failure

The pack should prove that raw runtime mismatch can be normal. A test should fail only when the normalized receipt diverges.

Expected raw mismatch examples:

- different message wording;
- different order of errors;
- different nested `context` trees;
- different params object shape;
- different schema path representation;
- different handling of compound keywords such as `anyOf`, `oneOf`, or `required`.

### 3. Fixture cases should be intentionally small

The first fixture pack should avoid broad schema-language coverage. It should include only cases needed to prove the convergence bridge:

- missing required field;
- wrong primitive type;
- additional property rejected;
- enum mismatch;
- nested object path error;
- array item type error;
- compound keyword branch failure.

### 4. Comparison must be category-set based

The first comparison rule should ignore raw order and compare a sorted category set:

- `missing_required_property`
- `type_mismatch`
- `unexpected_property`
- `enum_mismatch`
- `nested_path_violation`
- `array_item_violation`
- `compound_schema_no_match`

This gives the runner a stable target before adding richer repair semantics.

### 5. Canonicalization is a build boundary

Receipts should be serialized with byte-stable rules before diffing or hashing. The design should align with RFC 8785 principles even if the first implementation uses a simpler internal deterministic JSON writer.

## Proposed repository layout

```text
tools/agency-validation/
  fixtures/
    parity/
      README.md
      missing-required-field/
        schema.json
        invalid-instance.json
        expected-receipt.json
      wrong-primitive-type/
        schema.json
        invalid-instance.json
        expected-receipt.json
      additional-property/
        schema.json
        invalid-instance.json
        expected-receipt.json
      enum-mismatch/
        schema.json
        invalid-instance.json
        expected-receipt.json
      nested-object-path/
        schema.json
        invalid-instance.json
        expected-receipt.json
      array-item-type/
        schema.json
        invalid-instance.json
        expected-receipt.json
      compound-anyof-no-match/
        schema.json
        invalid-instance.json
        expected-receipt.json
  canonical_repair_receipt_generator.py
  canonical-repair-receipt-generator.mjs
  receipt-parity.test.py
  receipt-parity.test.mjs
```

## Minimal expected receipt shape

The parity fixture pack should not invent a second schema if `canonical-repair-receipt.v1.schema.json` already exists. It should instantiate that schema. If a minimal fixture-local example is needed, use this conceptual shape:

```json
{
  "receipt_version": "canonical-repair-receipt.v1",
  "fixture_id": "missing-required-field",
  "schema_id": "mc-fixture://parity/missing-required-field/schema.json",
  "instance_id": "mc-fixture://parity/missing-required-field/invalid-instance.json",
  "runtime": "runtime-independent-expected",
  "category_set": [
    {
      "category_id": "missing_required_property",
      "instance_location": "",
      "schema_keyword": "required",
      "evidence_policy": "structural-fields-only"
    }
  ],
  "comparison_policy": {
    "ignore_raw_message": true,
    "ignore_raw_error_order": true,
    "compare_category_set": true,
    "compare_instance_locations": true
  }
}
```

## Fixture definitions

### missing-required-field

Purpose: prove that missing required fields normalize to `missing_required_property`.

Schema concept:

- object;
- requires `name`;
- `name` is string.

Invalid instance:

- object with no `name`.

Expected category:

- `missing_required_property` at root instance location.

### wrong-primitive-type

Purpose: prove that primitive type failures normalize to `type_mismatch`.

Schema concept:

- property `age` must be integer.

Invalid instance:

- `age` is string.

Expected category:

- `type_mismatch` at `/age`.

### additional-property

Purpose: prove that excess object keys normalize to `unexpected_property`.

Schema concept:

- object allows only `mode`.
- `additionalProperties: false`.

Invalid instance:

- includes `mode` and `extra`.

Expected category:

- `unexpected_property` at root, with offending property recorded as bounded evidence.

### enum-mismatch

Purpose: prove that finite-set failure normalizes to `enum_mismatch`.

Schema concept:

- `tone` must be `neutral`, `symbolic`, or `scientific`.

Invalid instance:

- `tone` is `chaotic`.

Expected category:

- `enum_mismatch` at `/tone`.

### nested-object-path

Purpose: prove JSON Pointer generation across nested object paths.

Schema concept:

- `entry.body_signal.intensity` must be number.

Invalid instance:

- `entry.body_signal.intensity` is string.

Expected category:

- `type_mismatch` at `/entry/body_signal/intensity`.

### array-item-type

Purpose: prove array index pointer handling.

Schema concept:

- `tags` is array of strings.

Invalid instance:

- second tag is number.

Expected category:

- `array_item_violation` or `type_mismatch` at `/tags/1`; choose one governed category and keep both runtimes aligned.

Recommendation: use `type_mismatch` as the primary category and allow `array_item_violation` later as a derived reviewer hint, not a CI category.

### compound-anyof-no-match

Purpose: prove compound keyword failures normalize without binding to nested raw tree shape.

Schema concept:

- `value` must satisfy any one of:
  - string matching a pattern;
  - integer with minimum 1.

Invalid instance:

- `value` is false.

Expected category:

- `compound_schema_no_match` at `/value`.

The receipt may include bounded child evidence, but CI should compare only the top-level compound category for v1.

## Receipt comparison rules

The first parity tests should compare:

1. fixture id equality;
2. schema id equality;
3. instance id equality;
4. sorted `category_id + instance_location + schema_keyword` triples;
5. stable JSON serialization of the final receipt.

The first parity tests should not compare:

1. human-readable messages;
2. raw validator object order;
3. stack traces;
4. full invalid instance dumps;
5. full schema dumps;
6. nested raw `context` order.

## Implementation plan

### Step 1: Create fixture directories

Add the seven fixture folders listed above. Keep every schema and instance tiny.

### Step 2: Add expected receipts

Each fixture receives one runtime-independent `expected-receipt.json`.

### Step 3: Implement category extractor contract

Both Python and Node adapters should emit the same intermediate structural atom shape:

```json
{
  "keyword": "type",
  "instance_location": "/age",
  "schema_location": "/properties/age/type",
  "runtime": "python-jsonschema|ajv",
  "bounded_params": {}
}
```

### Step 4: Implement category map

A shared category map should translate keywords and bounded params into category ids:

- `required` -> `missing_required_property`
- `type` -> `type_mismatch`
- `additionalProperties` -> `unexpected_property`
- `enum` -> `enum_mismatch`
- `anyOf` / `oneOf` -> `compound_schema_no_match`

### Step 5: Add parity tests

Python test:

- load fixture schema and invalid instance through Python path authority;
- validate with local registry;
- serialize raw capture;
- generate receipt;
- compare to expected receipt after deterministic sorting.

Node test:

- load fixture schema and invalid instance through Node path authority;
- validate with Ajv local registry;
- serialize raw capture;
- generate receipt;
- compare to expected receipt after deterministic sorting.

### Step 6: Add negative test

One fixture should intentionally produce a wrong expected category in test-only memory, not committed as a bad fixture, to prove the comparator fails on category divergence.

## Acceptance criteria

- All fixture paths are repo-relative and pass path authority.
- No fixture loads network resources.
- Raw captures are written for both runtimes.
- Raw captures are allowed to differ.
- Canonical receipts match expected receipts.
- Receipt comparison ignores message text and raw order.
- Final receipt JSON is byte-stable across repeated local runs.
- The fixture pack contains no private personal content.

## Design decision

The first fixture pack should be boring by content and strict by structure. Its job is not to express MC meaning. Its job is to make the validation layer trustworthy enough that later symbolic/reflective artifacts can rely on it.

## Next architecture question

How should MC implement the shared `repair-category-map.v1.json` artifact so Python and Node use one governed category source instead of duplicating keyword-to-category logic in two runtimes?
