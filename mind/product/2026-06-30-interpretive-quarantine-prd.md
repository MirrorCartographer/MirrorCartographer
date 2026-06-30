# PRD: Interpretive Quarantine Layer

Date: 2026-06-30
Status: public-safe product requirement
Source status: public repo alignment plus mixed-source privacy requirement
Claim status: product requirement and implementation plan
Privacy status: public-safe abstraction
Missingness: no implementation code included; no user study completed; no private examples included
Revision reason: adds a product layer before public indexes, memory admission, claim routing, and release gates

## Problem

Mirror Cartographer needs to use private or sensitive context to understand architecture pressure without letting that context leak into public artifacts or become unsupported evidence.

Current labels such as source status and claim status are necessary but not sufficient. A finding can be labeled and still retain private residue, overclaim, or require the private source path to make sense.

## Goal

Create an interpretive quarantine layer that converts private-context-inspired insights into public-safe artifacts only after abstraction, boundary labeling, missingness disclosure, and support checking.

## Non-goals

- storing raw private context
- publishing private examples
- making medical, psychological, legal, financial, veterinary, or emergency claims
- validating Mirror Cartographer as therapy
- proving personal claims
- reconstructing user history

## User-facing requirement

When a public artifact is derived from mixed or private context, the interface must state:

- what kind of source informed it
- what kind of claim it is
- whether it is public-safe
- what is missing or intentionally excluded
- why it was revised or added
- what the artifact may and may not be used for

## Functional requirements

1. Add a quarantine state to any public-boundary artifact.
2. Require source_status, claim_status, privacy_status, missingness, and revision_reason fields.
3. Block publication when private residue remains.
4. Block publication when the artifact cannot stand without the private source.
5. Require synthetic fixtures for any new method or gate.
6. Require public citations or repo citations for external support claims.
7. Allow private context to influence architecture only as abstracted pressure, not as public evidence.
8. Emit a blocked note when a write is inappropriate rather than forcing publication.

## Suggested interface component

Artifact Boundary Card:

- Source: mixed-source synthesis
- Claim: product requirement
- Privacy: public-safe abstraction
- Missing: private examples excluded; no user study yet
- Revision: adds quarantine before public indexing
- Use: schema / scorecard / implementation planning
- Do not use as: evidence of personal fact, clinical claim, or proof of efficacy

## Acceptance criteria

The layer is acceptable when:

- a reviewer can audit the artifact without private source access
- the artifact contains no personal residue
- every claim has a bounded claim type
- every external support citation maps to the specific claim it supports
- blocked cases produce a public-safe missingness note
- fixture tests include safe, unsafe, and ambiguous examples

## Implementation sequence

1. Define schema.
2. Add scorecard.
3. Add fixture suite.
4. Add release checklist item.
5. Add UI boundary card.
6. Add CI or review template requiring labels before publication.
7. Build a small synthetic corpus to test public-admissibility.
