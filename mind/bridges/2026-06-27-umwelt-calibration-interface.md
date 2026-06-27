# Bridge: Umwelt Calibration Interface

Date: 2026-06-27
Artifact type: synthesis note + interface design pattern + demo idea
Public-safety level: public-safe; no medical, veterinary, diagnostic, or animal-mind-reading claims

## One-line bridge

Animal-computer interaction, bioacoustics, and active-inference HCI point to the same design principle: a good reflective system should not assume one universal reality layer. It should help each participant calibrate the world they can actually sense, affect, and verify.

For Mirror Cartographer, this becomes an **Umwelt Calibration Interface**: a way to map perception-worlds without pretending the AI has direct access to hidden inner states.

## Why this bridge is surprising

The bridge comes from crossing three fields that usually stay separate:

1. **Animal-computer interaction** asks designers to respect species-specific sensory and cognitive worlds.
2. **Bioacoustic AI** can find patterns in animal sound, but interpretation remains weak unless validated by behavior and context.
3. **Active-inference HCI** treats interface use as a loop among user, model, sensors, environment, uncertainty, and action.

Together, they suggest that MC should not be only a symbolic interpretation engine. It should be a **calibration environment** where the user can inspect what world the system thinks it is operating inside.

## Research basis

### 1. Animal-centered interfaces require species-specific design

Animal-computer interaction research frames animals as legitimate stakeholders and contributors, not passive objects. ACI aims to design technology that improves animal well-being, supports animal activities, and fosters intra- and inter-species relations. It also emphasizes animal participation in design where possible.

Source:
- International Conference on Animal-Computer Interaction, discipline aims: https://www.aciconf.org/

Useful concept extracted:

> Design should start from the participant's perceptual and action-world, not the designer's default categories.

### 2. Interface variables can change communicative agency

The Animal-Computer Interaction Lab describes work with Parrot Kindergarten and Purdue studying parrots' speech-board interactions. The explicit goal is to understand how interface design variables affect functional parrot-human communication, usability, experience, agency, well-being, and cognition.

Source:
- Animal-Computer Interaction Lab projects: https://www.animalcomputerinteractionlab.org/projects

Useful concept extracted:

> Communication is not only about translation. It is also shaped by the board, buttons, timing, affordances, feedback, and the participant's ability to choose.

### 3. Bioacoustic AI is useful, but interpretation needs validation

Recent bioacoustic AI work in veterinary and animal-health contexts describes machine learning as a way to monitor animal sounds and behavior, but the safer interpretation is observational: these tools may identify patterns and support earlier human attention. They do not automatically prove inner state, diagnosis, or meaning.

Sources:
- Frontiers in Veterinary Science, 2026: "Leveraging artificial intelligence in bioacoustics for animal health monitoring and early diagnosis in veterinary medicine": https://www.frontiersin.org/journals/veterinary-science/articles/10.3389/fvets.2026.1816544/full
- PubMed record: https://pubmed.ncbi.nlm.nih.gov/42109868/

Useful concept extracted:

> Pattern detection is not interpretation. Interpretation must be separated from observation and attached to evidence level, context, and validation route.

### 4. Active-inference HCI gives MC a systems architecture

Active-inference HCI describes interfaces as systems involving generative models of users, environments, sensors, and components. The interface is not just an output surface; it is part of an uncertainty-regulation loop.

Source:
- Murray-Smith, "Active Inference and Human-Computer Interaction," ACM, 2025: https://dl.acm.org/doi/abs/10.1145/3762812

Useful concept extracted:

> The interface should expose and regulate uncertainty instead of hiding it behind confident responses.

### 5. Human-AI co-creation requires agency/control modulation

Human-AI co-creativity research identifies agency and control as key dimensions in co-creative systems. Human-AI work is moving away from one-shot prompt-output behavior toward shared processes, externalized thought, and adjustable control.

Sources:
- Moruzzi et al., "A User-centered Framework for Human-AI Co-creativity," ACM CHI 2024: https://dl.acm.org/doi/full/10.1145/3613905.3650929
- Adobe Research summary of CHI human-AI co-creation environment work, 2025: https://research.adobe.com/news/an-experimental-new-design-approach-for-human-ai-co-creation/

Useful concept extracted:

> MC should let users modulate agency: what the AI proposes, what memory can influence, what the user controls, and what remains unresolved.

## Fact vs inference

### Facts from sources

- ACI treats animal agency, welfare, and species-appropriate design as central concerns.
- Parrot speech-board research studies how interface variables affect functional animal-human communication.
- Bioacoustic AI can classify and monitor patterns in sound/behavior, but safe interpretation requires contextual validation.
- Active-inference HCI frames interaction as an uncertainty-regulating loop among user, environment, sensors, model, and interface.
- Human-AI co-creative systems benefit from explicit agency/control modulation.

### Inferences for Mirror Cartographer

