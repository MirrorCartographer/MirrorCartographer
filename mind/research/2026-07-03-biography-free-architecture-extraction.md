# Biography-Free Architecture Extraction

Date: 2026-07-03
Status: public-safe research note

## Core finding

Mirror Cartographer needs a **Biography-Free Architecture Extraction** rule.

Operating line:

**A private life pattern may reveal a system need, but the public architecture must be expressible without biography.**

## Why this matters

Mirror Cartographer is built from continuity work: repeated symbols, corrections, tool failures, evidence boundaries, source status, claim status, missingness, outcome feedback, and public/private boundary handling. The public README already defines the project as a system for preserving relationships between fragments rather than merely storing fragments, and it explicitly excludes therapy, diagnosis, medical/veterinary authority, oracle claims, and objective-truth claims.

That creates a recurring publication problem: the richest design signals often originate in private continuity material, while the public project must remain safe, bounded, reusable, and non-extractive. The next architectural layer is therefore not another story, transcript, or personal example. It is a translation guard that converts private-origin design pressure into public-safe product requirements.

## Source status

- Source class: mixed private-context architecture, saved project memory, public repository README, prior public-safe research notes.
- Private material used only for: identifying repeated architecture pressures and failure modes.
- Public material used for: project framing, allowed/not-allowed claim boundaries, continuity-atlas language, evidence/source/claim-status requirements.
- Raw private sources included: no.
- Raw transcript excerpts included: no.
- Personally identifying or household-specific details included: no.

## Claim status

- Claim type: architecture requirement.
- Evidence tier: design-derived, not externally validated.
- Confidence: medium-high for internal product need; low for generalized market claim until tested with non-founder users.
- Allowed use: product requirement, publication guard, evaluator checklist, repository organization rule.
- Not allowed use: proof of efficacy, proof of clinical value, proof of universal user need, or proof that symbolic reflection is factually correct.

## Privacy status

- Public-safe: yes.
- Contains personal facts: no.
- Contains health, animal-care, household, financial, location, relationship, credential, or raw transcript details: no.
- Reidentification risk: low, because the note describes an abstract extraction rule rather than a source event.
- Required boundary label: private-origin / public-method.

## Missingness

- No external user study has tested whether biography-free extraction preserves the most important meaning.
- No automated linter yet verifies that a public method is free of private-source leakage.
- No synthetic example suite yet demonstrates the difference between safe abstraction and over-redaction.
- No reviewer protocol yet decides when abstraction has erased too much operational signal.

## Revision reason

Recent public-safe MC notes have focused on evidence tiering, boundary classes, missingness, reversible derivation, synthetic examples, and symbolic-to-operational translation. This note adds the missing publication constraint between those layers: the public artifact must keep the architecture while removing the biography that generated it.

## Product requirement

Add a publication-stage extraction gate with five checks:

1. **Need extraction** — What system need did the private material reveal?
2. **Biography removal** — Can the need be stated without names, events, household facts, health facts, locations, finances, relationships, credentials, or transcript-specific language?
3. **Architecture preservation** — Did the abstraction keep the operational structure, or did it flatten the signal into vague safety language?
4. **Boundary labeling** — Does the output label source status, claim status, privacy status, missingness, and revision reason?
5. **Use routing** — Is the artifact routed to method, requirement, research question, evaluation criterion, index, or implementation plan rather than advice or factual claim?

## Evaluation criteria

A public-safe extraction passes only if all are true:

- A reader can understand the method without access to the private source.
- A reader cannot reconstruct the private source from the method.
- The claim is weaker than the private signal, not stronger.
- The output names what is missing.
- The artifact states what it can and cannot be used for.
- The artifact improves MC architecture rather than merely documenting a private event.

## Implementation plan

Create a reusable frontmatter schema for public-safe MC notes:

- `source_status`
- `claim_status`
- `privacy_status`
- `missingness`
- `revision_reason`
- `allowed_use`
- `not_allowed_use`
- `boundary_class`
- `evidence_tier`
- `leakage_review`

Then build a repository lint pass that checks every public-facing note for those fields before publication.

## Research question

How much private-origin meaning can be removed before the architecture loses the structure that made the signal valuable?

## Public-safe index tags

- privacy-safe derivation
- public/private boundary
- architecture extraction
- source boundary
- claim status
- missingness
- publication guard
- symbolic-to-operational translation

## Current decision

Adopt **Biography-Free Architecture Extraction** as a required layer between private continuity analysis and public GitHub publication.
