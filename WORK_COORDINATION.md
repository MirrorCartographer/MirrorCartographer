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


### 2026-11-03 — Current construction session
- Repositories: `MirrorCartographer/mirror-cartographer-ui`, `MirrorCartographer/MirrorCartographer`.
- UI commits: `fd0e66adf7261dece91ed4ff6ed4cf407161fee9` (Veteran Hub relative redirect); `07ccdf442c62b0c3414d798ef5b990570686ac78` (ten procedural renderers); `2d872f3e64068d587efe3a899183c6bebe1b27c0` (room art direction); `72a4bc60adcfc6b632ce1f4452b266b4aa08a647` (audio gain restore); `c9909c1fa57887e32744469e2716a51658c80dd8` (34 directory door identities); `58187fbe37e9786955f081167c6ce17246d062a0` (CSS selector correction); `f2be077348e92a978c127a9f6e447291ed6069e6` (room integrity workflow); `cdbfdade43bfd776cc51c2a06422ccbadbc0a987` (34-room identity contracts); `3baa52c8df71a485b8523993afd80693a25d9147` (manifest validation); `a56e37ffda3b07c1501d48aa50753c7f3c9b7a15` and `8dbab338ea1c3b39640bda87f181174d23d3dd8c` (implementation-status truth labels); `507c0b2826c2f9a7fce6bc310c77f08117cb03b6` (room-specific gesture traces).
- Core commits: `5d2cc33cacd8ccecf9626bb9a9079b41d7217531` (complete build map); README link added in a subsequent commit.
- Changes: first ten procedural room renderers; per-room art direction; persistent-within-session gesture traces; 34 individual door identities; 34-room identity/interaction contract; automated checks; Veteran Hub relative redirect. Added `BUILD_UNIVERSE.md` as the cross-repository scope and acceptance map.
- Verification: source inspection confirms the first ten pages declare matching modes and the shared stylesheet contains corresponding room-specific rules. The manifest has 34 distinct destinations and interaction contracts. The workflow is committed but no passing Actions result or browser verification has been observed in this session. GitHub Pages deployment remains previously blocked/unverified.
- Known limits: the first ten rooms still share a common input shell; their new traces are session-only, not persisted across reloads. The other 24 destinations have identity contracts, not completed independent implementations. Current daemons remain scheduled deterministic inspectors, not model-backed autonomous coding agents.
- Next exact actions: run the room-integrity workflow; test the first ten in a browser; implement room-specific controls/state persistence; audit the remaining 24 destinations; resolve Pages activation; then expand research, personal cartography, Veteran Pathways, and creative systems using `BUILD_UNIVERSE.md`.
