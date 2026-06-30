# Source Survivability Layer PRD

## Problem
Mirror Cartographer can retrieve or remember many kinds of material: public repository files, private context, file-library artifacts, generated documents, web research, and live runtime behavior. Relevance alone does not mean a source is allowed to support a public claim.

## Product goal
Add a Source Survivability Layer that forces every public-facing claim, export, or index entry to state what kind of source it rests on and what that source is allowed to prove.

## Non-goals
- Do not expose private context.
- Do not convert private transcripts into public evidence.
- Do not treat symbolic interpretation as factual proof.
- Do not claim implementation state from memory alone.
- Do not solve all provenance or security problems in one pass.

## Users
- Builder reviewing MC artifacts before publication.
- Research collaborator evaluating source boundaries.
- Future product reviewer checking whether public claims are over-scoped.
- AI assistant producing MC summaries or implementation plans.

## Required features
1. Source type classifier.
2. Privacy status classifier.
3. Claim-lane router.
4. Survivability state assignment.
5. Missingness field.
6. Revision reason field.
7. Allowed public use / blocked public use fields.
8. Scorecard gate before publication.
9. Exportable receipt attached to public-safe artifacts.
10. Fixture tests covering stale, private, duplicated, generated, and unsupported sources.

## Output behavior
Every public-safe artifact should include:
- source status
- claim status
- privacy status
- missingness
- revision reason
- evidence boundary

## Example UI copy
- `Source: public repo, verified for language boundary only.`
- `Claim: product requirement, not implementation proof.`
- `Privacy: public-safe; private material excluded.`
- `Missing: live runtime not tested in this pass.`
- `Revision reason: source was duplicated, so confidence was not increased.`

## Acceptance tests
- Private input can shape an abstract requirement without being quoted.
- Duplicated files do not increase source confidence.
- Stale files are downgraded unless supersession is resolved.
- Generated artifacts are labeled as generated unless externally verified.
- Repository README can support public language claims but not runtime behavior claims.
- A claim with missing source status is blocked from public export.

## Research questions
- What minimum metadata makes a memory safe enough to retrieve but not publish?
- How should MC distinguish remembered architecture from current implementation?
- What UI label best communicates `architecture-only` without confusing users?
- How can survivability receipts remain readable rather than bureaucratic?
