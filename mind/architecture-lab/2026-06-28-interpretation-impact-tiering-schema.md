# Interpretation Impact Tiering Schema

Date: 2026-06-28
Status: architecture pattern / requirements seed
Public-safe scope: no personal case material; applies to reflective, symbolic, memory-bearing AI systems.

## Architecture question

How should Mirror Cartographer assign impact tiers to symbolic interpretations automatically without over-classifying every meaningful reflection as high-risk or under-classifying identity-adjacent interpretations as harmless metaphor?

## Claim status

Narrowed, not proven.

Existing AI risk frameworks support tiering by context, affected rights/safety, use case, downstream influence, monitoring, and mitigation. Applying those ideas to symbolic-reflective interpretation is an architectural inference. MC still needs empirical testing to verify that the tiering actually preserves cognitive agency.

## Research basis

1. NIST AI RMF
   - AI risk management should address risks to individuals, organizations, and society.
   - The framework is voluntary and focuses on incorporating trustworthiness considerations into design, development, use, and evaluation.
   - The RMF is organized around Govern, Map, Measure, and Manage.
   - Source: https://www.nist.gov/itl/ai-risk-management-framework
   - Source: https://www.nist.gov/itl/ai-risk-management-framework/nist-ai-rmf-playbook

2. NIST Generative AI Profile
   - Generative AI needs risk management that fits the organization's goals and priorities.
   - Useful concept for MC: controls should be proportional to the specific system context, not copied wholesale from unrelated domains.
   - Source: https://www.nist.gov/itl/ai-risk-management-framework

3. European Commission draft high-risk AI guidelines, published 2026-05-19
   - AI can be classified as high-risk when it is a safety component/product requiring conformity assessment, or when it falls into listed Annex III use cases.
   - The Commission explicitly ties high-risk classification to potential effects on health, safety, or fundamental rights, and gives practical examples.
   - Useful concept for MC: classify by potential effect and domain of influence, not by model type or interface aesthetics.
   - Source: https://digital-strategy.ec.europa.eu/en/library/draft-commission-guidelines-classification-high-risk-ai-systems

4. Emerging agentic assurance work
   - Recent governance research frames trustworthiness as a continuously generated posture or assurance signal rather than a one-time label.
   - Useful concept for MC: an interpretation's tier can change as it is reused, stored, emphasized, corrected, or connected to later sessions.
   - Sources to track:
     - Trustworthy AI Posture (TAIP), 2026: https://arxiv.org/abs/2603.03340
     - AAGATE agentic AI governance control plane, 2025: https://arxiv.org/abs/2510.25863

## Design inference for MC

A symbolic interpretation should not be tiered by how poetic, intense, or emotionally resonant it sounds. It should be tiered by what it can do.

MC impact tiering should evaluate:

- claim type: observation, metaphor, hypothesis, identity-adjacent interpretation, memory rule, behavioral recommendation, health/legal/financial statement, relationship judgment, existential meaning claim
- affected domain: aesthetic, narrative, emotional, cognitive, relational, bodily, medical, legal, financial, safety-critical
- persistence: one-off only, session-local, saved memory, cross-session retrieval, public artifact, exported artifact
- action pressure: no action, reflection prompt, suggested action, strong recommendation, urgency framing, external-world consequence
- user-state sensitivity: ordinary reflection, distress-adjacent, identity-confusion-adjacent, crisis-adjacent, vulnerability/high-suggestibility-adjacent
- evidence basis: user-stated fact, user-provided artifact, model inference, analogy, external source, unsupported guess
- reversibility: easy dismiss, editable, repairable, quarantineable, hard to undo once internalized or shared
- system influence: visual emphasis only, retrieval boost, future prompt shaping, memory write, automation trigger, external communication

## Proposed tier model

### Tier 0: Decorative / aesthetic

Definition: expressive language, visual metaphor, styling, or atmosphere with no claim about the user, world, or future.

Allowed behavior:
- can be beautiful, symbolic, playful, poetic
- no memory write unless explicitly requested
- no confidence display required unless paired with a claim

Required guardrails:
- avoid implying hidden truth or destiny

Examples:
- color palette
- symbolic title
- moodboard label

### Tier 1: Low-impact reflective label

Definition: a provisional, user-contestable interpretation that only organizes already-provided material.

Allowed behavior:
- label as provisional
- offer alternatives
- allow quick edit/delete
- session-local by default

Required guardrails:
- distinguish observation from interpretation
- no identity finality

Examples:
- "This looks like a tension between safety and motion."
- "Possible theme: repair before expansion."

### Tier 2: Memory-shaping interpretation

Definition: an interpretation that may influence future sessions, retrieval, profile, map layout, or repeated framing.

Allowed behavior:
- save only with explicit user control or clearly visible memory rule
- include source, confidence, uncertainty, and future-use limit
- show repair controls

