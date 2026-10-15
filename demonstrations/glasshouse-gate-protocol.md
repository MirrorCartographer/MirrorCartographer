# Glasshouse Gate Research Protocol

Status: proposed specimen; not merged.

## Purpose

Project 101 already lists The Private/Public Split (#019), and the UI repository has a PublicSafeAbstractionIndex research specification. This specimen makes that existing idea visible; it does not replace the existing architecture.

Companion UI path: `public/glasshouse-gate.html` in the UI repository.

## Research question

Can an interaction show how a source-bound story becomes a reusable method while preserving the boundary between symbolic meaning and factual claims?

## Procedure

The visitor sees a fictional creative note and selects four transformations: generalize identifying detail, remove unnecessary context, convert the story into a method, and label the claim at the appropriate evidence level.

The state stays blocked until all four are selected. Completion means only “ready for human review”; it never means published or automatically safe. Reset returns to the blocked state.

## Invariants

- Synthetic example only; no user text entry.
- No network calls or saved state.
- The source story is not copied into the public-method output.
- Symbolic interpretation is not presented as evidence about a real person.
- Human review remains required before real publication.

## Reproducible test

From the UI repository:

`npx playwright test tests/glasshouse-gate.spec.js --reporter=line`

The test covers blocked and review states, partial completion, reset, external requests, browser storage, narrow viewports, reduced-motion preference, and semantic landmarks. It is committed but has not yet been observed running.

## What remains unproven

The specimen does not prove that a real release is safe, that visitors understand the boundary, or that abstraction preserves every useful detail. It does not implement a full release workflow.

Before merge: run the browser test, review keyboard and screen-reader behavior, challenge the method with synthetic edge cases, and record actual results.

## Repository boundary

The UI repository owns the interactive experience. This repository owns the research question, review criteria, and proof limitations.
