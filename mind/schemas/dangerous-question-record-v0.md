# DangerousQuestionRecord v0

Status labels

- Source status: derived from the Dangerous Questions Manifest and existing MC risk-ladder/speculation-lab architecture.
- Claim status: schema proposal for high-risk intellectual exploration.
- Privacy status: public-safe schema; no private source material.
- Missingness: not yet implemented in runtime or regression-tested.
- Revision reason: created so bold questions can be preserved, scored, tested, and compared without becoming unsupported claims.

## Purpose

A `DangerousQuestionRecord` stores a high-risk intellectual question in a way that makes the risk visible and testable.

It is not a conclusion.

It is a launch object.

## Required fields

### question

The risky question in direct language.

### why_dangerous

What assumption it challenges.

### possible_world_if_true

What changes if the question points toward a real structure.

### possible_world_if_false

What becomes weaker or must be discarded if the question fails.

### invariant_structure

The underlying relationship or transformation being tested.

### lens_routes

Which domains should be used to inspect it.

Example lenses:

- AI systems
- cognition
- biology
- music
- design
- care communication
- governance
- economics

### risk_ladder_rung

Use one:

- metaphor
- hypothesis
- prototype seed
- testable claim
- product claim
- public claim

### evidence_lane

Which evidence lane is allowed to evaluate it.

### falsification_condition

What would make the question fail or shrink.

### first_test

Smallest useful test.

### boundary_bill

What private/source material is blocked from crossing.

### release_state

Use one:

- private only
- internal research
- public-safe speculation
- public-safe method
- tested protocol

### next_action

What should happen next.

## Rule

A dangerous question is valuable only if it can survive three pressures:

1. It remains bold after public-safe abstraction.
2. It can be tested or at least narrowed.
3. It does not require private leakage or false authority to sound interesting.
