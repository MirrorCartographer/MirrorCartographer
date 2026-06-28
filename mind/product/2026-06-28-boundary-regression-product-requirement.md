# Boundary Regression Product Requirement

## Source status
Public-safe product requirement derived from the Boundary Regression Harness.

## Claim status
Product requirement proposal. Not a shipped feature.

## Privacy status
Public-safe. No private examples.

## Missingness
Needs implementation, fixture corpus, UI state, and reviewer workflow.

## Revision reason
Converts the research note into product behavior.

## Requirement
Mirror Cartographer should support a repeatable boundary-regression workflow for public-safe artifacts.

## User story
As a reviewer, I want to rerun synthetic fixtures against the current release pipeline so I can see whether source, claim, privacy, lane, audience, transformation, release, and revision boundaries still hold.

## Functional requirements
1. Select fixture pack.
2. Select oracle set.
3. Select gate/router versions.
4. Run transformation.
5. Produce boundary-regression result.
6. Mark hard blocks and soft blocks.
7. Create drift records when expectations change.
8. Produce release-readiness summary.

## Non-functional requirements
- All default fixtures must be public-safe.
- Results must be inspectable.
- Revision reasons must be mandatory for material changes.
- Release state must never be implied only by polished wording.

## Acceptance criteria
- A failed hard boundary blocks release.
- A changed oracle requires a drift record.
- A changed audience contract requires review.
- A clean run produces a release-readiness summary.

## Key phrase
The product should not merely generate artifacts. It should rerun the boundary that lets them leave.
