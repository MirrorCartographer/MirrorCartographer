# Interpretive Surface Contract

## Core finding

Mirror Cartographer needs an **Interpretive Surface Contract**: a public-safe rule layer that defines which parts of an internal reflection can appear on an interface, export, demo, README, research note, or governance artifact.

## Operating line

**"A reflection is not public because it is well-written. It is public only after its surface is cleared."**

## Why this matters

MC works across private symbolic state, product requirements, governance framing, evaluation language, and public explanation. Those layers can inform each other, but they should not share the same surface by default.

A public surface is not just text. It is any outward-facing artifact that can be read, indexed, copied, misunderstood, or treated as representative of the system. That includes repository files, screenshots, demos, product pages, issue templates, exports, diagrams, and marketing copy.

Without an explicit surface contract, MC risks three failures:

1. **Private-state leakage** — public artifacts accidentally inherit personal, household, health, animal-care, financial, location, relationship, credential, or transcript-specific detail.
2. **Authority blur** — symbolic reflections appear as factual, clinical, scientific, legal, or operational claims.
3. **Demo distortion** — examples become emotionally compelling but impossible for outsiders to inspect, falsify, reuse, or safely evaluate.

## Source status

- **Saved context:** used only to understand existing MC architecture, constraints, and repeated build direction.
- **File library:** supports the public-safe architecture pattern: MC is described as provenance-native cognition infrastructure, semantic continuity, consent-bounded memory, contradiction persistence, and governance-aware reasoning state.
- **GitHub materials:** existing repository lane is available for public-safe architecture notes; prior mind notes already establish provenance, missingness, public-claim typing, consent gradients, public export gates, and revision ledgers.
- **Private raw chats:** not quoted, copied, summarized, or exposed.

## Claim status

- **Architecture claim:** MC should treat public-facing surfaces as governed interfaces, not neutral containers.
- **Product requirement:** every export/public artifact should pass a surface-clearance step before publication.
- **Evaluation claim:** a valid public MC artifact must be inspectable without requiring access to private continuity.
- **Research question:** what metadata is sufficient to prove that a public artifact was abstracted from private context without leaking the private context itself?

## Privacy status

Public-safe. This note contains no personal, household, health, animal-care, financial, location, relationship, credential, or raw transcript detail.

Private-context use was limited to architectural orientation only.

## Missingness

- No automated detector currently verifies whether a public artifact contains private-source residue.
- No formal schema currently separates internal reflection surfaces from public demo surfaces.
- No implemented UI gate currently forces mode, claim type, source status, consent status, and export status to be confirmed before publication.
- No red-team test suite currently checks whether emotionally compelling examples create authority confusion.

## Proposed contract fields

Each public-facing MC artifact should declare:

1. **Surface type** — README, demo, product page, research note, issue, diagram, export, example, or governance artifact.
2. **Source boundary** — public source, private-derived abstraction, synthetic example, research citation, implementation observation, or mixed.
3. **Claim type** — product requirement, design hypothesis, symbolic interpretation, research question, implementation plan, evaluation criterion, or external-source claim.
4. **Privacy clearance** — public-safe, private-derived abstracted, needs redaction, blocked, or user-approved explicit disclosure.
5. **Authority lane** — symbolic, product, engineering, governance, research, safety, accessibility, or operational.
6. **Revision reason** — new source, corrected claim, privacy hardening, scope reduction, mode change, evaluation result, or implementation constraint.
7. **Missingness statement** — what the artifact cannot prove, does not include, or still needs.

## Implementation plan

1. Add a `surface_contract` object to public/export pipelines.
2. Require artifact generation to choose a `surface_type`, `claim_type`, `source_boundary`, and `privacy_clearance` before saving or publishing.
3. Add a blocker state: `privacy_clearance: blocked` when the artifact depends on raw private context.
4. Add a second blocker state: `authority_lane: unresolved` when symbolic meaning is being presented as objective proof.
5. Create a public-safe example bank made only from synthetic or explicitly cleared scenarios.
6. Add a CI-style repository check for banned source classes in public files.

## Evaluation criteria

A public MC artifact passes the Interpretive Surface Contract when:

- It can be understood without private context.
- It declares what kind of claim it is making.
- It identifies whether it is source-bound, synthetic, private-derived, or speculative.
- It contains no private details unless explicitly cleared for that exact surface.
- It does not treat symbolic resonance as objective evidence.
- It states what is missing or unproven.
- It can be revised with a meaningful revision reason.

## Revision reason

Added after reviewing repeated MC research notes. Existing notes protect provenance, claims, consent, missingness, public export, and revision history; this note adds the missing outward-facing interface layer: **the surface itself must be treated as a governed object**.
