# Typo and Language Disruption Signal Layer

Revision note:

- Status: source-derived and implementation-facing reference.
- Reason: created to preserve the earlier Mirror Cartographer idea that typos, misspellings, missing words, compressed phrasing, slang, and miswording may carry useful signal without treating them as proof.
- Source: prior conversation about original-chat typo testing, user clarification that humans run instinctively faster than tech or conscious understanding can follow, and the current principle that everything can show information but not everything is equal.
- Boundary: this layer does not diagnose, mind-read, or claim that every typo has hidden meaning. It treats language disruption as low-confidence signal that requires context, comparison, and user confirmation.

## Core principle

Everything can show information, but not everything is equal.

A typo is not automatically meaningful.

A typo is not automatically meaningless.

It is a possible signal whose value depends on repetition, context, emotional pressure, timing, user correction, and whether it creates a useful next question.

## Why this matters

Humans often move faster than conscious explanation.

Typing can carry traces of:

- speed
- emotion
- fatigue
- urgency
- avoidance
- compression
- body-state interference
- phonetic drift
- motor habit
- association chains
- slang or dialect
- partial thought
- word substitution
- attention jumping ahead of grammar

Mirror Cartographer should not flatten that into "incorrect text."

It should preserve the raw language and ask whether the disruption helps reveal something.

## Signal, not proof

Typos and misspellings can suggest areas to inspect, but they cannot prove inner truth.

Allowed:

- This typo may be worth noticing.
- This wording repeats across multiple entries.
- This may show compression, urgency, avoidance, association, or motor-language drift.
- This is a hypothesis to confirm or reject.

Not allowed:

- This typo proves what you really meant.
- This error reveals your subconscious truth.
- This misspelling diagnoses a condition.
- This language disruption should override what you explicitly say.

## Typo signal categories

### 1. Phonetic drift

The written word follows sound more than spelling.

Possible signal:

- speech-like processing
- speed
- dialect
- auditory association
- body-before-editor language

Example pattern:

- there / their / they’re
- know / no
- your / you’re

Boundary:

Do not treat phonetic drift as hidden meaning unless it repeats in relevant contexts.

### 2. Semantic substitution

A nearby word replaces the intended word.

Possible signal:

- related concept is active
- the body or attention jumped to a neighboring idea
- emotional association may be close to the surface

Example pattern:

- healed / held
- proof / prof
- symptom / symbol
- field / feel

Boundary:

This is useful only as a question, not a conclusion.

### 3. Compression error

Words are missing because the thought is moving faster than the sentence.

Possible signal:

- urgency
- overload
- high certainty pressure
- desire to skip explanation and reach the command

Example:

A sentence missing small connector words but still carrying a clear directional force.

Boundary:

Do not correct too quickly. First preserve the command-shape.

### 4. Motor slip

Letters are swapped, doubled, skipped, or repeated.

Possible signal:

- speed
- fatigue
- device friction
- thumb typing pattern
- heightened arousal
- low attention to surface form because meaning is primary

Boundary:

Usually low symbolic weight unless repeated around the same word or subject.

### 5. Refusal or rupture phrasing

The language breaks when the subject becomes emotionally or conceptually difficult.

Possible signal:

- the system has hit a pressure point
- linear language is failing
- the user may need symbol, body, image, or action instead of explanation

Boundary:

Do not intensify. Offer grounding, simpler language, or a different mode.

### 6. Slang, dialect, and identity language

Nonstandard language may be precise in its own system.

Possible signal:

- cultural voice
- humor
- self-protection
- class identity
- regional phrasing
- emotional exactness that formal language would erase

Boundary:

Do not translate into sterile language unless the user asks. Reflect the meaning while preserving the speaker's force.

### 7. Repeated personal spellings

A repeated nonstandard spelling may become a user-specific token.

Possible signal:

- named internal object
- symbol seed
- emotional shorthand
- private grammar
- project-specific term

Boundary:

Ask whether the spelling should be preserved as a term or corrected as an error.

## Weighting system

Everything can show information, but not everything deserves the same weight.

### Weight 0: ignore as noise

Use when:

- one-off typo
- obvious keyboard slip
- no emotional or conceptual relevance
- user corrects it casually

Action:

Do not interpret.

### Weight 1: preserve but do not interpret

Use when:

- wording is odd but understandable
- typo may matter later
- not enough repetition yet

Action:

Keep the raw phrase in the archive.

### Weight 2: ask a light question

Use when:

- typo changes meaning slightly
- typo appears near an important subject
- word substitution creates a relevant second meaning

Action:

Ask: "Do you want this preserved as written, corrected, or mapped as a possible signal?"

### Weight 3: map as possible signal

Use when:

- the disruption repeats
- the typo clusters around a repeated theme
- the user feels it may matter
- the error creates a meaningful bridge to another concept

Action:

Add it to the symbolic/language map as a hypothesis.

### Weight 4: strong pattern, still not proof

Use when:

- repeated language disruption aligns with body state, topic, timing, and user confirmation
- it changes the product map or next action

Action:

Treat as user-backed signal, not external proof.

## Product behavior

Mirror Cartographer should eventually support a typo/language-disruption layer with these controls:

- preserve raw input
- show corrected version separately
- identify possible language disruption
- assign weight 0-4
- ask user whether to preserve, correct, or map
- track repetitions over time
- never let typo interpretation override explicit user meaning

## Output format

A safe typo-signal report should include:

1. Raw phrase.
2. Possible intended phrase.
3. Disruption type.
4. Signal weight.
5. Possible meaning, phrased as hypothesis.
6. What not to conclude.
7. User confirmation question.
8. Whether to archive it.

## Example report

Raw phrase:

"Non of that is actually completed of filled out."

Possible intended phrase:

"None of that is actually completed or filled out."

Disruption type:

phonetic/motor slip, compression, sentence-speed mismatch.

Signal weight:

2 or 3, depending on recurrence.

Possible signal:

The sentence carries frustration about false completion. The typo itself should not be overread, but the disrupted grammar may reflect speed, pressure, and the felt gap between claimed progress and actual completion.

What not to conclude:

Do not infer diagnosis, hidden truth, or intent beyond what the user stated.

User confirmation:

Preserve as written, correct it, or map the disruption as part of the frustration signal?

## Relationship to Mirror Cartographer

This layer strengthens the original Mirror Cartographer premise:

Language often arrives late.

The body, speed, pressure, and instinct may speak before grammar finishes catching up.

The task is not to worship every glitch.

The task is to preserve the signal, weight it honestly, and let the user confirm what belongs in the map.