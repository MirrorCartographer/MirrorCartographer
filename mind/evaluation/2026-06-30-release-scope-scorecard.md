# Release Scope Gate Scorecard

Date: 2026-06-30

Score each criterion 0-2.

0 = absent or unsafe
1 = partial / unclear
2 = clear and adequate

## Criteria

1. Release scope declared
2. Source status declared
3. Claim status declared
4. Privacy status declared
5. Missingness declared
6. Revision reason declared
7. Proof burden matches artifact type
8. Private context is abstracted rather than exposed
9. Implementation claims are verified or downgraded
10. Symbolic interpretation is separated from evidence
11. Research questions are not written as conclusions
12. Product requirements are not written as shipped features
13. Evaluation examples are synthetic or public-safe
14. Public claims are externally supportable
15. Release verdict is explicit

## Release verdict thresholds

- 27-30: publish
- 22-26: revise before publish
- 15-21: private-only or major revision
- 0-14: blocked

## Required automatic blockers

- Raw private transcript content appears.
- The artifact exposes protected private details.
- A private-source-only inference is presented as a public fact.
- A medical, legal, financial, or other consequential authority claim appears without an explicit boundary.
- A feature is described as implemented without verification.

## Reviewer question

What is this artifact allowed to become?

## Key phrase

A clean release is a scoped release.
