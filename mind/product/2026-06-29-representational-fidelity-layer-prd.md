# PRD — Representational Fidelity Layer

Status labels

- Source status: product requirement derived from public-safe MC architecture, file-library materials, recent GitHub mind direction, and current public research on provenance and disclosure.
- Claim status: product requirement; not a completed implementation.
- Privacy status: public-safe; describes product behavior without exposing private source content.
- Missingness: needs UI design, data model implementation, test fixtures, and release-gate integration.
- Revision reason: added to ensure public-safe artifacts preserve structure instead of becoming generic summaries.

## Summary

Build a Representational Fidelity Layer for Mirror Cartographer.

The layer audits whether a generated artifact preserves the source structure that mattered after private material is abstracted away.

## User value

Users need public-safe outputs that do not leak private details and do not betray the architecture by flattening it.

The system should help them answer:

- What shaped this artifact?
- What was removed?
- What survived?
- What became generalized?
- What contradictions or minority signals remain visible?
- What cannot be claimed from this artifact?

## Functional requirements

### 1. Transform audit panel

Every publishable artifact gets a compact audit panel with:

- source status
- claim status
- privacy status
- missingness
- revision reason
- preserved invariants
- removed private classes
- known representational losses

### 2. Minority-signal preservation

The compiler must detect when a rare, dissenting, contradictory, or non-consensus signal is being merged into a general category.

It should label the signal as public-safe structure, not expose the private source.

Example output pattern:

- Majority pattern: symbolic mapping as orientation support.
- Minority signal: risk that symbolic language can be mistaken for proof.
- Compiler action: preserve both in the public artifact.

### 3. Contradiction survival

The layer must preserve unresolved contradiction as a first-class object.

It should not resolve contradiction merely to make the artifact sound coherent.

### 4. Missingness ledger

The artifact must say what it does not know.

Missingness should be visible in the artifact, not buried in internal notes.

### 5. Release gate connection

RepresentationalFidelity must feed the ReleaseReadinessGate.

If an artifact loses essential structure, it should be revised or held even if it passes privacy safety.

## Non-functional requirements

- No raw transcript exposure.
- No identifying details unless explicitly permitted and release-reviewed.
- No health, legal, financial, animal-care, relationship, location, credential, or household claims from private context.
- Accessible language.
- No essential content only in code blocks.
- Must support both plain and symbolic modes.

## Acceptance criteria

A release candidate passes if:

- private details are absent
- source classes are visible
- claim mode is visible
- contradiction is preserved when relevant
- minority signal is not erased
- missingness is explicit
- artifact still retains the public-safe shape of the original architecture

## Failure criteria

The layer fails if:

- privacy is preserved by making the artifact meaningless
- a dissenting signal is averaged away
- symbolic intensity is converted into factual authority
- missingness is hidden
- source-boundary class is unclear
- the public artifact claims more than the source boundary permits
