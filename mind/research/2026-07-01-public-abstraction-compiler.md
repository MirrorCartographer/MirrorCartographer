# Public Abstraction Compiler

## Core finding

Mirror Cartographer needs a **Public Abstraction Compiler**: a boundary-aware transformation layer that converts private continuity material into public-safe architecture artifacts without carrying over personal content.

## Operating line

**Private material may shape the architecture. It must not become the artifact.**

## Why this matters

Mirror Cartographer already treats understanding as something that can be preserved across fragments, source states, claim states, user corrections, outcome feedback, and public/private boundaries. That creates a useful but dangerous interface: the same continuity layer that makes MC powerful can also over-carry private context if public export is not formally compiled.

A public abstraction compiler makes the export step explicit. It asks:

1. What private material informed the design?
2. What abstract method, requirement, question, criterion, or implementation plan can be safely derived?
3. What authority does the derived artifact have?
4. What source boundary must remain visible?
5. What was intentionally omitted?
6. Why was the public version revised, generalized, delayed, or refused?

## Public-safe output types

Allowed output types:

- abstract method notes
- product requirements
- evaluation criteria
- source-boundary notes
- privacy-safe indexes
- implementation plans
- research questions
- claim taxonomies
- missingness registers
- revision reason summaries

Disallowed output types:

- raw transcripts
- identifying personal, household, relationship, health, animal-care, financial, location, or credential details
- private chronology when chronology itself reveals sensitive context
- verbatim user language that functions as personal disclosure
- inferred identity, diagnosis, motive, or private-life claim
- public claims that rely on private-only evidence without marking the limitation

## Compiler packet

Each public artifact should carry a small compiler packet:

- **Source status:** public repo / uploaded file / saved context / private conversation / mixed / unavailable
- **Claim status:** observed / inferred / proposed / unverified / speculative / implementation requirement
- **Privacy status:** public-safe / abstracted from private / sensitive omitted / blocked
- **Missingness:** what was not inspected, unavailable, ambiguous, or intentionally excluded
- **Revision reason:** why the public form differs from the underlying source material
- **Export decision:** publish / publish with limits / hold / refuse

## Evaluation criteria

A public abstraction passes only if:

1. A stranger can understand the architecture without needing private context.
2. The artifact does not expose protected life details.
3. The artifact says what kind of claim it is.
4. The artifact identifies what evidence lane it belongs to.
5. Missingness is visible instead of hidden.
6. The public version is useful even after private references are removed.
7. Revision reasons are inspectable.

## Implementation plan

1. Add a `public_abstraction_packet` schema to MC exports.
2. Require every public export to choose one allowed output type.
3. Add a private-to-public redaction pass before GitHub publication.
4. Add a missingness pass after redaction so erased context is not mistaken for absence.
5. Add a claim-status pass so public language does not overstate private-derived interpretations.
6. Add a revision-reason field whenever the artifact is generalized, delayed, refused, or narrowed.
7. Add a final export decision: publish, publish with limits, hold, or refuse.

## Source status

Mixed source understanding: public repository README, available Mirror Cartographer uploaded materials, saved architectural context, and prior GitHub mind notes. Private-context material was used only to understand architecture and risk boundaries.

## Claim status

Proposed product requirement and evaluation method. Not yet implemented as code.

## Privacy status

Public-safe architecture only. No raw transcript details, personal facts, household details, health details, animal-care details, financial details, location details, relationship details, credentials, or private chronology are included.

## Missingness

Repository code search was not indexed for the accessible GitHub repositories during this run, so this finding was based on accessible repository metadata, direct README access, file-library snippets, and established MC architecture notes rather than a complete repo-wide code audit.

## Meaningful revision reason

This note narrows MC's broad continuity framing into a specific export-layer requirement because recent research notes already cover provenance packets, claim taxonomy, missingness, consent gradients, public export gating, and revision ledgers. The remaining gap is the compiler that turns those separate safeguards into one publication step.
