# Public Boundary Regression Harness

## Source status
Public-safe synthesis from existing Mirror Cartographer fixture, oracle, drift, gate, and release-readiness architecture.

## Claim status
Architecture proposal. Not a validated standard.

## Privacy status
Public-safe. Abstract method design only. No private examples or transcript excerpts.

## Missingness
- No implemented runner confirmed.
- No canonical fixture corpus confirmed.
- No calibrated reviewer threshold confirmed.
- No repeated benchmark confirmed.

## Revision reason
The repository already has fixtures, a runner, oracle records, and oracle-drift logic. The next required layer is a repeatable regression harness that can rerun public-safe fixtures after any schema, gate, router, release-rule, or oracle change.

## Core finding
Mirror Cartographer needs a Public Boundary Regression Harness.

## Harness loop
1. Select synthetic fixture pack.
2. Load oracle records.
3. Run the current transformation path.
4. Score source, claim, privacy, lane, audience, transformation, release, and revision fields.
5. Compare output to oracle.
6. Classify mismatch through the drift ledger.
7. Route result: pass, revise, split fixture, revise oracle, narrow release, or block release.
8. Record the regression summary.

## Public-safe rule
The harness uses synthetic, abstracted, or intentionally non-sensitive fixtures.

It tests the shape of a boundary without containing protected material.

## Evaluation rule
A release candidate is not regression-clean unless:
- hard privacy boundaries pass,
- claim-strength boundaries pass,
- source-provenance boundaries pass,
- audience-contract boundaries pass,
- failed soft boundaries have revision notes,
- oracle changes have drift records.

## Income lane
Practical offer: public-artifact boundary regression.

Small package:
- fixture pack,
- oracle records,
- regression template,
- drift ledger template,
- release-readiness report.

## Support lane
Safe support use is communication-quality testing. The harness checks whether uncertainty, review requirements, consent boundaries, and source labels survive transformation.

## Research fit
Current AI-literacy research emphasizes critical evaluation and improvement. Related measurement work separates self-perceived competence from demonstrated competence. Transparency and provenance work supports process-level traceability rather than simple labels.

## Key phrase
A boundary that cannot be rerun is only a memory. A boundary that can be rerun becomes evidence.