Required guardrails:
- memory write must be inspectable
- must include why it was saved and how to reverse it
- should not compress the user into a fixed trait

Examples:
- durable preference
- recurring symbol meaning
- stable project requirement

### Tier 3: Agency-sensitive interpretation

Definition: an interpretation that affects self-concept, relationships, vulnerability, major decisions, body/health meaning, or external-world choices.

Allowed behavior:
- use calibrated friction
- show multiple hypotheses
- require evidence/source separation
- offer contest and rollback
- avoid urgency unless safety requires it

Required guardrails:
- no destiny claims
- no diagnostic claims
- no hidden memory write
- no single-frame closure
- ask the user to judge fit before persistence

Examples:
- "This may be identity-adjacent."
- "This body sensation could mean several things; this system cannot diagnose it."
- "This relationship interpretation should stay tentative."

### Tier 4: High-impact / restricted

Definition: an interpretation or recommendation touching medical, legal, financial, crisis, coercion, self-harm, violence, abuse, irreversible action, or externally consequential claims.

Allowed behavior:
- informational support only within safety boundaries
- encourage appropriate professional or emergency help when warranted
- cite high-quality sources when making factual claims
- no symbolic certainty substituted for evidence

Required guardrails:
- no autonomous external action
- no diagnosis or legal/financial directive presented as certainty
- no identity locking
- no memory persistence unless explicitly safe and user-controlled

Examples:
- medical interpretation
- financial action plan
- legal/abuse allegation framing
- crisis-adjacent meaning-making

## Tier assignment rule

Assign the highest tier triggered by any of these fields:

- domain risk
- persistence
- action pressure
- user-state sensitivity
- reversibility
- system influence

Do not average risk downward. A beautiful metaphor becomes high-impact if it is saved as identity memory or used to push a consequential action.

## Minimal JSON-like schema

{
  "interpretation_id": "string",
  "interpretation_text": "string",
  "claim_type": "observation | metaphor | hypothesis | identity_adjacent | memory_rule | recommendation | high_impact_fact",
  "affected_domain": ["aesthetic", "emotional", "cognitive", "relational", "bodily", "medical", "legal", "financial", "safety"],
  "evidence_basis": ["user_stated", "artifact", "model_inference", "analogy", "external_source", "unsupported"],
  "persistence_scope": "none | session | saved_memory | cross_session | public_export",
  "action_pressure": "none | reflective | suggested | strong | urgent",
  "user_state_sensitivity": "ordinary | distress_adjacent | identity_adjacent | crisis_adjacent | high_suggestibility",
  "reversibility": "easy | editable | repairable | quarantineable | hard_to_undo",
  "system_influence": ["visual", "retrieval", "future_prompt", "memory_write", "automation", "external_comm"],
  "impact_tier": 0,
  "required_controls": ["label_provisional", "show_sources", "show_uncertainty", "offer_alternatives", "repair_palette", "rollback", "block_or_redirect"],
  "future_use_limit": "string"
}

## Requirements update

MC must implement interpretation impact tiering before durable memory becomes a core feature.

At minimum:

1. Every saved interpretation must have an impact tier.
2. Every Tier 2+ interpretation must expose future-use limits.
3. Every Tier 3+ interpretation must include alternatives and visible uncertainty.
4. Every Tier 3+ interpretation must include repair or rollback.
5. Every Tier 4 interpretation must route through safety/domain-specific constraints rather than symbolic inference.
6. Tier can only increase automatically; lowering a tier requires explicit evidence or human/user review.
7. The UI must explain the tier in plain language: "why this interpretation has more friction."

## Falsification checklist

This pattern fails if users:

- cannot tell which interpretations will affect future sessions
- believe metaphor labels are confirmed facts
- cannot reverse or quarantine saved interpretations
- over-trust high-impact interpretations because the visual design feels authoritative
- experience all friction as punishment rather than protection
- ignore the tier because the system makes it too abstract
- see too many Tier 3 warnings, causing warning fatigue
- see too few Tier 3 warnings, allowing identity-adjacent claims to persist silently

## Prototype plan

Build `interpretation-impact-tierer-v0.1` as a rules-first classifier.

Input:
- interpretation text
- source objects
- destination: display only, session map, durable memory, export, automation
- affected domains
- user action requested or implied

Output:
- tier
- reason codes
- required controls
- future-use limit
- recommended UI treatment

Initial UI treatments:

- Tier 0: no badge unless user asks
- Tier 1: small "provisional" label
- Tier 2: "may affect future map" label + repair palette
- Tier 3: agency gate + alternatives + uncertainty + rollback
- Tier 4: domain safety boundary + source requirement + no symbolic closure

## Next research question

How can MC display impact-tier friction so it feels like agency protection instead of interruption, scolding, or loss of flow?
