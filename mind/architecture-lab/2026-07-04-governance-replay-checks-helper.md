# Governance Replay Checks Helper

Date: 2026-07-04
Status: implemented as first shared helper
Public-safety level: public-safe; no private/personal source material

## Architecture question

How should MC implement `tools/lib/governance-replay-checks.mjs` so check-code evolution is append-only, redacted by default, and safely shared by canonical replay, ADR replay, and artifact-manifest-helper replay?

## Research basis

Current implementation guidance came from:

- Node.js ECMAScript module behavior: `.mjs` files are explicit ES modules, relative imports need file extensions, and ES modules are the stable reuse format for this helper boundary.
- GitHub Actions workflow commands: annotations, masks, and job summaries are separate emission surfaces, so replay checks need an emission mapping rather than raw logs.
- JSON Schema 2020-12 validation vocabulary: stable `const`, `enum`, object constraints, and string patterns should define the durable object boundary while the helper constructs compatible objects.
- RFC 9457 Problem Details: replay checks can borrow the `type`, `title`, `detail`, and `instance` shape for machine-readable problems without pretending the replay tool is an HTTP API.
- Current GitHub Actions reliability/security research: agentic and automated workflows make untrusted input flow a first-class risk, so normalized checks must be redacted by default before summaries, annotations, or dashboards consume them.

## Useful concepts extracted

### 1. Check objects are an event boundary

A replay check is not a thrown error, a console line, or a domain-specific fixture result. It is a public-safe event object that can be reused by:

- replay-result envelopes,
- Markdown summaries,
- GitHub Actions annotations,
- artifact manifests,
- future governance dashboards.

### 2. Machine code is stable; human text is mutable

The check `code` must be append-only. The `publicMessage` may improve over time, but code semantics should not drift. If semantics must change, MC should add a new code or introduce a schema version.

### 3. Redaction is constructor-owned

Replay tools should not each invent secret/path filtering. The shared helper owns:

- secret-like pattern blocking,
- absolute local path redaction,
- scalar-only `safeDetails`,
- repository-relative location validation,
- bounded public messages.

### 4. Process outcome and domain state remain separate

Expected negative fixtures should be valid governance proof, not generic CI failure. The helper preserves state values such as `expected_failure_observed`, `unsafe_blocked`, and `schema_invalid_observed` while `hasFatalReplayChecks()` only marks unexpected failures and contract violations as fatal.

### 5. Emission is derived, not hand-written

GitHub annotations and summaries should be emitted from normalized check objects. The helper therefore maps severity/state into default emission hints instead of requiring each replay script to decide whether a check becomes a notice, warning, error, redacted summary row, or dashboard event.

## Durable artifact added

Implemented:

- `tools/lib/governance-replay-checks.mjs`

The helper defines:

- `CHECK_SCHEMA_ID`
- `CHECK_PREFIXES`
- `CHECK_CATEGORIES`
- `CHECK_STATES`
- `CHECK_SEVERITIES`
- `CHECK_EXPECTEDNESS`
- append-only initial `CHECK_CODES`
- `createReplayCheck()`
- `createProblemCheck()`
- `redactPublicText()`
- `sanitizeSafeDetails()`
- `normalizeCheckLocation()`
- `defaultEmissionFor()`
- `summarizeChecks()`
- `hasFatalReplayChecks()`
- `checksToMarkdown()`

## Initial code taxonomy

The first helper version registers these shared codes:

- `GHR_DESCRIPTOR_VALID`
- `GHR_EXPECTED_FAILURE_OBSERVED`
- `GHR_UNEXPECTED_FAILURE`
- `GHR_SENTINEL_EXIT_STABLE`
- `GHM_MANIFEST_CREATED`
- `GHM_MANIFEST_INVALID`
- `GHS_SCHEMA_VALID`
- `GHS_SCHEMA_INVALID_OBSERVED`
- `GHP_UNSAFE_SYMBOLIC_CASE_BLOCKED`
- `GHP_PUBLIC_SAFE_OUTPUT_CONFIRMED`
- `GHA_ANNOTATION_EMITTED`

Prefix intent:

- `GHR`: replay runner / descriptor / exit behavior
- `GHM`: artifact manifest custody
- `GHS`: schema validation
- `GHP`: public-safety boundary
- `GHA`: GitHub Actions emission

## Integration requirements

1. Replay tools must construct checks through `createReplayCheck()` or `createProblemCheck()`.
2. Replay tools must not write raw exception text, untrusted prompt text, absolute paths, or secret-like values into summaries or result envelopes.
3. Fixture runners should use `hasFatalReplayChecks()` for default exit behavior, while sentinel mode may intentionally assert non-zero behavior.
4. Markdown summaries should be generated from normalized checks, not from ad hoc console output.
5. Future code additions must be append-only unless a new schema version is created.

## Design pattern

Name: **Append-only public-safe check registry**

Boundary:

`domain replay operation -> normalized check constructor -> replay-result envelope / summary / annotation / dashboard ingestion`

The registry is intentionally small. It should grow only when a new stable machine state is needed across multiple replay tools or dashboard consumers.

## Next architecture question

How should MC integrate `tools/lib/governance-replay-checks.mjs` into `tools/replay-governance-artifact-manifest-helper-fixtures.mjs` so descriptor validation, temp-only synthesis, helper execution, manifest writing, summary rendering, annotations, and sentinel exit behavior all use normalized checks without duplicating result-state logic?
