# Fixture Runner Result v0

## Purpose
A schema for recording the result of running a public-safe synthetic fixture through Mirror Cartographer gates, compilers, routers, scorecards, and release-readiness checks.

## Required Fields

- `run_id`: stable identifier for the runner execution.
- `fixture_id`: fixture record being tested.
- `fixture_version`: fixture schema or content version.
- `runner_version`: runner protocol version.
- `run_date`: YYYY-MM-DD.
- `source_status_input`: synthetic | public-source-derived | mixed-public-synthetic.
- `claim_status_input`: observation | inference | hypothesis | method | product_requirement | evaluation_criterion | unsupported_claim.
- `privacy_status_input`: public_safe | abstract_required | review_required | hold_private | discard.
- `evidence_lane_input`: symbolic | product | research | governance | care_support | income | technical | legal_policy | other.
- `audience_contract_input`: intended reader and allowed use.
- `expected_router_state`: publishable | revise | narrow | abstract | review | hold_private | discard.
- `actual_router_state`: publishable | revise | narrow | abstract | review | hold_private | discard.
- `expected_blocking_gate`: source | claim | privacy | audience | evidence | transformation | review | release | revision | none.
- `actual_blocking_gate`: source | claim | privacy | audience | evidence | transformation | review | release | revision | none.
- `expected_viewdiff_summary`: required transformation from fixture source to public output.
- `actual_viewdiff_summary`: observed transformation.
- `missingness_preserved`: yes | partial | no.
- `privacy_boundary_preserved`: yes | partial | no.
- `claim_boundary_preserved`: yes | partial | no.
- `reviewer_requirement_preserved`: yes | partial | no.
- `run_state`: pass | partial_pass | fail | blocked.
- `failure_reason`: required when run_state is fail or blocked.
- `revision_reason`: why the fixture, schema, runner, or router should change.

## Optional Fields

- `risk_notes`: residual risks after route decision.
- `counterexample_triggered`: how a bad system would have mishandled the fixture.
- `regression_tag`: gate, compiler, or router behavior protected by this run.
- `human_review_notes`: public-safe reviewer notes.
- `next_action`: publish | revise_fixture | revise_router | revise_schema | add_reviewer | hold | discard.

## Pass Rule
A runner result passes when expected and actual router state match, expected and actual blocking gate match, privacy and claim boundaries are preserved, and missingness remains visible.

## Failure Rule
A runner result fails when the system routes by tone, beauty, confidence, or narrative coherence instead of by visible source, claim, privacy, evidence, audience, review, and release labels.

## Source Status
GitHub-derived schema built from the public-safe fixture record and fixture runner protocol.

## Claim Status
Implementation schema.

## Privacy Status
Public-safe. Contains no real case details.

## Missingness
No executable validator exists yet.

## Revision Reason
The fixture record schema defines expected behavior; this result schema records actual behavior and divergence.
