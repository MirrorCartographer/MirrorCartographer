# Frontier Scout: Temporal Contamination Discovery Gate

Date: 2026-07-05

## Component type

Evaluation criterion + prototype requirement for Mirror Cartographer discovery-memory admission.

## Public-safe frontier signal

Recent scientific-AI evaluation work is converging on a stronger requirement: a system should not receive discovery credit merely for producing the final answer of a known paper, benchmark item, or artifact-exposed conclusion. It should be evaluated on whether it can produce useful, bounded, testable hypotheses under temporal and disclosure constraints.

Relevant public sources:

- OpenAI LifeSciBench: https://openai.com/index/introducing-life-sci-bench/
- Co-Scientist in Nature: https://www.nature.com/articles/s41586-026-10644-y
- LABBench2: https://arxiv.org/html/2604.09554v2
- DBench-Bio: https://arxiv.org/html/2603.03322v1
- ToolUniverse / Zitnik Lab news: https://zitniklab.hms.harvard.edu/news/

## Design implication

Mirror Cartographer should add a **Temporal Contamination Discovery Gate** before a generated hypothesis can be promoted into discovery memory.

The gate asks:

1. Did the hypothesis rely on information that should have been hidden at the evaluation stage?
2. Was the hypothesis generated before the conclusion, paper, or answer was disclosed?
3. Does the record distinguish early inference from late-context recall?
4. Does the hypothesis include measurable variables and a falsification route?
5. Does the source packet separate source status from claim status?

## Hypothesis being converted into an evaluation rule

If MC tracks hypothesis timestamps, source-publication windows, disclosure stage, and conclusion exposure, then it can reduce false discovery credit by distinguishing:

- early bounded inference
- legitimate evidence synthesis
- late recall of already-disclosed conclusions
- contaminated claims
- unsupported overclaims

## Proposed packet shape

```json
{
  "schema_version": "1.0",
  "packet_type": "temporal_contamination_check",
  "packet_id": "tcg_SYNTH_001",
  "hypothesis_id": "hyp_SYNTH_001",
  "generated_at": "2026-07-05T00:00:00Z",
  "evaluation_stage": "abstract_only",
  "source_window": {
    "earliest_source_date": "2026-06-01",
    "latest_allowed_source_date": "2026-06-15",
    "withheld_conclusion_date": "2026-06-30"
  },
  "source_status": "public_primary",
  "claim_status": "candidate_hypothesis",
  "privacy_status": "public_safe_synthetic",
  "conclusion_exposure": "not_exposed",
  "evidence_used": [
    {
      "source_id": "src_SYNTH_001",
      "source_date": "2026-06-12",
      "allowed_at_stage": true,
      "role": "mechanistic_prior"
    }
  ],
  "measurable_variables": [
    {
      "name": "prediction_accuracy_delta",
      "unit": "score_points"
    }
  ],
  "falsification_route": "Reject discovery credit if the hypothesis uses evidence dated after the allowed source window or copies the withheld conclusion without earlier support.",
  "gate_decision": "admit_for_review",
  "revision_reason": "Add temporal separation so discovery memory does not reward recall as discovery."
}
```

## Decision labels

Allowed `gate_decision` values:

- `admit_for_review`
- `admit_as_evidence_synthesis_only`
- `reject_temporal_contamination`
- `reject_missing_falsification_route`
- `reject_missing_measurable_variables`
- `requires_manual_review`

## Acceptance criteria

A packet passes only if:

1. `privacy_status` is public-safe or synthetic.
2. `generated_at` is present.
3. `evaluation_stage` is present.
4. Every cited source has a date.
5. No evidence source exceeds `latest_allowed_source_date` unless the decision is `requires_manual_review` or `admit_as_evidence_synthesis_only`.
6. `conclusion_exposure` is not `exposed` when the decision is `admit_for_review`.
7. At least one measurable variable is present.
8. A falsification route is present.
9. `source_status` and `claim_status` are separate fields.

## Synthetic test cases

### Should pass

- Abstract-only stage; all sources before allowed date; conclusion not exposed; measurable variable present; falsification route present.
- Methods-only stage; later conclusion withheld; hypothesis records uncertainty and remains candidate-level.

### Should fail

- Source date after allowed window but decision says `admit_for_review`.
- Conclusion exposure is `exposed` but packet claims discovery credit.
- No measurable variables.
- No falsification route.
- Private or user-specific identifiers included.
- Source status and claim status collapsed into one field.

## Evidence strength

Moderate. The cited frontier work does not define MC-specific architecture, but multiple independent benchmark directions now emphasize realistic research workflows, temporal separation, artifact-aware evaluation, source quality, tool grounding, expert rubrics, and verification.

## Falsification route for this design

Revise or remove the gate if temporal separation fails to improve reviewer agreement about whether a hypothesis is novel versus recalled, or if it blocks legitimate evidence synthesis that is clearly labeled as synthesis rather than discovery.

## Next executable action

Implement:

- `tools/temporal_contamination_gate/temporal_packet_schema.json`
- `tools/temporal_contamination_gate/fixtures.synthetic.json`
- `tools/temporal_contamination_gate/validate_temporal_packets.py`
- `tools/temporal_contamination_gate/test_validate_temporal_packets.py`

The validator should emit a machine-readable decision object with: `passed`, `decision`, `reasons`, `blocked_fields`, and `next_required_fix`.
