# Governance artifact manifest helper replay result schema

## Architecture question

How should MC define `governance.artifact-manifest-helper.replay.result.v1.schema.json` so helper replay results can represent pass, expected failure, unsafe input, and schema-invalid states without leaking unsafe fixture details into CI summaries or future dashboard ingestion?

## Current-source research

- JSON Schema 2020-12 defines recommended validation output structures and minimum information such as keyword location, absolute location, instance location, errors or annotations, and nested results. MC should keep replay-result validation output machine-readable instead of flattening everything into console text.
- GitHub Actions workflow commands support annotations, grouped log output, masked values, and job summaries. MC should treat terminal output and Markdown summaries as public surfaces that require deliberate redaction, not as raw debug channels.
- SLSA provenance models artifact subjects with named digests. MC should preserve path plus SHA-256 digest identity for each replayed fixture, even when the fixture itself is unsafe to print.
- RFC 9457 Problem Details separates stable problem type/status/title/detail/instance fields from implementation-specific details. MC should use stable check codes and concise messages rather than embedding raw invalid payloads.
- Recent 2026 GitHub Actions research identifies higher workflow complexity as a reliability risk, and agentic workflows add prompt/script injection surfaces when untrusted content crosses automation boundaries. MC should keep replay-result schemas strict, small, and safe by construction.

## Resulting design decision

The helper replay result is now a public-safe event envelope. It records what class of thing happened, where it happened, and whether the outcome matched expectation. It does not record raw fixture input, raw unsafe strings, environment data, or stack traces.

The schema defines four intentional result states:

1. `pass` — helper behavior matched a valid fixture.
2. `expected-failure` — fixture was intentionally invalid and failed through a stable check code.
3. `unsafe-blocked` — unsafe content was blocked before artifact emission and represented only by safe metadata.
4. `schema-invalid` — the fixture failed schema validation before helper execution.

Any other helper failure is normalized as `unexpected-failure`, which makes the total replay status `fail` and produces exit code `1`.

## Added durable artifacts

- `mind/schemas/governance.artifact-manifest-helper.replay.result.v1.schema.json`
- `mind/fixtures/governance.artifact-manifest-helper.replay.result.v1/pass-minimal-helper-replay-result.json`

## Schema boundary

Required top-level fields:

- `schema`
- `artifactKind`
- `producer`
- `fixtureSet`
- `summary`
- `exitBehavior`
- `publicSafety`
- `results`

The `publicSafety.redactionPolicy` constant is:

`no-raw-unsafe-inputs-in-result-or-summary`

The stable exit policy is:

`0-pass-1-replay-or-schema-failure`

## Implementation requirements for the future replay tool

1. Read helper fixtures from `mind/fixtures/governance.replay.artifact.manifest-helper.v1`.
2. Validate each fixture before execution.
3. Execute only fixtures that pass fixture-schema validation and public-safety preflight.
4. Convert all failures into stable `GOVERNANCE_MANIFEST_HELPER_*` check codes.
5. Emit JSON result first, then derive Markdown summary and GitHub annotations from that JSON.
6. Never print raw unsafe input, rejected payloads, secrets, absolute paths, environment variables, stack traces, or connector data.
7. Use SHA-256 digest identity for every fixture entry.
8. Exit `0` only when all actual states match expected states and no unexpected failure exists.

## Public-safety notes

The fixture path and digest are allowed public identifiers. Raw fixture contents are not automatically public-safe. Summary and annotation surfaces must be treated as hostile-copy surfaces because they are likely to be read by humans, dashboards, and future agents.

## Next architecture question

How should MC implement the first executable `tools/replay-governance-artifact-manifest-helper-fixtures.mjs` so it emits this replay-result envelope, writes a redacted Markdown summary, emits GitHub annotations from normalized checks, and proves deterministic exit behavior for pass, expected-failure, unsafe-blocked, schema-invalid, and unexpected-failure cases?
