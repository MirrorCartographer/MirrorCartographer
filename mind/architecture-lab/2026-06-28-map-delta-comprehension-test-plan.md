# Map Delta Comprehension Test Plan

Date: 2026-06-28
Status: architecture research artifact
Public-safety status: abstracted; no private user material included

## Architecture question

How can Mirror Cartographer test whether users understand map deltas accurately without over-trusting the visual metaphor or feeling forced into database management?

## Why this question matters

Recent MC architecture work introduced Map Delta Objects: visible changes in the symbolic map that bind to source, confidence, uncertainty, user action, and future-use rules.

That creates a new risk: a beautiful visual delta can feel more authoritative than the evidence behind it. If a map changes shape, users may experience the change as confirmation rather than as a provisional interpretation. The system must therefore test delta comprehension, not just render deltas.

## Sources reviewed

1. Arif Ahmed et al., `Trust in Generative AI for Health Information Consumption and the Effect of Learned Dependency: An Experimental Investigation`, arXiv, 2026-05-21.
   - Key finding used: learned dependency on GenAI was associated with higher trust in incorrect AI-generated information; text highlighting alone did not reduce overreliance.
   - URL: https://arxiv.org/abs/2606.20605

2. Carina Newen et al., `Uncertainty Awareness and Trust in Explainable AI - On Trust Calibration using Local and Global Explanations`, arXiv, 2025-09-10.
   - Key concept used: uncertainty explanations and global explanations can affect trust calibration, but interpretability and satisfaction are not the same as calibrated understanding.
   - URL: https://arxiv.org/abs/2509.08989

3. Jingshu Li et al., `Overconfident and Unconfident AI Hinder Human-AI Collaboration`, arXiv, 2024-02-12.
   - Key finding used: uncalibrated confidence can cause both misuse of overconfident AI and disuse of underconfident AI; calibration support helps users notice miscalibration but can also create distrust/disuse.
   - URL: https://arxiv.org/abs/2402.07632

4. Guy Lupo, Bao Quoc Vo, Natania Locke, `Trustworthy AI Posture (TAIP): A Framework for Continuous AI Assurance of Agentic Systems at Horizontal and Vertical scale`, arXiv, 2026-02-15.
   - Key concept used: trustworthy systems need continuously generated, evidence-bound assurance objects rather than static trust claims.
   - URL: https://arxiv.org/abs/2603.03340

5. Richard Kang, `Governed AI-Assisted Engineering: Graduated Human Oversight for Agentic Code Generation in Regulated Domains`, arXiv, 2026-06-21.
   - Key concept used: oversight should be proportionate to impact, reversibility, data sensitivity, and user/customer proximity.
   - URL: https://arxiv.org/abs/2606.22484

## Fact / inference boundary

### Facts supported by sources

- GenAI users can become more likely to trust incorrect outputs when learned dependency is high.
- Simple visual/text highlighting is not sufficient protection against overreliance.
- AI confidence displays can help or harm depending on whether confidence is calibrated and whether users understand calibration.
- Continuous assurance models treat trustworthiness as evidence-bound and ongoing, not as a static label.
- Oversight can be scaled by risk factors such as reversibility, proximity to user impact, and sensitivity.

### Inferences for MC

- A map delta should not be treated as a decorative animation. It should be an assurance object with evidence, uncertainty, reversibility, and repair metadata.
- MC should measure whether users can explain what changed, why it changed, how certain it is, and what they can do about it.
- MC should avoid using visual intensity alone as the main signal of truth. Intensity may communicate importance, salience, or uncertainty, but must be labeled and testable.
- MC needs comprehension checks that are map-native and light, not database-style administrative screens.

These inferences are architecture hypotheses, not proven facts.

## Design pattern: Delta Comprehension Gate

A Delta Comprehension Gate is a lightweight interaction that appears after a meaningful map change. Its job is not to quiz the user aggressively. Its job is to preserve cognitive agency by making sure the visual metaphor has not become false certainty.

### Trigger conditions

Run the gate when at least one is true:

