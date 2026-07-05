# Public-Safe Retrieval Audit Trail and Answer-Time Source Boundary Display

## Source status

- Source class: private architecture context, prior public-safe MC research notes, and repository continuity signals.
- Source handling: private-context material was used only to infer system architecture requirements and recurring failure modes.
- Publishable material: abstracted methods, requirements, evaluation criteria, source-boundary labels, and implementation plan only.
- Excluded material: personal facts, household details, animal-care details, health details, financial details, location details, relationship details, credentials, and raw transcript content.

## Claim status

- Claim type: product architecture and safety-process requirement.
- Claim confidence: medium-high.
- Claim basis: repeated MC research direction shows that redaction, revocation, dependency mapping, exclusion rules, and public-safe indexing are insufficient unless answer-time outputs can display what class of source was used and what was intentionally not used.
- Not claimed: that any specific private source is safe to quote, summarize, or expose.

## Privacy status

- Privacy classification: public-safe abstraction.
- Re-identification risk: low if implemented with coarse source classes rather than source titles, timestamps, identities, or private event structure.
- Required safeguard: never display private-source names, private document names, transcript titles, personal chronology, or unique metaphor chains unless separately approved for public release.

## Missingness

- Missing: a canonical MC retrieval log schema.
- Missing: a source-boundary display component in the public UI.
- Missing: automated tests proving that private source references are not surfaced in answer explanations.
- Missing: policy for how much source-boundary metadata is visible to end users versus only maintainers.

## Revision reason

The previous research thread established section indexes and retrieval exclusion rules. The next gap is answer-time accountability: a system can exclude private sections correctly but still produce outputs whose visible reasoning does not show which source classes were allowed, suppressed, transformed, or missing.

## Core finding

MC needs a Public-Safe Retrieval Audit Trail and Answer-Time Source Boundary Display.

A public-safe answer should not merely be safe after hidden filtering. It should carry a compact boundary label that tells maintainers and, where appropriate, users what kind of evidence shaped the answer, what classes of evidence were excluded, and whether the answer is source-grounded, architecture-derived, speculative, or awaiting review.

## Operating line

Public-safe synthesis needs visible source boundaries: not private citations, not raw provenance, but a minimal answer-time ledger of allowed source classes, excluded source classes, claim status, privacy status, and missing evidence.

## Problem statement

MC uses private context to understand architecture, but public artifacts must not leak the private substrate. This creates a tension:

1. Hidden retrieval improves architectural continuity.
2. Hidden retrieval also creates invisible risk.
3. Redaction can remove facts while leaving unexplained synthesis authority.
4. Users and maintainers need to know whether an output came from public docs, abstracted private architecture, repository code, synthetic demo state, or unresolved inference.

Without an answer-time source boundary, public-safe artifacts may become operationally opaque. The artifact may be safe to read but difficult to audit, repair, revoke, or evaluate.

## Product requirement

Every public-safe MC research or synthesis artifact should include a compact source-boundary block.

Minimum fields:

- Source status: public, private-derived abstraction, synthetic, repository-grounded, external-source-bound, or mixed.
- Claim status: observed, inferred, proposed, speculative, deprecated, contradicted, or unverified.
- Privacy status: public-safe, restricted, review-required, revoked, or unsafe-for-publication.
- Missingness: unavailable evidence, unverified assumption, absent test, absent implementation, or unresolved dependency.
- Revision reason: why this note exists and what changed from the prior state.

## Source-boundary display model

Recommended public artifact footer:

```text
Source boundary: Private context informed architecture only; no private facts are exposed.
Claim status: Proposed requirement.
Privacy status: Public-safe abstraction.
Missingness: Requires schema, tests, and UI implementation.
Revision reason: Adds answer-time auditability to retrieval exclusion rules.
```

Recommended maintainer-only expanded record:

```yaml
source_boundary:
  allowed_source_classes:
    - repository_public_or_private_code_metadata
    - prior_public_safe_research_notes
    - private_context_architecture_only
  excluded_source_classes:
    - raw_transcripts
    - personal_identifiers
    - household_details
    - health_or_animal_care_details
    - financial_or_location_details
    - relationship_or_credential_details
  transformation_level: abstracted_requirement
  claim_status: proposed
  privacy_status: public_safe
  missingness:
    - schema_not_implemented
    - tests_not_written
    - ui_component_not_built
  revision_reason: answer_time_boundary_needed_after_retrieval_exclusion_rules
```

## Evaluation criteria

A public-safe artifact passes if:

1. It gives enough source-boundary information to audit the output without revealing private source content.
2. It distinguishes public facts from private-derived abstractions.
3. It marks speculative or proposed claims instead of promoting them to established findings.
4. It identifies missing tests, missing implementation, or missing source evidence.
5. It supports later revocation by making dependency class visible.
6. It does not expose private file names, raw transcript titles, personal chronology, or unique private symbolic chains.

A public-safe artifact fails if:

1. It says “based on context” without boundary labels.
2. It cites or names private materials directly in a public artifact.
3. It hides whether a claim is observed, inferred, proposed, or speculative.
4. It redacts facts but preserves a private sequence that can reconstruct the original context.
5. It cannot be repaired when a source class is revoked.

## Implementation plan

### Phase 1: Schema

Create a `SourceBoundary` object used by all MC research outputs:

- `allowed_source_classes`
- `excluded_source_classes`
- `transformation_level`
- `claim_status`
- `privacy_status`
- `missingness`
- `revision_reason`
- `review_required`

### Phase 2: Output contract

Require every public-safe research note, demo script, UI explanation, and exported artifact to include either:

- a compact public source-boundary footer, or
- a maintainer-only source-boundary sidecar file.

### Phase 3: Retrieval integration

Attach source-boundary metadata to retrieval results before synthesis, not after writing. The synthesis layer should know whether it is allowed to quote, paraphrase, abstract, index, or ignore each retrieved item.

### Phase 4: Tests

Add regression tests:

- private-source-name leakage test
- raw-transcript leakage test
- private chronology reconstruction test
- unsupported-claim promotion test
- revoked-source dependency test
- missingness omission test

### Phase 5: UI component

Add a small source-boundary display to public-safe MC outputs. It should be understandable without exposing raw provenance.

Example UI language:

- “This answer is based on public-safe architecture notes and abstracted private-context requirements. Private source details were excluded.”
- “This claim is proposed, not yet implemented.”
- “Missing: automated regression test.”

## Research questions

1. What is the smallest source-boundary label that remains useful for non-technical users?
2. When should source-boundary details be public versus maintainer-only?
3. Can source-boundary metadata be propagated through vector retrieval without storing sensitive source names?
4. How should MC handle an answer that is correct but cannot safely explain why it knows something?
5. What interface pattern best communicates “architecture-derived from private context” without creating a private-context breadcrumb?

## Privacy-safe index entry

- Index key: `public-safe-retrieval-audit-trail-source-boundary-display`
- Category: safety architecture, retrieval governance, public artifact accountability
- Depends on: section index retrieval exclusion rules, transitive dependency revocation, redaction evidence binder
- Enables: auditable public-safe synthesis, safer demos, maintainable revocation, claim promotion controls
- Public summary: adds source-boundary labels to public-safe outputs so artifacts remain auditable without exposing private provenance.

## Next research target

Public-safe answer provenance compression: how to compress source-boundary metadata into short labels without losing audit value or leaking private topology.
