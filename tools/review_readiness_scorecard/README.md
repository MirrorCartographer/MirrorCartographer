# Review Readiness Scorecard

Executable Mirror Cartographer component that scores whether public-safe research packets are ready for collaborator review.

It does not judge truth, diagnose, treat, prescribe, or claim discovery. It checks whether a packet has enough labeled structure to be reviewed without smuggling unsupported claims, private residue, or missingness blindness into collaboration.

## Purpose

The cure/discovery ambition needs disciplined collaboration. This tool turns a packet into a review-readiness score with explicit blockers, warnings, and next actions.

It improves collaboration readiness by checking:

- required public-safety labels,
- privacy state,
- claim boundary,
- missingness explicitness,
- falsification path presence,
- evidence route clarity,
- next executable action presence.

## Input shape

A JSON array of packet objects:

```json
[
  {
    "packet_id": "review-001",
    "domain": "longitudinal_pattern_tracking",
    "source_status": "synthetic",
    "claim_status": "hypothesis_only",
    "privacy_status": "public_safe",
    "evidence_route": "observation_cluster",
    "missingness": ["baseline_window"],
    "falsification_status": "counterexample_defined",
    "revision_reason": "new review fixture",
    "implementation_status": "routed",
    "testability": "machine_checkable",
    "next_executable_action": "run effect window comparator"
  }
]
```

## Output shape

```json
{
  "scorecard_version": "mc-review-readiness/v1",
  "summary": {
    "total": 1,
    "review_ready": 1,
    "needs_revision": 0,
    "blocked": 0
  },
  "scorecards": [
    {
      "packet_id": "review-001",
      "score": 90,
      "status": "review_ready",
      "blockers": [],
      "warnings": ["missingness_present"],
      "next_executable_action": "run effect window comparator"
    }
  ]
}
```

## Status rules

- `blocked`: privacy is not public-safe, claim is diagnosis/treatment/cure/discovery proof, required labels are missing, or missingness is not an array.
- `needs_revision`: public-safe but lacks falsification, evidence route, testability, or next action.
- `review_ready`: public-safe, bounded, testable, routed, and still honest about missingness.

## CLI

```bash
python tools/review_readiness_scorecard/score_review_readiness.py \
  --input tools/review_readiness_scorecard/fixtures.synthetic.json \
  --output /tmp/mc_review_readiness.json
```

## Tests

```bash
python tools/review_readiness_scorecard/test_score_review_readiness.py
```

## Acceptance criteria

1. Public-safe hypothesis-only packets with explicit missingness can be review-ready.
2. Private packets are blocked.
3. Cure, treatment, diagnosis, or discovery-proof claims are blocked.
4. Missing required labels are blocked.
5. Missing falsification or next executable action causes revision, not promotion.
6. Output is deterministic JSON.
