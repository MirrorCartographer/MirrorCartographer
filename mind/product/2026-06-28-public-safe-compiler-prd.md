# Product Requirement — PublicSafeCompiler

Status labels

- Source status: derived from current MC architecture review and fresh research alignment around provenance, uncertainty, and human-AI co-creation evaluation.
- Claim status: product requirement draft.
- Privacy status: public-safe; contains no raw private source material.
- Missingness: no UI, API, database schema, or tests yet. Requires fixture implementation.
- Revision reason: created because MC needs a repeatable mechanism for converting private-context understanding into public-safe research artifacts.

## Problem

MC uses private, dense, symbolic, and emotionally complex interaction to understand architecture.

But public GitHub artifacts must not expose private context.

Without a compiler, public artifacts risk two opposite failures:

1. Too much exposure: private material leaks into the public record.
2. Too much flattening: the public artifact becomes vague, generic, and useless.

## Goal

Build a compiler that transforms sensitive or private-context insight into public-safe research objects with explicit boundary labels.

## Non-goals

- Do not preserve raw private text.
- Do not infer diagnosis, treatment, or personal facts.
- Do not create public artifacts that require private details to be meaningful.
- Do not pretend abstraction preserves everything.

## User stories

### Researcher

As a researcher, I want to see how MC turns dense AI interaction into public-safe methodology so I can inspect the process without seeing private material.

### Builder

As a builder, I want a repeatable release checklist so I can publish stronger artifacts without leaking sensitive context.

### Reviewer

As a reviewer, I want source, claim, privacy, missingness, and revision labels so I can know how much confidence to place in the artifact.

## Required output fields

- public_safe_title
- abstracted_finding
- source_status
- claim_status
- privacy_status
- missingness
- revision_reason
- source_classes_used
- withheld_material_categories
- transformed_structure
- lost_structure
- claim_rung
- allowed_use
- not_allowed_use
- evaluation_questions
- falsification_or_shrink_condition
- next_test

## Compiler stages

### Stage 1 — Intake classification

Classify input as:

- public source
- private chat context
- uploaded file
- saved context
- GitHub artifact
- synthetic fixture
- fresh web research

### Stage 2 — Boundary filter

Remove or generalize disallowed categories:

- personal details
- household details
- health details
- animal-care details
- financial details
- location details
- relationship details
- credential details
- raw transcript fragments

### Stage 3 — Structure extraction

Extract only method-level structures:

- pattern
- schema
- research question
- product requirement
- evaluation criterion
- source-boundary note
- implementation plan

### Stage 4 — Claim ladder

Assign claim rung:

- metaphor
- hypothesis
- prototype seed
- testable claim
- product claim
- public claim

### Stage 5 — Release packet

Generate public artifact with required labels.

## Acceptance criteria

- No disallowed category appears in generated public artifact.
- Every artifact includes source status, claim status, privacy status, missingness, and revision reason.
- Every artifact names at least one lost or withheld structure.
- Every artifact names a next test.
- Artifacts are still specific enough to be useful to an outside researcher.

## Evaluation plan

Use synthetic sensitive fixtures.

For each fixture:

1. Create raw private-like input.
2. Run compiler manually or programmatically.
3. Score leakage risk.
4. Score preserved method value.
5. Score claim-label accuracy.
6. Score usefulness to a researcher.

## Open question

Can MC preserve enough signal after removing all private specificity?

That is the product test.
