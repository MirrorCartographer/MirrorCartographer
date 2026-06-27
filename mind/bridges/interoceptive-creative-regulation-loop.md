# Interoceptive Creative Regulation Loop

## Bridge

Biology does not only interpret signals after they become obvious. It uses faint internal-state signals to regulate attention, uncertainty, action, and timing.

Mirror Cartographer can borrow this pattern without making medical claims: treat symbolic, emotional, sensory, environmental, and animal-observation inputs as **regulatory signals**, not truths. The system should help decide when to pause, reinterpret, gather context, act, or avoid saving a claim too early.

## Research basis

### 1. Interoceptive machine framework

A 2026 review proposes translating interoception into AI architecture through three design abstractions:

- **Homeostatic:** monitor internal viability/state variables.
- **Allostatic:** anticipate change and re-evaluate under uncertainty.
- **Enactive:** generate better information through interaction rather than passive observation.

Public-safe interpretation for MC: user inputs can be treated as state/context signals that alter the next interface move. The claim is not that MC detects the user's body state. The claim is that MC can provide a structured place for users to label internal/external signals and decide what kind of response is safe.

Source: https://arxiv.org/abs/2604.24527

### 2. Interaction-centered intelligence

A 2026 paper argues that intelligence in co-creative AI should be evaluated through interaction trajectories, coordination patterns, adaptive regulation, and drift over time, rather than only final outputs.

Public-safe interpretation for MC: the meaningful artifact is not only the generated answer. It is the evolving loop between user signal, AI reflection, user correction, source evidence, and memory decision.

Source: https://arxiv.org/abs/2606.00807

### 3. Reflective human-AI collaboration

A 2026 paper frames reflective reasoning as an interaction-layer protocol with articulation, critique, revision, and auditable traces. It argues that reasoning can be structured and governed through the human-AI loop.

Public-safe interpretation for MC: reflection should become visible as a traceable sequence, not a hidden assistant inference.

Source: https://arxiv.org/abs/2604.14898

## What this changes for MC

Current weak pattern:

signal → interpretation → memory

Stronger pattern:

signal → state label → uncertainty label → response mode → user correction → evidence/memory gate

This makes MC less likely to over-treat a symbol, sensation, animal observation, or creative intuition as a durable conclusion.

## Design pattern

### Signal Regulation Card

Each card has seven fields:

1. **Raw signal** — what was noticed without interpretation.
2. **Context** — where/when/what changed around it.
3. **State label** — steady, strained, curious, urgent, unclear, recurring, resolved.
4. **Uncertainty label** — unknown, weak clue, repeated pattern, source-supported, tested.
5. **Response mode** — reflect, pause, compare, research, act, ask expert, discard.
6. **Memory decision** — session only, private note, reviewed memory, public-safe abstraction.
7. **Correction path** — what would make this wrong or change the label.

## Visual metaphor spec

Use a **lantern with shutters**:

- Open shutter: signal can be examined.
- Half shutter: signal is private or uncertain.
- Closed shutter: do not publish or persist.
- Colored glass: context changes interpretation.
- Wick height: intensity without claiming truth.
- Handle: user control.

The metaphor should avoid clinical language. The interface should feel like tuning light, not filling out a compliance form.

## Product wedge

Build **MC Lantern Mode**: a small reflective interface for turning messy inputs into regulated cards.

Best first use cases:

- creative idea that feels important but unclear
- repeated symbol or metaphor
- body-sensation note without diagnosis
- pet observation without veterinary overclaim
- research source that may or may not support a design move

## Demo idea

A single page with five sample cards:

1. Symbolic signal
2. Body/sensory signal
3. Animal observation signal
4. Research source signal
5. Creative/business opportunity signal

Each card must show:

- source lane
- uncertainty lane
- privacy lane
- response lane
- memory lane

## Evidence discipline

Allowed:

- use interoception as an architecture analogy
- use animal observations as context logs
- use AI as a structuring and reflection tool
- label uncertainty visibly

Blocked:

- claiming MC detects medical state
- claiming MC diagnoses animal health
- treating symbols as objective truth
- saving sensitive meaning without review
- converting a signal directly into public claim

## Evaluation criterion

A user should be able to look at a Signal Regulation Card and answer within 30 seconds:

1. What was actually observed?
2. What did MC infer?
3. How certain is it?
4. Is this private?
5. What is the safest next move?
6. What would change or falsify the interpretation?

## Next concrete experiment

Create a static prototype called **MC Lantern Mode**.

Test with five harmless examples. Success means a non-technical viewer can distinguish raw signal, interpretation, uncertainty, privacy level, and next action without needing an explanation from the builder.
