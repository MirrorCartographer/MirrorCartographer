# Product Requirement — Authority Boundary Layer

Status labels

- Source status: derived from MC implementation pack, public-safe architecture notes, and current research pass.
- Claim status: product requirement, not implementation proof.
- Privacy status: public-safe; no private source material.
- Missingness: not yet represented in UI, API, database schema, export templates, or automated tests.
- Revision reason: created so MC can preserve symbolic force while clearly preventing unsupported authority claims.

## Product problem

MC artifacts can be useful because they are coherent, emotionally legible, symbolic, and cumulative.

Those same strengths create risk.

A user may mistake a powerful reflection for a true diagnosis, a safe instruction, an expert conclusion, or evidence that an external situation has been proven.

The product needs a visible boundary layer that says what each artifact is allowed to be.

## Requirement

Every generated artifact receives an `AuthorityBoundaryRecord` before it is saved, exported, shared, or transformed.

## Required UI behavior

### 1. Authority badge

Display one of:

- Orientation
- Reflective Hypothesis
- Preparation Artifact
- Action Support With External Anchor
- Blocked Authority

### 2. Plain-language boundary line

Examples:

- This is a reflection aid, not a conclusion.
- This is a question-prep packet, not expert advice.
- This uses external sources; check the cited authority before acting.
- This artifact is blocked because it would make an unsupported high-stakes claim.

### 3. Missingness strip

Display what is absent:

- not independently verified
- not professional advice
- not sourced
- not tested longitudinally
- derived from private context but abstracted
- synthetic fixture only

### 4. Downgrade behavior

When high-stakes content is detected, convert output into one of:

- questions to ask
- observations to track
- evidence needed
- professional-review packet
- source checklist
- refusal/block when unsafe

### 5. Export behavior

Exported artifacts must include:

- source status
- claim status
- privacy status
- missingness
- authority class
- revision reason

## Data model addition

Add an `authority_boundary` object to artifact records.

Minimum fields:

- artifact_id
- authority_class
- claim_status
- allowed_uses
- forbidden_uses
- high_stakes_domains_detected
- downgrade_rule
- evidence_requirements
- missingness
- revision_reason

## Acceptance criteria

1. No artifact can be exported without an authority class.
2. High-stakes content cannot silently remain Class 0 or Class 1 if it gives action instructions.
3. Any Class 3 artifact must identify its external anchor.
4. Class 4 artifacts are blocked or rewritten into a lower-authority safe form.
5. The user can see why the boundary was applied.
6. The artifact remains useful after downgrade.

## Example transformation

Unsafe:

- This means the answer is X.

Safe:

- This pattern suggests a question worth testing. Current authority class: Reflective Hypothesis. Evidence needed before action: external expert/source review.

## Strategic value

This layer lets MC be more vivid, not less vivid.

The system can preserve wild symbolic hypotheses while preventing the artifact from pretending to have authority it does not have.
