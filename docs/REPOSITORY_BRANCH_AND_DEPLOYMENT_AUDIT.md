# Repository branch, deployment, and reproducibility audit

**Audit date:** 2026-11-05  
**Scope:** connected GitHub repositories and connected Render workspace.

## Connected repository inventory

| Repository | Visibility | Default branch |
|---|---|---|
| `MirrorCartographer/MirrorCartographer` | Public | `main` |
| `MirrorCartographer/mirror-cartographer-ui` | Public | `main` |
| `MirrorCartographer/c` | Private | `main` |
| `MirrorCartographer/J` | Private | `main` |

Private repositories remain private. This audit does not copy their source into the public project.

## Branch census

- `MirrorCartographer/mirror-cartographer-ui`: 224 branch names returned across three pages by GitHub branch search.
- `MirrorCartographer/MirrorCartographer`: 71 branch names returned by GitHub branch search.

The branch names indicate a large amount of parallel experimentation across continuity, research, creative interaction, build infrastructure, artifact custody, reproducibility, deployment, and evaluation. A branch name is not proof that its code is complete, tested, deployed, or merged. The branches must be inventoried by head commit, last update, diff against `main`, test status, and merge relationship before selecting work for integration.

## High-value branch leads

- `fix/living-encounter-runtime`: its README describes a broad Mirror Cartographer prototype spanning archive, symbols, animals, body, proof, creative, build, money/stability, and friction. Its package manifest includes dedicated contract checks for field encounter, phone, audio, room world, deployment identity, and other runtime surfaces. This is a promising candidate for the current living-encounter repair, but source presence is not a passing test.
- `work/100-iterations-2026-11-03`: its README describes the House of Mouths, a workbench with 92 HTML artifacts, and multiple published entry points. The current `main` README reports 96 HTML artifacts. This discrepancy should be reconciled by comparing branch and main contents, not by assuming either number is the complete count.
- Numerous `fia/*` branches in the UI repository describe reproducibility, build orchestration, artifact registries, signed provenance, release bundles, runtime identity, deployment transactions, and worker isolation. These should be consolidated into one dependency-aware platform roadmap rather than merged wholesale.
- `research/*` branches describe continuity, evidence binding, correction ledgers, source origin, invariance, and failure attribution. These are candidates for research-index consolidation.

## Deployment status observed

GitHub combined status checks for the inspected public research repository commit returned six Vercel project checks in `failure` state. The target URL points to the Vercel project page with `upgradeToPro=build-rate-limit`. The inspected public UI repository commit returned three Vercel project checks with the same target URL and failure state.

These status records indicate a Vercel build-rate-limit/account-plan gate for the inspected commits. They do not establish a source-code build failure. No successful deployment of these inspected commits was verified in this audit.

The connected Render workspace list returned one workspace, but listing services in that workspace returned `null`; no Render service or deployment could be independently identified through the available connector response.

## CI status

A dedicated GitHub Actions workflow was added for the privacy-aware archive manifest unit tests. The workflow file is committed, but no passing Actions run was available in the inspected combined-status response. Vercel status checks are not substitutes for the archive unit-test workflow. Until a real Actions run is retrieved, describe the test workflow as configured, not passed.

## Integration policy

Do not merge all 224 UI branches or 71 research branches automatically. First produce a branch ledger with: branch name, head SHA, last commit date, ahead/behind counts, touched paths, test commands, CI result, security/privacy review, duplicate/superseded status, and proposed destination. Merge only branches with reproducible value and no conflicting or sensitive artifacts. Preserve abandoned branches until their contents are inventoried.

## Immediate engineering priorities

1. Resolve the Vercel build-rate-limit gate or use an independent GitHub Pages/static artifact route for reproducible public demos.
2. Run the archive manifest unit tests in GitHub Actions and preserve the run URL and logs.
3. Compare `fix/living-encounter-runtime` with UI `main`; run its named contract checks in a clean environment before considering a merge.
4. Generate a machine-readable branch ledger for both public repositories and a private, access-controlled ledger for C and J.
5. Select a small number of representative end-to-end demos and document clean-checkout reproduction instructions.


