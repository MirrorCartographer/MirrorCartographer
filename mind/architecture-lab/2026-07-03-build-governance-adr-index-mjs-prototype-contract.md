# Build Governance ADR Index Prototype Contract

Date: 2026-07-03
Status: proposed
Public-safety level: public-safe, abstracted
Artifact type: prototype plan + requirements update

## Architecture question

How should MC implement `build-governance-adr-index.mjs` so it scans `governance.adr.v1` records, emits `governance.adr.index.v1`, enforces public-safety abstraction, validates lifecycle transitions, and produces stable `GOVERNANCE_ADR_INDEX/*` checks before feeding ADR nodes into `governance.graph.v1`?

## Research basis

Current implementation guidance points toward a small deterministic compiler rather than a graph database or opaque automation layer.

Useful source concepts:

1. Node.js now exposes stable file-system primitives that can support direct repository scanning without a third-party graph/database dependency. `fs.globSync` is stable in current Node documentation and supports controlled pattern discovery for matching governance ADR records.
2. Ajv supports JSON Schema draft 2020-12, but that draft is not backwards compatible with earlier schema versions and must be loaded through the correct Ajv class. This means MC governance tools should use one explicit schema dialect per validation process.
3. W3C PROV defines provenance as information about entities, activities, and people involved in producing a data object, used to assess quality, reliability, and trustworthiness. MC should map ADR records into public-safe entities and decision activities, not personal/private narrative.
4. Recent schema-complexity research continues to caution against dynamic-reference-heavy schema designs for operational validation. MC should keep v1 executable schemas simple, closed, and fixture-driven.

## Decision

Implement the ADR index builder as a read-only deterministic compiler:

`governance.adr.v1 files -> validation -> semantic checks -> governance.adr.index.v1 -> check report`

The builder must not edit ADR source files. It may only emit derived index artifacts and machine-readable check reports.

## Proposed executable contract

Primary script:

`scripts/build-governance-adr-index.mjs`

Inputs:

- repository root
- ADR schema: `mind/schemas/governance.adr.v1.schema.json`
- ADR index schema: `mind/schemas/governance.adr.index.v1.schema.json`
- ADR records under approved roots, initially:
  - `mind/adr/**/*.json`
  - `mind/governance/adr/**/*.json`
  - `mind/fixtures/governance.adr.v1/**/*.json` only when fixture mode is enabled

Outputs:

- `mind/generated/governance.adr.index.v1.json`
- `mind/generated/checks/governance.adr.index.v1.checks.json`

The generated index should include:

- `index_schema_version`
- `generated_at`
- `source_roots`
- `source_file_count`
- `adr_count`
- `nodes`
- `edges`
- `checks`
- `input_hash`
- `index_hash`

## Determinism rules

- Normalize all file paths to POSIX-style relative paths.
- Sort discovered files lexicographically before reading.
- Sort ADR nodes by `adr_id`.
- Sort edges by `from`, then `type`, then `to`.
- Canonicalize JSON before hashing.
- Never use local timezone, random values, process order, filesystem mtime, or object insertion order as semantic inputs.
- When `generated_at` is present, it must be either supplied by CI as a fixed value or excluded from the hash input.

## ADR-to-index mapping

Each ADR becomes one node:

- `node_id = adr_id`
- `node_type = governance_adr`
- `status = proposed | accepted | superseded | rejected | deprecated`
- `title`
- `decision_date`
- `public_safety_class`
- `source_path`
- `content_hash`

Edges are derived from explicit ADR fields only:

- `supersedes`
- `superseded_by`
- `depends_on`
- `authorizes_change`
- `constrains_schema`
- `constrains_graph_semantics`
- `requires_fixture`
- `requires_ci_check`

The builder must not infer an edge from prose text.

## Public-safety abstraction gate

The builder should fail if an ADR attempts to embed private or personal material in governance fields. The v1 gate is intentionally conservative and structural rather than semantic.

Required checks:

- ADR must declare `public_safety.abstraction_level`.
- ADR must declare whether it contains personal, medical, location-specific, or private project material.
- Public governance ADRs must use abstract project terms, not person-specific narrative.
- Any ADR marked `private_source_material: true` must also include `public_summary` and `redaction_rationale`.
- Public index output must omit private raw fields and include only safe summaries.

Stable failure code:

`GOVERNANCE_ADR_INDEX/PUBLIC_SAFETY_ABSTRACTION_FAILED`

