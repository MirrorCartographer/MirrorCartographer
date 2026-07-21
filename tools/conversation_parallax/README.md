# Conversation Parallax

Conversation Parallax is the public-safe proof layer for a private conversational understanding system.

Each run creates two readers over the same complete, authorized conversation corpus:

1. **Conversational Reader** — follows the exchange from beginning to end, preserving sequence, turn-taking, repairs, tone changes, commitments, and unresolved threads.
2. **Semantic Reader** — reorganizes the same exchange by concepts, claims, constraints, symbols, evidence, contradictions, decisions, and latent structure rather than chronology.

The readers receive different background profiles on every run. They produce independent interpretations, then discuss agreements, disagreements, omissions, and changes from prior community members. The new pair joins the accumulated community rather than replacing it.

## Privacy boundary

Raw private transcripts remain in the private repository or private archive. The public repository receives only:

- schemas and validators;
- synthetic fixtures;
- redacted or abstracted run receipts;
- capability metrics;
- disagreements and revisions that contain no private source content;
- cryptographic digests that prove continuity without publishing the underlying conversation.

## Run object

Every public-safe run records:

- run and corpus digests;
- two distinct background profiles;
- both reader modes;
- independent theses;
- agreements and disagreements;
- notes inherited from the existing community;
- changes contributed by the new pair;
- privacy review;
- provenance and validation results.

The canonical schema lives in `community_protocol.json`. Run receipts live under `runs/` and validate with:

```bash
python tools/conversation_parallax/validate_community_log.py \
  tools/conversation_parallax/runs/0000-bootstrap.json
```

## Execution boundary

The public validator proves the log structure, continuity chain, distinct-reader constraint, background diversity, and privacy classification. The private worker plane performs the actual authorized chat reading and stores raw evidence privately.

A public receipt never proves that a interpretation is true. It proves that two explicitly different reading procedures examined the same authorized corpus, compared their views, preserved disagreement, and joined a cumulative review community.
