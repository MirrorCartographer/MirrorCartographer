# CareViewAdapterRecord v0

Source status: public-safe schema derived from MC architectural synthesis and current research alignment.
Claim status: implementation plan and evaluation scaffold.
Privacy status: public-safe; schema only; no private examples.
Missingness: provisional schema; requires testing on synthetic records before product use.
Revision reason: operationalizes the private-to-care-facing transformation route identified by the Care View Adapter Protocol.

## Purpose

Represent how a private expressive continuity record is transformed into a bounded care-facing observation packet.

## Schema

```yaml
record_id: nonidentifying_string
schema_version: care-view-adapter-record-v0
created_at: iso8601
source_status: enum
  - direct_private
  - user_confirmed
  - derived_summary
  - synthetic_demo
  - external_research
  - missing
claim_status: enum
  - observation
  - user_reported_context
  - interpretation
  - hypothesis
  - question_for_professional
  - product_requirement
  - evaluation_criterion
  - implementation_plan
  - unsupported
privacy_status: enum
  - private_only
  - permissioned_care_helper
  - permissioned_professional
  - public_safe_method
  - aggregate_safe
  - blocked
adapter_route:
  source_view: string
  target_view: string
  target_audience: enum
    - self
    - care_helper
    - clinician
    - veterinarian
    - therapist_or_coach
    - researcher_aggregate
    - public_method_reader
  allowed_use: list
  prohibited_use: list
source_partition:
  direct_observations: list
  time_sequence: list
  frequency_or_intensity: list
  actions_already_taken: list
  questions_to_ask: list
  symbolic_or_expressive_context: list
  interpretations: list
  missing_information: list
  blocked_private_categories: list
claim_transformations:
  - source_fragment_category: string
    target_claim_type: string
    transformation_type: enum
      - preserve
      - summarize
      - abstract
      - downgrade
      - quarantine
      - remove
      - convert_to_question
    reason: string
viewdiff:
  preserved_invariants: list
  removed_categories: list
  added_constraints: list
  changed_claims: list
  lost_information: list
  added_information: list
  missing_information: list
  revision_reason: string
quality_scores:
  privacy_safety_0_to_5: number
  claim_boundary_0_to_5: number
  audience_fit_0_to_5: number
  observation_clarity_0_to_5: number
  missingness_visibility_0_to_5: number
  professional_review_fit_0_to_5: number
next_test:
  test_name: string
  synthetic_input_required: string
  success_criterion: string
  failure_signal: string
notes:
  source_boundary_note: string
  claim_boundary_note: string
  privacy_boundary_note: string
  medical_or_care_boundary_note: string
```

## Required labels

Every CareViewAdapterRecord must include:

- source_status
- claim_status
- privacy_status
- missing_information
- revision_reason
- prohibited_use
- medical_or_care_boundary_note

## Non-goals

This schema is not a medical record standard, diagnostic system, triage tool, consent-management system, legal compliance framework, or replacement for professional documentation. It is a public-safe product-research scaffold for care-facing communication boundaries.