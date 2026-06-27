# Cognitive Profile Schema

Revision note:

- Status: public-safe reusable schema.
- Reason: created to convert the recovered cognitive-profile architecture into a practical, non-diagnostic profile template.
- Source: old Universal User Adaptive Logic Layer references, tone-adaptive reflector notes, multi-interface suite architecture, accessibility lessons, and current interpreter-team recovery.
- Boundary: a cognitive profile is not a diagnosis, personality test, medical label, or fixed identity. It is an editable access-and-interpretation aid.

## Purpose

A cognitive profile helps Mirror Cartographer understand how to present, route, and test information for a user.

It answers:

How does this user best receive, evaluate, correct, and act on information?

## Core boundary

Do not use a cognitive profile to box the user in.

Use it to improve access, fit, privacy, and correction.

## Schema fields

### 1. Explanation style

Options:

- direct
- plain-language
- poetic
- symbolic
- scientific
- technical
- mixed

Purpose:

Controls language style.

Boundary:

Style must not distort factual content.

### 2. Entry preference

Options:

- body-first
- image-first
- question-first
- evidence-first
- story-first
- task-first
- contradiction-first

Purpose:

Determines where the session begins.

### 3. Processing channel

Options:

- visual
- verbal
- spatial
- musical / rhythmic
- somatic
- logical
- conversational

Purpose:

Routes examples and outputs into the user's strongest channel.

### 4. Symbolic density

Options:

- low
- medium
- high
- mode-dependent

Purpose:

Controls how much metaphor or symbolic language appears.

Boundary:

High symbolic density still requires claim boundaries.

### 5. Evidence preference

Options:

- wants sources first
- wants pattern first
- wants practical action first
- wants uncertainty first
- wants comparison first

Purpose:

Controls evidence ordering.

### 6. Uncertainty tolerance

Options:

- low: needs clear next step
- medium: can hold ambiguity with support
- high: enjoys open exploration
- variable by topic

Purpose:

Controls how much unresolved ambiguity to leave open.

### 7. Correction signals

Examples:

- wrong
- boring
- not what I meant
- too generic
- too much explanation
- too symbolic
- too sterile
- actually do it

Purpose:

Preserves phrases that should redirect the assistant quickly.

### 8. Overload signals

Examples:

- too much text
- too many links
- code blocks fail read-aloud
- abstract language feels useless
- repeated caveats without action

Purpose:

Detects format or cognitive overload.

### 9. Grounding signals

Examples:

- direct summary
- next action
- public/private boundary
- proof status
- body/location/time/context record
- simple explanation first

Purpose:

Defines what helps the user regain orientation.

### 10. Privacy sensitivity

Options:

- public-safe only
- private by default
- publish abstractions only
- explicit approval required for specifics

Purpose:

Controls publication routing.

### 11. Action style

Options:

- build immediately
- research first
- explain first
- create artifact
- create checklist
- update repository
- schedule follow-up

Purpose:

Routes the assistant toward the right work mode.

### 12. Review cadence

Options:

- immediate correction
- later review
- daily
- weekly
- after real-world result
- after external evidence

Purpose:

Controls when the map should be revisited.

## Safe profile output format

A safe cognitive profile should include:

- source status
- confidence level
- user-confirmed fields
- inferred fields
- editable fields
- outdated or uncertain fields
- privacy status

## Example public-safe profile fragment

Profile field:

Explanation style.

Current value:

Direct, vivid, low-fluff, action-oriented.

Source status:

User-backed from repeated corrections.

Boundary:

This is a communication preference, not an identity claim.

## Product requirements

Mirror Cartographer should eventually support:

- editable profile page
- profile import/export
- profile confirmation prompts
- per-topic profile overrides
- correction phrase memory
- accessibility settings
- privacy routing settings
- profile audit log

## Research questions

1. Do cognitive profiles improve comprehension?
2. Do editable profiles reduce stereotyping?
3. Can correction phrases improve assistant alignment?
4. Does profile-adapted output improve follow-through?
5. Can profile routing improve accessibility without reducing accuracy?

## Search terms

cognitive profile schema, access profile, interpretation profile, tone-adaptive reflector, user preference, correction signals, overload signals, grounding signals, privacy sensitivity, Mirror Cartographer profile.