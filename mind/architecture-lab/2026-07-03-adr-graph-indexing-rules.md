# ADR Graph Indexing Rules

Status: Proposed
Date: 2026-07-03
Artifact type: Architecture design pattern + requirements update
Public-safety level: Public-safe; no personal or private source material included.

## Architecture question

How should Mirror Cartographer make Architecture Decision Records first-class nodes and edges in `governance.graph.v1`, including lifecycle transitions, supersession chains, compatibility boundaries, and failure checks for missing or invalid decision backing?

## Research basis

This note extracts concepts from four current/public architecture and implementation sources:

1. W3C PROV overview: provenance should represent entities, activities, agents, derivation, generation, versioning, reproducibility, and validation constraints.
2. JSON Schema Draft 2020-12: schema contracts should define document shape explicitly and remain tool-validated rather than implied by prose.
3. MADR: decision records should include status, context, considered options, decision outcome, consequences, and lifecycle transitions such as accepted or superseded.
4. GitHub Actions workflow commands: CI should emit stable machine-readable failure and notice messages rather than relying only on free-form logs.

## Core finding

An ADR should not be treated as a document that merely explains a change. In MC governance, an ADR is a decision artifact that can authorize, constrain, supersede, or invalidate other artifacts.

Therefore ADRs need graph semantics.

## Design pattern

ADR indexing is a deterministic compiler pass:

```text
ADR JSON records
        ↓
ADR schema validation
        ↓
ADR lifecycle validation
        ↓
ADR-to-graph node mapping
        ↓
ADR-to-graph edge mapping
        ↓
policy checks for decision backing
        ↓
governance.graph.v1
```

The ADR indexer must be read-only. It reads ADR records and manifests, emits graph nodes and edges, and reports checks. It must never rewrite ADRs or infer undocumented decisions.

## Node model

Every valid ADR becomes a graph node.

Required node fields:

- `node_id`: stable ADR artifact id
- `node_type`: `governance_adr`
- `schema_id`: `governance.adr.v1`
- `version`: ADR artifact version
- `status`: one of the allowed ADR lifecycle states
- `title`: public-safe decision title
- `decision_date`: ISO date
- `public_safety`: declared public-safety classification
- `hash`: canonical content hash

Recommended lifecycle states for v1:

- `proposed`
- `accepted`
- `rejected`
- `deprecated`
- `superseded`

Only `accepted`, `deprecated`, and `superseded` ADRs may serve as historical decision backing. `proposed` ADRs are visible but non-authorizing. `rejected` ADRs are visible but explicitly non-authorizing.

## Edge model

ADR edges are typed governance relationships. Initial edge types:

| Edge type | From | To | Meaning |
|---|---|---|---|
| `decides` | ADR | artifact or rule | ADR authorizes the target design/rule. |
| `supersedes_decision` | ADR | ADR | New ADR replaces an older ADR. |
| `depends_on_decision` | ADR | ADR | ADR depends on another accepted decision. |
| `introduces_compatibility_boundary` | ADR | artifact/schema | ADR declares an intentional breaking boundary. |
| `requires_ci_check` | ADR | check code | ADR mandates an enforcement check. |
| `documents_exception` | ADR | artifact/check | ADR records a governed exception. |
| `derived_from_decision` | artifact | ADR | Artifact exists because of a decision. |

All edges must be deterministic and explicit. The graph builder must not create decision edges from filename similarity, directory placement, or title matching.

## Lifecycle transition rules

Allowed transitions:

- `proposed → accepted`
- `proposed → rejected`
- `accepted → deprecated`
- `accepted → superseded`
- `deprecated → superseded`

Disallowed transitions:

- `rejected → accepted` without a new ADR id
- `superseded → accepted`
- `deprecated → accepted`
- any transition that deletes historical decision backing

A superseded ADR remains in the graph. Supersession adds an edge; it does not erase the old node.

## Decision-backing policy

Some governance changes require ADR backing before merge.

ADR backing required for:

