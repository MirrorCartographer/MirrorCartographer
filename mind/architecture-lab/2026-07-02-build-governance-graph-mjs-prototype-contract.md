# build-governance-graph.mjs prototype contract

## Architecture question

How should MC implement `build-governance-graph.mjs` so it scans `artifact.manifest.v1` files, emits `governance.graph.v1`, computes RFC 8785-compatible hashes, sorts nodes and edges deterministically, and reports stable `GOVERNANCE_GRAPH/*` check codes without depending on a graph database?

## Research basis

The useful current references converge on four implementation constraints:

1. Node's file-system API can read directories recursively, and `fs.readdirSync()` has supported both `recursive` and `withFileTypes` modes in current Node releases. This supports a zero-database manifest discovery pass.
2. Node's `crypto.createHash('sha256')` is the right built-in primitive for producing SHA-256 digests of manifest files, artifact files, manifest-set payloads, and the generated graph document.
3. RFC 8785 JSON Canonicalization Scheme exists because hashing and signing need JSON data to be expressed in an invariant representation. MC should therefore treat canonicalization as a graph-integrity requirement, not a display-format choice.
4. GitHub Actions reduces process outcome to `0` success and nonzero failure. MC should keep exit codes coarse and place exact routing semantics in ordered `checks[].code` records.

## Extracted concepts

- The builder is a deterministic indexer, not an authoring tool.
- `artifact.manifest.v1` files remain the source of truth.
- `governance.graph.v1` is a generated artifact derived from manifests.
- The builder must be read-only with respect to manifests and source artifacts.
- Deterministic ordering is part of the contract, not an optimization.
- The graph hash must be calculated from canonical graph content with the hash field excluded or set to a sentinel before digesting.
- The manifest-set hash must be calculated from a deterministic list of discovered manifest paths and per-manifest hashes.
- Schema validation proves JSON shape; graph checks prove meaning.
- Broken references, duplicate IDs, invalid edge types, ordering drift, and lineage cycles should be reported as structured checks.
- A graph database is unnecessary at this layer; array scans, maps, sets, and a small acyclicity pass are enough.

## Proposed prototype boundary

`build-governance-graph.mjs` should accept explicit paths and write one deterministic JSON document.

Initial command shape:

- `node tools/build-governance-graph.mjs --root . --manifest-glob artifact.manifest.v1.json --out mind/generated/governance.graph.v1.json`
- Optional test mode: `--fixtures mind/fixtures/governance.graph.v1`
- Optional stdout mode: `--stdout`

The prototype should not:

- install dependencies,
- mutate manifests,
- infer private context,
- query GitHub,
- generate schemas,
- rewrite artifacts,
- or maintain a graph database.

## Builder stages

### 1. Discover manifests

Scan the repository tree for files named `artifact.manifest.v1.json`.

Discovery rules:

- Normalize paths to forward-slash repository-relative paths.
- Ignore `.git`, `node_modules`, build outputs, cache folders, and generated graph outputs.
- Sort discovered manifest paths ascending before reading.
- Emit `GOVERNANCE_GRAPH/MANIFESTS_DISCOVERED`.

### 2. Parse and minimally validate manifests

Before full schema validation is available, the builder should require only the fields needed to construct the graph:

- `artifact.artifact_id`
- `artifact.artifact_type`
- `artifact.version`
- `artifact.path`
- `integrity.artifact_sha256`, or enough information to compute it
- `lineage.*`
- `compatibility.*`
- `references.*`

Malformed JSON should not crash the process without a structured report. It should emit a failed check and exit nonzero.

### 3. Build nodes

Each manifest becomes one graph node.

Node fields map to `governance.graph.v1`:

- `artifact_id`
- `artifact_type`
- `version`
- `status`
- `manifest_path`
- `artifact_path`
- `artifact_sha256`
- `labels`

Duplicate `artifact_id` values are a hard governance failure.

### 4. Build edges

Manifest lineage and references become typed graph edges.

Initial mapping:

- manifest `lineage.supersedes[]` -> `supersedes`
- manifest `lineage.derived_from[]` -> `derived_from`
- manifest `lineage.validated_against[]` -> `validated_against`
- manifest `compatibility.compatible_with[]` -> `compatible_with`
- manifest `provenance.generated_by[]` -> `generated_by`
- manifest `references.fixtures[]` -> `uses_fixture`

Every edge must reference existing node IDs unless the manifest explicitly marks the target as external. The current `governance.graph.v1` schema has no external-node model, so the v1 prototype should fail unresolved internal references rather than silently omit them.

### 5. Sort deterministically

Sorting is normative:

- Nodes: ascending `artifact_id`.
- Edges: ascending `source_artifact_id`, then `relation`, then `target_artifact_id`.
- Checks: fixed check-code table order.
- Object keys: canonicalized before hashing.

### 6. Verify graph semantics

