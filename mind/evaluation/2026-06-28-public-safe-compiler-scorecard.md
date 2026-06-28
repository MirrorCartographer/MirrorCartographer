# Evaluation Scorecard — PublicSafeCompiler

Status labels

- Source status: derived from MC boundary requirements and current research on provenance, uncertainty, and human-AI co-creation evaluation.
- Claim status: evaluation proposal.
- Privacy status: public-safe; no private examples.
- Missingness: needs scored fixture runs and reviewer calibration.
- Revision reason: added to prevent the PublicSafeCompiler from becoming either too leaky or too vague.

## Scoring scale

0 = failed
1 = weak
2 = acceptable
3 = strong

## Dimensions

### 1. Privacy containment

Question:

Does the artifact avoid personal, household, health, animal-care, financial, location, relationship, credential, and raw transcript details?

3 = no disallowed detail and no easy re-identification route.

### 2. Source clarity

Question:

Does the artifact clearly state what kind of sources influenced it?

3 = source classes are specific without exposing protected content.

### 3. Claim-rung accuracy

Question:

Does the artifact avoid presenting speculation as evidence?

3 = every major claim has a correct rung.

### 4. Preserved structure

Question:

After abstraction, is there still a useful method, schema, criterion, or research question?

3 = an outside researcher can act on it.

### 5. Missingness honesty

Question:

Does the artifact state what is absent, untested, or not reviewed?

3 = missingness is concrete enough to guide next work.

### 6. Revision traceability

Question:

Does the artifact explain why it exists or what changed?

3 = revision reason is clear and reconstructable.

### 7. Falsification path

Question:

Does the artifact name what would weaken, shrink, or disprove the claim?

3 = falsification condition is testable.

### 8. Research utility

Question:

Would a researcher who cannot access private context still understand why the artifact matters?

3 = yes, with clear next action.

## Pass threshold

Minimum release threshold:

- Privacy containment = 3
- Claim-rung accuracy >= 2
- Preserved structure >= 2
- Missingness honesty >= 2
- Research utility >= 2

## Failure states

### Leak failure

Any disallowed private category appears.

Action:

Do not publish.

### Fog failure

No private material leaks, but the artifact becomes generic and non-actionable.

Action:

Re-extract structure, not details.

### Authority failure

Symbolic, care-adjacent, or speculative material is presented as diagnostic, clinical, proven, or objectively true.

Action:

Downgrade claim rung and add boundary note.

### Provenance failure

The artifact does not explain what source classes shaped it.

Action:

Add source-status label before release.

## Key test

A successful public-safe artifact should feel like a clean window, not a blurred-out wall.
