# Release Readiness Scorecard

Status labels

- Source status: derived from MC public-safe release gate research and current provenance/co-creation evaluation research.
- Claim status: evaluation criteria draft.
- Privacy status: public-safe; no private-source details.
- Missingness: not yet calibrated against real artifacts or reviewer disagreement.
- Revision reason: created to make release decisions measurable enough for repeat review.

## Scoring scale

Each dimension is scored 0–3.

- 0 = absent or unsafe
- 1 = weak / vague / implied only
- 2 = usable but needs warning or refinement
- 3 = clear, bounded, reviewable, and useful

## Dimensions

### 1. Source boundary clarity

Does the artifact clearly state what source class shaped it?

0: no source status
1: vague source language
2: source class named, but boundaries incomplete
3: source class named and blocked categories checked

### 2. Claim/evidence alignment

Does the artifact speak only as strongly as its evidence allows?

0: unsupported authority claim
1: speculative claim presented too strongly
2: mostly bounded with minor ambiguity
3: claim status matches evidence lane

### 3. Privacy safety

Does the artifact avoid private leakage?

0: contains private/raw/personal detail
1: contains risky specificity
2: public-safe but needs stronger boundary label
3: public-safe and explicitly boundary-labeled

### 4. Missingness visibility

Can a reader see what is absent or unproven?

0: no missingness
1: generic caveat
2: specific but incomplete missingness
3: specific, actionable missingness

### 5. Utility clarity

Does the artifact help someone inspect, build, test, evaluate, or decide?

0: unclear value
1: interesting but not actionable
2: useful with interpretation effort
3: concrete utility for a defined reader/use case

### 6. Misuse resistance

Does the artifact prevent authority inflation, dependency, source laundering, or overclaiming?

0: invites misuse
1: weak caveat only
2: clear warning but weak mitigation
3: warning plus concrete mitigation

### 7. ViewDiff value

Did transformation make something newly inspectable?

0: no transformation value
1: restates prior idea
2: some new structure visible
3: clear difference, boundary, or method became inspectable

### 8. Release decision traceability

Can another reviewer understand why the artifact crossed or was held?

0: no decision trail
1: decision implied
2: decision stated but thin
3: gate outcome and rationale are explicit

## Suggested thresholds

### Release ready

Minimum total: 22/24
No score below 2.
Privacy safety must be 3.
Claim/evidence alignment must be 3.

### Release with warning

Minimum total: 18/24
No score below 1.
Privacy safety must be at least 2.
Claim/evidence alignment must be at least 2.

### Hold for fixture

Useful artifact, but utility or ViewDiff value below 2.

### Hold for evidence

Claim/evidence alignment below 2.

### Private only

Privacy safety below 2 or blocked source categories cannot be abstracted.

## Reviewer prompt

Before release, ask:

1. What exactly crosses?
2. What exactly stays private?
3. What is the strongest claim?
4. What evidence lane supports that claim?
5. What is missing?
6. What could be misused?
7. What became more inspectable through this artifact?
8. Why is this the correct release state?

## Key phrase

If the artifact cannot explain its crossing, it is not ready to cross.
