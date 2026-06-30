# Citation Load Boundary Record v0

## Purpose
A record schema for checking whether a public Mirror Cartographer claim asks more from a source than that source can safely or accurately carry.

## Privacy status
Public-safe schema. No private examples or raw transcripts.

## Record fields

- `record_id`: stable identifier.
- `artifact_path`: public artifact path or proposed artifact path.
- `claim_text`: public-safe claim text under review.
- `claim_type`: `definition | product_status | research_claim | safety_claim | evaluation_claim | implementation_plan | index_entry | metaphorical_framing`.
- `source_status`: `public_repo | public_web | uploaded_private_artifact | saved_private_context | generated_synthesis | missing | mixed`.
- `privacy_status`: `public_safe | private_context_used_abstractly | redaction_required | blocked`.
- `claim_status`: `confirmed | directly_supported | partially_supported | inferred | bounded_speculation | unsupported | blocked`.
- `citation_load`: `none | light | partial | adequate | overloaded | blocked`.
- `domain_fit`: `yes | partial | no | unknown`.
- `specificity_fit`: `yes | partial | no | unknown`.
- `temporal_fit`: `current | possibly_stale | stale | timeless | unknown`.
- `authority_fit`: `adequate | limited | weak | wrong_domain | unknown`.
- `boundary_fit`: `preserves_symbol_evidence_boundary | risks_symbol_as_proof | risks_private_context_leakage | risks_authority_overreach | unknown`.
- `missingness_note`: public-safe description of what was not checked.
- `revision_reason`: why the claim was accepted, narrowed, relabeled, or blocked.
- `routing_decision`: `publish | publish_with_label | narrow_claim | add_source | move_to_private | block`.
- `reviewer_note`: public-safe review note.

## Pass condition
A record passes when the routing decision matches source strength, privacy status, and claim consequence level.

## Fail condition
A record fails when a claim is public, confident, or actionable while depending on private context, weak source fit, stale source state, or missing evidence that is not disclosed.