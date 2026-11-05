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

