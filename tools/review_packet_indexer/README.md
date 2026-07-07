# Review Packet Indexer

Mirror Cartographer executable component for public-safe discovery/care workflows.

## Purpose

Build a deterministic index from evidence or observation review packets so downstream tools can see what is ready for review, what is blocked, what is missing, and what can only be used as a private/internal memory artifact.

This supports the cure/discovery ambition by improving collaboration readiness and evidence-boundary routing without turning observations into medical or veterinary advice.

## Input contract

The CLI accepts a JSON file shaped as:

```json
{
  "packets": [
    {
      "packet_id": "pkt-public-001",
      "domain": "animal_care|medical_literature|longitudinal_observation|hypothesis|collaboration",
      "source_status": "synthetic|public|private|mixed|unknown",
      "claim_status": "observation|hypothesis|review_needed|blocked|ready_for_review",
      "privacy_status": "public_safe|needs_redaction|private_only|unknown",
      "missingness": [],
      "revision_reason": "why this packet was revised or emitted",
      "implementation_status": "draft|validated|blocked",
      "testability": "how this packet can be tested or reviewed",
      "next_executable_action": "the next concrete action",
      "evidence_refs": ["optional public-safe reference labels"]
    }
  ]
}
```

## Output contract

The CLI writes:

```json
{
  "summary": {
    "total_packets": 0,
    "ready_for_review": 0,
    "blocked": 0,
    "needs_redaction": 0,
    "missing_required_fields": 0
  },
  "index": [
    {
      "packet_id": "...",
      "route": "review_queue|redaction_queue|blocked_queue|missingness_queue",
      "domain": "...",
      "reason_codes": ["..."]
    }
  ]
}
```

## Routing rules

1. Missing required label fields route to `missingness_queue`.
2. `privacy_status` of `needs_redaction`, `private_only`, or `unknown` routes to `redaction_queue`.
3. `claim_status` of `blocked` or `implementation_status` of `blocked` routes to `blocked_queue`.
4. Non-empty `missingness` routes to `missingness_queue` unless privacy blocking is present.
5. Only `public_safe` packets with `ready_for_review` or `review_needed` claim status and no missingness route to `review_queue`.

## Usage

```bash
python tools/review_packet_indexer/index_review_packets.py \
  --input tools/review_packet_indexer/fixtures.synthetic.json \
  --output /tmp/review_packet_index.json
```

## Acceptance criteria

- Deterministic output ordering by `packet_id`.
- No private data required by fixtures.
- Blocks unknown privacy state.
- Separates missingness from claim readiness.
- Exits non-zero on malformed JSON or missing top-level `packets` array.

## Test

```bash
python tools/review_packet_indexer/test_index_review_packets.py
```