## Self-maintaining public census

A weekly public-only GitHub Actions worker is now committed at `scripts/public-branch-census.mjs` with workflow `.github/workflows/weekly-public-evidence-census.yml`. It snapshots branch names, head SHAs, protected-branch flags, duplicate branch-head groups, and default-branch status/check-run metadata for the two public repositories only. It writes a dated JSON snapshot plus `latest.json` and commits those records back to this repository. Two additional weekly test workflows run the archive-manifest unit tests (Monday 13:10 UTC) and the UI Hub/Creation Portal contract tests (Monday 13:05 UTC).

The workflow is configured for Monday 13:00 UTC, manual dispatch, and a one-time push trigger for its own source/workflow. It does not inspect private repositories C or J, does not collect source contents, and does not require a long-lived API key. Its first successful run has not been verified in the connected status results; treat the worker as configured, not yet operationally proven.


An initial names-only snapshot is preserved at [`evidence/branch-census/initial-names-only-2026-11-05.json`](../evidence/branch-census/initial-names-only-2026-11-05.json). It records all 224 UI branch names and all 71 research branch names. The branch-search response did not expose head SHAs or timestamps, so the file explicitly marks those fields as unavailable; the scheduled census worker is intended to add them.

## Branch-family concentration

The names-only snapshot supports a useful first-pass clustering:

| Repository | Branch family | Count |
|---|---|---:|
| UI | `fia/` | 119 |
| UI | no prefix | 48 |
| UI | `agent/` | 18 |
| UI | `research/` | 8 |
| UI | `creative/` | 7 |
| UI | `feature/` | 6 |
| Research | `agent/` | 10 |
| Research | no prefix | 9 |
| Research | `automation/` | 8 |
| Research | `research/` | 8 |
| Research | `creative/` | 7 |
| Research | `feature/` | 6 |
| Research | `investigation/` | 6 |
| Research | `feat/` | 5 |

The 119 UI `fia/` branches cluster by naming into 19 artifact-registry branches, 15 worker/isolation branches, 11 release-evidence/promotion branches, 8 reproducibility branches, 6 deployment/rollback branches, 4 evidence/provenance branches, 1 security/admission branch, and 55 other FIA branches. These are mutually exclusive first-match categories based on branch names, not verified implementation categories.

**Interpretation:** the strongest hidden infrastructure lead is the FIA lane. It appears to contain a large parallel program for artifact custody, reproducible builds, isolated workers, release graphs, deployment/rollback, and evidence sealing. This is a high-value recovery target, but the branch census alone cannot establish that any worker ran or that any artifact registry is operational. The next step is a head-SHA/diff/test ledger and dependency graph, not a mass merge.


## Current repository identity and stack reconciliation

A recovered May 3, 2026 repo-comparison packet labels `mirror-cartographer-ui` as private and the Next.js research repository as public. That visibility record is stale: the connected GitHub API currently reports both `MirrorCartographer/MirrorCartographer` and `MirrorCartographer/mirror-cartographer-ui` as public, while `MirrorCartographer/c` and `MirrorCartographer/J` remain private.

Current default-branch package metadata:

- `mirror-cartographer-ui`: Vite 4, React 18.3.1, with a `build:pages` script that builds for the `/mirror-cartographer-ui/` Pages base.
- `MirrorCartographer`: Next.js 15.3.5, React 19, TypeScript 5, Tailwind CSS 4, with separate governance/continuity/workbench verification scripts.

This confirms the historical Vite/React UI lane is now publicly inspectable. It does not prove that the old private prototype and the current public repository are byte-for-byte identical or that every historical Canvas artifact was merged into it.


## Privacy review finding

A sample of legacy public branch README files contains personal identifying material and references to personal health/pet context. Those README bodies were not copied into the public evidence archive and should not be merged into the canonical branch without a privacy scrub. A private ledger preserves the exact sampled locations and blob identifiers. The sample is not a complete scan of all 224 UI branches.

Replacing a README with a sanitized version would not remove the original content from Git history. Full historical removal would require destructive history rewriting or branch deletion, so no such operation was performed. A complete privacy sweep and any history rewrite require explicit owner approval.

