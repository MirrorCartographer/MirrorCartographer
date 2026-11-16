# Mirror Cartographer — Living Labyrinth / Proof and Recovery Register

Date: 2026-11-16. This file distinguishes implementation from verification and aspiration.

## Design origin and interpretive limits

**Exact user requests in this session**: nonverbal and verbal sensory stimulation; a *walkable* labyrinth; distinctive visual voice; no generic AI museum; autonomous research of old failures; phone audio; a website worthy of artists. Historic 2025 archive and older work informed design, but private transcripts are not embedded in or transmitted by the public site.

**Interpretation**: Nonverbal exploration needs primary causality (touch → movement → discovery), not an instruction card. Surprise is useful if navigation and consent remain predictable. Symbolic language can be co-created; attribution to a person requires an exact source.

**Ideas implemented**: connected seeded maze; camera and tap/arrow movement; twelve distinct portal species; reactive weather and procedural ambience; opt-in original Web Audio, opt-in browser speech, reduced-motion fallback; local explored map; local Exact Copy → Interpret → Idea records and export; runtime self-audit; accessible room index; return-to-maze bridges in published rooms.

## Recurring historic failure patterns and corresponding controls

| Observed / reported failure | Build control |
|---|---|
| Static navigation presented as interactive worlds | Programmatically generated graph with actual walkable paths; click/touch/keyboard support |
| Pretty pages with dead buttons | Playwright button, portal, map and trace tests; no placeholder actions |
| Different host relative links produced 404 and stopped publication | Relative URLs and a site-wide local reference validator already in the canonical workflow |
| iPhone radio appeared enabled but remained silent | AudioContext only created/resumed on explicit click, audio state diagnosable; device audibility still requires physical iPhone verification |
| Repetitive description and generic museum-like layout | Procedural asymmetric topographical visual renderer; no hero feature cards |
| Unintended forced motion or overstimulation | Opt-in sound and voice; no autoplay; `prefers-reduced-motion`; accessible index |
| Secret or private transcript accidentally published | Public engine contains no keys and no private messages; notebook uses browser localStorage/export; privacy policy remains enforced |
| AI-attributed meanings were silently described as user-authored | Interpretation requires a linked Exact Copy statement; stored entries tagged by origin; the software does NOT infer user semantics autonomously |
| CI build failure caused a committed file to be mistaken for a deployed page | Separate local tests, CI validation, published-branch readback, and public page verification |

## Results so far — local proof

- `node --test site/maze-contract.test.mjs` → 5 / 5 passing.
- Browser (headless Chromium) uses `set_content` with locally bundled HTML/CSS/JS because this environment blocks navigation by administrator policy; not the same as a hosted browser or a real iPhone.
- Runtime selfTest for generated mazes: 12 unique portal cells reachable, no isolated walkable cells in the generated sample.
- Desktop 1440×900 and mobile 390×844: weather, map, close, source-linked interpretation, notebook, encounter, tap tests passed without page exceptions after the blocking close-button issue was fixed.

## Not yet proved

- Production-host deployment (requires separate CI confirmation and published branch readback).
- Real iPhone speaker audibility and mobile Safari speech interruptions.
- Cross-device synchronization, multi-user lanterns, an independent model, medical integrations, real-time shared backend.
- Algorithmic novelty or art-world reception.

## Next proof gate

1. CI build + existing privacy, public route and site validation tests.
2. GitHub Pages successful publication and `gh-pages` source readback.
3. Optional real-browser iPhone/manual touch and audio confirmation. No success claim until measured.

## Key paths

- Site: `site/index.html`
- Engine: `site/maze-engine.js`
- Design: `site/maze.css`
- Build gate: `site/maze-contract.test.mjs`
- Room return bridge: `site/bridge-rooms.mjs`
- Original illustrated entrance preserved at `site/legacy-entrance/index.html`
- Existing atlas and all other creative worlds remain at their original paths.