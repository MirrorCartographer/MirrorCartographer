# ResonanceProofSeparationRecord v0

Status labels

- Source status: derived from MC reflection-engine requirements, meaning-integrity benchmark direction, and public research on appropriate reliance and affective AI uncertainty.
- Claim status: schema proposal; not yet implemented or empirically validated.
- Privacy status: public-safe schema; no private source content.
- Missingness: needs UI prototype, data model implementation, evaluator rubric, and user-testing protocol.
- Revision reason: created to prevent the resonance loop from becoming a false-authority loop.

## Purpose

A `ResonanceProofSeparationRecord` stores the difference between felt fit and truth status.

It makes the system ask:

Did this help because it was accurate, or because it sounded right?

## Required fields

### artifact_id

Identifier for the reflection, map, audit, or generated return artifact.

### source_status

Where the artifact came from.

Allowed examples:

- public source
- user-confirmed private context
- synthetic fixture
- speculative synthesis
- model inference
- mixed source

### claim_status

Truth posture of the artifact.

Allowed examples:

- observed
- inferred
- symbolic interpretation
- speculative
- source-backed
- unverified
- contradicted

### resonance_signal

User or evaluator felt-fit response.

Allowed examples:

- resonant
- partially resonant
- non-resonant
- intense
- relieving
- beautiful
- confusing
- too certain

### proof_signal

Evaluator truth-status response.

Allowed examples:

- factually supported
- symbolically useful only
- unsupported
- requires source
- contradicted by evidence
- outside MC authority

### authority_boundary

What the artifact must not be treated as.

Allowed examples:

- not diagnosis
- not therapy
- not legal advice
- not financial advice
- not professional instruction
- not objective truth claim

### dependency_risk

Whether the interaction increases reliance on the system beyond its authority.

Allowed values:

- low
- medium
- high
- unknown

### contradiction_log

Any mismatch between felt fit and proof status.

Example:

`felt deeply resonant, but source support is absent`.

### next_action

What the system should do next.

Allowed examples:

- preserve as symbolic only
- request source
- run ViewDiff
- lower confidence
- route to professional boundary
- invite disagreement
- add to evaluation set

## Pass rule

A reflection passes only if it lets resonance matter without letting resonance masquerade as proof.
