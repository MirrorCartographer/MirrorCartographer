# Claim Lifecycle Ledger

## Core finding

Mirror Cartographer needs a Claim Lifecycle Ledger: a public-safe method for tracking how a reflection-system statement changes status over time without exposing the private material that first motivated it.

Operating line: **A claim should not become durable knowledge unless its lifecycle can be inspected without revealing its private origin.**

## Source status

- GitHub surface checked: repository discovery found a public `MirrorCartographer/MirrorCartographer` repository and a private `mirror-cartographer-ui` repository.
- Private-context use: used only as architectural orientation for the kinds of boundary problems the system repeatedly faces.
- Public artifact source: this note is derived as an abstract product-method requirement, not as a transcript summary.
- External source status: no external empirical source is asserted here; this is an implementation and governance requirement for the Mirror Cartographer system.

## Claim status

- Status: design requirement.
- Confidence: medium-high as a systems requirement; untested as implementation.
- Evidence basis: repeated architecture need for source boundaries, claim status, missingness labels, private-to-public derivation, and publication safety.
- Not a claim that any user, household, health, animal-care, financial, location, relationship, credential, or raw transcript detail is true.

## Privacy status

- Public-safe: yes.
- Contains personal details: no.
- Contains raw transcript details: no.
- Contains health, animal-care, financial, location, relationship, credential, or household details: no.
- Derivation rule: preserve the method, discard the private payload.

## Missingness

- No repository file tree was exhaustively enumerated in this run.
- No automated static scan confirmed whether similar lifecycle logic already exists in code.
- No formal schema, database migration, or UI component has been implemented in this note.
- No external privacy, safety, or records-management standard has been mapped yet.

## Revision reason

Prior MC notes define boundaries around consent, origin, publication linting, runtime modes, missingness, and evidence envelopes. The missing connective layer is a lifecycle system that records state transitions after a claim is created: draft, inferred, source-bound, consent-cleared, evaluated, revised, deprecated, superseded, or withdrawn.

## Product requirement

Every MC claim that appears in a durable artifact should carry a lifecycle record with at least:

1. `claim_id` — stable identifier.
2. `claim_text_public` — public-safe claim wording.
3. `origin_class` — received, inferred, designed, tested, imagined, imported, or mixed.
4. `source_boundary` — private-context-derived, public-source-derived, user-approved-public, implementation-derived, or unknown.
5. `claim_status` — draft, hypothesis, requirement, tested finding, deprecated, superseded, withdrawn.
6. `privacy_status` — public-safe, internal-only, consent-required, redacted, unsafe-to-publish.
7. `missingness_status` — absent, unavailable, unsearched, ambiguous, unsupported, blocked, stale, or not-applicable.
8. `evidence_status` — none, anecdotal, design-derived, source-bound, test-backed, externally verified.
9. `revision_reason` — why the claim changed.
10. `next_review_trigger` — condition that requires review.

## Evaluation criteria

A Claim Lifecycle Ledger passes if:

- A reader can understand why a public claim exists without seeing private material.
- A claim can be revised without rewriting history.
- Deprecated claims remain traceable but clearly marked as non-current.
- Private-context influence is visible only as a boundary label, not as content disclosure.
- Claims can be filtered by evidence strength, audience, consent layer, and publication status.
- The system can refuse publication when required lifecycle fields are missing.

## Implementation plan

1. Add a lightweight claim schema in `mind/schema/claim-lifecycle-ledger.schema.json`.
2. Add a markdown template in `mind/templates/claim-lifecycle-ledger-template.md`.
3. Add a publication lint rule requiring lifecycle labels for durable public-facing claims.
4. Add a review command or checklist for claim transitions.
5. Connect this ledger to existing MC concepts: Origin Classifier, Demonstration Evidence Envelope, Missingness Compass, Consent Gradient Export Protocol, and Publication Boundary Lint Protocol.

## Research questions

- What is the smallest lifecycle schema that remains useful without becoming bureaucratic?
- How should MC distinguish a poetic operating line from a factual claim?
- Which lifecycle transitions require explicit human consent?
- When should resonance feedback change a claim, and when should it only create a new research question?
- How should public demos show lifecycle metadata without making the interface unreadable?

## Public-safe index terms

- claim lifecycle
- source boundary
- evidence status
- missingness status
- revision reason
- public-safe derivation
- publication linting
- durable reflection artifact

## Boundary note

This artifact intentionally publishes only method architecture. It does not reveal the private content that motivated the need for the method.