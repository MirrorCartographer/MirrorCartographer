# Index Admissibility Record v0

Status: public-safe schema
Privacy status: contains no private records; defines only metadata fields
Revision reason: added to prevent private-context retrieval from being mistaken for publishable evidence.

## Purpose

A record format for Mirror Cartographer index entries that separates retrieval relevance from claim authority.

## Required fields

- `record_id`: stable public-safe identifier
- `title`: short human-readable title
- `source_status`: one of `public_repo`, `private_contextual`, `file_library_snippet`, `generated_draft`, `external_research`, `implementation_artifact`, `evaluation_result`, `unknown`
- `claim_status`: one of `source_bound`, `bounded_inference`, `hypothesis`, `design_requirement`, `evaluation_criterion`, `implementation_plan`, `unsupported`, `blocked`
- `privacy_status`: one of `public_safe`, `abstracted_private_context`, `sensitive_private`, `secret`, `blocked`
- `missingness`: list of unknowns, absent sources, incomplete audits, or stale-risk notes
- `revision_reason`: why the record was added or changed
- `authority_limit`: one of `may_inspire`, `may_frame_method`, `may_support_hypothesis`, `may_support_requirement`, `may_support_public_claim`, `must_not_use`
- `permitted_outputs`: allowed public artifact types
- `blocked_outputs`: disallowed artifact types
- `supersession_status`: one of `current`, `stale_risk`, `superseded`, `disputed`, `unknown`
- `review_trigger`: condition that requires re-review

## Optional fields

- `related_records`
- `evaluation_hooks`
- `implementation_hooks`
- `external_support`
- `notes`

## Minimal example

`record_id`: `idx-adm-0001`

`title`: `Private architecture signal converted into public-safe method requirement`

`source_status`: `abstracted_private_context`

`claim_status`: `design_requirement`

`privacy_status`: `public_safe`

`missingness`: `Raw source not public; only method-level abstraction allowed.`

`revision_reason`: `Prevents private-context influence from becoming uncited public claim.`

`authority_limit`: `may_support_requirement`

`permitted_outputs`: `schema`, `rubric`, `product requirement`, `implementation plan`

`blocked_outputs`: `raw quote`, `personal case detail`, `diagnostic claim`, `identity-specific inference`

`supersession_status`: `current`

`review_trigger`: `Any attempt to cite or publish private-context content directly.`

## Validation rule

A record is invalid if `privacy_status` is `sensitive_private`, `secret`, or `blocked` and `authority_limit` is anything other than `must_not_use` or `may_inspire` after abstraction.

A record is invalid if `source_status` is `private_contextual` and `permitted_outputs` includes direct quotation, raw transcript, or identity-specific detail.
