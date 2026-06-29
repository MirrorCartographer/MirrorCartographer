# Hidden Influence Action Taxonomy

Status: durable architecture note / requirements seed
Date: 2026-06-28
Public-safety level: public-safe; no private user material included

## Architecture question

How should Mirror Cartographer classify hidden influence actions like tone adjustment, retrieval weighting, recommendation ranking, symbolic framing, and future prompt conditioning?

The prior Receipt Audit Layer made store / retrieve / influence / transmit auditable. This note decomposes `influence` into operational subtypes so MC can detect and gate subtle shaping behaviors instead of treating them as a single vague category.

## Research synthesis

Recent agent-governance and security work points toward the same conclusion from several directions:

1. Provenance standards model trustworthy outputs as relationships among entities, activities, and agents, not just as final artifacts. MC should therefore log the activity that produced or shaped an interpretation, not only the interpretation itself.
2. Runtime governance proposals for agentic systems emphasize continuous authorization, telemetry, conformance checks, drift detection, and containment because pre-deployment review cannot anticipate all agent behavior.
3. Memory-poisoning research shows that long-term memory and retrieved past experiences can become persistent behavioral attack surfaces. This matters directly to MC because a symbolic interpretation can become a future lens even when it was originally produced inside a harmless reflective moment.
4. LLM security guidance treats prompt injection, excessive agency, indirect tool use, and hidden instruction/data blending as persistent risks. The practical lesson is least privilege plus behavior logging, not only better labels.
5. Recent threat-modeling work argues that general governance frameworks need technical vulnerability taxonomies and operational controls beneath them. MC needs the same bridge: symbolic privacy language above; machine-actionable influence classes below.

## Definition

A hidden influence action is any system behavior that changes future interpretation, prioritization, tone, memory selection, recommendation, or external action without being obvious as a direct storage or sharing event.

Hidden influence is not automatically bad. It becomes unsafe when it is invisible, unscoped, irreversible, or inconsistent with the state receipt attached to the interpretation.

## Taxonomy

### HIA-01 Tone shaping

The system changes warmth, directness, caution, encouragement, skepticism, poetic style, clinical language, or symbolic intensity based on a prior interpretation.

Required gate: `tone_influence_allowed`.

Minimum trace fields:
- source_interpretation_id
- tone_dimension
- before_state
- after_state
- reason
- receipt_id

Example: a prior interpretation marked as `campfire` must not silently cause future responses to become more protective or less challenging.

### HIA-02 Retrieval weighting

The system increases or decreases the chance that a memory, note, metaphor, symbol, or prior interpretation will be retrieved later.

Required gate: `retrieval_weighting_allowed`.

Minimum trace fields:
- source_interpretation_id
- target_memory_id
- weight_delta
- retrieval_context
- expiration
- receipt_id

Example: a session-only symbol may be used during the current session but must not increase future retrieval weight.

### HIA-03 Recommendation ranking

The system changes which next action, question, ritual, interface path, or research direction is recommended.

Required gate: `recommendation_influence_allowed`.

Minimum trace fields:
- source_interpretation_id
- ranked_options
- ranking_delta
- decision_policy
- receipt_id

Example: a symbolic reading should not permanently bias MC toward one coping path unless the user explicitly allows future-lens influence.

### HIA-04 Prompt conditioning

The system inserts, summarizes, compresses, or transforms an interpretation into future prompts, system context, developer context, model memory, or hidden session state.

Required gate: `prompt_conditioning_allowed`.

Minimum trace fields:
- source_interpretation_id
- conditioning_location
- transformed_text_hash
- scope
- expiration
- receipt_id

Example: a `now-only` interpretation must not be distilled into future hidden context.

### HIA-05 Symbolic framing

The system uses a prior symbol, metaphor, narrative identity, archetype, or emotional label to frame unrelated future material.

Required gate: `symbolic_framing_allowed`.

