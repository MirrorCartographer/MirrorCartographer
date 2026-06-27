# Emotional Legibility for Memory Controls

## Architecture question

How can Mirror Cartographer make privacy and memory controls emotionally legible without turning the interface into bureaucracy, legal text, or clinical sludge?

## Why this needed deeper understanding

Recent MC research pointed toward privacy-preserving reflection pipelines and memory ledgers. The weak point is usability: a system can technically expose controls while still making the user feel judged, confused, or overloaded.

The architecture question is therefore not only:

> What data is stored?

It is also:

> Can the user feel, at the moment of reflection, what will happen to a thought, who can see it, what it may become, and how to reverse it?

## Claim status

- Claim: emotionally legible privacy controls will make MC safer and more usable.
- Status: supported as a design hypothesis, not proven.
- Evidence strength: medium.
- Next proof required: user test with prototype cards.

## Research basis

### 1. Longitudinal AI use includes reflective and existential material

AI-Wrapped studied naturalistic LLM usage while attempting privacy-preserving measurement. It found users used LLMs for instrumental tasks and reflective or existential purposes. It also found that even privacy-preserving workflows such as PII removal and zero-data-retention processing did not fully remove privacy and judgment concerns.

Source: https://arxiv.org/abs/2602.18415

MC implication: privacy controls must address felt exposure, not only technical exposure.

### 2. Personalized memory systems are becoming more capable, but implicit personalization remains hard

PersonaMem-v2 frames agentic memory as a path toward personalized intelligence and reports that frontier LLMs still struggle with implicit personalization. It uses a human-readable memory as a compressed alternative to full conversation histories.

Source: https://arxiv.org/abs/2512.06688

MC implication: memory should be readable, compact, and reviewable. Hidden inference about a person should not silently become durable identity.

### 3. Privacy-preserving memory should preserve semantics while protecting sensitive spans

MemPrivacy proposes type-aware placeholders for sensitive spans so cloud-side memory processing can retain useful structure while limiting exposure of raw sensitive values.

Source: https://arxiv.org/abs/2605.09530

MC implication: MC should not rely only on blunt redaction. It needs privacy-preserving abstraction: keep the pattern, protect the raw value.

### 4. Privacy labels help, but labels alone can become another bureaucracy

Research on privacy nutrition labels for generative-AI applications argues that traditional privacy policies are often too long and complex, and proposes structured labels for transparency.

Source: https://arxiv.org/abs/2407.15407

MC implication: use compact labels, but do not make the user read a policy while in a reflective state.

### 5. Contextual privacy notices should appear at the point of action

SeePrivacy research on contextual privacy policies fragments privacy information into concise snippets shown in the relevant interface context instead of forcing users through long policies.

Source: https://arxiv.org/abs/2402.14544

MC implication: privacy meaning belongs next to the memory decision, not buried in settings.

### 6. Disclosure design has unresolved tensions

Synthetic-media disclosure research identifies tensions between normativity versus neutrality and proactivity versus precision. Analogies such as nutrition labels help structure disclosure, but do not resolve all tensions.

Source: https://arxiv.org/abs/2605.19045

MC implication: MC controls should avoid pretending neutrality when the interface is actually guiding a user toward caution.

## Fact / inference split

### Facts from sources

- People use LLMs for reflective and existential material, not only tasks.
- Privacy-preserving research workflows can still leave users worried about privacy and judgment.
- Agentic memory systems increasingly use compact human-readable memory objects.
- Type-aware placeholders can protect sensitive spans while preserving useful semantic structure.
- Long privacy policies are difficult to use; structured labels and contextual snippets are proposed alternatives.
- Disclosure design involves unresolved tradeoffs between being proactive, precise, neutral, and harm-reducing.

### MC inferences

- MC should treat memory approval as an emotional-design moment, not only a data-management step.
- A memory card should show source, sensitivity, claim status, visibility, reversibility, and emotional tone in one glance.
- Privacy-safe abstraction is better than raw deletion when the user wants continuity without exposure.
- Controls should feel like gates, doors, masks, shelves, or lanterns rather than compliance forms.

## Design pattern: The Felt Memory Gate

A Felt Memory Gate is a small interface object shown whenever MC might save, transform, share, or use a reflective item.

It answers six questions:

1. What is this?
2. Where did it come from?
3. What is MC inferring?
4. Who or what can see it?
5. What can it affect?
6. How can it be changed, downgraded, or deleted?

## Required card fields

### Source lane

- user_statement
- source_fact
- system_inference
- project_hypothesis
- unknown

### Privacy lane

- session_only
- private_memory_candidate
- private_memory_approved
- public_safe_abstraction
- do_not_store

### Exposure lane

- visible_only_here
- visible_to_private_profile
- visible_to_project_artifact
- public_safe_if_published
- blocked_from_publication

### Effect lane

- reflection_only
- changes_memory
- changes_project_map
- creates_public_artifact
- triggers_external_action

### Reversal lane

- edit
- downgrade
- delete
- make_session_only
- convert_to_abstraction

### Emotional legibility lane

Use human-readable microcopy, not legal language:

- `This stays here only.`
- `This can help future reflection, but stays private.`
- `This is MC's guess, not a fact.`
- `This can become public only as an abstraction.`
- `This affects action, so it needs review.`

## Visual metaphor spec

The control should look less like a settings menu and more like a small object with state.

Possible metaphors:

### Lantern

Use when a memory is visible for review but not yet saved.

Meaning: illuminated, not owned by the system.

### Shelf

Use when a memory is intentionally stored for later.

Meaning: placed, retrievable, movable.

### Veil

Use when raw content is protected but abstraction remains usable.

Meaning: pattern preserved, raw detail covered.

### Gate

Use when an external effect or public artifact is possible.

Meaning: nothing crosses without review.

### Seed

Use when a thought may grow into a project node but is not evidence yet.

Meaning: potential, not proof.

## Product requirement

MC must not show one global memory toggle as the main control. Each meaningful reflective object should carry its own small Felt Memory Gate.

Minimum viable interface:

- one memory card
- one claim label
- one privacy label
- one effect label
- one emotional microcopy line
- one downgrade/delete action

## Evaluation criterion

A non-technical user should be able to answer these within 30 seconds:

1. Is this saved?
2. Is it private?
3. Is it MC's inference or my statement?
4. Can it become public?
5. Can it affect actions outside reflection?
6. Can I reverse it?

Passing threshold: at least 5 of 6 answered correctly without explanation from the builder.

## Falsification checklist

This design fails if:

- users still feel judged or tricked by memory behavior
- users cannot distinguish private memory from public-safe abstraction
- users cannot tell source fact from MC inference
- users assume deletion removes source documents or external records when it does not
- users ignore the labels because they look like legal clutter
- users cannot find downgrade/delete controls quickly
- the interface nudges saving by default

## Prototype plan

Build five static cards:

1. Harmless practical preference
2. Reflective emotional statement
3. Creative symbol interpretation
4. Animal observation note
5. Project hypothesis that could become public-safe

Each card should display:

- raw item preview
- source lane
- privacy lane
- effect lane
- emotional microcopy
- available actions

Test by asking a viewer to mark what is safe to save, what must stay private, what is only an inference, and what could become a public artifact.

## Next proof needed

Create a clickable `Felt Memory Gate` prototype and run a comprehension test. The important measure is not whether users like it. The measure is whether users correctly understand memory, privacy, inference, publication, and reversal.
