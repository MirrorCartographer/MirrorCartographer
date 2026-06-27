# Agency-Preserving Memory Pattern

## Architecture question

How can Mirror Cartographer use persistent memory and symbolic interpretation without silently shifting agency away from the user or turning inferred identity into an unchecked system belief?

## Why this matters

Mirror Cartographer is a reflection system. Its value depends on continuity: remembering symbols, tone preferences, prior mappings, recurring body-language metaphors, and unresolved questions. But continuity becomes risky when the system stores or reuses interpretations without user-visible provenance, confidence, consent, and editability.

The core design problem is not simply “memory on/off.” The deeper problem is: **who owns the user model, who can revise it, and how clearly does the interface separate user-stated facts from model-inferred patterns?**

## Current research signal

Recent AI memory research frames conversational memory as an “algorithmic self-portrait”: the system builds a representation of the user from prior conversation. A 2026 empirical study of ChatGPT memories reported that most memory entries in its dataset were system-created rather than directly user-authored, raising agency and sensitivity concerns around stored inferences.

Current product patterns across AI assistants emphasize user controls such as memory review, edit/delete, temporary or incognito chats, and disabling memory. These controls are necessary but not enough for MC because MC’s domain includes emotional-symbolic interpretation, where an inferred pattern can feel more authoritative than it deserves.

Agentic AI governance work adds another useful pattern: persistent systems need authorization boundaries, behavioral records, and accountability chains. For MC, that does not require heavyweight cryptographic infrastructure at first; it does require a local, auditable memory ledger that records why each memory exists and how it may be used.

## Design pattern

### Name

Agency-Preserving Memory Ledger

### Intent

Make every durable memory item inspectable, source-aware, revocable, confidence-bounded, and separated by claim type.

### Rule

MC must never store “the user is X” when it can store “the user said X,” “the system inferred Y from pattern Z,” or “Y is a working hypothesis awaiting confirmation.”

## Required memory classes

1. **User-stated**
   - Directly said by the user.
   - Highest authorship clarity.
   - Still editable/deletable by the user.

2. **User-approved**
   - Proposed by the system and explicitly accepted.
   - Safe for stronger personalization.

3. **System-inferred**
   - Pattern detected by MC.
   - Must carry low/medium/high confidence.
   - Must be presented as inference, not fact.
   - Must be periodically revalidated.

4. **Session-local**
   - Useful during the current session only.
   - Not persisted by default.

5. **Public-safe abstraction**
   - A generalized pattern safe to write into public GitHub artifacts.
   - Must remove names, private events, medical details, exact locations, credentials, and private file links.

## Minimum memory record schema

- `id`
- `created_at`
- `updated_at`
- `memory_class`: user-stated | user-approved | system-inferred | session-local | public-safe-abstraction
- `content`
- `source_pointer`: chat/session/document/source artifact reference when available
- `source_quote_or_summary`: short summary, not full private text unless explicitly allowed
- `confidence`: direct | high | medium | low | unknown
- `sensitivity`: public | internal | private | high-risk-private
- `allowed_uses`: personalization | retrieval | symbolic_mapping | UI_adaptation | research_synthesis | public_artifact
- `prohibited_uses`
- `expiration_or_review_date`
- `user_visible`: true/false
- `user_editable`: true/false
- `last_user_reviewed_at`
- `derived_from_ids`

## Interface requirements

1. Show a **Memory Ledger** view, not just a settings toggle.
2. Let users filter memory by class: stated, approved, inferred, session-local, public-safe.
3. Put inferred memories behind a “working hypothesis” label.
4. Require explicit promotion before an inferred memory can become user-approved.
5. Add “forget,” “edit,” “downgrade to session-only,” and “make public-safe abstraction” actions.
6. Before generating public artifacts, run a public-safety transform that removes private particulars and keeps only generalized design lessons.

## Product implication for Mirror Cartographer

MC should treat memory as a shared map layer, not as hidden system state. The user and the system can both contribute, but the user must be able to see which layer a claim came from:

- “You said this.”
- “You approved this.”
- “MC is guessing this.”
- “This is only active for this session.”
- “This is safe to publish as an abstract pattern.”

That separation is the difference between a reflective instrument and a coercive mirror.

## Implementation sequence

### Phase 1 — Ledger model

Create the memory record schema and store all persistent profile items through it.

### Phase 2 — Claim labeling in responses

When MC uses memory, label the claim type in the response where relevant: stated, approved, inferred, or session-local.

### Phase 3 — Review UI

Add a Memory Ledger screen with class filters and edit/delete/downgrade controls.

### Phase 4 — Public artifact gate

Before writing GitHub/public artifacts, transform private details into public-safe abstractions and record that transform as a ledger event.

### Phase 5 — Revalidation loop

Any system-inferred memory expires or requires review after repeated use, conflict, or age threshold.

## Acceptance tests

1. A user can see every durable memory item MC is using.
2. A user can identify whether each item was stated, approved, inferred, or session-local.
3. MC cannot publish a memory item marked private or high-risk-private.
4. Inferred memories cannot be used as identity claims without visible inference labeling.
5. Public GitHub notes can trace their design pattern to public-safe abstractions rather than private personal material.

## Sources consulted

- https://arxiv.org/abs/2602.01450
- https://www.theverge.com/news/646968/openai-chatgpt-long-term-memory-upgrade
- https://www.theverge.com/news/776827/anthropic-claude-ai-memory-upgrade-team-enterprise
- https://arxiv.org/abs/2605.06738
- https://www.iso.org/standard/81230.html
- https://www.nist.gov/itl/ai-risk-management-framework

## Next research question

What exact UI pattern best helps a non-technical user distinguish between **memory**, **interpretation**, **hypothesis**, and **public-safe abstraction** without making the product feel clinical or bureaucratic?
