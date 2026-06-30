# PRD: Private-to-Public Distillation Gate

Date: 2026-07-01

## Problem

Mirror Cartographer uses long-context reflective material to discover architecture. That creates a publication risk: private context may help identify a useful system rule, but the private source itself must not become part of the public artifact.

## Product goal

Create a gate that converts private-derived architecture signal into public-safe methods, schemas, requirements, research questions, evaluation criteria, indexes, or implementation plans.

## Non-goals

- Publishing raw transcripts.
- Publishing personal source examples.
- Revealing protected source domains.
- Treating recurrence as evidence.
- Treating memory retrieval as authority.

## User story

As an MC builder or reviewer, I need to know why a public artifact exists, what source classes shaped it, what was removed, what claim was downgraded, and what remains missing, without exposing private material.

## Functional requirements

1. Every public artifact created from private-context research must include source status, claim status, privacy status, missingness, and revision reason.
2. The system must classify private context only at broad architecture-signal level.
3. The system must reject artifacts that include raw private details or protected-domain clues.
4. The system must downgrade unsupported claims before publication.
5. The system must preserve a public-safe revision trace.
6. The system must distinguish public repository evidence from private architecture influence.

## UX requirements

- Show a compact gate summary before publication.
- Use plain labels: source, claim, privacy, missingness, revision reason.
- Provide a reviewer-facing failure reason when publication is blocked.
- Make the safe abstraction visible without requiring the private source.

## Evaluation hooks

- Does the artifact work without the private source?
- Can a reviewer infer protected private details from it?
- Are claims downgraded when source support is weak?
- Are missingness and revision reasons visible?
- Is the artifact useful as architecture even after all private content is removed?

## Public-safe output types

Allowed:

- methods
- schemas
- product requirements
- research questions
- evaluation criteria
- privacy-safe indexes
- implementation plans

Blocked:

- personal facts
- household facts
- health or animal-care facts
- financial facts
- location facts
- relationship facts
- credential details
- raw transcript details
- private examples that reveal source domain
