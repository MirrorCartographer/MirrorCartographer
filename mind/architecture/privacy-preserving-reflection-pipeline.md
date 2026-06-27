# Privacy-Preserving Reflection Pipeline

## Architecture question

How can Mirror Cartographer use longitudinal reflective data without turning memory into a privacy leak, shame mirror, or overconfident identity model?

## Short answer

MC should not treat reflection as a single storage event. It should treat reflection as a staged pipeline:

1. capture only what is needed,
2. separate raw expression from interpretation,
3. minimize identifiable content before model analysis,
4. label claims and uncertainty,
5. return user-legible insight,
6. require approval before durable memory,
7. preserve correction and deletion paths.

The product pattern is not just `memory`. It is `participatory memory with privacy threat modeling`.

## Research basis

### AI-Wrapped: longitudinal LLM use requires trust, agency, and transparent design

AI-Wrapped is a 2026 CHI paper/prototype studying naturalistic LLM use from exported chat histories. It reports that participants used LLMs for creative work, professional tasks, emotional support, and existential/self-reflective themes. The method used user-controlled export, review, deletion, PII removal, and zero-data-retention processing. Even with those protections, participants still worried about privacy exposure and judgment.

Useful concepts for MC:

- naturalistic AI use is longitudinal and context-dependent, not only benchmark-like;
- reflective AI use is common enough to require explicit design support;
- users need immediate value from analysis, not extraction-only measurement;
- privacy controls are necessary but not psychologically sufficient;
- `felt judged` is an interface risk, not just a data-security risk.

Source: https://arxiv.org/abs/2602.18415

### PriMod4AI: privacy risk must be modeled across lifecycle and data flows

PriMod4AI argues that AI systems create privacy risks across the system lifecycle, especially when handling sensitive or high-dimensional data. It combines LINDDUN-style privacy threat categories with AI-specific model attacks such as membership inference and model inversion, using data-flow information to ground threat analysis.

Useful concepts for MC:

- privacy review should be connected to data flow, not just a policy page;
- memory systems should track where data moves and what transforms it;
- AI-specific risks extend beyond normal app privacy risks;
- threat assessments should be justified and taxonomy-grounded.

Source: https://arxiv.org/abs/2602.04927

### LINDDUN-based GenAI privacy framework: chatbots need GenAI-specific privacy examples

A 2026 LINDDUN-based framework for GenAI argues that privacy analysis is often underemphasized in generative systems. It extends privacy threat modeling with GenAI-specific examples and validates the approach on an AI agent system.

Useful concepts for MC:

- chatbot and agent systems need privacy analysis as a design artifact;
- privacy threats should be evaluated during product architecture, not after launch;
- MC should keep a reusable privacy checklist for each memory-facing feature.

Source: https://arxiv.org/abs/2603.06051

## Fact / inference boundary

### Facts from sources

- AI-Wrapped studied 82 U.S.-based adults and 48,495 conversations from 2025 histories.
- AI-Wrapped found LLM use included instrumental, creative, professional, emotional, and existential/self-reflective purposes.
- AI-Wrapped used participant review/deletion, PII removal, and zero-data-retention processing, while still finding privacy/judgment concerns.
- PriMod4AI frames AI privacy threats as lifecycle and data-flow problems and adds model-centric attacks beyond classical LINDDUN categories.
- The LINDDUN-based GenAI framework introduces GenAI-specific privacy threat examples and tests privacy analysis on chatbot/agent systems.

### MC inferences

- MC should include a `felt judgment risk` label because privacy anxiety is partly emotional/social, not only technical.
- MC should separate raw reflection, interpreted pattern, durable memory, and public-safe abstraction into different objects.
- MC should make privacy state visible in the interface as cards rather than hiding it in settings.
- MC should require user approval before any reflection becomes durable memory.

## Design pattern: Reflection Safety Pipeline

### Stage 1 — Intake

Input types:

- user reflection text
- symbol or metaphor
- body/sensory phrase
- project note
- source URL
- animal observation note
- external artifact note

Default state:

- private
- unreviewed
- not durable
- not public
- no diagnostic or identity claim

### Stage 2 — Local minimization / redaction

Before analysis, MC should remove or generalize:

- names
- exact locations
- contact details
- account identifiers
- private medical/veterinary details unless explicitly needed for the private session
- raw distress content not needed for the task

Output should preserve meaning but reduce exposure.

### Stage 3 — Interpretation split

MC must split the object into lanes:

| Lane | Meaning | Durable by default? |
|---|---|---|
| Raw input | What the user/source actually supplied | No |
| User meaning | Why the user says it matters | No |
| System interpretation | What MC infers | No |
| Evidence/source | What public source supports | Yes, if public-safe |
| Memory candidate | What could be useful later | Only after approval |
| Public-safe abstraction | Non-private generalized concept | Only after review |

### Stage 4 — Claim labels

Every generated statement gets one label:

- source fact
- user statement
- system inference
- project hypothesis
- unknown
- do-not-claim

### Stage 5 — Privacy labels

Every object gets one label:

- private raw
- private interpreted
- public-safe abstraction
- public source
- sensitive do not publish
- discard/delete

### Stage 6 — Felt judgment gate

Before showing a reflective summary, MC should check whether the output could feel like surveillance, diagnosis, mockery, shame, or identity capture.

If yes, change the output style:

- use neutral language;
- show uncertainty;
- avoid fixed identity labels;
- emphasize user control;
- show edit/delete/downgrade options.

### Stage 7 — Memory approval

No item becomes durable memory unless the user can answer:

1. What will MC remember?
2. Why is it useful?
3. Where did it come from?
4. Is it source fact, user statement, or inference?
5. Who can see it?
6. How do I edit, downgrade, or delete it?

## Requirement update

MC memory-facing features should implement:

- visible source provenance;
- visible privacy state;
- visible claim state;
- raw vs interpreted separation;
- user approval before persistence;
- correction and deletion controls;
- public-safe abstraction path;
- no medical, veterinary, legal, or psychological certainty claims from reflection alone.

## Prototype plan

Build a static card set called `Reflection Safety Pipeline` with five example cards:

1. harmless creative symbol;
2. project research note;
3. body/sensory phrase;
4. animal observation note;
5. external source URL.

Each card shows:

- raw input preview;
- minimized version;
- system interpretation;
- claim label;
- privacy label;
- memory status;
- user action buttons: Save privately, Abstract publicly, Keep session-only, Delete.

## Evaluation criterion

A non-technical user should be able to identify within 30 seconds:

- what is raw input;
- what is MC interpretation;
- what is public vs private;
- whether the item became memory;
- how to undo or correct it.

Pass condition: 8 out of 10 test cards are correctly understood by a reviewer without explanation.

## Falsification checklist

This pattern fails if:

- users cannot distinguish source fact from MC inference;
- users believe private reflection was published;
- public artifacts contain private specifics;
- memory is created without an explicit approval state;
- deletion/correction paths are not visible;
- reflective summaries feel like diagnosis or identity capture;
- privacy labels exist in schema but not in the UI.

## Next research question

How can MC make privacy and memory controls emotionally legible without making the interface feel bureaucratic or clinical?
