# Product Requirement: Interpretive Debt Ledger

## Public-safe status

- Source status: Public-safe product requirement derived from MC governance architecture and current AI accountability research.
- Claim status: Product requirement proposal.
- Privacy status: Public-safe. No private examples, raw transcripts, or sensitive operational details.
- Missingness: Requires implementation design, UI testing, storage policy, and release-gate integration.
- Revision reason: Adds the missing review layer between interpretation generation and public or persistent artifact use.

## Problem

MC can produce high-value interpretations that feel coherent before they are sufficiently verified. Without a ledger, those interpretations can silently migrate into product copy, public artifacts, user profiles, research claims, or evaluation language.

## Product goal

Make every materially influential interpretive move reviewable, bounded, and revisable without exposing private source material.

## User value

The user can see the difference between:

- what the system knows,
- what it inferred,
- what it symbolized,
- what it speculated,
- what is missing,
- what cannot be used as authority yet.

## Core interaction

For each generated artifact, MC should be able to show an Interpretive Debt panel:

1. Interpretive move: what changed from input to output.
2. Claim mode: fact, inference, symbol, speculation, requirement, research question, evaluation criterion, implementation plan.
3. Source boundary: public, private-context-derived, mixed, synthetic, unknown.
4. Missingness: what was not checked.
5. Reliance boundary: what this may and may not be used for.
6. Repayment action: what would make the claim safer, clearer, or stronger.

## Functional requirements

- Create an InterpretiveDebtRecord whenever an artifact includes a nontrivial interpretation.
- Require claim mode labeling before persistence or public release.
- Require privacy status labeling before public release.
- Require missingness labeling when source material is partial, chunk-based, private, unverified, or inferred.
- Allow debt to be reduced, repaid, retired, escalated, or blocked.
- Connect debt records to release readiness gates.
- Connect debt records to source-boundary bills of materials and claim transport ledgers.
- Preserve public-safe abstraction when private sources shaped the output.

## Nonfunctional requirements

- Low-friction enough that it does not destroy the reflective flow.
- Visible enough that it prevents hidden authority drift.
- Accessible to screen readers.
- Works without code-box-only essential instructions.
- Supports export as Markdown, JSON, and human-readable audit summary.

## UI requirement

The ledger should not look like punishment. It should look like an instrument panel.

Suggested labels:

- Assumed
- Inferred
- Symbolized
- Missing
- Not allowed to decide
- Review needed
- Safe to use for

## Release rule

An artifact is not release-ready if it contains high-risk unpaid interpretive debt and the user-facing output does not expose that debt in a clear, accessible way.

## Out of scope

- Automated truth certification.
- Diagnosis or treatment validation.
- Legal, financial, medical, veterinary, or credential verification.
- Revealing private source context in public artifacts.
