# Product Requirement — Memory Routing Layer

Status labels

- Source status: derived from public-safe MC implementation concepts, GitHub mind speculation lane, and public AI-memory research.
- Claim status: product requirement proposal, not shipped feature.
- Privacy status: public-safe; no private source material.
- Missingness: no UI, backend, database schema, or runtime code exists in this record.
- Revision reason: created because the continuity attractor points toward permissioned influence rather than generic memory storage.

## Product thesis

Mirror Cartographer should not simply remember users.

It should route remembered structures through accountable permissions.

The product problem is not `save more context`.

The product problem is `control how continuity acts`.

## User-facing need

A user should be able to trust that the system can preserve continuity without:

- exposing private material in the wrong audience
- treating old statements as current truth
- turning speculation into fact
- overusing sensitive context
- smoothing contradictions into fake coherence
- losing the thread entirely

## Feature concept

### Memory Routing Layer

A middleware layer between stored trajectory records and generated output.

It checks each candidate memory against:

- current task
- requested audience
- selected mode
- privacy constraints
- source status
- claim status
- contradiction state
- revision history
- lens eligibility

Only eligible memory routes are allowed to influence the answer.

## Core components

### 1. MemoryRouteRecord

Structured route metadata for each remembered pattern.

### 2. RouteGate

Function that decides whether a memory can influence a task.

### 3. ViewDiff

Shows what changed when a memory moved from private/internal form into public-safe output.

### 4. Boundary Bill

Records what crossed, what stayed blocked, and why.

### 5. Revision Reason Ledger

Tracks why a memory route changed.

## Required user controls

- no-save mode
- private-only mode
- public-safe export mode
- audience selector
- delete route
- demote route
- mark obsolete
- mark contradicted
- mark too intense
- ask for lower abstraction
- ask for higher abstraction

## Required system labels

Each memory-influenced output must be able to expose:

- source status
- claim status
- privacy status
- missingness
- revision reason

## Prototype path

### Phase 1 — synthetic fixture

Create 20 synthetic memories and route them across five task types.

### Phase 2 — offline evaluator

Score relevance-only retrieval vs routed retrieval.

### Phase 3 — UI trace card

Display why a memory was used, abstracted, or blocked.

### Phase 4 — export boundary bill

Attach boundary record to public-safe artifacts.

## Product risk

The system may become too bureaucratic.

Countermeasure:

Make route labels short, visible, and optional in normal use, but complete in export/audit mode.

## Income wedge

Memory Routing can become an audit service:

`We inspect whether your AI memory system is preserving continuity or accidentally letting old/sensitive/speculative context control future outputs.`

Potential buyers:

- AI founders building memory features
- therapists/coaches using AI tooling
- education tools
- journaling app teams
- personal knowledge-management products
- AI safety researchers studying long-term agent drift

## Key phrase

Continuity is not the same thing as memory. Continuity is routed memory with accountable influence.
