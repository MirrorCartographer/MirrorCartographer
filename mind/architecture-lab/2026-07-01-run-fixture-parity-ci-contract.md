# MC Architecture Lab — Fixture Parity CI Contract

Date: 2026-07-01
Status: design contract
Public-safety level: public-safe; no private user data, session content, or personal symbolic material included.

## Architecture question

How should MC implement `run-fixture-parity.mjs` so it validates its own failure report, exits with stable CI codes, and writes both JSON and short human console output?

## Research basis

Current source concepts used:

- GitHub Actions treats exit code `0` as success and any nonzero exit code as failure. This means the CI boundary is binary even when the underlying MC evidence is multidimensional.
- Node.js documentation warns that `process.exit()` can terminate before pending stdout/stderr writes complete. It recommends setting `process.exitCode` and allowing graceful shutdown when possible.
- RFC 9457 defines a machine-readable problem detail model so consumers do not need to parse human text to understand failures.
- SARIF's analysis-report pattern separates machine-readable result identity, locations, rules, and evidence from the presentation layer. MC should borrow that separation without adopting SARIF as the native fixture parity format.

Source URLs:

- https://docs.github.com/en/actions/how-tos/create-and-publish-actions/set-exit-codes
- https://nodejs.org/api/process.html#processexitcode
- https://www.rfc-editor.org/rfc/rfc9457.html
- https://docs.oasis-open.org/sarif/sarif/v2.1.0/sarif-v2.1.0.html

## Extracted concepts

### 1. CI is a binary gate, not the evidence layer

The runner must not rely on console output as the artifact of record. The exit code only tells CI whether the run passed. The JSON failure report tells humans, tests, and later repair tools what failed and where.

### 2. Write evidence before signaling failure

The runner must finish writing and validating the report before setting a failing exit code. In Node, prefer `process.exitCode = code` over direct `process.exit(code)` so output is not truncated.

### 3. Human output must be a lossy summary

Console output should be intentionally small:

- total fixtures checked
- first failing gate
- failure report path
- fixture ids with mismatches
- next command or file to inspect

The console is not allowed to carry unique evidence that is missing from the JSON report.

### 4. The failure report validates itself

If the runner detects a parity failure, it writes `fixture-parity-failure-report.v1.json`, then validates that report against `fixture-parity-failure-report.v1.schema.json`.

If report validation fails, the runner must escalate to an infrastructure failure code because the evidence channel itself is broken.

### 5. Exit codes need stable domain meanings

Recommended stable codes:

- `0`: all gates pass; no failure report required.
- `1`: fixture parity mismatch or expected validation failure; the system worked and found a governed failure.
- `2`: runner misuse, missing arguments, missing manifest path, or invalid CLI options.
- `3`: infrastructure failure: unreadable file, malformed JSON before schema validation, report could not be written, report did not validate, adapter invocation crashed, unsupported runtime.

No private paths, absolute local paths, environment variables, or personal material should appear in reports. Use repo-relative paths only.

## Required staged gates

`run-fixture-parity.mjs` should run gates in this order:

1. Resolve repo root and arguments.
2. Load `mind/fixtures/agency-validation/fixture-pack.v1.json`.
3. Validate the fixture-pack manifest.
4. Validate every expected receipt against `fixture-expected-receipt.v1.schema.json`.
5. Invoke the Node receipt generator or fake adapter.
6. Invoke the Python receipt generator or fake adapter.
7. Validate generated production receipts against `canonical-repair-receipt.v1.schema.json`.
8. Compare category sets and deterministic ordering.
9. If failure exists, write and validate `fixture-parity-failure-report.v1.json`.
10. Print short summary and set `process.exitCode`.

## Implementation contract

The runner should expose three separable functions:

- `runFixtureParity(options)` returns a structured pass/fail result and never writes console text directly.
- `writeFailureReport(result, outputPath)` writes canonical JSON and validates it.
- `printParitySummary(result, outputPath)` prints a compact human summary with no unique evidence.

The CLI wrapper should be thin:

- parse args
- call `runFixtureParity`
- write report if needed
- print summary
- assign `process.exitCode`

## Determinism requirements

The runner must sort by:

1. fixture id
2. runtime id
3. gate id
4. category id
5. repo-relative path

Generated JSON must not include wall-clock timestamps unless the schema explicitly marks them optional and non-comparative. For parity fixtures, prefer stable run ids like `fixture-pack.v1/local` over time-derived ids.

## Public-safe redaction requirements

Allowed:

- repo-relative fixture paths
- fixture ids
- schema ids
- runtime ids
- category ids
- keyword ids
- JSON Pointer locations

Disallowed:

- absolute local paths
- usernames
- home directories
- environment variables
- raw private session material
- symbolic or emotional content from private MC sessions

## Acceptance criteria

The first implementation is complete when:

- a passing fixture pack exits `0` and prints only a short success summary;
- a category mismatch exits `1`, writes a valid failure report, and prints the report path;
- missing or bad CLI arguments exit `2`;
- report-write or report-validation failure exits `3`;
- the JSON report contains all evidence needed to debug without reading console output;
- console output contains no evidence that is absent from the JSON report;
- no report contains private/personal material or absolute machine-local paths.

## Change in understanding

The parity runner is not the place where MC proves semantic correctness. It is the place where MC proves evidence transport integrity. The durable contract is:

manifest authority -> expected oracle -> generated receipts -> category comparison -> validated failure report -> CI exit signal

That gives MC a stable bridge from local development to CI and later agentic repair without turning logs into the source of truth.

## Next architecture question

How should MC implement the first fake-adapter version of `run-fixture-parity.mjs` so every staged gate and exit code can be tested before wiring real Python and Node receipt generators?
