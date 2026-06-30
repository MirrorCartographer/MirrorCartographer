# PRD: Citation Load Boundary

## Problem
Mirror Cartographer already requires source status, claim status, evidence boundaries, audit labels, and feedback loops. A remaining release risk is citation overload: a source may be real, public, and relevant while still being too weak, broad, stale, private-dependent, or indirect to support the claim attached to it.

## Product goal
Add a citation-load boundary to public-facing MC artifacts and future runtime outputs so claims are routed by source strength, not just source presence.

## Non-goals
- Do not expose private context.
- Do not build a medical, diagnostic, legal, financial, or authority system.
- Do not use citations as decoration.
- Do not present research relevance as proof of product effectiveness.
- Do not turn symbolic recurrence into factual causality.

## Users
- Public readers evaluating MC claims.
- Reviewers checking product/research seriousness.
- Builders writing README, whitepapers, proof packets, and demo copy.
- Future users who need visible distinction between metaphor, hypothesis, evidence, and action.

## Required labels
Every public claim above low consequence should support:

- `source_status`
- `claim_status`
- `privacy_status`
- `citation_load`
- `missingness`
- `revision_reason`

## User story
As a reviewer, I want to see whether a cited source actually supports the attached claim so I can distinguish evidence, design inference, product status, and metaphor without needing private transcripts.

## Acceptance criteria
1. A public artifact can label a claim as source-supported, partially supported, inferred, speculative, or blocked.
2. A public artifact can state that private context shaped architecture without exposing private content.
3. Overloaded claims are narrowed, relabeled, sourced, or blocked.
4. Stale or time-sensitive sources require temporal-status review.
5. Claims about product maturity distinguish demo existence from implemented capability.
6. Claims about user impact distinguish research hypothesis from measured outcome.
7. Revision reasons are visible when a claim changes.

## UI/API concept
A future MC audit panel should display:

- Claim: public-safe text.
- Source status: where the support comes from.
- Citation load: none/light/partial/adequate/overloaded/blocked.
- Missingness: what was not checked.
- Revision: what changed and why.
- Routing: publish, narrow, add source, move private, or block.

## Implementation sequence
1. Add schema record.
2. Add fixture suite.
3. Add scorecard.
4. Add lint-like checklist for README/docs/proof packets.
5. Add runtime prompt instruction for generated outputs.
6. Add user-facing audit panel in future prototype.

## Release risk
Without this feature, MC can obey privacy redaction and still publish claims whose remaining public evidence is too weak. That is the exact failure this boundary prevents.