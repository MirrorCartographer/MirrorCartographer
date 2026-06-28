# Public-Safe Fixture Record v0

## Purpose
A schema for synthetic test cases used to evaluate Mirror Cartographer gates, compilers, routers, scorecards, and release-readiness decisions without exposing private origin material.

## Required Fields

- `fixture_id`: stable identifier.
- `fixture_type`: clean_public_method | overspecific_private_origin | claim_overreach | missing_source | wrong_audience | health_adjacent_observation | income_offer_overclaim | beautiful_but_uncertain | generated_as_discovered | review_required.
- `fictional_source_packet`: synthetic source text.
- `source_status`: synthetic | public-source-derived | mixed-public-synthetic.
- `claim_status`: observation | inference | hypothesis | method | product_requirement | evaluation_criterion | unsupported_claim.
- `privacy_status`: public_safe | abstract_required | review_required | hold_private | discard.
- `evidence_lane`: symbolic | product | research | governance | care_support | income | technical | legal_policy | other.
- `audience_contract`: intended reader and allowed use.
- `missingness`: known absent evidence, context, reviewer, or implementation.
- `transformation_required`: none | narrow | abstract | rewrite_claim | add_source | add_review | discard.
- `expected_viewdiff`: summary of what must change between source packet and public output.
- `expected_router_state`: publishable | revise | narrow | abstract | review | hold_private | discard.
- `blocking_gate`: source | claim | privacy | audience | evidence | transformation | review | release | revision | none.
- `revision_reason`: why the output changed.
- `release_decision`: internal_only | review_candidate | public_candidate | public_released.
- `reviewer_requirement`: none | domain_reviewer | privacy_reviewer | clinical_reviewer | legal_reviewer | user_review.
- `expected_public_output`: the public-safe transformed artifact.

## Optional Fields

- `scorecard_target`: minimum score or qualitative pass rule.
- `risk_notes`: residual risks after transformation.
- `counterexample`: how a bad system would mishandle the fixture.
- `regression_tag`: gate or compiler that this fixture protects.
- `created_date`: YYYY-MM-DD.
- `revision_history`: short list of meaningful changes.

## Pass Rule
A fixture record passes when the expected router state can be derived from visible labels without relying on hidden private context.

## Failure Rule
A fixture record fails when it requires private source material, hides missingness, overstates evidence, or makes the transformed artifact appear more certain than the source allows.

## Privacy Status
Public-safe schema. Contains no real case details.
