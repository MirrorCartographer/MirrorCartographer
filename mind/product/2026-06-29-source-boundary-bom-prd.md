# Product Requirement: Source Boundary Bill of Materials

Date: 2026-06-29
Status: Public-safe PRD

## Problem

Mirror Cartographer can generate public-safe artifacts from mixed context, but public-safe redaction alone does not tell a reader how much of the artifact came from public sources, private architectural orientation, external research, inference, design judgment, or synthetic fixture construction.

Without a source-boundary layer, the system risks two failures:

1. leaking protected source material;
2. flattening the artifact so much that the method becomes unverifiable.

## Product goal

Add a Source Boundary Bill of Materials to public-facing MC artifacts.

The BOM should let a reader inspect the artifact’s evidence boundary without seeing private material.

## Non-goals

- Do not publish raw transcripts.
- Do not publish personal, household, health, animal-care, financial, location, relationship, credential, or identifying private details.
- Do not imply legal, clinical, therapeutic, veterinary, financial, or institutional authority.
- Do not treat user resonance as proof.
- Do not treat private context as public evidence.

## User stories

### Public reader

As a public reader, I want to know whether a claim is source-backed, inferred, speculative, or product-design guidance, so I can rely on it appropriately.

### Builder

As a builder, I want to transform private-context insight into safe implementation requirements without copying private details.

### Evaluator

As an evaluator, I want to see what was removed, what structure survived, and what missingness remains.

## Functional requirements

1. Every public artifact gets a BOM block or linked BOM record.
2. The BOM must label source status, claim status, privacy status, missingness, and revision reason.
3. The BOM must distinguish private context used for orientation from evidence used for public claims.
4. The BOM must list removed privacy categories without filling them in.
5. The BOM must include claim-mode permissions.
6. The BOM must identify release state: draft, candidate, released, blocked, or internal only.
7. The BOM must include a revision reason whenever an artifact is rewritten for privacy, accuracy, scope, or claim-boundary reasons.
8. The BOM must be readable without specialized jargon.

## Acceptance criteria

- A reviewer can identify the artifact’s public evidence boundary in under one minute.
- No protected private content appears in the BOM.
- Claim modes are explicit.
- Missingness is visible.
- Redaction does not erase the structural reason the artifact exists.
- A blocked artifact explains the blocker without forcing publication.

## Failure modes

- Privacy laundering: private evidence is hidden but still treated as public proof.
- Boundary theater: labels exist but do not clarify what shaped the artifact.
- Over-redaction: all meaningful structure is removed.
- Over-claiming: design inference is presented as validated fact.
- Missingness collapse: unknowns disappear from the public record.

## Public-safe release rule

A public artifact may cross only if the BOM can answer: what shaped this, what was removed, what survived, what can be claimed, and what is still missing?
