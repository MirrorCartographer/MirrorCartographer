# Memory State Metaphor Set Pattern

Status: design pattern + evaluation requirement
Date: 2026-06-28
Public-safety note: this artifact abstracts private/personal material. It describes interface architecture for reflective AI systems and does not encode user-specific content.

## Architecture question

Can users accurately distinguish **session memory** from **future lens**, or does MC need a metaphor set that makes different kinds of future influence immediately legible?

This follows from the prior Now-Only State Badge work. The unresolved risk is that short labels such as `session memory` and `future lens` may be technically precise for builders but not operationally clear to users. A user may understand that something is "remembered" without understanding whether it will later shape interpretation, retrieval, personalization, sharing, or export.

## Claim status

Partially supported, not proven for MC.

Facts from current sources:

1. Persistent memory systems for LLM agents are increasingly formalizing memory as structured tiers with provenance, retrieval policy, and access control rather than a single blob of saved facts.
2. Multi-user agent memory research uses private/shared tiers, immutable provenance, dynamic read/write policies, and retrospective permission checks.
3. Newer personalized-memory systems emphasize session summaries, long-term user models, knowledge graphs, episodic preservation, and retrieval routing.
4. Privacy-interface research shows that layout and labels can guide attention, but comprehension depends on sustained attention and cannot be assumed from interface structure alone.
5. Privacy nutrition/data labels are useful as standardized summaries, but labels can also become overcompressed and may hide the actual consequence of data use.
6. HCI interface metaphor theory supports using familiar objects/actions to make unfamiliar system behavior easier to understand, but metaphors can mislead when the familiar object does not match the system's actual behavior.

Inference for MC:

MC should not rely on a single privacy label, consent banner, or memory toggle. It needs a **memory-state metaphor set**: small, repeatable metaphors tied to machine-actionable policy fields. The metaphor should teach future influence without replacing the policy.

## Useful concepts extracted

### 1. Memory is not one state

For MC, "memory" must be decomposed into at least four powers:

- store: may this interpretation be saved?
- retrieve: may it appear again later?
- influence: may it shape future interpretation, ranking, tone, prompts, or suggestions?
- transmit: may it leave the private session context through export, sharing, or integration?

A user may allow one power while rejecting another.

### 2. A metaphor must map to consequence, not vibe

A metaphor is only acceptable if it helps the user predict what will happen later.

Bad metaphor: pretty but vague.
Good metaphor: predicts storage, retrieval, influence, and transmission.

### 3. Labels need explain-back at power transitions

A passive badge may be enough for low-power states. When an interpretation gains future influence, MC should use a lightweight explain-back gate or confirmation prompt.

### 4. Provenance must stay attached

Every interpretation that survives beyond the moment should retain:

- source context
- creation time
- confidence level
- uncertainty
- allowed influence scope
- revision history
- rollback path

### 5. Metaphor and policy must remain separable

The user-facing metaphor can be soft. The backend policy must remain exact.

## Proposed metaphor set

### Campfire — Now-only

Meaning: useful while we are sitting here; gone when the session ends.

Allowed:

- used in the current reflective moment
- may guide the current response

Blocked:

- long-term storage
- future retrieval
- profile inference
- export or sharing

Machine policy:

```yaml
state: now_only
store: false
retrieve_later: false
influence_future: false
transmit: false
expires: session_end
```

### Notebook — Session memory

Meaning: kept for this working session or bounded project, not a future identity lens.

Allowed:

- helps maintain continuity inside the current session or explicit project window
- can be reviewed and deleted

Blocked by default:

- long-term profile inference
- automatic future retrieval outside the bounded context
- external transmission

Machine policy:

```yaml
state: session_memory
store: true
retrieve_later: bounded
influence_future: false
transmit: false
expires: bounded_context_end
```

### Map Layer — Future lens

Meaning: may shape how later material is interpreted.

Allowed:

- later retrieval
- future interpretation support
- pattern comparison across sessions

Required:

- provenance
- uncertainty label
- user-visible revision/delete path
- explain-back or explicit confirmation before activation

Machine policy:

```yaml
state: future_lens
store: true
retrieve_later: true
influence_future: true
transmit: false
requires_explain_back: true
```

