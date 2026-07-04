# Governance Replay Check Schema Boundary

Date: 2026-07-04
Status: Architecture note / schema implementation
Scope: Governance replay tooling, artifact-manifest-helper replay, canonical replay, ADR replay, GitHub Actions summaries and annotations, future dashboard ingestion
Public-safety level: public-safe; no private user details, secrets, raw unsafe payloads, or personal examples

## Architecture question

How should MC define `governance.replay.check.v1.schema.json` so every replay tool emits the same normalized check object for summaries, annotations, result envelopes, and future dashboard ingestion?

## Research basis

Current sources reviewed:

- JSON Schema Draft 2020-12 core and output formatting concepts.
- GitHub Actions workflow commands for notices, warnings, errors, masking, and job summaries.
- RFC 9457 Problem Details for machine-readable problem shape.
- SLSA provenance v1.0 for stable digest/material vocabulary.
- 2026 GitHub Actions reliability and compliance research.
- 2025-2026 JSON Schema validation complexity and inclusion research.

## Useful concepts extracted

### 1. A check is not a thrown error

A governance check is a normalized public-safe event. It may come from successful validation, expected failure, public-safety blocking, schema rejection, annotation emission, or process-exit selection. It should be generated before UI-specific formatting.

The same object should feed:

- `result.json`
- `summary.md`
- GitHub Actions annotations
- future dashboard ingestion
- local developer diagnostics

### 2. Machine fields must be stable; human fields may evolve

The durable identity is `code`, not `publicMessage`.

Stable fields:

- `schema`
- `code`
- `severity`
- `category`
- `state`
- `expectedness`

Editable fields:

- `publicMessage`
- `problem.detail`
- rendered summary text

### 3. Keep severity separate from GitHub annotation type

GitHub Actions supports annotation commands, but the governance layer should not collapse internal severity directly into GitHub syntax. A `blocked` check may become a warning when the block was expected, but an error when it indicates unsafe persistence or contract violation.

The schema therefore includes:

- `severity`: governance meaning
- `emission.githubAnnotation`: platform rendering decision

### 4. Use Problem Details as a shape, not an HTTP dependency

RFC 9457 separates stable `type` from human-readable `title` and `detail`. MC can borrow that pattern for replay events without adding HTTP status semantics. The check schema allows a `problem` object with `type`, `title`, `detail`, and `instance`, but omits HTTP `status`.

### 5. Public-safety belongs in the check object

Checks are the point where unsafe or private material must become abstract. The schema allows only safe primitive `safeDetails`, repo-relative paths, JSON pointers, and bounded messages. It rejects obvious secret-like patterns in `publicMessage`, while implementation must still run stronger redaction before persistence.

Disallowed in checks:

- raw unsafe fixture content
- secrets or tokens
- private/person-identifying examples
- absolute local paths
- untrusted prompt text copied from GitHub events

### 6. Avoid over-complex schema composition in v1

Recent JSON Schema research reinforces that advanced schema features can increase validation complexity and compatibility risk. The first check schema uses closed enums, shallow optional objects, bounded strings, repo-relative path patterns, and no dynamic references.

## Implemented artifacts

Added:

- `mind/schemas/governance.replay.check.v1.schema.json`
- `mind/fixtures/governance.replay.check.v1/pass-public-safe-check.json`

Updated:

- `mind/schemas/governance.artifact-manifest-helper.replay.result.v1.schema.json`

The replay-result schema now references `governance.replay.check.v1.schema.json` for `publicSafety.checks` and per-result `checks`, removing the older embedded helper-only check shape.

## Required check shape

Minimum object:

- `schema`: `governance.replay.check.v1`
- `code`: append-only machine code with prefix `GHR`, `GHM`, `GHS`, `GHP`, or `GHA`
- `severity`: `info`, `notice`, `warning`, `error`, or `blocked`
- `category`: closed governance category
- `state`: replay state or `not_applicable`
- `publicMessage`: bounded public-safe text

Optional object:

- `expectedness`
- `location`
- `safeDetails`
- `problem`
- `emission`

## Check-code prefix contract

- `GHR_`: generic governance replay
- `GHM_`: governance artifact manifest helper
- `GHS_`: governance schema validation
- `GHP_`: governance public-safety boundary
- `GHA_`: GitHub Actions emission boundary

Once a code is consumed by a dashboard or CI summary, it should be treated as append-only. Retire by deprecation note, not semantic mutation.

## Design decisions

1. Check objects are the source for all human and machine reporting.
2. The result envelope should not define tool-local check shapes.
3. GitHub annotation syntax is an emission detail, not the canonical event model.
4. Public-safety blocking is representable as a successful expected governance state.
5. The schema is intentionally shallow for validator compatibility and maintainability.
6. Strong redaction remains a runner responsibility; schema pattern checks are only a guardrail.

## Implementation requirements

- The artifact-manifest-helper runner must import or generate checks that satisfy `governance.replay.check.v1`.
- Summary rendering must derive rows from normalized checks.
- GitHub annotations must derive from `emission.githubAnnotation` plus `severity` and `expectedness`.
- Result envelope validation must fail if any check uses old `GOVERNANCE_MANIFEST_HELPER_*` codes.
- Future canonical replay and ADR replay tools should reuse the same check schema instead of adding local alternatives.

## Next implementation target

Implement a small shared check taxonomy module, likely `tools/lib/governance-replay-checks.mjs`, that exports:

- state enums
- severity enums
- category enums
- check-code constants
- a `makeCheck()` constructor
- a redaction gate for `publicMessage` and `safeDetails`
- a GitHub annotation mapping function

The next research question should focus on how that module should enforce append-only check-code evolution while still allowing tools to add new domain-specific codes safely.
