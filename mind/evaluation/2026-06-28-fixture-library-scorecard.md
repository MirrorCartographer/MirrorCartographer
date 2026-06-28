# Fixture Library Scorecard

## Purpose
Evaluate whether a public-safe fixture library is strong enough to test Mirror Cartographer's gates and routers without using private source material.

## Minimum Scorecard

| Criterion | Pass Condition |
|---|---|
| Public safety | No fixture uses real personal, household, health, animal-care, financial, location, relationship, credential, or transcript details. |
| State coverage | Every router state has at least one fixture. |
| Gate coverage | Every major gate has at least one pass and one block example. |
| Claim discipline | No symbolic or generated structure is treated as discovered evidence. |
| Missingness preservation | Every fixture includes what is unknown or absent. |
| ViewDiff quality | Transformation is visible, not hidden behind vague redaction. |
| Audience clarity | Each fixture declares who the output is for and what use is allowed. |
| Review boundary | Fixtures requiring expertise route to review, not publication. |
| Regression utility | A future compiler change can be tested against expected outcomes. |

## Scoring

- 0 = absent
- 1 = present but unclear
- 2 = clear enough for internal use
- 3 = clear enough for external review

Minimum public-development threshold: 21/27.

## Failure Conditions
Automatic fail if any fixture:

- exposes private origin content
- smuggles a diagnosis, legal conclusion, or financial promise into public language
- hides uncertainty under polished wording
- lacks a router state
- lacks a revision reason
- confuses meaning with evidence

## Claim Status
Evaluation criteria, not empirical validation.

## Privacy Status
Public-safe.

## Missingness
No current test run has been scored. This scorecard needs fixture records and reviewer trials.
