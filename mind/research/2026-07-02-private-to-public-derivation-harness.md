# Mirror Cartographer — Private-to-Public Derivation Harness

Date: 2026-07-02
Status: public-safe architecture note

## Core finding

Mirror Cartographer needs a **Private-to-Public Derivation Harness**: a repeatable test that determines whether a private or mixed-source insight has been transformed far enough to become public project knowledge.

Operating line:

> A private signal may guide architecture only after it can survive without its private body.

## Source status

- Source class: mixed-source synthesis.
- Public-safe source anchors used:
  - Mirror Cartographer public/project packet framing: human-centered AI reflection system; symbolic-emotional mapping; psychological orientation; emotionally sustainable AI interaction.
  - Continuity/project architecture summaries: intake, translation, state graph, consent layer, AI reflection, outputs, mode separation, accessibility requirement, persistence choice, crisis boundary.
  - Existing GitHub mind direction from prior public-safe research notes: claim promotion, source-boundary handling, consent-gradient export, audience partitioning, revision reason logging, missingness labeling, origin classification, role separation.
- Private/mixed context role: used only to understand why MC repeatedly needs boundary-preserving transformation from lived interaction into product architecture.
- Raw transcript status: not copied, quoted, indexed, or exposed.

## Claim status

- Claim type: product architecture requirement.
- Evidence level: source-grounded synthesis from available MC project materials and previously abstracted repository notes.
- Not claimed:
  - Not a validated clinical, psychological, or therapeutic method.
  - Not proof that MC works for any specific population.
  - Not proof that private source material is publishable.
  - Not a substitute for consent, review, or redaction.

## Privacy status

Public-safe.

This file intentionally excludes:

- personal identity details
- household details
- health or animal-care details
- financial or location details
- relationship details
- credentials or employment records
- raw transcript passages
- private examples whose meaning depends on identifiable context

## Missingness status

Known missing pieces:

1. No automated redaction scanner is attached yet.
2. No formal consent UI exists for source promotion.
3. No test corpus of safe/unsafe derivations has been committed.
4. No reviewer checklist is embedded in the app runtime.
5. No provenance field is enforced at the schema level.

These missing pieces should block strong claims about public-readiness, but they do not block defining the harness requirement.

## The derivation problem

MC contains multiple kinds of material:

- direct user expression
- symbolic reflection
- design decisions
- product requirements
- research questions
- implementation plans
- evaluation criteria
- public-facing descriptions

The risk is false promotion: moving a private or high-context signal into public form before it has been abstracted into a safe architectural object.

The harness exists to answer one question:

**Can this idea be understood, evaluated, and improved without revealing the private source that generated it?**

If not, it is not ready for GitHub public knowledge.

## Derivation gates

### Gate 1 — Source boundary declared

Every candidate finding must declare one of these source classes:

- public source
- private source
- mixed source
- inferred architecture
- implementation observation
- speculative research question

Fail condition: the finding appears source-grounded but does not say what kind of source produced it.

### Gate 2 — Private payload removed

The candidate must remove all private payloads:

- names not needed for product architecture
- medical/animal/financial/household facts
- location-specific facts
- relationship facts
- transcripts
- screenshots containing secrets or account data
- emotionally identifiable scenes that are not required for the method

Fail condition: the finding still depends on a private example to make sense.

### Gate 3 — Architecture object extracted

The finding must be rewritten as at least one of:

- requirement
- constraint
- boundary note
- research question
- evaluation criterion
- schema field
- implementation task
- design principle
- test case

Fail condition: the candidate remains a story, diagnosis, confession, or private memory rather than a product object.

### Gate 4 — Claim authority capped

The claim must state what it is allowed to mean.

Allowed examples:

- “This is a product requirement.”
- “This is a privacy boundary.”
- “This is an evaluation criterion.”
- “This is a research question.”

Blocked examples:

- “This proves MC works.”
- “This proves a user state.”
- “This proves a clinical outcome.”
- “This proves general human behavior.”

Fail condition: the public artifact claims more authority than its evidence supports.

### Gate 5 — Missingness visible

The candidate must state what is not yet known, built, verified, or safe.

Fail condition: the artifact reads like a complete system when it is only a design increment.

### Gate 6 — Revision reason logged

Any changed public claim must carry a revision reason:

- new source boundary
- stronger privacy requirement
- weaker evidence than previously implied
- new product constraint
- implementation mismatch
- accessibility issue
- consent ambiguity

Fail condition: a public claim changes without explaining why.

## Evaluation criteria

A derivation passes when an external reader can answer:

1. What source class produced this?
2. What kind of claim is being made?
3. What private material was excluded?
4. What is still missing?
5. What can be implemented from it?
6. What would invalidate or revise it?

## Implementation plan

### Schema fields

Add these fields to MC public-safe knowledge objects:

- `source_status`
- `claim_status`
- `privacy_status`
- `missingness_status`
- `revision_reason`
- `derivation_type`
- `public_safe_summary`
- `blocked_payload_types`
- `implementation_target`

### Runtime behavior

Before export, publish, GitHub write, or public index generation, run:

1. classify source
2. strip private payload
3. extract architecture object
4. cap claim authority
5. label missingness
6. log revision reason
7. produce public-safe summary

### Test cases to add later

- safe requirement derived from private interaction
- unsafe raw transcript quote
- mixed-source research question
- symbolic claim overreaching evidence
- public-facing description with missing consent label
- implementation plan missing provenance

## Product requirement

MC should not have a single “publish” action. It should have a **derive-for-public** action that converts private/mixed material into a bounded architecture object before publication.

## Research question

Can MC preserve the developmental value of private symbolic interaction while producing public artifacts that remain useful, auditable, and non-extractive?

## Revision reason

Added because prior MC repository notes define many boundary and claim-control protocols, but the system still needs a single harness that tests whether any private-to-public transformation has actually passed the necessary gates.
