# Fixture-Pack Schema Authority

## Architecture question

How should MC define `fixture-pack.v1.schema.json` so manifest authority, repo-relative path safety, declared-runtime coverage, expected category-set ordering, and undeclared-file detection are enforceable before parity tests generate receipts?

## Research basis

Current JSON Schema 2020-12 matters here because the fixture pack is not just documentation. It is a validation boundary. The core specification defines output locations such as `keywordLocation`, `absoluteKeywordLocation`, and `instanceLocation`, and explicitly states that validation error wording is implementation-defined. That reinforces MC's rule that raw messages cannot define convergence.

The 2020-12 applicator vocabulary also makes modern validation order matter. `unevaluatedProperties` depends on annotations from adjacent applicators and object keywords, so the manifest schema should keep its own object model closed with `additionalProperties: false` instead of depending on ambiguous post-processing.

The existing MC receipt schema already expects fixture references, schema references, category-map references, canonical repair ordering, and guardrails that prevent messages or raw order from defining convergence. The new fixture-pack schema therefore belongs before receipt generation: it declares which files exist, which runtime captures must be present, and what category set the generated receipt must converge to.

## Useful concepts extracted

1. Manifest authority comes before receipt generation.

The manifest is the inventory of admissible fixture inputs and expected outputs. Parity tests should fail if a raw capture or expected receipt exists but is not declared by the manifest.

2. Repo-relative path safety is a schema-level precheck, not the whole trust boundary.

The schema rejects obvious unsafe path classes: absolute paths by construction, traversal segments, non-JSON paths, and files outside `mind/`. Canonical filesystem resolution remains the job of path authority in each runtime.

3. Runtime coverage is declared, not inferred.

Every fixture must declare exactly one Node/Ajv raw capture and exactly one Python/python-jsonschema raw capture. Raw validator shapes may differ; the fixture requires convergence only at the canonical repair category set.

4. Expected category sets are the comparison layer.

The manifest stores the sorted expected category set. Receipt byte comparison can exist later, but the first durable parity rule is category-set convergence independent of message wording and raw error order.

5. The manifest has negative space.

Each fixture must include public-safe statements of what it does not prove. This prevents infrastructure fixtures from being mistaken for symbolic, emotional, diagnostic, or private truth claims.

## Implemented durable artifact

Added `mind/schemas/fixture-pack.v1.schema.json`.

The schema defines:

- `schema_version: fixture-pack.v1`
- public-safe `fixture_pack_id` and `purpose`
- draft 2020-12 dialect lock
- `authority_policy` requiring the manifest to be the source of truth
- declared runtime coverage for `node`/`ajv` and `python`/`python-jsonschema`
- governed roots for fixtures, raw captures, expected receipts, schemas, and the repair-category map
- per-fixture instance path, schema ref, paired raw captures, expected receipt path, expected category set, and negative-space notes
- CI guardrails for manifest-first validation, path-authority validation, category comparison, missing/unexpected runtime captures, and no-network operation

Commit: `591a4339e48dea1323302775d91d9427eb1dbe1a`

## Change in understanding

The fixture pack is not sample data. It is the first enforceable inventory boundary for the cross-runtime convergence system.

Before this step, the flow was:

raw capture -> canonical receipt -> convergence report

After this step, the flow is:

fixture-pack manifest -> declared raw captures -> canonical receipt generation -> expected category-set comparison -> convergence report

This moves drift detection earlier. The system can now reject undeclared evidence before adapters produce receipts.

## Public-safety boundary

The schema only governs synthetic infrastructure fixtures and abstract validation evidence. It requires public-safe descriptions and negative-space notes. It does not store private user material, clinical claims, symbolic truth, or personal scenario content.

## Next implementation question

How should MC implement `fixture-pack.v1.json` plus the first `valid-empty` and `required-type-enum` fixture files so the manifest becomes executable by both Python and Node parity tests without network access?
