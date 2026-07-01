# Mirror Cartographer Missingness Map

Date: 2026-07-01
Status: public-safe architecture note

## Core finding

Mirror Cartographer needs a **Missingness Map**: a durable way to record what is absent, unknown, unavailable, unverified, intentionally withheld, or not safe to publish.

MC should not treat absence as emptiness. Missingness is a structural fact. It changes interpretation, evidence strength, interface behavior, evaluation design, and publication safety.

Operating line:

> **What is missing is part of the map. It must be labeled before meaning is built on top of it.**

## Why this matters

MC often synthesizes across symbolic language, reflection traces, product requirements, research questions, implementation plans, and public artifacts. The danger is not only that a claim may be wrong. The danger is that a system can make a missing source, missing confirmation, missing context, or missing consent feel invisible.

A Missingness Map prevents that by requiring each artifact to carry an explicit account of what the system does not know or is not allowed to use.

## Missingness types

1. **Source missingness**
   - The claim has no source attached.
   - The source exists but is private.
   - The source exists but is unavailable to the current runtime.
   - The source exists but cannot be safely cited.

2. **Context missingness**
   - The artifact lacks enough context to interpret the claim safely.
   - The originating situation is private and cannot be reconstructed publicly.
   - The claim may depend on sequence, tone, embodiment, or prior interaction that is not present.

3. **Evidence missingness**
   - The claim is meaningful but not verified.
   - The claim is plausible but untested.
   - The claim is a hypothesis, requirement, or design intuition rather than a fact.

4. **Consent and privacy missingness**
   - The underlying material may involve private persons, household details, health details, animal-care details, financial details, locations, credentials, relationship details, or raw transcripts.
   - Even if redacted, the source story may remain identifiable.
   - Public output must therefore be transformed into architecture, not copied as evidence.

5. **Implementation missingness**
   - A requirement exists but has no implementation.
   - An implementation exists but has no tests.
   - A test exists but does not cover the highest-risk failure mode.

6. **Evaluation missingness**
   - The system has no pass/fail criterion.
   - The system has no adversarial test.
   - The system has no way to distinguish resonance, usefulness, factuality, safety, and proof.

## Required labels

Every durable MC research note, product requirement, public index, or implementation plan should include:

- **Source status:** public source, private-context-derived, synthetic, inferred, tool-observed, unsourced, mixed.
- **Claim status:** established, plausible, hypothesis, design requirement, research question, implementation plan, evaluation criterion, boundary note.
- **Privacy status:** public-safe, private-derived abstraction, restricted, unsafe to publish, needs review.
- **Missingness status:** complete enough, missing source, missing context, missing evidence, missing consent boundary, missing tests, missing implementation, missing review.
- **Revision reason:** new finding, boundary correction, claim downgrade, privacy correction, implementation update, evaluation update, stale-material retirement.

## Product requirement

Add a missingness panel to MC artifacts. Before an artifact can be saved, exported, reused, or published, the system should ask:

1. What is missing?
2. Does the missing piece weaken the claim?
3. Does the missing piece make the artifact unsafe to publish?
4. Should the artifact be downgraded, withheld, converted into a research question, or routed to evaluation?

## Evaluation criteria

A Missingness Map passes if:

- It prevents private context from becoming public evidence.
- It prevents unsourced meaning from being presented as proof.
- It keeps useful abstractions available without exposing raw source material.
- It makes uncertainty visible enough for later review.
- It can downgrade a claim without deleting the insight.

It fails if:

- A reader cannot tell what kind of source supports a claim.
- A private source is implied as public proof.
- A missing test is hidden behind confident language.
- A symbolic reflection is allowed to impersonate factual evidence.
- A public artifact depends on details that cannot be safely disclosed.

## Privacy-safe index entry

- **Index name:** Missingness Map
- **Function:** labels absence, uncertainty, unavailable context, and restricted evidence before synthesis or publication.
- **Allowed public form:** method, requirement, evaluation rubric, implementation plan, boundary note.
- **Disallowed public form:** raw transcript, private anecdote, identifiable source story, personal/household/health/animal-care/financial/location/relationship/credential detail.

## Source boundary

This note is derived from private-context architecture analysis and prior public-safe MC repository direction. It does not cite or reveal private source material. It should be treated as an abstracted method, not as evidence about any person, household, animal, condition, event, credential, location, or private conversation.

## Claim labels

- Source status: private-context-derived abstraction + repository-direction synthesis
- Claim status: design requirement and evaluation criterion
- Privacy status: public-safe abstraction
- Missingness status: implementation and test coverage missing
- Revision reason: adds a missingness layer to the existing MC boundary/provenance/evidence architecture