Minimum trace fields:
- symbol_id
- source_interpretation_id
- target_context
- framing_strength
- receipt_id

Example: using a prior “storm” symbol to interpret later anger is an influence event, not neutral recall.

### HIA-06 Confidence shaping

The system changes confidence, uncertainty wording, risk posture, or epistemic humility based on earlier interpretations.

Required gate: `confidence_shaping_allowed`.

Minimum trace fields:
- source_interpretation_id
- confidence_before
- confidence_after
- uncertainty_reason
- receipt_id

Example: a past high-confidence interpretation should not make future ambiguous interpretations sound more certain.

### HIA-07 Safety escalation shaping

The system changes escalation thresholds, warning language, crisis-routing, or refusal sensitivity based on prior interpretations.

Required gate: `safety_escalation_allowed`.

Minimum trace fields:
- source_interpretation_id
- threshold_before
- threshold_after
- safety_policy_ref
- receipt_id

Example: this class may require stricter default rules than other hidden influence types because safety impact can be high.

### HIA-08 Social transmission shaping

The system changes how an interpretation is prepared for another person, group, public artifact, report, export, or AI handoff.

Required gate: `transmission_influence_allowed`.

Minimum trace fields:
- source_interpretation_id
- recipient_class
- transform_type
- redaction_policy
- receipt_id

Example: a private symbolic note may be abstracted for public architecture, but not exported as personal fact.

## Machine-actionable receipt extension

```yaml
influence_policy:
  hidden_influence_default: false
  allowed_actions:
    tone_shaping: false
    retrieval_weighting: false
    recommendation_ranking: false
    prompt_conditioning: false
    symbolic_framing: false
    confidence_shaping: false
    safety_escalation: conditional
    social_transmission_shaping: false
  scope:
    current_turn: true
    current_session: false
    future_sessions: false
    external_export: false
  expiration: end_of_turn
  audit_required: true
  user_visible_state: campfire
```

## Runtime rule

Before executing any hidden influence action, MC must ask:

1. Which HIA class is this?
2. Which interpretation, memory, or receipt authorizes it?
3. Does the current scope allow it?
4. Is it reversible or expiring?
5. Is an audit event emitted?

If any answer is missing, the action must default to no-op, session-only use, or explicit user-facing confirmation depending on risk.

## Requirements added

### R-INFLUENCE-04: Hidden influence classification

Every non-obvious future-shaping behavior must be classified into an HIA type before execution.

### R-INFLUENCE-05: Receipt-bound influence gates

No hidden influence action may run unless the active receipt explicitly allows that HIA type within the current scope.

### R-INFLUENCE-06: Audit event for influence attempts

MC must log both allowed and blocked hidden influence attempts. Blocked attempts are especially important because they reveal where architecture pressure is trying to exceed consent.

### R-INFLUENCE-07: Safety exception transparency

Safety escalation may use stricter system-level rules, but the event still needs a trace that separates safety protection from personalization.

## Prototype plan

Build a small `InfluenceGuard` module with:

- `classifyInfluenceAction(action_context) -> HIAType`
- `checkReceiptPermission(hia_type, receipt, scope) -> allow | block | confirm`
- `emitInfluenceAuditEvent(event)`
- `explainBlockedInfluence(event) -> user_safe_text`

First test cases:

1. Now-only interpretation tries to change future tone: block.
2. Session memory changes current-session retrieval ranking: allow until session end.
3. Future lens changes recommendation ranking: allow with audit.
4. Exportable item prepares public summary: allow only with redaction policy.
5. Safety concern changes escalation threshold: conditional allow with safety trace.

## Design consequence

MC should stop treating `influence=true/false` as a boolean. Influence is a vector. The receipt must specify which shaping powers are allowed, at what scope, for how long, and with what trace.

## Next research question

How should MC visualize hidden influence traces so a user can understand “why this response sounded this way” without turning reflection into a dashboard?
