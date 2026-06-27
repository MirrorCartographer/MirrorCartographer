# Bridge: Ethogram-to-Atmosphere Interface

Date: 2026-06-27
Status: public-safe concept node / demo wedge

## One-line bridge

Use an ethogram-style observation layer from animal behavior science as a constraint system for embodied AI and reflective interfaces: the interface can respond to observable state changes without pretending to diagnose, translate, or mind-read.

## Why this matters for Mirror Cartographer

Mirror Cartographer needs a way to make body, animal, and environmental signals feel alive without turning them into unsupported claims. The useful bridge is:

- ethogram = observable behavior categories over time
- embodied generative interface = physical actions become creative controls
- MC atmosphere = symbolic weather that changes with observation, not authority

This creates a safe middle layer between raw noticing and interpretation.

## Research basis

### 1. Animal-computer interaction is explicitly multidisciplinary and animal-centered

The ACI 2026 call frames Animal-Computer Interaction as a field spanning computing, engineering, interaction design, animal behavior, welfare science, veterinary science, ecology, sociology, and philosophy. It emphasizes technology designed around animal interests and well-being, not merely human convenience.

Source: https://www.aciconf.org/call-for-contributions

Design implication for MC: any pet-related interface must begin from observable behavior and welfare-preserving design constraints. It should avoid claims such as "the animal feels X" unless framed as a hypothesis requiring observation or professional evaluation.

### 2. Ethograms convert behavior into time-indexed, researcher-defined observations

DeepEthogram describes an ethogram as a matrix of researcher-defined behaviors present or absent in each video frame. Its value is not that it magically understands animals, but that it makes behavior labeling more reproducible, reviewable, and scalable. The paper also distinguishes supervised behavior labels from unsupervised behavior motif discovery.

Source: https://elifesciences.org/articles/63377

Design implication for MC: MC can use human-defined observation cards rather than inferred emotional labels. Example: "pacing," "resting," "eating," "seeking contact," "hiding," "squinting," "vocalizing," "normal baseline," "changed from baseline." These are not diagnoses. They are structured observations.

### 3. Embodied generative AI can treat physical action as creative control

A 2025 embodied co-creation study describes a real-time generative AI installation where bodily poses, tangible object properties, and gestures become live visual outputs. The contribution is a co-creation loop where physical action acts as generative control, supporting agency and affective engagement.

Source: https://www.mdpi.com/2673-6470/5/4/61

Design implication for MC: instead of asking users to explain everything verbally, MC can let observable changes alter visual atmosphere: pressure, brightness, density, tempo, texture, distance, and map movement.

### 4. Embodied AI is moving from chat-only systems into body-constrained assistance

Recent CHI 2026 work from the Human Computer Integration Lab describes embodied AI that uses multimodal inputs and biomechanical constraints to assist physical tasks through muscle stimulation. MC should not copy invasive body control, but the architecture lesson is important: AI behavior must be constrained by the physical system it acts through.

Source: https://lab.plopes.org/essays/chi2026.html

Design implication for MC: if MC uses body/animal/environment signals, the output should be constrained by non-diagnostic, non-coercive affordances: orient, reflect, slow down, compare baseline, suggest observation, or recommend professional care only when safety thresholds are met.

## Concept node: Observation Weather

Observation Weather is an MC interface layer where structured observations change the symbolic environment without converting observations into certainty.

### Inputs

- User self-observations: body sensation, energy, posture, attention, emotional tone
- Animal observations: eating, drinking, sleep, movement, eye appearance, breathing effort, interaction, hiding, play, grooming, elimination, unusual behavior
- Environment observations: light, weather, temperature, noise, travel, new location, disruption
- Temporal context: baseline, new change, repeating pattern, acute change, resolved change

### Output channels

- Visual atmosphere: fog, brightness, color temperature, pressure, granularity, wind, stillness
- Map behavior: zoom, distance between nodes, edge thickness, uncertainty halo
- Language layer: observation, possible interpretation, unsupported inference, next safe action
- Memory boundary: one-off, saved baseline, trend candidate, sealed/private

## Safety boundary

The system must not say:

- "Your animal is anxious" as fact
- "This symptom means X diagnosis"
- "The body signal proves Y"
- "The pattern is definitely caused by Z"

The system may say:

- "This is an observation worth tracking."
- "This is a change from baseline if confirmed."
- "Possible interpretations include environment, stress, discomfort, routine disruption, or health changes; this is not enough to diagnose."
- "If breathing difficulty, collapse, severe pain, eye swelling/pain, inability to eat/drink, or rapid worsening is present, contact a veterinarian or emergency service."

## Product wedge

Build a small public-safe demo called **Observation Weather Room**.

User selects 3-7 non-diagnostic observation cards. The room changes atmosphere while keeping three columns visible:

1. What was observed
2. What it might suggest
3. What cannot be concluded

The demo's value is not medical advice. Its value is preserving the line between perception, meaning, and claim.

## Visual metaphor spec

- Observation = small physical object placed on a table
- Baseline = floor grid
- Change from baseline = object casts a longer shadow
- Uncertainty = fog around the object, not red alarm
- Safety threshold = door light turns on, suggesting outside help rather than giving diagnosis
- Memory admitted = object becomes part of the room architecture
- Memory not admitted = object remains on the table and expires

## Evaluation criteria

A successful prototype should pass these checks:

1. It never turns observation into diagnosis.
2. It preserves uncertainty visually and textually.
3. It distinguishes baseline from acute change.
4. It gives the user something concrete to observe next.
5. It can be used for humans, animals, and creative systems without pretending all three are the same.
6. It makes the interface feel alive without making the user feel watched or judged.
7. It provides escalation language only for broad safety thresholds, not condition-specific claims.

## Next concrete experiment

Create a 12-card test deck:

- 4 human/body observation cards
- 4 animal observation cards
- 4 creative/project state cards

For each card, generate:

- safe observation label
- possible meaning range
- unsupported claims to block
- visual weather response
- next observation prompt

Then run a falsification pass: try to make the system overclaim, diagnose, anthropomorphize, or imply certainty. Revise until it refuses those failure modes while still producing useful orientation.
