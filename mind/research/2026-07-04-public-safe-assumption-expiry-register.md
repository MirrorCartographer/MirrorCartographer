# Public-Safe Assumption Expiry Register

## Core finding
Mirror Cartographer needs a **Public-Safe Assumption Expiry Register**: a lightweight governance artifact that records when a public-safe abstraction depends on an assumption that may become stale, invalid, or too weak to support implementation.

## Operating line
A public-safe abstraction should not persist indefinitely merely because it contains no private details; it should carry an expiry condition for every assumption that could change its claim strength, implementation priority, or safety boundary.

## Source status
- Source class: private-context-informed architecture synthesis plus repository-state review.
- Public source exposure: none.
- Raw source material included: no.
- Repository signal used: recent MC research commits show an active sequence of public-safe governance notes, including traceability, memory ingestion, source rehydration, contradiction reconciliation, claim gates, maturity indexing, and research delta selection.

## Claim status
- Claim type: product requirement / governance method.
- Strength: design recommendation.
- Evidence basis: recurring pattern in MC governance artifacts: public artifacts need durable metadata about source class, claim class, privacy class, missingness, revision reason, and implementation maturity.
- Not claimed: that this mechanism is already implemented in code, that all existing files have expiry metadata, or that the register is sufficient for privacy/security compliance by itself.

## Privacy status
- Public-safe: yes.
- Private details exposed: none.
- Sensitive domains excluded: personal, household, health, animal-care, financial, location, relationship, credential, and transcript-specific details.
- Boundary rule: private context may motivate the need for the register, but it must not appear as examples, fixtures, labels, evidence, screenshots, or demos.

## Missingness
- Missing implementation inventory: no full repository scan was available in this run.
- Missing enforcement layer: no CI test currently confirmed for assumption expiry metadata.
- Missing schema decision: expiry may be represented in frontmatter, a central ledger, or both.
- Missing owner workflow: no maintainer process has been defined for renewing, demoting, or retiring assumptions.

## Problem
MC public-safe research notes can become structurally outdated even when they remain privacy-safe. A note may be safe to publish but still depend on assumptions such as:

- a feature does not exist yet;
- a claim is still design-level rather than implemented;
- a source class is unavailable or only partially reviewed;
- a safety boundary is stable only under the current interface;
- an evaluation criterion has not yet been tested against fixtures;
- a missingness label is temporary rather than permanent.

Without expiry tracking, old abstractions can appear more mature than they are.

## Requirement
Every public-safe research note that introduces a method, product requirement, evaluation criterion, or implementation plan should include an assumption-expiry section.

Minimum fields:

1. `assumption_id`
2. `assumption_text`
3. `depends_on`
4. `expiry_condition`
5. `review_trigger`
6. `allowed_action_before_review`
7. `required_action_after_expiry`
8. `privacy_boundary_if_expired`

## Claim-state behavior
An expired assumption does not automatically make a note unsafe. It changes what the note is allowed to support.

Allowed demotions:

- implemented claim -> design recommendation;
- design recommendation -> research question;
- research question -> archived hypothesis;
- public artifact candidate -> internal-only planning note;
- test criterion -> fixture-needed placeholder;
- evidence note -> source-boundary note.

## Example public-safe register row

| Field | Value |
|---|---|
| assumption_id | AER-001 |
| assumption_text | Current source-boundary labels are sufficient for public-safe publication decisions. |
| depends_on | Existing claim-gate, source-rehydration, memory-ingestion, and traceability notes. |
| expiry_condition | Any new source class, demo format, export format, or automation path is added. |
| review_trigger | New artifact pipeline, new connector, new public demo, or new fixture class. |
| allowed_action_before_review | Use as design guidance only. |
| required_action_after_expiry | Reclassify against current source and privacy boundaries before implementation. |
| privacy_boundary_if_expired | Do not use private-derived examples to repair the assumption publicly. |

## Evaluation criteria
A note passes this governance layer if a reviewer can answer:

- What assumption would make this note weaker if it changed?
- What event forces review?
- What claim strength is allowed before review?
- What claim strength remains after expiry?
- What private-context rehydration path is explicitly forbidden?
- What implementation path is blocked until renewal?

## Implementation plan
1. Add an `assumptions` section to future public-safe research notes.
2. Backfill the latest governance notes first, not the entire repository at once.
3. Create a machine-readable register once field names stabilize.
4. Add a fixture that intentionally uses a stale assumption and verify demotion behavior.
5. Add a CI or scriptable check that flags notes with product requirements but no expiry condition.

## Revision reason
This note extends the prior public-safe governance chain from static labels toward time-aware validity. The meaningful revision is that safety and usefulness are separated: an artifact can remain privacy-safe while its assumptions become too stale to support implementation.
