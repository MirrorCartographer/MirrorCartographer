# ReleaseReadinessRecord v0

Status labels

- Source status: derived from MC public-safe compiler, authority-boundary, memory-routing, influence-graph, and co-presence boundary direction.
- Claim status: schema proposal.
- Privacy status: public-safe schema; no private-source details.
- Missingness: not implemented in app, CI, issue template, or review workflow.
- Revision reason: added to make public release decisions inspectable instead of implicit.

## Purpose

A `ReleaseReadinessRecord` decides whether an MC artifact is ready to cross into public space.

It is not a marketing checklist.

It is a boundary, evidence, and utility checkpoint.

## Required fields

### artifact_id

Stable identifier or path for the artifact under review.

### artifact_type

Use one:

- research note
- schema
- fixture
- evaluation scorecard
- product requirement
- implementation plan
- public index
- audit offer
- field log
- museum object
- other

### source_status

Where the artifact came from.

Allowed examples:

- public repo material
- file-library public-safe summary
- abstracted private-context pattern
- synthetic fixture
- cited external research
- mixed public-safe sources

### claim_status

Strongest claim level.

Use one:

- metaphor
- design intuition
- research question
- speculative hypothesis
- product requirement
- prototype behavior
- evaluation result
- public claim

### privacy_status

Use one:

- public-safe
- needs redaction
- private-only
- blocked from release

### blocked_source_categories_checked

Boolean list confirming no release of:

- raw transcript
- personal detail
- household detail
- health detail
- animal-care detail
- financial detail
- location detail
- relationship detail
- credential detail
- private-source specific

### evidence_lane

What kind of support the artifact has.

Examples:

- internal architecture consistency
- cited external research
- synthetic fixture only
- prototype test
- user validation
- expert review
- none yet

### utility_claim

What the artifact helps a reader or builder do.

### missingness

What is absent, uncertain, untested, or unresolved.

### authority_boundary

What the artifact must not be used as authority for.

### misuse_risk

Likely ways the artifact could be misread or overused.

### mitigation

Labels, caveats, fixtures, review steps, or UI constraints that reduce misuse risk.

### viewdiff_value

What became newly visible because the idea was transformed into this artifact.

### falsification_or_shrink_route

What would make the artifact fail, shrink, or move to a weaker claim status.

### gate_outcome

Use one:

- release_ready
- release_with_warning
- hold_for_fixture
- hold_for_evidence
- private_only
- discard_or_archive

### reviewer_notes

Short human-readable notes.

## Minimal rule

No artifact may be marked `release_ready` unless:

1. privacy status is public-safe,
2. claim status does not exceed evidence lane,
3. missingness is explicit,
4. authority boundary is explicit,
5. utility claim is concrete,
6. misuse risk has a mitigation.
