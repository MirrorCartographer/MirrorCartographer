# Context Admission Gate

Date: 2026-06-29
Status: public-safe research note
Attractor: Context Admission

## Core finding

Mirror Cartographer should not treat available context as automatically usable context.

A public-safe compiler, source-boundary bill of materials, influence ledger, claim transport ledger, and release-readiness gate all operate downstream of one missing control: a gate that decides which context may enter the interpretive workspace before an artifact is generated.

Key phrase: **Availability is not admissibility.**

## Why this matters

Long-term AI memory is not neutral storage. Current research frames memory retrieval as a trust boundary because semantically relevant memories can still be contextually inappropriate. In a system like Mirror Cartographer, this means private continuity can improve coherence while also creating risks: over-personalization, cross-domain leakage, inappropriate authority, symbolic overreach, or public artifacts shaped by context that should not have influenced them.

MC therefore needs a Context Admission Gate before interpretation, not merely a redaction step after generation.

## Public-safe architecture claim

A Context Admission Gate evaluates candidate context before use and assigns each item an admission status:

- **admit**: allowed to shape the artifact directly.
- **abstract_only**: may shape high-level architecture, requirements, or evaluation framing, but not specific claims.
- **private_reference_only**: may help the system avoid unsafe exposure, but must not shape public content.
- **exclude**: must not be used for this artifact.
- **needs_review**: uncertain; hold out unless explicitly authorized.

## Required labels

Every admitted context item should carry:

- source status: file, saved context, chat-derived memory, GitHub material, web source, synthetic fixture, or unknown.
- claim status: confirmed, source-bound, inferred, speculative, synthetic, deprecated, or missing.
- privacy status: public, public-safe abstracted, private-sensitive, restricted, or unknown.
- missingness: what is unavailable, stale, ambiguous, or unverified.
- revision reason: why the item was admitted, excluded, downgraded, or reclassified.

## Boundary rule

Private material may shape only:

- architecture understanding
- threat modeling
- consent requirements
- evaluation criteria
- product requirements
- public-safe indexes
- implementation plans

Private material must not publish:

- raw transcripts
- personal identifiers
- household details
- health or animal-care details
- financial details
- location details
- relationship details
- credentials
- private operational history

## Research fit

Recent AI-memory research supports this direction:

- Trustworthy memory search work argues that memory retrieval should be treated as a trust boundary, not a plain similarity task.
- Zero-trust memory architecture research separates storage, extraction, learning, retrieval, and governance.
- Privacy-preserving multi-agent memory work uses provenance and trust scoring to reduce memory poisoning and cross-session risk.
- Human-centric memory research argues that personal memory should remain user-controlled rather than agent-controlled.

## Existing MC fit

Existing MC materials already require epistemic transparency, uncertainty labels, contradiction preservation, mode-specific interpretation rules, resonance feedback, and compression before public release. The Context Admission Gate adds a pre-generation control layer: before MC asks whether an artifact is public-safe, it asks whether the source context should have entered the reasoning workspace.

## Evaluation questions

1. Did any private context influence public content beyond abstract architecture or safety framing?
2. Was every context item assigned a source status, claim status, privacy status, missingness note, and revision reason?
3. Did the gate prevent semantically relevant but contextually inappropriate memory from shaping the artifact?
4. Was resonance treated as feedback rather than proof?
5. Were uncertainty, authority, source-boundary, and release-readiness labels preserved downstream?

## Missingness

- No full raw archive was inspected in this run.
- GitHub state was not exhaustively searched across every repository path.
- Research sources were limited to fresh web search and available file-library snippets.
- The gate is a product/research requirement, not yet implemented runtime code.

## Revision reason

This record extends the previous MC public-safe governance stack by adding the missing pre-generation admission layer. It is not a replacement for redaction, influence logging, release gating, or source-boundary bills of materials; it is the upstream control that decides what is allowed to influence them.
