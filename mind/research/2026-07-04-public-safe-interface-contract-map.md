# Public-Safe Interface Contract Map

## Core finding

Mirror Cartographer needs a **Public-Safe Interface Contract Map**: a maintained specification that links every public-facing interface element to the evidence class, privacy boundary, claim strength, missingness state, and revision rule that governs it.

## Operating line

A public interface is not safe because the underlying data is hidden; it is safe when each visible element carries an explicit contract for what it is allowed to imply.

## Source status

- **Private context used:** Architecture-level understanding only.
- **Repository context used:** Existing Mirror Cartographer repository surface and prior public-safe research direction.
- **Raw transcript exposure:** None.
- **Personal, household, health, animal-care, financial, location, relationship, credential exposure:** None.
- **External sources:** None used in this increment.

## Claim status

- **Claim type:** Product requirement and implementation governance requirement.
- **Claim strength:** Design-reasoned; not yet empirically validated.
- **Evidence status:** Derived from repeated public-safety requirements around source boundaries, claim gates, redaction, synthetic fixtures, maturity indexing, and traceability.
- **Not claimed:** This does not claim the current MC interface violates privacy, nor that all interface elements currently exist.

## Privacy status

- **Public-safe:** Yes.
- **Reason:** The artifact describes a general interface governance method without naming private examples, personal signals, transcripts, locations, medical details, animal-care details, finances, credentials, or relationships.
- **Required future guard:** Any future implementation fixtures must be synthetic or explicitly public-source-bound.

## Missingness status

The current research thread has produced multiple safety artifacts, but the interface layer still lacks a single map that answers:

1. What does this visible UI element mean?
2. What source class may support it?
3. What claim class may it make?
4. What private classes are forbidden from being implied?
5. What should happen when evidence is missing, stale, contradictory, or private-only?
6. What test proves the element obeys the boundary?

## Product requirement

Create a machine-readable contract file for MC interface components.

Recommended path:

`mind/contracts/public-safe-interface-contract-map.schema.md`

Each public-facing element should include:

- `component_id`
- `component_name`
- `surface`: public_demo, private_session, internal_tooling, documentation, export, share_card
- `allowed_source_status`: synthetic, user-provided-public, public-web, private-abstracted, repository-derived
- `forbidden_source_status`: raw-private-transcript, household-specific, health-specific, animal-care-specific, financial, credential, precise-location, relationship-specific
- `allowed_claim_status`: interface_behavior, product_requirement, research_question, design_hypothesis, evaluation_result
- `forbidden_claim_status`: diagnosis, personal inference, identity claim, private-history claim, unsupported capability claim
- `privacy_status`: public-safe, internal-only, private-only, blocked
- `missingness_behavior`: hide, demote, label, ask-in-private, use-synthetic-placeholder, show-unavailable-state
- `revision_reason_required`: true
- `test_fixture_policy`: synthetic-only, public-source-only, redacted-derived, blocked

## Evaluation criteria

A component passes the contract map only if:

1. It can be rendered without private examples.
2. Its copy does not imply access to raw private context.
3. Its evidence class is visible or inferable from the contract.
4. Its missing state is safer than hallucination, overclaiming, or silent omission.
5. It has a synthetic test fixture.
6. It has a revision reason when behavior changes.
7. It does not collapse symbolic language into factual claims.
8. It does not convert personal context into public demonstration material.

## Implementation plan

1. Inventory public UI elements and docs.
2. Assign a contract entry to each element.
3. Add synthetic fixtures for each element state.
4. Add a lint step that flags uncontracted public-facing copy.
5. Add a review checklist for any interface copy that references memory, evidence, symbols, interpretation, body maps, modes, exports, demos, or sharing.
6. Require revision reasons when contract fields change.

## Research questions

- Can the same component safely operate in private mode and public demo mode with different source policies?
- What UI language best distinguishes symbolic reflection from factual inference?
- Which components require visible boundary labels versus hidden internal contracts?
- How should the system display useful missingness without making the product feel broken?
- Can contract entries be compiled into automated tests for docs, UI copy, and demo fixtures?

## Meaningful revision reason

This increment adds an interface-facing layer to prior public-safe research. Earlier findings focused on claim gates, source rehydration, memory ingestion, redaction regression, maturity indexing, and traceability. This file turns those governance ideas toward the actual UI contract: what the user or viewer is allowed to see, infer, and trust from each visible element.
