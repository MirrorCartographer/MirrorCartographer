# Role-Separated Reflection Contract

## Core finding

Mirror Cartographer needs a **Role-Separated Reflection Contract**.

Operating line:

> A reflection engine must separate the roles of witness, interpreter, builder, evaluator, and publisher before any output is allowed to become public knowledge.

## Why this matters

Mirror Cartographer works across symbolic language, memory, user-facing reflection, product design, and public demonstration. Those functions can overlap in conversation, but they should not collapse into one authority state.

A system can safely use private or mixed-source context to understand architecture only when it can keep distinct which role it is performing:

- **Witness:** records or receives a signal without interpretation.
- **Interpreter:** proposes meaning while labeling uncertainty.
- **Builder:** converts patterns into requirements, interfaces, tests, or implementation plans.
- **Evaluator:** checks claims, safety, evidence status, accessibility, and missingness.
- **Publisher:** exports only material that has passed privacy and source-boundary checks.

The same observation may be valid in one role and invalid in another. For example, a private-context pattern may help the builder identify a product requirement, but it may not be publishable as evidence, biography, diagnosis, proof, or user story.

## Public-safe requirement

Every MC artifact should carry a role label before being stored, evaluated, demoed, or published.

Minimum role labels:

1. `role:witness`
2. `role:interpreter`
3. `role:builder`
4. `role:evaluator`
5. `role:publisher`
6. `role:withheld`
7. `role:unknown`

## Source status

- **Source status:** Derived from available project continuity, prior MC architecture notes, and the recurring need to transform private/mixed-source material into public-safe abstractions.
- **Private-context use:** Private context was used only to understand architectural pressure and recurring system requirements.
- **Public-source status:** This note does not quote or expose raw transcripts, private files, household details, health information, animal-care facts, financial details, location data, relationship details, credentials, or personal identifiers.

## Claim status

- **Claim type:** Product architecture requirement.
- **Claim strength:** Design hypothesis, not empirical proof.
- **Evidence level:** Internal architecture synthesis.
- **Not claimed:** This does not claim clinical validity, therapeutic effect, objective personality inference, or external validation of MC.

## Privacy status

- **Privacy rating:** Public-safe abstraction.
- **Payload exposure:** None.
- **Allowed public use:** Requirements documentation, system design, safety review, evaluation rubric, implementation planning.
- **Disallowed public use:** Raw transcript reconstruction, personal narrative extraction, biographical inference, private evidence laundering.

## Missingness

The current architecture still needs:

- A machine-readable schema for role labels.
- A transition table defining when a reflection can move from one role to another.
- Tests for preventing interpreter output from being published as evidence.
- UI copy that makes role boundaries understandable without jargon.
- A storage policy for `role:withheld` material.

## Evaluation criteria

A future MC implementation should pass these checks:

1. Can the system show whether a statement is witnessing, interpreting, building, evaluating, or publishing?
2. Can a private-context insight become a requirement without exposing the private payload?
3. Can the UI prevent symbolic interpretation from being mislabeled as verified evidence?
4. Can users inspect why a reflection changed roles?
5. Can public exports prove their boundary without revealing their origin payload?

## Implementation plan

1. Add a `reflection_role` field to every reflection object.
2. Require `source_status`, `claim_status`, `privacy_status`, and `missingness_status` fields before export.
3. Add a role-transition validator to block unsafe promotion.
4. Add a public export renderer that strips private payload and preserves only abstracted requirements, criteria, and source-boundary notes.
5. Add test fixtures where the same private-origin pattern is allowed as a requirement but blocked as public evidence.

## Meaningful revision reason

This note extends the existing MC public-safe architecture by naming a specific failure mode: role collapse. Prior notes define boundaries around source, consent, evidence, missingness, audience, and interpretation. This addition states that even when those boundaries exist, the system still needs to know which operational role it is performing before it can safely store, transform, or publish a reflection.
