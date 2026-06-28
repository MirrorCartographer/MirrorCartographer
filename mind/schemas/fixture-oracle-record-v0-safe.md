# Fixture Oracle Record v0 Safe

## Source status
Public-safe schema derived from the Mirror Cartographer boundary architecture.

## Claim status
Schema proposal. Not a validated standard.

## Privacy status
Public-safe. Contains only abstract fields and no private examples.

## Missingness
Needs implementation in a runnable harness, reviewer calibration, and a versioned synthetic fixture corpus.

## Revision reason
The broader schema draft was narrowed to keep the public record abstract and avoid enumerating private-data categories too concretely.

## Record fields

### Identity
- oracle_id
- fixture_id
- oracle_version
- created_date
- status: draft | active | retired

### Source expectations
- expected_source_status: synthetic | public | abstracted | mixed | unknown
- required_source_note
- disallowed_source_behavior

### Claim expectations
- expected_claim_status: observation | hypothesis | interpretation | product_requirement | research_question | evaluation_result | refusal | unknown
- maximum_allowed_claim_strength
- required_uncertainty_language
- blocked_claim_pattern

### Privacy expectations
- expected_privacy_status: public_safe | needs_abstraction | hold_private | blocked
- allowed_detail_level
- blocked_detail_pattern

### Evidence lane expectations
- expected_lane: symbolic | operational | product | research | governance | support | mixed
- lane_boundary_rule
- evidence_required_before_release

### Router expectations
- expected_router_state: publish | revise | narrow | abstract | review | hold_private | discard
- expected_blocking_gate
- expected_next_action

### Transformation expectations
- expected_viewdiff_required: true | false
- required_transformation_notes
- disallowed_transformation_pattern

### Review expectations
- reviewer_required: none | self_review | domain_review | privacy_review | qualified_review
- review_reason
- reviewer_questions

### Release expectations
- expected_release_state: public | internal | review_only | blocked
- release_decision_reason
- publication_constraints

### Failure conditions
- hard_fail_if
- soft_fail_if
- warning_if

### Run comparison
- actual_output_summary
- actual_source_status
- actual_claim_status
- actual_privacy_status
- actual_lane
- actual_router_state
- actual_release_state
- pass_fail: pass | fail | partial | not_run
- mismatch_notes
- revision_required
