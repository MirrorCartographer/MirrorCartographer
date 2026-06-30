# MC Architecture Lab — Self-Validating Run Manifest and Convergence Report

Date: 2026-06-30
Status: design pattern + schema contract
Scope: public-safe Mirror Cartographer architecture; no private or personal material included

## Architecture question

How should MC define `agency-validation-run-manifest.v1.schema.json` and `agency-convergence-report.v1.schema.json` so the paired validator runner can validate its own reports before CI interprets convergence status?

## Why this needed deeper understanding

The previous layer defined where paired-runner outputs should live: canonical JSON for CI, raw captures for debugging, and Markdown for reviewer comprehension. The missing piece was a self-validating contract. Without it, CI could accidentally treat a malformed report as a valid convergence result, or silently lose evidence paths needed for debugging.

This layer answers that by making the runner produce two machine-checkable documents:

1. A run manifest describing what was run, against which fixtures, using which validator versions and format policy.
2. A convergence report describing the normalized results, raw-evidence references, report-validation status, and human-review path.

## Current-source research basis

- JSON Schema Draft 2020-12 explicitly defines expected output concepts and output structures, including flag, basic, detailed, and verbose output forms. MC should borrow the separation between machine-readable validity and richer nested evidence, but keep its own domain-specific convergence envelope.
- GitHub Actions artifact documentation supports named artifact uploads, explicit paths, and `retention-days`. MC should therefore keep output roots deterministic and retention policy explicit in the manifest.
- JSON-Schema-Test-Suite is language-agnostic and used across multiple validator ecosystems, including Node.js and Python validators. MC should copy the validator-neutral testing pattern rather than binding CI truth to one library.
- Pytest can emit JUnitXML with `--junit-xml=path`, but pytest warns that adding custom properties can break latest JUnitXML schema verification. MC should treat JUnitXML as optional CI decoration, not the canonical report.
- 2026 GitHub Actions reliability research found that larger and more complex workflows are associated with higher failure rates and maintenance burden. MC should keep the first CI workflow boring: one runner job, explicit versions, explicit artifacts, and minimal dynamic behavior.

Sources:
- https://json-schema.org/draft/2020-12/json-schema-core
- https://docs.github.com/en/actions/tutorials/store-and-share-data
- https://github.com/json-schema-org/JSON-Schema-Test-Suite
- https://docs.pytest.org/en/stable/how-to/output.html
- https://arxiv.org/abs/2605.26825

## Useful concepts extracted

### 1. Report validity must be checked before report meaning

The runner should not let CI inspect `overall_status` until both are true:

- `manifest_valid` is true.
- `convergence_report_valid` is true.

This prevents a broken runner from producing a false pass.

### 2. The manifest records execution conditions, not interpretation

The manifest is the receipt for a run:

- run ID
- repository and commit SHA
- fixture pack path
- schemas under test
- validator versions
- format-validation policy
- output layout
- privacy/public-safety rule
- CI permissions and artifact retention

It does not decide whether agency pressure, symbolic meaning, or user experience is true.

### 3. The convergence report records normalized evidence, not raw validator authority

The convergence report records:

- fixture-level expected status
- actual status
- whether validators converged after normalization
- canonical repair categories
- references to raw error captures
- Markdown report path for human review

It does not compare raw error wording, raw error order, or psychological truth.

### 4. Raw evidence remains debuggable but not brittle

The convergence report points to raw capture files by stable error IDs. That keeps debugging detail available while preventing CI from depending on unstable validator message text.

### 5. Format validation must be explicit

JSON Schema `format` behavior varies by implementation and configuration. The manifest therefore requires one declared mode:

- `off`
- `annotation-only`
- `assertion-enabled-for-declared-formats`

MC should initially prefer `annotation-only` unless a fixture is explicitly testing format assertion boundaries.

## Design pattern added

Name: Self-Validating Convergence Envelope

Intent: Make the paired validator runner produce evidence that can be validated before it is interpreted.

Structure:

- `manifest.json`: what was run and under what policy
- `convergence-report.json`: normalized machine-readable result
- `convergence-report.md`: reviewer-readable explanation
- `raw/ajv.json`: raw Ajv capture
- `raw/python-jsonschema.json`: raw python-jsonschema capture

CI order:

1. Validate the run manifest against `agency-validation-run-manifest.v1.schema.json`.
2. Validate the convergence report against `agency-convergence-report.v1.schema.json`.
3. Confirm the manifest and report share the same `run_id`.
4. Confirm raw capture paths referenced by the report exist.
5. Compare fixture results against the expected-output pack.
6. Fail only on schema-invalid reports, unexpected divergence, missing evidence, or expected-output mismatch.
7. Do not fail on raw validator message wording differences.

## Files added

- `mind/schemas/agency-validation-run-manifest.v1.schema.json`
- `mind/schemas/agency-convergence-report.v1.schema.json`

## Implementation requirements

### Runner requirements

- Generate a deterministic run ID in the form `agency-run-YYYYMMDDTHHMMSSZ-slug`.
- Write all outputs under `mind/reports/agency-validation/runs/<run_id>/`.
- Store raw validator outputs separately from canonical convergence status.
- Validate both the manifest and convergence report before emitting final CI status.
- Include validator package versions in every manifest.
- Keep public-safe fixture policy explicit.

### CI requirements

- Use pinned validator versions.
- Use least-privilege GitHub Actions permissions.
- Upload the run directory as one named artifact.
- Use short artifact retention for generated debug outputs.
- Keep JUnitXML optional; canonical truth lives in `convergence-report.json`.

### Reviewer requirements

- Markdown report must explain what failed in repair-receipt language.
- Markdown report must link each failure to canonical category and raw evidence ID.
- Markdown report must state that validator convergence means infrastructure agreement, not symbolic truth.

## What changed in understanding

Before this layer, the architecture had schemas for fixtures, raw captures, category maps, and expected output packs. It still lacked a guard against malformed runner outputs. The new understanding is that MC needs a fourth validation gate: the runner must validate its own evidence envelope before CI reads it.

This turns CI from “trust the validator output” into “validate the validator-reporting system.” That matters because paired validators add complexity. Without a manifest/report contract, the paired system could produce more apparent rigor while actually increasing the number of ways to misread failure.

## Next research question

How should MC implement the first runner skeleton that writes a valid manifest, raw capture pair, convergence report JSON, and Markdown report for the three seed fixtures, while keeping GitHub Actions minimal and pinned?