- MC should treat each user session as an individual perceptual world, not as a generic psychological case.
- MC should distinguish **user-observed signal**, **AI-proposed pattern**, **memory-influenced pattern**, and **validated user-confirmed meaning**.
- MC should make its assumed perceptual frame visible: body, symbol, context, memory, emotion-language, contradiction, environment, task.
- MC should not behave like a decoder. It should behave like a calibration instrument.

## Design pattern: Umwelt Calibration Interface

### Definition

An Umwelt Calibration Interface is a reflective interface that shows the current perceptual world being used to interpret input.

It asks:

- What sensory channel is active?
- What context is known?
- What can be observed directly?
- What is the AI inferring?
- What memory is allowed to influence this?
- What meaning has the user actually confirmed?
- What remains unknowable or unresolved?

### Core rule

MC should not say:

> "This symbol means abandonment" or "This body signal means fear."

MC should say through the interface:

> "Current map frame: body-location + support metaphor + uncertain context. Possible pattern: load/right-side/axis. Evidence level: low. User confirmation needed before this can influence memory."

## Schema: Perception-World Frame

Each MC session should maintain a visible frame object:

```yaml
perception_world_frame:
  session_mode: one_off | persistent | no_save | facilitated
  active_channels:
    - language
    - symbol
    - body_location
    - color
    - image
    - environment
    - memory
  observable_signals:
    - user_supplied_phrase
    - selected_body_zone
    - chosen_symbol
    - chosen_privacy_mode
  ai_inferences:
    - inference_text
    - evidence_level: low | medium | high
    - source_channels
    - user_confirmed: false
  memory_influence:
    allowed: true | false
    sources_visible: true
    context_gate_passed: true | false
    retention_rule: no_save | session_only | persistent_reviewable
  unresolved:
    - unknown_context
    - unverified_meaning
    - possible_alternative_interpretations
  next_move:
    type: observe | ask_question | map_relation | reduce_memory | stop
    reason: short_explanation
```

## Product wedge

### Feature name

**The Calibration Veil**

### Feature promise

Before MC interprets, it shows the veil it is looking through.

The user can adjust:

- body vs symbol emphasis
- memory on/off
- literal vs metaphorical reading
- private/no-save mode
- uncertainty display intensity
- whether the AI should ask a question or map the current frame

### Minimum demo

Input phrase:

> "There is pressure near the right side of the map."

The interface renders four layers:

1. **Observed layer**: the exact phrase and any selected location/symbol.
2. **Frame layer**: which channels are currently active.
3. **Inference layer**: 2-3 possible readings with low/medium/high evidence labels.
4. **Control layer**: user can confirm, reject, dim, freeze, or mark no-save.

### What makes it different

Most reflective AI tools answer the user.

The Calibration Veil shows the user **what kind of world the AI is answering from**.

## Requirements update

Add these requirements to MC architecture:

1. Every interpretation must declare its active channels.
2. Every interpretation must separate observation from inference.
3. Every inference must carry an evidence level and a validation route.
4. Memory may not influence interpretation unless the current context gate is visible and passed.
5. The user must be able to switch the perceptual frame without starting over.
6. The interface must allow unresolved ambiguity without forcing closure.
7. Embodied or animal-related signals must never be translated into medical, veterinary, emotional, or diagnostic claims without qualified evidence.

## Evaluation checklist

A prototype passes if:

- The user can name what the system actually observed.
- The user can name what the system inferred.
- The user can see whether memory influenced the response.
- The user can reject an inference and watch the frame update.
- The system avoids diagnostic, mind-reading, and animal-translation claims.
- The system produces a useful next move without pretending certainty.

It fails if:

- It gives symbolic meanings as facts.
- It hides its assumptions.
- It uses memory invisibly.
- It collapses body sensation into diagnosis.
- It treats animal behavior or sound as directly translated emotion.
- It creates aesthetic atmosphere without agency or verification.

## Visual metaphor spec

The interface should feel like looking through adjustable translucent membranes.

Visual elements:

- **Veils**: stacked transparent layers for body, symbol, memory, context, environment.
- **Focus ring**: shows which layer is currently driving interpretation.
- **Fog density**: uncertainty level.
- **Small anchors**: directly observed facts.
- **Floating lights**: AI proposals.
- **Locked gates**: memory not allowed in this context.
- **Footprints**: prior influence already used in the session.
- **Dissolving threads**: rejected interpretations.

## Next concrete experiment

Build a no-backend prototype of **The Calibration Veil** with one phrase input and five toggles:

1. Literal / symbolic emphasis
2. Memory allowed / memory blocked
3. Body channel on / off
4. Ask one question / map current frame
5. Save observation / no-save

Success metric:

After three minutes, a user should be able to answer four questions:

1. What did MC observe?
2. What did MC infer?
3. What was uncertain?
4. What was allowed to persist?

## Next research question

How can MC turn this calibrated frame into a visual map movement score without flattening symbolic or embodied material into fake precision?
