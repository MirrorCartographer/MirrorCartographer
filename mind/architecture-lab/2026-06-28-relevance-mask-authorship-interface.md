# Relevance Mask Authorship Interface

Date: 2026-06-28
Status: design pattern / prototype requirement
Scope: public-safe Mirror Cartographer architecture note

## Architecture question

How can Mirror Cartographer make relevance-mask editing feel like symbolic authorship rather than administrative cleanup?

This follows the Symbolic Relevance Mask pattern: before an interpretation affects meaning, memory, visual emphasis, or action suggestions, features are sorted into categories such as keep, ignore, uncertain, ask later, and never store.

The weak point is not the idea of relevance masking itself. The weak point is interaction design: if the user experiences the mask as a form, compliance step, privacy chore, or model correction task, it will likely break reflective flow. If the user experiences the mask as shaping the map, it can preserve authorship.

## Current-source concepts extracted

### 1. High user control increases ownership in co-creative systems

A 2025 systematic review of human-AI co-creativity found that design dimensions such as user control, proactive behavior, transparency, and externalization matter for satisfaction, trust, and ownership. The review also notes that early creative phases such as problem clarification remain under-supported.

Source: https://arxiv.org/abs/2506.21333

Use for MC: relevance masking should be placed at the early clarification phase, before interpretation hardens. The user should not merely accept or reject an AI interpretation; they should shape what the interpretation is allowed to use.

### 2. Guidance can improve literacy but reduce creative autonomy if it feels over-structured

A 2026 study of creatives using GenAI image tools found a tension between structured guidance and self-experimentation. Guidance helped users understand AI tools, but many participants preferred experimentation because guidance could feel creativity-limiting.

Source: https://arxiv.org/abs/2605.10898

Use for MC: relevance-mask controls must not look like mandatory setup or a correctness quiz. They should feel like exploratory moves: circle, fade, split, pin, quarantine, rename, or leave unresolved.

### 3. Agency-preserving interfaces need visible causal control, not just trustworthy output

A 2026 HCI paper argues that the central risk in high-stakes AI interfaces is not only lack of trust, but erosion of human causal agency. It frames the interface as the place where human uncertainty and probabilistic model uncertainty must be mediated.

Source: https://arxiv.org/abs/2604.12793

Use for MC: relevance edits should visibly change downstream effects. If the user marks a symbol feature as ignored, the interpretation, memory permissions, and map visualization should change in front of them.

### 4. Enactive interface theory supports action-based knowing

Enactive interface design emphasizes knowledge through action and feedback: users learn and shape meaning through visible affordances, gestures, and perceptual response loops.

Source: https://en.wikipedia.org/wiki/Enactive_interfaces

Use for MC: relevance masking should be an action loop, not a settings panel. The user moves the map; the map answers back.

### 5. AI memory defaults create privacy and overreach concerns

Recent reporting on automatic AI memory features shows a market movement toward personalization by default, alongside privacy controls such as temporary chats and activity controls.

Source: https://www.theverge.com/news/758624/google-gemini-ai-automatic-memory-privacy-update

Use for MC: relevance masks should include memory scope as a first-class affordance. Meaning and memory must be separable: a symbol can matter inside this session without becoming future personalization data.

## Fact vs inference

### Fact-supported

- Human-AI co-creative systems benefit from meaningful user control, transparency, and support for externalizing ideas.
- Creative users can resist structured guidance when it feels like it constrains exploration.
- Agency-centered HCI argues for visible causal control and uncertainty mediation in AI interfaces.
- AI personalization and memory controls are currently active product and safety concerns.

### MC-specific inference

- A relevance mask will preserve symbolic authorship only if it is designed as an expressive map-shaping surface.
- A relevance mask will feel like cleanup if it appears after the AI has already produced the main interpretation.
- Relevance-mask editing should be spatial, reversible, visually responsive, and tied to memory scope.

These are plausible design hypotheses, not validated outcomes.

## Design pattern: Authorship Mask

An Authorship Mask is a user-editable relevance layer that lets the user shape what a symbolic interpretation is allowed to use.

It converts relevance editing from administrative correction into visible symbolic authorship.

### Core moves

1. Pin
   - Meaning: this feature matters.
   - Downstream effect: interpretation must reference it or explain why not.

