# Contextual Memory Permission Gate

Date: 2026-06-27
Status: design pattern / requirements seed
Public-safety level: abstract, synthetic examples only

## Architecture question

How should Mirror Cartographer decide when a remembered pattern is allowed to influence a future reflection?

The useful answer is not a simple memory on/off switch. MC needs a contextual permission gate: each memory must prove that it belongs in the present context before it can shape an output.

## Research basis

- CIMemories frames persistent memory as a contextual-integrity problem: stored attributes can be useful in one context and inappropriate in another. Source: https://arxiv.org/abs/2511.14937
- PersistBench highlights two memory-specific risks: cross-domain leakage and memory-induced sycophancy. Source: https://arxiv.org/abs/2602.01146
- Memori argues for structured memory representations instead of raw conversation replay. Source: https://arxiv.org/abs/2603.19935
- MemPrivacy shows that privacy protection can preserve useful semantic structure through type-aware placeholders instead of blunt deletion. Source: https://arxiv.org/abs/2605.09530

## Changed understanding

MC memory should be governed influence, not storage.

A memory is not automatically relevant because it is true, vivid, repeated, or user-approved. It becomes usable only when it passes a contextual fit check. This matters because symbolic and reflective systems can over-apply old patterns. A symbol from one context should not quietly invade another context unless the current interaction makes that bridge appropriate.

## Design pattern

Name: Contextual Memory Permission Gate

Purpose: Prevent stale, cross-domain, overconfident, or identity-fixing memories from shaping outputs without contextual justification.

## Memory object fields

- memory_id
- pattern
- source_type: user-stated | assistant-inferred | artifact-derived | repeated-pattern | explicit-preference
- source_scope: conversation | project | artifact | creative | interface | career | general
- sensitivity: public | private-low | private-high | sensitive-adjacent
- confidence: observed | inferred | speculative | contradicted | deprecated
- allowed_contexts
- blocked_contexts
- expiration_policy: persistent | review-after-date | session-only | decay-on-contradiction
- last_confirmed
- user_controls: revise | freeze | delete | narrow | broaden

## Permission check

Before using a memory, MC asks:

1. Is the current task inside allowed_contexts?
2. Is the memory outside blocked_contexts?
3. Is confidence high enough for the requested influence?
4. Could this memory unfairly narrow the user model?
5. Could a less personal abstraction satisfy the task?
6. Should the output show the memory as a possible pattern instead of fact?

If any answer fails, suppress, abstract, or surface uncertainty.

## Output modes

- silent-use: low-sensitivity, directly relevant, high-confidence preference
- visible-use: clearly names that a previous pattern is being applied
- ask-to-apply: useful but cross-context or uncertain
- abstract-only: preserves structure without personal details
- do-not-use: blocked, stale, contradicted, or irrelevant

## Product wedge

Build a Memory Mirror Panel.

Each memory card displays:

1. remembered pattern
2. source type
3. confidence
4. allowed contexts
5. blocked contexts
6. controls: revise, narrow, broaden, freeze, delete

The key UI move is editing where memory is allowed to act, not just editing what is remembered.

## Prototype plan

Create a local JSON schema and a small evaluator function.

Input:

- memory object
- current task context
- requested influence level

Output:

- allow_silent
- allow_visible
- ask_to_apply
- abstract_only
- deny

## Synthetic tests

- symbol reused appropriately in a creative project
- symbol blocked from unrelated practical reasoning
- old preference contradicted by a newer preference
- repeated project goal used appropriately in roadmap planning
- private detail abstracted into non-identifying structure

## Acceptance criteria

- MC can remember without overclaiming.
- MC can personalize without leaking across domains.
- MC can connect patterns without trapping the user in old interpretations.
- Users can edit not only what is remembered, but where memory has permission to influence the system.

## Next research question

How should MC visually represent uncertainty and permission boundaries so the memory system feels like navigable territory instead of a hidden profile?
