# Mirror Cartographer — recovered intent and completion matrix

This document is the acceptance contract for restoring the project to its original intent. It distinguishes requirements recovered from prior design discussions from features that have been implemented and verified. A requirement is not complete merely because a document or navigation link exists.

## Product invariant

Mirror Cartographer investigates what can be understood from individual facts, what remains invisible, and how observations become interpretations, hypotheses, evidence, decisions, and measurable outcomes. It must preserve provenance and uncertainty while making cross-domain relationships explorable.

## Acceptance areas

| Area | Required behavior | Completion evidence |
|---|---|---|
| Living Atlas | One navigable graph of artifacts and relationships; search, category filters, deep links, connected paths, and unknown/missing edges | Automated route/link checks plus browser interaction tests |
| Evidence lineage | Sources, observations, interpretations, hypotheses, claims, decisions, and outcomes remain distinct and traceable | Tests for provenance, uncertainty, contradiction, and revision paths |
| Research workspace | Research Autopsy, Evidence Lineage, unresolved-relationship views, hypothesis comparison, experiment design, falsification, and outcome updates | Each workflow completes end-to-end with saved/exportable artifacts |
| Research labs | Reality, Discovery, Healing, Time Machine, and Contradiction Labs; each has an explicit question, method, controls/limits, and result record | Every lab opens, has functioning controls, and persists or exports work as specified |
| Personal cartographer | Self-map domains: experience, conditions, meaning, pattern, values, agency; symbolic exploration; Examine my self-map; observation/hypothesis distinction | Keyboard and screen-reader operation; state and output tests; no diagnostic claims |
| Privacy and consent | One-off/private/saved modes; explicit sharing; export and deletion; consent-aware memory; no sensitive material in public index | Data-flow audit and automated privacy tests |
| Accessibility and adaptation | Responsive layouts, keyboard navigation, visible focus, reduced motion, screen-reader labels, adaptive/neutral/scientific presentation modes | Automated accessibility checks plus manual keyboard/screen-reader review |
| Creative worlds | Every catalogued art, animation, interactive world, game, and experiment has a usable entry point or an explicit source-only status | Launch each artifact; test controls, assets, audio, completion, reset, and return navigation |
| Sound and music | Listening/composition spaces, public-domain/original assets where appropriate, accessible controls and graceful no-audio fallback | Audio playback and keyboard-control tests |
| Veterans hub | Practical pathways and clear source attribution, without representing the hub as a government service | Link validation and task-based usability review |
| Continuity and history | Navigable concept/decision/evidence/hypothesis/project timeline and graph; clear provenance and deletion boundaries | Persistence, export, restore, and deletion tests |
| Deployment | Public, free-to-host static entry point; reproducible build; deploy on commit; clear distinction between static and server-dependent features | Green CI run, deployed smoke tests, direct-link refresh tests |
| Project archive | Exhaustive searchable index across both repositories, with sensitive/private paths excluded and source repository/path preserved | Catalog generated from tracked files; duplicate, schema, and privacy checks |
| Future concepts | Geographic/cultural/timeline map, creator worlds/exhibitions, personal cartographer, symbolic pattern engine, API, marketplace, multilingual knowledge network | Treat as planned until an implemented, tested, deployable feature exists |

## Current known implementation facts

- The core repository contains a GitHub Pages workflow at `.github/workflows/publish-mc-atlas.yml`.
- That workflow runs `site/validate-site.mjs`, clones the companion UI repository, runs `site/generate-catalog.mjs`, and deploys the `site/` directory.
- The companion UI repository contains its own GitHub Pages workflow at `.github/workflows/publish-github-pages.yml`, with build-time checks for the application, atlas, and research-atlas routes.
- The Living Atlas source includes an interactive concept map, research pathways, a searchable repository library, and links to the companion application.
- These workflow/source facts do not establish that the latest deployment is green, every route works in a real browser, every creative artifact is playable, or every historical requirement is implemented.

## Completion protocol

1. Inventory tracked files, assets, entry points, scripts, workflows, and historical plans in both repositories.
2. Build a route/artifact registry that marks each item as playable, informational, source-only, broken, inaccessible, or not yet implemented.
3. Run static checks, build checks, link checks, privacy checks, and browser interaction tests.
4. Fix blockers at their source; do not replace an intended experience with a link list or decorative mock-up.
5. Deploy through the repository's free GitHub Pages workflow and verify the resulting live URL and deep links.
6. Repeat until all existing artifacts are tested. For historical concepts not present in code, implement them in dependency order or mark them explicitly as outstanding; never label an unbuilt concept complete.

## Status vocabulary

- **Verified** — tested against an explicit acceptance criterion.
- **Implemented, unverified** — code exists but runtime behavior has not been tested.
- **Partial** — some of the required behavior exists.
- **Planned / missing** — requirements recovered, no implementation verified.
- **Blocked** — cannot be completed without a missing credential, service, asset, decision, or external permission.

The matrix itself is a requirements record, not a claim that the product is complete.
