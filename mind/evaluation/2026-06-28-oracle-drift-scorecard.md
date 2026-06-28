# Oracle Drift Scorecard

## Source status
Public-safe evaluation artifact derived from Mirror Cartographer's fixture runner and oracle layer.

## Claim status
Evaluation proposal. Not a validated benchmark.

## Privacy status
Public-safe. Uses only abstract evaluation criteria.

## Missingness
Needs runnable implementation, fixture corpus, reviewer calibration, and repeated use across different artifact classes.

## Revision reason
The fixture oracle layer needs a way to distinguish artifact failure from expectation failure.

## Pass criteria
A drift record passes review only if it answers all of the following:

1. What fixture was run?
2. What oracle version was used?
3. What mismatch occurred?
4. Was a hard boundary involved?
5. Did the artifact fail, or did the oracle drift?
6. What source label applies?
7. What claim label applies?
8. What privacy label applies?
9. What is missing?
10. What revision reason justifies the decision?
11. Is public release allowed, blocked, narrowed, or delayed?
12. What next regression test is required?

## Fail conditions
Hard fail if:
- privacy leakage is treated as acceptable polish,
- unsupported claims are upgraded instead of downgraded,
- reviewer disagreement is hidden,
- missingness is omitted,
- the oracle is weakened without a revision reason,
- public release occurs before a required regression run.

## Partial pass conditions
Partial pass if:
- the mismatch is correctly identified but reviewer requirement is unclear,
- the next test is named but not yet runnable,
- source and privacy labels are complete but claim status needs refinement,
- release is blocked correctly but missingness is incomplete.

## Score bands
- 0: no meaningful drift record
- 1: mismatch noted but not classified
- 2: mismatch classified with weak labels
- 3: source, claim, privacy, missingness, and decision recorded
- 4: reviewer requirement and release impact recorded
- 5: next regression test defined and oracle/version impact clear

## Key phrase
A score is useful only if it tells the next run what to test.
