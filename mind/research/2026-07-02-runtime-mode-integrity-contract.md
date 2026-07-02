# Runtime Mode Integrity Contract

## Core finding

Mirror Cartographer needs a Runtime Mode Integrity Contract.

Operating line:

**A mode is not a mood; it is a boundary condition for what the system is allowed to claim.**

## Source status

- Source class: mixed public-safe synthesis from available project files, saved architectural context, and existing GitHub mind direction.
- File-library anchors: public-safe Mirror Cartographer specification and atlas materials describe a three-mode structure: Canonical, Reflective, and Mythopoetic, plus a core flow of ENTRY -> FIELD -> RECURSION -> RETURN.
- GitHub status: written as a new public repository research note, not as a claim that the runtime already enforces this contract.
- Private-context use: used only to understand repeated architecture pressure around source boundaries, claim labeling, memory gates, and evidence discipline. No private facts or raw transcript material are reproduced here.

## Claim status

- Confirmed: MC has repeatedly used a three-mode architecture: Canonical, Reflective, and Mythopoetic.
- Confirmed: MC is framed as a recursive symbolic cognition / reflection system rather than a generic chatbot.
- Inferred: once MC has multiple modes, it needs explicit mode-integrity enforcement so outputs do not slide between evidence-grounded, personal-reflective, and creative-symbolic claims without visible labeling.
- Bounded speculation: future implementations may represent mode integrity as a runtime guard, UI badge, schema field, test harness, or audit log.

## Privacy status

Public-safe.

This note contains only abstract system architecture, governance requirements, evaluation criteria, and implementation planning. It excludes personal, household, health, animal-care, financial, location, relationship, credential, and raw transcript details.

## Missingness

- No direct code audit was completed in this run.
- No current runtime behavior was tested.
- No exhaustive repository inventory was completed.
- Existing GitHub research notes may already overlap conceptually with this contract, but this entry isolates the specific failure mode of mode drift.

## Revision reason

Prior public-safe research notes established evidence lanes, source boundaries, memory classification, authority routing, claim promotion, missingness, and public-safe traceability. The next missing architectural piece is enforcement of the mode boundary itself: Canonical, Reflective, and Mythopoetic outputs must not share the same claim posture.

## Requirement

Each MC output should carry a mode label and a mode-permitted claim envelope.

Minimum envelope fields:

1. `mode`: Canonical, Reflective, Mythopoetic, or Mixed.
2. `claim_permission`: what the output may assert.
3. `source_permission`: what source classes it may use.
4. `memory_permission`: whether prior user/session material may influence the output.
5. `export_permission`: whether the output is public-safe, private-only, or needs review.
6. `revision_trigger`: what would require the output to be revised.

## Mode contract sketch

### Canonical

Allowed posture: evidence-bound, source-labeled, conservative.

May say:

- The source says X.
- The project spec defines Y.
- This requirement follows from documented structure.

May not say:

- The user is X.
- The symbol definitively means X.
- The system has proven X when it has only inferred it.

### Reflective

Allowed posture: context-aware, user-centered, revisable.

May say:

- Within the user's chosen symbolic frame, this may function as X.
- A repeated pattern candidate is visible.
- This reflection should be treated as inspectable, not authoritative.

May not say:

- This is clinically true.
- This is objectively proven.
- This private-context interpretation is public evidence.

### Mythopoetic

Allowed posture: creative, symbolic, explicitly non-evidentiary.

May say:

- As a mythic rendering, X becomes Y.
- This metaphor can be used as a design surface.
- This is generative symbolism, not an empirical claim.

May not say:

- This invented relation is documented fact.
- This creative synthesis should guide action without translation into requirements or tests.

### Mixed

Allowed posture: explicitly partitioned.

Mixed mode is permitted only when each segment carries its own claim label. A mixed output should not blur source-grounded statements with mythic synthesis.

## Evaluation criteria

A runtime output passes the Mode Integrity Contract if:

1. The mode is visible to the user.
2. The output's claims match the mode's allowed posture.
3. Any source-grounded claim names its source class.
4. Any personal-reflective claim is marked as revisable.
5. Any creative claim is marked as non-evidentiary.
6. Export status is explicit.
7. The user can see what would change the output.

A runtime output fails if:

1. It presents metaphor as evidence.
2. It presents private context as public proof.
3. It presents inference as confirmed fact.
4. It switches modes without labeling the switch.
5. It gives the user a polished answer without exposing boundary status.

## Implementation plan

1. Add a `mode_contract` object to the MC response schema.
2. Require every engine output to declare `mode`, `claim_status`, `source_status`, `privacy_status`, and `missingness`.
3. Add a pre-export check that blocks public export when a reflective or mythopoetic segment contains private payload or unsupported identity claims.
4. Add tests using deliberately ambiguous inputs where symbolic, evidentiary, and personal-reflective language compete.
5. Add UI badges for Canonical, Reflective, Mythopoetic, and Mixed sections.
6. Add revision logging when a claim changes mode or status.

## Research questions

- How should MC represent a user-selected mode versus a system-required safety mode?
- Can a single response contain multiple modes without increasing confusion?
- What UI treatment makes mode boundaries clear without making the interface feel sterile?
- When should Reflective mode require user confirmation before becoming memory?
- What tests best detect mode bleed before public export?

## Public-safe index tags

- mode-integrity
- epistemic-boundary
- symbolic-reflection
- claim-labeling
- runtime-governance
- export-safety
- evidence-hygiene

## Next link in the mind graph

This contract should connect to:

- Evidence Lane Firewall
- Source Boundary Matrix
- Memory Classification Gate
- Claim Promotion Ladder
- Consent Gradient Export Protocol
- Origin Classifier
- Revision Reason Ledger

Together these define the public-safe governance layer for MC's reflective engine.