- Confidence changed by more than a defined threshold.
- A symbol moved state: proposed, admitted, dimmed, withheld, quarantined, contested, corrected, bridged, or expired.
- The delta affects future memory retrieval.
- The delta could influence identity, relationship, health, money, safety, or major life interpretation.
- The system used uncertain inference rather than direct user-provided fact.

### Gate questions

Use one or two of these, depending on risk:

1. `What changed on the map?`
2. `Was this change based on a fact, an inference, or a user correction?`
3. `How certain is this interpretation?`
4. `What should MC do with this change next time: use it, narrow it, dim it, quarantine it, or ignore it?`
5. `What alternative interpretation should remain visible?`

### Pass condition

The user does not need to agree with the system. The user only needs to correctly understand the status of the delta:

- source type recognized
- uncertainty recognized
- future-use rule understood
- repair path visible
- alternative retained when uncertainty is material

### Fail condition

A failure occurs when the user treats an uncertain map delta as:

- settled truth
- diagnosis
- destiny
- proof of hidden intent
- proof of system omniscience
- a permanent identity claim
- a memory edit with no consequence

## Evaluation criterion: Map Delta Comprehension Score

Score each meaningful delta from 0–2 on each dimension.

0 = absent or misleading
1 = present but weak or ambiguous
2 = clear, usable, and correctly understood by user

Dimensions:

1. Delta visibility: user can tell what changed.
2. Source clarity: user can tell whether the delta came from user input, memory, inference, retrieval, or correction.
3. Confidence clarity: user can tell how certain the system is.
4. Uncertainty preservation: unresolved alternatives remain visible when needed.
5. Future-use clarity: user can tell whether this will affect future sessions.
6. Repairability: user can delete, narrow, dim, quarantine, correct, or contest the delta.
7. Non-authority: visual design does not imply diagnosis, destiny, or hidden certainty.
8. Cognitive agency: user remains able to disagree without losing the map.

Maximum score: 16
Minimum acceptable score for high-impact deltas: 14
Minimum acceptable score for low-impact deltas: 10

## Test plan v0.1

### Test set size

Create 30 scripted interactions:

- 6 low-risk symbolic deltas
- 6 memory-source deltas
- 6 contested-memory deltas
- 6 high-uncertainty interpretation deltas
- 6 high-impact identity/body/relationship/money/safety-adjacent deltas

### Test method

For each interaction:

1. Give user a symbolic input.
2. Let MC generate a map delta.
3. Ask the user to explain the delta in plain language.
4. Ask whether it should affect future sessions.
5. Ask what they would change, contest, or preserve.
6. Score using Map Delta Comprehension Score.

### Required falsification cases

MC fails this design pattern if users repeatedly:

- mistake inference for fact
- cannot find the source of a delta
- cannot tell what will affect future memory
- over-trust a beautiful or intense visual shift
- under-trust a useful correction because it looks too uncertain
- feel forced into database management instead of map repair
- cannot preserve disagreement while continuing the session

## Implementation requirements

Every Map Delta Object must include:

- `delta_id`
- `previous_state`
- `new_state`
- `source_type`
- `source_pointer`
- `confidence_before`
- `confidence_after`
- `uncertainty_reason`
- `alternative_interpretations`
- `user_action_available`
- `future_use_rule`
- `reversibility`
- `impact_tier`
- `comprehension_gate_required`
- `comprehension_score`

## Prototype sketch

Instead of showing a database panel, MC should show a small map-native repair card:

Title: `The map shifted here.`

Body:

- `Changed:` symbol moved from proposed to admitted.
- `Because:` repeated user language matched earlier pattern.
- `Certainty:` medium, not settled.
- `Future use:` may influence future symbolic prompts.
- `Your choices:` keep, narrow, dim, quarantine, correct.

Then one comprehension prompt:

`Before this becomes part of the map, what do you think changed?`

## Current status

This artifact turns the prior Belief Terrain / Map Delta work into a testable requirement.

The key shift is:

from: `Can MC show interpretation changes beautifully?`

to: `Can users correctly understand, contest, and govern interpretation changes?`

## Next research question

How should MC assign impact tiers to symbolic interpretations so the system knows when to use light-touch repair versus stronger agency-preserving friction?
