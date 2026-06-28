# Translation Survival Scorecard v0

Status labels

- Source status: derived from the Dangerous Question Record on translation survival, public-safe MC specifications, and fresh public research on semantic invariance and paraphrase robustness.
- Claim status: proposed evaluation method, not validated benchmark.
- Privacy status: public-safe; uses synthetic or abstract fixtures only.
- Missingness: not implemented in code; no inter-rater reliability; no baseline comparison yet.
- Revision reason: created to convert the risky claim `understanding is translation survival` into something testable.

## Purpose

This scorecard evaluates whether an idea keeps its core structure when translated across views.

It does not measure truth by itself.

It measures structural survival.

## Core hypothesis

Understanding is visible when meaning survives valid transformation.

## Views to test

Minimum five-view run:

1. Plain-language statement
2. Symbolic/metaphoric rendering
3. Product requirement
4. Evaluation criterion
5. Public-safe release note

Optional views:

- diagram description
- interface copy
- research abstract
- implementation plan
- care-support handoff question
- museum artifact

## Scoring dimensions

Each dimension is scored 0 to 2.

0 = lost or contradicted
1 = partially preserved
2 = preserved clearly

### 1. Core relation survives

Does the main relationship remain intact?

Example: if the seed says `privacy changes the allowed view of a continuity record`, the translation must preserve both privacy and view-change.

### 2. Boundary condition survives

Does the translation preserve what is allowed, blocked, uncertain, or out of scope?

### 3. Claim status survives

Does speculation remain labeled as speculation?

Does evidence remain labeled as evidence?

### 4. Uncertainty survives

Does the translation preserve missingness, confidence limits, and falsification conditions?

### 5. Action implication survives

Does the translation preserve what should be done next?

### 6. Contradiction survives

If the seed contains a tension, does the translated form preserve the tension instead of resolving it falsely?

### 7. Source lineage survives

Can a reviewer trace what the claim depends on?

### 8. Privacy status survives

Does the translation avoid adding private or identifiable detail?

### 9. Compression quality

Does the translation reduce complexity without destroying necessary structure?

### 10. Mutation visibility

If something changed, is the change visible rather than hidden?

## Score interpretation

- 18-20: strong translation survival
- 14-17: useful but needs revision
- 10-13: partial survival; meaning drift likely
- 0-9: failed translation; do not release as equivalent

## ViewDiff requirement

Every test run should include a ViewDiff note:

- what survived
- what mutated
- what was lost
- what was added
- whether the mutation was acceptable

## Anti-cheat rule

Vague language should not score high merely because it fits many interpretations.

A translation survives only when a specific invariant remains identifiable.

## Public-safe fixture requirement

Use synthetic fixtures until the method is stable.

No private person, household, health, animal-care, financial, location, relationship, credential, or raw transcript material should be used in public fixtures.

## First benchmark seed

Seed:

A boundary is not proven by silence. It is proven by a record of what was allowed to cross.

Expected invariant:

The seed argues that privacy/provenance is demonstrated by visible transformation records, not by absence of disclosure alone.

Test:

Translate into:

1. plain explanation
2. interface requirement
3. audit checklist
4. symbolic image prompt
5. release note

Then score survival.
