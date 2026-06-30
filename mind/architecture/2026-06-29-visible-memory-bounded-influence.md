# Visible Memory and Bounded Influence Architecture

Date: 2026-06-29
Status: canonical design artifact

## Core rule

Mirror Cartographer must not treat memory as hidden storage. Every remembered item must expose how it was born, what it can influence, what it cannot influence, and whether the user approved its current meaning.

## Memory object schema

Each memory object has these fields:

1. `memory_id`
2. `created_at`
3. `source_type`: user entry / AI inference / imported file / session artifact / external reference / system note
4. `origin`: human-origin / AI-origin / mixed-origin / uncertain-origin / revised-after-AI-influence
5. `raw_evidence`: immutable source excerpt or pointer
6. `derived_meaning`: interpretation built from the evidence
7. `confidence`: low / medium / high / contested
8. `trust_state`: untrusted / reflected / verified / action-blocked / safe-to-influence
9. `memory_age_state`: fresh / unstable / repeated / consolidated / outdated / transformed
10. `privacy_scope`: local-private / user-visible / project-visible / public-safe / never-store
11. `third_party_exposure`: none / abstracted / identifying / blocked
12. `allowed_influence`: reflect-only / context-only / suggest-gently / decision-relevant / blocked
13. `forbidden_actions`: list of things this memory may never steer
14. `expiry`: none / date / event-bound / manual-review-required
15. `revision_history`: append-only semantic commits
16. `provenance_chain`: source -> memory used -> inference -> uncertainty -> allowed influence

## Evidence before belief

A memory can never appear as truth without its raw evidence. MC must show the split:

- raw source
- derived meaning
- confidence
- uncertainty
- allowed influence
- user correction history

## Semantic commits

Every memory update is treated like a version-control commit.

Commit fields:

- new memory or changed meaning
- older memory it may overwrite
- conflict detected
- user-approved merge
- blocked influence
- reason for change

## Memory birth certificate

Every saved memory gets a birth certificate at creation:

- source
- reason saved
- risk level
- privacy scope
- expiry
- allowed influence
- user approval state

## Memory recall card

Every recalled memory must display:

- what was remembered
- what changed since storage
- what is being reconstructed now
- which current symbols or body signals are influencing reconstruction
- what decisions it is not allowed to affect

## Local-first and room-based memory

MC should avoid becoming one cloud brain. Memory should be split by room and organism:

- Archivist stores and retrieves evidence.
- Critic audits confidence, contradiction, and risk.
- Child symbolizes without action authority.
- Engineer turns approved ideas into build steps.
- Cartographer links patterns across rooms.
- Comedy Club mutates ideas and tests playfulness.

Each room has:

- private memory
- shared memory
- forbidden memory
- export rules
- import quarantine

## Memory poisoning defense

Persistent memory can become a control channel. MC needs quarantine states:

- untrusted: cannot influence interpretation
- reflected: may be discussed but not reused automatically
- verified: evidence-backed
- action-blocked: visible but cannot steer decisions
- safe-to-influence: explicitly approved and bounded

## Portable memory rule

Any export/import must include:

- memory object
- provenance chain
- allowed influence
- user approval record
- trust state
- quarantine status

## Non-negotiable design principle

Never let summaries become the only surviving memory. Keep raw trace plus public-safe extract. Summary is interpretation, not evidence.
