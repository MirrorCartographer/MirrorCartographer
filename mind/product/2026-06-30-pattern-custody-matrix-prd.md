# Pattern Custody Matrix PRD

Date: 2026-06-30
Status: public-safe product requirement

## Problem

Mirror Cartographer can notice repeated symbols, phrases, body-sensation language, contradictions, and goals across time. Repetition is useful for reflection, but unsafe as a public or factual claim unless the system records custody.

Without custody, three failures occur:

- private material leaks into public artifacts by abstraction drift;
- symbolic recurrence is mistaken for evidence;
- old or context-specific memory influences future interpretation without a visible admission rule.

## Product goal

Add a Pattern Custody Matrix that travels with echo tracking, symbolic memory, public proof packets, and evaluation artifacts.

## Users

- Reflective user who wants continuity without silent capture.
- Reviewer who needs to understand what MC is claiming.
- Builder who needs safe product requirements.
- Evaluator who needs to test overreach, coercion, and memory misuse.

## Functional requirements

1. Every recurring pattern must receive source_status, claim_status, privacy_status, and missingness labels.
2. Every pattern must show whether it came from public repo material, private-derived abstraction, file-library artifact, external research, generated synthesis, or mixed sources.
3. Every pattern must define allowed use: reflection only, evaluation fixture, PRD, schema, README language, roadmap, or no public use.
4. Every pattern must include a downgrade rule.
5. Every pattern must include a user correction hook.
6. Public export must omit raw private examples by default.
7. Public export must include what kind of material was withheld, not the material itself.
8. The system must reject automatic claim upgrades based on repetition alone.

## Non-functional requirements

- Read-aloud friendly formatting.
- No essential information trapped in code-only presentation.
- Human-readable labels before machine schema.
- Conservative default for mixed-source patterns.
- Clear separation between symbolic usefulness and evidentiary proof.

## Safety requirements

- Do not expose private transcripts.
- Do not expose household, health, animal-care, financial, private location, relationship, or restricted credential details.
- Do not let a private-derived pattern become a public claim unless it is abstracted into method, requirement, research question, evaluation criterion, or implementation plan.
- Do not claim diagnostic, therapeutic, legal, medical, veterinary, or emergency authority.

## Release criteria

The feature is release-ready only if a reviewer can inspect a pattern and answer:

- what source class produced it;
- what claim class it belongs to;
- what was withheld;
- what evidence is missing;
- how a user can correct or revoke it;
- what artifact type it may enter.

## First implementation slice

Start with a static matrix inside the demo output panel:

- Pattern
- Source status
- Claim status
- Privacy status
- Missingness
- Allowed use
- Downgrade rule
- User correction

Then add export support for public-safe pattern summaries.
