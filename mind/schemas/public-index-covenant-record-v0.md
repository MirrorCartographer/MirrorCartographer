# Public Index Covenant Record v0

## Purpose

A record format for public-safe indexes that describe source boundaries and claim permissions without exposing private material.

## Required fields

- `record_id`: stable slug.
- `artifact_id`: public artifact, release, page, note, evaluation, or product requirement being indexed.
- `created_at`: ISO date.
- `source_status`: public, private-context-only, file-library-context-only, connector-public, connector-private, web-public, unavailable, mixed.
- `claim_status`: observed, inferred, design proposal, research question, requirement, evaluation criterion, implementation plan, missingness note, revision note.
- `privacy_status`: public-safe, abstracted-from-private, restricted, excluded, requires-review.
- `publishable_source_classes`: source classes that may be cited or described publicly.
- `abstract_only_source_classes`: source classes that may shape methods but not be exposed.
- `excluded_source_classes`: source classes barred from public artifact text.
- `permitted_claim_lanes`: concept, method, product requirement, evaluation, implementation, governance, research question.
- `forbidden_claim_lanes`: personal fact, household detail, health/animal-care detail, financial detail, location detail, relationship detail, credential detail, raw transcript claim, diagnosis, authority claim.
- `missingness`: what was unavailable, incomplete, stale, or intentionally uninspected.
- `revision_reason`: why this artifact exists or changed.
- `review_questions`: questions an auditor should ask before public release.

## Recommended statuses

### Source status

- `public_repository_verified`
- `public_web_verified`
- `file_library_architecture_only`
- `saved_context_architecture_only`
- `private_chat_architecture_only`
- `unverified_memory`
- `unavailable`
- `blocked`

### Claim status

- `directly_supported`
- `source-bounded_inference`
- `design_requirement`
- `evaluation_criterion`
- `implementation_plan`
- `research_question`
- `nonclaim_context`
- `missingness_disclosure`

### Privacy status

- `public_safe`
- `abstracted_private_shape`
- `private_do_not_publish`
- `sensitive_excluded`
- `requires_human_review`

## Release gate

A public artifact fails this schema if it:

1. cites private context as public evidence;
2. describes personal details to prove a design claim;
3. turns symbolic resonance into factual authority;
4. lacks missingness status;
5. lacks revision reason;
6. omits claim-lane limits;
7. makes a general product claim from private anecdotal material.
