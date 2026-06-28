# Oracle Drift Ledger v0

## Source status
Public-safe schema derived from Mirror Cartographer's fixture, runner, oracle, gate, and release-readiness architecture.

## Claim status
Schema proposal. Not a validated standard.

## Privacy status
Public-safe. Contains only abstract fields and no private examples.

## Missingness
Needs implementation in a runnable harness, reviewer calibration, fixture corpus versioning, and repeated regression runs.

## Revision reason
Adds a versioned way to decide whether a fixture mismatch means output failure, oracle drift, fixture ambiguity, lane shift, audience shift, or policy shift.

## Record fields

### Identity
- drift_id
- oracle_id
- fixture_id
- drift_version
- created_date
- status: draft | active | resolved | retired

### Prior expectation
- prior_oracle_version
- prior_expected_source_status
- prior_expected_claim_status
- prior_expected_privacy_status
- prior_expected_lane
- prior_expected_router_state
- prior_expected_release_state

### Observed mismatch
- run_id
- actual_output_summary
- actual_source_status
- actual_claim_status
- actual_privacy_status
- actual_lane
- actual_router_state
- actual_release_state
- mismatch_summary

### Mismatch classification
- mismatch_type: artifact_failure | oracle_underfit | oracle_overfit | ambiguous_fixture | lane_shift | audience_shift | policy_shift | risk_shift | reviewer_disagreement
- confidence: low | medium | high
- hard_boundary_involved: true | false
- hard_boundary_type: privacy | claim_strength | source_provenance | audience_contract | qualified_review | release_state | none

### Source labels
- source_status
- source_note
- source_boundary

### Claim labels
- claim_status
- maximum_allowed_claim_strength
- overclaim_risk

### Privacy labels
- privacy_status
- privacy_boundary
- publication_constraint

### Missingness
- unknowns
- evidence_needed
- reviewer_needed

### Revision decision
- decision: keep_oracle | revise_oracle | retire_oracle | split_fixture | narrow_release | block_release
- proposed_oracle_version
- proposed_revision_summary
- revision_reason
- public_release_impact

### Review
- reviewer_required: none | self_review | domain_review | privacy_review | qualified_review
- reviewer_questions
- reviewer_decision
- unresolved_disagreement

### Next test
- next_fixture_run
- regression_required: true | false
- release_allowed_before_regression: true | false
- next_action

## Default safety rules
- Privacy leakage defaults to artifact failure unless the fixture itself accidentally included non-public material.
- Claim overreach defaults to artifact failure unless the oracle assigned the wrong evidence lane.
- Ambiguous fixtures should be split before expectations are weakened.
- Review disagreement blocks public release until resolved or documented as unresolved.
- Oracle revision requires a revision reason, missingness note, and next regression test.
