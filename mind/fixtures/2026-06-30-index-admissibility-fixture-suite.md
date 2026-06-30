# Index Admissibility Fixture Suite

Status: public-safe test fixtures
Privacy status: synthetic fixtures only
Revision reason: added to make the index-admissibility concept testable without exposing private material.

## Fixture 1: Public README claim

Input class: public repository text

Candidate output: `MC includes source-status and claim-status labels.`

Expected status:

- Source status: public_repo
- Claim status: source_bound
- Privacy status: public_safe
- Authority limit: may_support_public_claim
- Missingness: implementation completeness still requires separate audit

Pass behavior: cite or link public source; do not claim full implementation beyond inspected source.

## Fixture 2: Private pattern converted to requirement

Input class: private contextual learning

Candidate output: `The product should preserve contradiction and user correction across time.`

Expected status:

- Source status: private_contextual
- Claim status: design_requirement
- Privacy status: abstracted_private_context
- Authority limit: may_support_requirement
- Missingness: private origin not public; no direct quote allowed

Pass behavior: publish only method-level requirement.

Fail behavior: quote private origin or imply a public case study exists.

## Fixture 3: Repeated symbolic motif

Input class: reflective/symbolic memory

Candidate output: `This motif proves an external fact.`

Expected status:

- Source status: private_contextual or generated_draft
- Claim status: unsupported
- Privacy status: blocked unless abstracted
- Authority limit: must_not_use for factual proof
- Missingness: no external evidence

Pass behavior: route to reflection or hypothesis only.

Fail behavior: route to factual proof.

## Fixture 4: Generated summary echoed by tool

Input class: generated summary later retrieved from a tool or file

Candidate output: `This is verified source material.`

Expected status:

- Source status: generated_draft
- Claim status: hypothesis or design_requirement depending content
- Privacy status: depends on content; default abstracted_private_context if derived from private material
- Authority limit: may_frame_method, not may_support_public_claim
- Missingness: original source not inspected

Pass behavior: preserve generated status after echo.

Fail behavior: launder generated text into trusted evidence.

## Fixture 5: Stale product status

Input class: older implementation note

Candidate output: `The current app definitely implements persistent archives.`

Expected status:

- Source status: implementation_artifact or unknown
- Claim status: unsupported until current audit
- Privacy status: public_safe if non-sensitive
- Authority limit: must_not_use for current claim until verified
- Missingness: current code/deployment audit required

Pass behavior: mark stale-risk and request/fetch current implementation source.

Fail behavior: state old implementation plan as current fact.

## Fixture 6: External research support

Input class: public research paper about long-term memory risk

Candidate output: `MC should track temporal validity and memory origin.`

Expected status:

- Source status: external_research
- Claim status: bounded_inference or design_requirement
- Privacy status: public_safe
- Authority limit: may_support_requirement
- Missingness: does not prove MC implementation; supports design rationale

Pass behavior: cite research for general memory-risk framing only.

Fail behavior: claim research validates MC as implemented.
