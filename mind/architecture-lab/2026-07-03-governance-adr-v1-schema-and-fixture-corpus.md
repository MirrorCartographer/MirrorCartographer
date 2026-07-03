# Governance ADR v1 Schema and Fixture Corpus

## Architecture question

How should MC define `governance.adr.v1.schema.json` and the first ADR fixture corpus so ADR lifecycle rules, supersession edges, compatibility declarations, public-safety fields, and CI-enforcement obligations are schema-valid before ADR graph indexing begins?

## Research basis

Current ADR practice is strongest when it balances concise human rationale with structured lifecycle status. Recent ADR template comparison work found Nygard-style ADRs useful for concise objective decisions and MADR useful for more structural detail. MC needs both qualities: concise decision capture plus explicit machine-readable fields.

ISO/IEC/IEEE 42010 architecture-description practice emphasizes concerns, stakeholders, viewpoints, rationale, and consistency across views. For MC, the public-safe translation is: every governance decision should identify the system concern it addresses, avoid private source material, and make consistency obligations explicit.

JSON Schema Draft 2020-12 remains suitable for the first ADR contract because it supports strict object validation, composable definitions, and `unevaluatedProperties` for closed contracts with explicit extension points. Current JSON Schema research warns that modern features such as dynamic references add validation complexity; MC should avoid dynamic references in v1 governance schemas unless an ADR explicitly justifies them.

## Extracted concepts

- ADRs should be governance nodes, not only prose files.
- ADR lifecycle status must be explicit: `proposed`, `accepted`, `rejected`, `deprecated`, `superseded`.
- ADRs should link into lineage through `supersedes`, `superseded_by`, and `related_artifacts`.
- Public-safety is a schema field, not an afterthought.
- Compatibility classification belongs in the ADR because decisions often authorize compatibility boundaries.
- CI obligations should be recorded as stable check codes.
- ADRs should reject unknown top-level fields while preserving a governed `extensions` namespace.

## Implementation added

Added schema:

- `mind/schemas/governance.adr.v1.schema.json`

Added first passing fixture:

- `mind/fixtures/governance.adr.v1/pass-accepted-adr.json`

The fixture proves the initial accepted lifecycle path and establishes these stable check codes:

- `GOVERNANCE_ADR/SCHEMA_VALID`
- `GOVERNANCE_ADR/LIFECYCLE_VALID`
- `GOVERNANCE_ADR/PUBLIC_SAFE`
- `GOVERNANCE_ADR/GRAPH_INDEXABLE`

## Requirements update

1. Every accepted governance change must be backed by an accepted ADR or an explicit proposed ADR.
2. ADRs must be public-safe by construction: no names, private health details, raw personal material, exact locations, or private conversation fragments.
3. ADRs must classify compatibility impact.
4. ADRs must be graph-indexable through stable IDs and typed lineage references.
5. ADR validation must happen before graph indexing.
6. Unknown top-level fields are invalid; future experimentation must use a namespaced `extensions` object.

## Design consequence

The MC governance stack now gains a decision-control plane:

`governance change -> ADR -> schema validation -> lifecycle validation -> public-safety validation -> graph indexing -> CI policy`

This closes the gap between architecture notes and executable governance.

## Next architecture question

How should MC define ADR graph indexing rules so `governance.adr.v1` records become first-class nodes and edges in `governance.graph.v1`, including lifecycle transitions, supersession chains, compatibility boundaries, and failure checks for missing or invalid decision backing?
