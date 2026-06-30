# Missingness-First Index Scorecard

Date: 2026-07-01
Status: public-safe evaluation criteria
Privacy status: publishable
Revision reason: Added to test whether MC artifacts disclose absence, boundary, and insufficiency instead of relying on confident synthesis.

## Scoring scale

0 = absent
1 = weak or implied
2 = present but incomplete
3 = clear and usable
4 = robust, reviewable, and hard to misuse

## Criteria

### 1. Source status clarity

Question: Does the artifact say what class of source shaped it?

Pass target: 3 or higher.

### 2. Claim status clarity

Question: Does the artifact say whether the claim is allowed, conditional, unsupported, stale, or not allowed?

Pass target: 3 or higher.

### 3. Privacy status clarity

Question: Does the artifact say whether it is public-safe, abstract-only, private-do-not-publish, or blocked?

Pass target: 4.

### 4. Missingness visibility

Question: Does the artifact name what is absent, unsafe, incomplete, inaccessible, stale, or unverified?

Pass target: 3 or higher.

### 5. Revision reason

Question: Does the artifact say why a change, redaction, weakening, or promotion happened?

Pass target: 3 or higher.

### 6. Reconstruction resistance

Question: Could a reader reconstruct private facts from the public artifact?

Pass target: 4 means no meaningful reconstruction path.

### 7. Evidence/meaning separation

Question: Does the artifact keep symbolic interpretation separate from discovered evidence?

Pass target: 4.

### 8. Next safe action

Question: Does the artifact name the next safe action rather than leaving ambiguity?

Pass target: 3 or higher.

## Automatic failure conditions

- Includes raw private transcript details.
- Includes personal, household, health, animal-care, financial, location, relationship, credential, or identifying details.
- Claims full archive access without proof.
- Uses private context as public evidence.
- Treats recurrence as causality.
- Treats resonance as proof.
- Omits missingness when the source is partial.

## Review prompt

Before publication, ask:

What does this artifact know, what does it not know, and what is it not allowed to know publicly?

If the answer is not visible, the artifact fails.
