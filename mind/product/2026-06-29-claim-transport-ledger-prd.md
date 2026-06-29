# PRD: Public-Safe Claim Transport Ledger

Status: product requirement draft
Source status: private-context-informed, repo-targeted, fresh-research-aligned
Claim status: product requirement
Privacy status: public-safe; uses only abstract categories and synthetic examples
Missingness: not implemented in UI, API, or storage layer
Revision reason: converts the research note into product behavior.

## Product goal

Give MC a repeatable release mechanism for turning private-context-informed architecture into public-safe artifacts without leakage or flattening.

## User problem

A user may want AI to learn from private long-term context and publish useful public research or product artifacts. The system must prove that the artifact is safe to release and still structurally meaningful.

## Core user story

As a user, I want MC to convert private-context understanding into public-safe methods, requirements, questions, and evaluations, so I can build public work without exposing protected source material.

## Required behavior

1. Every release candidate gets a ClaimTransportLedgerRecord.
2. The record labels source status, claim status, privacy status, missingness, and revision reason.
3. The system refuses to publish artifacts that expose protected categories.
4. The system preserves structural signal through abstract labels.
5. The system shows why a claim is allowed to cross the public boundary.
6. The system records what would revise or falsify the claim.
7. The system separates reflection, inference, speculation, product requirement, and evidence.

## Boundary header component

Each publishable artifact should begin with:

- Source status
- Claim status
- Privacy status
- Missingness
- Revision reason

## Release decisions

- Publish: no protected source exposure; claim has clear boundary and missingness.
- Rewrite: useful claim, but boundary is unclear or language overreaches.
- Hold: private context is too structurally identifying.
- Synthesize: replace real example with synthetic fixture.
- Discard: value does not survive safe transformation.

## Non-goals

- Storing raw private context in public records
- Certifying truth from resonance
- Presenting symbolic interpretation as diagnosis or authority
- Automating external action from private-context inference
- Making public artifacts sound more certain than their evidence allows

## MVP modules

1. Boundary Header Generator
2. Claim Classifier
3. Protected Detail Scanner
4. Transformation Method Selector
5. Fidelity Preservation Checklist
6. Release Readiness Gate
7. Revision Reason Logger

## Acceptance criteria

- No public artifact contains protected categories.
- Every public artifact states source status, claim status, privacy status, missingness, and revision reason.
- Every artifact has at least one falsification or revision route.
- Synthetic fixtures are clearly labeled synthetic.
- Private influence is disclosed as boundary class, not reproduced as source content.
- The artifact remains understandable without private context.

## Key phrase

A public-safe system should not ask the reader to trust that redaction happened. It should show the route by which the claim crossed.
