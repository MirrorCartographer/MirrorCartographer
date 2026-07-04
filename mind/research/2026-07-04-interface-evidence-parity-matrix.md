# Interface Evidence Parity Matrix

**Date:** 2026-07-04

**Public-safe finding:** Mirror Cartographer needs an Interface Evidence Parity Matrix.

**Operating line:** A claim should not become stronger, weaker, or more private merely because it moved from text into interface, export, diagram, ritual, dashboard, or research language.

## Why this matters

Mirror Cartographer materials describe multiple expression surfaces: symbolic input, reflection generation, session memory, exportable artifacts, visual grammar, product lanes, research/governance framing, and live interface implementation. Those surfaces are not neutral containers. Each can change how a claim feels: a diagram may look more rigorous than its evidence supports; an export may feel more official than a session reflection; mythopoetic language may feel personally exact while remaining interpretive; a product screen may imply readiness when the underlying method is still provisional.

The system therefore needs a parity layer that checks whether evidence status, source boundary, privacy boundary, and missingness survive surface translation.

## Source status

- **Private-context-informed:** Used only to understand the continuity of the Mirror Cartographer architecture and recent research direction.
- **File-backed:** Existing uploaded MC materials support the need for parity across modes, outputs, visual grammar, implementation, governance, and source-boundary limits.
- **GitHub-reviewed:** The target repository is available and writable; this note is added as a public-safe abstract research artifact.
- **External-public-source status:** Not used in this finding. No external factual claim depends on current web research.

## Claim status

- **Claim type:** Product governance / interface safety requirement.
- **Evidence level:** Architecture-derived requirement, not a validated empirical result.
- **Confidence:** High that the requirement is necessary for coherent MC development; unvalidated as an implemented runtime mechanism.
- **Not claimed:** This does not claim clinical effect, benchmark performance, legal compliance, deployed parity enforcement, or user-tested outcomes.

## Privacy status

- **Public-safe:** Yes.
- **Private details included:** None.
- **Redaction strategy:** Personal, household, health, animal-care, financial, location, relationship, credential, and raw transcript details are excluded.
- **Residual risk:** Low by content, moderate by project-context accumulation; should be indexed as an abstract method note only.

## Missingness

- No complete inventory of every active UI surface was verified in this run.
- No automated parity checker exists in this note.
- No user-study data verifies which surfaces inflate perceived evidence.
- No final public-release template currently enforces parity labels across all artifact types.

## Matrix fields

Every MC artifact surface should carry these fields:

1. **Surface:** chat reflection, saved memory, export, diagram, dashboard, research note, marketing page, ritual card, product requirement, implementation issue, or evaluation report.
2. **Source boundary:** private-context-informed, file-backed, repo-backed, external-source-backed, generated, inferred, or missing.
3. **Claim status:** observed, interpreted, speculative, design requirement, implementation fact, test result, or open question.
4. **Evidence carryover:** what evidence survived translation from the previous surface.
5. **Evidence loss:** what became compressed, removed, aestheticized, generalized, or inaccessible.
6. **Privacy carryover:** whether any private signal still shapes the public artifact.
7. **Audience risk:** whether the surface could make an unproven claim feel more authoritative than intended.
8. **Required label:** the minimum label needed before sharing, publishing, committing, or exporting.
9. **Revision reason:** why the artifact changed surface or language.

## Evaluation criteria

An artifact passes the Interface Evidence Parity Matrix only if:

- Its strongest visible claim does not exceed the strongest supported claim.
- Its privacy-safe abstraction does not enable composite reconstruction when combined with neighboring artifacts.
- Its mode label is preserved across surface changes.
- Its missingness is visible at the point of use, not buried elsewhere.
- Its audience can tell whether they are reading evidence, interpretation, product intent, or aesthetic framing.

## Implementation plan

1. Add a lightweight parity block to public-safe MC notes.
2. Add a `surface` field to future artifact indexes.
3. Require every exportable artifact to declare source boundary, claim status, privacy status, missingness, and revision reason.
4. Build a small lint rule or checklist that flags words such as proven, verified, diagnostic, therapeutic, validated, finished, or deployed unless evidence status supports them.
5. Connect this matrix to existing gates: public release, redaction, claim surface inventory, interpretation budget, composite reconstruction risk, and visual grammar evidence.

## Research questions

- Which MC surfaces most strongly inflate perceived authority?
- Which labels preserve usefulness without making the interface feel bureaucratic?
- Can parity labels be presented visually without becoming another misleading surface?
- How much source-boundary detail can be public before it increases reconstruction risk?

## Revision reason

Prior MC governance notes define gates, ledgers, redaction, context gradients, and claim surfaces. This note adds a cross-surface parity requirement: when a finding moves between media forms, its evidence and privacy labels must move with it.
