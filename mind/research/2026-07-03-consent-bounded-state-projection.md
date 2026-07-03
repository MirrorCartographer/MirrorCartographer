# Consent-Bounded State Projection Spec

Date: 2026-07-03
Status: public-safe research note

## Core finding

Mirror Cartographer needs a Consent-Bounded State Projection Spec.

Operating line: **A system may preserve continuity, but every projection of that continuity must prove what permission boundary it passed through.**

## Source status

- Source classes reviewed: saved-context summaries, file-library architecture documents, public GitHub repository metadata, private implementation context at repository-boundary level only.
- GitHub source boundary: public mind repository is suitable for abstract method notes; private UI repository is treated only as implementation-context existence, not as publishable source content.
- File-library source boundary: project-level architecture documents support the need for state, modes, privacy, consent, accessibility, operational variables, evidence gates, and source-specific proof standards.
- Private-context boundary: private material was used only to infer architectural pressure; no personal, household, health, animal-care, financial, relationship, location, credential, or transcript detail is included here.

## Claim status

- Claim type: product architecture and governance requirement.
- Confidence: medium-high as a design requirement; not an empirical claim about user outcomes.
- Evidence basis: recurring architecture pattern across MC materials: symbolic state needs persistence, but persistence creates governance risk unless output, memory, publication, and action all pass explicit boundary checks.
- Non-claim: this note does not claim MC is therapeutic, diagnostic, clinically validated, or safe for all users.

## Privacy status

- Public-safe abstraction: yes.
- Contains raw transcript content: no.
- Contains private identifiers: no.
- Contains personal/household/health/animal-care/financial/location/relationship/credential details: no.
- Re-identification risk: low, because the note describes a generalizable product-governance mechanism rather than private source material.

## Missingness

- No live product audit was performed in this run.
- No exhaustive repository tree was available from indexed code search; the public repository was identified through installed repository metadata and this file was added directly.
- No user-study evidence exists in this note.
- The exact implementation surface for state projection remains unspecified until a schema and route-level policy are created.

## Revision reason

Previous notes established evidence routing, missingness, boundary-class testing, public release gates, redaction, context gradients, and style firewalls. The remaining gap is the moment MC converts retained state into a new use: reflection, export, visualization, memory update, public artifact, decision support, or external handoff. That conversion needs an explicit projection layer.

## Requirement

Before MC uses stored or inferred state, the system must create a projection record with these fields:

1. `source_state_class` — raw input, user-confirmed state, derived symbolic state, generated interpretation, external source, implementation note, or synthetic example.
2. `permission_scope` — private-only, session-only, persistent-user-profile, exportable-to-user, shareable-with-selected-recipient, public-safe, or blocked.
3. `projection_target` — reflection card, journal artifact, interface visualization, memory update, research note, product requirement, external handoff, or public artifact.
4. `detail_budget` — none, abstract pattern, category-level, paraphrased, quoted, structured data, or full detail.
5. `claim_ceiling` — aesthetic, reflective, user-confirmed, source-backed, externally testable, externally verified, or blocked.
6. `expiry_or_review_rule` — one-time, session-limited, user-revocable, time-reviewed, source-refresh-required, or permanent until revoked.
7. `missingness_flags` — absent source, stale source, partial context, unverified interpretation, ambiguous consent, implementation unknown, or test not run.
8. `allowed_destinations` — UI-only, local storage, private repository, public repository, downloadable export, third-party handoff, or no destination.

## Evaluation criteria

A projection is valid only if:

- The destination is allowed by the permission scope.
- The detail budget is no more specific than the privacy status allows.
- The claim ceiling is no higher than the evidence tier.
- Missingness flags are preserved in the returned artifact or internal ledger.
- Public artifacts are reversible to boundary class, not to private source.
- A user-facing output can be returned without becoming publishable by default.

## Implementation plan

1. Add a `ProjectionPolicy` type to the MC schema.
2. Require every memory read, export, and publication route to call `createProjectionRecord()` before generating output.
3. Add hard blocks for private-detail classes when the projection target is public.
4. Add a visible label set for user-facing exports: source status, claim status, privacy status, missingness, and revision reason.
5. Add regression tests with synthetic examples only.
6. Add a release checklist item: "Does this artifact reveal a private source, or only the boundary class that shaped it?"

## Research questions

- How should MC represent consent changes over time without corrupting historical state?
- What should happen when a user revokes persistence after public-safe abstractions have already been generated?
- Can projection records become a privacy-preserving audit trail without storing sensitive details themselves?
- Which projection targets should be impossible without explicit user confirmation?

## Public-safe index tags

- consent-boundary
- state-projection
- privacy-preserving-continuity
- evidence-ceiling
- source-boundary
- export-governance
- public-safe-architecture
