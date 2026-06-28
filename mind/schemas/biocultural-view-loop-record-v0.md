# BioculturalViewLoopRecord v0

## Source status
- Public-safe schema derived from MC architecture synthesis.
- No raw private material required to instantiate.

## Claim status
- Schema / implementation planning claim.
- Not validated as a clinical, veterinary, or social-care intervention.

## Privacy status
- Public-safe.
- Designed to prevent direct exposure of personal, household, health, animal-care, relationship, financial, credential, or location details.

## Missingness
- Needs implementation tests, usability review, consent review, professional-review workflow, and adversarial privacy testing.

## Revision reason
Prior records defined permissioned views and ViewDiff. This schema adds an outcome loop connecting observation, professional access, reviewed action, and updated state.

---

## Record fields

### 1. record_id
Opaque identifier. Must not encode identity.

### 2. created_at
ISO datetime.

### 3. source_boundary
Allowed values:
- `private_context_synthesis`
- `public_repository_material`
- `file_library_public_safe_summary`
- `external_public_research`
- `fictional_demo`
- `mixed_public_safe_synthesis`

### 4. private_meaning_state_status
Allowed values:
- `not_included`
- `summarized_in_abstract`
- `available_only_to_private_user`
- `fictional_demo_only`

### 5. observation_packet
Structured non-diagnostic fields:
- time pattern
- recurrence
- intensity scale
- functional impact
- trigger / context
- response to previous action
- observer confidence
- what is unknown

### 6. audience_view
Allowed values:
- `self_private`
- `caregiver_private`
- `medical_professional`
- `veterinary_professional`
- `social_care_professional`
- `research_safe_aggregate`
- `public_method_demo`

### 7. transformation_actions
List of changes performed:
- `omitted_private_detail`
- `generalized_identity_marker`
- `converted_symbol_to_observation`
- `converted_claim_to_question`
- `added_missingness_label`
- `added_review_needed_flag`
- `removed_unsupported_causality`
- `preserved_user_language_as_private_only`

### 8. claim_boundary
Allowed values:
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

### 10. reviewed_action_record
Only populated when action came from a qualified professional, official guidance, or explicitly reviewed care plan.

Fields:
- reviewer_type
- recommendation_summary
- date_reviewed
- confidence_level
- followup_needed

### 11. outcome_update
Fields:
- observed_change
- timeframe
- confidence
- competing_explanations
- next_question

### 12. viewdiff
Required for every non-private view.

Fields:
- retained
- omitted
- generalized
- transformed
- added_boundary_labels
- revision_reason

### 13. risk_flags
Allowed values:
- `medical_authority_risk`
- `veterinary_authority_risk`
- `privacy_reidentification_risk`
- `overclaim_risk`
- `emotional_overdependence_risk`
- `emergency_or_triage_risk`
- `third_party_privacy_risk`

### 14. publication_decision
Allowed values:
- `publish_public_safe`
- `keep_private`
- `needs_review`
- `blocked_rewrite_required`
- `do_not_publish`

---

## Minimal public-safe example

```text
record_id: demo-001
source_boundary: fictional_demo
private_meaning_state_status: not_included
audience_view: medical_professional
claim_boundary: question
privacy_boundary: professional_view_only
transformation_actions:
  - converted_symbol_to_observation
  - converted_claim_to_question
  - added_missingness_label
  - removed_unsupported_causality
risk_flags:
  - medical_authority_risk
publication_decision: publish_public_safe
```

## Invariant
A record is valid only when it shows not just the current view, but what changed to create that view.