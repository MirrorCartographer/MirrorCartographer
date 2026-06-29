# PRD: Compression Loss Ledger

## Product problem

Mirror Cartographer public-safe artifacts can accurately avoid exposing protected details while still creating a false sense of completeness. Redaction removes private content. Compression-loss accounting explains what the public artifact no longer contains.

## Goal

Add a public-safe Compression Loss Ledger that records the fidelity tradeoff between source context and released artifact.

## Non-goals

- Do not reveal private source details.
- Do not preserve raw transcript excerpts.
- Do not expose personal, household, health, animal-care, financial, location, relationship, credential, or identity-specific details.
- Do not convert symbolic resonance into proof.
- Do not imply a public artifact contains the full reasoning field.

## Users

- MC maintainer preparing public-safe artifacts.
- External reviewer evaluating claim boundaries.
- Research partner checking whether methods are well-scoped.
- Product builder implementing privacy-preserving continuity.

## User story

As a reviewer, I need to see what kind of source context shaped a public MC artifact and what was lost in translation, so I can evaluate the artifact without needing access to protected source material.

## Functional requirements

1. Every public-safe artifact derived from mixed or private context can attach a compression-loss record.
2. The record categorizes source status without exposing source content.
3. The record distinguishes preserved structure from removed structure.
4. The record identifies whether the public claim was downgraded.
5. The record states missingness and inspection limits.
6. The record includes a distortion-risk statement.
7. The record ends with a release verdict.

## Labels

### Source status
- public_repo
- private_repo
- file_library
- saved_context
- web_source
- mixed
- unavailable
- unknown

### Claim status
- confirmed
- source_backed
- inference
- speculative
- design_proposal
- blocked
- missing

### Privacy status
- public_safe
- private_derived_abstract
- needs_review
- blocked_private
- unsafe

### Compression status
- lossless_public
- abstracted_private
- high_loss
- claim_downgraded
- structure_preserved
- insufficient_context

## Interface placement

The ledger can appear as:

- a section in research notes,
- a sidecar record beside generated artifacts,
- a reviewer checklist row,
- a release-gate receipt,
- a public-safe index entry.

## Acceptance criteria

A ledger entry is acceptable if a reviewer can answer:

1. What source category shaped the artifact?
2. What survived compression?
3. What was removed?
4. What claim was weakened?
5. What remains unknown?
6. What distortion risk remains?
7. Is the artifact safe to publish?

## Failure modes

- Polished artifact hides uncertainty.
- Private source material leaks through examples.
- High-loss summary appears source-complete.
- Symbolic interpretation appears externally validated.
- Missingness is omitted because it makes the artifact look weaker.

## Public-safe implementation plan

1. Add schema file for compression-loss records.
2. Add scorecard rows for compression visibility.
3. Add fixture cases for low-loss, high-loss, and blocked-private transformations.
4. Add release-gate rule requiring compression status for private-derived artifacts.
5. Add future UI label: `compression: structure preserved / high loss / claim downgraded`.
