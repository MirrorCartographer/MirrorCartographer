# Release Scope Record v0

Purpose: classify a public Mirror Cartographer artifact before release.

## Required fields

- `artifact_id`
- `artifact_title`
- `release_scope`
- `source_status`
- `claim_status`
- `privacy_status`
- `proof_burden`
- `allowed_content`
- `blocked_content`
- `missingness`
- `revision_reason`
- `release_verdict`

## Allowed release scopes

- `method`
- `product_requirement`
- `evaluation`
- `research_question`
- `privacy_safe_index`
- `implementation_plan`
- `public_claim`

## Source status values

- `public_github`
- `private_context_abstracted`
- `file_library_chunk`
- `web_research`
- `mixed`
- `unknown`

## Claim status values

- `confirmed_public`
- `research_grounded`
- `inference`
- `proposal`
- `speculation`
- `unknown`

## Privacy status values

- `public_safe`
- `needs_revision`
- `private_only`
- `unknown`

## Verdict values

- `publish`
- `revise_before_publish`
- `private_only`
- `blocked`

## Default rules

- A public claim needs public or otherwise shareable support.
- A product requirement must not imply that the feature already exists unless verified.
- An implementation plan must name missing verification.
- An evaluation artifact must use synthetic or fully safe examples.
- A method note may publish abstract workflow without exposing private source material.

## Key phrase

Scope before polish.
