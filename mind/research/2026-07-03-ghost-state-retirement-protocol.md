# Ghost-State Retirement Protocol

## Core finding

Mirror Cartographer needs a **Ghost-State Retirement Protocol**.

> A state should not keep steering the system after its source, permission, proof status, or implementation path has expired.

## Public-safe abstract

Mirror Cartographer uses continuity as a design asset: symbols, reflections, modes, consent decisions, source notes, and implementation ideas can persist across sessions. That persistence creates value, but it also creates ghost risk: a prior fragment may continue influencing product decisions after its source boundary is lost, its permission is unclear, its claim status has changed, or its implementation no longer exists.

This protocol defines how MC should identify, label, quarantine, revise, retire, or revalidate stale continuity objects before they become hidden architecture.

## Source status

- **Private-context informed:** yes, used only to understand recurring architecture needs.
- **File-library grounded:** yes, abstracted from MC materials describing recursive symbolic flow, session memory, consent/persistence choices, exportable artifacts, proof lanes, evidence gates, failure ledgers, and ghost/gremlin distinctions.
- **GitHub grounded:** limited. Repository access was available, but code search did not surface prior `mind/research` files during this run.
- **External web grounded:** no. This is an internal product-governance finding, not a time-sensitive public factual claim.

## Claim status

- **Claim type:** product-governance requirement.
- **Evidence level:** architecture synthesis from available MC source materials.
- **Not a claim of:** clinical effectiveness, psychological diagnosis, AI consciousness, safety certification, or complete archive coverage.

## Privacy status

- **Public-safe:** yes.
- **Redaction applied:** all personal, household, health, animal-care, financial, location, relationship, credential, and raw transcript details excluded.
- **Residual risk:** low-to-medium if combined with many other public architecture notes; should be routed through the Composite Reconstruction Risk Ledger before external publication.

## Missingness

- Full raw source archive was not available in this run.
- GitHub code search did not return the prior research ledger entries by query.
- No live runtime audit was performed.
- No user study, telemetry set, or production incident log was available.

## Revision reason

Prior MC research entries established gates for source boundaries, claim surfaces, consent-bounded projection, visual grammar, public-safe lineage, and composite reconstruction risk. This entry adds a lifecycle rule for continuity fragments that should no longer steer the system without revalidation.

## Product requirement

Every persisted MC object should carry a retirement field set:

1. `source_status` — known, inferred, generated, imported, unavailable, or mixed.
2. `permission_status` — private, session-only, user-returnable, public-safe, public-review-required, or unknown.
3. `claim_status` — observation, interpretation, product requirement, hypothesis, design metaphor, external fact, or unsupported.
4. `implementation_status` — built, drafted, planned, blocked, deprecated, removed, or unknown.
5. `last_validated_at` — timestamp or null.
6. `staleness_trigger` — source loss, permission change, contradiction, new evidence, implementation drift, privacy risk, or manual review.
7. `retirement_action` — keep, revise, quarantine, merge, archive, delete, or revalidate.
8. `revision_reason` — concise note explaining why the state changed.

## Evaluation criteria

A ghost-state retirement pass succeeds when:

- No public artifact depends on an unlabeled private or unknown-permission source.
- No generated interpretation is presented as discovered evidence.
- No deprecated implementation path is still described as active.
- No missing source is silently treated as available.
- Every retired or revised state has a meaningful revision reason.
- Every quarantined state has a next review condition.

## Implementation plan

1. Add retirement fields to the MC source/index schema.
2. Build a review command that lists objects with unknown source, unknown permission, stale validation date, or deprecated implementation status.
3. Route high-risk objects through the public artifact release gate before export.
4. Route composite fragments through reconstruction-risk review before aggregation.
5. Log every revision reason in a public-safe changelog when no private content is exposed.

## Research questions

- What is the smallest metadata schema that prevents ghost influence without making the system too heavy to use?
- How should MC distinguish a valuable unresolved fragment from a fragment that should be retired?
- When a symbolic pattern repeats across sessions, what evidence allows it to become a product requirement rather than only an interpretation?
- How should user-facing continuity remain emotionally coherent while still exposing staleness and uncertainty?

## Public index tags

`continuity-governance`, `ghost-state`, `source-boundary`, `permission-boundary`, `claim-status`, `staleness`, `revision-ledger`, `public-safe`
