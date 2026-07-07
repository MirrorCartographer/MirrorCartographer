# Effect Window Comparator

Executable Mirror Cartographer component for longitudinal falsification.

## Purpose

The Effect Window Comparator tests whether a candidate intervention, exposure, context shift, or care change has enough before/after evidence to be treated as a candidate signal. It does not prove causality. It blocks premature cure, treatment, veterinary, or discovery claims when the time window is sparse, confounded, privacy-unsafe, or missing counter-observations.

This helps the cure/discovery ambition by forcing claims into a falsifiable shape:

- What changed?
- What outcome should move?
- When should the outcome move?
- What baseline exists before the change?
- What happened after the change?
- What confounders or missing fields prevent promotion?

## Input

JSON object with this shape:

```json
{
  "packet_id": "synthetic-packet-001",
  "source_status": "synthetic_public_safe",
  "claim_status": "candidate_effect",
  "privacy_status": "public_safe",
  "revision_reason": "initial synthetic test",
  "comparison": {
    "entity_kind": "animal|human|system|literature",
    "change_label": "short public-safe label",
    "change_timestamp": "2026-07-01T10:00:00Z",
    "expected_direction": "increase|decrease|stabilize|unknown",
    "expected_window_hours": 72,
    "outcome_metric": "public-safe metric label",
    "minimum_baseline_points": 2,
    "minimum_followup_points": 2
  },
  "observations": [
    {
      "timestamp": "2026-06-30T10:00:00Z",
      "phase": "baseline|followup",
      "metric_value": 4.0,
      "unit": "ordinal_0_10",
      "source_type": "self_report|care_log|measurement|literature_note|synthetic",
      "confounders": ["travel"],
      "missingness": []
    }
  ],
  "missingness": []
}
```

## Output

The CLI emits a JSON decision packet:

```json
{
  "packet_id": "synthetic-packet-001",
  "decision": "candidate_signal|inconclusive|blocked",
  "baseline_count": 2,
  "followup_count": 2,
  "baseline_mean": 5.0,
  "followup_mean": 2.5,
  "direction_observed": "decrease",
  "claim_status": "candidate_effect_not_causal",
  "privacy_status": "public_safe",
  "missingness": [],
  "blockers": [],
  "warnings": [],
  "next_executable_action": "send_to_contradiction_ledger"
}
```

## Decisions

- `blocked`: unsafe privacy state, missing required labels, invalid timestamps, missing metric values, or impossible comparison config.
- `inconclusive`: not enough baseline/follow-up points, follow-up outside expected window, unknown direction, or confounder burden too high.
- `candidate_signal`: minimum before/after evidence exists and observed direction matches expected direction. This is still not causal.

## CLI

```bash
python tools/effect_window_comparator/compare_effect_windows.py tools/effect_window_comparator/fixtures.synthetic.json
```

## Tests

```bash
python tools/effect_window_comparator/test_compare_effect_windows.py
```

## Acceptance criteria

1. Rejects non-public-safe or private packets.
2. Requires explicit source, claim, privacy, missingness, and revision labels.
3. Requires baseline and follow-up observations.
4. Computes baseline and follow-up means only from valid observations.
5. Blocks or routes sparse, confounded, or malformed comparisons.
6. Never emits medical/veterinary advice or cure claims.
7. Produces deterministic JSON suitable for downstream hypothesis/falsification queues.
