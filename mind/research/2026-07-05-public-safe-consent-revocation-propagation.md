# Public-Safe Consent Revocation Propagation Protocol

Date: 2026-07-05
Status: research note
Privacy status: public-safe abstraction only
Revision reason: follows the prior redaction evidence binder by defining how consent withdrawal must propagate through downstream public-safe artifacts.

## Core finding

Mirror Cartographer needs a consent revocation propagation protocol.

A consent boundary is incomplete if it only governs the first storage decision. Once a private-context-derived abstraction has been converted into public-safe notes, requirements, fixtures, indexes, demos, evaluations, or research questions, the system needs a way to propagate consent changes without exposing the private reason for the change.

Operating line:

> A consent revocation should not require public explanation to be enforceable; the public artifact only needs to know which derived claim, fixture, index, or dependency must be retired, downgraded, or regenerated.

## Source status

- Source class: private architectural context, prior public-safe research notes, and repository-oriented implementation memory.
- Source boundary: private material was used only to infer system requirements around consent, persistence, abstraction, redaction, and downstream reuse.
- Public extraction level: abstract method, evaluation criteria, implementation plan, and missingness register.
- Excluded material: personal identity details, household details, health details, animal-care details, financial details, location details, relationship details, credentials, raw transcripts, exact private examples, and sensitive source topology.

## Claim status

- Claim type: product architecture requirement.
- Claim strength: design requirement, not empirical result.
- Evidence state: supported by recurring MC architecture patterns around persistence, consent, redaction, public-safe publication, and traceability.
- Verification needed: repository scan for public artifacts that lack revocation metadata; implementation of revocation-aware dependency tracking; test fixture proving downstream retirement works.

## Privacy status

Public-safe because this note contains:

- no raw transcript excerpts;
- no personal facts;
- no household, animal-care, health, financial, location, relationship, or credential details;
- no exact symbolic motifs from private context;
- no traceable event sequence;
- no private source identifiers beyond broad source classes.

Residual risk:

- low, if used as a generic architecture note;
- medium, if combined with raw private exports or exact historical artifacts without a boundary layer;
- high, if future implementation logs include private revocation reasons or exact source chains.

## Missingness

The current public-safe knowledge base still needs:

1. a revocation metadata schema;
2. a downstream dependency graph that can locate derived artifacts;
3. a status vocabulary for artifacts affected by revocation;
4. a regeneration path for artifacts that can be saved by re-abstraction;
5. a deletion/retirement path for artifacts that cannot be safely regenerated;
6. an audit record that proves the action occurred without revealing the private reason.

## Required labels

Every public-safe artifact that may depend on private-context abstraction should carry these fields:

- `source_status`: public, private-derived, mixed, synthetic, external, unknown;
- `claim_status`: draft, requirement, hypothesis, evaluation criterion, implementation plan, retired, superseded;
- `privacy_status`: public-safe, public-safe-after-redaction, internal-only, quarantined, retired;
- `revocation_status`: active, pending-review, revoked-upstream, regenerated, retired;
- `dependency_status`: none, direct-private-derived, indirect-private-derived, synthetic-independent, unknown;
- `revision_reason`: initial, clarified, downgraded, regenerated, retired, superseded, source-boundary-change.

## Propagation model

### 1. Upstream event

A revocation event should be represented internally as a private control signal, not as public narrative.

Public-safe representation:

- `revocation_event_id`: opaque identifier;
- `scope`: artifact, source-class, claim-class, symbol-class, fixture-family, index-family, or dependency-family;
- `required_action`: review, regenerate, retire, downgrade, quarantine;
- `public_reason`: consent boundary changed;
- `private_reason`: not stored in public artifact.

### 2. Dependency traversal

The system should find every artifact that depends on the revoked source or source class.

Dependency classes:

- direct abstraction from private context;
- synthesized from multiple public-safe notes that include private-derived dependencies;
- generated fixture or demo inspired by private topology;
- index entry pointing toward private-derived structure;
- evaluation criterion derived from private-context failure modes;
- implementation plan based on private-source usage patterns.

### 3. Action decision

For each affected artifact:

- retire if the core concept cannot stand without the revoked source;
- regenerate if the concept can be reconstructed from public or synthetic sources;
- downgrade if the artifact remains safe but its claim strength depended on revoked context;
- quarantine if safety cannot be determined;
- leave active only if no dependency exists.

### 4. Public audit trail

The public artifact should record only the boundary action:

- date;
- affected artifact path;
- old status;
- new status;
- action taken;
- public reason: consent boundary changed;
- reviewer or tool class;
- whether regeneration occurred.

It should not record:

- who revoked;
- why they revoked;
- what private detail caused the revocation;
- exact source transcript location;
- any personal or sensitive category.

## Evaluation criteria

A correct implementation should pass these checks:

1. Revocation does not require publishing a private explanation.
2. Every private-derived artifact can be located through dependency metadata.
3. A revoked dependency cannot silently remain active.
4. Regenerated artifacts lose private topology, not just private labels.
5. Public indexes update when dependent artifacts are retired or downgraded.
6. Evaluation fixtures are rebuilt from synthetic-independent scenarios when needed.
7. Claim strength is downgraded when supporting source status changes.
8. Audit logs prove action without exposing sensitive context.
9. Revocation applies forward to future synthesis, not only backward to existing files.
10. Quarantine is preferred over forced publication when dependency uncertainty remains.

## Implementation plan

1. Add front matter to research notes with source, claim, privacy, dependency, and revocation statuses.
2. Create `mind/indexes/public-safe-artifact-index.md` listing public-safe artifacts and dependency classes.
3. Create `mind/indexes/revocation-action-log.md` with only public-safe audit fields.
4. Add a lint rule or checklist that blocks new public-safe notes lacking revocation metadata.
5. Add a regeneration template for converting private-derived concepts into synthetic-independent fixtures.
6. Add a retirement template for public artifacts that should no longer be used.
7. Add a synthesis guard: any future note must check whether it depends on retired or quarantined artifacts.

## Research questions

- How should MC distinguish consent revocation from factual correction, safety downgrade, and public-claim expiry?
- What is the minimum dependency metadata needed to propagate revocation without storing private source paths?
- Can synthetic-independent fixtures replace private-derived examples without losing evaluability?
- What should happen when a public-safe note is safe alone but unsafe when combined with other notes after revocation?
- How should a model refuse to reuse revoked abstractions when they remain semantically available in conversation memory?

## Product requirements

- The user must be able to revoke persistence without negotiating the reason.
- The system must separate private revocation cause from public revocation action.
- Public artifacts must remain auditable without becoming revealing.
- Derived outputs must carry enough dependency metadata to be retired or regenerated.
- Future synthesis must treat revoked artifacts as unavailable unless regenerated.

## Public-safe index entry

Title: Public-Safe Consent Revocation Propagation Protocol
Type: method / product requirement / evaluation criteria
Claim status: design requirement
Privacy status: public-safe abstraction
Dependency status: private-derived architecture, no private facts retained
Missingness: needs schema, index, action log, lint rule, and regeneration template
Next research target: revoked-abstraction reuse prevention in AI memory and synthesis pipelines
