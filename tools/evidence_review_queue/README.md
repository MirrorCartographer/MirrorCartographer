# Evidence Review Queue

Public-safe Mirror Cartographer component for routing normalized evidence packets into review queues before hypothesis promotion.

## Purpose

Discovery systems fail when retrieved evidence is treated as uniformly useful. This component scores public-safe evidence packets by source quality, reproducibility, falsification value, missingness, privacy risk, and overclaim risk, then assigns the packet to one review queue.

It improves cure/discovery infrastructure by separating:

- evidence that is ready to support a hypothesis;
- evidence that is useful mainly for falsification;
- evidence that needs source normalization;
- evidence that must be blocked because it leaks privacy or advice claims.

## Input packet shape

Each packet is a JSON object with:

- `id`: stable public-safe packet id.
- `source_status`: `primary`, `secondary`, `preprint`, `institutional`, `synthetic`, or `unknown`.
- `claim_status`: `unreviewed`, `bounded`, `overclaim`, `contradicted`, or `unsupported`.
- `privacy_status`: `public_safe`, `deidentified`, or `private_or_sensitive`.
- `evidence_strength`: `high`, `moderate`, `low`, or `unknown`.
- `reproducibility`: object with `open_code`, `open_data`, and `protocol_available` booleans.
- `measurable_variables`: non-empty list of public-safe variable names.
- `falsification_route`: public-safe string explaining what would weaken or reject the claim.
- `missingness`: list of missing evidence requirements.
- `revision_reason`: string explaining why the packet is being scored now.

## Output shape

The scorer returns:

- `packet_id`
- `score`: 0-100
- `queue`: one of `promote_candidate`, `falsification_priority`, `needs_normalization`, `needs_more_evidence`, `blocked_privacy_or_advice`
- `reasons`: ordered list of scoring reasons

## Acceptance criteria

The component must:

1. Block private or sensitive packets regardless of score.
2. Block obvious overclaims from promotion.
3. Prioritize contradicted packets with falsification routes for review.
4. Promote only packets with measurable variables and a falsification route.
5. Penalize missingness and unknown source/evidence status.
6. Run with only the Python standard library.

## Test command

```bash
python tools/evidence_review_queue/test_score_evidence_review_queue.py
```

## Privacy boundary

All fixtures are synthetic and public-safe. This component must not contain personal, household, medical, veterinary, financial, location, relationship, credential, or raw transcript details.