### Message Bottle — Exportable / Shareable

Meaning: may leave the private reflective space.

Allowed only when explicitly selected:

- export
- sharing
- handoff to another tool or person

Required:

- preview
- recipient/scope clarity
- redaction option
- provenance receipt

Machine policy:

```yaml
state: exportable
store: true
retrieve_later: true
influence_future: user_selected
transmit: true
requires_preview: true
requires_scope_confirmation: true
```

## Requirement update

### R-MEM-METAPHOR-01

MC must present interpretation memory states using a consistent metaphor set that distinguishes current-use, bounded-session use, future interpretive influence, and external transmission.

### R-MEM-METAPHOR-02

Each metaphor must map to machine-actionable policy fields for storage, retrieval, future influence, expiration, and transmission.

### R-MEM-METAPHOR-03

Any transition from `now_only` or `session_memory` into `future_lens` or `exportable` must require an explicit user action and must expose a rollback/delete path.

### R-MEM-METAPHOR-04

MC must not use aesthetic metaphor as a substitute for comprehension. Visual states must be tested for whether users can predict future system behavior.

## Evaluation criterion

A memory-state metaphor set passes only if test users can correctly answer these questions without help:

1. Will this interpretation disappear after the session?
2. Can it be retrieved later?
3. Can it shape future interpretations?
4. Can it be exported or shown to another person/tool?
5. Can I revise or revoke it?

Target threshold:

- At least 85% correct on consequence-prediction questions.
- No state pair may have more than 10% confusion between `session_memory` and `future_lens`.
- Users must be able to find the rollback/delete control in under 10 seconds.

## Falsification checklist

This pattern should be revised or rejected if:

- users treat `session_memory` and `future_lens` as the same thing;
- users believe `now_only` is saved;
- users believe `future_lens` means external sharing;
- users cannot explain what changes when a note becomes a map layer;
- users experience the metaphors as childish, decorative, manipulative, or unclear;
- the metaphor causes more trust than the policy warrants;
- users cannot find deletion/revision controls quickly;
- the metaphor hides uncertainty or provenance.

## Prototype plan

Build five static cards using the same interpretation text:

1. raw technical labels only;
2. icon badges only;
3. metaphor names only;
4. metaphor + one-line consequence;
5. metaphor + one-line consequence + expandable policy receipt.

Measure:

- comprehension accuracy;
- time to answer consequence questions;
- perceived burden;
- emotional interruption;
- confidence calibration;
- rollback discoverability.

Preferred hypothesis:

The strongest candidate is likely option 5: metaphor + consequence + expandable policy receipt. It preserves emotional legibility while keeping exact policy visible when needed.

## Design note

The purpose of the metaphor set is not privacy theater. It is future-influence literacy.

The core user-facing sentence:

> This can help now without becoming a lens later.

The core builder-facing rule:

> No interpretation gains future influence without a visible state change, provenance, and rollback.

## Sources

- Collaborative Memory: Multi-User Memory Sharing in LLM Agents with Dynamic Access Control, arXiv, 2025-05-23. https://arxiv.org/abs/2505.18279
- Memoria: A Scalable Agentic Memory Framework for Personalized Conversational AI, arXiv, 2025-12-14. https://arxiv.org/abs/2512.12686
- MemMachine: A Ground-Truth-Preserving Memory System for Personalized AI Agents, arXiv, 2026-04-06. https://arxiv.org/abs/2604.04853
- Designing for Understanding: How Interface-Level Consent Designs Shape Attention and Understanding in Privacy Disclosures, arXiv, 2026-03-14. https://arxiv.org/abs/2603.13747
- Toward the Cure of Privacy Policy Reading Phobia: Automated Generation of Privacy Nutrition Labels From Privacy Policies, arXiv, 2023-06-19. https://arxiv.org/abs/2306.10923
- The Dataset Nutrition Label: A Framework To Drive Higher Data Quality Standards, arXiv, 2018-05-09. https://arxiv.org/abs/1805.03677
- Interface metaphor, overview of HCI metaphor concept. https://en.wikipedia.org/wiki/Interface_metaphor
- Natural mapping in interface design, overview of mapping controls to expected outcomes. https://en.wikipedia.org/wiki/Natural_mapping_(interface_design)
