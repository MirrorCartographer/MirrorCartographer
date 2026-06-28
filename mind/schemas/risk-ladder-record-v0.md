# Risk Ladder Record v0

## Purpose

A Risk Ladder Record classifies how far a Mirror Cartographer claim is allowed to travel from private spark to public evidence-bearing artifact.

## Required fields

| Field | Required | Description |
|---|---:|---|
| Record ID | yes | Stable identifier for the risk record. |
| Created date | yes | Date created. |
| Artifact path | yes | Repository path or planned artifact path. |
| Attractor | yes | Curiosity, compression, contradiction, emergence, beauty, continuity, or discovery. |
| Ladder level | yes | 0 through 7. |
| Risk type | yes | Symbolic, conceptual, product, market, care-support, governance, evidence, authority. |
| Claim statement | yes | The claim being classified. |
| Allowed release form | yes | None, metaphor, research question, hypothesis, requirement, fixture, scorecard, support note, evidence claim, blocked. |
| Required evidence to climb | yes | What must be added before the claim can move upward. |
| Falsification condition | yes | What would weaken, disprove, or narrow the claim. |
| Source status | yes | Public research, repo synthesis, private-context abstraction, synthetic fixture, mixed. |
| Claim status | yes | Speculative, analogical, architectural proposal, product hypothesis, evaluation criterion, evidence-bearing, restricted authority, blocked. |
| Privacy status | yes | Public-safe, synthetic-only, abstracted, private-hold, blocked. |
| Reviewer status | yes | Unreviewed, self-reviewed, peer-reviewed, domain-reviewed, expert-reviewed, blocked. |
| Missingness | yes | Known unknowns. |
| Revision reason | yes | Why this record exists or changed. |
| Release state | yes | Private, public-safe draft, public release, archived, discarded, blocked. |

## Ladder levels

| Level | Meaning | Default release state |
|---:|---|---|
| 0 | Private spark | Private |
| 1 | Symbolic conjecture | Public-safe if abstracted |
| 2 | Structural hypothesis | Public-safe draft |
| 3 | Fixture-ready claim | Public-safe test |
| 4 | Prototype-ready requirement | Product draft |
| 5 | Review-ready application | Review required |
| 6 | Evidence-bearing claim | Public only with evidence record |
| 7 | Restricted authority claim | Block unless qualified authority owns it |

## Pass condition

A record passes if the ladder level, release form, evidence requirement, falsification condition, source label, claim label, privacy label, reviewer status, missingness, and revision reason are all visible.

## Fail condition

A record fails if confidence increases without evidence, if analogy becomes evidence, if support becomes treatment, if market validation is claimed without market data, or if private context becomes public example.

## Key phrase

**A risky claim must carry its rung with it.**

## Source status

Derived from current repository direction and public-safe abstraction.

## Claim status

Implementation schema draft.

## Privacy status

Public-safe; no private examples included.

## Missingness

Needs fixture examples and integration with the Speculation Lab record.

## Revision reason

Add a durable schema for staged public-safe risk-taking.
