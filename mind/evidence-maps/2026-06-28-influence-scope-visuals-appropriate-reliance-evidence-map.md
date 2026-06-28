# Evidence Map — Influence Scope Visuals and Appropriate Reliance

Date: 2026-06-28
Status: Claim narrowed; design principle supported; MC-specific effect unproven.

## Claim tested

Original weak claim:

> MC can make “allowed influence” instantly understandable through a compact visual form such as a card, label, slider, traffic light, permission receipt, or timeline.

Narrowed claim:

> A compact Influence Scope visual may help users calibrate reliance on an MC interpretation if it clearly separates what the interpretation is allowed to influence, what it must not influence, what evidence supports it, and what verification action is expected next.

This is not yet proven for MC. Current evidence supports testing the pattern, not shipping it as a solved mechanism.

## Why this matters to MC

Mirror Cartographer produces reflective interpretations. The main safety risk is not only factual error; it is unbounded influence. A symbolic interpretation can quietly affect memory, identity, relationships, decisions, and future prompts. A user may not experience that as “following AI advice,” but architecturally it is still reliance.

Therefore MC needs a visual object that makes influence boundaries legible before the interpretation is absorbed as self-knowledge.

## Evidence found

### Fact 1 — Overreliance is a recognized human-AI failure mode

Human-AI decision support often assumes the human retains final control, but studies show human-AI teams can underperform either the human or AI alone when reliance is poorly calibrated. A 2024 FAccT paper argues that “appropriate reliance” needs more careful statistical grounding and should distinguish reliance rate from belief formation and payoff consequences.

Evidence implication for MC: do not measure success only by whether users like or accept an interpretation. Measure whether they adopt, reject, modify, or quarantine it in relation to evidence and stakes.

### Fact 2 — Simple explanations are not enough

Buçinca, Malaya, and Gajos found that cognitive forcing functions reduced overreliance compared with simple explainable-AI approaches, but the strongest interventions also received worse subjective ratings and benefited high-Need-for-Cognition users more.

Evidence implication for MC: an Influence Scope visual should not be a decorative explanation. It must create a small, useful pause. It also must avoid turning into a burdensome checklist that only works for users who already enjoy analytic friction.

### Fact 3 — Uncertainty signals can help, but can backfire

Microsoft’s 2024 research synthesis on appropriate reliance in GenAI reports that explanations, uncertainty expressions, self-critiques, and cognitive forcing functions can help reduce overreliance. It also warns that mitigation strategies must be tested in context because they can increase cognitive load, reduce trust where under-trust already exists, or even increase overreliance.

Evidence implication for MC: “low confidence” labels are not enough. MC needs context-specific tests of whether each visual treatment improves judgment without killing reflective flow.

### Fact 4 — Visual uncertainty should be actionable, not ornamental

The Microsoft synthesis notes that highlight-based uncertainty may be useful, especially when the highlight indicates something actionable, such as a high probability of needing edits, rather than a raw low-probability token marker.

Evidence implication for MC: the Influence Scope Card should highlight where action is required: verify, revise, do not store, do not transmit, or keep as metaphor only.

## Fact / inference split

### Supported facts

- Overreliance and misreliance are real problems in human-AI decision-making.
- Cognitive forcing can reduce overreliance in some studies.
- Explanations alone are often insufficient.
- Uncertainty displays can help, but their effectiveness varies by context and user.
- Reliance should be evaluated in relation to task stakes, evidence, and payoff/loss, not only acceptance rate.

### Reasonable inferences

- MC interpretations should be treated as advice-like objects when they can influence future memory, identity, relationships, or behavior.
- “Allowed influence” should be displayed separately from “confidence.” A claim can be low-confidence but still emotionally powerful; it can also be high-confidence but not appropriate to store or transmit.
- The card should use small friction rather than heavy paperwork.

### Not proven

- That an Influence Scope Card improves MC user outcomes.
- That any specific visual form — card, slider, traffic light, receipt, label, or timeline — is best.
- That users will correctly understand “influence scope” without onboarding.
- That reduced overreliance is always good; underreliance and loss of reflective flow are plausible harms.

## Evaluation criterion

### INFLUENCE-VIS-01 — Appropriate influence calibration

An Influence Scope visual passes only if, compared with a plain interpretation, it improves at least two of the following without worsening more than one:

1. Users can correctly state what the interpretation is allowed to affect.
2. Users can correctly state what it is not allowed to affect.
3. Users can identify what evidence supports it.
4. Users can identify what would change or weaken it.
5. Users delay or modify adoption when evidence is weak or stakes are high.
6. Users still experience the interaction as reflective rather than bureaucratic.

## Prototype test plan

### Conditions

Test the same MC interpretation in five UI variants:

1. Plain interpretation only.
2. Interpretation + confidence label.
3. Interpretation + short uncertainty explanation.
4. Interpretation + Influence Scope Card.
5. Interpretation + Influence Scope Card plus one cognitive forcing question.

### Sample interpretation class

Use public-safe, non-clinical, low-stakes symbolic interpretations. Avoid real private relationship or health claims.

Example class:

> “The recurring bridge image may be functioning as a transition symbol rather than a destination symbol.”

### Measurements

For each participant or self-test pass, record:

- Comprehension of allowed influence.
- Comprehension of blocked influence.
- Evidence recall.
- Revision behavior.
- Adoption behavior.
- Felt burden.
- Reflective usefulness.
- Whether the user wants the interpretation stored, revised, or discarded.

### Minimum viable test

Run 10 interpretations across at least 3 variants: plain, confidence label, and Influence Scope Card. If the card does not outperform the confidence label on influence comprehension, do not treat it as validated.

## Falsification checklist

The claim should be downgraded if any of the following occur:

- Users treat the card as a decorative trust badge.
- Users remember the interpretation but not its limits.
- The visual increases acceptance of weak interpretations.
- The visual reduces reflective flow so much that users skip it.
- The card helps analytical users but confuses or burdens others.
- “Allowed influence” is interpreted as system permission rather than user agency.
- The strongest effect comes from wording, not visual form.

## Requirement update

### R-INFLUENCE-02 — Influence scope must be separated from confidence

MC must not collapse confidence, privacy permission, memory persistence, and influence scope into one control. Every interpretation that can be saved, reused, or acted on must distinguish:

- Confidence: how well-supported the interpretation is.
- Storage: whether it may be remembered.
- Retrieval: when it may be brought back.
- Influence: what future outputs or decisions it may affect.
- Transmission: whether it may be shared outside the current context.
- Revision: what evidence would update or revoke it.

## Design implication

The next visual prototype should be a small card, not a slider-first design.

Reason: the evidence points toward actionable boundaries and verification prompts, not a single scalar. A slider risks implying that influence is one-dimensional. MC influence is multidimensional: memory, identity, action, relationship, creative direction, public artifact, and future retrieval.

## Next proof needed

Build three public-safe static prototypes:

1. Confidence Label
2. Influence Scope Card
3. Permission Receipt Timeline

Then test whether a reader can answer, without explanation:

- What can this interpretation affect?
- What can it not affect?
- What should I do before believing it?
- Should it be stored, revised, or discarded?

If users cannot answer those within 30 seconds, the visual form is not yet doing its job.