2. Fade
   - Meaning: this feature is present but low importance.
   - Downstream effect: interpretation may mention it only as context, not as core evidence.

3. Cross out
   - Meaning: ignore this feature.
   - Downstream effect: interpretation cannot use it as support.

4. Split
   - Meaning: this feature has multiple possible meanings.
   - Downstream effect: interpretation must branch rather than collapse into one reading.

5. Quarantine
   - Meaning: sensitive, unstable, or too private for reuse.
   - Downstream effect: available only inside the current session unless explicitly released.

6. Ask later
   - Meaning: unresolved but potentially relevant.
   - Downstream effect: saved as a question, not a fact.

7. Never store
   - Meaning: do not persist this.
   - Downstream effect: blocked from memory, future retrieval, and profile formation.

8. Rename
   - Meaning: user replaces AI wording.
   - Downstream effect: user wording becomes canonical for this map node.

## Interface requirement

The mask editor must appear before final interpretation, not after.

Minimum flow:

1. User provides symbolic scene, phrase, image, feeling, or map fragment.
2. MC extracts candidate features.
3. MC asks the user to shape the mask with expressive controls.
4. MC generates interpretation using only allowed features.
5. MC shows a visible delta: what was used, ignored, uncertain, quarantined, or excluded from memory.
6. User can revise the mask and regenerate.

## Schema sketch

```yaml
relevance_mask:
  scene_id: string
  feature_id: string
  feature_label: string
  user_action: pin | fade | cross_out | split | quarantine | ask_later | never_store | rename
  user_label_override: string | null
  model_initial_relevance: high | medium | low | uncertain
  user_relevance: high | medium | low | excluded | unresolved
  memory_scope: none | session_only | project_only | durable_profile_candidate
  interpretation_permission: required | allowed | contextual_only | blocked | branch_required
  uncertainty_note: string
  downstream_delta:
    interpretation_changed: boolean
    memory_changed: boolean
    visual_emphasis_changed: boolean
    action_suggestion_changed: boolean
  reversibility:
    reversible: true
    rollback_action: string
```

## Evaluation criterion

Authorship Mask Criterion:

A relevance-mask interface passes only if a user can accurately answer all of these after using it:

1. What did MC think mattered?
2. What did I decide mattered?
3. What did I tell MC to ignore?
4. What stayed uncertain?
5. What, if anything, was allowed into memory?
6. How did my edits change the interpretation?
7. Can I reverse the effect?
8. Did the interaction feel like shaping meaning rather than correcting the AI?

## Prototype plan

Prototype name: `authorship-mask-v0.1`

### Variant A: administrative mask

- Checklist/table UI.
- User marks keep/ignore/store.
- Interpretation appears after submission.

### Variant B: authorship mask

- Spatial symbolic canvas.
- User pins, fades, crosses out, splits, quarantines, renames.
- Interpretation updates live with visible deltas.

### Test prompts

Use 24 public-safe symbolic scenes:

- object scenes
- weather scenes
- room/threshold scenes
- animal/guardian scenes without personal biography
- color/texture scenes
- conflict scenes with low-stakes ambiguity

### Measures

- attribution accuracy: can the user distinguish AI inference from user-authored relevance edits?
- memory comprehension: can the user identify what would or would not persist?
- agency rating: did the interaction feel authored, guided, corrected, or interrupted?
- flow cost: did friction preserve or damage symbolic flow?
- interpretation robustness: did the final reading respect excluded and uncertain features?
- reversibility comprehension: can the user undo the effect?

## Claim-status update

Previous implicit claim:

> Relevance masks help MC decide what matters.

Updated claim:

> Relevance masks are only agency-preserving if users can author them as part of the symbolic act itself. The mask must be spatial, reversible, visibly causal, and memory-scoped.

Confidence: medium-low.

Reason: the supporting literature is strong for user control, co-creativity, agency, and memory control, but the specific MC interaction pattern has not yet been empirically tested.

## Next proof needed

Build and test `authorship-mask-v0.1` against an administrative checklist version.

Primary proof question:

Do users retain stronger authorship, attribution accuracy, and memory-scope understanding when relevance masking is presented as expressive map-shaping rather than form-based cleanup?

## Next research question

How should MC visualize memory scope and future influence without making the interface feel legalistic, clinical, or surveillance-heavy?
