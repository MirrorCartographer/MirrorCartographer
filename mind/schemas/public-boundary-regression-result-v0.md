# Public Boundary Regression Result v0

## Source status
Public-safe schema derived from Mirror Cartographer fixture, oracle, drift, and release-readiness architecture.

## Claim status
Schema proposal. Not a validated standard.

## Privacy status
Public-safe. Field list only.

## Missingness
Needs implementation, fixture corpus, reviewer calibration, and regression history.

## Revision reason
Adds a repeatable result record for rerunning public-safe boundary fixtures.

## Record fields

### Identity
- regression_id
- run_date
- fixture_pack_id
- harness_version
- operator
- status: draft | complete | blocked | retired

### Inputs
- fixture_ids
- oracle_ids
- schema_versions
- gate_versions
- router_versions
- release_rule_versions

### Boundary scores
- source_status_result: pass | fail | review
- claim_status_result: pass | fail | review
- privacy_status_result: pass | fail | review
- lane_result: pass | fail | review
- audience_contract_result: pass | fail | review
- transformation_result: pass | fail | review
- release_state_result: pass | fail | review
- revision_label_result: pass | fail | review

### Mismatch handling
- mismatches_detected
- mismatch_ids
- drift_records_required
- drift_records_created
- blocking_gate
- route_decision: pass | revise | split_fixture | revise_oracle | narrow_release | block_release

### Labels
- source_status
- claim_status
- privacy_status
- missingness
- revision_reason

### Release decision
- release_candidate_status: clean | blocked | review_required | partial
- release_allowed: true | false
- release_note

### Next action
- next_fixture_pack
- next_review
- next_schema_update
- next_regression_required: true | false

## Default rule
A single hard-boundary failure blocks public release until the mismatch is resolved or deliberately narrowed.
