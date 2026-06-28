# Evidence Lane Packet v0

Status: public-safe schema draft
Date: 2026-06-28

## Source status
- Source basis: abstracted Mirror Cartographer architecture; public-safe research synthesis.
- Private context included: none.

## Claim status
- Schema proposal, not validated standard.

## Privacy status
- Public-safe.

## Missingness
- No formal JSON Schema implementation yet.
- No automated validator yet.

## Record fields

### identity
- `packet_id`
- `created_at`
- `version`
- `audience_view`
- `publication_status`

### source labels
- `source_status`: private_context | public_source | synthetic_fixture | user_supplied_public | mixed_public_safe
- `source_boundary_note`
- `source_citation_required`: yes | no | internal_only

### claim labels
- `claim_text`
- `claim_status`: observation | interpretation | hypothesis | product_requirement | research_question | implementation_plan | unsupported | blocked
- `claim_confidence`: low | medium | high | not_applicable
- `blocked_claim_reason`

### evidence lane
- `evidence_lane`: product_design | software_implementation | user_research | AI_governance | education_or_literacy | social_care_support | medical_or_clinical_support | creative_artifact | business_or_income | personal_reflection_private_only
- `permissible_evidence`
- `impermissible_evidence`
- `review_authority`
- `next_evidence_changing_action`

### privacy labels
- `privacy_status`: private_only | transformed_public_safe | public | restricted_professional | aggregate_only
- `sensitive_content_removed`: yes | no | not_applicable
- `reidentification_risk`: low | medium | high
- `consent_requirement`

### transformation labels
- `transformation_type`: redaction | abstraction | compilation | summarization | fictionalization | ViewDiff | none
- `transformation_note`
- `meaning_preserved`
- `details_removed`

### missingness labels
- `known_missing`
- `unknown_missing`
- `staleness_risk`
- `needs_review_by`

### revision labels
- `revision_reason`
- `revision_scope`: minor | material | safety | source_update | claim_update | privacy_update
- `supersedes`
- `next_version_trigger`

## Pass condition
A packet is publishable only when:
1. the evidence lane is named,
2. sensitive details are removed or transformed,
3. unsupported claims are blocked or downgraded,
4. missingness is explicit,
5. the next evidence-changing action is concrete,
6. the ViewDiff can explain what changed between private and public views.

## Fail condition
A packet fails if symbolic resonance is presented as domain evidence, if a private detail leaks into a public view, or if a claim lacks a review path.