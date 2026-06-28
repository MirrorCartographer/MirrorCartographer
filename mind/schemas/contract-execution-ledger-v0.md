# Contract Execution Ledger Schema v0

## Purpose

A public-safe schema for tracking whether a transformed Mirror Cartographer artifact obeyed its declared audience contract through transformation, review, release, feedback, and revision.

## Source status

Public repository synthesis plus public research on inspectable AI, provenance, transparency-by-design, model passports, and health AI documentation governance.

## Claim status

Draft schema. Not validated, certified, clinical, legal, or regulatory guidance.

## Privacy status

Public-safe. No private transcript content or sensitive personal context is included.

## Required fields

### Identity

- ledger_id
- parent_packet_id
- parent_audience_contract_id
- artifact_title
- artifact_path_or_surface
- created_date
- revision_date

### Contract fields

- intended_audience
- allowed_purpose
- forbidden_purpose
- evidence_lane
- source_visibility
- claim_ceiling
- privacy_ceiling
- review_burden
- release_decision

### Execution fields

- transformation_operations
- removed_information_classes
- generalized_information_classes
- fictionalized_information_classes
- downgraded_claims
- viewdiff_summary
- claim_ceiling_check
- privacy_ceiling_check
- forbidden_purpose_check
- audience_fit_check
- source_visibility_check

### Review fields

- reviewer_required
- reviewer_type
- reviewer_status
- review_notes_public_safe
- unresolved_review_flags

### Release fields

- release_state
- release_surface
- release_date
- release_warning_needed
- release_warning_text
- rollback_available
- supersedes
- superseded_by

### Feedback and revision fields

- feedback_received
- feedback_type
- revision_trigger
- revision_reason
- revision_summary
- remaining_missingness
- next_test

## Status vocabularies

### claim_ceiling_check

- within_ceiling
- may_exceed_ceiling
- exceeds_ceiling
- unclear

### privacy_ceiling_check

- within_ceiling
- may_exceed_ceiling
- exceeds_ceiling
- unclear

### reviewer_status

- not_required
- required_not_started
- in_review
- reviewed_pass
- reviewed_revise
- reviewed_hold
- domain_review_required

### release_state

- private_only
- internal_only
- public_safe_draft
- released
- released_with_warning
- held
- withdrawn
- superseded

## Minimum pass rule

An artifact may be marked public-safe only if:

- audience contract exists,
- evidence lane is declared,
- claim ceiling check is within_ceiling,
- privacy ceiling check is within_ceiling,
- forbidden purpose check is pass,
- source visibility check is pass,
- review status satisfies the review burden,
- missingness is explicit,
- revision reason exists when any material change occurred.

## Missingness

- This schema does not determine truth.
- This schema does not determine clinical safety.
- This schema does not replace legal, medical, compliance, or domain review.
- This schema does not prove that a user understood the artifact.

## Revision reason

Added because prior audience-contract work declared the boundary but did not provide a structured record for whether the boundary was obeyed.
