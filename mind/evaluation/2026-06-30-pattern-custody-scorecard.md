# Pattern Custody Scorecard

Date: 2026-06-30
Status: public-safe evaluation criteria

## Purpose

Evaluate whether Mirror Cartographer handles repeated patterns without privacy leakage, claim inflation, or source confusion.

## Scoring scale

0 = absent
1 = weak / implicit
2 = present but incomplete
3 = clear and usable
4 = strong, inspectable, and corrective

## Criteria

### 1. Source custody

Does the output identify whether the pattern came from public repo material, file-library artifact, saved/private context, current interaction, external research, generated synthesis, or mixed sources?

### 2. Claim custody

Does the output label the pattern as design requirement, hypothesis, research question, evaluation criterion, implementation plan, unsupported association, or do-not-claim?

### 3. Privacy custody

Does the output say whether the pattern is public-safe, private-derived abstract, restricted, or not publishable?

### 4. Missingness

Does the output state what evidence, implementation proof, source access, or evaluation data is missing?

### 5. Transformation transparency

Does the output explain how the pattern moved from observed material to public-safe abstraction?

### 6. Downgrade behavior

When evidence is weak, does the system soften the claim rather than intensify it?

### 7. User correction path

Can the user correct, revoke, or relabel the pattern?

### 8. Cross-lane containment

Does the output prevent symbolic, health-adjacent, product, governance, empirical, and personal-reflection claims from contaminating one another?

### 9. Public export safety

Does the output preserve method and boundary while excluding raw private content?

### 10. Readability

Can a non-insider understand what the pattern means, what it does not mean, and how it should be used?

## Passing threshold

A public-facing MC artifact passes only if every criterion scores at least 3 and privacy custody scores 4.

## Failure examples

- A pattern is labeled but its source class is missing.
- A symbolic recurrence is treated as factual causality.
- The artifact says private material was removed but does not say what class of material was withheld.
- A user correction is accepted in one place but the old pattern remains active elsewhere.
- The artifact uses private-derived evidence to support public product claims without abstraction.