- new governance schema
- breaking schema change
- new compatibility class
- new graph edge type
- new manifest extension namespace
- new CI policy gate
- public-safety classification rule change
- disabling or weakening a validation check

ADR backing optional for:

- typo fixes
- non-semantic documentation clarification
- fixture additions that do not alter policy
- additional examples that conform to current rules

## Failure checks

The graph/ADR indexer should emit stable check codes.

Initial ADR check codes:

- `GOVERNANCE_ADR/VALID_ADR_SCHEMA`
- `GOVERNANCE_ADR/DUPLICATE_ADR_ID`
- `GOVERNANCE_ADR/INVALID_LIFECYCLE_STATUS`
- `GOVERNANCE_ADR/INVALID_LIFECYCLE_TRANSITION`
- `GOVERNANCE_ADR/MISSING_SUPERSEDED_TARGET`
- `GOVERNANCE_ADR/SUPERSESSION_CYCLE`
- `GOVERNANCE_ADR/MISSING_DECISION_BACKING`
- `GOVERNANCE_ADR/REJECTED_DECISION_USED_AS_BACKING`
- `GOVERNANCE_ADR/PROPOSED_DECISION_USED_AS_BACKING`
- `GOVERNANCE_ADR/UNKNOWN_DECISION_EDGE_TYPE`
- `GOVERNANCE_ADR/PUBLIC_SAFETY_FIELD_MISSING`

Check result shape:

```json
{
  "code": "GOVERNANCE_ADR/MISSING_DECISION_BACKING",
  "status": "fail",
  "severity": "error",
  "subject": "artifact_id_or_path",
  "message": "Governance artifact changes an enforced rule but references no accepted ADR."
}
```

## Graph invariants

ADR indexing must preserve these invariants:

1. ADR ids are globally unique.
2. ADR nodes are immutable once published.
3. Supersession is represented as an edge, not deletion.
4. Rejected decisions remain queryable as negative design history.
5. Accepted decisions can authorize downstream governance artifacts.
6. Proposed decisions cannot authorize merge-blocking governance changes.
7. Supersession chains must be acyclic.
8. Public-safety metadata is required before an ADR enters the graph.
9. Every new graph edge type must itself be ADR-backed.
10. CI must fail if a governed artifact change lacks valid decision backing.

## Implementation requirements

Add an ADR indexing stage after manifest discovery and before final graph emission:

```text
scan manifests
scan ADR records
validate schemas
validate ADR lifecycle
map ADR nodes
map ADR edges
validate decision backing
emit graph
emit checks
```

The indexer must produce deterministic output:

- sort ADR nodes by `node_id`
- sort edges by `from`, `edge_type`, `to`
- sort check codes lexicographically
- hash canonical JSON rather than raw source formatting
- never include local filesystem paths in public graph output except normalized repository-relative paths where necessary

## Minimal prototype fixture set

Create these fixtures next:

1. `pass-accepted-adr-node.json`
   - one accepted ADR becomes one graph node.

2. `pass-superseded-adr-chain.json`
   - one accepted ADR supersedes another with no cycle.

3. `fail-proposed-decision-used-as-backing.json`
   - a proposed ADR attempts to authorize a governance rule.

4. `fail-supercession-cycle.json`
   - two ADRs supersede each other.

5. `fail-missing-decision-backing.json`
   - a schema-breaking governance artifact has no accepted ADR reference.

## Resulting architecture refinement

Before this pattern:

```text
ADR = note explaining why a decision happened
```

After this pattern:

```text
ADR = graph node + lifecycle state + authorization edge + CI policy input
```

This makes decisions durable, queryable, enforceable, and inspectable.

## Next research question

How should MC define `governance.adr.index.v1.schema.json` and the first ADR index fixture set so ADR-to-graph compilation can be tested independently from full governance graph generation?

## References

- W3C PROV Overview: https://www.w3.org/TR/prov-overview/
- JSON Schema Draft 2020-12 Core: https://json-schema.org/draft/2020-12/json-schema-core
- MADR: https://adr.github.io/madr/
- GitHub Actions workflow commands: https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-commands
