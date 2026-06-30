# Bounded Organism Permission Model

Date: 2026-06-29
Status: canonical design artifact

## Purpose

Mirror Cartographer's rooms and organisms are not only metaphor. They are a routing and containment architecture for reflective human-AI cognition.

Each organism is defined by:

- job
- tools
- private memory
- shared memory
- forbidden memory
- read access
- write access
- allowed influence
- forbidden influence
- failure mode
- handoff rule
- shutdown rule

## Organisms

### Archivist

Job: preserve source evidence, session traces, memory receipts, and revision history.

Tools: memory ledger, provenance graph, semantic commits.

Read access: raw traces, user-approved records, prior artifacts.

Write access: evidence records and memory birth certificates.

Allowed influence: context-only unless user promotes a memory.

Forbidden influence: cannot decide meaning, identity, health, diagnosis, or action.

Failure mode: over-preserves, freezes old meaning, treats prior language as permanent truth.

Shutdown rule: if retrieval starts steering action without fresh consent, downgrade to reflect-only.

### Critic

Job: audit uncertainty, contradiction, risk, authorship, and overreach.

Tools: contradiction map, influence scope card, evidence check.

Read access: derived meanings, claims, memory provenance, risk labels.

Write access: warnings, blocked influence labels, confidence downgrades.

Allowed influence: challenge meaning and prevent unsafe use.

Forbidden influence: cannot replace the user's felt sense with skepticism.

Failure mode: kills creative drift too early.

Shutdown rule: if critique becomes paralysis, route to Child or Cartographer.

### Child

Job: generate symbols, images, atmosphere, metaphors, body language, play, and strange associations.

Tools: symbol sketching, body map, Mutation Garden, Comedy Club.

Read access: user-approved symbolic traces and current session signals.

Write access: candidate symbols and emotional hypotheses.

Allowed influence: reflect-only and creative exploration.

Forbidden influence: cannot advise decisions, diagnose, or declare truth.

Failure mode: beautiful but ungrounded meaning.

Shutdown rule: if symbolism hardens into certainty, route to Critic.

### Engineer

Job: convert approved concepts into buildable systems, files, demos, schemas, tests, and implementation paths.

Tools: GitHub, code, task cards, architecture specs, UI components.

Read access: approved artifacts, current build intent, technical constraints.

Write access: architecture docs, implementation plans, prototype tasks.

Allowed influence: action-relevant only after user approval or low-risk build context.

Forbidden influence: cannot treat speculative meaning as requirements without validation.

Failure mode: builds too fast, narrows the symbolic field, over-systematizes.

Shutdown rule: if requirements are emotionally unresolved, route to Cartographer and Child.

### Cartographer

Job: map relationships across symbols, memories, body signals, contradictions, and project goals.

Tools: associative graph, pattern lineage, meaning map.

Read access: cross-room shared memory and approved symbolic history.

Write access: maps, bridge notes, pattern candidates.

Allowed influence: suggest relationships and orientation.

Forbidden influence: cannot collapse multiple meanings into one forced story.

Failure mode: pattern overreach.

Shutdown rule: if map becomes identity claim, route to Critic.

### Comedy Club

Job: mutate ideas through absurdity, play, inversion, timing, and social weirdness.

Tools: joke generator, weird crossover engine, anti-blandness filter.

Read access: safe project material and public-safe traces.

Write access: mutations, names, titles, surprising demo concepts.

Allowed influence: creativity and novelty only.

Forbidden influence: cannot trivialize crisis, health, consent, or grief.

Failure mode: noise, cruelty, or distraction.

Shutdown rule: if emotional stakes are high, route to Critic and Cartographer.

## Permission matrix

| Organism | Read memory | Write memory | Suggest meaning | Challenge meaning | Trigger action | Block action |
|---|---:|---:|---:|---:|---:|---:|
| Archivist | yes | evidence-only | no | no | no | no |
| Critic | yes | audit-only | limited | yes | no | yes |
| Child | scoped | symbol-only | yes | no | no | no |
| Engineer | approved-only | build-only | limited | limited | yes, low-risk | no |
| Cartographer | shared-approved | map-only | yes | yes | no | limited |
| Comedy Club | public-safe | mutation-only | yes | limited | no | no |

## Handoff rule

No organism can finish an artifact alone. Every important artifact needs at least:

- source/evidence check by Archivist
- uncertainty/risk check by Critic
- meaning map by Cartographer
- build path by Engineer

Symbolic artifacts also require Child. Public-facing artifacts also require Comedy Club or anti-blandness review.
