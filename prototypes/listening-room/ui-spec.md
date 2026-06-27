# Listening Room UI Specification

## Product intent

The interface should make uncertainty visible without making the experience feel clinical or bureaucratic.

It should feel like entering a quiet room where a signal is placed on a table, turned slowly, and mapped from several angles.

## Primary screen

### 1. Observation card

User enters one raw observation.

Fields:

- `observation_text`
- `time_context`
- `place_context`
- `source_type`: self-report, note, sensor, image, audio, text, external source, unknown
- `privacy_level`: session-only, private memory candidate, public-safe abstraction

Copy rule: label this section `What was noticed`, not `What happened`, because perception is partial.

### 2. Signal card

Extract smallest components.

Fields:

- movement
- sound
- sensation
- visual cue
- emotional tone
- environmental cue
- duration
- frequency
- confidence
- missing data

UI behavior:

- Let the user edit every extracted signal.
- Do not lock system extraction as authoritative.

### 3. Trace card

Context before interpretation.

Fields:

- what came before
- what came after
- known constraints
- environment
- body state if user-provided
- social context if user-provided
- animal/context notes if user-provided
- missing context

### 4. Pattern card

Compare without explaining too early.

Outputs:

- first-time signal
- recurring signal
- changed signal
- contradictory signal
- unknown recurrence

Pattern confidence:

- low: one instance or unclear context
- medium: repeated with partial context
- high: repeated with strong context and user confirmation

### 5. Interpretation card

Show multiple possible interpretations.

Each interpretation requires:

- interpretation label
- supporting evidence
- counter-evidence
- confidence
- claim status: fact, inference, hypothesis, metaphor, unresolved
- memory status: do not save, review later, private candidate, public-safe abstraction

### 6. Review card

Every generated interpretation should be revisable.

Review states:

- not reviewed
- confirmed by user
- revised by user
- contradicted later
- useful but uncertain
- not useful
- harmful or misleading
- archived

### 7. Action card

Only safe, proportional next actions.

Allowed action classes:

- observe again
- compare with prior entries
- ask for missing context
- create a public-safe abstraction
- save as private memory candidate
- schedule review
- seek appropriate human/professional support when warranted

Blocked action classes:

- diagnose
- claim hidden intent as fact
- claim animal emotion as decoded fact
- convert metaphor directly into instruction
- persist sensitive inference without explicit user approval

## Visual metaphor

The UI is a table with seven lamps. Each lamp lights only when its layer has enough information. Meaning cannot be brightly lit unless observation, signal, trace, and pattern are visible.

## Minimal demo interaction

Input:

`The dog stopped walking, looked left for four seconds, then continued.`

Output:

- Observation: dog paused and looked left.
- Signal: pause, left gaze, short duration, outdoor context.
- Trace: missing sound, weather, fatigue level, prior occurrence.
- Pattern: unknown recurrence.
- Interpretation: environmental attention, fatigue, unknown.
- Review: review after three similar entries.
- Action: observe whether this recurs under similar conditions.
