# Thought to Action Interface

This document translates the uploaded source images into a coding and product model for Mirror Cartographer.

## Source pattern 1: Autobiography in five chapters

The poem shows a debugging loop.

1. The person falls into the hole and is helpless.
2. The person repeats the same path and denies the hole.
3. The person sees the hole but still falls in from habit.
4. The person walks around the hole.
5. The person chooses another street.

## Coding translation

This is what learning to code requires:

- notice the repeated failure
- stop calling it random
- identify the condition that triggers it
- create a different path
- make the new path easier to repeat than the old one

In software terms:

- Chapter I: bug exists, user is lost
- Chapter II: bug repeats, user lacks a model
- Chapter III: bug is recognized, but not prevented
- Chapter IV: guardrail prevents the bug
- Chapter V: architecture changes so the bug path is no longer default

## Mirror Cartographer translation

Mirror Cartographer should not only reflect the hole. It should help build the alternate street.

That means the product must move from:

reflection -> insight

to:

reflection -> correction -> new route -> saved trace

## Source pattern 2: cyborg limbs controlled by thought

The prosthetic article describes an interface problem: thought alone is not enough. A thought has to become a signal, the signal has to be captured, translated, transmitted, and then corrected through feedback.

The article's important interface concepts:

- thought-controlled movement
- severed nerves used as signal pathways
- electrical signals picked up by electrodes
- signals transmitted into an artificial limb
- movement becomes more natural when the system reads patterns correctly
- the problem with older systems is that they are not intuitive
- better control depends on analyzing electrical activity patterns across severed nerves

## Coding translation

Code is the artificial limb of thought.

A thought does not become real because it feels strong. It becomes real when it passes through an interface:

thought -> input -> parser -> state -> logic -> output -> feedback -> correction

That is the coding spine.

## Mirror Cartographer product translation

Mirror Cartographer should act like a symbolic prosthetic for meaning.

The user has an internal signal:

- sensation
- metaphor
- color
- symbol
- repeated question
- emotional pressure

The system should not claim to know the truth of that signal. It should translate the signal into a usable interface:

input -> classification -> boundary -> reflection -> action -> feedback -> correction -> archive

## Why this matters for the build

The most important coding lesson is not syntax first.

The important lesson is interface discipline.

Every feature needs:

- signal: what enters the system
- translator: how the system interprets it
- output: what the user receives
- feedback: how the user says it was wrong or right
- correction: how the system changes the next pass
- archive: how the user owns the trace

## Feature requirements derived from the images

### 1. Hole detector

Detect repeated loops, certainty-seeking, and habit paths.

### 2. Alternate-street builder

When a repeated loop is detected, generate a new path:

- what to stop repeating
- what to try instead
- what proof would show it helped

### 3. Signal translator

Treat body-symbol input as signal, not truth.

### 4. Feedback electrode

Every output needs a user feedback control.

### 5. Control loop

The product should become more useful by comparing output against correction.

### 6. Exportable trace

The user must be able to keep the record of:

- what was entered
- what was reflected
- what was corrected
- what changed next

## Coding principle

Do not make a beautiful oracle.

Make an interface that turns thought into action without lying about certainty.

## Current implementation status

Implemented:

- text-based body/symbol input
- mode toggle
- source status
- claim status
- audit label
- health-adjacent flag
- feedback controls
- correction field
- exportable JSON trace
- extracted mapping engine
- CI typecheck/build workflow

Next:

- automated tests for loop detection and health flags
- downloadable JSON export
- clickable body map
- symbol table MVP
- saved session history
- reviewer scoring