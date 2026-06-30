# PRD: Missingness-First Index Layer

Date: 2026-07-01
Status: public-safe product requirement
Privacy status: publishable abstraction
Revision reason: Added because MC needs not only source labels and claim labels, but a visible absence layer that prevents partial archive fragments from masquerading as complete continuity.

## Problem

Reflective AI systems can become overconfident when they retrieve a relevant fragment. The fragment may be real but incomplete, private, stale, generated, contradicted, or unsuitable for the present claim.

A public Mirror Cartographer artifact must therefore show missingness before synthesis becomes authority.

## User need

A user, collaborator, reviewer, or evaluator needs to know:

- what was found,
- what was not found,
- what was not safe to publish,
- what source class shaped the result,
- what claim class the result may carry,
- and what would change the output.

## Non-goals

- Do not expose private source content.
- Do not publish raw transcripts.
- Do not imply complete archive access.
- Do not use missingness language to create artificial mystery or authority.
- Do not replace evidence with narrative coherence.

## Core feature

Add a Missingness-First Index strip to public-facing research notes, reflection cards, and evaluation artifacts.

Visible fields:

1. Source status
2. Claim status
3. Privacy status
4. Missingness status
5. Revision reason
6. Next safe action

## User story

As a reviewer, I can inspect a Mirror Cartographer artifact and immediately know whether it is public-source-backed, private-context-shaped, speculative, incomplete, stale, or blocked.

## Functional requirements

- The system must classify source status before generating final wording.
- The system must classify privacy status before saving or publishing.
- The system must classify missingness status before any claim is promoted.
- The system must require a revision reason when a claim is weakened, redacted, promoted, or quarantined.
- The system must preserve public-safe abstraction while preventing reconstruction of sensitive origin details.

## Product copy

Recommended UI phrase:

This artifact is shaped by bounded context. It shows what can be claimed, what cannot be claimed, and what remains missing.

## Acceptance criteria

- No public artifact depends on private details to make sense.
- No public artifact implies access to a complete private archive.
- Every public research artifact includes source, claim, privacy, missingness, and revision labels.
- Any artifact using private context uses only abstract architecture language.
- A reviewer can identify the boundary without asking the author.

## Failure modes

- Partial retrieval becomes totalized memory.
- Private architecture context leaks through examples.
- Generated synthesis is mistaken for discovered evidence.
- Symbolic resonance is treated as factual proof.
- Missingness is omitted because the artifact sounds coherent.

## MVP implementation

Add a small markdown block to each public artifact:

- Source status:
- Claim status:
- Privacy status:
- Missingness:
- Revision reason:
- Next safe action:

## Stronger implementation

Represent the same block as structured metadata in the app state, then render it visually in the reflection card and export artifact.
