# Speculation Lab Record v0

## Purpose

A Speculation Lab Record stores one bold Mirror Cartographer hypothesis in a form that can be explored without confusing speculation with evidence.

## Required fields

| Field | Required | Description |
|---|---:|---|
| Record ID | yes | Stable identifier for the speculation record. |
| Created date | yes | Date the record was created. |
| Attractor | yes | Curiosity, compression, contradiction, emergence, beauty, continuity, or discovery. |
| Speculation statement | yes | The bold claim, analogy, invariant, or product hypothesis. |
| Speculation type | yes | Invariant, analogy, product hypothesis, research question, evaluation hypothesis, design hypothesis, care-support hypothesis. |
| Source status | yes | Public research, repo synthesis, private-context abstraction, synthetic fixture, or mixed. |
| Claim status | yes | Speculative, analogical, descriptive synthesis, architectural proposal, implementation requirement, evaluation criterion. |
| Privacy status | yes | Public-safe, synthetic-only, abstracted, private-hold, blocked. |
| Evidence lane | yes | Symbolic, operational, product, research, care-support, governance, interface, education. |
| Boundary bill link | yes | Link or path to the associated Artifact Bill of Boundaries, if released. |
| Falsification condition | yes | What would weaken, disprove, or narrow the speculation. |
| Test path | yes | Fixture, prototype, literature review, user study, expert review, market test, implementation spike, or hold. |
| Expected transformation | yes | What the speculation should become if useful. |
| Reviewer status | yes | Unreviewed, self-reviewed, peer-reviewed, domain-reviewed, expert-reviewed, blocked. |
| Missingness | yes | Known unknowns, inaccessible sources, stale evidence, or untested assumptions. |
| Revision reason | yes | Why the record exists or changed. |
| Release state | yes | Private, public-safe draft, public release, archived, discarded. |

## Valid speculation states

- raw spark
- bounded hypothesis
- fixture-ready
- prototype-ready
- literature-review-needed
- expert-review-needed
- narrowed
- falsified
- promoted to requirement
- archived

## Pass condition

A speculation may move forward only if it includes:

1. a clear claim label,
2. a privacy label,
3. a falsification condition,
4. a test path,
5. a missingness note,
6. and a release state.

## Fail condition

A speculation must be blocked or narrowed if it:

- exposes private context,
- presents analogy as evidence,
- implies diagnosis or treatment,
- claims market validation without market evidence,
- or removes uncertainty to sound more impressive.

## Key phrase

**A risky idea earns motion only when it names how it could be wrong.**

## Source status

Schema derived from current repository direction and public-safe abstraction.

## Claim status

Implementation schema draft.

## Privacy status

Public-safe; no private examples included.

## Missingness

Needs example synthetic records and runner integration.

## Revision reason

Add a durable record shape for public-safe intellectual risk.