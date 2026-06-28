# Scorecard — Consent-Scoped Influence Graph

Status labels

- Source status: derived from Consent-Scoped Influence Graph research note and product requirement.
- Claim status: evaluation proposal.
- Privacy status: public-safe; no private source material.
- Missingness: not yet run against a corpus of artifacts.
- Revision reason: created to make influence-boundary quality measurable.

## Purpose

This scorecard evaluates whether an artifact honestly represents its influences without leaking private material or overstating evidence.

## Scoring scale

Use 0 to 2 for each criterion.

- 0 = absent or unsafe
- 1 = partially present
- 2 = clear, safe, and useful

Maximum score: 20

## Criteria

### 1. Source lane clarity

Can a reviewer identify which source lanes shaped the artifact?

### 2. Blocked lane clarity

Does the artifact explicitly name what classes of source material were blocked?

### 3. Transformation clarity

Does the artifact say how private or mixed-source influence was transformed into public-safe output?

### 4. Claim dependency clarity

Are claims tagged as public evidence, repository precedent, architecture inference, synthetic fixture, speculative hypothesis, or unsupported?

### 5. Privacy non-reconstruction

Can the graph be read without reconstructing private details?

### 6. Missingness honesty

Does the artifact plainly state what is not known, not tested, or not implemented?

### 7. Revision reason clarity

Does the artifact explain why it exists or changed?

### 8. Evidence restraint

Does the artifact avoid treating private context as public evidence?

### 9. Research usefulness

Can a future researcher understand where to inspect or test next?

### 10. Product usefulness

Can the record support implementation, audit, or review workflow?

## Pass thresholds

- 18-20: public-safe and strong
- 14-17: usable but needs tightening
- 10-13: internal only until improved
- 0-9: blocked from public use

## Failure modes

Automatic fail if:

- raw private transcript appears
- personal details are exposed
- hidden context is treated as evidence
- clinical, legal, financial, or credential authority is implied without proper scope
- source lane labels are so vague they become decorative

## First fixture target

Apply this scorecard to the PublicSafeCompiler artifact family.
