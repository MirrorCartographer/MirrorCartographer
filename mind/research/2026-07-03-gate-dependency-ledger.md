# Gate Dependency Ledger

Date: 2026-07-03
Status: public-safe architecture note

## Core finding

Mirror Cartographer needs a **Gate Dependency Ledger**: a small governance layer that records when an artifact, method, claim, export, interface behavior, or implementation plan depends on another gate being resolved first.

Operating line: **A gate is not complete until the system knows which other gates it silently depends on.**

## Source status

- Source class: mixed architecture review.
- Inputs used: previously established MC governance notes, public-safe file-library summaries, repository-oriented research direction, and abstracted private-context understanding.
- Private-context use: allowed only as architecture-orientation material.
- Published content: abstracted method only; no raw transcript, personal, household, health, animal-care, financial, location, relationship, credential, or identifying operational details.

## Claim status

- Claim type: product/governance architecture requirement.
- Confidence: medium-high.
- Evidence basis: repeated emergence of separate but interdependent requirements across evidence routing, privacy boundaries, release safety, missingness, consent projection, visual grammar, source classification, and style/claim separation.
- Not claimed: that the full dependency graph is complete, implemented, or empirically validated.

## Privacy status

- Public-safe: yes.
- Contains private details: no.
- Re-identification risk: low, because the note describes governance structure rather than source content.
- Publication boundary: suitable for repository documentation, product requirements, evaluation criteria, and implementation planning.

## Missingness

Current missing items:

1. A canonical list of all MC gates.
2. A typed dependency vocabulary.
3. A machine-readable dependency manifest.
4. A rule for resolving conflicting gate outcomes.
5. A UI/debug view showing blocked, satisfied, uncertain, and waived gates.
6. Tests proving that downstream artifacts cannot bypass unresolved upstream gates.

## Revision reason

Earlier notes defined individual gates and adapters. This note adds cross-gate dependency tracking so MC can avoid treating each safety/evidence/privacy requirement as isolated. It turns the governance layer from a checklist into a dependency-aware system.

## Proposed dependency vocabulary

Each artifact should be able to declare dependencies using a compact status grammar:

- `requires`: artifact cannot proceed without the upstream gate.
- `informs`: upstream gate shapes interpretation but does not block progression.
- `conflicts_with`: upstream gate may contradict this artifact's current route.
- `supersedes`: newer gate result replaces an older result.
- `waived_with_reason`: gate was bypassed only with explicit reason and scope.
- `unknown`: dependency is suspected but not resolved.

## Minimum ledger fields

For each artifact or claim, record:

- artifact_id
- artifact_type
- source_status
- claim_status
- privacy_status
- missingness_status
- active_gate_dependencies
- blocked_by
- allowed_outputs
- disallowed_outputs
- revision_reason
- reviewer_or_process
- timestamp

## Product requirement

MC should not decide whether an output is safe, publishable, memory-worthy, actionable, or exportable by checking a single gate in isolation. It should compute a dependency state across all relevant gates.

## Evaluation criteria

A Gate Dependency Ledger passes if:

1. A public artifact cannot be released when a required privacy gate is unresolved.
2. A poetic or symbolic output cannot upgrade a claim without passing the evidence router.
3. A visual artifact cannot enter the build without being decompressed into evidence units or marked as unresolved.
4. A memory or continuity projection cannot proceed without consent-boundary status.
5. Missingness remains visible instead of being converted into implied certainty.
6. Waived gates remain auditable and scoped.

## Implementation plan

1. Create `/mind/indexes/gates.yml` with canonical gate names and definitions.
2. Create `/mind/indexes/gate-dependencies.yml` with dependency edges.
3. Add a release-check script that reads dependency status before publication.
4. Add tests for blocked release, waived release, unresolved evidence, unresolved privacy, and conflicting status.
5. Add a human-readable report generator for repository review.

## Example abstract manifest

```yaml
artifact_id: public-note-001
artifact_type: research_note
source_status: abstracted_private_context_plus_repo_review
claim_status: architecture_requirement
privacy_status: public_safe
missingness_status: partial_gate_graph
active_gate_dependencies:
  - gate: evidence_tier_output_router
    relation: requires
    status: satisfied
  - gate: public_artifact_release_gate
    relation: requires
    status: satisfied
  - gate: consent_bounded_state_projection
    relation: informs
    status: partial
blocked_by: []
allowed_outputs:
  - public_repository_note
  - implementation_plan
disallowed_outputs:
  - raw_transcript_excerpt
  - private_case_detail
revision_reason: adds cross-gate dependency tracking
```

## Research question opened

How can MC represent dependency between interpretive, evidentiary, privacy, consent, style, and release gates without making the system so heavy that it becomes unusable?
