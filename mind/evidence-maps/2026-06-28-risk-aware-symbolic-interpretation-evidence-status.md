# Evidence Status: Risk-Aware Symbolic Interpretation

Date: 2026-06-28
Status: **risk supported; MC-specific benefit unproven**
Public-safety level: public-safe / no private user material

## Claim tested

Mirror Cartographer can make symbolic interpretation safer by requiring each interpretation to expose uncertainty, possible harm, memory influence, user-confirmed meaning, and rollback path.

Short name: **Risk-Aware Symbolic Interpretation**.

## Current claim wording

### Too strong

"Risk-aware symbolic interpretation prevents false certainty and overreliance."

### Safer wording

"Risk-aware symbolic interpretation is a proposed design pattern intended to reduce false certainty and inappropriate memory influence by making uncertainty, influence scope, user confirmation, and rollback visible. Existing HCI evidence supports the risk model, but MC must still prove that its symbolic layer improves calibration without harming reflective flow."

## Why this claim needed testing

Recent MC architecture artifacts use uncertainty/status layers, memory trust gates, and symbolic control chips. The weak point is not whether uncertainty and overreliance are real problems. They are. The weak point is whether a symbolic interface improves them rather than making uncertain interpretations feel deeper, more personal, or more authoritative.

## Evidence found

### Fact: overreliance on AI advice is a documented human-AI interaction problem

Buçinca, Malaya, and Gajos found that cognitive forcing functions reduced overreliance compared with simple AI explanations in AI-assisted decision-making. Their study also found a usability/trust tradeoff: interventions that reduced overreliance most were rated less favorably by users.

Source: Zana Buçinca, Maja Barbara Malaya, Krzysztof Z. Gajos, "To Trust or to Think: Cognitive Forcing Functions Can Reduce Overreliance on AI in AI-Assisted Decision-Making," Proceedings of the ACM on Human-Computer Interaction, 2021. https://doi.org/10.1145/3449287

### Fact: explanations and reasoning displays can increase trust without necessarily improving calibration

Recent human-AI work reports that showing AI reasoning can act as a persuasive heuristic, increasing agreement with AI and crowding out unique human knowledge. This supports caution around rich interpretive displays.

Source: Chen, Gao, and Liang, "Revealing AI Reasoning Increases Trust but Crowds Out Unique Human Knowledge," 2025. https://arxiv.org/abs/2511.04050

### Fact: uncertainty communication can help or hurt depending on calibration and presentation

Research on uncalibrated AI confidence finds that overconfident AI can promote misuse while underconfident AI can promote disuse. Trust calibration support may reduce misuse but can also create distrust/disuse. This means MC cannot assume that uncertainty visuals are automatically beneficial.

Source: Li, Yang, Zhang, and Lee, "Overconfident and Unconfident AI Hinder Human-AI Collaboration," 2024. https://arxiv.org/abs/2402.07632

### Fact: reported trust and behavioral reliance are distinct and should be evaluated separately

A 2026 human-AI decision-making study found no general evidence that a two-step workflow reduces overreliance and emphasized that reported trust and behavioral reliance are separate constructs. MC tests should therefore measure both self-report and behavior.

Source: Spillner, Ringe, Porzel, and Malaka, "Not All Trust is the Same: Effects of Decision Workflow and Explanations in Human-AI Decision Making," 2026. https://arxiv.org/abs/2603.05229

### Fact: interaction harms require interactive evaluation, not only static model tests

Knight First Amendment Institute's 2025 work on interaction harms argues that static, model-only tests miss harms that emerge through sustained human-AI interaction. MC should therefore test multi-turn symbolic interpretation, not just single-response clarity.

Source: "Towards Interactive Evaluations for Interaction Harms in Human-AI Systems," Knight First Amendment Institute, 2025-06-23. https://knightcolumbia.org/content/towards-interactive-evaluations-for-interaction-harms-in-human-ai-systems

## Inference

The evidence supports MC's concern that interpretive AI can create false certainty, overreliance, and hidden influence. It does **not** prove that MC's symbolic visual layer reduces those risks. The symbolic layer may help users understand uncertainty, or it may become an aesthetic authority cue.

## Claim status

- Risk model: **supported**
- Design direction: **plausible**
- MC-specific safety benefit: **unproven**
- Needed next: **comparative evaluation**

## Evaluation criterion: Risk-Aware Symbolic Interpretation

MC passes this criterion only if users can accurately answer all five questions after receiving an interpretation:

1. What part is user-confirmed?
2. What part is AI-inferred?
3. What memory or prior context influenced the interpretation?
4. What is uncertain or blocked from influence?
5. How can the user correct, roll back, or disable the interpretation?

The criterion fails if users treat the symbolic display as a hidden authority, identity truth, diagnostic claim, or stronger evidence than plain text.

## Minimal test plan

Compare four interface variants:

1. Plain text uncertainty disclosure
2. Dashboard-style status labels
3. Symbolic status layer only
4. Hybrid symbolic layer plus expandable audit record

### Test tasks

Use public-safe fictional scenarios involving ambiguous emotional-symbolic inputs, conflicting memory, and uncertain interpretation.

### Metrics

- Comprehension: can the user identify confirmed vs inferred content?
- Reliance behavior: does the user accept incorrect symbolic interpretation?
- Correction behavior: does the user revise or reject bad interpretation?
- Flow cost: does the control layer make reflection feel interrupted?
- False authority: does the user describe AI-inferred meaning as true, deep, diagnostic, or identity-defining?
- Rollback success: can the user find and use the correction/rollback path?

## Falsification checklist

Treat the design as unsafe or not yet ready if any of the following occur:

- Users rate symbolic uncertainty markers as more "true" than plain uncertainty labels without better comprehension.
- Users remember AI-inferred symbolic meanings as self-confirmed meanings.
- Users cannot identify which memory influenced an interpretation.
- Users cannot locate rollback/correction controls.
- Symbolic visuals increase agreement with incorrect interpretations.
- The interface preserves flow but reduces skepticism.
- The interface improves self-reported trust but worsens behavioral calibration.

## Implementation requirement

Every symbolic interpretation object should carry a machine-readable status block:

```yaml
interpretation_status:
  user_confirmed: []
  ai_inferred: []
  memory_influence: []
  uncertainty: []
  blocked_influence: []
  possible_harm: []
  rollback_path: null
  confidence_language: "qualitative only; no numeric certainty unless empirically calibrated"
```

Public UI may compress this, but the underlying audit object must remain available.

## Next proof needed

Run a small comparative evaluation using fictional scenarios:

- 12-20 participants or internal evaluator runs
- Four interface variants
- At least three intentionally wrong or overreaching interpretations
- Measure comprehension, correction, overreliance, rollback use, and reflective flow

The next evidence artifact should not claim that the symbolic layer works unless it beats plain text or dashboard controls on calibration without unacceptable flow cost.
