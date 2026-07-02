# Governance Graph Query Result Envelope v1

## Architecture question

How should MC define `governance.graph.query.result.v1.schema.json` so every query execution emits a stable result envelope with status, error codes, records, traversal metadata, graph hash, query hash, and deterministic-order proof?

## Research basis

Current sources reviewed:

- JSON Schema Draft 2020-12 core specification and output-structure guidance.
- JSONPath RFC 9535 for selector discipline and predictable query semantics over JSON documents.
- RFC 8785 JSON Canonicalization Scheme for deterministic JSON hashing.
- Recent JSON Schema research on inclusion and compatibility reasoning, including 2026 work on schema inclusion through refutational normalization.

## Useful concepts extracted

1. Query results need an envelope, not bare records.
   Bare arrays cannot carry enough machine-readable proof for CI, compatibility replay, or visualization.

2. Result identity has two roots: graph identity and query identity.
   A result is only meaningful if it records both the graph hash and query hash that produced it.

3. Determinism must be explicit.
   The result should record canonicalization strategy, ordering keys, ordering direction, and a result hash.

4. Traversal must be bounded and reported.
   Graph traversal needs mode, direction, maximum depth, visited node count, visited edge count, and truncation state.

5. Diagnostics should be stable machine codes.
   Human messages can change. CI routing should depend on `diagnostics[].code`, not stderr text.

6. JSON Schema validation should precede semantic assertions.
   Consumers should first prove the result envelope is structurally valid, then assert business rules.

## Durable change added

Added schema:

- `mind/schemas/governance.graph.query.result.v1.schema.json`

Added fixture:

- `mind/fixtures/governance.graph.query.result.v1/pass-empty-result.json`

## Contract shape

The result envelope now has these required sections:

- `result_version`
- `status`
- `exit_code`
- `graph`
- `query`
- `determinism`
- `records`
- `traversal`
- `diagnostics`

## Design rule

A governance graph query implementation must never return raw records as its top-level output. It must return a versioned result envelope that proves:

- what graph was queried,
- what query was executed,
- how records were ordered,
- whether traversal was bounded or truncated,
- what stable diagnostic codes were emitted,
- and what canonical result hash was produced.

## CI implication

The first CI contract should validate the fixture against the schema before any query engine exists. The schema and fixture become the stable target for the future executable query runner.

## Next architecture question

How should MC define the first deterministic `run-governance-graph-query.mjs` prototype so it loads `governance.graph.v1.json`, validates `governance.graph.query.v1`, emits `governance.graph.query.result.v1`, and proves fixture replay without introducing a graph database dependency?
