# Source Survivability Record v0

## Purpose
A compact record for deciding whether a remembered, retrieved, uploaded, generated, or public source may support a Mirror Cartographer claim.

## Record

- `record_id`: stable identifier
- `created_at`: ISO date
- `source_label`: human-readable source description without private leakage
- `source_type`: `public_repo | public_web | file_library | private_context | generated_artifact | live_runtime | unknown`
- `source_status`: `verified | partial | inaccessible | duplicated | stale | superseded | generated | remembered | unknown`
- `privacy_status`: `public_safe | private_architecture_only | private_do_not_publish | sensitive_do_not_use | unknown`
- `claim_lane`: `implementation | product_requirement | evaluation | research_question | method | public_language | safety_boundary | speculative`
- `claim_status`: `supported | bounded_hypothesis | needs_verification | not_supported | blocked`
- `survivability_state`: `usable | usable_with_caveat | architectural_only | private_only | superseded | unresolved | rejected`
- `evidence_boundary`: what the source can and cannot support
- `missingness`: known absence, uncertainty, or access limit
- `revision_reason`: what changed, or why the record exists
- `allowed_public_use`: safe public use
- `blocked_public_use`: prohibited use
- `next_verification_step`: concrete verification path

## Validation rules
1. Any `private_context` source must default to `private_architecture_only` or stricter.
2. `generated_artifact` cannot become `supported` without external verification or implementation evidence.
3. `remembered` source status cannot support implementation claims without repository, runtime, or external confirmation.
4. `public_safe` does not imply `supported`; it only means publication risk is low.
5. `usable_with_caveat` requires explicit missingness.
6. `superseded` requires a revision reason.
7. `rejected` requires a blocked public use entry.

## Public-safe example

- `source_label`: Public README boundary section
- `source_type`: public_repo
- `source_status`: verified
- `privacy_status`: public_safe
- `claim_lane`: safety_boundary
- `claim_status`: supported
- `survivability_state`: usable
- `evidence_boundary`: Supports current public product language and boundary claims; does not prove runtime behavior.
- `missingness`: Runtime behavior not tested by this record.
- `revision_reason`: Public boundary anchor checked.
- `allowed_public_use`: Cite for MC public safety framing.
- `blocked_public_use`: Do not use as proof of therapeutic, diagnostic, or real-world outcome efficacy.
- `next_verification_step`: Test live UI against boundary fixtures.
