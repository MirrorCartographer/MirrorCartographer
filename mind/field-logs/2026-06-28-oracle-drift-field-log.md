# Field Log: Oracle Drift

## Source status
Public-safe field log derived from repository evolution during this pass.

## Claim status
Build log and architectural interpretation.

## Privacy status
Public-safe. No private examples.

## Missingness
No runnable harness was executed; this is repository architecture evolution.

## Revision reason
Document the living synthesis step that followed the fixture oracle layer.

## What moved
The system gained a way to question the expected answer itself.

## Before
Fixture runner compares output against oracle.

## After
Fixture runner compares output against oracle, then a drift ledger decides whether the mismatch means:
- output failure,
- oracle underfit,
- oracle overfit,
- ambiguous fixture,
- lane shift,
- audience shift,
- policy shift,
- risk shift,
- reviewer disagreement.

## Why it matters
This prevents the evaluation system from pretending every disagreement has the same cause.

## Next useful build
Create one synthetic fixture with:
- fixture record,
- oracle record,
- sample run result,
- drift record,
- release decision.
