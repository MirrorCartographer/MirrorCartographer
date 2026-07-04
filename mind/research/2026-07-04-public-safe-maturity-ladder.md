# Public-Safe Maturity Ladder

Date: 2026-07-04
Status: research note
Privacy status: public-safe abstraction
Source status: derived from private-context architectural patterns, repository README boundaries, and recent public-safe research-note sequence
Claim status: proposed method, not validated implementation
Revision reason: this note adds a maturity model for deciding when a public-safe finding is ready to become a requirement, test, interface element, or public artifact. Recent notes define many boundary instruments; this note defines how to advance them without overstating readiness.

## Core finding

Mirror Cartographer needs a **Public-Safe Maturity Ladder**.

Operating line:

> A finding should not become a feature merely because it is safe to say; it becomes a feature when its evidence, boundary, test, and interface obligations mature together.

## Problem

The research loop is producing public-safe abstractions at a high rate. That is useful, but it creates a second-order risk: safe abstractions can accumulate faster than the system can determine which ones are:

- only language,
- valid governance concepts,
- implementable requirements,
- testable behaviors,
- interface commitments,
- public claims,
- or deprecated/merged ideas.

Without a maturity ladder, the repository can appear more complete than the product actually is. A safe note can be mistaken for a finished system capability.

## Non-goals

This ladder does not expose private source material.

This ladder does not rank the emotional, personal, or symbolic importance of any private source.

This ladder does not claim that a concept is implemented merely because it has a clear name.

This ladder does not convert resonance, repetition, or user preference into factual proof.

## Maturity levels

### Level 0 — Raw private signal

Definition: source material exists but contains private, identifying, household, health, animal-care, financial, location, relationship, credential, or transcript-level detail.

Public handling: do not publish.

Allowed public output: none, unless transformed into a non-identifying abstraction.

Required labels:

- source status: private/raw
- claim status: not public-claimable
- privacy status: restricted
- missingness: public abstraction missing
- revision reason: extraction blocked or pending abstraction

### Level 1 — Public-safe abstraction

Definition: a private pattern has been abstracted into a general method, requirement, research question, evaluation criterion, or boundary rule.

Public handling: publishable as a research note if no private reconstruction risk is introduced.

Allowed public output:

- method name
- operating line
- generalized risk
- source-boundary note
- implementation question

Required labels:

- source status: derived/abstracted
- claim status: proposed concept
- privacy status: public-safe abstraction
- missingness: untested
- revision reason: abstraction created from private-context architecture

### Level 2 — Requirement candidate

Definition: the abstraction has enough operational shape to become a product requirement.

Public handling: publish as requirement candidate, not as completed feature.

Required criteria:

- actor identified without private details
- triggering condition identified
- expected system behavior described
- failure mode described
- boundary tags specified
- proof threshold specified

Allowed public output:

- product requirement
- acceptance criteria
- non-goals
- data minimization rule

Required labels:

- source status: abstracted + repository-aligned
- claim status: requirement candidate
- privacy status: public-safe
- missingness: implementation owner, test fixture, or UI path may be missing
- revision reason: promoted from concept to requirement candidate

### Level 3 — Testable specification

Definition: the requirement can be tested using synthetic or public-safe fixtures.

Public handling: publish as specification or test plan.

Required criteria:

- synthetic fixture available
- expected pass/fail behavior defined
- false-positive risk documented
- false-negative risk documented
- evidence demotion behavior defined
- no private source required for test execution

Allowed public output:

- fixture schema
- test cases
- scoring rubric
- red-team cases

Required labels:

- source status: synthetic/public-safe
- claim status: testable specification
- privacy status: public-safe
- missingness: implementation may be incomplete
- revision reason: promoted because synthetic test path exists

### Level 4 — Implemented behavior

Definition: the feature exists in code, documentation, or workflow and can be inspected.

Public handling: publish only if the behavior can be demonstrated without private data.

Required criteria:

- implementation path exists
- user-facing or maintainer-facing behavior is documented
- public-safe demo or fixture exists
- known failure modes are documented
- evidence/claim/privacy labels survive the interface path

Allowed public output:

- implementation plan status
- demo explanation
- interface note
- limitation note

Required labels:

- source status: implemented from public-safe spec
- claim status: implemented behavior, not universal proof
- privacy status: public-safe if demo uses synthetic or consented public material
- missingness: unresolved edge cases
- revision reason: promoted because behavior exists

### Level 5 — Public claim

Definition: the implemented behavior has enough evidence to be described publicly without implying unverified capabilities.

Public handling: publish with exact scope and exclusions.

Required criteria:

- scope statement
- evidence basis
- excluded claims
- demo boundary strip
- revision history
- public/private source boundary
- independent review target or next validation step

Allowed public output:

- marketing-safe claim
- README claim
- demo claim
- grant/application claim
- product page claim

Required labels:

- source status: public-safe evidence + implementation
- claim status: scoped public claim
- privacy status: public-safe
- missingness: remaining validation limits
- revision reason: promoted because public claim threshold was met

## Required demotion paths

A finding must move backward when evidence or permission weakens.

Demotion triggers:

- source provenance becomes unclear
- private reconstruction risk is discovered
- implementation does not preserve labels
- test cases fail
- interface changes strengthen the claim beyond evidence
- abstraction is discovered to depend on private context too heavily
- duplicate note supersedes it
- user correction invalidates the framing

Demotion labels:

- revision reason: demoted due to [specific cause]
- claim status: reduced to prior safe level
- missingness: state exact missing proof or boundary

## Minimal repository schema

Every public-safe research note should include:

- title
- date
- maturity level
- source status
- claim status
- privacy status
- missingness
- revision reason
- upstream dependencies
- downstream candidates
- blocked claims
- next validation step

## Evaluation criteria

A mature public-safe finding should answer:

1. What can be said publicly?
2. What cannot be said publicly?
3. What evidence supports the public statement?
4. What private source function was abstracted away?
5. What test would fail if the concept were wrong?
6. What implementation path preserves the same boundary?
7. What revision would demote the claim?

## Implementation plan

1. Add `maturity_level` to future research notes.
2. Backfill recent research notes with maturity levels where feasible.
3. Create a public-safe index grouped by maturity level rather than only by date.
4. Add a promotion checklist before any note becomes README, demo, UI, or product language.
5. Add a demotion checklist for stale, duplicate, overbroad, or privacy-risky findings.

## Example classification

- Consent boundary ideas begin at Level 1.
- A consent-aware export rule becomes Level 2 when actor, trigger, behavior, and failure mode are defined.
- It becomes Level 3 when tested on synthetic export fixtures.
- It becomes Level 4 when implemented in an export flow.
- It becomes Level 5 only when public language describes the exact implemented scope without implying private-source access or universal correctness.

## Missingness

- No automated repository index currently enforces maturity levels.
- No fixture runner is confirmed for validating maturity promotion.
- Existing research notes may need backfill labels.
- Public-facing README claims may need cross-checking against this ladder.

## Privacy boundary

This note intentionally contains no personal, household, health, animal-care, financial, location, relationship, credential, or raw transcript details. It uses private-context material only as architectural substrate and publishes only a generalized governance method.

## Next research question

How should Mirror Cartographer generate a **Maturity-Indexed Public-Safe Backlog** that separates concepts, requirements, tests, implemented behaviors, and public claims without requiring private source disclosure?
