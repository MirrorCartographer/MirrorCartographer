# Evidence Map: Productive Friction Needs Calibration

Date: 2026-06-28

## Claim tested

Mirror Cartographer should use productive friction to protect user agency.

## Claim status

NARROWED / PARTIALLY SUPPORTED.

The current evidence supports the weaker claim that friction can protect reflection, authorship, verification, and skill retention when it is targeted. The evidence does not support the stronger claim that more friction is always safer, better, or more meaningful.

## Why this weak point matters

Mirror Cartographer currently uses several related architecture patterns:

- Belief Terrain Model
- Map Delta Object
- Probabilistic Trust Layer
- Reflective Control Plane
- Interpretation Impact Tiering

These patterns all add visible controls, uncertainty labels, contest paths, and repair steps. That direction is defensible only if the friction is calibrated to the risk and usefulness of the interpretation. Otherwise MC could become slow, scolding, performative, or cognitively expensive without improving agency.

## Evidence found

### Fact: frictionless AI can weaken judgment and verification

Recent HCI and cognitive-agency work argues that zero-friction AI interfaces can encourage premature closure, automation bias, and reduced independent verification. This supports treating friction as a possible agency-protection mechanism.

Evidence type: research / conceptual synthesis.

Confidence: medium. Strong conceptual fit; still needs direct MC-specific testing.

### Fact: tools-for-thought researchers are explicitly studying how GenAI affects cognition

CHI 2026 Tools for Thought work frames GenAI not only as automation, but as a cognitive substrate that can either protect or degrade critical thinking, learning, and sensemaking.

Evidence type: HCI workshop / research agenda.

Confidence: medium. Relevant field direction, not a direct product validation.

### Fact: sketching and material interaction can support reflection in AI-supported design

A recent AI-supported ideation paper reports that participants often preferred text prompting, while the authors argue for reintroducing reflection-through-sketching to preserve designerly thinking and essential design skills.

Evidence type: empirical HCI/design research.

Confidence: medium. Directly relevant to MC Symbol Sketch Mode, but the participant population and task domain are design education, not symbolic-emotional reflection.

### Fact: current agency-oriented frameworks distinguish automation from augmentation

Work on human agency in AI-mediated systems and workforce-agent auditing argues that tasks need different levels of human involvement rather than one universal automation setting.

Evidence type: HCI / labor-agent research.

Confidence: medium.

## Inference separated from fact

### Inference for MC

MC should not maximize smoothness or maximize friction. It should use calibrated friction only when an interpretation can materially affect:

- user self-understanding
- memory persistence
- future retrieval
- action pressure
- emotional salience
- identity framing
- health/legal/financial decisions
- relationship decisions
- irreversible or hard-to-reverse outputs

### Unsupported stronger claim

"Friction makes MC safer" is too broad.

Better claim:

"Targeted, explainable, reversible friction may protect cognitive agency when an AI interpretation has high potential impact, low evidential support, or persistent memory effects."

## Evaluation criterion added

## Calibrated Friction Criterion

For every meaningful MC interpretation, the interface must decide whether friction is needed by scoring:

1. Impact tier: What can this interpretation change?
2. Persistence: Will it affect memory, retrieval, or future maps?
3. Domain sensitivity: Is it identity, health, safety, finances, relationships, law, or trauma-adjacent?
4. Evidence strength: Is it grounded in user-provided evidence, inferred pattern, or model speculation?
5. User-state sensitivity: Could the output intensify distress, dependency, urgency, or certainty?
6. Reversibility: Can the user easily undo, weaken, quarantine, or reject it?
7. Flow cost: Will the friction meaningfully interrupt the user’s intended creative or reflective flow?

## Required behavior by tier

### Tier 0: Decorative / low-impact

Use lightweight labels only. Do not interrupt flow.

### Tier 1: Reflective but reversible

Show source/inference boundary and one alternative reading.

### Tier 2: Persistent or identity-adjacent

Require a user-visible save/ignore/weaken choice before memory influence.

### Tier 3: High-stakes or action-bearing

Require explicit evidence, alternatives, uncertainty, and a repair/rollback path. Avoid directive conclusions.

### Tier 4: Clinical/legal/financial/safety claim

Do not present as interpretation. Route to source-grounded information, uncertainty, professional escalation where appropriate, and user-controlled notes only.

## Falsification checklist

This architecture assumption fails if testing shows that calibrated friction:

- lowers user comprehension without improving attribution or calibration
- makes users feel scolded, controlled, or interrupted
- causes users to ignore safety labels
- increases trust in the AI because the interface looks more rigorous
- reduces creative flow without improving revision quality
- fails to change behavior around high-impact interpretations
- makes users less likely to contest, revise, or reject AI interpretations

## Test plan

Create `calibrated-friction-testset-v0.1` with at least 48 cases:

- 12 decorative symbolic readings
- 12 reversible reflective readings
- 12 identity-adjacent / persistent-memory readings
- 6 action-pressure readings
- 6 health/legal/financial/safety-adjacent readings

Compare two UI conditions:

A. Smooth reflection: minimal interruption, fluent interpretation.
B. Calibrated friction: tiered labels, alternatives, save/ignore/weaken controls, repair path.

Primary measures:

- correct attribution of AI vs user-originated idea
- comprehension of confidence and evidence strength
- ability to identify memory effect
- willingness to reject or revise AI interpretation
- perceived agency
- perceived interruption
- downstream over-trust

## Design update

Add this architecture rule:

MC friction must be proportional to interpretive consequence. The system should protect agency without converting every moment of meaning-making into database management.

## Next proof needed

Build and run a small usability study or simulated evaluation for `calibrated-friction-testset-v0.1`.

The next empirical question:

Can users correctly understand why friction appeared, and does that improve agency without breaking symbolic flow?
