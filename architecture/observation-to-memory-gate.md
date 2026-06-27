# Observation-to-Memory Gate

## Architecture question

How should Mirror Cartographer decide whether a user-provided observation becomes durable memory, public-safe abstraction, temporary session context, or discarded material?

This question matters because MC is built around symbolic, embodied, emotional, and longitudinal reflection. That makes memory useful, but it also makes unreviewed memory risky: the system may turn raw human signals into an algorithmic portrait the user did not knowingly authorize.

## Research basis

### 1. Memory can shift agency away from the user

A 2026 empirical paper on ChatGPT memory analyzed 2,050 memory entries from 80 users and found that most memory entries in the dataset were initiated by the system rather than the user. The paper also reports personal-data and psychological-inference concerns. Design implication: MC should not treat memory as a passive feature. It needs an explicit agency boundary before any durable storage.

Source: https://arxiv.org/abs/2602.01450

### 2. Reflective memory needs rationale, drift detection, and human review

Contextual Memory Intelligence frames memory as adaptive infrastructure rather than passive storage. Its Insight Layer emphasizes human-in-the-loop reflection, drift detection, and rationale preservation. Design implication: MC memories should carry provenance and reason-for-retention, not only content.

Source: https://arxiv.org/abs/2506.05370

### 3. Agentic systems need threat modeling, not only UX controls

STRIDE-AI argues that generative AI systems need adapted threat modeling because probabilistic systems face risks such as prompt injection, model inversion, poisoning, and unreliable outputs. Design implication: MC's memory gate should be evaluated as an attack surface and failure surface, not only a product preference.

Source: https://arxiv.org/abs/2605.17163

### 4. Governance patterns support continuous assurance

Agentic governance work aligned with the NIST AI RMF points toward ongoing map/measure/manage/govern loops rather than one-time safety declarations. Design implication: MC should keep claim status, evidence status, and review status separate.

Source: https://arxiv.org/abs/2510.25863

## Core concept

MC should use a four-way gate before memory persistence:

1. **Discard** — irrelevant, too sensitive, too fleeting, unsafe, or not useful beyond the session.
2. **Session-local** — useful now, but not durable.
3. **Private durable memory** — user-approved, directly grounded, useful across sessions, and editable/deletable.
4. **Public-safe abstraction** — transformed into non-identifying architecture language, research notes, schemas, or product patterns.

The gate should happen before the system writes a lasting representation of the user.

## Required metadata for any retained memory-like object

Every retained object should carry:

- `object_id`
- `created_at`
- `source_scope`: user-stated, user-approved, system-inferred, research-derived, public-safe abstraction
- `retention_class`: discard, session-local, private-durable, public-safe
- `sensitivity_class`: low, medium, high, restricted
- `grounding`: direct quote, paraphrase, inference, synthesis, external-source-backed
- `user_visibility`: hidden, visible-on-review, visible-inline, requires-confirmation
- `editability`: user-editable, system-only, immutable-source-citation
- `reason_for_retention`
- `expiration_or_review_date`
- `claim_status`: fact, interpretation, hypothesis, design-pattern, needs-review
- `evidence_links`
- `redaction_notes`

## Gate logic

### Step 1: classify source

Ask what kind of object this is:

- raw user statement
- symbolic expression
- body/emotion observation
- system inference
- product insight
- external-source research
- animal-care observation
- public artifact note

### Step 2: classify sensitivity

High caution if the object involves:

- health, mental health, trauma, sexuality, finances, location, identity, family, animals' medical state, legal status, credentials, or private relationships
- psychological inferences not explicitly stated by the user
- patterns that could identify a person even after names are removed

### Step 3: choose retention class

Use this default:

- If it is sensitive and not explicitly approved: session-local or discard.
- If it is useful but private: private durable only with visibility and edit/delete controls.
- If it is useful for public GitHub: abstract it into design language and remove identifying details.
- If it is an inference: label it as inference and require review before private durable storage.

### Step 4: attach rationale

No retained object without a short answer to:

- Why keep this?
- Who benefits?
- What could go wrong if this is wrong?
- What would falsify or weaken it?

### Step 5: review for drift

Any durable memory-like object should periodically be checked for:

- stale context
- changed user intent
- over-personalized framing
- unsupported psychological inference
- private material accidentally converted into public artifact language

## MC design pattern

Name: **The Gate Before the Portrait**

Visual metaphor: a mirror behind a gate, not a mirror that automatically paints the person. The gate has four paths: dissolve, hold for now, keep privately, abstract publicly.

Interface sketch:

- User enters signal: `tight chest + storm image + cannot start task`
- MC output separates layers:
  - Observation: user reported body signal and image.
  - Interpretation: possible overload pattern.
  - Memory suggestion: store only if user approves.
  - Public-safe abstraction: `embodied symbolic signal used as state-orientation input`.
  - Next move: choose observe, regulate, map, or act.

## Requirements update

MC memory must not be implemented as a simple save/delete feature. It needs:

1. A retention class for every object.
2. A source-scope label for every object.
3. A sensitivity class before persistence.
4. A visible distinction between observation, interpretation, hypothesis, and durable memory.
5. Public-safe abstraction rules before GitHub publication.
6. A drift-review mechanism.
7. A falsification or correction path for important claims.

## Prototype plan

Build a text-only gate evaluator.

Input fields:

- observation text
- intended use: reflection, product design, research, public artifact, animal-care log, body map, session context
- user approval state: explicit approval, implicit context only, no approval
- sensitivity hints

Output fields:

- recommended retention class
- sensitivity class
- claim status
- safe public abstraction
- unsafe-to-store elements
- review date
- one-line rationale

Acceptance test:

Given five sample inputs, the evaluator must correctly separate raw observation, system interpretation, private memory suggestion, and public-safe abstraction without making medical, veterinary, psychological, or identity claims beyond the evidence.

## Fact vs inference

Facts from sources:

- Conversational AI memory introduces agency and privacy questions around system-created memories.
- Research has measured unilateral memory creation and sensitive inference in a real-world ChatGPT memory dataset.
- Reflective memory frameworks emphasize rationale, human review, and drift detection.
- AI threat modeling is increasingly being adapted for probabilistic generative systems.

MC inferences:

- Symbolic-emotional systems need stricter memory gates than ordinary productivity assistants.
- Public GitHub artifacts should receive only abstracted design patterns, not raw personal context.
- MC should treat memory as a governed transformation pipeline, not a bucket.

## Next research question

What user-interface pattern makes this gate feel like an intuitive reflective choice instead of a bureaucratic privacy form?
