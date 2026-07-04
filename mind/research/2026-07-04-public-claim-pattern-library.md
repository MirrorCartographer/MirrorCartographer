# Public Claim Pattern Library

Date: 2026-07-04
Status: research note
Maturity level: Level 2 — requirement candidate
Privacy status: public-safe abstraction
Source status: derived from private-context architectural patterns, the public-safe research sequence, and the Public-Safe Claim Gate Checklist
Claim status: proposed product-governance requirement, not validated implementation
Revision reason: this note answers the prior research question by converting claim-gate logic into reusable public wording patterns, risky wording patterns, blocked wording patterns, and rewrite rules for public surfaces.

## Core finding

Mirror Cartographer needs a **Public Claim Pattern Library**.

Operating line:

> A public claim library should not only tell maintainers what not to say; it should give them safer language that preserves the boundary without flattening the idea.

## Problem

A checklist can block unsafe claims, but it does not by itself give builders, writers, applicants, reviewers, or interface designers enough language to continue safely.

Mirror Cartographer uses language across multiple surfaces: README, research notes, interface copy, demo captions, diagrams, grant/application language, product descriptions, evaluation reports, and synthetic examples. Each surface can accidentally strengthen a claim by changing tone, visual framing, or audience expectation.

The system therefore needs reusable public claim patterns that preserve:

- source boundary
- evidence boundary
- privacy boundary
- maturity boundary
- interface boundary
- missingness boundary
- demotion path

The goal is not blandness. The goal is disciplined expressive range.

## Non-goals

This library does not expose private source material.

This library does not convert private-context interpretation into public evidence.

This library does not validate health, psychological, veterinary, legal, financial, credential, household, location, relationship, or transcript-level claims.

This library does not claim any feature is implemented unless separately verified in repository code or public release artifacts.

This library does not replace professional, legal, medical, veterinary, financial, crisis, or diagnostic review.

## Pattern classes

Each public claim pattern should be stored with one of five classes.

### 1. Safe pattern

A claim that can usually be published when paired with correct source, evidence, maturity, and privacy labels.

Example:

> Mirror Cartographer explores reflective human-AI interaction by turning fragments into reviewable structures with explicit uncertainty.

Allowed interpretation:

The project is a reflective interface and research framework.

Blocked interpretation:

The project proves hidden causes, diagnoses users, or verifies objective truth.

### 2. Boundary-strip pattern

A claim that can be public, but only when the same surface shows source/evidence/privacy/maturity status.

Example:

> This demo uses synthetic fragments to show how an interpretive map might organize uncertainty.

Required boundary strip:

- Source: synthetic fixture
- Claim: interface demonstration
- Evidence: invented test material
- Privacy: no private transcript or personal data
- Missingness: not a validated real-user outcome

### 3. Research-question pattern

A claim that must remain a question because evidence or implementation is incomplete.

Example:

> How can a reflective interface preserve symbolic richness while preventing resonance from being mistaken for truth?

Allowed interpretation:

The project is investigating a design/governance problem.

Blocked interpretation:

The project has already solved the problem.

### 4. Risky pattern

A claim that may be salvageable, but only after demotion, narrowing, or boundary restoration.

Risky example:

> Mirror Cartographer understands the user through recurring symbols.

Risk:

- implies stable knowledge of a person
- may overstate interpretive accuracy
- may hide source boundary
- may turn recurrence into truth

Safer rewrite:

> Mirror Cartographer can track recurring motifs and present them as reviewable hypotheses rather than settled facts.

### 5. Blocked pattern

A claim that should not appear on public surfaces.

Blocked example:

> Mirror Cartographer proves what a body, animal, relationship, future, symptom, emotion, or hidden cause means.

Reason blocked:

- converts interpretation into proof
- risks professional-replacement framing
- collapses source boundaries
- may invite dependency or unsafe inference
- may expose or reconstruct private-context categories

Safer rewrite:

> Mirror Cartographer can organize fragments into hypotheses, questions, maps, and summaries that require human judgment and external verification.

## Public surface pattern table

| Surface | Safe claim pattern | Required label | Common failure | Rewrite rule |
|---|---|---|---|---|
| README | Project explores reflective human-AI interaction with uncertainty-aware structure. | scope + maturity | sounds like validated product | name it as exploratory unless implementation is verified |
| Landing page | Turn fragments into reviewable maps, questions, and hypotheses. | evidence + missingness | implies diagnosis or truth engine | replace proof words with review words |
| Demo caption | Synthetic example showing interface behavior. | synthetic source | synthetic appears real | explicitly say invented/no private data |
| Diagram | Claim lineage and boundary states are visible. | source + evidence | visual certainty inflates claim | add source/evidence legend |
| Research note | Proposed requirement or research question. | maturity + claim status | note mistaken for shipped feature | state not validated implementation |
| Evaluation report | Test checks whether a boundary is preserved. | fixture + criteria | evaluation implies real-world outcome | distinguish fixture pass from public validity |
| Grant/application | Research framework for reflective AI safety and privacy-boundary design. | claim gate + non-goals | overstated impact or capability | separate ambition from verified capability |
| Product requirement | System should preserve claim labels across modes. | requirement status | requirement sounds implemented | use should/must until code exists |
| Public index | Privacy-safe abstracted method and status pointer. | privacy + source | index reconstructs private lineage | exclude private chronology and raw-source detail |
| Screenshot | Interface state shown with source/evidence strip. | interface boundary | screenshot implies real user data | use synthetic fixtures or visible redaction |

## Preferred verb set

Use verbs that preserve uncertainty and reviewability:

