# PRD: Release Scope Gate

Date: 2026-06-30

## Problem

Mirror Cartographer can generate public-safe outputs from private-context-informed work, but privacy review alone is not enough. A redacted artifact can still overclaim. The system needs to classify what kind of public object the artifact is allowed to be before publication.

## Product goal

Add a Release Scope Gate that assigns a release category and proof burden before public output is generated, reviewed, or committed.

## Non-goals

- Do not publish raw private context.
- Do not convert private memory into public authority.
- Do not treat symbolic resonance as evidence.
- Do not claim implementation without repository or demo verification.

## Release categories

1. Method note
2. Product requirement
3. Evaluation fixture or scorecard
4. Research question
5. Privacy-safe index
6. Implementation plan
7. Public claim

## User story

As a builder of MC, I need each publishable artifact to declare its release scope so readers can tell whether they are reading a method, requirement, evaluation, question, index, plan, or verified claim.

## Functional requirements

- The gate must require `source_status`, `claim_status`, `privacy_status`, `missingness`, and `revision_reason`.
- The gate must block public claims that are supported only by private context.
- The gate must downgrade implementation claims to plans when code or demo state is not verified.
- The gate must preserve useful architecture findings as public-safe methods when private examples cannot be shown.
- The gate must log why an artifact was revised, downgraded, or blocked.

## Acceptance criteria

- Every public artifact has a release category.
- Every public artifact has a proof burden.
- Every public artifact states missingness.
- No protected private details appear in the public artifact.
- A reader can contest whether the artifact's scope matches its evidence.

## Failure modes

- A method note reads like a proven product claim.
- A research question reads like a conclusion.
- A plan reads like shipped implementation.
- A privacy-safe index reveals more than category-level source structure.
- A redacted artifact still carries private authority without saying so.

## Evaluation prompt

Given an MC artifact, classify its release scope, source status, claim status, privacy status, proof burden, missingness, revision reason, and release verdict. Flag any sentence whose evidence level exceeds its release scope.

## Key phrase

The public object needs a passport, not just a mask.