## Lifecycle validation

Schema validation proves shape. Lifecycle validation proves governance meaning.

Rules:

- `accepted` ADRs may authorize schema, graph, CI, or compatibility changes.
- `proposed` ADRs may be indexed but must not authorize enforcement changes unless explicitly marked experimental.
- `superseded` ADRs must include a valid `superseded_by` edge.
- `rejected` ADRs must not authorize changes.
- `deprecated` ADRs must include either replacement guidance or retirement rationale.
- Supersession chains must be acyclic.
- Every required fixture or CI check must resolve to an existing artifact or declared external reference.

## Stable check-code set

Initial check codes:

- `GOVERNANCE_ADR_INDEX/FILES_DISCOVERED`
- `GOVERNANCE_ADR_INDEX/SCHEMA_VALIDATION_FAILED`
- `GOVERNANCE_ADR_INDEX/DUPLICATE_ADR_ID`
- `GOVERNANCE_ADR_INDEX/MISSING_EDGE_ENDPOINT`
- `GOVERNANCE_ADR_INDEX/INVALID_LIFECYCLE_TRANSITION`
- `GOVERNANCE_ADR_INDEX/SUPERSESSION_CYCLE`
- `GOVERNANCE_ADR_INDEX/PUBLIC_SAFETY_ABSTRACTION_FAILED`
- `GOVERNANCE_ADR_INDEX/UNAUTHORIZED_ENFORCEMENT_CHANGE`
- `GOVERNANCE_ADR_INDEX/CANONICAL_HASH_MISMATCH`
- `GOVERNANCE_ADR_INDEX/INDEX_SCHEMA_VALIDATION_FAILED`

Every check object should include:

- `code`
- `status`: `pass | warn | fail`
- `message`
- `source_path`
- `adr_id` when available
- `details`

## Fixture plan

Minimum fixture corpus before implementation is considered complete:

1. Passing accepted ADR
   - one accepted ADR
   - one authorized schema change
   - one public-safe summary
   - expected one-node index

2. Missing edge endpoint
   - ADR references a nonexistent dependency
   - expected failure: `GOVERNANCE_ADR_INDEX/MISSING_EDGE_ENDPOINT`

3. Duplicate ADR ID
   - two files declare the same `adr_id`
   - expected failure: `GOVERNANCE_ADR_INDEX/DUPLICATE_ADR_ID`

4. Supersession cycle
   - ADR A supersedes B and B supersedes A
   - expected failure: `GOVERNANCE_ADR_INDEX/SUPERSESSION_CYCLE`

5. Public-safety failure
   - public ADR with undeclared private source material
   - expected failure: `GOVERNANCE_ADR_INDEX/PUBLIC_SAFETY_ABSTRACTION_FAILED`

## Prototype algorithm

1. Resolve repository root.
2. Load schemas with a single draft 2020-12 validator instance.
3. Discover candidate ADR JSON files from approved roots.
4. Sort paths deterministically.
5. Parse each JSON file.
6. Validate each ADR against `governance.adr.v1.schema.json`.
7. Build an in-memory map by `adr_id`.
8. Fail on duplicate IDs.
9. Build nodes from validated ADRs.
10. Build edges only from explicit relationship fields.
11. Validate edge endpoints.
12. Validate lifecycle rules.
13. Validate public-safety abstraction rules.
14. Detect supersession cycles.
15. Emit canonical sorted index.
16. Validate emitted index against `governance.adr.index.v1.schema.json`.
17. Emit check report.
18. Exit nonzero if any check has `status = fail`.

## Implementation constraints

- No graph database dependency.
- No network dependency.
- No implicit inference from prose.
- No private material in generated public index.
- No auto-fixing source files.
- No mixed JSON Schema dialects in one run.
- No nondeterministic ordering.

## Integration point

The ADR index feeds the wider governance graph builder as a derived source:

`governance.adr.index.v1 -> governance.graph.v1`

The full graph builder should treat ADR index nodes as first-class governance artifacts and should preserve these edge types:

- `authorizes_change`
- `supersedes`
- `depends_on`
- `constrains_schema`
- `requires_fixture`
- `requires_ci_check`

## Next research question

How should MC define `governance.adr.index.check.v1.schema.json` and a CI summary format so ADR index failures are machine-readable for tooling but also readable enough for a human maintainer to fix without inspecting raw validator internals?
