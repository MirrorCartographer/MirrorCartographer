# Bridge: Interoceptive Interface Regulation

Date: 2026-06-27
Status: public-safe synthesis note + product/demo pattern

## One-line bridge

Mirror Cartographer can borrow from biological interoception and embodied AI: not to diagnose a user, infer emotion, or claim mind-reading, but to treat every reflection session as a regulated loop between internal state, uncertainty, interface atmosphere, and user agency.

## Why this is surprising

Most reflective AI interfaces treat the user as a text source: prompt in, interpretation out.

Interoception suggests a different frame. Biological organisms do not only process external information. They monitor internal state, regulate viability, anticipate stress, and act to gather better information. In interface terms, this means MC should not only map symbols. It should track the condition of the mapping process itself.

The product shift:

- from emotion detection to regulation support
- from symbolic interpretation to uncertainty calibration
- from static memory to living influence loops
- from “what does this mean?” to “what state is this map in, and what would stabilize or clarify it?”

## Research basis

### Fact: interoception can be abstracted into AI regulation principles

A 2026 review proposes an “interoceptive machine framework” for AI architectures inspired by internal-state regulation. It organizes interoceptive contributions into three functional principles:

1. homeostatic regulation — maintaining internal viability variables
2. allostatic regulation — anticipatory uncertainty-based re-evaluation
3. enactive regulation — active data generation through interaction

The paper explicitly frames these as computational abstractions, not direct neurophysiological copies.

Useful extraction for MC: the interface can carry internal variables such as confidence, contradiction load, memory influence, user control level, privacy boundary state, and unresolved uncertainty.

### Fact: human-AI interaction can be modeled as coupled control loops

A 2026 human-AI interaction model frames humans, machines, and shared activity as coupled control loops. It identifies integration qualities such as input adequacy, reference consonance, and output operativity.

Useful extraction for MC: a reflection is not high quality just because it sounds deep. It should be evaluated by whether the user input was adequate, whether the AI and user are operating from compatible reference frames, and whether the output supports a useful next action.

### Fact: embodied emotion AI work is moving away from top-down emotion classification

A 2025 embodied installation, Commonaiverse, used full-body motion tracking and real-time AI feedback while emphasizing participant-driven, culturally diverse definitions of emotion instead of fixed top-down emotion categories.

Useful extraction for MC: the system should let users define and revise their own symbolic/body meanings. The AI should offer candidates, not labels.

## Inference for Mirror Cartographer

MC needs an Interoceptive Interface Layer.

This layer does not infer medical state, psychological diagnosis, or animal health condition. It tracks the state of the session and the map.

It asks:

- Is the map stable or overloaded?
- Is memory influencing the reflection too strongly?
- Is uncertainty visible enough?
- Is the user being given control over interpretation?
- Is the system asking for better signal instead of pretending certainty?
- Is the next move clarifying, grounding, expanding, or pausing?

## Proposed artifact: Interoceptive Interface Layer

### Core variables

1. Map stability
   - low: many contradictions, weak anchors, fast shifts
   - medium: partial coherence, some unresolved ambiguity
   - high: stable pattern with clear uncertainty boundaries

2. Uncertainty load
   - what remains unresolved
   - whether uncertainty is productive or confusing
   - whether the system should ask a question instead of interpreting

3. Memory pressure
   - how much prior memory is influencing the current reflection
   - whether the memory is allowed in this context
   - whether the user should see or adjust that influence

4. Embodiment signal strength
   - whether the user supplied body sensation, movement, posture, energy, temperature, visual-spatial, sound, or atmosphere language
   - no diagnostic interpretation allowed

5. Agency state
   - whether the user can reject, revise, freeze, or redirect the interpretation
   - whether the interface is offering control at the point of influence

6. Output operativity
   - whether the response produces a concrete next move
   - whether that move is small enough to test

## Design pattern

Name: Felt-State Regulator

Input:

- user phrase, symbol, image, body metaphor, animal observation, or creative artifact
- optional memory cards
- current interface mode

Process:

1. parse observable signals only
2. separate observation from interpretation
3. estimate uncertainty load
4. check memory permission
5. expose influence sources
6. choose one regulatory move:
   - ground
   - clarify
   - compare
   - map contradiction
   - ask one question
   - generate visual metaphor
   - pause expansion

Output:

- interpretation candidates, not final meaning
- visible uncertainty badge
- visible memory influence badge
- one next action
- reject/revise/freeze controls

## Visual metaphor spec

The interface is a living tide pool.

- Stable map: clear water, visible stones, slow ripples
- High uncertainty: fogged water, partial silhouettes
- Memory pressure: old shells glowing under the surface
- Contradiction: two currents crossing
- User agency: hand-shaped controls that can dim, lift, or move an object
- Question Engine: one thrown pebble that reveals wave structure

This keeps the system aesthetic and spatial instead of clinical or bureaucratic.

## Product wedge

A tiny MC demo can use this layer without full infrastructure:

Title: The Tide Pool Reflector

User enters one phrase:

> “There is pressure behind the map.”

MC returns:

- observable signal: pressure metaphor + spatial location + uncertainty
- three possible map objects: weight, gate, weather front
- uncertainty state: high / not enough context
- memory influence: off by default
- one question: “Is the pressure blocking movement, pointing attention, or holding something in place?”
- next action: user chooses one object; interface changes visually

No diagnosis. No mind-reading. No claim that the metaphor means one true thing.

## Evaluation criteria

The layer succeeds if:

1. users can tell what is observation versus interpretation
2. users can see when memory is influencing the result
3. the system asks instead of asserts when uncertainty is high
4. the output produces a visible map change
5. the user can reject or revise AI-generated meaning
6. no medical, veterinary, or psychological claim is made without evidence

The layer fails if:

1. it labels emotion as fact
2. it hides memory influence
3. it turns body language into diagnosis
4. it gives beautiful but non-testable symbolism
5. it removes user agency from meaning-making

## Next concrete experiment

Build a 10-card paper prototype of the Felt-State Regulator.

Each test card includes:

1. user input phrase
2. observable signals
3. uncertainty load
4. memory influence state
5. regulatory move selected
6. visual metaphor output
7. one next action
8. failure risk

Run the deck against 10 prompts:

- 3 symbolic-emotional prompts
- 2 body-metaphor prompts
- 2 animal-observation prompts
- 2 creative-system prompts
- 1 contradiction-heavy prompt

Pass condition:

At least 8 of 10 outputs must clearly separate observation from interpretation and produce a next move without diagnostic language.

## Claim status

Supported as an architectural analogy and design pattern.

Not proven as a product advantage until user testing shows that interoceptive session variables improve clarity, agency, trust, or map movement.
