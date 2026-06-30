# PRD: Evidence Half-Life Layer

## Product goal
Add a temporal-validity layer to Mirror Cartographer so claims, requirements, memories, and public index entries are not reused at their original authority level after their admissibility conditions expire.

## Source status
Public repository README + public-safe architecture files + abstracted saved context + current public AI-memory research.

## Claim status
Product requirement and implementation plan. Not a claim of completed product behavior.

## Privacy status
Public-safe. Uses only abstract governance language.

## User problem
A reflective AI system can accumulate useful continuity while also accumulating stale interpretation, outdated research, superseded consent, or claims that were once bounded but later overused. Users and reviewers need to see when a claim is current, stale, private-derived, unverified, or no longer admissible.

## Functional requirements

1. Every exported MC claim receives temporal validity metadata.
2. The UI displays a visible freshness state: `current`, `review_due`, `stale_retained`, `quarantined`, or `removed`.
3. Public artifacts cannot show private-derived claims unless they have passed abstraction and privacy checks.
4. Product/demo status claims must be verified per external-facing use.
5. Research claims must include last-checked date and refresh trigger.
6. The system must preserve revision reasons when downgrading or removing claims.
7. The user can correct a claim and force downgrade immediately.
8. The export format must include source status, claim status, privacy status, missingness, and revision reason.

## Non-goals

- No diagnosis, treatment, legal, financial, or factual authority claims.
- No publication of private transcript fragments.
- No use of private context as public evidence.
- No automatic escalation from repeated pattern to factual proof.

## Core objects

- `ClaimRecord`
- `SourceBoundary`
- `PrivacyBoundary`
- `HalfLifePolicy`
- `RevisionReason`
- `DowngradeEvent`

## UI surface

Each reflection or public artifact card should show:

- Source status
- Claim status
- Privacy status
- Last checked
- Refresh needed by / refresh trigger
- Missingness note
- Revision reason

## Success criteria

- A stale research claim is downgraded before publication.
- A private-derived abstraction remains abstract and does not expose source content.
- A product status claim cannot be reused without repo/demo verification.
- A user correction immediately updates claim status and revision reason.
- Evaluation reviewers can see why a claim was changed.

## Failure modes

- Freshness labels exist but are not enforced.
- Stale claims remain visually indistinguishable from current claims.
- Private context leaks through examples.
- The system treats time decay as deletion only, losing useful historical reasoning.
- Revision reasons are too vague to audit.

## Revision reason
This PRD extends previous MC source-boundary and memory-admission work by adding decay, refresh, and downgrade mechanics.
