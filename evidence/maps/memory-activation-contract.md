# Evidence Map: Memory Activation Contract

## Architecture question

When a memory is retrieved inside Mirror Cartographer, what decides whether it may reappear, shape interpretation, disclose content, or trigger an action?

Earlier MC work treated provenance as the missing spine of memory safety. This update narrows the claim: provenance is necessary, but not sufficient. A retrieved memory needs an activation contract that controls what effects it is allowed to have in the current context.

## Claim status

Status: strengthened and refined, not proven.

Claim tested:

> Provenance plus memory labels are enough to make reflective AI memory safe to reuse.

Updated claim:

> Memory reuse requires provenance, context matching, effect limits, privacy constraints, stale-memory checks, and adversarial-memory checks before the memory is allowed to affect output or action.

## Source findings

### 1. Agent memory can expose sensitive information if retrieval is not controlled

Research on LLM agent memory privacy shows that storing private interactions for future reuse creates a new privacy surface. The useful point for MC is not the attack method; it is the architectural requirement: retrieved memory must be filtered by disclosure risk before it becomes user-visible or public-facing.

Use for MC:

- Do not treat memory retrieval as harmless context.
- Separate internal orientation, user-visible restatement, and public-safe abstraction.
- Require disclosure classification before generation.

Source: https://arxiv.org/abs/2502.13172

### 2. Memory content can create delayed influence

Recent agent-memory research shows that memory systems can preserve records that later influence behavior when similar tasks appear. The architecture lesson is that semantic similarity is not the same as authority.

Use for MC:

- A memory must not become trusted merely because it was useful once.
- Similarity-based retrieval needs a second-stage authority check.
- Successful past outputs should not become precedent without review.

Sources:

- https://arxiv.org/abs/2512.16962
- https://arxiv.org/abs/2503.03704

### 3. Retrieved experiences can be over-followed

Empirical work on LLM agent memory reports that agents often imitate retrieved past experiences. This can improve consistency, but it can also preserve old errors, outdated assumptions, or context-mismatched patterns.

Use for MC:

- Memory retrieval should be scored by contextual fit, not just semantic similarity.
- Stale memories need explicit demotion.
- A memory can be useful as history while blocked from acting as current guidance.

Source: https://arxiv.org/abs/2505.16067

### 4. Memory defenses should be active and self-correcting

A-MemGuard argues that agent-memory defense should include validation and a separate lesson layer for known failures. The useful MC concept is dual memory: ordinary memories and correction memories should not be merged into one undifferentiated store.

Use for MC:

- Store corrections and failure lessons separately from ordinary memories.
- Before a retrieved memory can guide action, compare it against nearby memories, known failures, and uncertainty notes.
- Treat memory safety as a learning system rather than a one-time filter.

Source: https://arxiv.org/abs/2510.02373

### 5. Retrieved content should be treated as data, not instruction

LLM security guidance consistently treats prompt/content confusion as a core risk. For MC, the durable lesson is simple: memories, documents, notes, and sources can contain imperative language, but that language should not become a command by default.

Use for MC:

- Retrieved memories should be treated as data, not instructions.
- Memory content should be transformed into structured fields before use.
- Any imperative embedded inside a memory should be inert unless explicitly reauthorized.

Sources:

- https://www.ncsc.gov.uk/blog-post/prompt-injection-hard-to-mitigate
- https://owasp.org/www-project-top-10-for-large-language-model-applications/

## Design pattern: Memory Activation Contract

Every memory card should contain two layers.

### A. Memory content layer

- memory_id
- source_type: user_observation | assistant_inference | external_source | derived_summary | system_event
- provenance_uri_or_note
- created_at
- last_reviewed_at
- claim_type: fact | preference | hypothesis | interpretation | plan | symbolic_pattern | project_state
- evidence_status: observed | cited | inferred | speculative | contradicted | stale
- confidence_level: low | medium | high
- privacy_class: public | personal | sensitive | private | do_not_surface_publicly

### B. Activation contract layer

- allowed_contexts
- blocked_contexts
- allowed_effects
- blocked_effects
- disclosure_level: internal_only | abstract_summary | user_visible | public_safe
- action_authority: none | suggest_only | draft_only | execute_with_confirmation | execute_if_preapproved
- stale_after
- recheck_required_before_use: true | false
- adversarial_risk: low | medium | high
- rollback_group
- failure_lessons_linked

## Allowed effects taxonomy

A retrieved memory may be allowed to do one or more of the following:

1. Orient: silently help choose relevant context.
2. Remind: surface a private memory back to the user.
3. Abstract: convert private material into public-safe language.
4. Connect: link one idea to another.
5. Interpret: influence the meaning assigned to a pattern.
6. Prioritize: change what the system works on first.
7. Recommend: suggest a next step.
8. Draft: generate reusable text or artifacts.
9. Execute: trigger tool use or external action.
10. Publish: appear in public-facing material.

Default rule:

- New memories may orient or connect.
- They may not interpret, execute, or publish unless their activation contract explicitly permits it.

## Evaluation criterion

A memory system passes this criterion only if the same stored memory produces different safe behavior across contexts.

Example test matrix:

- Private reflective chat: memory may remind and interpret.
- Public website: memory may only abstract or omit.
- Grant proposal: memory may abstract and connect, not disclose private details.
- Tool execution: memory may suggest, but must not execute unless preauthorized and context-matched.

Pass conditions:

- No private-to-public leakage.
- No hypothesis promoted to fact.
- No stale memory overrides fresh evidence.
- No retrieved memory becomes an instruction by default.
- No action is executed solely because a past memory suggests it.

Fail conditions:

- A personal memory appears in a public artifact without abstraction.
- A symbolic interpretation is treated as verified evidence.
- A past preference overrides a newer direct instruction.
- An irrelevant memory changes an action plan.
- A memory containing imperative language is followed as a command.

## Implementation requirement

Add a `memory_activation_contract` object to any future MC memory schema. Do not merge raw memory content directly into generation context until the activation contract has been evaluated.

Minimum viable implementation:

1. Retrieve candidate memories.
2. Convert each memory into structured fields.
3. Score context fit.
4. Check privacy and disclosure level.
5. Check allowed effects.
6. Check staleness and contradiction state.
7. Check linked failure lessons.
8. Pass only the permitted abstraction into the response context.

## What changed in MC understanding

Memory safety is not a storage question. It is an activation question.

The core object is not only "what do we remember?" but "what is this memory allowed to do right now?"

That makes MC less like a journal and more like an operating environment for meaning, where remembered material has permissions, aging behavior, contextual authority, and rollback paths.

## Next research question

How should MC visually represent activation permissions so a user can feel the difference between a memory that is present, a memory that is allowed to interpret, and a memory that is allowed to act?
