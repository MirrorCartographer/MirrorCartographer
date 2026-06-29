# PRD: Operationalization Boundary Gate

Date: 2026-06-29
Status: public-safe product requirement

## Problem

Mirror Cartographer outputs can begin as reflective symbolic maps but become operational when they tell a user what to do. Existing mode labels and uncertainty tags reduce interpretive drift, but they do not fully classify action-guidance risk.

## Goal

Add a pre-delivery and pre-publication gate that detects whether an output has crossed from reflection into operational instruction.

## Non-goals

- Do not build clinical, legal, financial, crisis, or professional authority into MC.
- Do not expose private source material to prove why a boundary fired.
- Do not flatten all symbolic language into sterile disclaimers.
- Do not block ordinary reflective prompts that merely invite noticing, journaling, or user-led interpretation.

## User story

As a user, I can receive symbolic reflection without accidentally treating it as a command, diagnosis, or external-world authority.

As a reviewer, I can inspect whether an MC artifact stayed reflective or became action-guiding without seeing private source material.

## Functional requirements

1. Assign every output an `operationalization_level` from O0 to O5.
2. Detect imperatives and action-shaping language.
3. Detect high-risk domains: medical, legal, financial, safety, employment, relationship, animal-care, crisis, identity, privacy, and public release.
4. Distinguish reversible low-risk suggestions from consequential recommendations.
5. Rewrite O3 outputs into options, not orders.
6. Deflect O4 outputs away from professional substitution and toward qualified sources or source-grounded information.
7. Block or rewrite O5 outputs.
8. Include public-safe labels for source status, claim status, privacy status, missingness, and revision reason.
9. Preserve the symbolic signal where safe; do not erase meaning unnecessarily.
10. Log why a boundary fired without exposing protected source material.

## Output badges

- `Reflection Only`
- `Attention Prompt`
- `Low-Risk Option`
- `Consequential Suggestion — Review Needed`
- `Domain Authority Risk — Deferral Required`
- `Blocked/Rewritten for Safety`

## Rewrite patterns

### Order to option

Bad: “You need to confront them.”

Better: “One possible interpretation is that this pattern points toward a conversation. Treat that as a hypothesis, not an instruction.”

### Diagnosis to boundary

Bad: “This symbol means trauma.”

Better: “This symbol can be mapped as distress, protection, or memory-pressure in a reflective sense. It is not a diagnosis.”

### Authority to source lane

Bad: “The system says this is the right move.”

Better: “The map is highlighting one possible route. External decisions need evidence, context, and your own agency.”

## Acceptance criteria

- A reviewer can see the operationalization level on every artifact.
- O4 and O5 outputs cannot be published without either rewrite, deferral, or explicit block reason.
- The system never relies on resonance as proof of action-worthiness.
- Public artifacts show boundary conditions without private details.
- The gate can be regression-tested with synthetic fixtures.

## Source status

Mixed abstracted source basis: public-safe MC specifications, private-context architecture used only as structural understanding, and current external research on appropriate reliance and overreliance.

## Claim status

Inferred design requirement supported by existing MC architecture and current human-AI reliance research.

## Privacy status

Public-safe. No raw transcript or protected personal-source details included.

## Missingness

No live UI implementation, user testing, professional domain review, or complete legal analysis yet.

## Revision reason

Adds a missing safety/product layer between symbolic reflection and external-world action.
