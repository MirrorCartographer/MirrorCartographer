# Shared repair category map governance

## Architecture question

How should MC implement the shared `repair-category-map.v1.json` artifact so Python and Node use one governed category source instead of duplicating keyword-to-category logic in two runtimes?

## Research basis

Current sources reviewed:

- JSON Schema Draft 2020-12 output structure defines machine-readable output locations such as `keywordLocation`, `absoluteKeywordLocation`, `instanceLocation`, nested `errors`, and output validation schemas.
- Ajv exposes structured error fields including `keyword`, `instancePath`, `schemaPath`, and keyword-dependent `params`; `message` is optional and should not define convergence.
- python-jsonschema exposes `ValidationError.validator`, `validator_value`, `absolute_path`, `absolute_schema_path`, `context`, and related structural fields; message text is human-readable debugging evidence, not a stable adapter contract.
- RFC 8785 JCS sorts object properties recursively while preserving array order, which fits MC's byte-stable receipt and map-hash requirement.
- Modern JSON Schema can be complex around dynamic references and annotation-dependent validation, so MC should keep the first map small, explicit, and governed rather than pretending all validator disagreements are content judgments.

## Understanding change

The category map is not just a lookup table. It is a governance boundary between raw validator evidence and canonical repair receipts.

Previous model:

raw validator capture -> adapter-specific keyword logic -> canonical receipt

Corrected model:

raw validator capture -> normalized structural error atom -> shared governed category map -> canonical repair receipt

This makes convergence testable. Python and Node may disagree in raw shape, nesting, path style, message wording, or params, but they must use the same category source before CI compares receipts.

## Durable implementation already present

The repository now has the two core public-safe governance artifacts:

- `mind/schemas/repair-category-map.v1.schema.json`
- `mind/config/repair-category-map.v1.json`

The schema defines the governed shape of the map. The config defines active categories and keyword mappings including missing required fields, wrong types, closed vocabulary mismatches, format boundaries, pattern/shape mismatches, extra fields, array cardinality/uniqueness, bounds, compound schema boundaries, schema reference/dialect problems, validator convergence gaps, and unmapped validator signals.

## Design pattern

### Pattern name

Single-source repair-category governance

### Rule

Adapters may normalize raw validator evidence, but they must not own category semantics.

### Allowed adapter responsibilities

- Convert runtime-specific path fields into RFC 6901-style JSON Pointer locations.
- Preserve raw keyword, schema pointer, instance pointer, params, validator value, and nested context where available.
- Load `mind/config/repair-category-map.v1.json` through the same repo-relative path authority used for schemas and fixtures.
- Select a category only from `keyword_mappings` or the declared fallback policy.
- Emit mapping confidence from the map, not from local runtime heuristics.

### Forbidden adapter responsibilities

- Mapping based on human-readable error messages.
- Creating runtime-local category tables.
- Silently inventing categories for unknown validator keywords.
- Treating validator agreement as symbolic, psychological, safety, or truth authority.
- Embedding private fixture meaning inside category definitions.

## Implementation requirements

1. Add a map loader in both runtimes.
   - Node: load `mind/config/repair-category-map.v1.json` through `path-authority.mjs`.
   - Python: load the same file through `python_path_authority.py`.

2. Validate the map before use.
   - Validate `mind/config/repair-category-map.v1.json` against `mind/schemas/repair-category-map.v1.schema.json`.
   - Fail before fixture validation if the map is invalid.

3. Convert raw errors to structural atoms.
   - Required fields: `validator_id`, `raw_error_id`, `keyword`, `instance_pointer`, `schema_pointer` when available.
   - Optional fields: `params`, `validator_value_summary`, `context_keywords`, `message_summary`.
   - Message summaries are debug-only and must not be mapping inputs.

4. Map atoms to categories.
   - Use exact normalized keyword match first.
   - Use contextual rules only where `mapping_confidence` is `contextual` or `boundary`.
   - Unknown keywords map to `unmapped_validator_signal` and require review.

5. Include the map hash in every canonical repair receipt.
   - The existing `canonical-repair-receipt.v1.schema.json` already requires `repair_category_map_ref.config_hash`.
   - This binds each receipt to the category source used for mapping.

6. Compare receipts at category-set level first.
   - CI should compare canonical category IDs and stable repair locations.
   - CI should not compare raw message text, raw error order, or runtime-specific params.

## Public-safety boundary

This map may describe structural contract failures only. It must not include personal scenarios, therapeutic claims, diagnosis, symbolic truth, or private user meaning. Fixture-specific content belongs in raw test fixtures and reviewer notes only when public-safe; category definitions stay abstract.

## Prototype plan

Next implementation should add:

- `tools/agency-validation/repair-category-map-loader.mjs`
- `tools/agency-validation/python_repair_category_map_loader.py`
- tests proving both runtimes load the same category IDs in the same declared order
- tests proving unknown keywords map to `unmapped_validator_signal`
- tests proving message text changes do not alter category mapping
- a fixture pair where Ajv and python-jsonschema raw shapes differ but both converge to the same canonical category set

## Acceptance criteria

- The map validates before any receipt generator runs.
- Both runtimes reject missing, invalid, or path-escaped map files.
- Both runtimes report identical active category IDs and keyword mappings.
- Unknown keywords produce review-required fallback receipts, not silent success.
- Changing only error message text produces identical canonical category outputs.
- The convergence report cites the map path and hash.

## Next research question

How should MC implement the dual-runtime repair-category map loaders and first parity tests so both adapters prove they are using the same governed category source before generating canonical repair receipts?
