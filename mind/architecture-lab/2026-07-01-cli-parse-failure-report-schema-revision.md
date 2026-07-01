# CLI Parse Failure Report Schema Revision

## Architecture question

How should MC revise `fixture-parity-failure-report.v1.schema.json` to represent `cli-parse` failures without breaking existing report consumers or weakening the staged gate model?

## Research basis

- JSON Schema object constraints treat additional properties as valid by default, but `additionalProperties: false` is useful when report consumers need closed, predictable machine-readable evidence.
- JSON Schema `additionalProperties` only recognizes sibling-declared properties, while `unevaluatedProperties` can reason across composed subschemas. For this v1 schema revision, the safer move is to avoid a large composition rewrite and make the smallest compatible extension.
- JSON Schema conditional validation supports `if` / `then` gates that allow report shape to change by state without inventing a separate report family.
- RFC 9457 problem-detail design reinforces stable machine-readable types and extension members instead of depending on human message wording.
- Node and GitHub Actions patterns reinforce that exit codes should route failure class, while the report should carry diagnostic evidence.

## Decision

`cli-parse` becomes the first reportable gate in the same fixture parity failure report family.

The schema now supports two fixture-pack states:

1. Resolved fixture pack: existing reports keep `fixture_pack_id` and `manifest_path`.
2. Not-resolved fixture pack: parser failures can report `resolution_status: not-resolved` before any manifest path is trusted.

This keeps current valid reports valid while allowing a pre-manifest failure report that does not fake a fixture id, fake a manifest path, or leak raw unsafe input into public evidence.

## Schema changes implemented

Updated: `mind/schemas/fixture-parity-failure-report.v1.schema.json`

Changes:

- Added `fixture_pack.resolution_status` with values `resolved` and `not-resolved`.
- Replaced unconditional inner fixture-pack requirements with an `anyOf`:
  - normal reports require `fixture_pack_id` and `manifest_path`;
  - parser-failure reports can use `resolution_status: not-resolved`.
- Added `cli-parse` to `gate_result.stage`.
- Added CLI-specific evidence kinds:
  - `cli-parse-error`
  - `unknown-flag`
  - `unsafe-path`
  - `missing-required-argument`
- Added `argument_name` as a public-safe CLI evidence field.
- Added conditional report rules: if any gate has stage `cli-parse`, fixture pack must be `not-resolved`, `fixture_count` must be `0`, and `failed_fixture_count` must be `0`.

## Boundary rule

A CLI parse failure report must not include untrusted raw path strings. It may include the flag name, the failure kind, a stable summary, and a repair hint. Unsafe path text stays in console/debug-local context, not durable public evidence.

## Updated model

raw argv -> strict public parser -> if failure: cli-parse report with not-resolved fixture pack -> stable exit code -> compact console summary

raw argv -> strict public parser -> safe typed config -> fixture pack resolution -> staged runner gates -> parity report

## Implementation implication

`runFixtureParity(argv, capabilities)` should build a report even when `parseFixtureParityCli(argv)` throws. The parser exception should be normalized into one `cli-parse` gate, not emitted as raw exception text.

## Next research question

How should MC implement the first executable `run-fixture-parity.mjs` core so parser exceptions become schema-valid `cli-parse` reports, stable exit codes, and compact console summaries without reading fixture files?
