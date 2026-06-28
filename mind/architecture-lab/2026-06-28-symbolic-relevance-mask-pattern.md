# Symbolic Relevance Mask Pattern

Date: 2026-06-28
Status: Architecture pattern / prototype requirement
Public-safe: yes. This artifact avoids private biographical content and describes only generalized product architecture.

## Architecture question

How should Mirror Cartographer decide which parts of a symbolic scene are actually relevant before generating interpretations, memory updates, visual emphasis, or action suggestions?

## Why this question matters

A reflective interface can overfit to whatever is emotionally vivid, narratively interesting, or visually salient. That creates a failure mode where the system interprets noise as signal, stores the wrong detail, or makes a metaphor feel more authoritative than it should.

The current MC direction already includes Belief Terrain, Map Delta, Probabilistic Trust Layer, Reflective Control Plane, Interpretation Impact Tiers, and Calibrated Friction. The missing layer is a pre-interpretation relevance gate.

MC should not only ask:

> What might this symbol mean?

It should first ask:

> Which features are relevant, which are noise, which are uncertain, and which should not be stored or used later?

## Source concepts extracted

### 1. Demonstrations show how; language indicates what matters

Masked Inverse Reinforcement Learning argues that demonstrations and language provide complementary signals. Demonstrations show behavior; language can specify which state features matter. The method uses LLMs to clarify ambiguous instructions, infer state-relevance masks, and enforce invariance to irrelevant state components.

Transfer to MC:

- A user's symbolic scene is like a demonstration: it shows structure, sequence, placement, body language, sensory emphasis, and affective movement.
- A user's words are like the instruction: they identify what the user thinks matters.
- MC should combine both instead of interpreting all visible details equally.

### 2. Ambiguity should be clarified before commitment

Masked IRL uses language-model reasoning to clarify ambiguous prompts in context before learning the reward-relevant mask.

Transfer to MC:

- Ambiguous symbolic material should not immediately become a confident interpretation.
- MC should mark ambiguous features as `uncertain`, `ask_later`, or `do_not_store` rather than forcing a reading.
- The clarification step should be proportional to impact tier. Low-impact metaphor can stay fluid; high-impact identity, health, safety, or relationship interpretations need stronger friction.

### 3. Relevance masking is an invariance mechanism

Masked IRL enforces invariance to irrelevant state dimensions so the learned reward does not depend on distractor features.

Transfer to MC:

- MC should make later retrieval and interpretation invariant to details that the user or system has marked irrelevant.
- Example: if color, object count, exact phrasing, or emotional intensity is marked irrelevant, future MC runs should not treat it as evidence.
- This creates a privacy and agency benefit: not everything expressed becomes material for future personalization.

### 4. Uncertainty communication needs interaction, not just labels

Recent uncertainty-communication work argues that intelligent interfaces need affordances that help users act appropriately under uncertainty, not merely display uncertainty.

Transfer to MC:

- The mask should be editable, not hidden.
- A user should be able to change `keep`, `ignore`, `uncertain`, `ask_later`, or `never_store` directly.
- The interface should show what changes when the mask changes.

### 5. Memory personalization needs stronger user control

Current AI memory systems increasingly personalize outputs by using prior conversations and user data. Public reporting on Meta AI memory highlighted that personalization may draw from conversation context and platform activity, while user opt-out controls may be limited.

Transfer to MC:

- MC should treat relevance masks as part of privacy-safe memory governance.
- Memory should not be `all meaningful details are stored`.
- Better rule: only user-confirmed relevant details, system-low-risk structural patterns, or explicitly durable preferences become future-use material.

## Pattern: Symbolic Relevance Mask

A Symbolic Relevance Mask is a pre-interpretation object attached to a scene, symbol, phrase, drawing, body-map mark, or session fragment.

It classifies each detected feature by whether and how it may influence interpretation, memory, visualization, retrieval, or action suggestions.

## Core schema

```yaml
symbolic_relevance_mask:
  mask_id: string
  parent_object_id: string
  parent_object_type: scene | symbol | phrase | drawing | body_mark | session_fragment | map_delta
  created_at: datetime
  updated_at: datetime

  features:
    - feature_id: string
      feature_type: object | color | spatial_relation | body_location | affect_word | metaphor | temporal_marker | intensity | contradiction | absence | repeated_pattern | user_correction
      feature_text: string
      system_observation: string
      user_supplied: boolean

      relevance_status: keep | ignore | uncertain | ask_later | never_store
      relevance_reason: string
      evidence_signal: explicit_user_statement | repeated_pattern | scene_structure | user_correction | contradiction | low_confidence_inference | system_detected_salience
      confidence: low | medium | high

      allowed_uses:
        interpretation: allow | block | ask_first
        visual_emphasis: allow | block | ask_first
        memory_storage: allow | block | ask_first
        future_retrieval: allow | block | ask_first
        action_suggestion: allow | block | ask_first

      impact_tier: T0 | T1 | T2 | T3 | T4
      persistence_rule: session_only | user_confirmed | durable_until_changed | never
      repair_paths:
        - rename
        - weaken
        - split
        - ignore
        - quarantine
        - delete
        - ask_later

  mask_summary:
    kept_count: integer
    ignored_count: integer
    uncertain_count: integer
    ask_later_count: integer
    never_store_count: integer
    overall_confidence: low | medium | high

  downstream_effects:
    interpretation_allowed: boolean
    memory_update_allowed: boolean
    friction_required: none | light | medium | strong
    delta_log_required: boolean
```

