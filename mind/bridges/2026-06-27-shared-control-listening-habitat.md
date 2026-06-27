# Bridge: Shared-Control Listening Habitat

Date: 2026-06-27
Artifact type: synthesis note + demo idea
Public-safety level: public-safe; no medical, veterinary, diagnostic, or animal-mind-reading claims

## One-line bridge

Animal-computer interaction research suggests a surprising design pattern for Mirror Cartographer: the most interesting interface may not be one where the system interprets the user, but one where human, AI, body-state, memory, and environment share control of a responsive field.

## Why this matters

Mirror Cartographer currently tends to be described as a reflective mapping system: the user gives symbolic, emotional, sensory, or narrative input; the AI responds with structure. That can accidentally recreate a dashboard pattern where the system appears to judge or decode the user.

Shared-control animal interfaces point toward a different architecture:

> Do not claim to know the creature. Build an environment where the creature can influence what happens, where the system records observable interactions, and where interpretation stays provisional.

For MC, the equivalent is:

> Do not claim to know the person. Build a symbolic habitat where the person, AI, embodied signals, memory permissions, and interface atmosphere all influence the next state.

## Research basis

### 1. Animal agency and control are legitimate interface goals

Animal-computer interaction literature increasingly frames technology not merely as monitoring or enrichment, but as a way to support agency: animals can be given meaningful choice or control over aspects of their environment. This does not require claiming to know an animal's inner state; it focuses on observable options, actions, preferences, and welfare-sensitive constraints.

Useful concept extracted: agency can be designed as choice-space, not interpretation certainty.

### 2. CreatureConnect-style shared-control systems are a strong metaphor

Recent reporting on University of Glasgow work describes CreatureConnect, a system where zoo visitors and red-ruffed lemurs could both influence sounds, visuals, and scents through linked interfaces. The notable result was not direct human-animal communication. The point was mediated co-presence: both sides could affect the same environment, and the animals reportedly engaged more in shared-control conditions than in sole-control conditions.

Useful concept extracted: connection can be mediated through a shared field rather than through exact translation.

### 3. Bioacoustic AI shows both promise and danger

Recent interspecies communication work, including zebra finch vocalization research recognized by the Coller-Dolittle Prize, shows that machine learning plus behavioral validation can reveal structure in animal communication. The strongest version of this work does not stop at pattern recognition; it tests whether the animal's own behavior supports the proposed interpretation.

Useful concept extracted: MC should require behavioral or user-confirmed validation before treating an interpretation as meaningful.

### 4. AI/XR co-design research supports boundary control

Current DIS 2026 material on co-designing XR applications with AI agents emphasizes designer control over the boundary between what is specified and what agents generate at runtime, plus a design knowledge base that evolves through repeated sessions.

Useful concept extracted: MC needs adjustable delegation boundaries: what the user controls, what the AI can generate, what memory can influence, and what remains uncertain.

## Fact vs inference

### Facts from research

- Animal-computer interaction research treats agency, choice, and environmental control as serious design concerns.
- CreatureConnect-style systems use linked human/animal interfaces to let different species affect a shared sensory environment.
- Bioacoustic AI can classify animal sounds, but rigorous interpretation requires behavioral validation, not only model confidence.
- AI-agent co-design research is exploring adjustable boundaries between human specification and runtime AI generation.

### Inferences for MC

- MC should avoid positioning symbolic reflection as a decoder of hidden truth.
- MC can be stronger if it behaves like a shared-control habitat: the user and system co-shape an atmosphere, map, or symbolic field.
- Memory should not silently personalize the field; memory should act only inside explicit permission boundaries.
- A reflection is stronger when the user can accept, reject, revise, or ignore it through direct interaction rather than only reading text.

## Design pattern: Shared-Control Listening Habitat

### Definition

A Shared-Control Listening Habitat is an interface state where multiple agents or signal sources can influence the environment while no single source is treated as the final authority.

In MC, the influencing sources are:

1. User input: words, symbols, colors, images, body-sensation language, contradiction, mood, chosen privacy mode.
2. AI synthesis: provisional structure, metaphor, map, question, pattern proposal.
3. Memory ledger: only memories allowed in the current context.
4. Embodied markers: user-reported body location, intensity, posture, breath, fatigue, heat/cold, movement context.
5. Interface atmosphere: visual density, pace, color field, spatial arrangement, sound or silence.
6. User correction: accept, reject, revise, freeze, or mark as private/no-save.

### Core rule

MC should not say: "This means X."

MC should say through the interface: "X is one possible pattern. Touch it, move it, dim it, reject it, or let it change the room."

## Product wedge

### Feature name

The Listening Room

### Feature promise

A user enters a session and gives one symbolic or embodied fragment. MC turns it into a responsive room of provisional signals. The room changes only through shared control: user choice, AI proposal, allowed memory, and explicit correction.

### What makes it different

Most AI reflection tools generate paragraphs. The Listening Room generates a manipulable field.

### Minimum demo

Input: "back slight right of spine" or any public-safe embodied phrase.

Output:

- A neutral body-zone card, not a diagnosis.
- A symbolic location marker: right-of-axis / support structure / hidden load.
- A memory-permission gate: "Use prior pattern? yes/no/private only."
- A visual field with 3 provisional nodes:
  - Body signal
  - Context signal
  - Symbol signal
- User controls:
  - amplify
  - dim
  - split
  - merge
  - reject
  - no-save

### Safety boundary

The system must not infer disease, trauma, intent, animal emotion, or hidden truth from symbolic or sensory input. It may map observations and propose questions, but claims remain provisional unless explicitly verified by the user or backed by a qualified external source.

## Requirements update

Add these requirements to MC architecture:

1. Every generated reflection must expose its influence sources.
2. Memory influence must be visible and revocable.
3. User correction must change future behavior, not merely append a note.
4. Embodied inputs must be represented as observations, not diagnoses.
5. Symbolic interpretations must be movable/rejectable objects, not final statements.
6. The interface should support shared control over atmosphere, not just text output.
7. A session can end with unresolved ambiguity; closure must not be forced.

## Evaluation checklist

A Listening Room prototype passes if:

- A user can identify what influenced each AI response.
- A user can remove a memory from influencing the session.
- A user can reject an interpretation and see the map adapt.
- The system avoids diagnostic or mind-reading language.
- The session produces at least one usable next observation or action.
- The visual state changes meaningfully based on user interaction, not just AI text.

It fails if:

- It sounds like therapy without being therapy.
- It claims to know what a body signal or animal behavior means.
- It hides memory influence.
- It treats symbols as fixed meanings.
- It creates a beautiful but non-interactive poster instead of a usable field.

## Visual metaphor spec

The interface should feel like a small living enclosure, not a dashboard.

Visual elements:

- Central field: dim responsive space.
- Nodes: floating organisms, not boxes.
- Memory: faint constellations at the edge, only entering when permitted.
- User correction: visible hand-like force that moves the field.
- AI proposal: temporary light, not permanent architecture.
- Privacy boundary: glass wall / veil / membrane.
- Rejected interpretation: dissolves into sediment, available for audit but no longer active.

## Next concrete experiment

Build a no-backend prototype of The Listening Room with one public-safe input phrase and five controls:

1. Use memory / do not use memory
2. Amplify node
3. Dim node
4. Reject interpretation
5. Save as observation / no-save

Success metric: after 3 minutes, the user should be able to explain what changed in the field, what the AI inferred, what was only observed, and what is allowed to persist.

## Next research question

How should shared-control interfaces represent uncertainty visually so the user feels agency without mistaking the system's provisional map for truth?
