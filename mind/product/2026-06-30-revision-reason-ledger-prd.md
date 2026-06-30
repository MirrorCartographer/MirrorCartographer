# PRD: Revision Reason Ledger

Status: public-safe product requirement
Source status: repository README, abstracted MC architecture notes, fresh public memory/RAG/security research
Claim status: product requirement; not a completed implementation claim
Privacy status: sanitized; no private source content
Missingness: runtime not implemented; UI not implemented; no reviewer study
Revision reason: product correction; MC needs a product-visible explanation layer for why public-safe artifacts change

## Problem

Mirror Cartographer produces public artifacts from mixed source classes: public repo files, public research, synthetic fixtures, abstracted file-library patterns, and private-context architecture pressure.

Without a revision reason ledger, a public artifact may look clean while hiding important uncertainty:

- Was the claim narrowed because evidence was weak?
- Was language changed because it risked overreach?
- Was something removed for privacy?
- Was the artifact superseded by a better source?
- Was missingness discovered later?

A reader should not need private context to understand public movement.

## Goal

Create a public-facing revision layer that records why an artifact changed while excluding private details.

## Non-goals

- Do not publish private source material.
- Do not create a raw transcript index.
- Do not imply complete archive coverage.
- Do not claim empirical product efficacy without tests.
- Do not expose secrets, credentials, screenshots, accounts, personal situations, household material, health material, animal-care material, financial material, location material, or relationship material.

## User stories

### Public reviewer

As a public reviewer, I want to know why an artifact changed so I can judge whether the update reflects evidence, safety, privacy, scope, implementation, terminology, missingness, or supersession.

### Builder

As a builder, I want a standard field set so future MC research runs do not generate redundant boundary language when they should record a specific revision reason.

### Evaluator

As an evaluator, I want to verify that a public artifact does not use private recurrence as proof, does not overclaim public support, and names what remains missing.

## Functional requirements

1. Every new mind artifact SHOULD include a revision metadata block.
2. Every material update MUST include a revision reason.
3. Revision reasons MUST use a controlled vocabulary.
4. Private-source influence MUST be described only as source class or architecture pressure.
5. Public evidence MUST be separated from private-context design pressure.
6. Superseded artifacts MUST remain historically visible unless they expose private data.
7. A blocked artifact MUST be documented as blocked in the response or a safe index entry, not forced into GitHub.
8. Missingness MUST be explicit when source coverage, implementation state, or evaluation coverage is incomplete.

## Required metadata fields

- source status
- claim status
- privacy status
- missingness
- revision reason
- dependency/supersession relation
- blocked details category

## UX requirements

The ledger should be readable in two layers:

- Compact header: source / claim / privacy / missingness / revision reason
- Expanded audit: source-boundary note, excluded detail categories, dependencies, supersession, review requirement

## Evaluation requirements

An artifact fails if:

- A private source path can be reconstructed.
- A claim depends on uncited, private, or missing evidence.
- A revision reason is vague, emotional, or purely aesthetic where a safety/proof reason is required.
- Missingness is hidden.
- Source status and claim status conflict.
- Private recurrence becomes public proof.

## Implementation phases

### Phase 1: Markdown convention

Add revision metadata blocks to new mind artifacts.

### Phase 2: Schema index

Store revision records in a structured folder and link them to artifact paths.

### Phase 3: Validation script

Add a simple validator that checks controlled values and prohibited fields.

### Phase 4: UI display

Expose revision status in any future public proof packet or artifact browser.

## Acceptance criteria

- A reviewer can identify why an artifact changed in less than one minute.
- The artifact can be understood without private context.
- The artifact cannot be reverse-engineered into private source details.
- Missingness is visible.
- Claim scope does not exceed evidence scope.

## Public-safe product sentence

Mirror Cartographer should not only publish artifacts. It should publish the public-safe reason each artifact was allowed to become what it is.
