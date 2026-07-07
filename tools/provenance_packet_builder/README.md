# Provenance Packet Builder

Builds public-safe provenance packets for Mirror Cartographer review workflows.

This component turns routed observation, literature, animal-care, and hypothesis records into a single auditable packet that can be handed to downstream gates without pretending that an observation is proof, advice, or a cure.

## Purpose

Mirror Cartographer needs a durable boundary between:

- what was observed,
- where it came from,
- what evidence route it belongs to,
- what is missing,
- what would falsify it,
- whether it is safe to reuse publicly,
- and what the next review action is.

The provenance packet is the collaboration-ready container for that boundary.

## Input shape

A JSON array of records:

```json
[
  {
    "id": "seed-001",
    "domain": "animal_care",
    "summary": "Synthetic observation cluster about timing and response.",
    "source_status": "synthetic",
    "claim_status": "observation_only",
    "privacy_status": "public_safe",
    "evidence_route": "animal_care_observation",
    "missingness": ["baseline_measurement"],
    "falsification_status": "needs_counterexample",
    "revision_reason": "new synthetic fixture",
    "implementation_status": "routed",
    "testability": "machine_checkable",
    "next_executable_action": "compare against baseline window"
  }
]
```

## Output shape

A JSON object:

```json
{
  "packet_version": "mc-provenance-packet/v1",
  "packet_status": "review_ready",
  "packets": [
    {
      "packet_id": "prov-seed-001",
      "record_id": "seed-001",
      "domain": "animal_care",
      "public_safe": true,
      "review_route": "needs_review",
      "labels": {
        "source_status": "synthetic",
        "claim_status": "observation_only",
        "privacy_status": "public_safe",
        "missingness": ["baseline_measurement"],
        "revision_reason": "new synthetic fixture",
        "implementation_status": "routed",
        "testability": "machine_checkable",
        "next_executable_action": "compare against baseline window"
      },
      "claim_boundary": {
        "allowed": ["organize", "review", "compare", "falsify"],
        "blocked": ["diagnose", "prescribe", "claim_cure", "claim_discovery"]
      }
    }
  ],
  "blocked": []
}
```

## Acceptance criteria

1. Every input record must include the required public-safety labels.
2. Private, unknown, or missing privacy states must block export.
3. Cure, diagnosis, treatment, or discovery claims must block export unless explicitly marked as `review_only` or `hypothesis_only`.
4. Missingness must be explicit as an array, even when empty.
5. Output must preserve the next executable action for downstream automation.
6. Output must be deterministic and stable for tests.

## CLI

```bash
python tools/provenance_packet_builder/build_provenance_packets.py \
  --input tools/provenance_packet_builder/fixtures.synthetic.json \
  --output /tmp/mc_provenance_packets.json
```

## Tests

```bash
python tools/provenance_packet_builder/test_build_provenance_packets.py
```

## Cure/discovery tie-in

This does not make medical or veterinary claims. It improves the cure/discovery ambition by making every claim carry its provenance, privacy state, missingness, falsification status, and next executable action before it can enter review, collaboration, or hypothesis promotion.
