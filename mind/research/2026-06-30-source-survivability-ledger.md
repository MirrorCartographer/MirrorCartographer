# Source Survivability Ledger

## Source status
- Private conversation context: used only as architectural background; not quoted, indexed, or exposed.
- File Library search: public-safe project files and prior exported MC summaries were used to identify abstract architecture patterns.
- GitHub repository: public README verified as the current public boundary anchor.
- Web research: fresh 2026 AI-memory and RAG-security research used to pressure-test the finding.

## Claim status
Public-safe finding: Mirror Cartographer needs a **source survivability layer**: a method for deciding whether a source remains usable when it is partial, duplicated, stale, private, inaccessible, or superseded.

This is a product/governance claim, not a claim that any private source is public, complete, authoritative, or safe to quote.

## Privacy status
Public-safe. This note intentionally excludes personal, household, health, animal-care, financial, relationship, credential, location, and raw transcript details.

## Core finding
A source is not usable simply because it can be remembered. It must survive boundary inspection.

## Why this matters
Mirror Cartographer already separates symbolic reflection from evidence claims. The remaining gap is source-level survival: when a retrieved memory or file is relevant but no longer admissible, the system needs a receipt explaining why it was included, excluded, downgraded, or routed to a safer lane.

## Survivability states
1. **Usable** — current enough, source-bounded, public-safe, and aligned with the claim lane.
2. **Usable with caveat** — relevant but partial, stale, duplicated, or missing verification.
3. **Architectural-only** — allowed to shape method design but not to support public claims.
4. **Private-only** — may not be quoted, indexed, or exposed.
5. **Superseded** — replaced by newer source, correction, or implementation state.
6. **Unresolved** — insufficient source access or contradictory signals.
7. **Rejected** — overclaims, leaks protected context, or collapses metaphor into evidence.

## Required receipt fields
- source_id_or_description
- source_type
- source_status
- privacy_status
- claim_lane
- claim_status
- survivability_state
- evidence_boundary
- missingness
- revision_reason
- allowed_public_use
- blocked_public_use
- next_verification_step

## Product requirement
Before MC publishes or exports a claim, it should attach a source survivability receipt showing whether the claim rests on public source, private architecture-only context, stale memory, generated interpretation, or verified implementation.

## Evaluation criteria
A source survivability pass is successful when a reviewer can answer:
- What source shaped this claim?
- Is the source public, private, generated, remembered, or externally verified?
- What is missing?
- What public use is allowed?
- What use is blocked?
- What would revise this claim?

## Missingness
- Full raw archive access is not assumed.
- GitHub code search indexing is unavailable for the verified public repo state.
- File-library search returns partial snippets and duplicate files; these are useful for orientation but not total-source proof.
- Live deployment behavior was not re-tested in this run.

## Revision reason
Added after repeated boundary artifacts revealed a higher-order gap: MC has many claim gates, but needs a source survival gate to prevent relevance, memory, or duplication from being mistaken for admissibility.

## Key phrase
Do not ask only whether the source exists. Ask whether it survives the claim it is being asked to carry.
