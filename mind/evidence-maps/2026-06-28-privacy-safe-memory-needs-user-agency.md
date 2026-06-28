# Evidence Map: Privacy-safe memory needs user agency, not just data minimization

Date: 2026-06-28
Status: Claim narrowed / requires MC-specific evaluation
Public-safe: Yes. No private user details included.

## Claim tested

Mirror Cartographer can use persistent memory safely if sensitive details are minimized or masked.

## Updated claim

Persistent memory is not made safe by minimization alone. For reflective systems, memory must be:

1. visible,
2. editable,
3. source-attributed,
4. impact-scoped,
5. reversible,
6. privacy-tiered,
7. contestable before it shapes future interpretations.

Data minimization is necessary, but insufficient. The stronger architecture target is user-governed memory influence.

## Why this matters for Mirror Cartographer

MC is not only a task assistant. It may influence symbolic interpretation, user self-description, emotional framing, future retrieval, and map continuity. A memory error or overconfident stored inference can therefore change how future reflections are interpreted.

For MC, the risk is not only data exposure. The deeper risk is covert interpretive drift: old memory silently weighting new meaning.

## Evidence reviewed

### 1. Conversational memory can shift agency away from users

Source: The Algorithmic Self-Portrait: Deconstructing Memory in ChatGPT, arXiv:2602.01450, 2026.

Relevant finding: the study analyzed 2,050 memory entries from 80 real-world ChatGPT users. It reports that 96% of memories in the dataset were initiated unilaterally by the system, while 4% were explicitly initiated by users. It also reports that 28% of memories contained GDPR-defined personal data and 52% contained psychological information.

Fact supported: persistent memory can be formed through system-side inference, not only explicit user choice.

Inference for MC: any MC memory layer that automatically stores symbolic, emotional, or identity-adjacent information should treat storage as an intervention requiring provenance, review, and rollback.

Source URL: https://arxiv.org/abs/2602.01450

### 2. Personalization can increase privacy concern and reduce trust when user privacy preferences are not handled

Source: Autonomy Reshapes How Personalization Affects Privacy Concerns and Trust in LLM Agents, arXiv:2510.04465, v2 2026.

Relevant finding: the study reports that personalization without accounting for user privacy preferences increases privacy concerns and decreases trust/willingness to use. It also reports that risk-contingent autonomy, where an agent delegates control to the user when privacy leakage is possible, can reduce adverse effects by improving perceived control.

Fact supported: user control and oversight are not cosmetic. They mediate whether personalization feels useful or invasive.

Inference for MC: MC should not treat memory consent as a one-time setting. It should escalate control when memory content is sensitive, identity-adjacent, affective, persistent, or action-shaping.

Source URL: https://arxiv.org/abs/2510.04465

### 3. Privacy protection can preserve utility when semantics are retained through typed placeholders

Source: MemPrivacy: Privacy-Preserving Personalized Memory Management for Edge-Cloud Agents, arXiv:2605.09530, 2026.

Relevant finding: the paper proposes edge-side detection of sensitive spans, replacement with semantically structured type-aware placeholders for cloud-side processing, and local restoration when needed. It reports a privacy taxonomy and low utility loss compared with masking baselines.

Fact supported: blunt deletion/masking is not the only privacy strategy. Structured abstraction can reduce exposure while retaining task-relevant semantics.

Inference for MC: public-safe memory should store abstract symbolic relations where possible, not raw personal specifics. Example: store `recurring protective-animal symbol` rather than raw identifying details unless explicitly needed and approved.

Source URL: https://arxiv.org/abs/2605.09530

### 4. Users need affordances to view and manipulate conversational memory

Source: Memory Sandbox: Transparent and Interactive Memory Management for Conversational Agents, arXiv:2308.01542, 2023.

Relevant finding: the paper argues that users lack affordances for viewing and controlling what agents remember, causing poor mental models and conversational breakdowns. It proposes treating memories as data objects that users can view, manipulate, record, summarize, and share across conversations.

Fact supported: memory transparency requires direct interaction affordances, not just policy text.

Inference for MC: MC memory should behave like a visible map layer, not a hidden personalization variable.

Source URL: https://arxiv.org/abs/2308.01542

