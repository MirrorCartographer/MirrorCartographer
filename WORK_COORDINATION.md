# Cross-Chat Work Coordination

## Purpose
Coordinate parallel work on Mirror Cartographer without losing decisions, duplicating changes, or breaking the few known-good live experiences.

## Protected canonical experiences
These URLs are user-confirmed and must not be replaced, renamed, or casually repointed:
- https://mirror-cartographer-ui-3orp.vercel.app
- https://mirrorcartographeravprototypev4.vercel.app/#

Do not claim a replacement is working until it has been deployed and verified in a browser.

## Collaboration protocol
Any ChatGPT conversation working on this project should:
1. Read this file and the root README before making architectural changes.
2. Inspect the current branch, recent commits, and relevant files before editing.
3. Prefer small, testable commits; do not overwrite another workstream's edits without inspecting them.
4. Add a dated entry below before handing off. Record repository, commit SHA, files changed, tests actually run, known failures, and the next exact action.
5. Use explicit status labels: VERIFIED, CODE-ONLY, DEPLOYED-UNVERIFIED, or BLOCKED.
6. Do not state that a link or button works based only on its existence in source.
7. Do not delete deployment configuration, workflows, or evidence machinery until dependencies and purpose are audited. Remove stale *links and references* separately from runtime infrastructure.
8. For every public-facing HTML experience, provide a human-readable title, a direct playable URL when deployed, a source link for maintainers, and a verification status. Never present a GitHub code/blob URL as if it were the playable experience.

## Link policy
- Canonical live URLs above are protected.
- Other Vercel URLs are untrusted until tested; keep them out of navigation unless verified and explicitly classified.
- A path to an HTML file is not proof that the file is deployed or works.
- Prefer a generated interactive catalog from repository metadata so newly added HTML experiences do not silently remain undiscoverable.
- Preserve GitHub Pages routes only where the current deployment configuration supports them.

## Work log

### 2026-11-02 — Chat A
- Repository: `MirrorCartographer/J`
- Commit: `fd874502c5a6ee619d4396601d321e811fbf7cdb`
- Changes: reframed README as Human Judgment Lab; added laboratory thesis, Consensus Trap experiment, and portfolio walkthrough improvements.
- Verification: experiment JavaScript syntax and presence of five controls/four metrics checked through source inspection. Live deployment not verified.
- Next: continue building independent experiments and verify browser behavior before claiming live status.

### 2026-11-02 — Chat B / next session
- Read the newest commit and inspect this log before editing.
- First task: audit current navigation and HTML routes in `MirrorCartographer` and `mirror-cartographer-ui`; build a verified playable-link catalog; distinguish source-only pages from deployed routes.
- Second task: audit stale Vercel *references* separately from deployment infrastructure; preserve the two canonical URLs above.
