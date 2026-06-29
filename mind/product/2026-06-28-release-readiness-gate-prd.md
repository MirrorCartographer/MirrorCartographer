# PRD — Release Readiness Gate

Status labels

- Source status: derived from MC public-safe research direction, existing implementation-pack patterns, and current external research alignment.
- Claim status: product requirement draft.
- Privacy status: public-safe; no raw transcript or private-source details.
- Missingness: no UI, backend, CI rule, or reviewer workflow exists yet.
- Revision reason: created because MC needs a practical gate that decides when artifacts can move from mind/research into public demo, website, sales, or external review.

## Problem

MC can generate strong artifacts faster than it can safely validate them.

Without a release gate, the repository risks two failures:

1. overclaiming speculative work as proven infrastructure,
2. hiding useful public-safe methods because review feels ambiguous.

The product needs a repeatable crossing procedure.

## Product goal

Create a release-readiness layer that reviews any artifact before it is presented as public, demo-ready, buyer-facing, grant-facing, research-facing, or implementation-ready.

## Primary users

- MC builder maintaining the GitHub mind
- reviewer inspecting public-safe artifacts
- future collaborator deciding what is safe to cite or extend
- product builder choosing what should enter the app
- evaluator checking whether MC claims are evidence-bounded

## Core workflow

1. Select artifact.
2. Fill `ReleaseReadinessRecord`.
3. Check source boundary categories.
4. Assign claim status.
5. Compare claim status to evidence lane.
6. State utility claim.
7. State missingness.
8. State authority boundary.
9. State misuse risk and mitigation.
10. Choose gate outcome.
11. Move artifact to correct release lane.

## Release lanes

### Internal mind

For living speculative research.

### Public-safe method

For reusable abstract methods without private leakage.

### Public-safe fixture

For synthetic examples that show behavior.

### Demo-ready

For artifacts that can be shown to outsiders without explanation overload.

### Buyer-facing

For artifacts attached to a clear offer, boundary, and measurable value.

### Research-facing

For artifacts with citations, limitations, and falsification routes.

## Required UI components

### Boundary checklist

A compact checklist showing blocked source categories.

### Claim strength selector

A required selector that prevents unlabeled authority.

### Evidence lane selector

A required selector that shows what support exists.

### Missingness box

A required plain-language field.

### Authority boundary box

A required field that states what the artifact cannot do.

### Gate outcome badge

Visible output badge:

- Release ready
- Release with warning
- Hold for fixture
- Hold for evidence
- Private only
- Discard/archive

## Non-goals

- It does not decide whether an idea is emotionally meaningful.
- It does not certify truth.
- It does not replace legal, medical, veterinary, clinical, financial, or professional review.
- It does not expose private source material for review.

## Acceptance criteria

A first implementation passes if:

- every reviewed artifact receives a structured release state,
- no blocked private category appears in public output,
- speculative claims are not labeled as tested claims,
- missingness is visible,
- authority boundary is visible,
- reviewer can tell why the artifact crossed or why it was held.

## Key phrase

A release gate is not a brake on imagination.

It is the bridge that lets imagination cross without smuggling authority.
