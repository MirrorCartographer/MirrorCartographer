# Private-to-Public Distillation Record v0

Purpose: record how private architecture context becomes a public-safe MC artifact without exposing private material.

## Required fields

- `record_id`: stable identifier.
- `artifact_path`: public artifact path.
- `created_at`: ISO date.
- `source_status`: one of `public_repo`, `private_context_class_only`, `file_library_private_context_only`, `external_public_research`, `missing`, `inadmissible`.
- `private_source_class`: broad class only; never raw content. Allowed values: `architecture_signal`, `interaction_pattern`, `workflow_constraint`, `evaluation_gap`, `implementation_gap`, `unknown_or_not_used`.
- `public_abstraction_type`: one of `method`, `schema`, `product_requirement`, `research_question`, `evaluation_criterion`, `privacy_safe_index`, `implementation_plan`.
- `claim_status`: one of `supported_public_repo`, `supported_external_research`, `inferred_architecture_need`, `speculative`, `blocked`.
- `privacy_status`: one of `public_safe`, `needs_redaction`, `not_public_safe`, `blocked`.
- `missingness`: list of source, evidence, implementation, or audit gaps.
- `revision_reason`: why the artifact exists or changed.
- `redaction_actions`: list of removed or generalized content classes.
- `claim_downgrades`: list of claims weakened from stronger to safer forms.
- `allowed_next_use`: what future public work may use this record for.
- `blocked_next_use`: what future public work must not infer from this record.

## Validation rule

A record is publishable only if:

- `privacy_status` is `public_safe`;
- `private_source_class` contains no identity-bearing details;
- `public_abstraction_type` is allowed;
- `missingness` is explicit;
- `revision_reason` is present;
- no raw transcript, private event, private diagnosis, private household detail, or private identity detail appears in the text.

## Failure states

- `source_bleed`: private content appears in public artifact.
- `domain_reveal`: abstraction reveals a protected domain.
- `claim_inflation`: pattern becomes evidence or authority.
- `missingness_erasure`: artifact hides what was unavailable or inadmissible.
- `revision_opacity`: artifact changes without saying why.
