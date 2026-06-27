# Publication Safety Gate

Revision note:

- Status: public-safe evaluation protocol.
- Revision reason: created because the GitHub Mind Learning Loop requires every recurring research output to pass a publication-safety test before being committed, and the Proof Status Ledger identifies evaluation tests for evidence collapse, over-symbolizing, over-literalism, action inflation, and privacy leakage as an immediate implementation need.
- Source status: synthesized from the GitHub Mind Learning Loop, Proof Status Ledger, Export Ingestion and Private Source Quarantine protocol, User State Entry Engine spec, Upload Batch 04 state/memory handling, and available private-context architecture signals.
- Claim status: evaluation design / publication discipline. This is not proof of runtime enforcement, external validation, or automated privacy scanning.
- Privacy status: public-safe abstraction only. No personal, household, health, animal-care, financial, location, relationship, credential, or raw transcript details are included.
- Missingness: no automated test runner, no repository-wide scanner, no CI enforcement, no red-team dataset, and no verified UI integration are included here.

## Purpose

The Publication Safety Gate decides whether a finding can be added to the public Mirror Cartographer repository.

It exists to prevent five collapses:

1. private-source leakage
2. claim inflation
3. symbolic evidence collapse
4. ungrounded action pressure
5. missingness erasure

## Required input labels

Every proposed public artifact must include:

- source status
- claim status
- privacy status
- missingness
- revision reason

If any label is missing, the artifact fails the gate.

## Pass categories

A finding may pass if it is converted into one of these forms:

- abstracted method
- source-boundary note
- product requirement
- research question
- evaluation criterion
- privacy-safe index
- implementation plan
- schema stripped of private content
- proof-gap note
- status-ledger entry

## Automatic fail categories

A finding fails if it includes:

- raw private transcript details
- account metadata
- private household details
- health or body specifics
- animal-care case specifics
- financial specifics
- location details
- relationship details
- credentials, tokens, secrets, or access instructions
- raw exported conversation text
- claims that a system is built when only designed
- medical, legal, financial, scientific, or deployment claims without evidence
- symbolic material presented as empirical proof
- missing or placeholder sources presented as confirmed sources

## Gate questions

Before publication, answer:

1. What is the public-safe unit being added?
2. What private material, if any, informed it?
3. Has private material been abstracted into method, schema, boundary, requirement, index, or test?
4. What source status supports the claim?
5. What claim status is being made?
6. What privacy status applies?
7. What remains missing?
8. Why is this revision being made now?
9. What would be false or unsafe to claim from this artifact?
10. What is the next executable action?

## Scoring rubric

Score each proposed artifact from 0 to 2.

### 1. Source labeling

0: no source status

1: source type is named but incomplete

2: source status is explicit and bounded

### 2. Claim control

0: overclaims capability or proof

1: partially separates built, designed, inferred, symbolic, or missing

2: accurately labels claim type and avoids inflation

### 3. Privacy safety

0: exposes private details

1: mostly abstracted but still contains unnecessary private specifics

2: fully public-safe abstraction

### 4. Missingness honesty

0: hides gaps or blockers

1: names some gaps

2: names missing source, implementation, validation, or runtime proof clearly

### 5. Execution value

0: adds language without build/test/reconciliation value

1: useful framing but unclear next action

2: creates a test, schema, issue, index, implementation plan, or ledger update

## Pass threshold

A public artifact passes if:

- total score is 8 or higher out of 10
- privacy safety score is 2
- claim control score is at least 1
- missingness honesty score is at least 1

If privacy safety is 0, the artifact fails automatically.

If claim control is 0, the artifact must be rewritten before publication.

## Output decision labels

Use one:

- publish
- publish after redaction
- convert to missingness note
- convert to private-source boundary
- convert to implementation backlog
- reject from public repo

## Test cases

### Test case 1: Raw transcript quote

Finding:

A private conversation line appears useful for explaining system intent.

Decision:

Reject from public repo or convert to abstracted method.

Reason:

Raw transcript details are not needed to prove architecture.

### Test case 2: Placeholder ritual source

Finding:

A ritual phrase filename exists, but the file contains only placeholder content.

Decision:

Convert to missingness note.

Reason:

The file proves source expectation, not confirmed ritual content.

### Test case 3: Designed intake engine

Finding:

The User State Entry Engine defines resonance, tone, route, consent, and optional memory fields.

Decision:

Publish as product requirement or implementation plan.

Reason:

It is design architecture, not runtime proof.

### Test case 4: Private body-signal spreadsheet

Finding:

A private tracker suggests useful interface fields.

Decision:

Publish only a stripped schema or boundary note.

Reason:

The data itself is private; the abstract interface pattern may be public-safe.

### Test case 5: Capability claim

Finding:

A public document says Mirror Cartographer can perform a live behavior that has not been tested in the current repo/deploy state.

Decision:

Convert to missing runtime verification note.

Reason:

Capability claims require inspectable code, live behavior, or test output.

## Minimal publication template

Use this template before committing a public-safe finding:

- Proposed unit:
- Public form:
- Source status:
- Claim status:
- Privacy status:
- Missingness:
- Revision reason:
- Unsafe claim avoided:
- Next executable action:
- Gate score:
- Decision:

## Implementation plan

1. Add this gate to recurring research run procedure.
2. Add a checklist to pull-request or commit notes.
3. Convert the rubric into a small script or CI check.
4. Create red-team examples for privacy leakage and claim inflation.
5. Connect pass/fail results to the Proof Status Ledger.
6. Add UI-facing status labels after runtime behavior is verified.

## Research questions

1. Does requiring public-safety scores reduce private-source leakage in long-context AI-assisted projects?
2. Which source-status labels best prevent conceptual material from being mistaken for built software?
3. Can missingness labels improve trust without making a project look weaker than it is?
4. What is the minimum gate needed before publishing AI-derived architecture notes?
5. Can this rubric be automated without losing judgment about context and abstraction?

## Search terms

Mirror Cartographer publication safety gate, public-safe evaluation protocol, source status, claim status, privacy status, missingness, claim inflation, symbolic evidence collapse, privacy leakage, export quarantine, GitHub Mind Learning Loop.