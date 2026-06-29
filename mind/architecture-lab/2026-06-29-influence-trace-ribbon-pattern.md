# Influence Trace Ribbon Pattern

Date: 2026-06-29
Status: Architecture pattern / prototype requirement
Privacy posture: public-safe; no private user examples

## Architecture question

How should Mirror Cartographer show hidden influence traces so a user can understand why a response sounded this way without turning reflection into a dashboard?

Prior artifacts established that MC needs receipts and audit events for store, retrieve, influence, and transmit actions. The missing layer is presentation: users need to notice meaningful influence without being forced into a technical audit interface every time they reflect.

## Research basis

1. Explanation user-interface research shows that explanations are not automatically useful just because they exist. They must be designed and evaluated as user interfaces, not appended as technical afterthoughts.
   - Source: Explanation User Interfaces: A Systematic Literature Review, 2025. https://arxiv.org/abs/2505.20085

2. Human-centered explainable AI work emphasizes practical interpretability: explanations should match user goals, context, and task, rather than expose every internal mechanism.
   - Source: How Human-Centered Explainable AI Interface Are Designed and Evaluated, 2024. https://arxiv.org/abs/2403.14496

3. End-user XAI requirements research distinguishes explanation forms and explanation goals. This supports separating the emotional-facing cue from the deeper operational trace.
   - Source: Invisible Users: Uncovering End-Users' Requirements for Explainable AI via Explanation Forms and Goals, 2023. https://arxiv.org/abs/2302.06609

4. NIST AI RMF frames trustworthy AI work across Govern, Map, Measure, and Manage. For MC, influence traces should support Measure/Manage without making the reflection surface feel like a compliance console.
   - Source: NIST AI Risk Management Framework. https://www.nist.gov/itl/ai-risk-management-framework

5. NIST's Generative AI Profile, released 2024-07-26, identifies generative-AI-specific risks and proposes risk-management actions. For MC, this reinforces a lifecycle view: influence must be tracked from input through response and future retrieval.
   - Source: NIST AI RMF Generative AI Profile reference page. https://www.nist.gov/itl/ai-risk-management-framework

6. OWASP's GenAI Security Project covers security and safety risks for generative AI, LLMs, agentic systems, and AI-driven applications. For MC, hidden influence traces are not only UX; they are also a security and governance surface.
   - Source: OWASP Top 10 for Large Language Model Applications / GenAI Security Project. https://owasp.org/www-project-top-10-for-large-language-model-applications/

7. W3C PROV provides a model for recording entities, activities, and agents involved in producing a thing. MC should not expose raw PROV by default, but the trace model can borrow the entity/activity/agent distinction.
   - Source: W3C PROV Overview. https://www.w3.org/TR/prov-overview/

## Changed understanding

The answer is not a dashboard. A dashboard implies that the user must leave the reflective act and inspect a separate system state.

The better pattern is a lightweight, local, response-attached visual layer: an Influence Trace Ribbon.

The ribbon should appear directly beside or beneath an interpretation. It should show only the influence categories that materially shaped the response. The full audit trail remains available, but the default surface stays small enough to preserve flow.

## Pattern: Influence Trace Ribbon

A response or interpretation may carry a compact ribbon with up to four visible chips:

- Memory: prior session material, saved user preferences, symbolic history, or profile state influenced the response.
- Tone: the response was shaped by tone adaptation, emotional pacing, safety framing, or accessibility preferences.
- Map: symbolic framing, metaphor selection, body-map logic, or MC-specific architecture shaped the response.
- Guardrail: safety, privacy, uncertainty, or policy constraints shaped what was said or not said.

Each chip has three possible states:

- present: this influence category materially shaped the response.
- quiet: present but low-impact; available only if expanded.
- absent: no logged influence from that category.

The default view should never show more than four chips.

## Interaction model

Default state:

- User sees the response and a small trace ribbon.
- Example: Memory · Tone · Map
- No audit language appears unless the user expands it.

Expanded state:

Each chip expands into one plain-language sentence:

- Memory: This response used prior saved context about your preferred interaction style.
- Tone: This response was paced to be direct and low-fluff.
- Map: This response used the MC influence-boundary architecture chain.
- Guardrail: This response avoided private or identifying examples.

Deep audit state:

The full audit view opens only on request. It includes:

- influence_action_id
- source_type
- receipt_id
- policy_allowed
- policy_reason
- user_visible_summary
- timestamp
- response_span
- confidence

## Schema sketch

```json
{
  "trace_ribbon": {
    "response_id": "string",
    "visible_chips": ["memory", "tone", "map", "guardrail"],
    "chips": {
      "memory": {
        "state": "present | quiet | absent",
        "summary": "Plain-language explanation of memory influence.",
        "actions": ["retrieve", "weight", "condition"]
      },
      "tone": {
        "state": "present | quiet | absent",
        "summary": "Plain-language explanation of tone influence.",
        "actions": ["tone_adjust", "pace", "format"]
      },
      "map": {
        "state": "present | quiet | absent",
        "summary": "Plain-language explanation of symbolic or architectural framing.",
        "actions": ["frame", "metaphor_select", "pattern_match"]
      },
      "guardrail": {
        "state": "present | quiet | absent",
        "summary": "Plain-language explanation of safety, privacy, or uncertainty handling.",
        "actions": ["suppress", "abstract", "hedge", "redirect"]
      }
    },
    "deep_audit_available": true
  }
}
```

## Requirements added

### R-TRACE-01: Locality
Influence explanations must attach to the response or interpretation they explain. Do not force the user into a separate dashboard for ordinary reflection.

### R-TRACE-02: Layering
MC must support three layers: ribbon, expanded sentence, and full audit trail.

### R-TRACE-03: Sparseness
The default ribbon may show no more than four chips. If more influences are present, lower-impact traces collapse into the expanded state.

### R-TRACE-04: Plain-language traceability
Every visible chip must have a user-readable summary that maps to machine-readable audit events.

### R-TRACE-05: No fake transparency
If MC cannot determine why a response sounded a certain way, it must say that the trace is incomplete instead of inventing a reason.

### R-TRACE-06: Private-safe abstraction
Trace summaries must describe categories of influence, not expose sensitive personal facts or hidden private material.

## Prototype plan

Build five low-fidelity variants:

1. Inline chips under each interpretation.
2. Side-margin ribbon beside each interpretation.
3. Hover/tap sparkle marker that expands into chips.
4. Timeline thread showing influence changes across a session.
5. Receipt drawer with symbolic chips on top and audit data underneath.

Test each against three tasks:

- Prediction: Can the user predict what shaped the response?
- Flow preservation: Does the trace interrupt reflective momentum?
- Correction: Can the user identify and disable an unwanted influence path?

## Falsification checklist

This pattern fails if:

- users treat the ribbon as decorative rather than meaningful;
- users cannot distinguish memory influence from tone influence;
- users feel monitored rather than oriented;
- the ribbon becomes a compliance badge with no actual audit connection;
- expanded explanations reveal private material unnecessarily;
- developers cannot map visible chips to logged influence actions.

## Durable design principle

MC should make hidden influence visible as weather, not paperwork.

The user should be able to feel: the wind came from memory, the color came from tone, the path came from the map, and the fence came from the guardrail.

The audit trail must exist underneath, but the reflective surface should remain alive.

## Next research question

Can users distinguish helpful influence from manipulative influence when both are shown through the same trace ribbon?