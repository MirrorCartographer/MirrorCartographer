# Public-Safe Section-Level Revocation and Repair Protocol

## Source status

- Source class: private-context-informed architecture synthesis; GitHub continuity review; no raw transcript publication.
- Reviewed continuity anchor: prior public-safe research chain through transitive dependency revocation.
- Public write scope: abstract protocol, product requirement, evaluation criteria, and implementation plan only.
- Excluded source material: personal, household, health, animal-care, financial, location, relationship, credential, and raw conversational details.

## Claim status

- Claim type: design requirement and evaluation protocol.
- Claim confidence: medium-high as an architectural requirement; unvalidated until implemented in tooling.
- Evidence boundary: derived from repeated need to publish safe abstractions while preserving traceability, revision reasons, and revocation handling.
- Not a claim about any private person, event, diagnosis, identity, or household circumstance.

## Privacy status

- Privacy classification: public-safe abstraction.
- Leakage risk: low if used as protocol text only; medium if future examples are filled with private-derived section names, symbols, timelines, or scenario topology.
- Required control: examples, fixtures, titles, and section labels must be generated independently from private source topology.

## Missingness

- No automated section lineage registry currently verified.
- No confirmed implementation tying section IDs to dependency graph nodes.
- No confirmed test suite for partial revocation, partial repair, or downstream invalidation.
- No reviewer UI verified for deciding whether a section should be deleted, rewritten, quarantined, or retained with changed status.

## Meaningful revision reason

The prior public-safe chain established revocation at the consent, abstraction, and transitive dependency levels. The next unresolved boundary is finer-grained: an artifact may be mostly safe while one section becomes invalid, over-specific, consent-revoked, stale, or compositionally revealing. Deleting the whole artifact loses useful public-safe work; leaving the section unchanged risks leakage or false continuity. MC needs a section-level repair protocol.

## Core finding

MC needs a **Public-Safe Section-Level Revocation and Repair Protocol**.

Operating line: **A public-safe artifact should be repairable below the file level: each section must be independently revocable, quarantinable, replaceable, and revalidated without preserving unsafe inference paths.**

## Problem

File-level revocation is too blunt for long-lived public-safe research notes. A single section can fail for reasons that do not apply to the entire artifact:

1. It may depend on a revoked source abstraction.
2. It may contain a claim promoted beyond available evidence.
3. It may become compositionally revealing after another artifact is added.
4. It may use a metaphor, sequence, label, or topology too close to private context.
5. It may become stale after implementation changes.
6. It may lack enough evidence to remain as a product requirement.

Without section-level state, the system has only two weak options: preserve unsafe material or remove the whole document. Both damage trust.

## Required section states

Every public-safe artifact section should be assignable one of the following statuses:

- `active`: public-safe and currently valid.
- `watch`: public-safe but depends on unstable assumptions, pending implementation, or weak evidence.
- `quarantined`: not approved for public reuse until reviewed.
- `revoked`: should not be reused, quoted, summarized, embedded, or used as source material.
- `repaired`: replaced after a documented revision reason and revalidation.
- `superseded`: still safe historically but no longer the current protocol.
- `deleted`: removed because repair would preserve unsafe topology or unsupported claims.

## Section metadata contract

Each section should carry a metadata record, either inline or in a companion index:

- `section_id`: stable identifier independent of title text.
- `artifact_path`: file path.
- `section_title`: current title.
- `source_status`: private-context-informed, public-source-bound, implementation-derived, fixture-derived, or mixed.
- `claim_status`: observation, hypothesis, requirement, protocol, evaluation criterion, implementation plan, or deprecated.
- `privacy_status`: public-safe, watch, quarantined, revoked, repaired, superseded, or deleted.
- `dependency_ids`: upstream artifacts, sections, claims, tests, or source boundaries.
- `downstream_ids`: known sections or implementation surfaces that reuse it.
- `revision_reason`: why the section changed.
- `repair_action`: delete, rewrite, abstract, split, downgrade claim, add missingness, add test, or quarantine.
- `review_date`: date of last public-safety review.

## Repair decision tree

When a section is flagged, apply this order:

1. **Identify failure mode.** Determine whether the issue is privacy leakage, consent revocation, unsupported claim, stale implementation, composition risk, or unclear source boundary.
2. **Freeze reuse.** Mark the section `quarantined` before rewriting so no downstream synthesis can treat it as active.
3. **Trace dependencies.** Locate upstream abstractions and downstream artifacts that rely on the section.
4. **Choose minimum safe repair.** Prefer claim downgrade or abstraction if the structure remains safe; prefer deletion if the structure itself reveals private topology.
5. **Revalidate in composition.** Test the repaired section inside the full artifact, not only alone.
6. **Record revision reason.** Make the reason legible enough for future maintainers without exposing private source details.
7. **Propagate status.** Update dependent sections, indexes, tests, and implementation tasks.

## Product requirements

- The research index should support section-level IDs, not only file paths.
- Public-safe notes should be generated from section records that preserve source, claim, privacy, and missingness labels.
- The synthesis pipeline should ignore `revoked`, `deleted`, and `quarantined` sections by default.
- The evaluation pipeline should include a composition-level check after any repair.
- The GitHub mind should maintain a repair log that explains what changed without exposing the private trigger.
- Public demos should never use repaired sections until they pass section-level and artifact-level review.

## Evaluation criteria

A section-level repair is successful only if:

- The repaired section contains no private facts, private-derived topology, or traceable symbolic ordering.
- The repaired section has a clear source boundary.
- The repaired claim is not stronger than its evidence.
- Any downstream artifact using the old section is identified and either repaired, quarantined, or explicitly marked unaffected.
- The artifact remains useful after repair; if usefulness collapses, the artifact should be superseded rather than silently hollowed out.
- The revision reason is meaningful but not revealing.

## Public-safe tests

1. **Section isolation test:** Could this section be published alone without exposing private context?
2. **Composition test:** Does this section reveal more when read alongside neighboring sections or related artifacts?
3. **Topology test:** Does the order, metaphor, scenario structure, or variable set mirror private context too closely?
4. **Claim-strength test:** Is the section labeled as requirement, hypothesis, or evaluation criterion according to available evidence?
5. **Reuse test:** Would an AI synthesis pipeline accidentally reuse revoked or quarantined material?
6. **Repair-legibility test:** Can a maintainer understand why the section changed without seeing private material?

## Implementation plan

1. Create `mind/indexes/public-safe-section-index.md` or a machine-readable equivalent.
2. Assign stable section IDs to existing public-safe research notes.
3. Add status fields for source, claim, privacy, missingness, dependency, and revision reason.
4. Add a synthesis rule: default retrieval excludes quarantined, revoked, and deleted sections.
5. Add a repair log for section-level changes.
6. Add tests for section isolation, composition risk, claim strength, and downstream propagation.
7. Connect section status to future GitHub issue templates or PR checklists.

## Research questions

- What is the smallest section unit that can be safely tracked without creating excessive maintenance overhead?
- Should section IDs be human-readable, hash-based, or both?
- How should repaired sections preserve useful architectural continuity without preserving unsafe inference paths?
- Can composition risk be scored automatically before human review?
- What downstream surfaces need section-status enforcement: docs, demos, prompts, tests, UI fixtures, or generated summaries?

## Next research target

Public-safe section index schema and retrieval exclusion rules.
