# Public-Safe Trace Index

## Core finding

Mirror Cartographer needs a Public-Safe Trace Index: a way to show that a finding came from a disciplined review process without exposing the private material that shaped the review.

Operating line:

**A public index should prove the route, not reveal the room.**

## Source status

- Source class: mixed private-context, saved-context, repository-state, and prior public-safe MC design summaries.
- Source use: architecture understanding only.
- Raw source exposure: none.
- Source boundary: private material may motivate requirements, but it cannot be copied, paraphrased closely, quoted, or converted into identity-bearing examples.

## Claim status

- Claim type: product architecture requirement.
- Claim strength: provisional but actionable.
- Evidence allowed in public: abstracted pattern recurrence across MC continuity, evidence-boundary, privacy, memory, revision, and accessibility work.
- Evidence not allowed in public: raw conversations, household context, health/animal-care details, personal locations, finances, credentials, relationships, or transcript-derived anecdotes.

## Privacy status

- Public-safe: yes.
- Personal detail removed: yes.
- Household or animal-care detail removed: yes.
- Health or financial detail removed: yes.
- Location and credential detail removed: yes.
- Raw transcript detail removed: yes.

## Missingness

- Missing: a formal schema for public-safe index entries.
- Missing: automated linting that detects whether an index item contains disallowed private categories.
- Missing: test fixtures using synthetic examples only.
- Missing: a publish decision record that distinguishes private review evidence from public claim evidence.

## Product requirement

MC should support a trace index entry for each public-safe finding with these fields:

1. Finding ID.
2. Finding title.
3. Source status.
4. Claim status.
5. Privacy status.
6. Missingness status.
7. Revision reason.
8. Allowed public outputs.
9. Blocked private outputs.
10. Next evaluation step.

## Evaluation criteria

A trace index entry passes only if:

- it lets a reviewer understand why the finding exists;
- it does not reveal the private source material;
- it marks whether the claim is requirement, hypothesis, method, evaluation criterion, implementation plan, or public evidence;
- it states what is missing instead of pretending the map is complete;
- it includes a revision reason whenever the finding changes;
- it can be read aloud without relying on code-only formatting.

## Implementation plan

- Add a `public_safe_trace_index` schema to the MC knowledge layer.
- Require every public-facing research note to reference one trace entry.
- Add a privacy lint pass before publication.
- Use synthetic examples for tests.
- Add a revision ledger hook so trace entries update when source boundaries, claim strength, or privacy status changes.

## Revision reason

Created after reviewing the current MC research direction and identifying a repeated need: MC can safely publish abstracted architecture only if it can show a traceable public route without leaking the private substrate.
