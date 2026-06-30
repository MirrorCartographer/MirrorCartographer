# Context Custody Chain

## Core finding

A context can inform an architecture without becoming a publishable source.

Mirror Cartographer needs an explicit custody chain for every private-to-public transformation: not just whether the final artifact is redacted, but how the system moved from private context to abstracted method, product requirement, evaluation question, or implementation plan.

## Source status

- Public repo source: `MirrorCartographer/MirrorCartographer` README, modified 2026-06-25. Public-safe source.
- File-library architecture sources: Mirror Cartographer specification, atlas, whitepaper, connector atlas, and continuity-style documents. Mixed privacy status; used only for architecture-level inference.
- Saved context / chat-derived architecture: used only as private design memory. Not quoted, not indexed, not exposed.
- Fresh external research: AI memory and RAG trust-boundary work published in 2025-2026.

## Claim status

- Supported by public repo: Mirror Cartographer already frames itself as bounded symbolic reflection, not therapy, diagnosis, oracle, source database, or objective truth engine.
- Supported by public repo: the demo/product language already includes source status, claim status, audit label, evidence boundary, update hook, and feedback loop.
- Supported by private architecture sources: MC repeatedly separates symbolic, evidential, safety, authority, and source lanes.
- Research-aligned: 2026 memory-agent work treats memory retrieval as a trust boundary where semantic relevance alone is insufficient.
- Design proposal: Context Custody Chain is a proposed MC governance layer, not a completed runtime feature unless implemented in code.

## Privacy status

Public-safe to publish:

- Abstract transformation rules.
- Source-boundary labels.
- Claim-routing criteria.
- Missingness ledgers.
- Evaluation criteria.
- Implementation plans.

Not public-safe to publish:

- Raw conversation excerpts.
- Personal, household, medical, animal-care, financial, relationship, credential, or location details.
- Identifying source trails that would allow reconstruction of private context.
- Emotional narrative fragments unless rewritten as generic synthetic fixtures.

## Missingness

- No complete raw conversation export was available as a verified canonical source.
- GitHub code search for the public repo appears limited or unavailable; README was fetched directly.
- Private UI repo exists but was treated as a boundary signal, not a source to expose.
- Runtime implementation status for this exact custody chain is unknown.

## Revision reason

Previous MC mind runs focused on memory admission, source survivability, index admissibility, citation load, and interpretive quarantine. This revision adds the chain between private context and public artifact so that redaction is not treated as the whole privacy model.

## Boundary rule

Do not ask only: “Is this redacted?”

Ask:

1. What private context shaped this public artifact?
2. What transformation removed private content?
3. What claim is now being made?
4. What source is allowed to support that claim?
5. What remains missing or unverifiable?
6. What would require a revision?

## External research alignment

- Zhang et al., “Beyond Similarity: Trustworthy Memory Search for Personal AI Agents,” arXiv, 2026-06-04: memory search should be treated as a trust boundary, because semantic relevance can still be contextually inappropriate.
- Bhardwaj, “SuperLocalMemory,” arXiv, 2026-02-17: memory systems need provenance, isolation, trust scoring, and poisoning defenses.
- Srivastava and He, “MemoryGraft,” arXiv, 2025-12-18: long-term agent memory can become a persistent compromise channel through poisoned experience retrieval.
- Zhou et al., “MemTrust,” arXiv, 2026-01-11: unified AI memory needs governance across storage, extraction, learning, retrieval, and governance layers.

## Public-safe product requirement

Every MC public artifact generated from private-context understanding should include a Context Custody Chain block with these fields:

- source_status
- privacy_status
- transformation_status
- claim_status
- allowed_public_surface
- missingness
- revision_reason
- reviewer_notes

## Evaluation question

Can a reviewer look at a public MC artifact and determine what kind of source shaped it, what privacy transformation occurred, what claims it is allowed to make, and what remains missing, without seeing any private source content?
