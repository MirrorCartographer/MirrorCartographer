# Multispecies Shared-Control Interface

## Bridge

Animal-computer interaction research suggests a surprising interface principle for Mirror Cartographer: a system can be designed as a shared environment where different agents do not need the same language, goals, or control surface to participate meaningfully.

The bridge is:

animal enrichment technology
→ shared-control interfaces
→ embodied cognition
→ reflective AI systems
→ MC as a negotiated meaning field

Instead of asking MC to translate every signal into a final explanation, MC can let human, AI, body-state, animal-care observation, and source evidence each influence a shared field while preserving boundaries between them.

## Why this matters for MC

MC has a recurring architecture problem: how to support meaning-making without pretending the system knows more than it does.

Shared-control design offers a cleaner answer:

- no single agent owns the whole interpretation
- each signal has a channel
- interaction is visible
- preference is observed through repeated engagement, not declared as truth
- ambiguity is preserved long enough to become useful

## Research basis

### 1. CreatureConnect and shared animal-human interaction

A University of Glasgow / Blair Drummond Safari Park study used linked interactive devices so red-ruffed lemurs and zoo visitors could affect shared sensory outputs such as sound, light, and scent.

Reported result: lemurs engaged more in shared-control conditions than in lemur-only control conditions. This should not be read as direct language or proof of complex intention. The useful design lesson is narrower: a shared interface can create measurable engagement across species without requiring identical symbolic systems.

### 2. Animal-computer interaction and autonomous systems

Animal-computer interaction research warns that autonomous systems increasingly enter spaces shared with animals, but design often treats non-human perception as an afterthought. A 2025 review of animal interaction with autonomous mobility systems highlights physical impact, behavioral effects, accessibility, ethics/regulation, and urban disturbance as design concerns.

MC implication: any agentic or embodied interface needs a non-human / non-verbal signal lane. A system should not only ask, `What did the user say?` It should also ask, `What changed in posture, behavior, environment, friction, avoidance, or repeated engagement?`

### 3. Non-invasive animal monitoring

AI and IoT animal-monitoring systems are moving toward minimally intrusive observation: camera traps, night-vision behavior monitoring, RFID feeding stations, pose/posture analysis, and activity pattern detection.

MC implication: the safest lesson is not diagnosis. It is observation discipline. First record pattern, context, and uncertainty. Only later escalate to interpretation or professional evaluation.

## Fact vs inference

| Layer | Status | Statement |
|---|---|---|
| Shared-control animal interface studies exist | Fact | CreatureConnect-style systems have been tested in zoo settings. |
| Lemurs engaged more with shared control in the reported trial | Reported finding | This is from public reporting of the study; it needs the final paper for stronger citation. |
| Shared-control proves animals want human collaboration | Too strong | Avoid this claim. Engagement is not the same as human-like intention. |
| Shared-control is useful for MC design | Inference | MC can borrow the interface pattern without making animal cognition claims. |
| Animal monitoring can support care | Qualified fact | Monitoring can reveal patterns and support caretakers, but it does not diagnose by itself. |

## MC design pattern: Shared Field Control

A reflective interface should allow multiple signal types to affect the same map without collapsing them into one voice.

### Inputs

1. User language
2. Body or sensory report
3. Repeated behavior / engagement pattern
4. Environment context
5. Animal-care observation
6. External source evidence
7. AI interpretation

### Output card

Each MC card should show:

- signal source
- observed pattern
- possible meaning
- uncertainty level
- privacy level
- next safe action
- whether the signal is human-stated, observed, inferred, or sourced

## Visual metaphor spec

Name: **The Shared Enclosure**

Scene:

A circular enclosure divided into soft zones. A human hand, an animal pawprint, a weather mark, a body-sensation glyph, a source citation, and an AI lantern each pull on separate threads connected to one central object. The central object changes shape only when multiple threads repeat or converge.

Meaning:

MC does not force translation. It watches how signals co-modulate.

Interface version:

- center: current question or concern
- left rail: human words
- right rail: observed patterns
- lower rail: body/environment
- upper rail: evidence/source
- lantern overlay: AI hypothesis
- gate: save, discard, watch, ask professional, public-safe abstraction

## Product wedge

**Shared Signal Ledger**

A lightweight MC feature for people managing complex, non-verbal, embodied, or animal-care observations.

Use cases:

- tracking pet behavior without making veterinary claims
- tracking body/sensory patterns without self-diagnosing
- organizing creative symbols without forcing literal meaning
- converting research sources into grounded design moves
- showing where AI interpretation begins and ends

## Demo idea

Build a static `Shared Signal Ledger` demo with three sample cards:

1. Pet observation card
   - source: owner observation
   - pattern: repeated behavior change
   - claim status: observation only
   - next move: document pattern and ask vet if persistent/worsening

2. Body signal card
   - source: user report
   - pattern: sensation + context
   - claim status: subjective report
   - next move: track trigger and duration; no diagnosis

3. Creative symbol card
   - source: image/music/TikTok/reference
   - pattern: repeated attraction to a motif
   - claim status: symbolic inference
   - next move: turn into design node

## Requirements update

MC should add a `signal_source_type` field:

- user_statement
- body_report
- animal_observation
- environmental_context
- behavioral_pattern
- source_fact
- ai_inference
- professional_input

MC should add a `control_mode` field:

- user_controlled
- ai_suggested
- shared_field
- source_locked
- professional_review_needed
- discard

MC should add an `interpretation_permission` field:

- observe_only
- suggest_pattern
- generate_hypothesis
- create_public_safe_abstraction
- do_not_interpret

## Next concrete experiment

Create five static cards from harmless sample data and test one question:

Can a non-technical user tell, within 30 seconds, which parts are observed, which parts are inferred, which parts are private, and what the next safe action is?

Pass condition:

- user can identify signal source
- user can identify claim status
- user can identify whether AI is interpreting or only recording
- user can identify the safe next move

Fail condition:

- user thinks MC made a medical/veterinary claim
- user cannot tell source fact from AI inference
- user cannot tell what will be saved
- user cannot tell what action happens next
