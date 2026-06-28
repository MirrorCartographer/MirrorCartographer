# Consent-Scoped Influence Graph

Status labels

- Source status: derived from public-safe MC GitHub mind direction, saved architectural context, and current research pass. Private context was used only to infer architectural need, not as publishable content.
- Claim status: speculative method proposal / research architecture, not implemented or validated.
- Privacy status: public-safe; contains no personal, household, health, animal-care, financial, location, relationship, credential, or raw transcript details.
- Missingness: no runtime implementation, no real user dataset, no UX tests, no third-party review, no formal privacy threat model yet.
- Revision reason: created after prior findings on PublicSafeCompiler, memory routing, contradiction signal, ViewDiff discovery, and dangerous questions exposed an unresolved problem: how to show influence without leaking source material.

## Core finding

MC needs a way to show what past context was allowed to influence a future artifact without exposing the private material that produced the influence.

Call this structure a Consent-Scoped Influence Graph.

The graph does not publish memory.

The graph publishes allowed influence.

## Problem

A public-safe artifact can be honest about its source boundary in plain text, but plain text does not fully answer:

- Which source lanes shaped this artifact?
- Which lanes were blocked?
- Which lanes were abstracted?
- Which lanes were transformed into method instead of content?
- Which claims depend on public sources versus private context versus project memory?
- Which earlier artifacts should be allowed to affect this artifact's meaning?

Without this, MC risks two opposite failures:

1. Hidden influence: private context quietly shapes public artifacts without a visible boundary.
2. Sterile abstraction: useful continuity is stripped so aggressively that the public artifact loses the architecture that made it valuable.

The Consent-Scoped Influence Graph is meant to hold the middle.

## Definition

A Consent-Scoped Influence Graph is a public-safe map of permitted influence relationships between source lanes, transformations, artifacts, and claims.

It records:

- source class, not private source content
- allowed transformation, not raw material
- blocked lanes, not hidden details
- claim dependency, not unsupported authority
- revision reason, not mythologized continuity

## Influence lanes

Suggested starting lanes:

### public_repo

GitHub files, public documentation, public demo fixtures, public issues, public pull requests.

Allowed public use:

- cite directly
- summarize directly
- build from directly

### saved_architecture_context

Persistent non-public memory about MC's structure, goals, and constraints.

Allowed public use:

- abstract into method
- convert into product requirement
- convert into evaluation criterion
- record as `architecture-inferred`

Blocked public use:

- personal detail
- raw phrasing that reveals private context
- biographical evidence

### conversation_pattern_context

Patterns inferred from prior chats.

Allowed public use:

- abstract repeated needs into product requirements
- identify recurring system pressure
- generate public-safe research questions

Blocked public use:

- raw transcript excerpts
- identifiable personal episodes
- household/health/animal/finance/location/relationship/credential details

### external_research

Public papers, standards, news, documentation, and comparable systems.

Allowed public use:

- cite directly
- use as evidence lane
- compare method fit

### synthetic_fixture

Invented examples created specifically for testing.

Allowed public use:

- publish directly if no private leakage
- use for evaluation and demos

## Graph edge types

### informed_by

Artifact or claim was shaped by a source lane.

### abstracted_from

Private or mixed source material was transformed into a general method or requirement.

### blocked_from

A source lane was explicitly prevented from entering the artifact.

### tested_by

A claim has a fixture, scorecard, or evaluation route.

### constrained_by

A release was limited by privacy, safety, evidence, authority, or missingness boundary.

### revised_because

A prior statement or artifact was changed because of a known reason.

## Example public-safe graph entry

Artifact:

`public-safe-compiler-prd`

Influence map:

- informed_by: public_repo, saved_architecture_context, external_research
- abstracted_from: conversation_pattern_context
- blocked_from: personal details, health details, animal-care details, financial details, location details, relationship details, credentials, raw transcript
- constrained_by: non-diagnostic boundary, privacy boundary, claim-status boundary
- tested_by: public-safe-compiler-scorecard
- revised_because: need to preserve method without leaking source

## Why this matters

The graph gives future researchers a way to inspect MC's continuity without demanding access to private material.

It also prevents the system from pretending public artifacts were created from nowhere.

The honest statement becomes:

This artifact was shaped by private-context architecture, but only the method crossed the boundary.

## Fit with current AI research

Recent work on provenance-grounded long-term memory argues for separating source evidence, extracted memory, retrieval, and answer behavior so failures can be diagnosed. That supports MC's need to separate influence, source, and claim layers.

Recent work on trustworthy memory search frames memory as a trust boundary rather than a neutral utility layer. That supports MC's claim that influence admission must be scoped, not merely semantically relevant.

Recent work on content credentials and AI provenance supports the broader move toward visible provenance records, though MC's graph is about conceptual/source influence rather than media metadata alone.

## First implementation target

Create a small `InfluenceGraphRecord` schema.

Then attach an influence graph record to every new mind artifact in one batch:

- source lanes used
- source lanes blocked
- claim dependencies
- public-safe transformation type
- missingness
- revision reason

## Key phrase

The source does not have to be exposed for the influence to be honestly bounded.
