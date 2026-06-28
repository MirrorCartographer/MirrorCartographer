# Public Release Readiness Card Schema v0

Status: public-safe schema
Date: 2026-06-28

## Object
public_release_readiness_card

## Fields

artifact_id: string
artifact_title: string
artifact_type: enum
- research_note
- schema
- income_note
- care_boundary
- forces_note
- weather_note
- field_log
- genesis_note
- museum_object
- implementation_plan
- evaluation_criterion

source_status: enum
- public_source
- private_context_abstracted
- mixed_sources_abstracted
- unsourced_design_hypothesis
- needs_source

claim_status: enum
- descriptive
- interpretive
- design_hypothesis
- research_question
- implementation_requirement
- evaluated_result
- not_a_domain_claim

privacy_status: enum
- public_safe
- public_safe_after_redaction
- private_only
- needs_privacy_review

transformation_status: enum
- raw
- redacted
- compiled
- summarized
- translated
- fictional_fixture
- aggregate_only

missingness_status: array
- source_gap
- evidence_gap
- review_gap
- test_gap
- audience_gap
- implementation_gap
- no_known_gap

release_decision: enum
- private_only
- public_safe_with_redaction
- public_safe_compiled
- needs_review
- rejected

review_status: enum
- self_check_only
- domain_review_needed
- technical_review_needed
- privacy_review_needed
- ready_for_fixture_test
- ready_for_public_index

evidence_lane: enum
- design
- product
- education
- care_support
- governance
- accessibility
- income
- research
- museum

revision_reason: string
next_test: string

## Pass condition
An artifact can be published only if privacy_status is public_safe, transformation_status is not raw, claim_status is bounded, missingness_status is explicit, and release_decision is public_safe_compiled or public_safe_with_redaction.

## Fail condition
If raw private context is required to understand the artifact, the artifact fails public release and must be rewritten as an abstract method, requirement, question, criterion, index, or plan.
