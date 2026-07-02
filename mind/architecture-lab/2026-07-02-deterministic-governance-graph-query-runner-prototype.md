# Deterministic Governance Graph Query Runner Prototype

## Architecture question

How should MC define the first deterministic `run-governance-graph-query.mjs` prototype so it loads `governance.graph.v1.json`, validates `governance.graph.query.v1`, emits `governance.graph.query.result.v1`, and proves fixture replay without introducing a graph database dependency?

## Research basis

Current sources reviewed:

- Node.js process documentation for process-level exit behavior and `process.exitCode`.
  - https://nodejs.org/api/process.html
- Node.js test runner documentation for built-in fixture replay and subprocess-style contract testing without adding Jest/Mocha.
  - https://nodejs.org/api/test.html
- JSON Schema Draft 2020-12 core specification for explicit schema identity and schema-driven validation boundaries.
  - https://json-schema.org/draft/2020-12/json-schema-core
- RFC 8785 JSON Canonicalization Scheme for deterministic JSON serialization and hash-stable output.
  - https://www.rfc-editor.org/rfc/rfc8785

Existing MC substrate reviewed:

- `mind/schemas/governance.graph.query.v1.schema.json`
- `mind/schemas/governance.graph.query.result.v1.schema.json`
- `mind/architecture-lab/2026-07-02-governance-graph-query-result-envelope-schema.md`

## Useful concepts extracted

1. **The runner is a contract executor, not a graph database.**
   The first implementation should operate over a generated JSON graph document in memory. It should not introduce Neo4j, RDF, SPARQL runtime, SQLite, or a general graph query dependency.

2. **Validation is a boundary, not an implementation detail.**
   The runner has three validation boundaries:
   - input graph shape,
   - input query shape,
   - output result-envelope shape.

3. **The result envelope is the stable API.**
   Consumers should not parse stdout prose. The runner emits one JSON envelope matching `governance.graph.query.result.v1` and exits with a coarse process code.

4. **The query language remains intentionally tiny.**
   MC already has `select_nodes`, `select_edges`, and `traverse`. The runner should implement only those operations. Any pressure to add joins, aggregation, mutation, or arbitrary expressions should be deferred until fixtures prove the need.

5. **Determinism must be observable.**
   The result must include graph hash, query hash, ordering keys, traversal counters, truncation state, and result hash. These are not optional diagnostics; they are the proof that the same graph plus same query produced the same result.

6. **Fixture replay is the first trust mechanism.**
   The runner is only useful if tests can replay known graph/query/result fixtures and prove stable records, stable diagnostics, and stable exit codes.

## Prototype scope

Create a dependency-light Node.js script:

- `scripts/run-governance-graph-query.mjs`

Expected invocation:

- `node scripts/run-governance-graph-query.mjs --graph mind/generated/governance.graph.v1.json --query mind/fixtures/governance.graph.query.v1/<fixture>.json`

The command writes exactly one JSON result envelope to stdout.

Errors still produce a result envelope when possible. Fatal pre-envelope errors are limited to unreadable runtime conditions, such as missing script arguments or inability to read both graph and query inputs.

## Required execution phases

### 1. Parse arguments

Required flags:

- `--graph <path>`
- `--query <path>`

Optional flag for fixture testing:

- `--pretty` for human-readable output while preserving deterministic key ordering.

Out of scope:

- mutation flags,
- network loading,
- repository writes,
- graph regeneration.

### 2. Read files

Read graph and query files as UTF-8 text.

Failure classes:

- `GOVERNANCE_GRAPH_QUERY_RESULT/MISSING_GRAPH_INPUT`
- `GOVERNANCE_GRAPH_QUERY_RESULT/MISSING_QUERY_INPUT`
- `GOVERNANCE_GRAPH_QUERY_RESULT/GRAPH_READ_FAILED`
- `GOVERNANCE_GRAPH_QUERY_RESULT/QUERY_READ_FAILED`
- `GOVERNANCE_GRAPH_QUERY_RESULT/GRAPH_JSON_PARSE_FAILED`
- `GOVERNANCE_GRAPH_QUERY_RESULT/QUERY_JSON_PARSE_FAILED`

### 3. Canonicalize and hash inputs

Use one deterministic JSON canonicalization strategy.

Preferred long-term target:

- `jcs-rfc8785`

Acceptable first prototype fallback:

- `mc-stable-json-v1`

The fallback must be documented as a local stable sort of object keys plus deterministic array preservation. It must not pretend to be full RFC 8785 unless it fully implements JCS semantics.

### 4. Validate graph and query shape

Initial implementation may use a small local structural validator for the tiny subset required by the fixtures, but the script boundary must be written so Ajv can later replace the local validator without changing output shape.

Validation failure classes:

