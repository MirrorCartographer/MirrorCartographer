# Reflection Authority Router

## Core finding

Mirror Cartographer needs a **Reflection Authority Router**.

Operating line:

> A reflection must know who is allowed to move it: the user, the system, the evidence lane, the memory lane, or no one yet.

## Public-safe summary

MC already requires provenance, source boundaries, missingness labels, public claim taxonomy, consent gradients, export gates, memory gates, mode handoffs, evidence firewalls, and revision ledgers. The next missing architectural layer is **authority routing**: every generated reflection should carry an explicit decision about which actor or process may accept, revise, store, export, contest, or discard it.

Without this layer, MC can still label a reflection as private, uncertain, symbolic, interpretive, or evidence-bound, but it cannot consistently decide who has permission to move the reflection into the next state.

## Product requirement

Every reflection object should include an `authority_route` field before it becomes durable, searchable, exportable, or user-facing outside its original context.

Minimum route states:

1. `user_only` — the user must decide before storage, reuse, export, or interpretation expansion.
2. `system_draft` — MC may hold the reflection temporarily as a draft hypothesis but cannot treat it as memory.
3. `evidence_required` — the reflection cannot advance until source support is attached.
4. `symbolic_only` — the reflection may remain meaning-bearing but cannot become factual claim language.
5. `public_architecture_only` — the private substrate may inform an abstract method, but no private content may be exposed.
6. `blocked_sensitive` — the reflection is not eligible for public export or durable public indexing.
7. `discard_or_rewrite` — the reflection failed boundary, claim, consent, or mode checks.

## Source status

- Available source basis: existing MC design memory, prior public-safe GitHub research chain, and current repository access confirmation.
- Private-context use: architecture comprehension only.
- Public-source use: not required for this run because the finding is an internal product-governance requirement, not an external factual claim.
- GitHub source status: repository located as `MirrorCartographer/MirrorCartographer`; visibility public; write permission available.

## Claim status

- Claim type: product architecture requirement.
- Confidence: medium-high.
- Evidence type: design synthesis across prior MC governance notes.
- Not a clinical, legal, financial, personal, or empirical claim.

## Privacy status

- Public-safe: yes.
- Contains private details: no.
- Contains household, health, animal-care, financial, location, relationship, credential, or transcript details: no.
- Export-safe as a method note: yes.

## Missingness

- Missing: canonical schema for reflection objects.
- Missing: exhaustive authority transition table.
- Missing: automated test fixture for route enforcement.
- Missing: UI copy for asking the user to approve, reject, narrow, or reclassify a reflection.

## Evaluation criteria

A reflection passes the authority router only if MC can answer:

1. Who may move this reflection into memory?
2. Who may revise it?
3. Who may export it?
4. Is it symbolic, evidential, procedural, or blocked?
5. What source boundary prevents misuse?
6. What user-facing action is required next, if any?

## Implementation plan

1. Add `authority_route` to the reflection packet.
2. Run the route after source-boundary classification and before memory classification.
3. Prevent public export unless route is `public_architecture_only` or another explicitly exportable state.
4. Store route changes in the revision reason ledger.
5. Treat user rejection as boundary evidence, not system failure.
6. Add unit tests for blocked-sensitive, symbolic-only, evidence-required, and user-only transitions.

## Revision reason

Added because the existing chain defines what a reflection is, where it came from, what kind of claim it makes, and whether it may become memory or export. It still needs an explicit answer to who has authority to move the reflection between those states.
