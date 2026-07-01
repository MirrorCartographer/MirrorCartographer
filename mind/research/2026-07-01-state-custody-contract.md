# State Custody Contract

## Core finding

Mirror Cartographer needs a **State Custody Contract**: a required boundary object attached to any symbolic, reflective, evaluative, or continuity-bearing state before that state can be stored, reused, synthesized, exported, evaluated, or published.

Operating line:

**A state is not safe to carry forward until MC can say what it is holding, why it is holding it, what it may affect, and what it must never prove.**

## Why this matters

Mirror Cartographer is designed to preserve meaning across time without collapsing interpretation into authority. Prior research notes already define boundary concepts around provenance, proof transfer, abstraction, resonance, authority typing, and continuity. The remaining gap is custody: the system needs a runtime contract that governs the life of a state object after capture and before reuse.

Without a custody contract, MC can accidentally treat repeated symbolic material as durable evidence, treat continuity as consent, or let private context influence public-facing outputs without a visible transformation record.

## Public-safe source basis

- Source status: mixed public-safe project synthesis, uploaded MC specification/atlas materials, current repository direction, and abstracted conversation-derived architecture patterns.
- Claim status: design requirement and research hypothesis, not empirical validation.
- Privacy status: public-safe abstraction. No raw transcripts, personal details, household details, health details, animal-care details, financial details, location details, relationship details, credentials, or identifying private examples are included.
- Missingness: no independent user-study evidence yet; no production telemetry; no formal privacy threat model; no implementation-level schema validation yet.
- Revision reason: prior notes define how meaning, proof, provenance, continuity, and authority should be separated. This note adds the missing custody layer that decides whether a captured state is allowed to persist or influence later system behavior.

## Contract fields

Every state object should carry these fields before reuse:

1. State type
   - symbolic reflection
   - user-confirmed reflection
   - product requirement
   - implementation note
   - evaluation result
   - research question
   - public-safe abstraction
   - private-only context marker
   - synthetic example

2. Source boundary
   - public source
   - user-provided private context
   - assistant inference
   - uploaded project file
   - repository artifact
   - synthetic construction
   - mixed-source synthesis

3. Claim status
   - observed
   - user-stated
   - inferred
   - speculative
   - source-backed
   - unverified
   - falsified or retired

4. Privacy status
   - public-safe
   - private-only
   - publish only as abstraction
   - publish only with source citation
   - do not publish
   - needs review

5. Allowed influence
   - may influence interface design
   - may influence evaluation criteria
   - may influence research questions
   - may influence implementation planning
   - may influence private reflection only
   - may not influence future outputs without confirmation

6. Forbidden use
   - must not become proof of external fact
   - must not diagnose
   - must not identify a person, household, animal, location, credential, relationship, or financial state
   - must not be quoted from private context
   - must not be treated as consent for persistence
   - must not be used as marketing evidence unless separately source-backed

7. Retention rule
   - ephemeral
   - session-bound
   - user-confirmed memory
   - project requirement
   - public artifact
   - retired
   - pending review

8. Review trigger
   - domain risk changed
   - user revises meaning
   - source becomes stale
   - claim crosses lanes
   - output is being published
   - private source is abstracted into public architecture
   - repeated resonance begins to look like authority

## Implementation requirement

MC should not have a single undifferentiated memory store. It should maintain custody-aware state containers:

- private reflection state
- project architecture state
- public-safe method state
- evidence-linked research state
- implementation state
- evaluation state
- retired or quarantined state

A state may move between containers only through a documented transition.

## Transition rule

Before a state crosses from private reflection into public architecture, the system must produce a transformation record:

- original source class, not content
- abstraction performed
- details removed
- claim downgraded or relabeled
- allowed public form
- remaining uncertainty
- reason the public artifact can stand without the private source

## Evaluation criteria

A State Custody Contract passes only if an evaluator can answer:

1. What kind of state is this?
2. Where did it come from?
3. What can it legitimately influence?
4. What can it not prove?
5. Is it allowed to persist?
6. Is it allowed to be published?
7. What would make it stale, unsafe, or invalid?
8. Can the public version stand without exposing the private origin?

## Research questions

- What minimum custody labels are necessary before longitudinal symbolic memory becomes safe enough for public product use?
- How should MC detect when repeated resonance is becoming false authority?
- What should trigger automatic quarantine of a state object?
- Can a privacy-safe transformation ledger be made understandable to nontechnical users without weakening the boundary?
- How should state custody be visualized in the interface?

## Product requirement

Add a visible custody badge to every saved reflection, artifact, research note, and exported synthesis.

Minimum badge fields:

- source boundary
- claim status
- privacy status
- allowed use
- review status

## Implementation plan

1. Define a `StateCustodyContract` schema.
2. Attach it to saved reflections, research notes, and artifacts.
3. Require contract validation before export or publication.
4. Add a transformation ledger for private-to-public moves.
5. Add quarantine states for ambiguous, high-risk, stale, or over-authoritative claims.
6. Add evaluator tests that attempt to misuse the state as proof.
7. Block publication when custody fields are incomplete.

## Failure mode prevented

The core failure mode is not only privacy leakage. It is **authority laundering**: a private, symbolic, or speculative state silently becoming a public-facing claim with more authority than it earned.

The custody contract prevents this by keeping every state under typed custody until it is resolved, downgraded, transformed, cited, quarantined, or retired.
