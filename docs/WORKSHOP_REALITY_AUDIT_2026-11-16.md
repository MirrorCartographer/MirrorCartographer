# Workbench and Living Country: reality audit — 2026-11-16

This is a source-backed engineering assessment, not a claim that every page has been visited on an iPhone. Do not confuse a committed artifact, a successful build, a published Pages file, a working device experience, and a compelling human experience.

## The source of truth
- Public repository: `MirrorCartographer/MirrorCartographer`, built from `site/` via `.github/workflows/publish-mc-atlas.yml` and published to GitHub Pages.
- The workbench is `site/workbench.html`; it indexes HTML files and runs editable HTML in a sandbox. Editing a source preview **does not** save a GitHub commit or update the deployed site.
- `site/companion/atlas/rooms/room-identities.json` is an inventory of 40 named rooms with explicit implementation/interaction/memory statuses, not proof that 40 rooms are fully developed.

## Tested versus incomplete
| Surface | Inspected capability | Verified gap |
|---|---|---|
| Living labyrinth | Procedural walkable paths, reachable doors, atmosphere, discovered map, local thread | Human response, whole-world progression, shared presence and real-device haptics not established |
| Chemical Orchard | Numerical reaction-diffusion, twin counterfactual fields, carryable local-only signature | Psychological interpretation is speculative; real-device performance pending |
| Wordless Sky | Weather visuals and opt-in synthesized audio | No verified shared world memory or professional-grade soundscape |
| Existing Music Room | Eight-note Web Audio keyboard/pattern loop, controls for tempo, voice, delay/space, volume | 579 assets were *inventoried* in source, but the room itself states original audio binaries are not attached to the public site |
| Crooked Score (new) | Visitor-drawn strokes become pitch/rhythm/dynamics and opt-in original Web Audio; local save and JSON export | Actual iPhone audio and owner reception not verified; not a replacement for recording publication |
| Public Workbench | HTML selection, editable source, preview, download; newly tries published Pages source before raw GitHub and exposes a real-page link | Source `srcdoc` sandbox cannot prove external modules, real audio, same-origin storage or whole-site interaction |
| Room catalog | 40 named rooms; 10 procedural-renderer prototypes; 20 destinations explicitly marked needs-audit; others partially implemented | A room link alone is not an implemented creative experience; status metadata requires continuous reconciliation |
| User evidence | Origin Lab artifact exists separately, and a source-linked local day thread exists in the maze | No complete automatic semantic provenance pipeline or independently trained model |
| Medical communication | Specifications and research designs | No verified production clinical EHR/FHIR integration or validated professional workflow |

## Newly introduced engineering decision contract
- `docs/decision-records/2026-11-16-crooked-score.json` holds three **separate** lanes: a fingerprint of a private exact quotation (never the public text), a *disputable interpretation* with an alternative, and a proposed implementation with actual paths and verification status.
- `tools/verify-build-triad.mjs` validates structure, privacy and file existence; `tests/build-triad.test.mjs` tests rejection cases. This is not automated human-understanding evaluation.
- `tests/ink-score.test.mjs` checks normalization, pitch/time mapping, deterministic event construction, invalid record rejection, no remote model/audio dependencies, syntax and the legacy Music Room CSS pointer-input regression.
- `tests/workbench-source.test.mjs` tests public-source fallback and the distinction between sandbox preview and published experience.

## Known root causes of repeated failure
1. Cross-host absolute links can be valid in one deployment and broken in another.
2. A component can pass isolated browser tests while a parent stylesheet disables its interaction (the music canvas inherited `pointer-events:none`; explicitly overridden).
3. A generated file-tool error response can accidentally be committed as source; `site/source-integrity.test.mjs` is the guard.
4. Workbench inventory is hard-coded; new HTML routes must appear in both indexes or CI fails.
5. Source or deployment success is not actual human sensory success. iPhone sound and vibration require real hardware checks.

## Product teaching: the stack
HTML = structure/semantic objects. CSS = physical-looking treatment and layout. JavaScript = interaction and rules. Canvas = drawings and simulations. Web Audio = opt-in synthesized sound. Browser local storage = data on this device, not cross-device memory. Git = dated source history. GitHub = source collaboration and CI. GitHub Pages = published static front end, not a private medical backend or trained independent AI. Automated tests can catch predictable regressions but cannot certify beauty or psychological significance.

## Prioritized next work
1. Verify the owner-device experience: mobile touch, audio, layout, haptic system behavior and the return route; distinguish physical results from simulated tests.
2. Replace more CSS-only decoration with original authored drawing layers, animated marks and room-specific visual grammar; preserve accessibility.
3. Add explicit consented shared-world events with clear privacy limits, then cross-device sync where security infrastructure exists.
4. Integrate a private provenance and historical-decision graph into build reviews instead of claiming the website has independently learned the person.
5. Develop medical/veterinary communication workflows only after privacy, standards and professional validation gates.

This audit is deliberately incomplete relative to *every historical conversation*. It reconciles inspected current source and recoverable prior project requirements; it is not a complete transcription or automatic comprehension of the archive.
