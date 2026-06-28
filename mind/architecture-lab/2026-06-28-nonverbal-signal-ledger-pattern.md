# Nonverbal Signal Ledger Pattern

Date: 2026-06-28
Status: architecture pattern / prototype plan
Public-safety level: public-safe; no private user material; no diagnosis; no claim of literal animal translation.

## Architecture question

How should Mirror Cartographer capture nonverbal signals from bodies, animals, environments, or interactions without turning observation into false translation, diagnosis, or symbolic authority?

## Why this question surfaced

The latest research signal was interspecies communication AI. Recent animal-communication work is moving from novelty translation toward rigorous multimodal evidence: vocalization, behavioral context, playback response, identity signatures, timing, and uncertainty. That matters for MC because symbolic mapping often starts from nonverbal material: posture, tone, movement, atmosphere, repeated cues, and contextual shifts.

The architecture risk is not that MC cannot notice patterns. The risk is that MC may over-convert patterns into meanings.

## Research basis

1. Julie Elie's zebra finch work, recognized by the 2026 Coller-Dolittle Prize, combined long-term observation, call classification, machine learning, and behavioral tests. The useful architectural lesson is that meaning was not inferred from sound alone; it required context and response validation.
   Source: https://www.theguardian.com/science/2026/jun/26/human-animal-communication-step-closer-scientist-wins-prize-for-decoding-birdsong

2. Animal communication systems increasingly rely on continuous latent representations rather than only fixed categories. The useful architectural lesson is that MC should preserve signal richness and uncertainty instead of forcing every signal into a named symbol.
   Source: Mason Youngblood, chatter: a Python library for applying information theory and AI/ML models to animal communication, arXiv:2512.17935.

3. AmadeusGPT shows a useful human-AI pattern: natural-language behavior descriptions can be converted into executable behavior-analysis workflows, with memory and symbolic pointers. The useful architectural lesson is that MC can let users describe signals in ordinary language while preserving structured evidence and revisable definitions.
   Source: Ye et al., AmadeusGPT: a natural language interface for interactive animal behavioral analysis, arXiv:2307.04858.

4. Theoretical work on animal communication translation emphasizes sample complexity and common ground. The useful architectural lesson is that MC should not call a signal a translation unless there is enough repeated, validated context.
   Source: Goldwasser, Gruber, Kalai, Paradise, A Theory of Unsupervised Translation Motivated by Understanding Animal Communication, arXiv:2211.11081.

## Fact / inference separation

### Supported facts

- Machine learning can classify and model animal vocalizations and behavioral signals.
- Stronger animal-communication claims require context, repeated observations, and validation through response or experimental testing.
- Continuous latent-space methods can preserve richer signal variation than hard labels.
- Natural-language interfaces can make behavioral analysis more usable for non-specialists.

### MC inferences

- MC should treat nonverbal observations as evidence records before symbolic interpretation.
- MC should separate user perception, observed cue, context, AI hypothesis, and confirmed meaning.
- MC should include explicit uncertainty and rollback fields so a poetic or symbolic reading does not harden into fact.
- MC should support pet/body/environment signal mapping as observation tooling, not diagnosis or literal translation.

### Claims not yet proven

- That MC's signal ledger improves user interpretation accuracy.
- That symbolic signal mapping reduces distress or confusion.
- That users will reliably understand the difference between observed signal, hypothesis, and meaning.
- That this pattern works across animals, human body cues, and social/ambient signals without domain-specific calibration.

## Design pattern: Nonverbal Signal Ledger

A Nonverbal Signal Ledger is a structured record that preserves the chain from cue to interpretation.

It prevents this collapse:

signal -> symbol -> meaning -> truth

It enforces this chain instead:

observed cue -> context -> candidate pattern -> uncertainty -> allowed interpretation -> validation status -> next observation

## Minimal schema

```yaml
nonverbal_signal_record:
  record_id: string
  created_at: datetime
  domain: enum[animal, body, environment, social_interaction, creative_process, other]
  signal_type: enum[sound, movement, posture, gaze, timing, repetition, physiological_feel, environmental_change, mixed]
  raw_observation: string
  context:
    place: string | null
    time_window: string | null
    preceding_event: string | null
    co_occurring_signals: list[string]
  observer_note:
    user_perception: string
    emotional_color: string | null
    confidence: enum[low, medium, high]
  evidence_separation:
    directly_observed: list[string]
    inferred_by_user: list[string]
    inferred_by_ai: list[string]
    unsupported_or_poetic: list[string]
  candidate_meanings:
    - meaning: string
      basis: list[string]
      uncertainty: enum[low, medium, high]
      allowed_use: enum[reflection_only, pattern_tracking, prompt_followup, care_planning_support, do_not_use_for_decisions]
      blocked_use: list[string]
  validation:
    repeated_count: integer
    response_tested: boolean
    outcome_observed: string | null
    contradicted_by: list[string]
    status: enum[unvalidated, weak_pattern, supported_pattern, contradicted, retired]
  rollback:
    correction_note: string | null
    retired_at: datetime | null
```

## Interface rule

MC may show a symbolic reading only after it shows the evidence boundary.

Required UI order:

1. What was directly observed.
2. What is only a possible pattern.
3. What MC is not allowed to conclude.
4. What the user can observe next.
5. Optional symbolic reflection.

## Interpretation rules

- Never label a nonverbal signal as translation without repeated context and validation.
- Never convert a pet/body signal into diagnosis.
- Never treat one intense event as stable meaning.
- Never hide uncertainty behind beautiful symbolic language.
- Always keep a route back to raw observation.

## Prototype plan

### Prototype v0.1: Pet Signal Ledger

Purpose: observation support only.

Inputs:
- sound or behavior description
- context
- preceding event
- visible body/posture cues
- user guess
- confidence
- next observation

Outputs:
- direct observations
- possible patterns
- uncertainty level
- what not to infer
- next concrete observation
- optional symbolic reflection label

### Prototype v0.2: Body Signal Ledger

Same pattern, but for human body-sensation language. Must include stronger warnings around medical interpretation and care decisions.

### Prototype v0.3: Ambient / Social Signal Ledger

Same pattern, but for repeated social or environmental cues. Must include anti-paranoia and anti-overpatterning constraints.

## Requirement update

Add to MC requirements:

MC-REQ-SIGNAL-001: Any nonverbal signal interpretation must preserve a structured evidence boundary between direct observation, user inference, AI inference, poetic-symbolic framing, and validated pattern.

MC-REQ-SIGNAL-002: Nonverbal signal records must include explicit blocked-use fields so the system cannot silently reuse weak observations as diagnosis, prediction, identity claim, or memory authority.

MC-REQ-SIGNAL-003: Symbolic rendering of nonverbal signals must be downstream of observation, uncertainty, and validation status, not upstream of them.

## Evaluation criterion

A successful implementation lets a user answer:

- What did I actually observe?
- What am I guessing?
- What is the AI guessing?
- What would prove this pattern stronger?
- What would falsify it?
- What should this not be used for?

## Next proof needed

Build a small test set of nonverbal signal examples and compare:

1. plain journaling,
2. symbolic interpretation only,
3. Nonverbal Signal Ledger,
4. ledger plus symbolic reflection.

Measure false certainty, correction rate, user comprehension, emotional intensity, and whether users can accurately state what remains unknown.