- `GOVERNANCE_GRAPH_QUERY_RESULT/GRAPH_SCHEMA_INVALID`
- `GOVERNANCE_GRAPH_QUERY_RESULT/QUERY_SCHEMA_INVALID`
- `GOVERNANCE_GRAPH_QUERY_RESULT/UNSUPPORTED_QUERY_VERSION`
- `GOVERNANCE_GRAPH_QUERY_RESULT/UNSUPPORTED_OPERATION`

### 5. Build in-memory indexes

Required indexes:

- nodes by `artifact_id`,
- edges by `from`,
- edges by `to`,
- edges by `edge_type`.

Indexing failure classes:

- `GOVERNANCE_GRAPH_QUERY_RESULT/DUPLICATE_NODE_ID`
- `GOVERNANCE_GRAPH_QUERY_RESULT/BROKEN_EDGE_REFERENCE`
- `GOVERNANCE_GRAPH_QUERY_RESULT/INVALID_EDGE_TYPE`

### 6. Execute query

Supported operations:

- `select_nodes`
- `select_edges`
- `traverse`

Selection rules:

- apply exact-match `where` filters only,
- apply projection only after filtering,
- apply deterministic ordering before limit,
- never mutate graph records.

Traversal rules:

- bounded breadth-first traversal,
- respect `direction`,
- respect `edge_types`,
- respect `max_depth`,
- record `visited_node_count`, `visited_edge_count`, and `truncated`,
- avoid revisiting the same node at the same or shallower depth.

### 7. Emit result envelope

Every successful query emits:

- `result_version`,
- `status`,
- `exit_code`,
- `graph`,
- `query`,
- `determinism`,
- `records`,
- `traversal`,
- `diagnostics`.

The envelope must match `mind/schemas/governance.graph.query.result.v1.schema.json`.

### 8. Exit with coarse process code

Exit code policy:

- `0` pass,
- `64` invocation/input usage error,
- `65` data/schema error,
- `70` internal execution error,
- `78` configuration or unsupported-version error.

Detailed routing belongs in `diagnostics[].code`, not stderr text.

## Fixture replay plan

Add fixture directories:

- `mind/fixtures/governance.graph.v1/`
- `mind/fixtures/governance.graph.query.v1/`
- `mind/fixtures/governance.graph.query.result.v1/`

Minimum first fixture set:

1. `pass-select-nodes-empty.json`
   - valid graph,
   - valid query,
   - no matching nodes,
   - pass envelope with zero records.

2. `pass-select-nodes-by-artifact-type.json`
   - valid graph,
   - query filters by `artifact_type`,
   - deterministic ordering by `artifact_id`.

3. `pass-select-edges-by-edge-type.json`
   - valid graph,
   - query filters by `edge_type`,
   - deterministic ordering by `from`, `to`, `edge_type`.

4. `pass-traverse-derived-lineage.json`
   - valid graph,
   - bounded traversal over `derived_from` or `supersedes`,
   - records include depth.

5. `fail-missing-start-artifact.json`
   - valid graph,
   - traversal query references absent start node,
   - failure envelope with stable diagnostic code.

6. `fail-broken-edge-reference.json`
   - graph has edge pointing to absent node,
   - indexing fails before query execution,
   - failure envelope with stable diagnostic code.

## Test harness plan

Create:

- `test/governance-graph-query-runner.test.mjs`

Use Node's built-in `node:test` and `node:assert/strict`.

Test strategy:

1. Spawn the runner with each graph/query fixture pair.
2. Capture stdout.
3. Parse stdout as JSON.
4. Validate required envelope fields.
5. Assert `exit_code` equals expected fixture value.
6. Assert `diagnostics[].code` includes expected code.
7. Assert `records` match golden output.
8. Assert a second run produces byte-identical stdout when `--pretty` setting is identical.

No test may assert against human prose except fixture descriptions.

## Design rule added

The governance graph query runner is a **read-only deterministic executor**. It must not:

- regenerate the graph,
- write manifests,
- repair broken lineage,
- install dependencies,
- require a graph database,
- infer private or personal meaning from artifact names,
- emit raw records as the top-level response.

It may only load a graph, load a query, execute the small query contract, and emit a versioned result envelope.

## CI implication

The first CI stage should prove four properties:

1. every query fixture parses,
2. every result envelope matches the result schema,
3. every runner invocation exits with the expected coarse code,
4. repeated executions produce identical canonical result hashes.

Only after that stage exists should MC introduce richer query operators or graph visualization tooling.

## Roadmap item

Implement `scripts/run-governance-graph-query.mjs` as a no-database prototype with fixture replay before adding any visualization layer.

Acceptance criteria:

- one command-line runner exists,
- at least six fixture pairs exist,
- test harness runs with `node --test`,
- all emitted outputs conform to `governance.graph.query.result.v1`,
- deterministic repeated output is proven,
- no new graph database dependency is introduced.

## Next architecture question

How should MC define `governance.graph.v1.schema.json` and the first tiny graph fixture so the query runner has a stable graph input contract with nodes, typed edges, graph hash metadata, and referential-integrity expectations before the runner implementation lands?
