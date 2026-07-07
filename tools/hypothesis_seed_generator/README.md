# Hypothesis Seed Generator

Concrete executable component for Mirror Cartographer.

## Purpose

The Hypothesis Seed Generator converts public-safe, evidence-bounded observation summaries into conservative hypothesis seeds that can later be falsified. It does not generate advice, treatment recommendations, diagnoses, veterinary guidance, or cure claims.

This supports the cure/discovery ambition by making hypothesis generation auditable and interruptible before any claim is promoted.

## Input shape

JSON array of observation packets:

```json
[
  {
    "packet_id": "obs-001",
    "domain": "human|animal|literature|environment|mixed",
    "source_status": "synthetic|public|deidentified|unknown|private",
    "claim_status": "observation|summary|candidate_pattern|unsupported_claim|advice|cure_claim",
    "privacy_status": "public_safe|deidentified|unknown|private_residue",
    "missingness": [],
    "signals": ["signal_a", "signal_b"],
    "context_factors": ["factor_a"],
    "contradictions": [],
    "revision_reason": "why this packet exists"
  }
]
```

## Output shape

```json
{
  "generated_at_policy": "static-public-safe",
  "accepted_seeds": [],
  "blocked_packets": [],
  "summary": {
    "accepted_count": 0,
    "blocked_count": 0
  }
}
```

Each accepted seed includes:

- `seed_id`
- `packet_id`
- `domain`
- `hypothesis_seed`
- `claim_status`
- `privacy_status`
- `missingness`
- `falsification_prompts`
- `required_next_evidence`
- `implementation_status`
- `testability`
- `next_executable_action`

## Conservative routing rules

A packet is blocked when:

- privacy status is `unknown` or `private_residue`
- source status is `unknown` or `private`
- claim status is `unsupported_claim`, `advice`, or `cure_claim`
- fewer than two signals are present
- `missingness` is not present as a list
- contradictions are present but not explicitly described

A packet becomes a hypothesis seed only when it is public-safe, bounded, non-advice, and has enough signal structure to produce falsification questions.

## CLI

```bash
python tools/hypothesis_seed_generator/generate_hypothesis_seeds.py \
  tools/hypothesis_seed_generator/fixtures.synthetic.json
```

## Acceptance criteria

1. Blocks unsafe privacy states.
2. Blocks cure/advice claims.
3. Blocks underspecified packets.
4. Emits falsification prompts for accepted seeds.
5. Uses only Python standard library.
6. Uses synthetic public-safe fixtures only.

## Test

```bash
python tools/hypothesis_seed_generator/test_generate_hypothesis_seeds.py
```