## UI behavior requirement

Before MC gives a strong interpretation, it should be able to show a compact relevance panel:

- Keep: details currently allowed to influence interpretation.
- Ignore: details treated as scene noise or not useful for this question.
- Uncertain: details that may matter but are under-specified.
- Ask later: details not necessary now but worth revisiting.
- Never store: details blocked from durable memory and future retrieval.

The user should be able to revise the mask without losing flow.

## Prototype flow: Keep / Ignore / Uncertain / Ask Later / Never Store

1. User gives a symbolic scene, drawing, phrase, or body-map mark.
2. MC extracts features without interpreting them yet.
3. MC proposes a relevance mask.
4. MC gives a short explanation of why each high-impact feature was classified.
5. User can accept or edit the mask.
6. MC interprets only the `keep` features and explicitly brackets `uncertain` features.
7. MC logs a Map Delta only if the interpretation or memory state changes.
8. MC blocks `never_store` features from future retrieval.

## Requirements update

### Requirement SRM-001: Pre-interpretation feature masking

MC must separate feature extraction from interpretation. A symbolic feature should not automatically become evidence.

### Requirement SRM-002: Editable relevance status

Each feature must support at least five statuses: `keep`, `ignore`, `uncertain`, `ask_later`, and `never_store`.

### Requirement SRM-003: Use-specific permissioning

A feature may be relevant for immediate interpretation while still blocked from memory storage or future retrieval.

### Requirement SRM-004: Invariance to ignored features

If a feature is marked `ignore` or `never_store`, future interpretations should not depend on it unless the user later changes the mask.

### Requirement SRM-005: Impact-tier coupling

Higher-impact features require stronger mask visibility and stronger user control before memory or action suggestions are allowed.

### Requirement SRM-006: Repair and rollback

Mask edits must create clear downstream changes: what interpretation changed, what memory changed, and what future-use pathway changed.

## Example, abstracted

Input scene:

> A user describes a room with a locked door, a bright animal, a blue wall, and a pressure sensation.

Feature mask:

- locked door: keep; metaphor/spatial barrier; interpretation allowed; memory ask_first.
- bright animal: uncertain; could be comfort, threat, guide, or irrelevant aesthetic; ask later.
- blue wall: ignore; no stated salience; visual emphasis blocked unless repeated.
- pressure sensation: keep; body-location signal; interpretation cautious; no medical inference; memory ask_first.

Interpretation rule:

MC may discuss barrier/pressure/uncertainty, but may not conclude identity, diagnosis, trauma meaning, or durable pattern without additional evidence.

## Evaluation criterion

A symbolic relevance mask succeeds only if a user can answer:

1. What details did MC use?
2. What details did MC ignore?
3. What details were uncertain?
4. What details will be stored or not stored?
5. How can I change the mask?
6. What changes downstream if I change it?

## Falsification checklist

This pattern should be revised if testing shows that:

- users treat the mask as a hidden judgment instead of an editable aid;
- masking interrupts symbolic flow more than it protects agency;
- users cannot predict which features will affect memory;
- ignored features still influence future interpretations;
- `never_store` features leak into retrieval or summaries;
- users over-trust the mask as objective rather than provisional;
- the system classifies too much as high-impact and becomes unusably cautious.

## Open implementation notes

- Start with a lightweight panel, not a database-heavy interface.
- Use mask visibility only when it matters: high-impact, memory-affecting, action-bearing, or low-confidence interpretations.
- Treat mask editing as a creative act: soften, quarantine, split, rename, or delete.
- Link every mask change to Map Delta and Reflective Control Plane when downstream state changes.

## Next research question

How can MC make relevance-mask editing feel like symbolic authorship rather than administrative cleanup?

This should be researched through interaction design sources on tangible/sketch-based AI tools, mixed-initiative creativity, and user agency in editable AI explanations.

## Sources

- Hwang, Forsey-Smerek, Dennler, Bobu. `Masked IRL: LLM-Guided Reward Disambiguation from Demonstrations and Language`, arXiv 2511.14565, 2025. https://arxiv.org/abs/2511.14565
- MIT CLEAR Lab project page. `Masked IRL`. https://mit-clear-lab.github.io/Masked-IRL/
- MIT News. `LLMs help robots understand vague instructions and focus on key details`, 2026-06-26. https://news.mit.edu/2026/llms-help-robots-understand-vague-instructions-and-focus-key-details-0626
- CURE 2026 workshop paper. `Communicating Uncertainty to foster Realistic Expectations`, 2026. https://www.medien.ifi.lmu.de/pubdb/publications/pub/amin2026iui-workshop/amin2026iui-workshop.pdf
- The Verge. `Meta AI will use its memory to provide better recommendations`, 2025-01-27. https://www.theverge.com/2025/1/27/24352992/meta-ai-memory-personalization