- explores
- organizes
- structures
- tracks
- surfaces
- compares
- labels
- distinguishes
- proposes
- tests
- evaluates
- preserves
- demotes
- retires
- routes
- asks
- frames
- supports review of

## High-risk verb set

Avoid or require strict evidence before using:

- proves
- diagnoses
- treats
- heals
- predicts
- guarantees
- detects the truth of
- knows
- understands the person
- reveals the cause
- replaces professional care
- verifies reality
- solves trauma
- fixes symptoms
- determines intent
- reads hidden meaning

## Allowed noun phrases

These phrases are generally safer when labels are present:

- reflective interface
- interpretive map
- reviewable hypothesis
- source-boundary label
- evidence-status label
- privacy-safe abstraction
- synthetic fixture
- maturity-indexed backlog item
- claim gate
- boundary strip
- public-safe research note
- missingness register
- demotion trigger
- implementation plan
- evaluation criterion

## High-risk noun phrases

These phrases should be blocked or heavily rewritten unless supported by separate verified context:

- diagnostic engine
- truth engine
- therapy replacement
- medical insight system
- veterinary guidance system
- financial advice engine
- legal interpretation engine
- hidden-cause detector
- body-reading system
- destiny map
- objective meaning proof
- trauma solver
- symptom interpreter
- animal-healing system

## Rewrite rules

### Rule 1: Proof to review

Risky:

> The system proves the meaning of recurring patterns.

Safer:

> The system tracks recurring patterns and presents them as reviewable hypotheses.

### Rule 2: Knowledge to source-limited structure

Risky:

> The system knows what the user means.

Safer:

> The system structures available fragments while keeping source limits and uncertainty visible.

### Rule 3: Resonance to fit

Risky:

> If the response resonates, it is true.

Safer:

> Resonance may indicate subjective fit, not factual truth.

### Rule 4: Private context to abstracted method

Risky:

> This feature came from a specific private situation.

Safer:

> This requirement is derived from private-context architectural patterns and published only as an abstracted method.

### Rule 5: Feature to requirement

Risky:

> Mirror Cartographer preserves claim boundaries across every interface.

Safer, unless implementation is verified:

> Mirror Cartographer should preserve claim boundaries across text, interface, export, diagram, dashboard, demo, and research modes.

### Rule 6: Outcome to evaluation target

Risky:

> Mirror Cartographer prevents unsafe interpretation.

Safer:

> Mirror Cartographer needs evaluation criteria that test whether unsafe interpretive claims are blocked, demoted, or relabeled.

### Rule 7: Personal signal to synthetic fixture

Risky:

> The demo uses lived examples.

Safer:

> The demo uses invented fragments designed to test the same structural problem without exposing private data.

## Claim pattern object

Future public claim patterns should use this object shape:

```text
pattern id:
pattern class:
surface:
claim text:
allowed use:
required labels:
source status:
claim status:
privacy status:
evidence basis:
maturity level:
missingness:
blocked interpretation:
risk if misused:
rewrite rule:
demotion trigger:
example safer rewrite:
revision reason:
```

## Minimum pattern set for implementation

Create pattern entries for at least these areas:

1. Project identity
2. Reflective mapping
3. Symbolic language
4. Synthetic fixtures
5. Public demos
6. Research notes
7. Product requirements
8. Evaluation claims
9. Privacy-safe indexing
10. Missingness and demotion
11. External verification
12. Non-replacement of professional care
13. Mode transitions
14. Interface boundary strips
15. Backlog maturity claims

## Evaluation criteria

The Public Claim Pattern Library works if it enables maintainers to:

1. Convert a risky claim into a safer claim without losing the core idea.
2. Identify when a claim must become a research question rather than a feature statement.
3. Keep synthetic fixtures visibly separate from private-source examples.
4. Prevent visual/interface surfaces from increasing claim certainty.
5. Prevent resonance language from becoming truth language.
6. Preserve public expressiveness while blocking professional-replacement framing.
7. Attach source, claim, privacy, maturity, missingness, and revision labels to every reusable claim.
8. Detect when a claim should be demoted, retired, or merged.

## Implementation plan

1. Add `mind/patterns/public-claim-pattern-library.md` as a reusable pattern file.
2. Add pattern ids for safe, boundary-strip, research-question, risky, and blocked claims.
3. Link each future public research note to at least one pattern id.
4. Backfill recent research notes with public-claim pattern references.
5. Add a small synthetic fixture set containing safe, risky, blocked, and rewritten claim examples.
6. Add a future lint-style script that flags high-risk verbs and noun phrases in README, demo, product, and research copy.
7. Require public demos to show whether each visible statement is evidence, synthetic fixture, requirement, research question, or implemented behavior.
8. Add a review step before public-facing copy is merged.

## Missingness

- No reusable `mind/patterns` library is confirmed yet.
- No automated public-claim linter is confirmed.
- No repository-wide claim-pattern backfill is confirmed.
- No public demo enforcement is confirmed.
- No independent reviewer workflow is confirmed.
- No verified implementation claim is made in this note.

## Privacy boundary

This note intentionally contains no personal, household, health, animal-care, financial, location, relationship, credential, or raw transcript details. Private-context material is used only as architecture substrate. The published finding is limited to generalized language governance, public-claim safety, and implementation planning.

## Next research question

How should Mirror Cartographer define a **Claim Pattern Linter Specification** that can scan public copy for high-risk verbs, high-risk noun phrases, missing boundary labels, synthetic/private ambiguity, maturity inflation, and professional-replacement framing?
