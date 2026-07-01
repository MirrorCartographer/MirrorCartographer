# Public Claim Taxonomy

Date: 2026-07-01
Status: public-safe research note

## Core finding

Mirror Cartographer needs a Public Claim Taxonomy: a mandatory classification layer for anything that leaves private reflection space and becomes durable documentation, product language, public explanation, evaluation material, or implementation work.

Operating line:

> MC can generate meaning privately, but public language must declare what kind of claim it is before anyone is asked to trust it.

## Why this matters

Mirror Cartographer works across several authority types at once: symbolic reflection, product design, safety architecture, research framing, implementation planning, evaluation design, and public explanation. These can feel connected, but they do not carry the same proof burden.

Without a public claim taxonomy, a sentence can accidentally sound stronger than it is. A symbolic insight can sound like a clinical claim. A design requirement can sound like deployed functionality. A research question can sound like validated evidence. A user-resonant phrase can sound like an objective finding.

The taxonomy exists to prevent that authority drift.

## Claim classes

### 1. Symbolic reflection claim

A meaning-oriented statement generated through metaphor, image, narrative, body-language, affective resonance, contradiction, or pattern comparison.

Allowed public form: method description, synthetic example, or interface behavior.

Not allowed public form: proof of objective fact, diagnosis, prediction, or user-specific evidence.

### 2. Product requirement claim

A statement about what the system should support, prevent, label, route, preserve, or refuse.

Allowed public form: requirement, acceptance criterion, design constraint, or implementation note.

Not allowed public form: claim that the feature already exists unless verified in code or deployment.

### 3. Implementation claim

A statement about existing code, architecture, route behavior, data model, UI behavior, or deployment state.

Allowed public form: source-backed technical note.

Not allowed public form: aspirational roadmap language presented as current capability.

### 4. Research question claim

A statement naming what MC needs to investigate, validate, compare, or falsify.

Allowed public form: research backlog, evaluation question, literature review target, or experiment design.

Not allowed public form: final answer or confirmed result.

### 5. Evaluation claim

A statement about how MC will be tested.

Allowed public form: rubric, adversarial test, acceptance criterion, failure mode, scoring method, or audit protocol.

Not allowed public form: claim of success without test evidence.

### 6. Safety boundary claim

A statement defining what MC must not infer, expose, intensify, diagnose, promise, or publish.

Allowed public form: policy, guardrail, source-boundary note, redaction rule, or transformation rule.

Not allowed public form: private details used as examples.

### 7. Source-boundary claim

A statement identifying where information came from and what it is allowed to become.

Allowed public form: source class, privacy status, transformation status, missingness note, or evidence limitation.

Not allowed public form: raw private source material.

### 8. Public explanation claim

A statement intended for readers outside the private context who need to understand MC without seeing private material.

Allowed public form: abstract architecture, product framing, educational description, public-safe index, or generalized method.

Not allowed public form: private transcript reconstruction, personal timeline, household context, care context, financial context, credential details, location details, or identifying relationship details.

## Required labels

Every public-facing MC research note should include these labels:

- Source status: private-context-derived, GitHub-derived, web-derived, synthetic, mixed, or unknown.
- Claim status: symbolic, requirement, implementation, research-question, evaluation, safety-boundary, source-boundary, or public-explanation.
- Privacy status: public-safe, transformed-private, synthetic-only, needs-review, or do-not-publish.
- Missingness: what was not inspected, not verified, not implemented, or not safely exportable.
- Revision reason: why the note was created or changed.

## Acceptance criteria

A public MC artifact passes this taxonomy only if:

1. It names its claim type.
2. It avoids private identifying details.
3. It does not let resonance become evidence.
4. It does not let roadmap become implementation.
5. It does not let private context become public proof.
6. It includes missingness rather than hiding uncertainty.
7. It can still make sense after all private-source material is removed.

## Product implication

MC should eventually enforce this taxonomy at export time. Before any reflection, note, page, index, demo, or research artifact becomes durable or public, the system should require claim-class selection and boundary validation.

Minimum implementation plan:

1. Add a `claim_class` field to durable MC notes.
2. Add a `privacy_status` field to exported/public notes.
3. Add a `source_status` field that distinguishes private-context-derived architecture from public evidence.
4. Add a missingness prompt before publication.
5. Add an export blocker for anything marked `needs-review` or `do-not-publish`.
6. Add automated checks for forbidden private-detail categories.

## Source status

Mixed: derived from available MC saved context and previously established GitHub mind direction. No raw transcript, personal, household, health, animal-care, financial, location, relationship, credential, or identifying private details are included.

## Claim status

Product requirement, source-boundary note, evaluation criterion, and implementation plan.

## Privacy status

Public-safe transformed architecture. Private context influenced the architectural need, but no private source content is exposed.

## Missingness

This note does not verify the current deployed codebase, database schema, UI export behavior, or existing repository file inventory. It should be treated as an architecture requirement until implementation is inspected.

## Revision reason

Added to make MC public artifacts more trustworthy by preventing claim-type confusion during private-to-public transformation.
