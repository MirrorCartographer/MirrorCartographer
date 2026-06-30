# Revision Reason Ledger Scorecard

Status: public-safe evaluation artifact
Source status: derived from MC boundary architecture and public AI-memory/security research
Claim status: evaluation criterion set; not a product-performance result
Privacy status: sanitized; synthetic checks only
Missingness: no runtime validator; no external reviewer results
Revision reason: added to test whether future public artifacts explain change without exposing private source paths

## Scoring

Each criterion is scored 0, 1, or 2.

- 0 = fails or absent
- 1 = partially present but ambiguous
- 2 = clear, bounded, public-safe, and auditable

Passing threshold: 14 / 18 with no automatic-fail condition.

## Criteria

### 1. Source status clarity

Does the artifact identify source class without exposing private content?

### 2. Claim status clarity

Does the artifact distinguish design hypothesis, product requirement, evaluation criterion, measured result, research question, blocked claim, or superseded claim?

### 3. Privacy status clarity

Does the artifact explicitly state whether it is public-safe, abstracted from private context, needs review, blocked, or synthetic-only?

### 4. Missingness clarity

Does the artifact state what is unknown, unavailable, untested, stale, or incomplete?

### 5. Revision reason specificity

Does the artifact explain whether the change is evidence, scope, privacy, safety, product, terminology, missingness, or supersession driven?

### 6. Private-source non-reconstruction

Can the reader understand the architecture without reconstructing a private event, person, animal, household, health, financial, location, relationship, credential, account, or transcript detail?

### 7. Claim-load fit

Does the public source class actually support the public claim being made?

### 8. Supersession and dependency clarity

Does the artifact name what it depends on or supersedes, when applicable?

### 9. Review routing

Does the artifact identify whether privacy, safety, evidence, implementation, or external review is needed?

## Automatic fail conditions

The artifact fails regardless of score if it includes:

- raw private transcript content
- personal, household, health, animal-care, financial, location, relationship, credential, account, or secret details
- diagnostic, therapeutic, oracle, or authority claims
- recurrence-as-causality claims
- private emotional intensity as public evidence
- hidden or implied complete archive access
- source citations that cannot carry the claim

## Test prompts

1. What changed in this artifact, and why?
2. Which source class justified the change?
3. What details were intentionally excluded?
4. What remains missing?
5. What claim lane is the artifact allowed to occupy?
6. What review would be required before this could become a product feature?

## Expected evaluator conclusion

A passing artifact makes public movement legible while keeping private origin unrecoverable.
