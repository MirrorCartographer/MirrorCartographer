# Risk-Bounded Interpretation Pattern

Date: 2026-06-28
Status: architecture note / prototype requirement
Public-safety level: abstracted; no private case material included

## Architecture question

How should Mirror Cartographer represent an AI-generated interpretation so it does not behave like a truth claim by default?

Latest research signal: real-world embodied AI and agentic AI governance increasingly frame outputs as actions under uncertainty, with context, risk, operating limits, and continuous assurance. MC can borrow that frame for symbolic interpretation.

## Short answer

An MC interpretation should be treated as a risk-bounded action proposal, not as a conclusion.

That means every interpretation object should carry:

1. what it is proposing,
2. what it is allowed to influence,
3. what it is not allowed to influence,
4. what evidence supports it,
5. what uncertainty remains,
6. what failure modes are plausible,
7. what would falsify or weaken it,
8. how the user can quarantine, revise, or roll it back.

## Evidence reviewed

### 1. NIST AI RMF and Generative AI Profile

NIST describes the AI RMF as a voluntary framework for managing AI risks to individuals, organizations, and society. The framework is intended to incorporate trustworthiness considerations into design, development, use, and evaluation. NIST released the Generative AI Profile on 2024-07-26 to identify risks specific to generative AI and actions for managing those risks.

Source: https://www.nist.gov/itl/ai-risk-management-framework

Useful concept for MC: interpretation risk should be handled across the lifecycle, not as a one-time disclaimer. MC needs design-time constraints, use-time visibility, evaluation, and post-use revision.

### 2. Cognitive forcing and overreliance

Buçinca, Malaya, and Gajos found that users can overrely on AI decision support, and that simple explanations may fail to reduce overreliance. Cognitive forcing functions reduced overreliance, but with usability trade-offs and unequal benefits across users with different levels of need for cognition.

Source: https://arxiv.org/abs/2102.09692

Useful concept for MC: friction can protect agency, but friction itself is not automatically good. MC should use calibrated friction: require challenge, scope selection, or uncertainty inspection only when interpretation impact is high.

### 3. First-principles risk assessment for generative AI

Tong et al. distinguish process risks from outcome risks and argue that generative AI governance should prioritize risks created by outputs and their real-world effects. They classify AI-generated outputs into perception-level information, knowledge-level information, decision/action plans, and control tokens.

Source: https://arxiv.org/abs/2504.00091

Useful concept for MC: interpretations should be typed by impact level. A symbolic phrase, a memory update, a behavioral suggestion, and a system action do not carry the same risk.

### 4. Continuous assurance for agentic AI

Recent agentic AI governance work argues that point-in-time audits are insufficient for nondeterministic systems and proposes reusable assurance objects that bind claims to evidence and continuous posture signals.

Source: https://arxiv.org/abs/2603.03340

Useful concept for MC: an interpretation should have an evidence posture, not merely a confidence label. Its status should change as new evidence, contradiction, user correction, or downstream effects appear.

### 5. Risk-aware robotics signal

Recent reporting on FieldAI describes robot software designed for complex environments using physics and probability to make risk-aware decisions under uncertainty, rather than depending only on large data scaling.

Source: https://www.businessinsider.com/robot-startup-fieldai-achieves-100-m-milestone-in-revenue-contracts-2026-6

Useful concept for MC: the analogy is not that MC is robotics. The analogy is that action under uncertainty requires operating envelopes. Symbolic interpretation also needs operating envelopes because interpretations can influence memory, identity, decisions, and future prompts.

## Fact vs inference

### Supported facts

- AI decision support can produce overreliance.
- Explanations alone may not reduce overreliance.
- Cognitive forcing can reduce overreliance in some settings, with usability and equity trade-offs.
- NIST frames AI risk management as a lifecycle process.
- Generative AI output risk depends partly on what the output is used to do.
- Recent agentic AI governance research emphasizes continuous assurance rather than static documentation.

### Reasonable inferences

- MC should not rely on disclaimers alone to prevent false authority.
- MC should classify interpretations by impact and allowed influence scope.
- MC should let users contest, quarantine, revise, and retire interpretations.
- MC should treat symbolic interpretations as proposed actions in a cognitive environment.

