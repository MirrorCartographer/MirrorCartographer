# Public-Safe Fixture Boundary Protocol

**Date:** 2026-07-04

## Core finding

Mirror Cartographer needs a **Public-Safe Fixture Boundary Protocol**.

A public demo, test harness, seed dataset, screenshot, prompt example, or mock interaction can leak private architecture even when all obvious personal details have been removed. The risk is not only direct disclosure. It is also **shape disclosure**: examples may preserve the topology of a private life, health pattern, household structure, relationship pattern, financial pressure, location trace, credential path, or raw transcript fragment while changing the names.

## Operating line

**A fixture is not public-safe because its labels are fake; it is public-safe when its scenario, topology, variables, claims, and evaluation purpose cannot be traced back to private-context shape.**

## Source status

- **Available file-library material:** Mirror Cartographer has existing public-facing and internal-facing artifacts describing symbolic cognition, emotional mapping, reflective AI interaction, mode design, provenance-aware memory, contradiction persistence, and privacy architecture.
- **Available saved-context material:** Used only to understand recurring architecture themes and prior public-safe research direction.
- **Available GitHub material:** Repository access exists, but this pass did not depend on raw private repository content beyond the safe write target and the observed need for a new research artifact.
- **Excluded source classes:** Raw transcripts, personal/household/health/animal-care/financial/location/relationship/credential details, private examples, named lived scenarios, and identifiable continuity packets.

## Claim status

- **Strong architectural claim:** Public fixtures require their own boundary protocol, not only prose redaction.
- **Moderate implementation claim:** MC should treat fixture approval as a separate gate before examples enter demos, tests, docs, seed data, onboarding flows, screenshots, videos, or evaluation harnesses.
- **Weak/untested empirical claim:** Users or reviewers may infer private source shape from sanitized fixtures. This is plausible and privacy-relevant, but should be tested through adversarial review rather than asserted as measured fact.

## Privacy status

- **Public-safe:** This document contains only abstract method language, boundary notes, product requirements, research questions, and evaluation criteria.
- **Private-context-derived but not disclosed:** The protocol is motivated by the existence of MC materials that mix symbolic, embodied, reflective, technical, and governance layers.
- **Not public-safe:** Any fixture copied from a real session, real symptom map, real household configuration, real animal-care scenario, real financial pressure, real relationship dynamic, real location path, real credential/work history, or raw transcript structure.

## Missingness

- No complete fixture inventory was available in this pass.
- No automated fixture scanner exists yet.
- No adversarial reconstruction test has been run.
- No approved synthetic fixture library exists.
- No public/private fixture taxonomy has been enforced in CI.

## Revision reason

Prior public-safe research artifacts focused on claims, traceability, redaction, source rehydration, contradiction handling, maturity levels, and interface contracts. This pass adds a distinct missing boundary: **fixtures and mock examples can leak source shape even when claims and prose are already controlled.**

## Product requirement

Every public-facing or test-facing fixture must carry a fixture boundary record:

1. **Fixture ID** — stable identifier.
2. **Fixture purpose** — demo, unit test, integration test, screenshot, onboarding example, research eval, documentation, video, synthetic seed data, or model prompt.
3. **Source class** — synthetic, composite, transformed, public-source-derived, private-context-inspired, or unknown.
4. **Privacy class** — public-safe, internal-only, private-derived abstraction, blocked, or needs review.
5. **Topology risk** — whether the scenario preserves private structure even if labels are changed.
6. **Claim role** — whether the fixture supports a product claim, UI behavior claim, research claim, safety claim, or only illustrates a possible interaction.
7. **Missingness note** — what the fixture cannot prove.
8. **Expiry condition** — when the fixture must be reviewed again.
9. **Revision reason** — why it was added or changed.
10. **Approved substitute** — safer synthetic alternative if blocked.

## Fixture boundary taxonomy

### F0 — Pure synthetic fixture
A deliberately invented scenario with no dependency on private source shape. Preferred for public demos.

### F1 — Composite abstraction
Built from multiple generalized patterns, with no recoverable single-source topology. Acceptable with review.

### F2 — Private-context-inspired abstraction
Derived from private architecture insight but not from private details. Internal review required before publication.

### F3 — Redacted private fixture
A real scenario with names/details removed. Blocked from public use by default because topology may remain.

### F4 — Raw or near-raw private fixture
Contains direct or reconstructable private material. Blocked.

### F5 — Unknown-origin fixture
Source cannot be determined. Blocked until classified.

## Evaluation criteria

A fixture passes only if reviewers can answer yes to all of the following:

- Could this example exist without knowing the private source material?
- Are the variables generic enough to avoid source-shape reconstruction?
- Does the fixture avoid personal, household, health, animal-care, financial, location, relationship, credential, and raw transcript traces?
- Is the claim supported by the fixture limited to what the fixture actually demonstrates?
- Is missingness visible to a future maintainer?
- Is there a safer synthetic replacement available if the fixture becomes questionable?

## Research questions

1. What features make a sanitized fixture reconstructable?
2. Can MC define a measurable topology-risk score for examples, prompts, screenshots, and demos?
3. How much synthetic distance is required before a fixture stops carrying private source shape?
4. Should public demos use only domain-neutral scenarios, or should they use richly symbolic but fully invented scenarios?
5. Can CI block fixtures that contain forbidden source classes or missing boundary records?

## Implementation plan

### Phase 1 — Manifest
Create `fixtures/fixture-boundary-manifest.json` with fixture IDs, source class, privacy class, topology risk, claim role, missingness, expiry, and revision reason.

### Phase 2 — Synthetic library
Create a small set of approved synthetic fixtures for:

- symbolic input
- contradiction persistence
- mode switching
- provenance-aware memory
- public claim display
- privacy boundary preview
- consent/no-save behavior

### Phase 3 — Review gate
Add a fixture approval checklist to PR review and documentation publication.

### Phase 4 — Regression scanner
Add a scanner that flags fixtures containing prohibited categories, named entities, realistic private topology, raw transcript markers, or unknown source status.

### Phase 5 — Demo disclosure
Require public demos to show whether each example is synthetic, composite, or private-derived abstraction.

## Public-safe index entry

- **Index label:** Fixture Boundary Protocol
- **Source boundary:** File-library + saved-context architecture only; no raw private details used as evidence.
- **Claim boundary:** Product requirement and safety method, not measured user outcome.
- **Privacy boundary:** Public-safe abstraction.
- **Maturity:** Method proposal ready for implementation planning; not yet validated by automated tests.
- **Next action:** Build fixture manifest schema and synthetic fixture library.
