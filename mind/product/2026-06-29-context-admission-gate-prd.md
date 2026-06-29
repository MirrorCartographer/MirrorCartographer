# Product Requirement: Context Admission Gate

Date: 2026-06-29
Status: public-safe PRD

## Problem

Mirror Cartographer can have many available context streams: current chat, saved context, uploaded files, GitHub materials, and external sources. Availability creates a governance problem. A context item may be semantically relevant but inappropriate for a specific artifact, especially when the artifact is public-facing.

Without a Context Admission Gate, MC can accidentally build a public-safe-looking artifact that was privately shaped by material that should not have influenced it.

## Product thesis

Before interpretation, MC should classify candidate context and decide whether each item is admitted, abstracted, held privately for safety only, excluded, or escalated for review.

## User value

- Safer public artifacts.
- Less accidental leakage.
- Better authorship and influence honesty.
- Clearer distinction between memory, evidence, interpretation, and publishable claim.
- Stronger trust in MC as a governed reflective system rather than an uncontrolled memory sponge.

## Functional requirements

1. Detect candidate context sources before generation.
2. Assign source status, claim status, privacy status, missingness, and revision reason.
3. Default sensitive private domains to exclude from public artifacts.
4. Allow private-context material only as abstract architecture, requirement, evaluation, or threat-model input.
5. Preserve admission decisions in a ledger.
6. Pass downstream obligations to release-readiness, redaction-fidelity, claim-transport, influence, and source-boundary systems.
7. Surface a public-safe summary of admitted source classes without reconstructing private material.
8. Provide a manual override path requiring explicit consent and revision reason.

## Non-functional requirements

- Conservative by default.
- Explainable to non-technical users.
- Compatible with screen readers.
- No raw private content in logs intended for public GitHub.
- Stable enough to audit across multiple runs.

## UI concept

Before export, show a compact boundary panel:

- Public sources used: yes/no.
- Private context used: none / abstract-only / restricted.
- Sensitive domains excluded: yes/no.
- Missingness: short note.
- Review needed: yes/no.
- Public-safe source summary: source classes only, not content.

## Acceptance criteria

A public artifact passes this gate only if:

- no restricted private content appears in output;
- no sensitive private domain shaped public claims beyond abstract methods or safety requirements;
- all admitted context has a documented source status, claim status, privacy status, missingness note, and revision reason;
- every source-bound public factual claim has a public citation or is marked missing/uncertain;
- symbolic interpretation remains labeled as interpretation, not proof.

## Failure modes

- Semantic similarity retrieves private context that should be excluded.
- A symbolic interpretation borrows authority from private memory.
- A public artifact omits private details but still reveals source shape too precisely.
- A release gate checks only final text and misses upstream influence.
- Missingness is hidden because the artifact feels coherent.

## Implementation plan

Phase 1: Markdown schema and manual checklist.
Phase 2: Add a pre-generation admission table in the MC artifact workflow.
Phase 3: Encode default deny rules for sensitive domains.
Phase 4: Connect the gate to source-boundary BOM and influence ledger.
Phase 5: Add test fixtures for allowed, abstract-only, private-reference-only, exclude, and needs-review cases.

## Revision reason

This PRD adds an upstream admission layer to the existing public-safe compiler stack. It exists because redaction and release review are too late if inappropriate context already shaped the artifact.
