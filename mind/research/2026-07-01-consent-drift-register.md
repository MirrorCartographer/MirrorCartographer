# Consent Drift Register

## Public-safe finding

Consent is not a static yes/no flag. In reflective AI systems, consent can drift when the use case, audience, retention period, inference layer, or publication boundary changes.

Core rule: **A source may remain present while its permission to speak has expired, narrowed, or changed domain.**

## Source status

- Public repo source: Mirror Cartographer README, especially the stated boundary between symbolic reflection and evidence claims.
- File-library architecture source: abstracted MC continuity and connector materials describing consent, persistence choice, evidence lanes, proof lanes, and missingness ledgers.
- External research source: current AI-memory and RAG security literature on persistent memory poisoning, provenance, privacy-preserving retrieval, and cross-session contamination.
- Private-context handling: used only to infer architectural pressure points; no raw private details, transcripts, personal facts, household facts, health facts, animal-care facts, location facts, financial facts, relationship facts, or credentials are included.

## Claim status

- Supported claim: MC needs a consent state that can change over time, not only a one-time persistence toggle.
- Supported claim: persistent memory and retrieved context create a trust boundary because stored material can later be reused in a different context than the one where it was originally admitted.
- Design hypothesis: consent drift should be represented as a first-class register attached to memory, source clusters, exports, and public-safe derived artifacts.
- Not claimed: that any specific private source has been misused.
- Not claimed: that consent drift can be fully automated without user review.

## Privacy status

Public-safe. This document publishes a governance pattern, not private content.

Allowed contents:

- abstract method
- source-boundary note
- product requirement
- evaluation criterion
- implementation plan
- privacy-safe index field

Blocked contents:

- raw transcript excerpts
- personal identity details beyond already-public repository authorship
- health, animal-care, household, financial, location, relationship, credential, or private biographical detail
- claims whose evidence depends on private facts that cannot be safely disclosed

## Missingness

Current missing pieces:

1. No implemented consent-state schema in the public demo.
2. No tested UI for showing consent drift to the user.
3. No automated downgrade path when a source moves from admissible to restricted.
4. No fixture set proving that public summaries survive without private source details.
5. No export manifest that records what was omitted and why.

## Revision reason

This register is added because previous MC mind artifacts cover admissibility, custody, missingness, abstraction survivability, evidence half-life, and private-to-public distillation, but do not isolate **permission change over time** as its own failure mode.

## Proposed consent states

| State | Meaning | Public-use behavior |
| --- | --- | --- |
| `not_collected` | Source was never captured or available. | Do not infer. Mark missing. |
| `private_context_only` | Source may guide architecture internally. | Publish only abstracted rules. |
| `session_bound` | Source is usable inside a single interaction. | Do not persist or export unless upgraded. |
| `persistent_private` | Source may persist for continuity. | Use only in private reflection. |
| `public_distillable` | Source may inform public abstractions. | Publish method, not raw content. |
| `public_citable` | Source itself may be cited publicly. | Cite directly with boundary labels. |
| `revoked` | Permission no longer holds. | Stop use; retain only deletion/revision reason if safe. |
| `unknown` | Consent state cannot be verified. | Treat as restricted and mark missing. |

## Product requirement

Every memory-like object, source cluster, pattern, export, and derived public artifact should carry:

- `consent_state`
- `consent_scope`
- `allowed_uses`
- `blocked_uses`
- `expiration_or_review_trigger`
- `derived_from_private_context` boolean
- `public_survival_test` result
- `revision_reason`
- `last_reviewed_at`

## Evaluation criteria

A response or artifact passes the Consent Drift Register if:

1. It identifies whether each source is public, private-context-only, missing, or unknown.
2. It avoids treating old permission as current permission.
3. It can explain what changed when a source is downgraded, revoked, or abstracted.
4. It publishes rules and schemas instead of private detail when the source is restricted.
5. It records missingness rather than filling gaps with plausible narrative.
6. It does not use symbolic recurrence as evidence of consent.

## Implementation plan

1. Add consent-state metadata to source records.
2. Add consent review triggers before export, publication, cross-user sharing, model-memory write, and GitHub commit.
3. Add a public-survival test: remove all private source details and check whether the artifact still makes sense.
4. Add a revocation path that downgrades or removes derived artifacts when permission changes.
5. Add a UI label: `Consent status: public / private-context-only / unknown / revoked`.

## Research questions

- How should MC distinguish consent to remember from consent to interpret?
- How should MC distinguish consent to use privately from consent to publish an abstraction?
- What evidence is sufficient to upgrade a source from private-context-only to public-citable?
- How should derived artifacts be handled if an upstream private source is revoked?
- Can consent drift be detected automatically, or should every public-use event require an explicit gate?

## Key phrase

**Permission is not preserved by memory. It has to be re-checked at the boundary where memory becomes action.**
