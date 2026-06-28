# EmergentOperatingLoopRecord v0

## Source status
Public-safe schema derived from existing MC packet, compiler, consent-gate, and ViewDiff artifacts. Private material is excluded.

## Claim status
Design schema. Not validated as clinical, therapeutic, legal, financial, or diagnostic infrastructure.

## Privacy status
Public-safe. Fictional or consent-cleared data only.

## Missingness
Needs implementation, scoring fixtures, reviewer rubric, privacy threat model, and UI testing.

## Revision reason
Created to connect prior MC components into one repeatable operating loop.

## Record fields

### 1. loop_id
Unique public-safe identifier.

### 2. fixture_status
Allowed values:
- fictional
- synthetic
- consent-cleared
- public-source-only
- blocked

### 3. source_units
Each unit contains:
- unit_id
- source_status: direct_observation | user_statement | generated_interpretation | external_source | prior_artifact | unknown
- raw_status: absent | abstracted | quoted_public_source | blocked
- source_note

### 4. claim_units
Each unit contains:
- claim_id
- linked_source_unit_ids
- claim_status: observation | feeling | metaphor | inference | hypothesis | external_evidence | action_question | unsupported
- confidence_status: high | medium | low | unknown | not_applicable
- boundary_note

### 5. privacy_units
Each unit contains:
- privacy_status: private_only | trusted_view | professional_question | public_safe_method | research_aggregate | blocked
- rationale
- transformation_required: none | summarize | generalize | anonymize | convert_to_question | remove | block

### 6. minimum_packet
Required fields:
- source_summary
- claim_summary
- privacy_summary
- transformation_summary
- missingness_summary
- revision_summary
- next_test

### 7. compiled_views
Each view contains:
- audience
- allowed_detail_level
- output_text
- blocked_content_categories
- review_required

### 8. viewdiff_ledger
Each ledger row contains:
- from_view
- to_view
- copied
- generalized
- removed
- added
- blocked
- reason

### 9. consent_risk_gate
Fields:
- consent_status: explicit | implied_for_fixture | missing | revoked | not_applicable
- risk_level: low | medium | high | blocked
- risk_reasons
- allowed_next_action

### 10. scorecard
Score 0-2 each:
- source_visibility
- claim_accuracy
- privacy_preservation
- transformation_visibility
- missingness_visibility
- review_boundary
- accessibility
- aesthetic_boundary_clarity

### 11. revision_event
Fields:
- prior_status
- changed_field
- reason
- evidence_or_design_trigger
- new_status

## Pass rule
A loop run passes only if no blocked privacy category appears in a public-safe view and every transformation has a reason.