The first prototype should emit these checks in fixed order:

- `GOVERNANCE_GRAPH/SCHEMA_VALID`
- `GOVERNANCE_GRAPH/MANIFESTS_DISCOVERED`
- `GOVERNANCE_GRAPH/NODE_IDS_UNIQUE`
- `GOVERNANCE_GRAPH/EDGE_REFERENCES_RESOLVE`
- `GOVERNANCE_GRAPH/LINEAGE_ACYCLIC`
- `GOVERNANCE_GRAPH/ORDERING_DETERMINISTIC`
- `GOVERNANCE_GRAPH/HASH_PRESENT`

The current schema only enumerates the original six graph check codes. Therefore this note records a requirement to update `governance.graph.v1.schema.json` or defer `MANIFESTS_DISCOVERED` until `governance.graph.v1.1`.

### 7. Detect lineage cycles

Cycle detection should apply only to lineage-like edges at first:

- `supersedes`
- `derived_from`

Compatibility and validation edges are not necessarily lineage edges and should not participate in the acyclicity check unless a later schema revision says so.

A small Kahn-style topological pass is sufficient:

- Build adjacency over lineage edges.
- Count incoming lineage edges.
- Remove zero-incoming nodes.
- If remaining nodes exist, emit `GOVERNANCE_GRAPH/LINEAGE_ACYCLIC = fail` with the smallest involved artifact IDs.

### 8. Compute hashes

Hash policy:

- `artifact_sha256`: digest of the artifact file bytes.
- manifest hash: digest of each manifest file's canonical JSON.
- `manifest_set_sha256`: digest of a canonical array of `{ manifest_path, manifest_sha256 }` records sorted by path.
- `graph_sha256`: digest of the generated graph with `integrity.graph_sha256` set to a fixed 64-zero sentinel before canonicalization.

This avoids self-referential hash instability while preserving a reproducible graph digest.

## Stable failure classes

Exit codes should remain coarse:

- `0`: graph generated and all required checks pass.
- `1`: governance failure represented in `checks[]`.
- `2`: usage error, such as unsupported flags or missing required path arguments.
- `70`: unexpected internal error.

CI should route on `checks[].code`, not logs.

## Required schema follow-up

The existing `governance.graph.v1.schema.json` defines these check codes:

- `GOVERNANCE_GRAPH/SCHEMA_VALID`
- `GOVERNANCE_GRAPH/NODE_IDS_UNIQUE`
- `GOVERNANCE_GRAPH/EDGE_REFERENCES_RESOLVE`
- `GOVERNANCE_GRAPH/LINEAGE_ACYCLIC`
- `GOVERNANCE_GRAPH/ORDERING_DETERMINISTIC`
- `GOVERNANCE_GRAPH/HASH_PRESENT`

The builder contract needs one additional pre-schema discovery code:

- `GOVERNANCE_GRAPH/MANIFESTS_DISCOVERED`

Decision: do not silently add it to generated graph output until the schema is updated. The prototype can include the discovery result in stderr/stdout preflight diagnostics or wait for `governance.graph.v1.1`.

## Durable architecture decision

MC should implement `build-governance-graph.mjs` as a read-only, deterministic graph compiler over `artifact.manifest.v1`, with no graph database dependency. Its job is to transform manifest metadata into one canonical `governance.graph.v1` artifact and prove that the graph is ordered, hashable, internally referential, and acyclic across lineage edges.

This preserves the governance stack:

1. Manifests are authored source metadata.
2. Graph is generated derived metadata.
3. Query runner consumes graph metadata.
4. CI enforces graph checks.
5. Visualization reads graph metadata without inventing semantics.

## Prototype plan

1. Add `tools/build-governance-graph.mjs`.
2. Add a local canonical JSON helper or tiny RFC8785-compatible subset for MC's restricted JSON values.
3. Add fixture manifests under `mind/fixtures/artifact.manifest.v1/`.
4. Generate `mind/fixtures/governance.graph.v1/pass-tiny-graph.generated.json` from fixture manifests.
5. Add `node:test` coverage for:
   - empty manifest set,
   - one valid manifest,
   - duplicate artifact IDs,
   - unresolved edge reference,
   - lineage cycle,
   - deterministic re-run hash equality.
6. Only after fixture parity is proven, wire the builder into CI.

## Public-safety note

All fixture manifests should use artificial artifact IDs and synthetic file paths. The governance graph must not encode personal, health, financial, relationship, or private project-session content. Private material can influence design requirements only through abstract terms such as `note`, `schema`, `fixture`, `roadmap_item`, or `prototype_plan`.

## Next question

How should MC update `artifact.manifest.v1.schema.json` and `governance.graph.v1.schema.json` together so the builder's required manifest fields, edge mappings, external-reference policy, and new `GOVERNANCE_GRAPH/MANIFESTS_DISCOVERED` check code are schema-valid before executable implementation begins?
