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

## 2026-11-03 — attended build continuation
- UI commit `cea0f92ddd2ba018c9e00a6a9e63aac42c7f552d`: Living Atlas room directory now has a browser-local continuity thread. It records room encounters, shows recently visited rooms and return markers, offers explicit JSON export and clear controls, and keeps the record on the user's device.
- UI commit `6ca0f7b65bdcd3f6157396d384319e146651a968`: created `public/atlas/research-atlas/index.html`, a working local-first research instrument titled **The Between**. It supports six distinct record types (observation, claim, hypothesis, experiment, result, decision), source/date metadata, confidence separate from evidence status, links to related record IDs, limitations, falsification prompts, editing, search, conflict counts, JSON import/export, deletion, and explicit local erasure.
- UI commit `ffb080cb1d4d1152f58d53e5f088f155c32ea3e2`: changed the Living Atlas's The Between link to the project-relative `./research-atlas/` route so it resolves under a GitHub Pages project path.
- These are committed source changes. Browser execution, automated tests, and live Pages deployment have not been verified here; do not describe them as passing or live.
- Privacy boundary: these two tools use browser localStorage and explicit file export/import; they do not sync data to a server. Browser-local storage is not an encrypted vault and may be cleared by browser settings.
- Next: syntax-check and browser-test the new research instrument and room continuity thread; verify project Pages deployment; then wire cross-room continuity into room experiences without creating a hidden cross-device profile.


## 2026-11-04 — Living Systems implementation v1
- Repository: `MirrorCartographer/MirrorCartographer`.
- Added `governance/LIVING_SYSTEMS_CONSTITUTION_v1.md`, `governance/MASTER_PROJECT_INVENTORY_v1.md`, `governance/OWNERSHIP_AND_FUNDING_STRATEGY_v1.md`, `architecture/FREE_2_SPEC.md`, `tools/free_engine/free_engine.py`, `tools/free_engine/test_free_engine.py`, `mirror_engine/store.py`, `mirror_engine/test_store.py`, `independent_model/README.md`, `independent_model/model.py`, `independent_model/train.py`, `pilots/KANNAPOLIS_RIDER_TRANSIT_CLARITY_PILOT_v1.md`, `roadmap/NORTH_CAROLINA_AND_GLOBAL_SCALING_GATES_v1.md`, and `.github/workflows/mirror-engine-tests.yml`.
- Commits: `021f33a184feb34b5e183be7aa3d401c22bd0c6d` constitution; `a06adc62f5264ed7505f3f8cfc976d5ae338b254` inventory; `d8718f14fb44b98f37db4a120013740f0a966288` FREE specification; `1150b9e0b51dc97104c33f9342c2bb93c1c51a43` FREE engine; `3c0eca9798cf7fd139587dcf7bddf12838728dbc` FREE tests; `c057b2758dc82b1dfc08af6c2b72210bf7164439` model plan; `2faf272fb46c7b9eaac3678cc9b6f6ea674290ad` provenance store; `3418f9056c902ff3c23d0cc4ace541e70ec2c34d` store tests; `e42ac00fd4959e627a9c32795c9e54c144426779` Transformer implementation; `fd7d38b048a5f7cb3adb9fc2a139f56ca6efb62f` training entry point; `2277370c5fb60785d75439da6c2f3c0ece5d386e` CI workflow; `b3a5f3d826337a77768ca039ac0dee2f37f27340` ownership strategy; `d80534e06248e32f569d3df71f4416cde7ebef5d` Kannapolis pilot; `fa2f15e89c1dc56326199c73d0790c0ccdfca0dc` expansion gates.
- README index updated in this session.
- Verification: GitHub accepted all file writes. CI workflow has been committed but its result has not been observed. No model training, partner approval, participant research, or pilot outcome is claimed.
- Known limits: the initial inventory is not exhaustive for private repositories J and c; Mirror Engine SQLite is not encrypted at rest; the Transformer requires PyTorch and a rights-cleared corpus; the training script has not been executed; no model checkpoint exists.
- Next exact actions: inspect GitHub Actions result; fix any test failures; audit private repositories; complete training data manifest and evaluation suite; contact Rider Transit for discovery permission; gather baseline evidence before implementing the pilot interface.


## 2026-11-04 — Private repository audit and integration seams
- Audited two private companion repositories; detailed file paths, operational notes, and internal architecture are retained in the private continuity workspace.
- Public-facing integration decision: extend existing provider-neutral model and provenance components; do not duplicate canonical memory. The new FREE 2.0 Python engine has a provenance export adapter. SQLite MirrorStore remains experimental.
- Added a local inference CLI, training-data governance, and a corpus manifest template. The from-scratch Transformer has no trained checkpoint yet.
- Commits for public additions are indexed in the master inventory and repository README. The private audit record is stored only in the private continuity workspace.
- Verification: file writes were accepted by GitHub. CI result, local model inference, checkpoint training, and pilot outcomes remain unverified.
- Next: inspect CI results; validate the provenance adapter against the private ledger validator; perform an owner-device inference smoke test; obtain Rider Transit discovery permission before participant research.


