# Mirror Cartographer Research Note — Revision Reason Ledger

Date: 2026-07-01
Status: public-safe architecture note
Repository lane: mind / research

## Core finding

Mirror Cartographer needs a **Revision Reason Ledger**.

MC already depends on continuity, provenance, source boundaries, claim typing, missingness, and privacy-safe abstraction. The next structural requirement is not only to revise outputs, memory objects, public claims, evaluation criteria, or product requirements, but to preserve the reason each revision happened.

Operating line:

> MC should not merely change its map. It should say why the map changed.

## Public-safe source boundary

### Source status

- Public repository context: available at the repository level.
- Private chat / saved-context material: used only as architectural pressure, not as public evidence.
- Raw transcripts: excluded.
- Personal, household, health, animal-care, financial, location, relationship, credential, and identifying details: excluded.

### Privacy status

Public-safe. This note contains only abstracted system architecture, method requirements, evaluation criteria, and implementation planning. It does not expose private examples, raw user language, or personal factual claims.

### Claim status

- Claim type: product architecture requirement.
- Evidence type: design synthesis from recurring MC boundary requirements.
- Strength: provisional; implementation and evaluation required.
- Not a clinical, legal, financial, identity, or factual claim about any person.

### Missingness

- No exhaustive audit of all repository files was completed in this pass.
- No formal privacy test suite was executed.
- No user-facing UI implementation was added.
- No empirical study confirms that revision ledgers improve user trust, safety, or interpretability.

### Revision reason

This finding was added because prior MC architecture notes establish custody, provenance, missingness, evidence lanes, abstraction, and boundary debt. Those controls require a durable reason field so future changes can be distinguished as correction, privacy reduction, source upgrade, source downgrade, scope narrowing, claim reclassification, implementation discovery, user preference change, safety escalation, or retirement.

## Problem

A system that supports symbolic reflection, durable continuity, public artifacts, and research synthesis will revise itself frequently. Without explicit revision reasons, a later reader cannot tell whether a change was:

- a factual correction,
- a privacy hardening step,
- a source-boundary downgrade,
- a product-design refinement,
- a safety constraint,
- a missingness disclosure,
- a claim-status reclassification,
- an implementation-driven change,
- or a stylistic rewrite.

That ambiguity creates authority drift. A cleaned-up artifact may look more certain than the underlying claim deserves. A removed detail may look like disagreement when it was only privacy protection. A stronger design statement may look evidence-backed when it is actually a requirement proposal.

## Requirement

Every durable MC object should be able to carry a revision record.

Minimum fields:

- `revision_id`
- `object_id`
- `previous_status`
- `new_status`
- `revision_reason_type`
- `revision_reason_summary`
- `source_boundary_effect`
- `claim_status_effect`
- `privacy_status_effect`
- `missingness_effect`
- `reviewer_or_agent`
- `timestamp`
- `next_review_trigger`

## Revision reason types

Suggested controlled vocabulary:

1. `correction`
2. `privacy_hardening`
3. `source_upgrade`
4. `source_downgrade`
5. `claim_reclassification`
6. `scope_narrowing`
7. `scope_expansion`
8. `missingness_disclosure`
9. `implementation_discovery`
10. `evaluation_result`
11. `safety_escalation`
12. `safety_deescalation`
13. `accessibility_revision`
14. `user_preference_revision`
15. `public_language_revision`
16. `retirement`

## Evaluation criteria

A revision ledger entry passes if:

- A reader can tell what changed.
- A reader can tell why it changed.
- A reader can tell whether the claim became stronger, weaker, narrower, broader, safer, more private, or more public.
- A reader can tell whether private material influenced the change without seeing that private material.
- A future system can prevent old authority labels from silently carrying into a revised artifact.

A revision ledger entry fails if:

- It hides a source downgrade.
- It makes a privacy deletion look like a factual contradiction.
- It makes a design preference look like evidence.
- It preserves a previous authority label after the claim category changed.
- It exposes private source details in order to explain the revision.

## Implementation plan

1. Add a `revision_reason` block to MC durable objects.
2. Require a reason type whenever an object changes source status, claim status, privacy status, or missingness status.
3. Treat public export as a revision event, not a copy action.
4. Treat privacy hardening as a first-class reason, not as an unexplained deletion.
5. Add a pre-publication check: no public object may ship with `revision_reason_type: unknown` if it was derived from private architecture context.

## Research questions

- Does explicit revision reasoning reduce authority drift in AI-generated reflective systems?
- Which revision reason types are necessary for symbolic-reflective products versus ordinary knowledge-base products?
- How should MC show revision history without overwhelming the user?
- Which revision reasons should be visible to public readers, private users, maintainers, or evaluators?

## Privacy-safe index terms

- revision reason ledger
- authority drift
- source boundary effect
- claim-status effect
- privacy-status effect
- missingness effect
- public export revision
- privacy hardening
- claim reclassification

## Summary

The Revision Reason Ledger turns change into accountable custody. It lets MC revise without pretending the new map appeared from nowhere, and without leaking the private room that shaped the architecture.
