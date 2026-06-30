# PRD: Context Custody Chain

## Product problem

Mirror Cartographer uses sensitive, symbolic, and continuity-heavy context to design public methods. A simple redaction rule is not enough. The product needs a visible custody chain that proves private context was transformed into public-safe architecture rather than leaked, disguised, or overclaimed.

## User need

A creator, reviewer, collaborator, or safety evaluator should be able to inspect a public MC artifact and answer:

- What kind of source shaped this artifact?
- Was any private context involved?
- What transformation made it public-safe?
- What claim is the artifact allowed to make?
- What remains missing, stale, or unverified?
- Why was the artifact revised?

## Non-goals

- Do not expose private source content.
- Do not create a public transcript index.
- Do not publish personal, household, health, animal-care, financial, location, relationship, credential, or raw transcript details.
- Do not imply implementation is complete when only a method has been drafted.

## Core feature

Add a Context Custody Chain block to public-facing MC artifacts when any private or mixed-context material shaped the output.

## Required fields

- source_status
- privacy_status
- transformation_status
- claim_status
- missingness
- revision_reason
- allowed_public_surface
- reviewer_notes

## Product states

### State 1: Direct public source
A public repo or public research source supports the claim directly. No private context is needed.

### State 2: Private context shaped architecture
Private material informed the architecture, but the public artifact only contains generalized method, requirement, evaluation logic, or implementation plan.

### State 3: Mixed source requiring review
The source set contains public and private material. Publish only after the forbidden-content checklist passes.

### State 4: Blocked
The proposed artifact would expose or reconstruct private material. Do not publish. Record a public-safe missingness note instead.

## Acceptance criteria

- Every artifact has explicit source, privacy, claim, missingness, and revision labels.
- A reviewer can determine whether the artifact is public-safe without seeing private inputs.
- No raw private content is published.
- Public claims do not exceed their source lane.
- Design proposals are labeled as proposals, not completed features.

## Risk controls

- Use synthetic examples for fixtures.
- Store private influence as category labels, not content.
- Require forbidden-content checks before publishing.
- Maintain a missingness field for unavailable or intentionally withheld sources.

## Implementation plan

1. Add schema file for custody records.
2. Add template block to future research, product, evaluation, fixture, and implementation-plan artifacts.
3. Add a pre-publication checklist.
4. Add tests with safe synthetic inputs.
5. Later: implement UI badges for source_status, privacy_status, and claim_status.

## Open questions

- Should the custody chain live inside every artifact or in a separate index?
- Should private-context influence be counted at the artifact level, section level, or claim level?
- Should a reviewer be able to mark a custody chain as insufficient?
- Should revision reasons be append-only?
