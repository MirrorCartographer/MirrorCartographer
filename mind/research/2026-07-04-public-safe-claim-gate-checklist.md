# Public-Safe Claim Gate Checklist

Date: 2026-07-04
Status: research note
Maturity level: Level 2 — requirement candidate
Privacy status: public-safe abstraction
Source status: derived from private-context architectural patterns, repository README claim boundaries, and the maturity-indexed public-safe backlog sequence
Claim status: proposed product-governance requirement, not validated implementation
Revision reason: this note answers the prior backlog question by converting allowed/not-allowed public claims into a repeatable gate for README, demo, product-page, application, grant, and public research language.

## Core finding

Mirror Cartographer needs a **Public-Safe Claim Gate Checklist**.

Operating line:

> A claim is not public-safe because it sounds careful; it is public-safe when its evidence, source boundary, privacy boundary, maturity level, and demotion path are visible before publication.

## Problem

Mirror Cartographer already separates allowed public claims from not-allowed claims. It can describe reflective human-AI interaction, structure reflection and pattern tracking, generate hypotheses/questions/summaries/maps, and require external verification. It must not claim diagnosis, replacement of professional care, factual truth from symbolic resonance, causality from recurrence alone, or automatic AI superiority.

The risk is not only making an obviously forbidden claim. The subtler risk is that a demo, diagram, grant paragraph, landing-page sentence, or research note may imply more certainty than the underlying evidence supports.

A claim gate turns public wording into an inspectable release decision.

## Non-goals

This checklist does not expose private source material.

This checklist does not validate health, psychological, veterinary, legal, financial, credential, household, location, relationship, or transcript-level claims.

This checklist does not claim implementation exists.

This checklist does not make private-context interpretation publishable merely because it has been abstracted.

## Gate scope

The checklist should apply before publication to:

- README language
- landing-page language
- demo captions
- demo boundary strips
- grant or application claims
- product requirements
- research summaries
- diagrams
- screenshots
- social or public-facing descriptions
- evaluation reports
- public indexes

## Required claim labels

Every public claim should carry or be traceable to these labels:

- claim id
- claim text
- publication surface
- maturity level
- source status
- claim status
- privacy status
- evidence basis
- missingness
- allowed interpretation
- blocked interpretation
- revision reason
- demotion trigger
- owner or maintainer role
- next validation step

## Gate questions

### 1. Source boundary

Ask:

- Is this claim based on public repository material, synthetic fixture material, consented public material, or private-context architectural abstraction?
- Does the wording reveal or allow reconstruction of personal, household, health, animal-care, financial, location, relationship, credential, or raw transcript detail?
- Could the claim become identifying when combined with adjacent public artifacts?

Pass condition:

The source class is visible and no private source can be reconstructed.

Fail condition:

The claim depends on private detail, raw transcript content, identifying chronology, or composite reconstruction risk.

### 2. Evidence boundary

Ask:

- Is the claim an observed implementation, a tested fixture result, a proposed requirement, a research question, or a conceptual frame?
- Does the wording imply proof, causality, diagnostic authority, or product capability beyond what exists?
- Is resonance being treated as fit rather than truth?

Pass condition:

The evidence basis matches the strength of the claim.

Fail condition:

The wording turns reflection, repetition, symbolism, interface polish, or private-context patterning into factual proof.

### 3. Maturity boundary

Ask:

- What backlog lane does this claim occupy?
- Is it Level 1 concept, Level 2 requirement candidate, Level 3 testable specification, Level 4 implemented behavior, Level 5 scoped public claim, or retired/merged?
- Is the public surface appropriate for that maturity level?

Pass condition:

The claim only states what its maturity level permits.

Fail condition:

A concept is presented as a feature, a requirement as an implementation, or an implementation as a validated public outcome.

### 4. Interface boundary

Ask:

- Does the same claim keep its evidence and privacy labels when moved from text to interface, diagram, export, demo, dashboard, or ritual language?
- Does visual design make the claim feel more certain than it is?
- Does the interface show whether the viewer is seeing evidence, invention, interface behavior, or redacted private signal?

Pass condition:

The interface preserves claim status and shows the boundary.

Fail condition:

The interface makes unvalidated or synthetic output look like private-source evidence or validated system performance.

### 5. External-risk boundary

Ask:

