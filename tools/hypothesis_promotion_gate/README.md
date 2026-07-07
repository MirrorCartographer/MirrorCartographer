# Hypothesis Promotion Gate

Executable Mirror Cartographer component for deciding whether a candidate hypothesis can move from observation/research memory into a higher claim stage.

## Cure / discovery tie

Cure/discovery work needs disciplined promotion. A repeated signal is not automatically a cause, mechanism, intervention, or cure. This gate blocks premature promotion unless the candidate carries explicit evidence, contradiction, missingness, privacy, source, and falsification metadata.

This is research-organization infrastructure only. It does not diagnose, treat, cure, or advise.

## Interface

Input: JSON array of candidate hypothesis packets.

Required packet fields:

- `hypothesis_id`: stable string id
- `domain`: `human_health`, `animal_care`, `science_literature`, `ai_system`, or `general`
- `statement`: bounded hypothesis statement
- `source_status`: `synthetic`, `user_provided`, `public_source`, `derived`, or `unknown`
- `claim_status`: `hypothesis_candidate`, `falsification_ready`, `evidence_supported`, `advice`, `cure_claim`, or `unknown`
- `privacy_status`: `public_safe`, `redacted`, `contains_private_residue`, or `unknown`
- `evidence_items`: list of evidence ids or summaries
- `contradictions`: list of contradiction ids or summaries
- `missingness`: list of missing fields or uncertainties
- `falsification_tests`: list of proposed tests that could disconfirm the hypothesis
- `mechanism_scope`: `none`, `speculative`, `bounded`, or `established`
- `requested_promotion`: `keep_candidate`, `promote_to_testable`, `promote_to_review`, or `promote_to_action`
- `revision_reason`: why the packet is being evaluated now

Output: JSON object with `results` and `summary`.

Each result emits:

- `hypothesis_id`
- `decision`: `promote`, `hold`, or `block`
- `allowed_stage`
- `reasons`
- `required_actions`
- required MC labels

## Promotion rules

Block when:

- claim status is `advice`, `cure_claim`, or `unknown`
- source status is `unknown`
- privacy status is `contains_private_residue` or `unknown`
- no falsification test exists
- requested promotion is `promote_to_action`

Hold when:

- evidence is sparse
- missingness is not explicit
- contradiction list is absent
- mechanism scope is `none` or `speculative`

Promote only when:

- privacy is public-safe or redacted
- source and claim labels are known
- evidence, contradictions, missingness, and falsification tests are explicit
- requested stage is review or testable, not action

## Run

`python tools/hypothesis_promotion_gate/gate_hypothesis_promotion.py tools/hypothesis_promotion_gate/fixtures.synthetic.json`

## Test

`python tools/hypothesis_promotion_gate/test_gate_hypothesis_promotion.py`

## Acceptance criteria

- Blocks action/cure/advice promotion.
- Holds under-evidenced candidates with explicit next actions.
- Promotes only bounded, falsifiable, public-safe candidates.
- Emits all required Mirror Cartographer labels.
- Uses only synthetic public-safe fixtures.
