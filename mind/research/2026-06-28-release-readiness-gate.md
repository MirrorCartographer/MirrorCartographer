# Release Readiness Gate

Status labels

- Source status: derived from public-safe MC file-library patterns, prior GitHub mind direction, and current external research on provenance, transparency, and co-creation evaluation.
- Claim status: product-method proposal, not validated implementation.
- Privacy status: public-safe; no raw transcript, personal, household, health, animal-care, financial, location, relationship, credential, or private-source details.
- Missingness: not yet implemented as a repo check, CI workflow, review form, or UI gate.
- Revision reason: MC has accumulated many public-safe artifacts; the next need is a release decision layer that prevents useful speculation from becoming unsupported public authority.

## Finding

Mirror Cartographer needs a `ReleaseReadinessGate`.

A public artifact should not be released merely because it is interesting, beautiful, coherent, or emotionally resonant.

It should be released only after it passes explicit checks for source boundaries, claim strength, privacy safety, utility, falsifiability, and downstream misuse risk.

## Why this matters

MC now contains several strong lanes:

- public-safe compilation
- memory routing
- influence graphs
- authority boundaries
- resonance/proof separation
- agency friction
- co-presence boundaries
- contradiction signal tracking
- ViewDiff discovery
- translation survival

Each lane reduces one kind of risk.

But no lane yet answers the operational question:

> Is this artifact ready to cross into public space?

That question needs its own gate.

## Current research fit

Recent work on AI provenance and AIBOMs supports treating provenance, lifecycle metadata, and reproducibility as explicit structured artifacts rather than informal notes.

Recent transparency work argues that labeling cannot be only post-hoc; transparency must be architectural.

Recent human-AI co-creation evaluation work supports trajectory-level evaluation, schema-constrained review, reliability-aware judging, and cognitively meaningful trajectories rather than one-shot output scoring.

MC should therefore treat release readiness as architectural metadata, not as a final vibe check.

## Release readiness dimensions

### 1. Source boundary

What material shaped the artifact?

Allowed public categories:

- public docs
- public repo materials
- synthetic fixtures
- abstracted private-context patterns
- cited external research

Blocked categories:

- raw transcripts
- personal details
- household details
- health or animal-care details
- financial details
- location details
- relationship details
- credentials
- private-source specifics

### 2. Claim strength

Every artifact must mark its strongest claim as one of:

- metaphor
- design intuition
- research question
- product requirement
- prototype behavior
- evaluation result
- public claim

The artifact cannot speak louder than its evidence lane allows.

### 3. Utility

A public artifact must help at least one real reader do something clearer:

- understand MC
- inspect a transformation
- evaluate a claim
- build a fixture
- run an audit
- design a product layer
- avoid a known failure mode

### 4. Falsifiability or shrinkability

If the artifact cannot yet be falsified, it must at least be shrinkable.

A shrinkable claim can be narrowed without pretending the original strong version was proven.

### 5. Misuse and dependency risk

The artifact must not invite:

- diagnostic substitution
- therapy-like authority
- medical, veterinary, legal, financial, or social-work authority
- AI personhood confusion
- emotional dependency
- hidden persuasion
- source laundering

### 6. ViewDiff value

The artifact should state what became newly visible because the idea crossed forms.

If nothing became more inspectable, it may belong in a private note rather than a public artifact.

## Gate outcome states

- `release_ready`: public-safe, useful, bounded, and reviewable.
- `release_with_warning`: useful but requires prominent missingness or authority-boundary labels.
- `hold_for_fixture`: interesting but needs synthetic example or test case.
- `hold_for_evidence`: claim strength exceeds support.
- `private_only`: cannot be abstracted without leakage or distortion.
- `discard_or_archive`: not useful enough to preserve.

## Operating rule

MC should not publish because the artifact feels alive.

MC should publish when the artifact can survive boundary inspection.

## Key phrase

Release is not expression.

Release is a governed crossing with consequences.
