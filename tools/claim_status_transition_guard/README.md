# Claim Status Transition Guard

Executable Mirror Cartographer component for preventing unsafe promotion of observations, snippets, or hypotheses into stronger claim states.

## Purpose

The cure/discovery ambition needs a disciplined path from observation to hypothesis to review-ready claim. This guard checks every proposed status transition and blocks jumps that skip missingness, privacy, source-chain, falsification, or review-readiness requirements.

It is not medical or veterinary advice. It is a public-safe process validator.

## Input contract

JSON file containing either a single transition object or an array of transition objects.

```json
{
  "id": "transition.synthetic.001",
  "source_status": "synthetic_fixture",
  "privacy_status": "public_safe",
  "from_claim_status": "observation",
  "to_claim_status": "hypothesis_seed",
  "missingness": [],
  "revision_reason": "route observed cluster into falsifiable seed",
  "evidence_packets": [
    {
      "id": "packet.synthetic.001",
      "source_chain_validated": true,
      "retrieval_boundary_checked": true,
      "outcome_measures_defined": true,
      "falsification_tasks_defined": false,
      "review_readiness_score": 0.42
    }
  ]
}
```

## Claim status ladder

Allowed ordered states:

1. `raw_note`
2. `observation`
3. `normalized_evidence`
4. `hypothesis_seed`
5. `falsification_ready`
6. `review_ready`
7. `collaborator_export_ready`

The guard blocks promotions that skip more than one state unless `revision_reason` contains `explicit_manual_override` and all safety gates pass.

## Validation rules

- `privacy_status` must be `public_safe` or the transition is blocked.
- `missingness` must exist as an array, even when empty.
- `revision_reason` must be a non-empty string.
- all packets must pass `retrieval_boundary_checked` and `source_chain_validated` before leaving `normalized_evidence`.
- `outcome_measures_defined` is required before entering `hypothesis_seed`.
- `falsification_tasks_defined` is required before entering `falsification_ready` or later.
- `review_readiness_score >= 0.8` is required before entering `review_ready` or later.
- direct export requires `review_ready -> collaborator_export_ready` only.

## CLI

```bash
python tools/claim_status_transition_guard/guard_claim_status_transitions.py \
  --input tools/claim_status_transition_guard/fixtures.synthetic.json
```

The CLI prints JSON with `decision`, `blocked_reasons`, and `next_executable_action` for every transition.

## Acceptance criteria

- valid observation-to-hypothesis transition passes.
- missing missingness array blocks.
- private or unknown privacy blocks.
- skipped transition blocks without explicit override.
- export before review blocks.
- review-ready transition requires falsification tasks and readiness score.

## Public-safety labels

- Source status: assistant-generated synthetic implementation.
- Claim status: workflow validation only, not medical/veterinary advice.
- Privacy status: public-safe fixtures only.
- Missingness: explicit array required.
- Revision reason: required for every transition.
- Implementation status: executable CLI with tests.
- Testability: run `python tools/claim_status_transition_guard/test_guard_claim_status_transitions.py`.
- Next executable action: wire between hypothesis promotion, review readiness scorecard, and collaborator export.
