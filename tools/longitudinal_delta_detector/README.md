# Longitudinal Delta Detector

Executable Mirror Cartographer component for public-safe longitudinal pattern tracking.

## Purpose

The detector converts a deidentified, relative-time signal series into one of four routes:

- `candidate_delta_event`
- `stable_baseline`
- `needs_more_data`
- `block_privacy`

This helps MC separate raw longitudinal memory from discovery-relevant pattern-change events. It is research organization infrastructure only and does not provide medical, veterinary, financial, or personal advice.

## Input shape

Each record is a JSON object:

```json
{
  "id": "fixture_pass_rate_shift",
  "privacy_status": "synthetic_public_safe",
  "source_status": "synthetic",
  "claim_status": "candidate_pattern",
  "series": [
    {"bucket": "t-5", "signal": "initiation_latency", "value": 12.0, "unit": "seconds", "context": "neutral_task"}
  ],
  "minimum_effect_size": 0.25,
  "minimum_points": 6,
  "expected_route": "candidate_delta_event"
}
```

## Public-safety constraints

Allowed privacy values:

- `synthetic_public_safe`
- `deidentified_public_safe`

Time buckets must be relative or coarse, such as `t-5`, `t-1`, or `t`. Absolute timestamps, named locations, addresses, and private identifiers are blocked.

## Acceptance criteria

A valid candidate delta event must:

1. Use public-safe privacy status.
2. Use allowed source and claim statuses.
3. Contain one signal, one unit, and one context per series.
4. Use numeric values.
5. Include at least `minimum_points` observations.
6. Exceed `minimum_effect_size` when comparing baseline half vs recent half.

## Test command

From this directory:

```bash
python test_detect_longitudinal_deltas.py
python detect_longitudinal_deltas.py fixtures.synthetic.json --expect
```

## Discovery link

This component supports cure/discovery infrastructure by allowing MC to notice deidentified longitudinal changes before forming hypotheses. The output should feed a provenance packet, evidence review queue, and falsification ledger before any discovery-memory promotion.
