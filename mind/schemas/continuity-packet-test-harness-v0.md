# Schema: Continuity Packet Test Harness v0

Date: 2026-06-28
Privacy status: public-safe schema
Claim status: implementation proposal

## Purpose
Define a minimal schema for testing whether a Mirror Cartographer continuity packet can be transformed across permissioned views without leaking private material or inflating claim strength.

## Harness object

### harness_id
Stable fictional or synthetic test ID.

### fixture_status
Allowed values:
- fictional
- synthetic composite
- consent-cleared scrubbed example
- public-domain example

### sensitivity_class
Allowed values:
- non-sensitive
- care-adjacent
- health-adjacent
- social-support-adjacent
- identity-adjacent
- mixed-sensitive

### input_modes
Allowed values:
- symbolic
- somatic
- emotional
- narrative
- observational
- question
- correction
- external_source

### packet_fields_required
- source_status
- claim_status
- privacy_status
- view_target
- transformation_note
- missingness_note
- revision_reason
- review_requirement
- next_test

### view_targets
- private_self
- trusted_support
- professional_handoff
- care_team_access
- product_requirement
- public_safe_method
- research_aggregate

### viewdiff_operations
- preserved
- removed
- compressed
- generalized
- translated
- downgraded_claim
- upgraded_after_review
- blocked
- marked_missing
- marked_uncertain

### risk_gate_fields
- consent_scope
- audience
- claim_strength
- sensitivity_class
- exposure_risk
- reconstruction_risk
- professional_review_needed
- publication_allowed

### score_dimensions
Each dimension receives: pass, partial, fail, or not_tested.
- source_traceability
- claim_discipline
- privacy_protection
- missingness_visibility
- transformation_visibility
- audience_fit
- revision_traceability
- practical_usefulness

## Block conditions
Output must be blocked or rewritten when it contains:
- raw transcript detail
- personal identity detail not needed for the public method
- household, financial, location, relationship, credential, animal-care, or health specifics
- unsupported diagnosis, treatment, triage, legal, or financial advice
- professional-facing certainty beyond evidence
- aggregate detail that can reconstruct an individual or household

## Missingness
This is a structural schema only. It is not a privacy model, medical device specification, legal compliance framework, or clinical validation protocol.

## Revision reason
Created to convert the Minimum Complete Continuity Packet from a concept into a testable implementation unit.
