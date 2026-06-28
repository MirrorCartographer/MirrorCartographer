# Public-Safe Mirror Compiler Record v0

## Source status
Public-safe schema derived from existing Mirror Cartographer boundary architecture and current research on AI transparency, uncertainty, and consent-governed documentation.

## Claim status
Schema proposal. Not yet implemented or validated.

## Privacy status
Public-safe. Contains no raw private material.

## Missingness
Needs JSON implementation, UI rendering, validator rules, and fixture-based test coverage.

## Revision reason
Adds a single record shape for the compiler matrix introduced in this pass.

## Record fields

### 1. record_identity
- `record_id`
- `created_at`
- `updated_at`
- `compiler_version`
- `view_name`
- `intended_audience`

### 2. source_units
Each unit must include:
- `unit_id`
- `source_status`: `self_report | observed | imported_document | public_source | model_inference | external_evidence | unknown`
- `source_pointer`: public-safe pointer only; never raw private transcript by default
- `source_date`
- `source_confidence`: `low | medium | high | unknown`

### 3. claim_units
Each unit must include:
- `claim_id`
- `claim_text`
- `claim_status`: `observation | user_meaning | metaphor | hypothesis | inference | evidence_bound | action_question | blocked_claim`
- `confidence`
- `requires_external_review`: boolean
- `not_allowed_claims_triggered`: array

### 4. privacy_gate
- `privacy_status`: `private | personal_archive | care_team | professional_question | public_safe | research_aggregate | blocked`
- `allowed_audience`
- `blocked_fields`
- `generalization_level`: `none | light | moderate | high | aggregate_only`
- `consent_basis`: `explicit | implied_for_private_use | not_available | revoked`

### 5. transformation_gate
- `input_unit_ids`
- `output_unit_ids`
- `transformation_type`: `copy | summarize | abstract | anonymize | aggregate | convert_to_question | remove | block`
- `transformation_reason`
- `semantic_loss_note`
- `risk_reduction_note`

### 6. missingness_gate
- `known_unknowns`
- `needed_sources`
- `stale_sources`
- `uncertain_terms`
- `what_would_change_this`

### 7. review_gate
- `review_required`: boolean
- `reviewer_type`: `self | clinician | veterinarian | legal | technical | privacy | domain_expert | none`
- `review_before_action`: boolean
- `action_boundary`

### 8. viewdiff_ledger
For each view comparison:
- `from_view`
- `to_view`
- `removed`
- `generalized`
- `added_context`
- `downgraded_claims`
- `blocked_claims`
- `reason_for_change`

### 9. evaluation_scorecard
- `source_integrity`: 0-5
- `claim_boundary_integrity`: 0-5
- `privacy_integrity`: 0-5
- `missingness_visibility`: 0-5
- `transformation_visibility`: 0-5
- `review_boundary_integrity`: 0-5
- `beauty_boundary_integrity`: 0-5
- `overall_publishability`: `publish | revise | private_only | block`

## Invariant
No output is public-safe because it feels abstract. It is public-safe only when source, claim, privacy, missingness, transformation, and revision labels survive inspection.
