# Product Requirement — ViewDiff Discovery Engine

Status labels

- Source status: derived from public-safe MC architecture, GitHub mind continuity, and current public research alignment.
- Claim status: product requirement; not implemented.
- Privacy status: public-safe; no private material.
- Missingness: no UX prototype, API, schema implementation, or customer validation yet.
- Revision reason: created to convert the `discovery is a ViewDiff event` hypothesis into a buildable product module.

## Product idea

The ViewDiff Discovery Engine helps users find what changed when an idea moves across forms.

It does not merely compare text.

It compares meaning, boundary, risk, action, and evidence status.

## User problem

AI systems can transform ideas quickly, but users often cannot tell:

- what was preserved
- what was lost
- what was invented
- what became newly actionable
- what became unsafe or overclaimed
- what deserves the next experiment

## Core workflow

1. User supplies or selects a public-safe source artifact.
2. System assigns source, claim, privacy, and missingness status.
3. User chooses transformation lenses.
4. System generates target views.
5. System builds a ViewDiff record.
6. System scores discovery potential.
7. System emits next action, boundary bill, and release recommendation.

## MVP features

- Source artifact card
- Transformation lens selector
- Target view generator
- ViewDiff table
- Discovery scorecard
- Boundary bill
- Next-test generator
- Public-safe export

## Non-goals

- No hidden use of private material.
- No diagnostic or clinical conclusion generation.
- No claim that discovery is proven by aesthetic force.
- No public release without boundary status.

## Acceptance criteria

A completed ViewDiff run must show:

- source status
- claim status
- privacy status
- missingness
- transformation lens
- preserved invariant
- new visibility
- distortion
- next test
- release state

## Commercial wedge

Sell as an `AI Insight Audit`:

Given an AI-generated strategy, essay, report, care packet, or creative artifact, MC identifies whether the transformation produced real new value or only confident restatement.

Deliverable:

- ViewDiff report
- discovery score
- overclaim warnings
- boundary bill
- next-test plan

## Key phrase

The product does not ask, `Did AI make something impressive?`

It asks, `What changed, what survived, and what can now be tested?`
