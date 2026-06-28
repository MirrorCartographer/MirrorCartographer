# Contradiction Attractor: Oracle Drift

## Source status
Public-safe synthesis from current Mirror Cartographer repository architecture.

## Claim status
Interpretive architecture note.

## Privacy status
Public-safe. No private examples.

## Missingness
Needs comparison against future fixture runs and reviewer disagreement cases.

## Revision reason
The strongest current attractor is contradiction: the expected answer can be wrong, not only the generated answer.

## Attractor
Contradiction

## Force statement
Mirror Cartographer's fixture system becomes more mature when it can preserve disagreement between output behavior and expected boundary behavior without collapsing the disagreement too early.

## Architectural pressure
- If every mismatch is an output failure, the system becomes brittle.
- If every mismatch revises the oracle, the system becomes permissive.
- The useful path is classified contradiction.

## Resulting method
Add an Oracle Drift Ledger that classifies mismatch type before changing expectations, weakening gates, or allowing release.

## Key phrase
Contradiction is not noise when it tells the boundary where it moved.
