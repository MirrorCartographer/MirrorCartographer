# PRD: Attention Custody Ledger

Status: product requirement draft
Privacy status: public-safe

## Problem

Mirror Cartographer can label source status, claim status, privacy status, missingness, and release readiness. But a system can be shaped before it makes a claim. Private or saved context may influence what the model notices, what it ignores, what it treats as risky, and what it turns into a product requirement.

Without an attention custody layer, context can steer the map invisibly.

## Goal

Create a ledger that records attention influence at the level of context class and operation, not private source content.

## Non-goals

- Exposing private transcripts
- Reconstructing hidden sources
- Treating memory influence as factual evidence
- Making symbolic resonance into proof
- Claiming the current prototype already implements this feature

## Users

- Primary user reviewing a generated Mirror Cartographer artifact
- Builder auditing whether a public artifact is safe
- Researcher evaluating continuity and memory influence
- Reviewer checking overreach, hidden personalization, or source-boundary failure

## Core user story

As a reviewer, I need to see whether protected context influenced what the system paid attention to, without seeing the protected context itself, so I can decide whether the artifact is safe, honest, and contestable.

## Functional requirements

1. For each artifact, create an AttentionCustodyRecord.
2. Label source status, claim status, privacy status, missingness, and revision reason.
3. Record attention operation: prioritize, suppress, route, escalate boundary, soften tone, preserve contradiction, request missingness, downgrade claim, or block release.
4. Represent admitted and rejected context as classes only.
5. Link attention operation to affected layer.
6. Show whether the attention route changed the claim mode or release verdict.
7. Provide a contestability path: user can mark the route as wrong, too private, too vague, or useful.
8. Block public release when attention influence cannot be safely abstracted.

## UI requirements

Each artifact should include a compact public-safe boundary strip:

- Source influence: public-only | mixed | private-derived abstracted | blocked
- Attention route: what changed in focus
- Claim mode: fact | inference | symbolic | speculation | design proposal
- Missingness: what is not known
- Release status: safe | safe with labels | hold | blocked

## Data model

Use `mind/schemas/attention-custody-record-v0.md` as the first schema.

## Acceptance criteria

A reviewer can answer:

- What class of context influenced attention?
- Was that context allowed?
- Did it affect a claim, a boundary, a tone choice, or a release decision?
- What private source material was excluded?
- What is missing?
- Why was the record revised?
- Is the artifact safe to publish?

## Risk controls

- Never display raw private context in the ledger.
- Never treat private influence as public evidence.
- Downgrade confidence when custody is unclear.
- Require release hold when privacy status is blocked or do-not-release.
- Preserve contradictions rather than smoothing them into a false coherent story.

## Revision reason

Added because prior MC governance layers track source, claim, redaction, context admission, and release status, but do not yet explicitly record pre-claim attention steering.