# Mode Handoff Protocol

## Core finding

Mirror Cartographer needs a **Mode Handoff Protocol**: a required transition layer for moving material between reflective, symbolic, canonical, implementation, evaluation, safety, and public-facing modes without silently changing what the material is allowed to mean or prove.

Operating line:

**A mode change is an authority change. MC must make the handoff visible before the meaning moves.**

## Why this matters

MC already separates meaning from proof, resonance from evidence, and continuity from authority. The remaining gap is the moment when a reflection, symbol, pattern, requirement, or evaluation result changes mode.

A private symbolic reflection may become a product requirement. A product requirement may become an implementation ticket. An implementation ticket may become a public claim. A public claim may require external validation. Each transition changes the rules of evidence, privacy, acceptable language, review burden, and user consent.

Without an explicit handoff protocol, MC can accidentally launder authority by preserving the same wording while moving the object into a stronger lane.

## Public-safe source basis

- Source status: mixed public-safe project synthesis, uploaded MC field-guide material, uploaded continuity architecture notes, external-validation planning material, and current repository research notes.
- Claim status: design requirement and research hypothesis, not empirical validation.
- Privacy status: public-safe abstraction. No raw transcripts, personal details, household details, health details, animal-care details, financial details, location details, relationship details, credentials, or identifying private examples are included.
- Missingness: no implemented mode-transition schema yet; no UI prototype for handoff warnings; no evaluator study measuring whether users understand mode changes; no automated enforcement in repository code confirmed in this run.
- Revision reason: prior notes define custody, provenance, missingness, claim typing, evidence lanes, and revision reasons. This note adds the missing transition mechanism that governs the exact moment an object crosses from one mode to another.

## Required mode labels

Every durable MC object should declare its current mode before reuse:

1. Reflective mode
   - Holds personal or subjective meaning.
   - May support self-orientation.
   - Must not prove external facts.

2. Symbolic mode
   - Holds metaphor, image, atmosphere, dream, archetype, narrative, or resonance.
   - May support creative or interpretive exploration.
   - Must not become instruction without review.

3. Canonical mode
   - Holds source-grounded, cited, bounded, or user-confirmed facts.
   - May support structured summaries and product decisions.
   - Must preserve citation, source boundary, and uncertainty.

4. Product mode
   - Holds requirements, user stories, feature definitions, interface constraints, and acceptance criteria.
   - May guide build planning.
   - Must not pretend to be empirical proof.

5. Implementation mode
   - Holds code, schema, architecture, issue, migration, or deployment task.
   - May guide repository mutation.
   - Must include test expectation and rollback/failure surface.

6. Evaluation mode
   - Holds tests, metrics, adversarial questions, review packet status, and validation outcomes.
   - May promote, downgrade, or retire claims.
   - Must declare benchmark, reviewer, or evidence surface.

7. Safety mode
   - Holds risk, consent, privacy, escalation, misuse, overreach, and boundary constraints.
   - May override other modes when publication or persistence becomes unsafe.
   - Must say what it blocks and why.

8. Public mode
   - Holds publishable language, public-safe indexes, research questions, methods, diagrams, or implementation plans.
   - May be shared outside the private context.
   - Must be able to stand without exposing private source material.

## Handoff packet

Before an object changes mode, MC should generate a handoff packet with these fields:

- source mode
- target mode
- source boundary
- claim status before handoff
- claim status after handoff
- privacy status before handoff
- privacy status after handoff
- authority gained, lost, or unchanged
- wording changed or preserved
- evidence required in the target mode
- consent or review required
- missing context
- downgrade option
- rejection option
- revision reason

## Handoff rules

1. Reflective -> Symbolic
   - Allowed when the user wants metaphor, imagery, or meaning exploration.
   - Must preserve that the result is interpretive, not factual proof.

2. Symbolic -> Product
   - Allowed only after abstraction.
   - The product requirement must stand without the private symbolic story.

3. Reflective -> Canonical
   - Allowed only when confirmed, sourced, or explicitly user-stated as a factual project note.
   - Unsupported interpretation must be downgraded before entry.

4. Canonical -> Public
   - Allowed only with citation, uncertainty, and privacy review.
   - Private identifiers and raw transcript material must not cross.

5. Product -> Implementation
   - Allowed when the requirement has acceptance criteria and failure mode.
   - If no acceptance criteria exist, route to missingness.

6. Implementation -> Evaluation
   - Required before claiming the build works.
   - Test result must not exceed the actual test surface.

7. Any mode -> Safety
   - Always allowed.
   - Safety review can pause, quarantine, downgrade, or block persistence/export/publication.

8. Any mode -> Public
   - Allowed only after public-safe transformation review.
   - The public version must survive without private context.

## Interface requirement

MC should display a visible mode badge and a handoff badge whenever content is reused across modes.

Minimum visible fields:

- current mode
- previous mode, if transformed
- source boundary
- claim status
- privacy status
- allowed use
- review status

## Evaluation criteria

A Mode Handoff Protocol passes if an evaluator can answer:

1. What mode is this object currently in?
2. What mode did it come from?
3. Did its authority change?
4. Did its privacy status change?
5. What evidence is required now that was not required before?
6. What was removed, abstracted, cited, or downgraded?
7. What would block publication or persistence?
8. Can a user reject or contest the handoff?
9. Can the public output stand without the private source story?

## Research questions

- What mode labels are understandable to nontechnical users without weakening epistemic precision?
- How often do users need to see mode transitions before the interface becomes noisy?
- Can mode handoffs reduce false certainty in symbolic AI reflection systems?
- What handoff types need explicit consent versus automatic logging?
- How should MC visually represent authority loss, authority gain, and authority preservation?

## Product requirement

Add a `ModeHandoffPacket` schema and require it whenever stored content is reused outside its original mode.

Minimum schema fields:

- `sourceMode`
- `targetMode`
- `sourceBoundary`
- `preHandoffClaimStatus`
- `postHandoffClaimStatus`
- `preHandoffPrivacyStatus`
- `postHandoffPrivacyStatus`
- `authorityDelta`
- `evidenceRequirement`
- `reviewRequirement`
- `missingness`
- `revisionReason`
- `allowedPublicForm`
- `blockedUses`

## Failure mode prevented

The failure mode is **mode drift**: a piece of meaning begins as reflection, moves through product language, appears in implementation, and is later published as if it had always been evidence.

The handoff protocol prevents mode drift by forcing every transition to declare what changed, what did not change, what was lost, what gained authority, what needs evidence, and what must remain private.