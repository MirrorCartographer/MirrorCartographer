# Claim Dependency Graph Exporter

Public-safe executable Mirror Cartographer component for collaboration readiness and evidence-boundary routing.

## Purpose

Discovery work fails when claims, observations, hypotheses, contradictions, and review packets are stored as flat notes. This exporter converts bounded claim packets into a dependency graph so reviewers can see what a claim depends on before it is promoted.

The graph answers:

- What observations support this hypothesis?
- What contradictions must be resolved first?
- Which packets are blocked by privacy, missingness, or unsafe claim status?
- Which nodes are ready for collaborator review?

## Input shape

A JSON object:

- `run_id`: string
- `packets`: array of public-safe packets

Packet fields:

- `id`: stable string identifier
- `kind`: `observation`, `literature_note`, `animal_care_note`, `hypothesis`, `contradiction`, `review_packet`, or `falsification_task`
- `title`: public-safe title
- `claim_status`: `observation`, `hypothesis_seed`, `review_candidate`, `advice`, or `cure_claim`
- `privacy_status`: `public_safe`, `synthetic`, `redacted`, `private`, or `unknown`
- `source_status`: `synthetic`, `user_observation`, `public_literature`, `expert_review`, or `unknown`
- `missingness`: array of strings
- `depends_on`: array of packet ids
- `contradicts`: array of packet ids
- `next_action`: string

## Output shape

A JSON object:

- `run_id`
- `nodes`: normalized graph nodes
- `edges`: dependency and contradiction edges
- `blocked_nodes`: nodes blocked from export
- `review_ready_nodes`: nodes that can be exported for collaborator review
- `summary`: graph counts

## Acceptance criteria

1. Blocks private or unknown privacy states.
2. Blocks advice and cure-claim statuses.
3. Requires explicit missingness arrays.
4. Flags unresolved dependencies that point to absent packet ids.
5. Emits deterministic JSON.
6. Produces graph edges for both `depends_on` and `contradicts`.

## Test command

`python tools/claim_dependency_graph_exporter/test_export_claim_dependency_graph.py`
