# Governance Graph Query Schema + Fixture Contract

## Architecture question

How should MC define `governance.graph.query.v1.schema.json` and the first fixture corpus so query compatibility can be tested with schema validation, deterministic outputs, stable error codes, and historical fixture replay?

## Public-safe answer

MC should define a small JSON query document, not a general graph database language. The governance graph already has a constrained domain: artifact nodes, typed edges, lineage, compatibility, provenance, generated-by relationships, and fixtures. A full query language would add more power than the system needs and would make compatibility harder to protect.

The durable contract is:

1. validate query documents as JSON before execution,
2. keep selectors small and explicit,
3. allow bounded traversal only,
4. return deterministic ordered results,
5. treat query fixtures as compatibility artifacts,
6. route failures through stable machine-readable error codes.

## Research basis

Current external patterns point toward a limited, typed selector contract:

- JSON Schema Draft 2020-12 supports explicit dialect declaration, structural validation, references, and controlled extension. MC should use this for the query document contract.
- JSONPath RFC 9535 defines a standardized way to select values from JSON. MC should borrow the idea of selector precision, but not expose arbitrary JSONPath as the governance query language in v1.
- GraphQL selection sets show the value of explicit projection: clients ask for specific fields rather than receiving unstable full objects.
- SPARQL property paths show the value and risk of graph traversal. MC should borrow bounded typed-edge traversal, but avoid open-ended path expressions in v1.

## Implemented artifacts

Added:

- `mind/schemas/governance.graph.query.v1.schema.json`
- `mind/fixtures/governance.graph.query.v1/select-schema-nodes.fixture.json`
- `mind/fixtures/governance.graph.query.v1/traverse-schema-lineage.fixture.json`
- `mind/fixtures/governance.graph.query.v1/fail-unknown-edge-type.fixture.json`

## Schema shape

`governance.graph.query.v1` defines:

- `query_version`
- `query_id`
- `description`
- `operation`
  - `select_nodes`
  - `select_edges`
  - `traverse`
- `select`
  - `target`
  - `where`
  - `order_by`
  - `limit`
- `traverse`
  - `start_artifact_id`
  - `direction`
  - `edge_types`
  - `max_depth`
  - `include_start`
- `project`
- `expect`
  - `status`
  - `deterministic_order`
  - `error_code`
  - `result_shape`

## Initial edge vocabulary

The v1 query schema only permits the current governance graph edge vocabulary:

- `supersedes`
- `derived_from`
- `validated_against`
- `compatible_with`
- `generated_by`
- `uses_fixture`

New edge types are schema changes, not casual runtime options.

## Fixture corpus rule

Every fixture must prove one contract boundary:

- positive node selection,
- positive edge selection or traversal,
- negative schema rejection,
- stable error-code routing,
- deterministic ordering.

Fixtures are not examples. They are executable compatibility witnesses.

## Determinism rule

Query outputs must be ordered by explicit stable fields. If a query omits ordering, the executor must apply the schema default order for the selected target.

No query result may depend on filesystem traversal order, object key insertion order, GitHub API response order, or operating system directory order.

## Failure-code namespace

Query failures use:

`GOVERNANCE_GRAPH_QUERY/*`

Initial reserved codes:

- `GOVERNANCE_GRAPH_QUERY/INVALID_QUERY_DOCUMENT`
- `GOVERNANCE_GRAPH_QUERY/INVALID_EDGE_TYPE`
- `GOVERNANCE_GRAPH_QUERY/UNKNOWN_ARTIFACT_ID`
- `GOVERNANCE_GRAPH_QUERY/UNSUPPORTED_OPERATION`
- `GOVERNANCE_GRAPH_QUERY/TRAVERSAL_DEPTH_EXCEEDED`
- `GOVERNANCE_GRAPH_QUERY/NON_DETERMINISTIC_OUTPUT`

## Non-goals

v1 does not include:

- arbitrary JSONPath execution,
- arbitrary GraphQL-like nesting,
- SPARQL-style open path expressions,
- mutation operations,
- runtime graph editing,
- personal or private material in fixtures,
- filesystem path dependence as identity.

## Architectural refinement

Previous architecture:

`governance.graph.v1.json -> each tool invents its own traversal logic`

New architecture:

`governance.graph.v1.json -> governance.graph.query.v1 -> fixture replay -> stable CI behavior`

The query layer is now a membrane between the graph and its consumers. CI, visualization, roadmap generation, documentation, and provenance analysis should all use the same query document contract rather than each interpreting the graph independently.

## Implementation notes

The first executor should be deliberately small:

1. read `governance.graph.v1.json`,
2. read one query fixture,
3. validate fixture against `governance.graph.query.v1.schema.json`,
4. execute only the declared operation,
5. sort deterministically,
6. project only requested fields,
7. emit a JSON result object,
8. compare result shape and status against `expect`.

The executor should not import private context, call network APIs, mutate manifests, or regenerate the graph.

## Next research question

How should MC define `governance.graph.query.result.v1.schema.json` so every query execution emits a stable machine-readable result envelope containing status, error codes, selected records, traversal metadata, input graph hash, query hash, and deterministic-order proof?