## 2026-11-16 — Chemical Orchard: generative chemistry as an actual room
- Repository: `MirrorCartographer/MirrorCartographer`. This is a new artistic instrument, not a replacement for the existing maze or a change to protected Vercel environments.
- Source: `site/chemical-orchard/index.html`, `orchard.css`, `orchard.js`, `reaction-core.mjs`. Connected through `site/maze-engine.js` as the 13th generated reachable portal and through the accessible destination index in `site/index.html`; links return to the labyrinth and Wordless Sky.
- Tests: `tests/chemical-orchard.test.mjs` (6/6 local), numerical boundedness/determinism, user touch impacts field, no API/model calls. Playwright inline-content desktop and 390px phone interaction tests passed, with browser audio context running; navigation-based Chromium tests blocked by administrator. Added public GitHub Pages workflow gate and source-integrity entries, updated both hard-coded workbench indexes from 96 to 97.
- Scientific model: constrained Gray–Scott two-reagent reaction diffusion with three independently parameterized recipes; emergent doorway based on measured pattern complexity. This is an artistic simulation, not a medical or physical experiment.
- Hardware caveat: Android Vibration API best effort and a user-direct native iOS switch; an actual iPhone haptic pulse and sound audibility have **not** been tested on owner hardware.
- Docs: `docs/CHEMICAL_ORCHARD.md`. Actual CI/publisher status must be checked at the final commit; this entry alone does not prove production access.
- Next exact action: verify `gh-pages` branch has the chemical room, independent public HTTP fetch of `/MirrorCartographer/chemical-orchard/`, check iPhone Safari haptic and runtime performance, then expand room-specific consequences without adding generic interface cards.


## 2026-11-16 — Cross-room consequences / The Unlived Branch
- **Design correction:** a JS state change is not a meaningful human reaction. The user's emphasis is a psychological world of math, science, atmosphere and consequence rather than a touch demo. Apply `docs/HUMAN_MACHINE_CONSEQUENCES.md`.
- **Code:** new `site/world-imprint.mjs`, `site/afterimage.js`, `site/afterimage.css`, `site/chemical-orchard/unlived-core.mjs`; updated Orchard markup/styles/runtime, homepage references and `site/maze-engine.js` to provide an explicit `reweaveFromImprint` function that changes the generated corridor graph and checks all portals remain connected.
- **Human-machine distinction:** intervention vs counterfactual (identical initial chemistry and same subsequent recipe/time), split-glass witness, measured field divergence, explicit opt-in bottling, reversible local-only transfer to a changed maze. The object is a material signature; it contains no psychological inference or transcript.
- **Tests:** `node --test tests/unlived-consequence.test.mjs` 6/6 passed locally, including field equality under no interventions, divergence with intervention, deterministic signatures, distinct derived maze seeds, corrupted/improper input rejection, and no external model/telemetry. Inline-source Chromium interaction tests at 1280×820 and 390×844 passed for canvas injection, divergence, reveal slider, bottling and material storage, with no page errors. Direct localhost/browser navigation is blocked by policy; this is not a live iPhone test.
- **Publication:** GitHub Pages workflow and general CI passed at code commit `6ac0360a09e8e70837b315405645f4a86dfb0627`. Published gh-pages artifacts verified: `chemical-orchard/unlived-core.mjs`, `chemical-orchard/orchard.js`, `world-imprint.mjs`, `afterimage.js`, `index.html`. Independent public HTTP/Safari access and physical haptic feel remain unverified.
- **Next exact action:** test on owner iPhone; measure frame time and haptic feel, then conduct a human meaning test: hide nonessential labels and ask what the visitor observed *without* suggesting an interpretation. Improve artistic consequence based on their report. Preserve established accessible controls and intentional consent to landscape rewiring.


## 2026-11-16 — The Crooked Score + Workbench reality check
- Source paths: `site/companion/atlas/rooms/music/ink-score-core.mjs`, `ink-score.js`, `ink-score.css`, and updated `music/index.html`. Preserved the eight-note instrument and the honest unfulfilled recorded-audio section.
- Design: original visitor-drawn lines deterministically map horizontal position to musical time, vertical position to pitch, density/gesture to amplitude. Sound is synthesized only after a user's Play gesture; keyboard alternative, explicit save/export, reduced-motion support, no model API or network collection.
- Evidence: six Node tests passed locally; isolated Chromium desktop 1366×768 and touch-sized 390×844 tests passed for mark creation, audio-context starting and local save, no page exceptions. Local HTTP navigation was administrator-blocked, so this was **not** a full deployed-page or iPhone Safari audio test.
- Integration defect found: parent Music Room CSS sets `canvas{pointer-events:none}`, which could disable the new surface. Explicit `#score-ground{pointer-events:auto}` override added with regression check. Tests and source-integrity guards are part of the publish workflow.
- Public Workbench loader now tries the current published Pages HTML before raw GitHub, shows the real published page link and warns that sandbox previews cannot prove audio/modules/local persistence. The editor is not a commit/deploy backend.
- Three-lane decision ledger: `docs/decision-records/2026-11-16-crooked-score.json` stores a private exact-source digest, disputable interpretation, and actual implementation/test paths; `tools/verify-build-triad.mjs` validates the structural/provenance boundary. It does not independently interpret the full archive.
- Read `docs/WORKSHOP_REALITY_AUDIT_2026-11-16.md` for remaining failure modes; especially recorded audio binaries, original art fidelity, working rooms vs directories, human significance, and live device testing.
- Next: verify latest publisher and CI commit on actual `gh-pages`; test music on the owner's iPhone; validate audio output and CSS pointer input in the complete published page; build deeper inter-room musical consequences only with explicit visitor consent. Do not claim that recorded songs are hosted or the website has trained independent intelligence.
