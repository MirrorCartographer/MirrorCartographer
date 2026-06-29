# Validator Error Normalization → Repair Receipt Categories

Date: 2026-06-29
Status: architecture pattern
Scope: public-safe MC Architecture Lab artifact

## Architecture question

How should Mirror Cartographer map raw JSON Schema validator errors into stable repair receipt categories across different validator libraries?

This follows the agency fixture validation work. The prior schema and validation-report contract made fixture failures reviewable, but the remaining weak point is portability: Ajv, python-jsonschema, and future validators expose different error object shapes, messages, nesting behavior, and terminology. MC should not let a library's raw error text become the product grammar.

## Research basis

Useful current/source concepts:

1. JSON Schema 2020-12 defines recommended validation output structures and says useful output should include keyword location, instance location, error or annotation, and nested results. This gives MC a standards-level target for the minimum normalized fields.
2. Ajv exposes errors as objects with `keyword`, `instancePath`, `schemaPath`, and keyword-specific `params`. These are useful but library-specific.
3. python-jsonschema exposes `ValidationError` fields such as `message`, `validator`, `validator_value`, `path`, `absolute_path`, `schema_path`, `absolute_schema_path`, `json_path`, and `context`. It explicitly notes that raw messages can be unhelpful for nested cases like `anyOf`.
4. W3C PROV frames provenance around entities, activities, and agents. For MC, a repair receipt should record the fixture entity, validation activity, validator agent, raw evidence, normalized category, and recommended repair.
5. Recent structured-output research continues to show that format validity and semantic correctness are separate concerns. For MC, schema validity means “reviewable artifact shape,” not “agency truth.”

## Decision

MC should introduce a validator adapter boundary:

Raw validator error → canonical error envelope → repair category → repair receipt → reviewer action.

The canonical envelope is MC-owned. Validator-specific objects are retained as evidence, but no downstream MC logic should depend directly on Ajv wording, python-jsonschema wording, or any one library's nested-error representation.

## Canonical error envelope v1

Each normalized error should be shaped conceptually like this:

- `source_library`: `ajv`, `python-jsonschema`, `other`
- `source_library_version`: optional string
- `schema_id`: schema `$id` or internal schema name
- `schema_version`: MC schema version when known
- `fixture_id`: fixture being validated
- `instance_pointer`: JSON Pointer to failed fixture location, or `/` for root
- `schema_pointer`: JSON Pointer to failed schema keyword, when available
- `keyword`: canonical JSON Schema keyword when available
- `raw_message`: original validator message, preserved for audit
- `raw_params`: source-specific details, preserved but not trusted as product grammar
- `nested_errors`: child normalized errors for `anyOf`, `oneOf`, `allOf`, `if/then/else`, and `$ref` contexts
- `repair_category`: MC category from the controlled set below
- `repair_hint`: one short action-oriented hint
- `severity`: `blocking`, `repairable`, or `advisory`
- `provenance`: validator run id, timestamp, schema hash, fixture hash, validator agent

## Repair category set v1

These categories intentionally describe what the reviewer or fixture author needs to repair, not the low-level validator implementation detail.

### 1. `missing_required_field`

Maps from keywords such as `required`.

Use when a fixture lacks a field the schema needs for deterministic checks or human review.

Repair receipt language:

“Add the missing field so the fixture can be reviewed consistently.”

### 2. `wrong_type`

Maps from `type` failures.

Use when a field exists but is the wrong JSON type.

Repair receipt language:

“Change the field type, not the meaning.”

### 3. `invalid_enum_value`

Maps from `enum` or constrained `const` failures.

Use when the value is outside MC’s controlled vocabulary, such as agency labels or severity labels.

Repair receipt language:

“Choose one allowed value from the controlled vocabulary.”

### 4. `format_or_pattern_mismatch`

Maps from `format`, `pattern`, `patternProperties`, or ID-shape failures.

Use when the content is present but not machine-addressable or not consistently named.

Repair receipt language:

“Keep the meaning, but repair the identifier or string shape.”

### 5. `range_or_length_violation`

Maps from `minLength`, `maxLength`, `minimum`, `maximum`, `minItems`, `maxItems`, `minProperties`, or `maxProperties`.

Use when the field is too short, too long, too small, too large, too sparse, or too crowded.

Repair receipt language:

“Resize the field so it stays useful without overloading review.”

### 6. `unexpected_field`

Maps from `additionalProperties` or `unevaluatedProperties` failures.

Use when a fixture includes fields outside the public schema contract.

Repair receipt language:

“Remove, rename, or move unsupported data into a permitted notes field.”

### 7. `array_item_shape_error`

Maps from `items`, `prefixItems`, `contains`, `uniqueItems`, and item-level nested failures.

Use when an array exists but one or more entries are malformed.

Repair receipt language:

“Repair the listed array item while preserving the surrounding fixture.”

### 8. `object_shape_error`

Maps from `properties`, `dependentRequired`, `dependentSchemas`, and object-level nested failures.

