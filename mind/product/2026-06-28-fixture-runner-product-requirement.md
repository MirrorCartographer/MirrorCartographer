# Fixture Runner Product Requirement

## Product Need
Mirror Cartographer needs a public-safe testing layer that demonstrates boundary behavior without requiring access to private conversations or sensitive source material.

## User Story
As a reviewer, builder, or buyer of MC-style documentation governance, I need to see a synthetic fixture enter the system, pass through labeled gates, produce a router state, and record why the route was accepted or rejected.

## Functional Requirements
1. Create or load a synthetic fixture record.
2. Validate required labels.
3. Reject fixture records containing real private material.
4. Run fixed-order gate checks.
5. Generate actual router state.
6. Generate actual blocking gate.
7. Generate public-safe transformed output when allowed.
8. Generate ViewDiff.
9. Compare expected behavior to actual behavior.
10. Produce fixture runner result record.
11. Produce regression scorecard status.
12. Preserve revision reason.

## Non-Functional Requirements
- Public-safe by default.
- Screen-reader readable without relying on code-only display.
- Small enough to run manually before automation exists.
- Strict about missingness and overclaiming.
- Designed for later executable validation.

## Out of Scope
- Diagnosis.
- Treatment recommendation.
- Private-memory publication.
- Raw transcript processing for public examples.
- Autonomous release without review.

## Income Lane
Potential offer: Public Artifact Regression Pack.

Deliverable: a small set of synthetic fixtures and runner results showing whether an organization's AI-assisted documentation workflow preserves provenance, privacy, claim boundaries, and release logic.

## Care / Social-Support Lane
Potential offer: Support Summary Safety Pack.

Deliverable: synthetic examples that test whether observation summaries remain non-diagnostic, review-aware, and uncertainty-preserving.

## Source Status
GitHub-derived and file-library-derived public-safe product abstraction, informed by current public research on provenance and reviewable AI documentation.

## Claim Status
Product requirement.

## Privacy Status
Public-safe.

## Missingness
No UI, CLI, or automated runner currently exists in this repo artifact.

## Revision Reason
The fixture library needs to become a demonstrable product layer rather than a static taxonomy.
