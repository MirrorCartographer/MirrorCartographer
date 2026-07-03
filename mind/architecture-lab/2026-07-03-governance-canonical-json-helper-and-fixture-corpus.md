# Governance canonical JSON helper and fixture corpus

## Architecture question

How should MC define `tools/lib/governance-canonical-json.mjs` and the first `governance.canonical-json.v1` fixture corpus so canonical JSON behavior is proven before graph, ADR-index, and replay tools rely on it?

## Research basis

Current implementation should align with the following public sources and constraints:

- RFC 8785 / JSON Canonicalization Scheme: cryptographic operations need an invariant representation; JCS constrains input to I-JSON, forbids duplicate names at the parsed-data boundary, preserves Unicode string data as-is, emits no whitespace, sorts object properties recursively, preserves array order, and encodes the final canonical representation as UTF-8 before cryptographic operations.
- RFC 8259 / JSON: JSON object member ordering is not semantically significant in normal JSON interchange, so MC must not rely on source-file order for governance hashes.
- Node.js `crypto.createHash()`: SHA-256 hashing should be centralized behind the governance helper instead of repeated ad hoc in each tool.
- JSON Schema Draft 2020-12: fixture contracts should be machine-validated and closed at the published interface.
- Modern JSON Schema complexity research: governance schemas should avoid dynamic-reference complexity unless a future ADR proves it is necessary.

## Useful concepts extracted

### Canonicalization is an architecture boundary

The governance graph, ADR index, and fixture replay tools must not each invent their own stable JSON behavior. They need one shared helper so the same semantic object always produces the same canonical string, UTF-8 byte sequence, and SHA-256 hash.

### JSON order and governance order are different

Normal JSON does not assign semantic value to object member order. MC governance artifacts do assign value to a deterministic canonical order for hashing, comparison, replay, and graph integrity. That order must be produced by the helper, not trusted from the file as authored.

### Arrays are sequence-bearing; objects are key-bearing

Object keys are sorted recursively. Array element order is preserved. This distinction is critical because MC graph edges, check lists, and replay result arrays may carry intentional sequence, while object field order should never carry governance meaning.

### Public-safe failure codes matter

Canonicalization failures should emit stable, public-safe codes such as `GOVERNANCE_CANONICAL_JSON/NON_FINITE_NUMBER` or `GOVERNANCE_CANONICAL_JSON/LONE_SURROGATE`. The error envelope must describe the structural problem without exposing private content.

## Implementation added

### Helper

`tools/lib/governance-canonical-json.mjs`

Defines:

- `canonicalize(value)`
- `canonicalBytes(value)`
- `sha256HexOfCanonicalJson(value)`
- `sha256UriOfCanonicalJson(value)`
- `GovernanceCanonicalJsonError`

The helper rejects unsupported JSON-adjacent JavaScript values and emits stable governance error codes.

### Fixture schema

`mind/schemas/governance.canonical-json.v1.schema.json`

Defines the stable fixture shape for canonicalization cases:

- `schemaVersion`
- `caseId`
- `description`
- `input`
- `expectedCanonicalJson`
- `expectedSha256`
- optional `expectedErrorCode`
- optional `conceptsCovered`

### First fixture

`mind/fixtures/governance.canonical-json.v1/pass-object-key-order.json`

Proves the first basic invariant:

`{"b":2,"a":1}` must canonicalize to `{"a":1,"b":2}` and hash to `sha256:43258cff783fe7036d8a43033f830adfc60ec037382473548ac742b888292777`.

## Requirements update

1. All governance tools that produce artifact hashes must import the shared canonical JSON helper.
2. Governance hashes must be `sha256:` URI-style strings unless a future ADR changes the hash identifier policy.
3. Canonicalization must run before hashing, fixture comparison, generated graph comparison, or replay result comparison.
4. Object key order in source files must not be interpreted as meaningful.
5. Array order must be preserved.
6. Non-finite numbers, `BigInt`, functions, symbols, `undefined`, and lone surrogate strings are invalid governance input.
7. Canonicalization errors must use stable `GOVERNANCE_CANONICAL_JSON/*` codes.
8. The helper must remain dependency-light unless an ADR approves adopting a dedicated RFC 8785 library.

## Design pattern

Shared deterministic kernel:

`governance source artifact -> validate schema -> canonicalize -> UTF-8 bytes -> SHA-256 -> stable check/report artifact`

This pattern prevents each governance compiler from having a separate hashing interpretation.

## Compatibility note

The helper intentionally follows the MC v1 governance subset of JCS rather than claiming full independent conformance coverage. Additional fixtures are required before using it for external signatures or cross-language interoperability.

## Next implementation step

Add a replay tool for the canonical JSON corpus:

`tools/replay-governance-canonical-json-fixtures.mjs`

The replay tool should load every fixture in `mind/fixtures/governance.canonical-json.v1/`, execute the helper, compare canonical output and hash, and emit a `governance.fixture.replay.result.v1` artifact.

## Next research question

How should MC define `tools/replay-governance-canonical-json-fixtures.mjs` so canonicalization failures, passing hash cases, and future cross-runtime edge cases are replayed as stable governance artifacts before graph and ADR compilers depend on the helper?
