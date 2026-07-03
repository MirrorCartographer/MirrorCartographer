# Governance Canonical JSON Hash Policy

Date: 2026-07-03
Status: proposed
Artifact type: design pattern + requirements update
Public-safety level: public-safe; private/personal source material must remain abstracted

## Architecture question

How should MC define the canonical JSON helper and hash policy shared by `build-governance-graph.mjs`, `build-governance-adr-index.mjs`, and `replay-governance-adr-index-fixtures.mjs` so all governance tools compute identical hashes across Node versions and CI environments?

## Research basis

Current-source review focused on four constraints:

1. RFC 8785 JSON Canonicalization Scheme exists because cryptographic hashes and signatures need an invariant data representation. It defines deterministic property sorting, no emitted whitespace, strict JSON primitive serialization, I-JSON constraints, recursive object-property sorting, unchanged array element order, and UTF-8 bytes as the hash input.
2. JSON Schema Draft 2020-12 defines JSON objects as unordered mappings in the data model. Therefore schema validation can prove object shape and value constraints, but it does not by itself define a stable byte representation for hashing or snapshots.
3. Node's `crypto.createHash()` creates hash objects for digest generation using a named algorithm. MC can use this for SHA-256 only after canonical bytes are defined by an MC-owned helper.
4. Modern JSON Schema research cautions that advanced dynamic-reference features increase validation complexity. The hash policy should avoid depending on schema-evaluation side effects, validator-specific annotation order, or raw validator output as hash input.

## Change in understanding

The previous replay and compiler notes assumed canonicalization as a local implementation detail. That is too weak.

Previous model:

`tool -> JSON.stringify -> sha256`

Refined model:

`governed object -> MC canonical JSON helper -> UTF-8 bytes -> sha256 digest -> hash envelope`

The important shift is that `JSON.stringify()` is not the architecture boundary. The boundary is an explicit MC canonicalization helper with named algorithm identity, input restrictions, stable error codes, and fixtures.

## Policy

MC governance tools must use one shared canonicalization and hashing policy for governed JSON artifacts.

### Required algorithm identity

Use this identifier in governed outputs until superseded by an ADR:

`MC-CANONICAL-JSON-SHA256-V1`

The identifier means:

- Canonicalization target: JSON data model value, not raw source text.
- Canonicalization profile: RFC 8785-compatible JSON Canonicalization Scheme.
- Character encoding before hashing: UTF-8.
- Digest algorithm: SHA-256.
- Digest encoding: lowercase hexadecimal.
- Hash input: canonical UTF-8 bytes only, never pretty JSON, stdout, Markdown summaries, local filesystem paths, environment variables, timestamps, or validator internals.

### Shared helper contract

Add a shared helper module before tool-specific implementation expands:

`tools/lib/governance-canonical-json.mjs`

The helper should expose these capabilities:

1. `canonicalizeJson(value)` returns canonical JSON text.
2. `canonicalUtf8Bytes(value)` returns the UTF-8 bytes of canonical JSON text.
3. `sha256HexFromCanonicalJson(value)` returns a lowercase SHA-256 hex digest over canonical UTF-8 bytes.
4. `hashEnvelope(value)` returns an object with:
   - `algorithm: "MC-CANONICAL-JSON-SHA256-V1"`
   - `canonicalization: "RFC8785-compatible"`
   - `encoding: "utf-8"`
   - `digestAlgorithm: "sha256"`
   - `digestEncoding: "hex-lowercase"`
   - `digest`

### Input restrictions

The helper must reject values that would make cross-runtime hashes unsafe:

- `undefined`
- functions
- symbols
- `BigInt`
- `NaN`
- positive or negative infinity
- non-JSON objects such as `Date`, `Map`, `Set`, `RegExp`, typed arrays, buffers, class instances, or objects with custom prototypes
- lone surrogate strings
- circular references

Large integer or decimal identifiers that require exact preservation must be strings, not JSON numbers.

### Sorting rule

Object properties must be sorted recursively according to RFC 8785/JCS property sorting semantics. Array element order must be preserved. If an array contains objects, those nested objects must still have their properties recursively sorted.

### Error-code namespace

Use `GOVERNANCE_CANONICAL_JSON/*` for shared helper failures:

- `GOVERNANCE_CANONICAL_JSON/UNSUPPORTED_VALUE_TYPE`
- `GOVERNANCE_CANONICAL_JSON/NON_FINITE_NUMBER`
- `GOVERNANCE_CANONICAL_JSON/UNSAFE_INTEGER_NUMBER`
- `GOVERNANCE_CANONICAL_JSON/LONE_SURROGATE_STRING`
- `GOVERNANCE_CANONICAL_JSON/CIRCULAR_REFERENCE`
- `GOVERNANCE_CANONICAL_JSON/NON_PLAIN_OBJECT`
- `GOVERNANCE_CANONICAL_JSON/HASH_ALGORITHM_UNAVAILABLE`

Tool-specific checks may wrap these codes, but must not rename the root cause.

## Requirements added

1. `build-governance-graph.mjs`, `build-governance-adr-index.mjs`, and `replay-governance-adr-index-fixtures.mjs` must import the shared canonicalization helper rather than implementing local hash logic.
2. Governed JSON outputs must include the algorithm identifier when including hashes.
3. Markdown summaries must never be the canonical source for hashes.
4. Validator output must not be hashed directly unless first transformed into an MC-owned stable check envelope.
5. Every canonical hash fixture must include at least:
   - the input object,
   - expected canonical JSON text,
   - expected SHA-256 hex digest,
   - expected hash envelope.
6. A future ADR is required before changing the algorithm identifier, hash digest algorithm, digest encoding, or canonicalization profile.

## Fixture plan

Create fixtures under:

`mind/fixtures/governance.canonical-json.v1/`

Initial fixture set:

1. `pass-basic-object.json` — proves recursive property sorting.
2. `pass-array-order-preserved.json` — proves array order is never sorted.
3. `pass-unicode-sort-sample.json` — proves non-ASCII key ordering behavior.
4. `fail-non-finite-number.json` — proves `NaN` and infinity are rejected.
5. `fail-non-plain-object.json` — proves Date/Map/Set-like objects are rejected before hashing.
6. `fail-circular-reference.json` — proves cycles fail deterministically.

## Prototype sequence

1. Add `tools/lib/governance-canonical-json.mjs` with no external runtime dependency.
2. Add canonical hash fixtures.
3. Add a minimal replay test for canonicalization fixtures.
4. Update ADR index replay and graph builder prototype notes to depend on the helper.
5. Add CI invocation after fixture replay exists.

## Public-safety rule

Canonicalization fixtures must be synthetic. They must not contain private chat excerpts, personal names, health records, animal details, local paths, account metadata, or raw autobiographical material.

## Next architecture question

How should MC define `tools/lib/governance-canonical-json.mjs` and the first `governance.canonical-json.v1` fixture corpus so canonical JSON behavior is proven before graph, ADR-index, and replay tools rely on it?
