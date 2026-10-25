# Verification record: workflow-run inventory completeness

## Classification

**Tool limitation: incomplete inventory from the specialized workflow-run helper.** The helper contract explicitly says it filters to pull-request-triggered runs and returns only the first page. It is therefore not a complete inventory of every workflow run associated with a commit.

This is a documented scope limitation, not evidence of a permissions failure or an API outage. It becomes an investigation error only if its result is treated as exhaustive.

## Reproduction

Repository: `MirrorCartographer/MirrorCartographer`

Commit queried: `37aa123468f70afde41e85ac0e11903abe0d41d5`

Read-only request A: `GET /repos/MirrorCartographer/MirrorCartographer/actions/runs?head_sha=37aa123468f70afde41e85ac0e11903abe0d41d5&per_page=100`

Observed three runs, each with that head SHA and linked to PR #17:

| Run number | Run ID | Event | Conclusion |
|---:|---:|---|---|
| 9 | `40124733322` | `pull_request` | `success` |
| 4535 | `40124733236` | `pull_request` | `success` |
| 8 | `40124728243` | `push` | `success` |

Read-only request B: the specialized `fetch_commit_workflow_runs` helper for the same repository and commit returned only runs #9 and #4535. It omitted push-triggered run #8, even though the direct API response associated that run with PR #17.

This is a reproducible coverage difference between two read methods. The helper's omission is consistent with its documented event filter; it is not evidence that the run was deleted or that the API failed.

## Synthetic validator

`validate_run_inventory.py` compares saved run-ID inventories offline. It detects omissions, rejects duplicate IDs and malformed records, and can verify an expected diagnostic for a synthetic fixture. The fixture IDs `1001`, `1002`, and `1003` are synthetic and do not represent real run IDs.

## Tests run locally

- `python -m unittest discover -s tools/platform_limit_investigator/run_inventory/tests -v`: **8 tests passed**.
- `python -m py_compile tools/platform_limit_investigator/run_inventory/validate_run_inventory.py tools/platform_limit_investigator/run_inventory/tests/test_validate_run_inventory.py`: passed.
- `python tools/platform_limit_investigator/run_inventory/validate_run_inventory.py tools/platform_limit_investigator/run_inventory/examples/synthetic_run_inventory.json --expect-missing 1003`: passed and printed the expected omission diagnostic.

These tests were run against the local prototype before publishing the files. The committed versions must be fetched back and re-run, and hosted CI must independently confirm the tests against the committed PR head before merge.

## Residual risks

- The direct API response must be fully paginated for inventories exceeding one page. The validator only compares supplied snapshots; it does not fetch GitHub data.
- Run IDs establish identity for comparison but do not prove that the API inventory is exhaustive.
- A push-triggered run associated with a PR may be relevant to history without being a required PR check. Do not equate inventory completeness with merge policy.
- This diagnostic does not change GitHub's helper behavior and does not bypass connector restrictions.
- No credentials or private records are included.

## Proof gate

1. Confirm hosted validation on the exact PR head SHA.
2. Review the five-file diff and workflow permissions (`contents: read`).
3. Verify the saved real-world observations against the read-only API response before relying on them in another incident.
4. Keep the PR draft until reviewed; do not merge automatically.
