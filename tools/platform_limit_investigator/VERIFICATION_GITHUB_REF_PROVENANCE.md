# Verification Record: Git Ref Provenance

**Investigation date:** 2026-10-23  
**Repository:** `MirrorCartographer/MirrorCartographer`  
**Branch:** `investigation/github-ref-provenance-guard`  
**Draft PR:** [#17](https://github.com/MirrorCartographer/MirrorCartographer/pull/17)  
**Classification:** `tool` — source-reference ambiguity / provenance gap. This is not evidence of a GitHub outage or permission failure.

## Summary

The repository file-fetch operation uses the default branch when its `ref` argument is omitted. During investigation, `next.config.ts` had different blob SHAs on `main` and the head snapshot used for PR #16. A conclusion about a CI failure can therefore be wrong if the investigator reads the same path from the default branch rather than the exact commit under test.

This is a reproducible workflow limitation caused by implicit source selection and insufficiently pinned evidence, not a claim that the connector's documented default-branch behavior is itself a bug.

## Evidence

| File snapshot | Requested ref / commit | Blob SHA | Observation |
|---|---|---|---|
| `next.config.ts` | `main` commit `129e6ec1e48bd497ce15a84f6ca59e9021073e36` | `1f6f6ced981d7010d5527d102714a48329d4056e` | No `output: "export"` declaration in the retrieved content |
| `next.config.ts` | PR #16 head snapshot `e40c31cb5fbccd9f87740eecf9794658d9c9e1f2` | `00c940ebfa835e6b126078c8b03a2c9a0dd136f7` | Contains `output: "export"` |
| `src/app/api/html-artifacts/route.ts` | PR #16 head snapshot `e40c31cb5fbccd9f87740eecf9794658d9c9e1f2` | `add5132cc59841725f6e3afaf780fa7ac93074ff` | Declares `dynamic = "force-dynamic"` |

The repository tool's `fetch_file` contract explicitly says that omitting `ref` reads from the default branch. The default-branch fetch and explicit fetch at commit `129e6ec1e48bd497ce15a84f6ca59e9021073e36` returned the same `next.config.ts` blob SHA.

The historical application CI failure is recorded in [Mirror Cartographer CI run #4500](https://github.com/MirrorCartographer/MirrorCartographer/actions/runs/39369061943). Its reported conflict was static export versus a dynamically executed API route. That result applies to the PR-head snapshot used by that run; it does not prove the same configuration exists on current `main`.

## Reproduction procedure

1. Fetch `next.config.ts` with no `ref` and record the returned blob SHA.
2. Fetch it again with explicit commit `129e6ec1e48bd497ce15a84f6ca59e9021073e36`; the returned blob SHA is `1f6f6ced981d7010d5527d102714a48329d4056e`.
3. Fetch it at explicit PR-head snapshot `e40c31cb5fbccd9f87740eecf9794658d9c9e1f2`; the returned blob SHA is `00c940ebfa835e6b126078c8b03a2c9a0dd136f7`.
4. Compare the blob SHAs. They differ, proving that the same path has different content across the two snapshots.

## Mitigation added

- `tools/platform_limit_investigator/validate_evidence.py` requires an explicit reference, a full 40-character commit SHA, and a full 40-character blob SHA for each evidence record.
- `tools/platform_limit_investigator/examples/github_ref_provenance.json` contains only public repository metadata and synthetic packet structure.
- `tools/platform_limit_investigator/tests/test_validate_evidence.py` includes regression tests for missing refs, malformed SHAs, malformed packet types, and path divergence.
- `.github/workflows/platform-limit-evidence-validation.yml` runs the offline tests, Python compilation, and fixture validator with read-only repository permissions.

The validator reports different blob SHAs for the same path as a divergence. It does **not** establish that a commit SHA belongs to the named repository or that the blob SHA is actually present at that commit. Those relationships must be verified against GitHub or another trusted Git object source.

## Tests actually run locally

Executed against files copied from the branch after fetching them through the GitHub connector. The local validator's computed Git blob SHA matched the connector's returned blob SHA exactly: `d980e6d6e23a6e21c3f985644686f7a87c22ffce`.

Commands:

```sh
python -m unittest discover -s tools/platform_limit_investigator/tests -v
python -m py_compile tools/platform_limit_investigator/validate_evidence.py tools/platform_limit_investigator/tests/test_validate_evidence.py
python tools/platform_limit_investigator/validate_evidence.py tools/platform_limit_investigator/examples/github_ref_provenance.json
```

Results:

- **11 regression tests passed.**
- Python compilation passed.
- Fixture validation passed and reported two different blob SHAs for `next.config.ts`, as expected.

The divergence message is expected output, not a test failure.

## Hosted verification status

The evidence snapshot for the preceding PR head was `1309965cf8f1c18eb7740e206f6a89913bcaa940`, with base commit `129e6ec1e48bd497ce15a84f6ca59e9021073e36`. GitHub Actions evaluated PR merge ref `52420e8f8b159538522eeb13df224ebaf5b2239a`, which merges that head into that base.

- [Platform-limit evidence validation run #7](https://github.com/MirrorCartographer/MirrorCartographer/actions/runs/40124595101): **completed / success**. Job `validate-evidence` succeeded. The hosted log records 11 tests run, successful Python compilation, `VALID: 2 evidence records have explicit refs and immutable SHA provenance`, and the expected divergence report for `next.config.ts`.
- [Mirror Cartographer CI run #4534](https://github.com/MirrorCartographer/MirrorCartographer/actions/runs/40124595091): **completed / success**. The `Typecheck and build` job succeeded; logs show typecheck and production build completed successfully.
- Both jobs checked out merge ref `52420e8f8b159538522eeb13df224ebaf5b2239a`; their logs state it merges head `1309965cf8f1c18eb7740e206f6a89913bcaa940` into base `129e6ec1e48bd497ce15a84f6ca59e9021073e36`.

These hosted results validate the stated PR merge snapshot, not every possible repository state or malformed record. This documentation update itself will create a new PR head; its workflow results must be checked separately rather than inferred from the preceding runs.

## Residual risks

1. A valid-looking SHA can still be incorrect or unrelated to the repository.
2. The validator does not fetch remote Git objects or authenticate source provenance.
3. Branch names are mutable; immutable commit SHAs should be used for reproducible investigations.
4. The historical application build conflict is separate from this provenance mitigation and is not fixed by it.
5. The hosted validation result is unverified.
6. No secrets or private records are included.

## Proof gate

Keep PR #17 draft and unmerged until:
- the new workflow's result is verified against the exact PR head through an authoritative Actions/check-run record;
- the exact head SHA and file/blob provenance are checked;
- the full diff is reviewed;
- the reviewer confirms that the record distinguishes direct observation from inference.
