# Contestability Receipt Layer

## Source status

- Source class: private-context-informed architecture synthesis plus public repository review.
- Public repository anchor: `README.md` describes Mirror Cartographer as a bounded symbolic reflection interface with source status, claim status, audit labels, overreach checks, evidence boundaries, user feedback loops, and explicit safety boundaries.
- File-library anchor: public-safe implementation materials describe a recursive symbolic cognition interface with `ENTRY -> FIELD -> RECURSION -> RETURN`, mode rules, resonance feedback, contradiction logs, and exportable artifacts.
- External research anchor: 2026 AI-memory and trustworthy-memory research treats retrieval and persistent memory as trust boundaries rather than neutral personalization utilities.

## Privacy status

Public-safe. This note contains no raw transcript detail, personal biography, household detail, health detail, animal-care detail, financial detail, private location detail, relationship detail, credentials detail, private filenames beyond public-safe project artifact classes, or unverifiable personal claims.

## Claim status

- Confirmed from public repo: MC already uses source-status and claim-status labels, evidence boundaries, overreach checks, and user feedback loops.
- Confirmed from public-safe project materials: MC already has mode separation, contradiction logging, resonance feedback, and exportable session/state concepts.
- Inference: if MC artifacts can persist, export, or become public-facing, every generated claim needs a later correction/contest/retirement path.
- Design proposal: add a `ContestabilityReceipt` as a small, durable record attached to any reflection, evaluation artifact, public-safe summary, or exported claim.

## Core finding

A boundary is incomplete if only the system can apply it. MC needs a visible contestability layer so users, reviewers, maintainers, or downstream readers can say: this is wrong, too strong, stale, too private, under-sourced, misleading, over-symbolic, over-authoritative, or no longer authorized.

## Why this is different from previous layers

Existing layers answer adjacent questions:

- Context Admission Gate: what may enter generation?
- Context Quarantine Layer: what is relevant but not admissible?
- Claim Transport Ledger: what claim survived the crossing?
- Source Boundary BOM: what kinds of sources shaped it?
- Temporal Validity Ledger: is the context still current?
- Release Readiness Gate: may this artifact cross into public use?

Contestability Receipt answers a later and more operational question:

> Once a claim exists, how does it remain correctable without exposing its source?

## Product requirement

Every durable MC claim should ship with a contestability receipt containing:

1. claim identifier
2. artifact identifier
3. claim mode: fact, inference, symbolic interpretation, speculation, product requirement, evaluation criterion, research question, implementation plan
4. source boundary class: public, private-context-informed, user-provided-public, external-research, repository-derived, synthetic-fixture
5. current release status: draft, reviewable, public-safe, public-released, retired, superseded, blocked
6. allowed challenge types
7. challenge channel or workflow
8. required reviewer action
9. possible outcomes: preserve, clarify, downgrade, split, redact, retire, supersede, delete from public artifact
10. revision reason
11. missingness note
12. privacy recheck result
13. timestamp or version marker

## Public-safe implementation plan

- Add a receipt generator to the reflection/export path.
- Add receipt rendering beside public-facing artifact summaries.
- Add a challenge form or issue-template equivalent for public repo artifacts.
- Add evaluation tests that attempt to dispute claims across all claim modes.
- Add refusal behavior: if a challenge contains private source material, strip/private-route it before public review.

## Evaluation criteria

A valid Contestability Receipt must:

- make the claim challengeable without revealing the private source;
- separate correction of the public claim from exposure of private evidence;
- allow downgrade without deletion when the claim remains useful but overstrong;
- preserve meaningful revision reasons;
- distinguish disagreement from privacy violation;
- distinguish stale context from false context;
- prevent symbolic resonance from hardening into authority;
- record what changed and why;
- keep missingness visible;
- support accessibility/readability outside code-only presentation.

## Missingness

- No current evidence in the inspected public README that a dedicated contestability receipt exists.
- GitHub code search did not return indexed results for prior `mind/` artifacts during this run, so this layer may overlap with unpublished or unindexed materials.
- No live UI audit was performed in this run.

## Revision reason

Added because the architecture has strong boundary machinery before publication but needs an equally explicit after-publication correction path.

## Key phrase

A claim that cannot be contested is not bounded; it is only decorated.
