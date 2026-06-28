# ViewDiff Discovery Scorecard

Status labels

- Source status: derived from MC dangerous-questions lane and fresh public research on provenance, semantic invariance, semantic drift, and lifecycle lineage.
- Claim status: evaluation proposal; not yet validated.
- Privacy status: public-safe; uses synthetic fixtures only.
- Missingness: no dataset, reviewer study, implementation, or threshold calibration yet.
- Revision reason: created to make `discovery is a ViewDiff event` testable rather than merely poetic.

## Purpose

This scorecard tests whether a transformation produced discovery-value or merely produced a different form.

A good transformation does not only preserve meaning.

A good transformation exposes a difference that matters.

## Scoring scale

Use 0 to 3 for each axis.

0 = absent
1 = weak
2 = usable
3 = strong

## Axes

### 1. Invariant preservation

Did the core relationship survive the transformation?

- 0: core relationship lost
- 1: partially recognizable
- 2: preserved with minor distortion
- 3: preserved cleanly across form

### 2. New visibility

Did the transformation reveal something not obvious in the source view?

- 0: no new visibility
- 1: mostly restatement
- 2: clear new contrast or risk
- 3: strong new structure visible only through comparison

### 3. Action yield

Did the ViewDiff produce a next action?

- 0: no action
- 1: vague direction
- 2: concrete next test or artifact
- 3: concrete next test with owner, input, output, and failure condition

### 4. Distortion detection

Did the record identify what changed incorrectly or dangerously?

- 0: no distortion tracked
- 1: obvious distortion only
- 2: meaningful distortion captured
- 3: distortion captured with mitigation

### 5. Boundary preservation

Did the transformation avoid private leakage and false authority?

- 0: unsafe
- 1: requires redaction
- 2: public-safe with minor caution
- 3: public-safe and boundary-explicit

### 6. Evidence lane clarity

Does the artifact distinguish speculation, evidence, prototype, and product claim?

- 0: no distinction
- 1: unclear status
- 2: status mostly clear
- 3: status explicit and auditable

### 7. Reuse value

Can future researchers or builders use the record?

- 0: no reuse
- 1: inspiration only
- 2: usable pattern
- 3: reusable test protocol or schema input

## Discovery candidate threshold

A transformation may be called a `discovery candidate` when:

- invariant preservation >= 2
- new visibility >= 2
- boundary preservation >= 3
- evidence lane clarity >= 2
- total score >= 15 out of 21

## Not enough

The following are not discovery by themselves:

- prettier wording
- stronger metaphor
- emotional resonance
- confident language
- summarization
- compression
- novelty without action

## Strong form

A discovery candidate is strongest when it creates a new test that did not exist before the transformation.

## Key phrase

A discovery is not a prettier answer. It is a difference that gives the next experiment somewhere to stand.
