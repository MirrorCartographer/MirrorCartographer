# Context Custody Chain Record v0

## Purpose

A schema for recording how private or mixed-context material influenced a public-safe Mirror Cartographer artifact without exposing private content.

## Record fields

### artifact_id
Stable name for the public artifact.

### artifact_path
GitHub path or public location.

### created_at
ISO date.

### source_status
Allowed values:

- public_repo_verified
- public_external_verified
- private_context_used_for_architecture_only
- file_library_mixed_privacy
- synthetic_fixture
- inferred_from_prior_public_artifacts
- unknown_or_missing

### privacy_status
Allowed values:

- public_safe
- public_safe_after_abstraction
- private_do_not_publish
- mixed_requires_review
- synthetic_only

### transformation_status
Allowed values:

- none_needed
- abstracted_method
- product_requirement
- evaluation_criterion
- research_question
- implementation_plan
- synthetic_fixture
- source_boundary_note
- redacted_summary

### claim_status
Allowed values:

- repo_supported
- file_supported_private_safe_abstraction
- external_research_supported
- design_proposal
- implementation_unknown
- unsupported_do_not_claim

### forbidden_content_check
Required boolean fields:

- contains_raw_transcript
- contains_personal_detail
- contains_household_detail
- contains_health_detail
- contains_animal_care_detail
- contains_financial_detail
- contains_location_detail
- contains_relationship_detail
- contains_credential_detail
- contains_private_identifier

A record is publishable only when all forbidden fields are false.

### allowed_public_surface
Allowed values:

- method
- product_requirement
- evaluation
- schema
- fixture
- index
- implementation_plan
- research_question
- boundary_note

### missingness
List of unavailable, unverifiable, stale, or intentionally withheld source areas.

### revision_reason
Why this artifact exists or changed.

### reviewer_notes
Optional human-readable audit note.

## Publishability rule

A context-custody record is publishable only if it makes the transformation visible without making the original private context reconstructable.