Use when an object exists but its internal structure is incomplete or inconsistent.

Repair receipt language:

“Repair the object structure before agency review.”

### 9. `conditional_rule_mismatch`

Maps from `if`, `then`, `else`, `dependentRequired`, and schema condition branches.

Use when one field choice activates a requirement that the fixture does not satisfy.

Repair receipt language:

“Align the dependent fields with the condition triggered by the fixture.”

### 10. `composition_no_match`

Maps from `anyOf`, `oneOf`, and `allOf` parent failures.

Use when the fixture fails to match required alternatives or combinations. Child errors must be preserved, because the parent message is usually too vague.

Repair receipt language:

“Review the child errors to decide which valid shape this fixture is trying to be.”

### 11. `reference_resolution_error`

Maps from `$ref`, `$dynamicRef`, resolver exceptions, missing schemas, and schema-loading failures.

Use when the validator cannot reach or resolve the schema target.

Repair receipt language:

“Repair schema linkage before judging the fixture.”

### 12. `schema_contract_error`

Maps from invalid schema / metaschema failures rather than invalid fixture failures.

Use when MC’s schema itself is broken.

Repair receipt language:

“Fix the schema contract; fixture review is blocked until the contract is valid.”

### 13. `validator_runtime_error`

Maps from crashes, unsupported features, network loading errors, plugin errors, or unsupported draft behavior.

Use when the validator run failed independently of fixture meaning.

Repair receipt language:

“Rerun with a supported validator configuration or record the validator limitation.”

### 14. `unknown_validation_error`

Fallback category.

Use only when no stable mapping exists. Preserve raw details and treat as blocking for automation, repairable for humans.

Repair receipt language:

“Human review needed; adapter could not classify this validator error.”

## Adapter mapping rules

### Ajv adapter

- `keyword` comes from `error.keyword`.
- `instance_pointer` comes from `error.instancePath`; empty string becomes `/`.
- `schema_pointer` comes from `error.schemaPath`.
- `raw_params` comes from `error.params`.
- `raw_message` comes from `error.message` when available.
- For missing required fields, use `params.missingProperty` to name the missing field.
- For additional properties, use `params.additionalProperty` to name the unsupported field.
- For nested composition errors, preserve all child errors if Ajv exposes them in the selected configuration; otherwise keep the parent as `composition_no_match` with raw evidence.

### python-jsonschema adapter

- `keyword` comes from `ValidationError.validator`.
- `instance_pointer` should prefer `absolute_path`, converted to JSON Pointer; if empty, use `/`.
- `schema_pointer` should prefer `absolute_schema_path`, converted to JSON Pointer.
- `raw_message` comes from `ValidationError.message`.
- `raw_params` should include `validator_value`, `cause` type if present, and compacted relevant context metadata.
- Nested `context` errors should be normalized recursively and attached to `nested_errors`.
- For `anyOf` / `oneOf` parent errors, do not trust the parent message alone; child context is required for a useful repair receipt.

## Severity policy

- `blocking`: schema cannot be trusted, reference cannot resolve, unknown validator runtime failure, or fixture is too malformed to review.
- `repairable`: normal fixture contract errors such as missing field, wrong type, invalid enum, unexpected field, bad array item, or conditional mismatch.
- `advisory`: non-blocking annotation or style issues, if MC later adds soft lint checks.

## Public-safe privacy rule

A repair receipt may quote field names, controlled vocabulary values, fixture IDs, and abstract scenario text. It should not quote private user content, raw reflective text, personal health details, contact details, or any emotionally specific material unless that material is synthetic and already public-safe.

If a raw validator error contains private fixture content, the adapter should redact the value and retain only:

- path
- type
- length/count
- controlled vocabulary mismatch
- abstract repair hint

## Prototype plan

1. Add `validator-adapter.contract.md` or a JSON Schema for `canonical-validation-error.v1`.
2. Implement two adapters:
   - `normalizeAjvError(error)`
   - `normalizePythonJsonschemaError(error)`
3. Create a small fixture test matrix:
   - missing field
   - wrong type
   - invalid enum
   - additional field
   - anyOf no match with nested child errors
   - reference resolution failure
   - invalid schema contract
4. Generate one repair report from Ajv and one from python-jsonschema.
5. Compare normalized reports. They should differ in raw evidence but converge on repair categories.
6. Add reviewer-facing copy rules so the report reads like a repair receipt, not a stack trace.

## Design pattern name

Stable Repair Category Adapter.

MC owns the meaning layer. Validators provide evidence, not language authority.

## Updated understanding

The validation report layer is an agency-preserving interface. If MC exposes raw validator messages, the user is forced to interpret tool noise. If MC hides all validator details, the repair trail becomes unverifiable. The stable adapter solves that split: raw errors remain attached as provenance, while the visible receipt uses MC-owned categories and repair language.

## Next research question

How should MC define `canonical-validation-error.v1` as a machine-readable schema and then generate paired Ajv/python-jsonschema test reports to prove the same broken fixture maps to the same repair category across libraries?
