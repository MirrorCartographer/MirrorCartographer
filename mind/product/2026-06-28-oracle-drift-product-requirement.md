# Oracle Drift Product Requirement

## Source status
Public-safe product requirement derived from Mirror Cartographer's fixture/oracle evaluation architecture.

## Claim status
Product requirement proposal.

## Privacy status
Public-safe. No private examples or sensitive details.

## Missingness
Requires implementation details, UI decisions, storage model, and reviewer workflow.

## Revision reason
Expected-output records need lifecycle management. Otherwise the system cannot tell whether a fixture failure reflects bad output or stale expectation.

## Requirement
Mirror Cartographer should support an Oracle Drift Ledger for every fixture run that fails, partially passes, or triggers reviewer disagreement.

## User stories
- As a reviewer, I need to see whether a failure was caused by the artifact or the oracle.
- As a builder, I need to version expected outputs without hiding why they changed.
- As a publisher, I need to know whether public release is blocked, narrowed, or allowed after a mismatch.
- As an evaluator, I need to compare drift decisions over time.

## Functional requirements
1. Every fixture run stores the oracle version used.
2. Every mismatch creates or links to a drift record.
3. Drift records classify mismatch type.
4. Drift records preserve source, claim, privacy, missingness, and revision labels.
5. Drift decisions can keep, revise, retire, split, narrow, block, or retest.
6. Public release is blocked when unresolved hard-boundary drift exists.
7. Oracle revisions require a next regression test.
8. Reviewer disagreement remains visible.

## Non-goals
- No clinical decision-making.
- No replacement for legal, compliance, medical, or domain review.
- No publication of private source material.
- No claim that synthetic fixtures prove real-world safety.

## Minimum interface object
- Fixture id
- Oracle id and version
- Run result
- Mismatch classification
- Boundary involved
- Labels
- Revision decision
- Release impact
- Next test

## Release rule
No artifact that fails a hard privacy, source, claim, audience, or qualified-review boundary should be routed to public release until the drift record is resolved.
