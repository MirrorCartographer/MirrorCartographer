# Symbolic Uncertainty Visual Language Pattern

Date: 2026-06-28
Status: architecture pattern candidate; evidence-informed but not yet validated in MC users
Public-safety note: this artifact abstracts private/personal material into product-neutral design rules for reflective AI interfaces.

## Architecture question

What visual language can MC use to distinguish uncertainty, blocked influence, and user-confirmed meaning without making uncertainty look like depth, mystery, or authority?

## Why this question matters

MC uses symbolic, emotional, spatial, and metaphorical interfaces. That is the strength of the system, but it creates a specific safety risk: symbolic visuals can feel more meaningful than plain text. If uncertainty is shown with visually rich marks, the user may read the uncertainty as hidden truth, depth, or identity confirmation rather than as a limitation.

The current architecture already includes Memory Trust Gate, Memory Influence Scope Map, Attribution Trace Ledger, and Symbolic Authority Calibration. This note adds a design pattern for the visible layer that sits on top of those mechanisms.

## Sources reviewed

1. Reyes et al., “Shades of Uncertainty: How AI Uncertainty Visualizations Affect Trust in Alzheimer's Predictions,” 2026. The study compares binary versus continuous uncertainty encodings and reports that continuous encodings improved perceived reliability and helped users recognize model limitations, while binary encodings increased momentary confidence. Source: https://arxiv.org/abs/2602.01264

2. Noorani et al., “Human-AI Collaborative Uncertainty Quantification,” 2025. The paper frames human-AI uncertainty as collaborative, with goals of avoiding counterfactual harm and preserving correct human judgment rather than simply letting AI refine every judgment. Source: https://arxiv.org/abs/2510.23476

3. NIST AI Risk Management Framework 1.0 / AI RMF Resource Center. NIST frames trustworthy AI through Govern, Map, Measure, and Manage functions and emphasizes trustworthiness as something incorporated into design, development, use, and evaluation. Source: https://airc.nist.gov/airmf-resources/airmf/

4. NIST AI RMF page, current as of 2026-06-28. NIST notes AI RMF 1.0 is being revised and released a Generative AI Profile in July 2024; this supports treating MC patterns as living controls, not final compliance claims. Source: https://www.nist.gov/itl/ai-risk-management-framework

## Fact / inference separation

### Facts supported by reviewed sources

- Uncertainty visualization can change user trust, confidence, and reliance.
- The format of uncertainty visualization matters; binary and continuous encodings can produce different trust effects.
- User expertise and task context shape how uncertainty visuals are interpreted.
- AI risk management should be operationalized through design, measurement, and management practices, not only principles.
- The NIST AI RMF is voluntary guidance, not proof that any specific interface is safe.

### MC-specific inferences

- MC should avoid visually treating uncertain interpretation as a glowing, sacred, deep, or central mark.
- MC needs separate visual channels for at least three states: uncertain, blocked, and user-confirmed.
- MC should not use a single confidence icon, because a binary marker may increase momentary confidence or oversimplify uncertainty.
- A symbolic UI should preserve reflective flow while keeping audit access one click away.
- The pattern must be tested; source evidence does not prove MC’s symbolic implementation is safe.

## Pattern: Symbolic Uncertainty Visual Language

### Core rule

Symbolic beauty may support orientation, but it must not upgrade uncertainty into authority.

### Visual state taxonomy

1. User-confirmed meaning
   - Meaning: the user explicitly accepted, edited, or restated the interpretation.
   - Visual behavior: stable, grounded, modestly emphasized.
   - Allowed symbolism: anchored mark, clear label, plain confirmation text.
   - Forbidden symbolism: prophecy, destiny, permanent identity framing.

2. AI-inferred meaning
   - Meaning: the system inferred a possible interpretation from current context.
   - Visual behavior: provisional, secondary, clearly editable.
   - Allowed symbolism: soft outline, draft mark, “possible” label.
   - Forbidden symbolism: central placement equal to confirmed meaning.

3. Uncertain meaning
   - Meaning: evidence is incomplete, conflicting, low-confidence, or context-dependent.
   - Visual behavior: visible limitation, not decorative mystery.
   - Allowed symbolism: broken outline, dotted edge, muted translucency, explicit uncertainty label.
   - Forbidden symbolism: glow, halo, shimmer, hidden-depth treatment, mystical fog.

