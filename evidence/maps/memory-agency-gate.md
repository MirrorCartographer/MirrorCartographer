# Evidence Map — Memory Agency Gate

## Claim tested

Mirror Cartographer should use persistent memory because continuity improves usefulness.

## Revised claim

Persistent memory can improve continuity, but MC should only make memory durable after an explicit agency, privacy, correction, and evidence gate. Memory is not automatically good just because it increases personalization.

## Why this claim needed testing

MC depends on continuity across sessions. That creates value, but it also creates risk: the system may preserve a distorted, over-personal, overconfident, or sensitive model of the user. If MC is a reflective interface, the user must be able to see, correct, reject, or downgrade what the system thinks it knows.

## Evidence basis

### Source 1 — Algorithmic Self-Portrait, 2026

A 2026 arXiv study analyzed 2,050 ChatGPT memory entries from 80 real-world users. It found that 96% of memories in the dataset were created unilaterally by the system, 28% contained GDPR-defined personal data, and 52% contained psychological information about participants. The authors also report that 84% of memories were directly grounded in user context, meaning memory can be useful and faithful while still raising agency and sensitivity concerns.

Public source: https://arxiv.org/abs/2602.01450

### Source 2 — MemPrivacy, 2026

A 2026 arXiv paper proposes privacy-preserving personalized memory for edge-cloud agents. Its core premise is that masking sensitive information can destroy utility, while unprotected cloud memory exposes sensitive user information. The proposed design separates privacy-sensitive spans from semantically useful structure, supporting the MC idea that privacy and usefulness should be co-designed rather than treated as opposites.

Public source: https://arxiv.org/abs/2605.09530

### Source 3 — OpenAI / Anthropic product direction, 2025–2026

Public reporting and product documentation show major AI systems moving toward long-term memory, reference to prior chats, team/project memory, and agentic workplace context. These changes confirm that memory is becoming infrastructure, not a minor feature. They also increase the importance of inspectability, opt-out modes, editing, deletion, and temporary/incognito states.

Public references:

- https://help.openai.com/en/articles/8590148-memory-faq
- https://openai.com/index/memory-and-new-controls-for-chatgpt/
- https://www.theverge.com/news/646968/openai-chatgpt-long-term-memory-upgrade
- https://www.theverge.com/news/776827/anthropic-claude-ai-memory-upgrade-team-enterprise

## Fact / inference separation

### Facts supported by sources

- Conversational AI memory is now a real product direction across major AI systems.
- Memory can improve continuity and personalization.
- At least one empirical study found most observed ChatGPT memory entries were system-initiated, not explicitly user-commanded.
- The same study found memory entries can include personal and psychological information.
- Privacy-preserving memory research treats semantic utility and privacy protection as a joint design problem.

### Inferences for MC

- MC should not treat memory as a passive storage feature; it should treat memory as an authored object.
- MC needs a visible memory ledger, not hidden accumulation.
- Symbolic and emotional memory items need stricter review than ordinary task preferences.
- Public-safe abstractions should be separate from private memory.
- The user should be able to downgrade a memory from durable to session-only or discard.

### Unknowns

- Whether MC users will tolerate reviewing memory frequently.
- Whether agency gates reduce usefulness by adding friction.
- Which memory classes users most often correct or reject.
- Whether symbolic-memory review should be immediate, delayed, or batch-based.

## MC implementation rule

No memory item becomes durable until it passes four gates:

1. Agency gate — Did the user explicitly approve this memory or clearly ask for it to persist?
2. Privacy gate — Does it contain sensitive, personal, health, animal-health, relationship, financial, location, or psychological content?
3. Claim gate — Is this source fact, user statement, system inference, project hypothesis, or unknown?
4. Correction gate — Can the user inspect, edit, downgrade, or delete it later?

## Claim-status labels

Each memory object should carry one of these labels:

- user-confirmed fact
- user preference
- private symbolic note
- system inference
- project hypothesis
- public-safe abstraction
- stale / needs review
- rejected / do not use

## Falsification checklist

The Memory Agency Gate fails if:

- users cannot tell what MC remembers about them;
- memory is created without a visible review state;
- private symbolic notes become public artifacts without abstraction;
- system inferences are presented as facts;
- users cannot edit/delete/downgrade memory;
- memory improves continuity but increases user confusion, distress, or false certainty;
- MC cannot distinguish private animal-health notes from evidence-backed veterinary information.

## Evaluation criterion

A memory feature is acceptable only if a user can answer these five questions within 30 seconds:

1. What does MC remember?
2. Why does MC remember it?
3. Where did it come from?
4. Is it fact, user statement, or inference?
5. How do I edit, downgrade, or delete it?

## Next proof needed

Build a small Memory Ledger demo with 10 sample memory cards. Each card should show:

- memory text
- source snippet or source type
- claim status
- privacy status
- confidence
- review state
- edit button
- downgrade button
- delete button
- public-safe abstraction toggle

Run the demo on 10 mixed examples: ordinary preference, symbolic phrase, pet-health note, opportunity target, rejected inference, outdated goal, source-backed claim, private relationship note, project hypothesis, and public artifact description.

## Practical design metaphor

Memory should behave less like a diary hidden in the walls and more like pinned evidence on a corkboard: visible, movable, removable, and labeled by confidence.
