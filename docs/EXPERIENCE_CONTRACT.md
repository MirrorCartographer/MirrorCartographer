# Mirror Cartographer — Experience Contract (2026-11-16)

**Scope:** An experiential country, not an explanatory portal. This contract is for contributors, coding assistants, and maintainers, not visitor-facing instructions. The person who built the project retains final control over published content, clinical use, public/private boundaries, and access.

## Actual design provenance

The surviving conversation record predates the website design and includes distinct later iterations. Do not rewrite that history to imply that a later feature was present from the beginning. The project requires explicit source separation: user statements, AI-proposed interpretations, and validated implementation artifacts. Later iterations developed Wordless Sky, the Living Atlas, local autonomy, audio, interactive rooms, and cross-device plans. Do not invent dates, deployments, or implementation status from an incomplete archive.

## Interaction rules

1. **Environment before explanation.** A visitor should first be able to touch, move, hear, discover, or alter something. Copy is earned or discoverable, not a wall of instructions.
2. **Real consequences.** Every room must have a distinct visual grammar, a room-specific interaction rule, and a meaningful change. Palette changes alone do not count. Preserve `site/companion/atlas/rooms/room-identities.json` as the fuller design contract.
3. **Science is machinery, not decoration.** If a room claims geometry, waves, evolution, probability, or recursion, implement the actual mathematical relationship in executable code and test invariants. Keep speculative symbolic hypotheses separate from scientific facts.
4. **Psychological without coercion.** Atmosphere and uncertainty may be intense; no hidden persuasion, involuntary flashing, forced audio, false diagnoses, or claims that the website can read a visitor's mind. Sound is opt-in; respect reduced motion and sensory exits.
5. **Provenance always.** Exact quotes stay unchanged; interpretations require attributable sources; new ideas remain ideas until tested. AI-originated symbols can be used without falsely attributing their creation to the visitor.
6. **Nonverbal but accessible.** Primary flow may use movement, icons, gestures and discovered clues. Keyboard alternatives, real semantic labels, safe hit targets, and a door index must remain available. Do not make accessibility depend on solving a riddle.
7. **Haptic truth.** Android Chromium may support `navigator.vibrate`. On iOS 26.5+, Safari does not expose programmable vibration; a directly finger-tapped native `input type=checkbox switch` can elicit a system haptic tick on supported hardware. Never claim rich continuous iPhone haptic waveforms from browser JavaScript; that would require native capabilities. Audio/visual cues can complement, not replace, real vibration.
8. **No private conversation archive in public site.** Training/review records belong in private user-controlled storage. Public artifacts may preserve only the design rules and non-sensitive works intentionally published.

## Build proof requirements

- Read `WORK_COORDINATION.md` and inspect current GitHub commit before editing.
- Avoid multiple commits touching the same file without refetching its new SHA.
- Source-integrity check must reject accidental replacement by file-tool error strings; `site/source-integrity.test.mjs` guards this failure.
- Run `site/maze-contract.test.mjs`, `site/tactile-dimensions.test.mjs`, and the publisher's route/privacy validators before claiming success. The preserved legacy entrance stays reachable.
- GitHub commits, successful CI, GitHub Pages publishing, public HTTP reachability, actual iPhone output, and independent clinician/user validation are **different proof levels**.
- Preserve working rooms and the existing cross-site paths; investigate broken host-relative links rather than suppressing the link test.
- Don't call the whole site finished if only the front door was redesigned.

## Interactive layers implemented as of this document

- Walkable generated maze with reachable portals, explorative memory, tap movement and gesture grammars.
- Optional synthesized sound and optional speech on the existing maze engine.
- Direct native iOS switch target + Android vibration request on the dimensional stone (browser-side hardware output must be tested on device).
- Four-dimensional hypercube projection (16 vertices, 32 edges), two-source wave interference, phase changes coupled to world weather, and reduced-motion support.
- Private local source-linked thread (Exact Copy → Interpret → Idea), not cross-device sync and not a live independent AI reasoning engine.

## Remaining unproved work

Real iPhone haptic reliability, audio audibility on individual devices, native multi-pattern Core Haptics, shared presence/lantern backend, privacy-preserving cross-device sync, adaptive original art assets, full-site visual differentiation, mental-health/medical validation, and unifying all historical engines. Each requires its own evidence and test gate.