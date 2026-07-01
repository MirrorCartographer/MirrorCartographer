# Fixture Parity Exit Code Gate Map

Status: requirements update / design pattern
Date: 2026-07-01
Public-safety level: abstracted implementation architecture only

## Architecture question

How should MC map fixture parity runner failure classes to stable exit codes and report gate ids so local developers, GitHub Actions, and later repair agents receive the same machine-readable failure semantics?

## Finding

The fixture parity runner needs a small, explicit failure semantics layer between the staged evidence gates and CI. GitHub Actions only distinguishes `0` from nonzero for check status, but MC needs the nonzero values to preserve diagnostic meaning for humans and future repair tools. Therefore, the runner should treat exit codes as a compact index into the JSON evidence report, not as the evidence itself.

The contract is:

```text
first failing gate -> canonical failure class -> stable exit code -> compact console summary -> durable JSON evidence
```

Console output should stay short. The JSON report remains the durable diagnostic surface.

## Useful concepts extracted from current sources

- Node recommends setting `process.exitCode` and allowing graceful process termination instead of calling `process.exit()` directly, because forced termination can truncate stdout writes.
- `process.exitCode` is the correct wrapper boundary: the importable runner core returns an integer; only the executable wrapper assigns it.
- GitHub Actions maps exit code `0` to success and any nonzero integer to failure, so MC can define internal nonzero meanings while preserving CI behavior.
- RFC 9457’s problem-details model is useful here as a design analogy: a stable problem `type`/class plus extension evidence lets machines reason about failures without scraping prose.

Sources consulted:

- Node.js `process.exitCode` documentation: https://nodejs.org/api/process.html#processexitcode
- GitHub Actions exit-code documentation: https://docs.github.com/en/actions/how-tos/create-and-publish-actions/set-exit-codes
- RFC 9457 Problem Details: https://www.rfc-editor.org/rfc/rfc9457.html

## Contract added

Created:

- `mind/requirements/fixture-parity-exit-code-map.v1.json`

This file defines:

- stable exit codes `0`, `2`, `3`, `4`, `5`, `6`, `7`, and `8`
- canonical `first_failed_gate_id` values
- allowed evidence kinds for each gate
- ordering invariants
- implementation targets for `runFixtureParity(argv, capabilities)`

## Exit code map

| Code | Failure class | Canonical first failed gate | Meaning |
| --- | --- | --- | --- |
| `0` | `pass` | none | All gates passed. |
| `2` | `cli-parse-failed` | `cli-parse` | Public CLI parsing or repo-relative path safety failed before fixture reads. |
| `3` | `manifest-validation-failed` | `manifest-validation` | Manifest missing, unreadable, invalid JSON, or schema-invalid. |
| `4` | `path-authority-failed` | `path-authority` | Unsafe path, undeclared actual fixture, or manifest path authority violation. |
| `5` | `adapter-or-receipt-validation-failed` | `generated-receipt-validation` | Adapter failure, missing/unexpected runtime, or invalid generated receipt. |
| `6` | `category-set-comparison-failed` | `category-set-comparison` | Expected and actual category sets differ. |
| `7` | `report-validation-failed` | `report-validation` | Runner could not validate its own failure report. |
| `8` | `runner-internal-error` | `runner-internal-error` | Programmer error or missing injected capability. |

## Important schema gap

The existing `fixture-parity-failure-report.v1.schema.json` has stages for:

- `manifest-validation`
- `path-authority`
- `expected-receipt-validation`
- `generated-receipt-validation`
- `category-set-comparison`
- `report-validation`

It does not currently include `cli-parse`, even though parser failure is the first planned membrane. That means one of two changes is required before full runner implementation:

1. revise the failure report schema to include a `cli-parse` stage; or
2. define a tiny preflight failure report schema for parser failures only.

Preferred path: revise the failure report schema in a compatible `v1.1` or new `v2` if the schema versioning rule treats enum expansion as breaking. This keeps all runner evidence under one report family.

## Design rule

Exit codes are not semantic prose. They are stable routing labels.

Repair agents should read:

1. `exitCode`
2. `first_failed_gate_id`
3. sorted gate evidence
4. fixture/runtime/category details

They should not parse console text or raw validator messages.

## Public-safe rule

Evidence must remain synthetic and abstract. Reports may name fixture ids, schema paths, category ids, safe repo-relative paths, and runtime ids. They must not expose private conversation text, personal artifacts, or raw user material.

## Implementation implications

`runFixtureParity(argv, capabilities)` should:

- return `exitCode` from the map, not ad hoc integers;
- record exactly one `first_failed_gate_id` for nonzero expected failures;
- mark downstream blocked gates as `not-run`;
- reserve code `8` for programmer faults and missing injected capability contracts;
- use `process.exitCode` only in the executable wrapper;
- keep the parser membrane strict and avoid adapter-leaking CLI flags.

## Next research question

How should MC revise `fixture-parity-failure-report.v1.schema.json` to represent `cli-parse` failures without breaking existing report consumers or weakening the staged gate model?
