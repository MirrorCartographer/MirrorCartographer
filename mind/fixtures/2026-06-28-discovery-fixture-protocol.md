# Synthetic Discovery Fixture Protocol

Status labels

- Source status: derived from public-safe MC architecture and the ViewDiff Discovery Scorecard.
- Claim status: implementation plan / fixture protocol.
- Privacy status: public-safe; synthetic data only.
- Missingness: fixture examples not yet generated; no automated runner; no reviewer validation.
- Revision reason: created to test whether ViewDiff can identify discovery candidates without relying on private material.

## Purpose

This protocol creates synthetic source artifacts and transforms them through multiple lenses to test whether new usable structure appears.

The goal is not to prove grand theory.

The goal is to see whether MC can catch the moment when a transformation reveals a difference worth pursuing.

## Fixture rules

All source material must be fictional or abstract.

No private user details.

No real household, medical, animal-care, financial, location, relationship, credential, or raw transcript material.

## Fixture object

Each fixture should include:

- source artifact
- source status
- privacy status
- initial claim status
- transformation lenses
- generated target views
- ViewDiff record
- scorecard result
- next action

## Required transformation lenses

### Technical lens

Translate the source into architecture, schema, state, or workflow.

### Product lens

Translate the source into a buyer-facing offer, workflow, or deliverable.

### Care-support lens

Translate the source into non-diagnostic observation support, uncertainty handling, or professional-facing communication.

### Museum lens

Translate the source into symbolic, visual, or narrative form while preserving boundaries.

## ViewDiff fields

For each lens, record:

- preserved invariant
- lost structure
- added structure
- newly visible risk
- newly visible opportunity
- new question
- new test
- privacy/boundary result

## Pass condition

A fixture passes only if at least one transformation produces:

- a new question that was not explicit in the source
- a concrete test or artifact path
- no private leakage
- clear claim status

## Failure condition

The fixture fails if transformations produce only paraphrase, style changes, or confidence without new action.

## Research fit

This protocol aligns with current concerns in semantic invariance, semantic drift, provenance, and lifecycle lineage.

It turns those concerns into MC-specific testing:

Can transformation reveal useful structure without losing source boundaries?

## Next action

Generate three synthetic fixtures:

1. governance artifact fixture
2. care-support communication fixture
3. creative/museum artifact fixture

Then score each with the ViewDiff Discovery Scorecard.
