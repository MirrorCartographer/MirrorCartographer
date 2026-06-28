# MemoryRouteRecord v0

Status labels

- Source status: derived from public-safe MC architecture and current public research on long-term AI memory.
- Claim status: schema proposal; not runtime implementation.
- Privacy status: public-safe; contains no private material.
- Missingness: not yet connected to code, evaluation fixtures, or UI.
- Revision reason: created after the dangerous question `memory is routing, not storage` became the strongest continuity attractor.

## Purpose

A `MemoryRouteRecord` defines how a remembered structure is allowed to influence a later task.

It prevents memory from behaving like an unmarked pile of context.

It makes memory auditable as routed influence.

## Required fields

### memory_id

Stable identifier.

### source_status

Where the memory came from.

Use values such as:

- user-confirmed
- public-source
- synthetic-fixture
- model-inferred
- imported-document
- unknown

### source_boundary

What source material may be used directly, abstracted, or blocked.

### claim_status

Use values such as:

- observed
- user-reported
- source-backed
- inferred
- speculative
- contradicted
- unknown

### privacy_status

Use values such as:

- private
- internal-use-only
- public-safe abstraction
- public-safe synthetic
- blocked

### abstraction_level

Use values such as:

- raw
- summarized
- abstracted
- pattern-only
- synthetic

### invariant_structure

The relationship, pattern, or rule that survives abstraction.

### eligible_lenses

Where this memory can influence interpretation.

Example:

- product
- interface
- writing
- evaluation
- research
- care-support-non-diagnostic
- income
- visual-design

### blocked_lenses

Where this memory must not influence output.

Example:

- medical authority
- diagnosis
- identity claims
- public biography
- credential claims
- location inference

### route_permission

Use values such as:

- may influence wording
- may influence structure
- may influence question selection
- may influence product requirement
- may influence evaluation criteria
- may not influence public output

### contradiction_state

Use values such as:

- stable
- unresolved
- contested
- obsolete
- superseded

### decay_rule

When the memory weakens or requires review.

### revision_reason

Why the route was created or changed.

### output_trace_requirement

What must be disclosed when this memory influences an output.

## Routing rule

A memory may be relevant and still not be allowed to act.

Relevance is not permission.

Permission is the route.

## First implementation target

Build a synthetic fixture where the same fictional memory item produces different allowed influence under:

- private reflection
- public-safe research
- product requirement writing
- care-support handoff
- income offer design

## Key phrase

The future should not be haunted by memory. It should be routed by accountable influence.
