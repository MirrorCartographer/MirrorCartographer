# Governance graph v1 schema and fixture contract

## Architecture question

How should MC define `governance.graph.v1.schema.json` and the first tiny graph fixture so the graph query runner has a stable graph input contract before implementation lands?

## Research basis

The useful current references converge on four constraints:

1. JSON Schema Draft 2020-12 is the right contract surface for a small JSON document because it defines a JSON media type for describing document structure, assertions, annotations, dialects, and expected validation output.
2. RFC 8785 JSON Canonicalization Scheme gives MC a stable way to describe deterministic JSON hashing, which matters because the governance graph is a generated artifact that should be reproducible.
3. Graph APIs such as graphlib separate graph structure from graph algorithms like topological sorting and acyclicity checks. MC should encode structure in JSON and leave graph algorithms to the verifier/query runner.
4. Existing graph interchange formats show the basic portable pattern: nodes carry IDs, edges reference node IDs, and edge labels carry relationship semantics. MC does not need a full graph database or a broad interchange standard for this layer.

## Extracted concepts

- The graph is a generated index, not the source of truth.
- Manifests remain authoritative; the graph is derived from manifest records.
- The graph schema should validate shape only.
- Referential integrity, duplicate node detection, acyclicity, deterministic ordering, and hash correctness are semantic checks emitted in `checks[]`.
- Nodes are keyed by immutable `artifact_id`.
- Edges are typed relationships between artifact IDs.
- Ordering is part of the contract because query results and hash calculation must be deterministic.
- The first fixture should be tiny, public-safe, and artificial: enough to prove node shape, edge shape, ordering fields, integrity fields, and successful checks without encoding private project material.

## Implementation added

Added schema:

- `mind/schemas/governance.graph.v1.schema.json`

Added first fixture:

- `mind/fixtures/governance.graph.v1/pass-tiny-graph.json`

The schema defines:

- `graph_version`
- `kind`
- `generated_at`
- `generator`
- `integrity`
- `ordering`
- `nodes`
- `edges`
- `checks`

Initial edge relations:

- `supersedes`
- `derived_from`
- `validated_against`
- `compatible_with`
- `generated_by`
- `uses_fixture`

Initial graph check codes:

- `GOVERNANCE_GRAPH/SCHEMA_VALID`
- `GOVERNANCE_GRAPH/NODE_IDS_UNIQUE`
- `GOVERNANCE_GRAPH/EDGE_REFERENCES_RESOLVE`
- `GOVERNANCE_GRAPH/LINEAGE_ACYCLIC`
- `GOVERNANCE_GRAPH/ORDERING_DETERMINISTIC`
- `GOVERNANCE_GRAPH/HASH_PRESENT`

## Durable architecture decision

`governance.graph.v1` is the stable input contract for the future query runner. It should not become a graph database export, a visualization-specific format, or a mutable registry. It is a deterministic derived document that lets CI, query execution, provenance analysis, and visualization consume the same graph without each inventing a separate interpretation.

## Consequences

The future runner can now assume one canonical input shape:

1. Load `governance.graph.v1.json` or a fixture.
2. Validate it against `mind/schemas/governance.graph.v1.schema.json`.
3. Verify semantic graph checks in deterministic order.
4. Execute `governance.graph.query.v1` against the validated graph.
5. Emit `governance.graph.query.result.v1`.

The split is important: schema validation proves shape; graph verification proves meaning.

## Next question

How should MC implement `build-governance-graph.mjs` so it scans `artifact.manifest.v1` files, emits `governance.graph.v1`, computes RFC 8785-compatible hashes, sorts nodes and edges deterministically, and reports stable `GOVERNANCE_GRAPH/*` check codes without depending on a graph database?