### 5. Memory can bias emotional interpretation

Source: The Personalization Trap: How User Memory Alters Emotional Reasoning in LLMs, arXiv:2510.09905, revised 2026.

Relevant finding: the paper reports that identical emotional scenarios paired with different user profiles produce systematically divergent interpretations across multiple LLMs, with disparities across demographic factors.

Fact supported: profile/memory context can change emotional reasoning even when the current scenario is identical.

Inference for MC: memory should not silently determine emotional-symbolic interpretation. The system should expose when a stored memory influenced a reading and allow the user to disable or weaken that influence.

Source URL: https://arxiv.org/abs/2510.09905

## Claim status

Status: Partially supported, narrowed.

Supported:

- Persistent memory can improve continuity and personalization.
- Memory can create privacy, agency, and bias risks.
- User control, privacy-aware abstraction, and transparent memory management are supported design directions.

Not yet proven:

- That MC's specific memory model preserves agency.
- That symbolic abstraction prevents harmful interpretive drift.
- That users can understand and manage memory influence during emotionally loaded reflection.
- That memory improves outcomes enough to justify persistence for all modes.

## Evaluation criterion added

### Memory Agency Criterion

For any MC feature that creates or uses memory, the system must be able to answer:

1. What was stored?
2. Who initiated storage: user, AI, import, or inferred system rule?
3. What source interaction produced it?
4. Is the memory raw, abstracted, derived, or inferred?
5. What sensitivity tier applies?
6. What future behaviors may it influence?
7. Can the user inspect it in plain language?
8. Can the user weaken, edit, quarantine, expire, or delete it?
9. Can the user run the current reflection with memory off?
10. Can MC show which interpretation changed because memory was active?

If the answer to any of these is no, memory use is not agency-safe enough for high-impact reflective interpretation.

## Proposed schema

Memory object fields:

- memory_id
- created_at
- created_by: user | ai_inferred | imported | system_migration
- source_pointer
- source_excerpt_public_safe
- memory_text_user_visible
- memory_abstraction_level: raw | abstracted | derived | inferred
- sensitivity_tier: low | moderate | high | restricted
- influence_scope: tone | retrieval | symbol_suggestion | interpretation | action_suggestion | identity_reflection
- persistence_rule: one_session | expires | persistent_until_reviewed | persistent_user_approved
- confidence
- evidence_strength
- user_approved: true | false | pending
- contest_state: accepted | weakened | quarantined | rejected
- reversible: true | false
- last_used_at
- last_influence_explanation

## Falsification checklist

The privacy-safe memory claim should be rejected or downgraded if testing shows that users:

- cannot tell what memory was used,
- cannot tell whether a memory was inferred or explicitly saved,
- cannot reverse memory influence,
- believe interpretations are more certain because memory exists,
- accept inaccurate identity-adjacent inferences,
- feel less authorship over the map after memory is introduced,
- cannot predict how deleting or weakening a memory changes future outputs,
- prefer no-memory mode after seeing memory influence explanations.

## Test plan: memory-influence audit v0.1

Build 30 paired reflection cases.

For each case:

- Version A: no memory.
- Version B: benign preference memory.
- Version C: emotionally salient symbolic memory.
- Version D: identity-adjacent inferred memory.

Measure:

- user detection of memory influence,
- ability to identify source/provenance,
- confidence calibration,
- perceived agency,
- willingness to edit/delete/quarantine memory,
- quality of interpretation with and without memory,
- false certainty introduced by memory.

Pass condition:

Users should correctly identify memory influence and available controls in at least 80% of high-impact cases, without a significant drop in perceived symbolic flow.

## Implementation requirement

Add a Memory Influence Panel to any MC interpretation above low impact.

Panel must show:

- memory used,
- source type,
- why it was considered relevant,
- what changed because of it,
- confidence,
- sensitivity tier,
- controls: keep, weaken, expire, quarantine, delete, rerun without memory.

## Next proof needed

MC needs an empirical test of whether users can understand and control memory influence in symbolic interpretation.

Next artifact to build:

`memory-influence-audit-testset-v0.1`

Core question:

Can users tell when MC memory changed an interpretation, and can they meaningfully reverse or constrain that influence without losing the value of continuity?