- Could this claim be interpreted as therapy, diagnosis, medical guidance, veterinary guidance, legal advice, financial advice, emergency support, or objective truth verification?
- Does the claim invite dependency or misplaced authority?
- Does it include external verification language where needed?

Pass condition:

The claim remains reflective, research-oriented, and verification-aware.

Fail condition:

The claim crosses into professional replacement, emergency authority, diagnosis, treatment, or objective truth engine framing.

### 6. Missingness boundary

Ask:

- What is missing from this claim?
- Does the public wording disclose the missing implementation, fixture, review, validation, or evidence?
- Is the missingness important enough to block publication?

Pass condition:

Missingness is visible and does not invalidate the public surface.

Fail condition:

A reasonable reader would believe the missing part already exists.

### 7. Demotion boundary

Ask:

- What would make this claim weaker, stale, unsafe, or false?
- Is there a retirement path if the source boundary changes, evidence fails, privacy risk increases, or implementation diverges?
- Is the revision reason documented?

Pass condition:

A demotion trigger and revision path exist.

Fail condition:

The claim can remain public after its evidence, source, or privacy status expires.

## Claim status vocabulary

Use one of these values:

- proposed concept
- requirement candidate
- testable specification
- implemented behavior
- scoped public claim
- externally verified claim
- synthetic-only demonstration
- private-context abstraction
- blocked claim
- retired claim
- superseded claim

## Publication decision values

Use one of these values:

- publishable as written
- publishable with boundary strip
- publishable only as synthetic fixture
- publishable only as research question
- requires demotion
- requires rewrite
- blocked from public surface
- retire or merge

## Minimal checklist template

```text
claim id:
claim text:
publication surface:
maturity level:
source status:
claim status:
privacy status:
evidence basis:
missingness:
allowed interpretation:
blocked interpretation:
revision reason:
demotion trigger:
publication decision:
next validation step:
```

## Example safe claim

Claim text: Mirror Cartographer explores reflective human-AI interaction by turning fragments into reviewable structures with explicit uncertainty.

Labels:

- source status: public repository framing
- claim status: scoped public claim
- privacy status: public-safe
- evidence basis: README-level project description
- missingness: implementation coverage varies by feature
- allowed interpretation: the project is an exploratory reflective interface and research framework
- blocked interpretation: the system is a validated diagnostic, therapeutic, veterinary, legal, financial, or objective truth engine
- publication decision: publishable with boundary strip when used in demos

## Example blocked claim pattern

Blocked pattern: Mirror Cartographer proves what a person, body, animal, relationship, future, or hidden cause means.

Reason blocked:

- converts interpretation into proof
- risks professional-replacement framing
- overstates symbolic resonance
- collapses source boundary
- may invite private reconstruction or dependency

Allowed rewrite pattern:

Mirror Cartographer can organize fragments into hypotheses, questions, maps, and reviewable interpretations that require human judgment and external verification.

## Evaluation criteria

The claim gate works if it blocks these failures:

1. A private-context abstraction becomes a public-identifying clue.
2. A symbolic pattern is presented as factual truth.
3. A repeated motif is presented as causality.
4. A demo implies validated implementation without evidence.
5. A synthetic fixture appears to be real private data.
6. A research note is mistaken for a shipped feature.
7. A careful disclaimer is separated from the claim it limits.
8. A stale claim remains public after source, implementation, or privacy conditions change.

## Implementation plan

1. Add `mind/checklists/public-safe-claim-gate.md` as a reusable checklist.
2. Add claim-gate metadata to future research notes.
3. Backfill recent notes with target backlog lane and publication decision.
4. Require demo pages to display source/evidence/privacy labels.
5. Require README/product updates to include claim-gate review before merge.
6. Create synthetic examples for safe, risky, blocked, demoted, and retired claims.
7. Add a future lint-style script that scans public copy for forbidden claim patterns.

## Missingness

- No reusable checklist file is confirmed yet.
- No automated claim scanner is confirmed.
- No demo-page enforcement is confirmed.
- No repository-wide backfill is confirmed.
- No independent review process is confirmed.

## Privacy boundary

This note intentionally contains no personal, household, health, animal-care, financial, location, relationship, credential, or raw transcript details. Private-context material is used only as architectural substrate. The published finding is limited to generalized product-governance structure.

## Next research question

How should Mirror Cartographer define a **Public Claim Pattern Library** that gives maintainers safe wording, risky wording, blocked wording, rewrite rules, and synthetic examples for each public surface?
