# Verification record: workflow-run inventory completeness

## Classification

**Tool limitation: incomplete inventory from the specialized workflow-run helper.** Its contract says it filters to pull-request-triggered runs and returns only the first page. It is therefore not a complete inventory of every workflow run associated with a commit.

This is a documented scope limitation, not evidence of a permissions failure or API outage. It becomes an investigation error only if the filtered result is treated as exhaustive.

## Reproduction

Repository: `MirrorCartographer/MirrorCartographer`

Historical PR #17 head: `37aa123468f70afde41e85ac0e11903abe0d41d5`

A read-only API request to `GET /repos/MirrorCartographer/MirrorCartographer/actions/runs?head_sha=37aa123468f70afde41e85ac0e11903abe0d41d5&per_page=100` returned three runs associated with PR #17:

| Run number | Run ID | Event | Conclusion |
|---:|---:|---|---|
| 9 | `40124733322` | `pull_request` | `success` |
| 4535 | `40124733236` | `pull_request` | `success` |
| 8 | `40124728243` | `push` | `success` |

The specialized `fetch_commit_workflow_runs` helper returned only runs #9 and #4535 and omitted push-triggered run #8. A second reproduction on PR #18 head `376d9c043d34f6ca99cb43ceaf406e9aa1f5937e` showed the same event-filter difference: the direct API response included push run #2 (ID `40225646231`) alongside pull-request runs #3 and #4539, while the specialized helper returned only the pull-request-triggered runs.

The omission is consistent with the helper's documented filter; it is not evidence that a run was deleted or that the API failed.

## Synthetic validator and tests

`validate_run_inventory.py` compares saved run-ID inventories offline. It detects omissions and rejects duplicate IDs and malformed records. Fixture IDs `1001`, `1002`, and `1003` are synthetic and do not represent real GitHub runs.

Historical validation on PR #18 head `376d9c043d34f6ca99cb43ceaf406e9aa1f5937e`:

- Local regression suite: **8 tests passed**.
- Python compilation: passed.
- Synthetic omission fixture: expected missing ID `1003` detected.
- Hosted [validation workflow run #3](https://github.com/MirrorCartographer/MirrorCartographer/actions/runs/40225695623): **success**, with 8 tests, compilation, and the expected synthetic diagnostic.
- Hosted [application CI run #4539](https://github.com/MirrorCartographer/MirrorCartographer/actions/runs/40225695570): **success**, typecheck and production build passed.
- Both hosted runs evaluated merge ref `567f68a5b60798a02bb9d8071a206ca0c45d23ae`.

These results apply only to the recorded historical snapshot. They must not be assumed to cover later commits or a follow-up branch.

## Residual risks

- The direct API response must be fully paginated for inventories exceeding one page. The validator compares supplied snapshots; it does not fetch GitHub data.
- Run IDs establish identity for comparison but do not prove that an API inventory is exhaustive.
- A push-triggered run associated with a PR may be relevant to history without being a required PR check. Do not equate inventory completeness with merge policy.
- The diagnostic does not change GitHub's helper behavior or bypass connector restrictions.
- No credentials or private records are included.

## Proof gate

1. For any new head, verify the exact head SHA and corresponding hosted run/check results before recording CI as passed.
2. Review the five-file inventory-validator diff and its read-only workflow permissions (`contents: read`).
3. Reconfirm real run IDs and trigger events against the read-only API response before relying on them in another incident.
4. Keep the parent PR draft until human review; do not merge automatically.
