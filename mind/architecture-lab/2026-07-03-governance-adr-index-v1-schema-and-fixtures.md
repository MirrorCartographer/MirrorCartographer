# Governance ADR index v1 schema and fixture contract

## Architecture question researched

How should MC define `governance.adr.index.v1.schema.json` and the first ADR index fixture set so ADR-to-graph compilation can be tested independently from full governance graph generation?

## Current-source concepts extracted

1. JSON Schema Draft 2020-12 supports dialect identification, vocabularies, reusable `$defs`, and unevaluated-location controls. For MC, this means the ADR index can be a closed deterministic contract while still reusing small local definitions for ADR IDs, edge records, and CI check objects.

2. W3C PROV separates entities, activities, agents, and relationships such as generation, usage, and derivation. For MC, ADRs should be represented as governance decision entities whose edges authorize, constrain, supersede, or affect other artifacts rather than as unstructured prose.

3. MADR treats ADRs as explicit decision records with status and consequences. For MC, status is not just display text; it becomes a lifecycle field that indexing and CI can inspect.

4. GitHub Actions supports structured workflow annotations and CI-visible failure reporting. For MC, the ADR index should emit stable `GOVERNANCE_ADR_INDEX/*` check codes before a full graph compiler exists.

## Decision

Create `governance.adr.index.v1` as a generated, deterministic, public-safe ADR index contract.

ADR source records remain canonical. The ADR index is derived. It must not become a hand-authored replacement for ADR files.

## Added schema contract

Path: `mind/schemas/governance.adr.index.v1.schema.json`

Core fields:

- `schema_version`: fixed to `governance.adr.index.v1`
- `index_id`: stable generated index identifier
- `generated_at`: date-time for index generation; fixtures may pin this for deterministic tests
- `source_schema`: fixed to `governance.adr.v1`
- `source_count`: discovered ADR count
- `adrs`: sorted public-safe ADR summaries
- `edges`: sorted typed ADR relationship records
- `checks`: stable CI/result checks

Initial ADR edge types:

- `supersedes`
- `requires`
- `authorizes`
- `constrains`
- `derived_from`
- `affects_artifact`
- `validates_policy`

Initial stable check-code namespace:

- `GOVERNANCE_ADR_INDEX/ADRS_DISCOVERED`
- `GOVERNANCE_ADR_INDEX/EDGE_ENDPOINTS_RESOLVE`
- `GOVERNANCE_ADR_INDEX/PUBLIC_SAFETY_PRESENT`
- `GOVERNANCE_ADR_INDEX/DUPLICATE_ADR_ID`
- `GOVERNANCE_ADR_INDEX/STATUS_TRANSITION_VALID`
- `GOVERNANCE_ADR_INDEX/SUPERSESSION_CHAIN_VALID`

## Added fixtures

Passing fixture:

- `mind/fixtures/governance.adr.index.v1/pass-tiny-adr-index.json`

Negative fixture:

- `mind/fixtures/governance.adr.index.v1/fail-missing-edge-endpoint.json`

A duplicate-ID negative fixture is still required. The write attempt was blocked by the connector safety layer because the fixture intentionally repeated an identifier. The requirement is retained here so the next executable implementation can generate or encode that case safely.

## What changed in understanding

The ADR index should be its own intermediate artifact, not a hidden behavior inside `build-governance-graph.mjs`.

Previous model:

ADR files -> full governance graph

Refined model:

ADR files -> ADR index -> governance graph

This creates a smaller testing seam. ADR lifecycle, supersession, decision backing, and public-safety classification can be validated before graph-wide manifest indexing is introduced.

## Public-safety rule

The ADR index must only copy public-safe summaries and governance metadata. It must not copy private reasoning, personal content, raw conversation material, or identifying context into generated graph artifacts. Personal or sensitive origins should be represented as abstract provenance classes, not raw source material.

## Requirements added

1. ADR index generation is read-only.
2. ADR records are source-of-truth; indexes are derived.
3. ADR nodes are sorted by `adr_id` ascending.
4. ADR edges are sorted by `from`, then `type`, then `to` ascending.
5. Every ADR node must declare `public_safety_class`.
6. Every edge endpoint must resolve to an indexed ADR or declared governance artifact.
7. CI failure codes must use the `GOVERNANCE_ADR_INDEX/*` namespace.
8. The ADR index may be tested independently from the full governance graph builder.
9. Negative fixtures must cover missing edge endpoints, duplicate ADR ids, invalid lifecycle transitions, and broken supersession chains.

## Next architecture question

How should MC implement `build-governance-adr-index.mjs` so it scans `governance.adr.v1` records, emits `governance.adr.index.v1`, enforces public-safety abstraction, validates lifecycle transitions, and produces stable `GOVERNANCE_ADR_INDEX/*` checks before feeding ADR nodes into `governance.graph.v1`?
