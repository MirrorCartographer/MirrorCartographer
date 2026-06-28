# LivingViewDiffRecord v0

Source status: public-safe schema derived from MC architectural synthesis.
Claim status: implementation plan and evaluation scaffold.
Privacy status: public-safe; schema only; no private examples.
Missingness: field names are provisional and should be tested against synthetic examples before product use.
Revision reason: adds operational structure to the continuity / permissioned-view line of work.

## Purpose

Represent how one continuity record changes as it becomes different audience-specific views.

## Schema

```yaml
record_id: string_nonidentifying
schema_version: living-viewdiff-record-v0
created_at: iso8601
source_status: enum
  - direct_private
  - direct_public
  - derived
  - synthesized
  - fictional
  - external_research
  - missing
claim_status: enum
  - observation
  - interpretation
  - hypothesis
  - product_requirement
  - research_question
  - evaluation_criterion
  - implementation_plan
  - unsupported
privacy_status: enum
  - private_only
  - permissioned_professional
  - care_team_accessible
  - public_safe
  - aggregate_safe
  - blocked
source_view:
  view_name: string
  allowed_audience: list
  disallowed_audience: list
  allowed_use: list
  prohibited_use: list
transformed_view:
  view_name: string
  allowed_audience: list
  disallowed_audience: list
  allowed_use: list
  prohibited_use: list
transformation:
  transformation_type: enum
    - redaction
    - abstraction
    - claim_downgrade
    - claim_upgrade_with_source
    - clinical_boundary_compile
    - public_method_compile
    - research_aggregate_compile
    - fictionalization
  transformation_reason: string
  preserved_invariants: list
  removed_categories: list
  added_constraints: list
  changed_claims:
    - original_claim_type: string
      transformed_claim_type: string
      reason: string
  lost_information: list
  added_information: list
  missing_information: list
  revision_reason: string
viewdiff_score:
  structural_fidelity_0_to_5: number
  privacy_safety_0_to_5: number
  claim_boundary_0_to_5: number
  audience_fit_0_to_5: number
  evidence_fit_0_to_5: number
next_test:
  test_name: string
  success_criterion: string
  failure_signal: string
  minimum_safe_demo: string
notes:
  source_boundary_note: string
  claim_boundary_note: string
  privacy_boundary_note: string
```

## Required boundary labels

Every record must include:

- source_status
- claim_status
- privacy_status
- missing_information
- revision_reason

## Non-goals

This schema is not a medical record standard, consent-management system, legal compliance framework, or diagnostic system. It is a product-research artifact for tracking meaning transformation across permissioned views.