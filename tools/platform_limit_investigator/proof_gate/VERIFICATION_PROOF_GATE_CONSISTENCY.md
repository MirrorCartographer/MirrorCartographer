# Verification record: proof-gate state drift

## Classification

**Context/evidence-state drift.** A verification record can remain stale after later CI results are added to a pull-request description or conversation. The project then has conflicting representations of whether proof is pending or complete.

## Reproduction

Repository: `MirrorCartographer/MirrorCartographer`; existing draft PR #18.

The PR description recorded successful hosted checks for head `376d9c043d34f6ca99cb43ceaf406e9aa1f5937e`:

- [Platform-limit workflow run inventory validation, run #3](https://github.com/MirrorCartographer/MirrorCartographer/actions/runs/40225695623): success; 8 tests, compilation, and the expected synthetic diagnostic passed.
- [Mirror Cartographer CI, run #4539](https://github.com/MirrorCartographer/MirrorCartographer/actions/runs/40225695570): success; typecheck and production build passed.

The committed `tools/platform_limit_investigator/run_inventory/VERIFICATION_RUN_INVENTORY.md` at blob `6ee67175cea9f7b36247081f243f00c030ad7eb9` still said the committed versions “must be fetched back and re-run,” that “hosted CI must independently confirm” the tests, and the proof gate still said “Confirm hosted validation on the exact PR head SHA.” Those statements were stale relative to the PR description's successful runs for that same historical head.

This is a documentation/context consistency failure, not a CI failure. The cause is duplicated status text without an automated check for claims that later evidence has superseded.

## Mitigation

`validate_proof_gate.py` is a standard-library offline checker. It takes a JSON status manifest and a Markdown verification record, then flags configured phrases that imply pending proof when the corresponding check status is `success`. The synthetic fixture intentionally contains this contradiction.

The checker does not fetch GitHub or establish whether a status manifest is accurate. The manifest's run URL, head SHA, and conclusion still need to be verified against the authoritative CI record.

## Tests

- Local regression suite: **8 tests passed**.
- Python compilation: passed.
- Synthetic stale-state fixture: the checker reported all three configured stale phrases and exited successfully only because `--expect-stale validator_ci` matched the expected diagnostic.
- The clean-record path is covered by a unit test.

These are local prototype results. Hosted validation for this follow-up branch must be checked independently; historical PR #18 runs do not validate this follow-up commit.

## Residual risks

- Phrase matching is case-insensitive but literal; paraphrases can evade detection and quoted explanatory text can cause false positives.
- The checker compares supplied status metadata to configured phrases; it does not verify CI status or authenticate the manifest.
- The fix does not automatically synchronize PR descriptions, verification files, and conversation summaries.
- This is a stacked follow-up to PR #18. It should target `investigation/workflow-run-inventory-completeness` and be reviewed before the parent PR is merged.
- No secrets or private records are included.

## Proof gate

1. Verify the new workflow result against this follow-up PR's exact head SHA.
2. Fetch the committed validator and tests back and confirm the local test copy matches their Git blob SHAs.
3. Review the phrase list for false positives and false negatives; keep the workflow read-only (`contents: read`).
4. Keep this follow-up in draft until human review; do not merge automatically.