### Not yet proven

- That this pattern improves user agency compared with plain-language disclosure.
- That users will understand or tolerate the additional structure.
- That symbolic framing plus risk bounds is better than a conventional checklist or dashboard.
- That this pattern improves long-term memory quality.

## Design pattern

Name: Risk-Bounded Interpretation

Definition: A symbolic or reflective interpretation object whose authority is limited by an explicit operating envelope.

Core rule: no interpretation may influence memory, identity summaries, future recommendations, or high-impact suggestions unless its risk tier and allowed influence scope are explicit.

## Required fields

```yaml
interpretation_id: string
created_at: datetime
source_event_id: string
interpretation_text: string
claim_type:
  - observation
  - metaphor
  - hypothesis
  - pattern
  - suggestion
  - memory_update
  - action_plan
impact_tier:
  - low
  - medium
  - high
  - blocked
allowed_influence:
  memory: none | temporary | scoped | persistent
  recommendations: none | low_stakes | user_confirmed_only
  identity_summary: none | tentative | user_approved
  external_action: never | explicit_user_command_only
uncertainty:
  confidence_label: low | medium | high
  missing_evidence: string[]
  alternative_explanations: string[]
failure_modes:
  - false_authority
  - emotional_overfit
  - source_memory_blur
  - identity_lock_in
  - privacy_leakage
  - overgeneralization
falsification:
  would_weaken_if: string[]
  would_retire_if: string[]
controls:
  user_can_challenge: true
  user_can_quarantine: true
  user_can_rollback: true
  requires_reapproval_for_persistence: true
status:
  - proposed
  - user_contested
  - revised
  - scoped
  - approved_for_session_only
  - approved_for_memory
  - retired
```

## Minimal UI behavior

1. Low-impact interpretation: visible uncertainty label and one-tap challenge.
2. Medium-impact interpretation: show allowed influence scope before saving.
3. High-impact interpretation: require user confirmation, alternative explanations, and rollback option.
4. Blocked interpretation: refuse persistence or action until reframed into a lower-risk form.

## Evaluation criterion

Risk-Bounded Interpretation passes only if it improves at least one agency/safety measure without producing unacceptable friction.

Candidate measures:

- Unsupported-leap detection: user identifies when the AI made an inference beyond evidence.
- False acceptance rate: user accepts unsupported interpretation as fact.
- Scope recall: user can state what the interpretation is allowed to influence.
- Rollback success: user can remove or weaken a prior interpretation.
- Friction burden: user does not abandon the flow at a materially higher rate than baseline.
- Memory contamination: later summaries do not treat unapproved interpretations as settled truth.

## Falsification checklist

This pattern should be weakened or rejected if testing shows any of the following:

- Users treat the risk labels as extra authority rather than caution.
- Users cannot tell the difference between observation, metaphor, hypothesis, and action plan.
- Symbolic framing causes more false acceptance than plain disclosure.
- The controls create so much friction that reflective flow collapses.
- Memory still absorbs unapproved interpretations.
- The system cannot reliably enforce allowed influence scope.

## Prototype plan

Build one prototype screen with five comparison modes:

1. Plain interpretation.
2. Interpretation plus disclaimer.
3. Interpretation plus checklist.
4. Interpretation Object lifecycle.
5. Risk-Bounded Interpretation envelope.

Test with deliberately ambiguous prompts. Each mode must answer the same prompt. Measure whether users can identify evidence, inference, uncertainty, allowed influence, and rollback path.

## Current claim status

Conservative claim: Risk-Bounded Interpretation is a plausible architecture pattern for reducing false authority and unsafe memory influence in MC.

Do not claim: Risk-Bounded Interpretation has been proven to reduce overreliance or improve reflective outcomes.

## Next proof needed

A small controlled comparison against simpler baselines: disclaimer, checklist, and standard interpretation object. The key proof is not whether the pattern looks intelligent. The key proof is whether it changes user behavior: less false acceptance, clearer scope understanding, successful rollback, and tolerable friction.
