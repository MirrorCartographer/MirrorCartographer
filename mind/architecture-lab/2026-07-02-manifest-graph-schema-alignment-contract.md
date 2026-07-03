# Manifest ↔ Governance Graph Schema Alignment Contract

## Architecture question researched

How should MC update `artifact.manifest.v1.schema.json` and `governance.graph.v1.schema.json` together so the builder's manifest fields, edge mappings, external-reference policy, and `GOVERNANCE_GRAPH/MANIFESTS_DISCOVERED` check code are schema-valid before implementation begins?

## Public-safe framing

This note is about repository governance metadata only. It does not encode private user history, personal therapeutic content, identity assertions, or unpublished symbolic material. It treats Mirror Cartographer governance artifacts as public technical records: schemas, fixtures, generated reports, graph nodes, graph edges, and CI checks.

## Current-source research basis

Sources checked during this run:

- JSON Schema Draft 2020-12 core specification, especially `$schema`, `$id`, `$defs`, vocabularies, schema resources, and output concepts.
- RFC 8785 JSON Canonicalization Scheme for deterministic JSON serialization and hash inputs.
- Node.js current filesystem documentation for recursive directory scanning through `fsPromises.readdir` options.
- GitHub Actions workflow command documentation for job summaries.
- Current GitHub Actions reliability research noting that workflow complexity is associated with higher failure and maintenance risk, supporting a deliberately small governance check surface.

## What changed in understanding

The builder should not force schemas to infer each other indirectly. The manifest schema and graph schema need a shared contract layer: a minimal vocabulary of IDs, versions, edge types, reference classes, hashes, and check codes.

The important architectural shift is this:

- `artifact.manifest.v1` is the authored source of truth.
- `governance.graph.v1` is a generated, deterministic compilation of those manifests.
- The builder is only valid when every field it reads from manifests has an explicit schema home and every field it emits into the graph has an explicit schema destination.

Without that alignment, the builder becomes a private convention hidden in code. With alignment, the builder becomes a compiler from one public contract to another.

## Alignment rule

Every builder-read manifest field must map to exactly one graph field or one declared validation-only field.

Every builder-emitted graph field must map back to either:

1. an authored manifest field,
2. a deterministic compiler calculation,
3. a repository scan fact, or
4. a validation result.

No field may exist only because the implementation happens to need it.

## Required shared vocabulary

The two schemas should share these stable definitions, either by duplicated minimal `$defs` or by a future common schema module once cross-schema imports are proven safe.

### `artifact_id`

Stable string identifier for one logical governance artifact.

Recommended shape:

- lowercase domain prefix,
- slash-separated namespace,
- dot-separated artifact name,
- explicit major version where relevant.

Example pattern category:

- `schema/artifact.manifest.v1`
- `schema/governance.graph.v1`
- `fixture/governance.graph.v1/pass-tiny-graph`
- `note/architecture-lab/manifest-graph-schema-alignment-contract`

### `artifact_version`

Semantic version of the artifact instance. This is not the JSON Schema draft version and not the repository commit.

### `schema_uri`

Canonical schema URI used for validation. In authored manifests this says what validates the artifact. In graph nodes this records what schema validated the source artifact or node projection.

### `content_hash`

SHA-256 hash over RFC 8785-canonicalized JSON when the artifact is JSON. For Markdown or other text artifacts, use SHA-256 over normalized UTF-8 bytes and explicitly declare `hash_input_mode`.

### `edge_type`

Closed enum for graph edges. Initial set:

- `derived_from`
- `supersedes`
- `validated_against`
- `compatible_with`
- `generated_by`
- `uses_fixture`
- `references_external`

### `reference_scope`

Closed enum defining whether a reference must resolve inside the governance graph.

- `internal_required`: must resolve to a known `artifact_id`.
- `internal_optional`: may resolve later, but unresolved state is reported.
- `external_allowed`: URL, standard, package, or external document; not a missing artifact.
- `external_forbidden`: must never leave the governance graph.

## Manifest schema requirements

`artifact.manifest.v1.schema.json` should require these top-level sections:

- `manifest_version`
- `artifact`
- `integrity`
- `lineage`
- `compatibility`
- `provenance`
- `references`

### `artifact`

Required fields:

- `artifact_id`
- `artifact_type`
- `artifact_version`
- `schema_uri`

Allowed `artifact_type` values:

- `schema`
- `fixture`
- `report`
- `note`
- `design_pattern`
- `requirement`
- `roadmap_item`
- `prototype_plan`
- `generated_index`

### `integrity`

Required fields:

- `hash_algorithm`: initially only `sha256`
- `hash_value`
- `hash_input_mode`: `rfc8785_json`, `normalized_utf8_text`, or `raw_bytes`

The builder may verify hash fields when practical, but must not silently rewrite them.

### `lineage`

Required fields:

- `derived_from`: array of artifact references
- `supersedes`: array of artifact references
- `validated_against`: array of artifact references
- `generated_by`: optional artifact reference

Each reference must include:

- `artifact_id`
- optional `artifact_version`
- `reference_scope`

### `compatibility`

Required fields:

- `compatibility_class`: `backward`, `forward`, `full`, `breaking`, or `none`
- `compatible_with`: array of artifact references
- `migration_required`: boolean

### `provenance`

Required fields:

- `created_at`
- `source_commit`
- `generator_name`
- `generator_version`