4. Blocked influence
   - Meaning: a memory, interpretation, or prior pattern was considered but not allowed to influence the current reading.
   - Visual behavior: boundary-first, low-drama, auditable.
   - Allowed symbolism: closed gate, small boundary marker, “not used here” label.
   - Forbidden symbolism: danger alarm unless actual risk is high; shame/judgment cues.

5. Conflicting influence
   - Meaning: more than one interpretation or memory path competes.
   - Visual behavior: show split without forcing resolution.
   - Allowed symbolism: forked path, paired cards, comparison view.
   - Forbidden symbolism: ranking by aesthetic intensity alone.

6. Rollback available
   - Meaning: the user can undo or narrow the influence of a memory/interpretation.
   - Visual behavior: practical control, not symbolic drama.
   - Allowed symbolism: undo loop, small reversible tag.
   - Forbidden symbolism: burial, deletion-as-loss, irreversible imagery.

## Interface requirements

### Requirement 1: Separate status from content

Every symbolic interpretation card must separate:
- what the interpretation says,
- where it came from,
- how certain it is,
- what it is allowed to affect,
- how to change or undo it.

### Requirement 2: Do not encode uncertainty with attractiveness alone

Uncertainty may use texture, outline, or opacity, but never only beauty, glow, darkness, complexity, or centrality.

### Requirement 3: Put blocked influence at the edge, not the center

Blocked material should be visible enough for accountability, but should not dominate the reflective experience. The default display should be a small edge marker: “considered, not used.”

### Requirement 4: User-confirmed meaning must have a provenance mark

A confirmed meaning is not “true forever.” It means: user confirmed this framing at this time, for this scope. Confirmation must include date/time, scope, and rollback.

### Requirement 5: Expansion path

Default view: symbolic chip.
Expanded view: memory admission record, source, confidence rationale, blocked influence, rollback options.

## Minimal schema

symbolic_visual_state:
  id: string
  interpretation_id: string
  state_type: user_confirmed | ai_inferred | uncertain | blocked_influence | conflicting_influence | rollback_available
  source_type: current_user_input | stored_memory | ai_inference | external_reference | mixed
  certainty_level: low | medium | high | not_applicable
  influence_scope: none | current_response_only | session | project | global_profile
  allowed_to_affect: list[string]
  forbidden_to_affect: list[string]
  visual_encoding:
    placement: center | near_content | edge | hidden_until_expand
    shape_language: anchored | draft_outline | broken_outline | boundary_gate | fork | undo_loop
    intensity: low | medium | high
    label_required: boolean
  user_control:
    can_confirm: boolean
    can_edit: boolean
    can_block: boolean
    can_rollback: boolean
  audit_link: string

## Design pattern name

Calibrated Symbolic Status Layer

## Acceptance criteria

A prototype passes this pattern only if users can correctly answer:

1. Which parts came from the user versus AI inference?
2. Which parts are uncertain?
3. Which prior memories were blocked or excluded?
4. What can this interpretation affect later?
5. How can they edit, narrow, or roll it back?
6. Which visual marks mean “confirmed by me” versus “suggested by AI”?

## Failure modes to test

- Users treat uncertain visuals as deeper or more profound than confirmed text.
- Users treat a blocked influence marker as proof that the blocked content is important.
- Users assume user-confirmed means objectively true.
- Users cannot distinguish AI-inferred from user-confirmed meaning.
- Users feel watched, judged, or slowed down by memory controls.
- Users ignore uncertainty labels because the symbolic design is too attractive.

## Prototype plan

Build four variants of the same reflective card:

1. Plain disclosure only.
2. Symbolic chip only.
3. Dashboard/audit panel only.
4. Hybrid: symbolic chip with expandable audit panel.

Measure:
- comprehension of source and scope,
- false certainty,
- perceived flow interruption,
- correction/edit rate,
- rollback success,
- perceived surveillance or judgment,
- delayed recall of what was user-confirmed versus AI-inferred.

## Claim status

Claim: Symbolic memory controls can preserve reflective flow while improving user understanding of uncertainty and influence scope.

Status: plausible but unproven.

Evidence supports the risk and the need for calibrated uncertainty communication. Evidence does not yet prove that MC’s symbolic visual language is safer or more usable than plain text or dashboard controls.

## Next research question

How should MC experimentally measure whether users mistake visually rich uncertainty markers for depth, identity truth, or hidden authority?