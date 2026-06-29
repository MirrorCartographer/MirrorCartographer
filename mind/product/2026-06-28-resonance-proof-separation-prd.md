# Product Requirement — Resonance / Proof Separation

Status labels

- Source status: derived from MC implementation requirements, public-safe file-library materials, prior GitHub mind artifacts, and fresh public research on affective-computing uncertainty and appropriate reliance.
- Claim status: product requirement proposal; not implemented.
- Privacy status: public-safe; no private source material.
- Missingness: lacks design mockups, instrumentation, analytics schema, longitudinal validation, and accessibility review.
- Revision reason: created because MC's reflection loop depends on resonance feedback, and that loop needs an explicit anti-overclaim design.

## Problem

MC asks users to mark resonance so the map can update.

That is useful.

But resonance can be confused with proof.

A beautiful, relieving, or personally fitting reflection may still be unsupported, speculative, or outside MC's authority.

## Product goal

Build a feedback layer that separates:

- felt fit
- source support
- uncertainty
- authority boundary
- next action

## Required UI behavior

After a reflection, the user should not see only one feedback axis.

Instead, MC should ask two separate questions:

### 1. How did it land?

Options:

- resonant
- partly resonant
- not resonant
- beautiful but uncertain
- relieving but unproven
- intense; slow down
- confusing

### 2. What should the system treat it as?

Options:

- fact-backed
- user-confirmed pattern
- symbolic only
- speculation
- needs outside source
- contradicted
- outside authority

## Required system behavior

The system must:

- store resonance separately from proof status
- lower confidence when felt fit is high but source support is low
- preserve contradictions instead of resolving them prematurely
- prevent resonant artifacts from becoming future authority unless confirmed by source status
- display mode labels: Canonical, Reflective, Mythopoetic
- allow the user to mark an output as useful but not true
- allow the user to mark an output as true but emotionally non-resonant

## Non-goals

This feature does not diagnose, treat, certify, predict, or prove internal states.

It does not make MC a clinical, therapeutic, legal, financial, or professional authority.

It does not replace human judgment or professional care.

## Acceptance criteria

A prototype passes if:

- users can distinguish `felt true` from `source-backed`
- every generated reflection has a visible claim-status label
- high-resonance / low-proof outputs are stored as symbolic or speculative only
- contradiction records survive export
- evaluators can audit why a future artifact was influenced by a prior resonance signal

## Failure criteria

The feature fails if:

- resonance silently increases factual confidence
- beautiful language hides uncertainty
- the system uses user relief as validation
- outputs become more persuasive without becoming more inspectable
- private material leaks into public artifacts

## Key phrase

Let resonance steer the map. Do not let it crown itself king.
