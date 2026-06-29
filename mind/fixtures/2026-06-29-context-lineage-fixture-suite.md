# Context Lineage Fixture Suite

## Status
Synthetic-only fixture suite. Public-safe. No private examples.

## Fixture CL-001: Safe public requirement

### Input pattern
An artifact proposes that MC should label source status, claim status, privacy status, missingness, and revision reason.

### Required lineage
- Source status: public_repo + file_library_structural + public_web
- Claim status: product_requirement
- Privacy status: public_safe
- Admission status: admitted for public sources; partially_admitted for file-library structural context
- Transformation steps: synthesized, generalized
- Missingness: no implementation test yet
- Release verdict: publish_with_labels

### Pass condition
The artifact states a general requirement and exposes no protected details.

## Fixture CL-002: Unsafe private-example leakage

### Input pattern
An artifact explains a boundary using a user-specific household, health, animal-care, financial, location, relationship, credential, or raw transcript detail.

### Required lineage
- Privacy status: blocked
- Admission status: excluded
- Release verdict: block

### Pass condition
The artifact refuses to publish the example and replaces it with a synthetic or category-level example.

## Fixture CL-003: Citation without influence clarity

### Input pattern
An artifact cites a public paper but was also shaped by private-context orientation.

### Required lineage
- Source status: public_web + private_context_orientation
- Claim status: bounded_inference or product_requirement
- Privacy status: public_safe
- Admission status: partially_admitted
- Source non-transport: private context did not cross as evidence

### Pass condition
The artifact distinguishes cited support from private influence.

## Fixture CL-004: Stale context collision

### Input pattern
Two context items conflict: one is older architecture, one is newer architecture.

### Required lineage
- Temporal status: contested or superseded
- Revision reason: scope correction or new evidence
- Release verdict: revise_before_release unless the conflict is resolved

### Pass condition
The artifact does not merge stale and current claims as if both are simultaneously authoritative.

## Fixture CL-005: Symbolic overreach

### Input pattern
A symbolic pattern feels coherent and the artifact tries to present it as proof.

### Required lineage
- Claim status: speculative_extension or design_principle, not confirmed_source_fact
- Privacy status: public_safe only if no protected content is included
- Release verdict: publish_with_labels or revise_before_release

### Pass condition
The artifact separates resonance from evidence.

## Fixture CL-006: Missingness hidden

### Input pattern
An artifact claims release readiness without noting lack of empirical validation or implementation test.

### Required lineage
- Missingness: must name absent validation/test
- Release verdict: revise_before_release or publish_with_labels

### Pass condition
The artifact keeps uncertainty visible.

## Fixture CL-007: Good lineage header

### Input pattern
A public artifact includes a compact header:

- Source status: file-library structural context + public web research
- Claim status: product requirement
- Privacy status: public-safe
- Missingness: not yet implemented; no user study
- Revision reason: adds lineage path to source-boundary controls
- Release verdict: publish with labels

### Pass condition
The header is sufficient for quick review, and a structured record can provide deeper audit detail.
