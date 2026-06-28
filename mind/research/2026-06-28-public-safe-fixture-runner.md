# Public-Safe Fixture Runner Protocol

## Summary
Mirror Cartographer now has a Public-Safe Fixture Library. The next public-safe evolution is a repeatable fixture runner: a protocol that takes each synthetic fixture through the same gates, records the expected route, records the actual route, and flags divergence.

## Strongest Attractor
Continuity.

The current architecture has become a chain of gates, routers, scorecards, ledgers, and release cards. Continuity now requires regression behavior: the same kind of source packet should not be routed differently just because the language is prettier, newer, or more emotionally compelling.

## Core Finding
MC needs a Public-Safe Fixture Runner.

A fixture runner is not a diagnosis engine, content generator, or private-memory extractor. It is a public-safe evaluation protocol for synthetic cases. It asks whether the visible labels produce the correct action: publish, revise, narrow, abstract, review, hold private, or discard.

## Existing Repo Fit
The previous fixture-library artifact says the router has not yet been tested against fixtures and lists fixture categories that should exercise source, claim, privacy, audience, evidence, transformation, review, release, and revision gates.

The existing fixture-record schema already defines the expected fields: fixture type, source status, claim status, privacy status, evidence lane, audience contract, missingness, transformation required, expected ViewDiff, expected router state, blocking gate, revision reason, release decision, reviewer requirement, and expected public output.

This pass turns that schema into a run protocol.

## Runner Stages
1. Load synthetic fixture record.
2. Confirm no real private source material is present.
3. Normalize labels without changing meaning.
4. Apply gate checks in fixed order: source, claim, privacy, audience, evidence, transformation, review, release, revision.
5. Generate actual router state.
6. Compare actual router state with expected router state.
7. Compare actual blocking gate with expected blocking gate.
8. Compare actual public output with expected ViewDiff requirements.
9. Record pass, partial pass, fail, or blocked.
10. Record revision reason if the fixture, schema, or router should change.

## Run States
- `pass`: expected and actual route match, and public output preserves missingness.
- `partial_pass`: route matches, but explanation or ViewDiff is incomplete.
- `fail`: route, gate, privacy state, or claim state diverges from expected behavior.
- `blocked`: fixture cannot be safely run because it contains private material, lacks required fields, or requires unavailable reviewer authority.

## Regression Rule
A new gate, schema, compiler, or router change should not be trusted until it is tested against at least one fixture for each route state.

## Practical Income Lane
The public-safe commercial wedge is a documentation-readiness regression service:

> Convert sensitive or internal draft material into synthetic fixtures, define expected release behavior, and test whether a publication workflow preserves source, claim, privacy, missingness, and revision boundaries.

This is realistic because it frames MC as documentation governance and artifact review rather than as a therapeutic or diagnostic system.

## Care / Social-Support Lane
The support-safe application is synthetic training for observation summaries. The runner can test whether a care-support packet preserves non-diagnostic language, reviewer requirements, uncertainty, and escalation boundaries.

It should not claim to diagnose, treat, triage, or replace qualified professional review.

## Fresh Research Fit
2026 work on AI as an inspectable research object supports structured provenance records rather than simple AI-use labels. Governance-aware autonomous testing work supports using validation and audit controls for AI-generated test artifacts. Transparency-as-architecture work argues that compliance cannot be reduced to post-hoc labeling. Reporting on AI in social-work records and ambient clinical scribes reinforces the need for review, consent, privacy boundaries, and error checks.

## Source Status
- GitHub-derived: builds directly on `public-safe-fixture-library` and `public-safe-fixture-record-v0`.
- File-library derived: public-safe abstraction from MC architecture, proof lanes, evidence boundaries, accessibility constraints, and source/claim separation.
- Web-derived: 2026 provenance, governance-aware testing, transparency architecture, ambient clinical documentation, and social-care AI reporting.

## Claim Status
Architectural proposal and implementation plan. Not empirical validation.

## Privacy Status
Public-safe. Uses only synthetic fixture behavior and abstract workflow descriptions. Contains no personal, household, health, animal-care, financial, location, relationship, credential, or raw transcript details.

## Missingness
No executable test harness is implemented yet. No fixture corpus has been populated with concrete synthetic examples. No reviewer-agreement measurement has been performed.

## Revision Reason
The fixture library established synthetic cases. This revision adds a repeatable runner so those cases become regression checks rather than static documentation.

## Key Phrase
A fixture becomes useful when it can fail the system safely.
