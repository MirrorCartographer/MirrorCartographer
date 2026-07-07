# Signal Triage Evaluator

Executable Mirror Cartographer component for public-safe signal triage.

## Purpose

The Signal Triage Evaluator converts public-safe observation clusters into one of four routes:

- `archive_only`: insufficient evidence or too much missingness.
- `watch`: weak but trackable longitudinal signal.
- `review_queue`: enough structure for human/scientific review.
- `falsification_queue`: enough structure to generate counterexample tasks.

It improves the cure/discovery ambition by forcing candidate signals through evidence, missingness, privacy, and claim-status gates before any hypothesis promotion.

This tool does not provide medical or veterinary advice.

## Input shape

JSON file containing an object with:

```json
{
  "clusters": [
    {
      "cluster_id": "synthetic-cluster-001",
      "domain": "human_health|animal_care|literature|system",
      "privacy_status": "public_safe|redacted|private|unknown",
      "claim_status": "observation|candidate_signal|hypothesis|advice|cure_claim",
      "source_status": "synthetic|user_reported_redacted|literature_snippet|unknown",
      "observations": [
        {
          "observed_at": "2026-07-01T12:00:00Z",
          "feature": "public_safe_feature_name",
          "direction": "increase|decrease|present|absent|unknown",
          "severity": 0,
          "context_tags": ["heat", "sleep"]
        }
      ],
      "missingness": ["baseline_missing"],
      "contradictions": [],
      "confounders": ["travel"],
      "candidate_mechanisms": ["mechanism label only, no advice"]
    }
  ]
}
```

## Output shape

JSON object:

```json
{
  "triage_results": [
    {
      "cluster_id": "synthetic-cluster-001",
      "route": "watch",
      "score": 4,
      "blockers": [],
      "reasons": ["repeated_observations"],
      "next_action": "continue_longitudinal_tracking"
    }
  ]
}
```

## Acceptance criteria

1. Blocks private or unknown privacy states.
2. Blocks advice and cure claims.
3. Requires explicit `missingness` arrays.
4. Penalizes contradictions, confounders, and sparse observations.
5. Routes structured, repeated, public-safe clusters to review or falsification.
6. Produces deterministic JSON output.
7. Runs with Python standard library only.

## Usage

```bash
python tools/signal_triage_evaluator/evaluate_signal_triage.py \
  tools/signal_triage_evaluator/fixtures.synthetic.json
```

## Test

```bash
python tools/signal_triage_evaluator/test_evaluate_signal_triage.py
```

## Pipeline position

Recommended placement:

1. observation gap detector
2. temporal confounder annotator
3. effect window comparator
4. signal triage evaluator
5. hypothesis seed generator
6. falsification task queue builder
7. hypothesis promotion gate
