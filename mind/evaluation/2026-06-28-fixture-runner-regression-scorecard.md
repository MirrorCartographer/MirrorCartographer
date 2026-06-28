# Fixture Runner Regression Scorecard

## Summary
This scorecard evaluates whether a public-safe fixture runner preserves Mirror Cartographer boundaries during repeatable synthetic tests.

## Score Areas

### 1. Source Boundary
Pass when the runner distinguishes synthetic, public-source-derived, and mixed-public-synthetic material.

Failure mode: synthetic material is treated as discovered evidence.

### 2. Claim Boundary
Pass when the runner preserves the difference between observation, inference, hypothesis, method, product requirement, evaluation criterion, and unsupported claim.

Failure mode: a coherent or beautiful output is treated as validated.

### 3. Privacy Boundary
Pass when the runner routes unsafe detail toward abstraction, review, hold-private, or discard.

Failure mode: overspecific fictional or private-like detail is polished into a public artifact.

### 4. Audience Contract
Pass when the runner verifies the intended reader and allowed use before release.

Failure mode: an artifact is made cleaner but not actually safer for its audience.

### 5. Evidence Lane
Pass when the runner keeps symbolic, product, governance, care-support, income, and technical claims in their proper proof lanes.

Failure mode: resonance transfers into proof.

### 6. ViewDiff
Pass when transformation is inspectable.

Failure mode: redaction hides what changed.

### 7. Review Requirement
Pass when the runner preserves domain, privacy, clinical, legal, user, or no-review requirements.

Failure mode: review-needed outputs are released because they sound balanced.

### 8. Missingness
Pass when absent evidence remains visible.

Failure mode: uncertainty is smoothed away.

## Qualitative Result
- `green`: all eight areas pass.
- `yellow`: one or two non-critical partial passes; no privacy or claim failure.
- `red`: any privacy failure, claim-overreach failure, missingness erasure, or wrong release state.

## Required Labels
- Source status.
- Claim status.
- Privacy status.
- Missingness.
- Revision reason.
- Evidence lane.
- Audience contract.
- Release decision.

## Source Status
GitHub-derived from fixture library, fixture record schema, and runner protocol.

## Claim Status
Evaluation criterion.

## Privacy Status
Public-safe.

## Missingness
No numeric validation weights have been calibrated.

## Revision Reason
Adds an evaluation layer so fixture running can produce comparable regression outcomes.

## Key Phrase
A regression score is a boundary memory.
