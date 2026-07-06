# Collaboration Readiness Gate

Purpose: prevent Mirror Cartographer discovery artifacts from being shared with collaborators, grant programs, labs, repositories, or research institutions until the packet is public-safe, bounded, testable, and clear about missingness.

This is discovery infrastructure, not medical or veterinary advice. It converts a proposed external opportunity into an auditable packet with claim status, privacy status, evidence basis, collaboration fit, missingness, falsification route, and next executable action.

## Acceptance criteria

A collaboration packet passes only when it:

1. contains no private identifiers or raw transcript-derived details;
2. separates source status from claim status;
3. states what the collaborator would evaluate or contribute;
4. includes at least one concrete artifact path or prototype requirement;
5. includes a falsification route;
6. includes missingness and next executable action;
7. does not frame medical or animal-care content as diagnosis, treatment, or advice.

## Test command

```bash
python tools/collaboration_readiness_gate/test_score_collaboration_packets.py
```

## Downstream use

Place this gate after evidence normalization and before outreach, grant targeting, source-map publishing, or collaborator packet export.
