# Validator type-guard regression: verification record

## Classification

**Tool limitation / input-validation defect.** The validator previously performed set membership on untrusted values before checking their types. Lists supplied as classification values could raise `TypeError: unhashable type: 'list'` instead of returning a validation error.

## Scope and reproduction

The reported reproductions were synthetic:
- `privacy: []`
- `claims[0].status: []`
- `domains: [["state"]]`
- `category: []`

The intended result is a structured validation error and nonzero CLI exit, not an unhandled exception.

## Change

- Type-check privacy, evidence status, domains, and limitation category before membership checks.
- Reject Boolean, out-of-range, NaN, infinite, and string confidence values.
- Avoid JSON-serializing arbitrary untrusted values solely for credential-marker scanning, preventing huge numeric values from crashing that scan.
- Add standard-library unittest regression coverage and run it in GitHub Actions.

## Verification status

Local test claims from earlier investigation are not a substitute for this branch's hosted run. The updated workflow now executes:
1. the valid self-map fixture,
2. the valid limitation fixture,
3. the validator regression suite,
4. Python compilation for the validator and test module.

Record the exact run URL and outcome in the PR after CI completes.

## Residual risks

- The credential-marker scan is heuristic and can miss secrets or flag harmless text.
- Tests cover named malformed inputs and are not exhaustive fuzz testing.
- CI uses a separate GitHub-hosted environment; it does not reproduce the original local DNS failure.
- No private records or credentials are needed for these tests.

## Proof gate

Do not merge until the updated GitHub Actions run on the PR completes successfully and the diff has been reviewed. If CI fails, fix the cause and rerun; do not report the workflow as passing based on local tests alone.
