# PRD: Transformation Trace Envelope

Date: 2026-06-30
Status: public-safe product requirement
Privacy status: abstracted; contains no restricted source details
Claim status: product requirement and implementation plan
Revision reason: MC needs a product mechanism for documenting how restricted context becomes public-safe design knowledge without exposing the restricted context itself

## Problem

Mirror Cartographer uses long-context symbolic and reflective continuity. Some design insights arise from private interaction patterns, file-library fragments, saved context, or internal architecture memory. Public artifacts should benefit from that learning without publishing personal source material.

Current public artifacts label source status, claim status, evidence boundaries, and user feedback loops. The missing product layer is a transformation trace: a reviewable envelope showing how private source pressure became a public-safe method, requirement, evaluation criterion, index, or implementation plan.

## Goal

Create a public-safe audit mechanism that lets MC publish design knowledge while preventing private-source leakage.

## Non-goals

- Do not publish raw transcripts.
- Do not create a public personal archive.
- Do not use private content as hidden evidence for factual claims.
- Do not infer identity, health, household, animal-care, financial, location, relationship, credential, or diagnostic details.
- Do not claim therapeutic, medical, legal, veterinary, or financial authority.

## User stories

### As a builder

I need to convert private-context pressure into public-safe architecture notes so that the system improves without leaking source details.

### As a reviewer

I need to see source status, claim status, privacy status, missingness, and revision reason so that I can determine whether publication is safe.

### As a future contributor

I need examples of allowed and disallowed transformation so that I can add MC artifacts without collapsing private memory into public evidence.

## Required fields

Every trace envelope must include:

- source status
- claim status
- privacy status
- source boundary
- transformation rule
- redaction rule
- admissible public output
- missingness
- revision reason
- reviewer question

## UX behavior

In internal authoring mode, when a new `mind/research`, `mind/product`, `mind/evaluation`, `mind/schemas`, `mind/fixtures`, or `mind/forces` artifact is created, the interface should ask:

1. What source class shaped this artifact?
2. What is the claim allowed to carry?
3. What private or sensitive detail was removed?
4. What remains missing or unverified?
5. Why is this revision being made now?
6. Could a reader reconstruct the source?

The artifact should not be marked publishable until those questions are answered.

## Acceptance criteria

- The trace record can be read independently of the private source.
- The public artifact remains useful after all private content is removed.
- The trace identifies its claim lane.
- The trace identifies missingness.
- The trace includes a non-generic revision reason.
- The trace blocks publication when reconstruction risk is high.

## Implementation plan

1. Store trace envelopes as markdown or JSON sidecars.
2. Add a lint-style checklist for public artifacts.
3. Add fictional fixture cases for safe, borderline, and blocked transformations.
4. Add reviewer scoring using the transformation trace scorecard.
5. Later: integrate trace-status badges into the MC authoring UI.

## Open research questions

- What is the minimum trace that preserves accountability without creating source reconstruction risk?
- Can transformation traces be machine-checked for sensitive detail leakage?
- How should traces handle mixed public and private source pressure?
- When should a trace be private-only rather than public?
- How should supersession work when a later artifact revises a boundary rule?

## Safety invariant

Public MC knowledge may inherit structure from private context, but it must not inherit private content.
