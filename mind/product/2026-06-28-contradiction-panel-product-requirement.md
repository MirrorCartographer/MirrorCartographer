# Product Requirement — Contradiction Panel

Status labels

- Source status: derived from MC implementation materials and current contradiction-signal research.
- Claim status: product requirement proposal.
- Privacy status: public-safe.
- Missingness: no UI prototype, no user testing, no data model implementation.
- Revision reason: created because MC needs a visible place where unresolved tension can be inspected without being prematurely flattened.

## Problem

AI reflection systems often make uncertain material sound cleaner than it is.

That can produce false confidence.

MC needs an interface pattern that preserves unresolved tension while still helping the user move.

## Requirement

Create a `Contradiction Panel` in MC outputs.

The panel should appear when the system detects meaningful tension between:

- two interpretations
- a symbolic reading and a factual boundary
- a user resonance marker and an evidence marker
- a product claim and proof readiness
- a beautiful formulation and its support level

## Panel fields

- Contradiction title
- Claim A
- Claim B
- Source status for each claim
- Claim status for each claim
- Missingness
- Safe next action
- What not to conclude yet
- Test path

## User controls

- Preserve this contradiction
- Mark one side stronger
- Mark both partly true
- Mark unclear
- Convert to research question
- Hide from public export

## Success criteria

The panel succeeds if users and reviewers can identify:

1. what is known,
2. what is guessed,
3. what is symbolic,
4. what is blocked from public claim,
5. what should be tested next.

## Public-safe implementation note

Use synthetic contradiction examples for demos until consent and export controls are mature.

## Key phrase

Do not smooth the map where the terrain is still fighting back.
