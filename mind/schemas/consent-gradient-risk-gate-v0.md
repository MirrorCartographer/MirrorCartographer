# ConsentGradientRiskGate v0

## Source status
- Public-safe schema derived from MC repository synthesis, file-library architectural anchors, and public research.
- No raw private material required to instantiate.

## Claim status
- Schema and implementation-planning claim.
- Not validated as a medical, veterinary, social-care, legal, or privacy-compliance tool.

## Privacy status
- Public-safe.
- Designed to reduce exposure of personal, household, health, animal-care, relationship, financial, credential, location, or raw transcript details.

## Missingness
- Needs implementation tests.
- Needs professional review for care-adjacent use.
- Needs legal/privacy review before deployment in regulated environments.
- Needs adversarial testing for re-identification by repeated summaries.

## Revision reason
Adds an explicit gate before permissioned views. Prior MC schemas described views and ViewDiff; this schema decides whether a view may be generated, shared, rewritten, or blocked.

---

## Record fields

### 1. gate_id
Opaque identifier. Must not encode identity.

### 2. source_boundary
Allowed values:
- `private_context_synthesis`
- `public_repository_material`
- `file_library_public_safe_summary`
- `external_public_research`
- `fictional_demo`
- `mixed_public_safe_synthesis`

### 3. input_record_type
Allowed values:
- `private_meaning_state`
- `observation_packet`
- `professional_question_packet`
- `care_view_adapter_record`
- `biocultural_view_loop_record`
- `public_method_note`
- `research_safe_aggregate`

### 4. intended_audience
Allowed values:
- `self_private`
- `named_caregiver_private`
- `medical_professional`
- `veterinary_professional`
- `social_care_professional`
- `research_team_with_review`
- `public_reader`
- `unknown_audience`

### 5. consent_scope
Allowed values:
- `none`
- `private_processing_only`
- `single_named_recipient`
- `specific_professional_context`
- `time_limited_team_access`
- `research_safe_aggregate_only`
- `public_safe_method_only`

### 6. consent_depth
Allowed values:
- `not_requested`
- `implicit_insufficient`
- `explicit_general`
- `explicit_purpose_bound`
- `explicit_purpose_bound_revocable`
- `professional_or_legal_review_required`

### 7. revocation_status
Allowed values:
- `not_applicable`
- `active`
- `revoked`
- `expired`
- `unclear`

### 8. claim_boundary
Allowed values:
- `private_expression`
- `observation`
- `question`
- `hypothesis`
- `professional_reviewed_action`
- `outcome_report`
- `research_question`
- `unsupported_do_not_publish`

### 9. privacy_boundary
Allowed values:
- `private_only`
- `share_with_named_person_only`
- `professional_view_only`
- `research_safe_aggregate_only`
- `public_safe_method_only`
- `do_not_share`

### 10. risk_flags
Allowed values:
- `medical_authority_risk`
- `veterinary_authority_risk`
- `social_care_authority_risk`
- `privacy_reidentification_risk`
- `repeated_summary_reconstruction_risk`
- `third_party_privacy_risk`
- `dependent_being_privacy_risk`
- `overclaim_risk`
- `coerced_consent_risk`
- `emotional_overdependence_risk`
- `emergency_or_triage_risk`
- `financial_or_credential_exposure_risk`

### 11. required_transformations
Allowed values:
- `omit_private_detail`
- `generalize_identity_marker`
- `remove_location_marker`
- `remove_financial_marker`
- `convert_symbol_to_observation`
- `convert_claim_to_question`
- `remove_unsupported_causality`
- `add_missingness_label`
- `add_review_needed_flag`
- `aggregate_only`
- `block_publication`

### 12. viewdiff_required
Boolean. Must be true for every non-private output.

### 13. professional_review_required
Boolean. Must be true for any care-adjacent output that could influence action.

### 14. publication_decision
Allowed values:
- `allow_private_only`
- `allow_named_recipient_only`
- `allow_professional_view_only`
- `allow_research_safe_aggregate`
- `allow_public_safe_method`
- `rewrite_required`
- `blocked_do_not_publish`

### 15. missingness
Required list of unknowns, absent sources, unvalidated assumptions, and review gaps.

### 16. revision_reason
Required for every rewrite, block, or downgrade.

---

## Validity rule
A gate result is valid only when it can explain why a view was allowed, rewritten, downgraded, or blocked.

## Minimal public-safe example
record_id: gate-demo-001
source_boundary: fictional_demo
input_record_type: observation_packet
intended_audience: medical_professional
consent_scope: specific_professional_context
consent_depth: explicit_purpose_bound_revocable
claim_boundary: question
privacy_boundary: professional_view_only
risk_flags:
- medical_authority_risk
- privacy_reidentification_risk
required_transformations:
- convert_claim_to_question
- add_missingness_label
- add_review_needed_flag
viewdiff_required: true
professional_review_required: true
publication_decision: allow_professional_view_only