For manually authored notes, `generator_name` may be `human_or_ai_assisted_authoring` and `generator_version` may be `not_applicable`.

### `references`

References should be typed and scoped. External standards and web sources must not be treated as missing internal artifacts.

Reference fields:

- `label`
- `reference_type`: `schema`, `fixture`, `report`, `standard`, `documentation`, `source`, `repository_path`, or `external_url`
- `target`
- `reference_scope`

## Governance graph schema requirements

`governance.graph.v1.schema.json` should require these top-level fields:

- `graph_version`
- `generated_at`
- `generator`
- `source_scan`
- `nodes`
- `edges`
- `checks`
- `summary`

### `source_scan`

Required fields:

- `root_paths`
- `manifest_count`
- `included_manifest_count`
- `excluded_manifest_count`
- `scan_order`

`scan_order` must be deterministic after path normalization and lexical sorting.

### `nodes[]`

Required fields:

- `artifact_id`
- `artifact_type`
- `artifact_version`
- `schema_uri`
- `source_path`
- `content_hash`
- `hash_input_mode`

Graph nodes are projections of manifests, not copies of full manifests.

### `edges[]`

Required fields:

- `from_artifact_id`
- `to_artifact_id`
- `edge_type`
- `reference_scope`
- `source_manifest_path`

For `external_allowed` references, `to_artifact_id` should be omitted and `external_target` should be required instead.

### `checks[]`

Required fields:

- `code`
- `status`
- `severity`
- `message`
- `subject`

Initial check-code namespace:

- `GOVERNANCE_GRAPH/MANIFESTS_DISCOVERED`
- `GOVERNANCE_GRAPH/MANIFEST_SCHEMA_VALID`
- `GOVERNANCE_GRAPH/DUPLICATE_ARTIFACT_ID`
- `GOVERNANCE_GRAPH/REFERENCE_RESOLVED`
- `GOVERNANCE_GRAPH/REFERENCE_EXTERNAL_ALLOWED`
- `GOVERNANCE_GRAPH/REFERENCE_MISSING`
- `GOVERNANCE_GRAPH/EDGE_TYPE_VALID`
- `GOVERNANCE_GRAPH/CYCLE_ABSENT`
- `GOVERNANCE_GRAPH/HASH_VALID`
- `GOVERNANCE_GRAPH/DETERMINISTIC_ORDER_VALID`

## Builder field mapping

| Builder need | Manifest source | Graph destination | Notes |
|---|---|---|---|
| Discover manifests | repository scan | `source_scan` | Scan fact, not manifest-authored. |
| Identify artifact | `artifact.artifact_id` | `nodes[].artifact_id` | Must be unique. |
| Classify artifact | `artifact.artifact_type` | `nodes[].artifact_type` | Closed enum. |
| Version artifact | `artifact.artifact_version` | `nodes[].artifact_version` | Immutable after publication. |
| Validate artifact | `artifact.schema_uri` | `nodes[].schema_uri` | URI is a contract, not a path guess. |
| Verify integrity | `integrity.*` | `nodes[].content_hash` | Hash verification result goes to `checks[]`. |
| Compile lineage | `lineage.*` | `edges[]` | Edge type must be explicit. |
| Compile compatibility | `compatibility.compatible_with` | `edges[]` | Uses `compatible_with` edge. |
| Preserve external refs | `references[]` | `edges[]` or validation-only | External refs must be scoped. |
| Report diagnostics | validation/build results | `checks[]` | Stable code namespace. |

## External-reference policy

The builder must not fail merely because a manifest cites an external standard, documentation page, or public source. It should fail only when a reference declared as `internal_required` cannot be resolved to a known artifact.

External references should be emitted as external edges only when graph consumers need to traverse or visualize them. Otherwise they may remain validation-only references in the manifest.

## Determinism policy

The builder must sort before output:

1. manifests by normalized path,
2. nodes by `artifact_id`, then `artifact_version`,
3. edges by `from_artifact_id`, then `edge_type`, then `to_artifact_id` or `external_target`,
4. checks by `code`, then `subject`.

Canonical JSON hashing should use RFC 8785-compatible ordering for JSON artifacts. Text artifacts should declare a separate hash input mode rather than pretending they are canonical JSON.

## Implementation sequence

1. Add or update `artifact.manifest.v1.schema.json` with shared definitions and explicit reference scopes.
2. Add or update `governance.graph.v1.schema.json` with source-scan, node, edge, check, and summary contracts.
3. Add one minimal authored manifest fixture.
4. Add one generated tiny graph fixture compiled from that manifest.
5. Add failure fixture for unresolved `internal_required` reference.
6. Add failure fixture for duplicate `artifact_id`.
7. Only then implement `build-governance-graph.mjs`.

## Non-goals

- No graph database.
- No runtime mutation of manifests.
- No automatic rewriting of authored metadata.
- No private or personal symbolic content in governance fixtures.
- No hidden edge types invented by implementation code.

## Resulting design pattern

This establishes a schema-to-schema compiler contract:

Manifest schema defines what authors may declare.

Builder compiles declarations into graph nodes, edges, scan facts, and checks.

Graph schema defines what downstream tools may consume.

CI proves the compiler did not smuggle private conventions into code.

## Next architecture question

How should MC define the first tiny `artifact.manifest.v1` fixture and matching `governance.graph.v1` generated fixture so the builder contract can be tested with one passing graph, one missing-reference failure, and one duplicate-ID failure before executable implementation begins?
