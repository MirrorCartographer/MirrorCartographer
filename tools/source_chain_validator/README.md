# Source Chain Validator

Executable Mirror Cartographer component for validating whether a research, care, literature, or hypothesis packet has enough source-chain structure to be used downstream.

## Purpose

This gate prevents private notes, vague summaries, uncited claims, or unreviewed observations from being promoted into hypothesis generation, falsification queues, review packets, or collaborator exports.

It supports the cure/discovery ambition by making the evidence boundary explicit: a packet can be interesting without being usable as evidence. The validator keeps those states separate.

## Public-safe scope

- Uses synthetic fixtures only.
- Does not diagnose, treat, prescribe, or provide medical/veterinary advice.
- Does not store personal identifiers.
- Blocks packets with private or unknown privacy status.

## Input shape

A JSON file containing an array of packets:

```json
[
  {
    "packet_id": "pkt.synthetic.001",
    "domain": "medical_literature|animal_care|longitudinal_observation|hypothesis|review_packet",
    "claim_status": "observation|hypothesis|review_ready|blocked|literature_summary|unknown",
    "privacy_status": "public_safe|private|unknown",
    "source_status": "synthetic|first_party_observation|peer_reviewed|clinical_record|unknown",
    "sources": [
      {
        "source_id": "src.synthetic.001",
        "source_type": "synthetic|journal_article|observation_log|vet_record|medical_record|derived_summary",
        "citation": "Synthetic observation fixture",
        "retrieved_at": "2026-07-07",
        "supports": ["claim.alpha"],
        "limitations": ["not real patient data"]
      }
    ],
    "claims": [
      {
        "claim_id": "claim.alpha",
        "text": "Synthetic observation cluster changed after an environmental shift.",
        "claim_type": "observation|interpretation|causal|recommendation|cure_claim",
        "source_ids": ["src.synthetic.001"]
      }
    ],
    "missingness": []
  }
]
```

## Output shape

The CLI emits JSON:

```json
{
  "summary": {
    "total_packets": 3,
    "pass": 1,
    "review": 1,
    "block": 1
  },
  "results": [
    {
      "packet_id": "pkt.synthetic.001",
      "route": "pass|review|block",
      "reasons": [],
      "missingness": [],
      "next_executable_action": "send_to_review_packet_indexer"
    }
  ]
}
```

## Routing rules

### Pass
A packet passes only when:

- `privacy_status` is `public_safe`.
- `missingness` is present, even if empty.
- At least one source exists.
- Every claim has at least one source id.
- Every claim source id resolves to an actual source.
- No claim is a `recommendation` or `cure_claim`.
- Required labels exist: `source_status`, `claim_status`, `privacy_status`, `missingness`.

### Review
A packet routes to review when it is structurally incomplete but not privacy-unsafe or overclaiming.

Examples:

- Empty sources.
- Missing citation text.
- Unknown source status.
- Non-empty missingness.
- Claim source references do not resolve.

### Block
A packet blocks when:

- `privacy_status` is `private` or `unknown`.
- A claim is a `recommendation` or `cure_claim`.
- Required top-level fields are absent.

## CLI

```bash
python tools/source_chain_validator/validate_source_chains.py \
  --input tools/source_chain_validator/fixtures.synthetic.json
```

## Tests

```bash
python tools/source_chain_validator/test_validate_source_chains.py
```

## Acceptance criteria

- Public-safe fixture with complete source chain routes to `pass`.
- Packet with missing citations and unresolved source ids routes to `review`.
- Packet with private status or cure claim routes to `block`.
- Test file exits non-zero on any failed assertion.

## Pipeline position

Recommended location:

`retrieval_boundary_checker -> source_chain_validator -> hypothesis_seed_generator -> falsification_task_queue_builder -> review_readiness_scorecard`
