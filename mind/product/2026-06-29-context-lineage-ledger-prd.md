# PRD: Context Lineage Ledger

## Product status
Draft requirement. Public-safe. Not yet implemented.

## Problem
Mirror Cartographer can generate public-safe abstractions from mixed context, but a reader needs to know how the abstraction was formed without seeing protected source content. Current public-safe controls label source, claim, privacy, missingness, and revision reasons. They do not yet provide an ordered lineage path.

## Goal
Add a Context Lineage Ledger that records the transformation path from admitted context class to public artifact.

## Non-goals
- Do not store raw private context in GitHub.
- Do not expose raw transcripts.
- Do not infer personal facts in public artifacts.
- Do not claim clinical, therapeutic, diagnostic, financial, legal, or scientific authority.
- Do not treat symbolic resonance as proof.

## Users
- Public reviewer evaluating MC’s epistemic boundaries.
- Builder maintaining MC artifacts.
- Auditor checking whether a public artifact crossed privacy or claim boundaries.
- Future implementation agent deciding whether context may shape an output.

## User story
As a reviewer, I need to see the public-safe lineage of an MC artifact so I can evaluate influence, transformation, missingness, and release readiness without accessing protected sources.

## Required behavior
For each public artifact, the system should generate or require a `ContextLineageRecord` containing:

1. artifact path,
2. source status,
3. claim status,
4. privacy status,
5. admission status,
6. temporal status,
7. transformation steps,
8. claim transport,
9. source non-transport,
10. missingness,
11. revision reason,
12. release verdict.

## UX requirement
The artifact should include a compact human-readable lineage header. The full structured record may live in a schema-compatible ledger file.

Recommended header:

- Source status:
- Claim status:
- Privacy status:
- Missingness:
- Revision reason:
- Release verdict:

## Safety requirement
If an artifact depends on private-context orientation, the ledger must say that private context was used only to understand architecture, not as public evidence. The artifact must not reveal personal, household, health, animal-care, financial, location, relationship, credential, or raw transcript details.

## Acceptance criteria
- A reviewer can identify what type of context shaped the artifact.
- A reviewer can identify what claim crossed into public form.
- A reviewer can identify what source material was intentionally not transported.
- A reviewer can identify whether the claim is fact, inference, requirement, evaluation criterion, research question, or speculation.
- A reviewer can identify what is missing or unvalidated.
- The artifact remains meaningful after private details are removed.

## Failure modes
- Polished artifact with no lineage.
- Citations present but influence path unclear.
- Privacy-safe output that is structurally flattened and no longer useful.
- Symbolic language presented as evidence.
- Old context treated as current by default.
- Private context silently shaping public requirements.

## Implementation plan
1. Add `ContextLineageRecord` schema.
2. Add artifact header template.
3. Add release-readiness check requiring lineage fields.
4. Add regression fixtures for safe and unsafe lineage examples.
5. Add CI or manual checklist to block artifacts with empty privacy status, missingness, or revision reason.

## Public-safe claim
The ledger is not proof that an artifact is correct. It is proof that the artifact’s crossing was inspected.
