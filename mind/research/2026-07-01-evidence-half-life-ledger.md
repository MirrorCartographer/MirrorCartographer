# Evidence Half-Life Ledger

## Core finding
A claim does not stay safe because it was once bounded. It stays safe only while its evidence, source boundary, privacy boundary, and user feedback state remain current enough for the claim it is asked to carry.

## Public-safe source boundary

- Source status: derived from public repository README, public-safe uploaded MC architecture summaries, saved architectural context, and fresh public research on persistent AI memory governance.
- Claim status: design-method proposal, not validated product behavior.
- Privacy status: public-safe abstraction only. No private transcript, household, health, animal-care, financial, location, relationship, credential, or raw identity material is included.
- Missingness: no full raw conversation export, no production telemetry, no independent user study, no live memory database audit, and no complete repository-wide code audit in this run.
- Revision reason: prior MC mind updates focused on admission, custody, abstraction, and source survivability. This update adds temporal decay: when a previously admitted claim must be refreshed, downgraded, quarantined, or removed.

## Problem
Mirror Cartographer already requires source status, claim status, evidence boundary, update hooks, and user feedback. The missing public-safe layer is an explicit time-validity model. Without it, a claim can be correctly bounded at first publication yet become misleading later through stale evidence, changed user intent, superseded requirements, outdated research, or a privacy boundary that no longer holds.

## Rule
Every reusable MC claim should carry an evidence half-life: the interval after which the claim may still be retained, but may not be reused at the same authority level until it is checked against its source, privacy status, and revision reason.

## Evidence half-life classes

| Class | Description | Default action when expired |
|---|---|---|
| Stable doctrine | Normative MC rule, such as separating metaphor from diagnosis | retain, review yearly |
| Product requirement | Interface or architecture requirement | refresh before implementation claim |
| Research-supported claim | Claim tied to public papers or current field state | refresh before citation or external-facing use |
| Repository status | Claim about built/demo/deployed state | refresh before publishing |
| User preference / consent boundary | Claim about what is allowed to persist, display, or export | refresh before reuse |
| Evaluation result | Test score, audit result, or benchmark output | refresh before comparative claim |
| Private-derived abstraction | Public-safe rule inferred from private context | keep abstraction, never expose source, re-check privacy on every reuse |

## MC implementation requirement
A public MC artifact should include:

1. `source_status`
2. `claim_status`
3. `privacy_status`
4. `evidence_half_life`
5. `last_checked`
6. `refresh_trigger`
7. `downgrade_rule`
8. `revision_reason`

## Downgrade ladder

1. verified claim
2. current but limited claim
3. stale but retained context
4. hypothesis only
5. private-derived architecture note
6. quarantined / do not reuse
7. removed from public index

## Public-safe example

Bad: “MC has solved long-term symbolic memory.”

Better: “MC has a public design requirement for long-term symbolic memory with source, claim, evidence, and feedback boundaries. Implementation status must be verified before product claims are made.”

## Research connection
Current AI-memory work treats persistent memory as a governance problem, not passive storage. Recent papers emphasize memory poisoning, privacy-preserving memory, provenance, temporal validity, contradiction handling, and stale or zombie memory risk. MC should treat those as direct design pressure for its own public memory layer.

## Testable evaluation question
Can MC preserve continuity across sessions while automatically downgrading stale, private-derived, unsupported, or over-broad claims before they become public-facing assertions?

## Key phrase
Do not only ask whether the claim was once true. Ask whether the claim is still allowed to speak.
