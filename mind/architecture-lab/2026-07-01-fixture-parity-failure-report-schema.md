# Fixture parity failure report schema

## Architecture question

How should MC define the deterministic failure report schema for `run-fixture-parity.mjs` so CI, humans, and later repair tooling can consume the same parity evidence without depending on console output?

## Research summary

The useful pattern is not to copy an external report format directly. JSON Schema output gives the right validation-location primitives: validity, error collections, keyword locations, instance locations, and implementation-independent structure. It also explicitly leaves error message wording undefined, which supports MC's existing rule that parity must not depend on raw validator messages.

SARIF contributes the idea of stable rule identifiers, result levels, locations, fingerprints, and machine-readable result objects. JUnit XML contributes the CI habit of test suites, test cases, failures, and errors, but it is XML-oriented and intentionally loose across tools. RFC 9457 contributes a clean error-object pattern for machine-readable problem types, but it is HTTP-interface oriented and should not become the internal fixture evidence format.

## Understanding change

The parity report should be a domain-specific JSON artifact with strict ordering and gate semantics. It is not a console log, not a semantic judge, and not a replacement for the fixture manifest or canonical repair receipt. It records which gate failed, what fixture or runtime was involved, what structural evidence exists, and what public-safe repair hint follows.

## Design pattern

`fixture manifest -> staged runner gates -> generated receipts -> category-set comparison -> deterministic failure report`

The report should include:

- `schema_version` with a fixed value.
- `report_id` as a public-safe stable run-local identifier.
- `runner` metadata without raw environment variables.
- `fixture_pack` manifest identity and optional hash.
- `overall_status` as `pass` or `fail`.
- `ordering_policy` for gates, fixtures, runtimes, categories, and object keys.
- `gates[]`, sorted by stage order and gate id.
- `evidence[]` per gate, sorted deterministically.
- category deltas for comparison failures.
- public-safety constraints preventing private scenario text and validator-message dependence.

## Implementation decision

Add `mind/schemas/fixture-parity-failure-report.v1.schema.json` as the durable contract for runner reports.

The runner should emit this report before printing human console text. Console output can summarize the JSON report, but must not be the authority.

## Next research question

How should MC implement `run-fixture-parity.mjs` so it validates its own failure report against `fixture-parity-failure-report.v1.schema.json`, exits with stable CI codes, and writes both machine-readable JSON and short human-readable console output?
