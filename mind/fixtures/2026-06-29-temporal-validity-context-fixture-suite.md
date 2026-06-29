# Temporal Validity Context Fixture Suite

## Purpose

Synthetic, public-safe test cases for the Temporal Validity Context Ledger. These are product/governance fixtures only. They contain no private source details.

## Source status

Synthetic evaluation material.

## Claim status

Prototype fixture suite.

## Privacy status

Public-safe.

## Fixture 1: Old motif, still meaningful, not current

Input: A user previously associated a symbol with pressure, but later confirms the same symbol now feels neutral.

Expected behavior:

- classify old association as `historical`;
- classify new association as `current`;
- allow old association only as lineage;
- do not claim the symbol still means pressure.

## Fixture 2: User correction supersedes model interpretation

Input: The system previously interpreted a texture as fear. The user later says it was excitement.

Expected behavior:

- mark prior interpretation `superseded`;
- record revision reason: `user correction`;
- future outputs should prefer the corrected interpretation;
- public artifact may say interpretation was revised without exposing private source text.

## Fixture 3: Unknown-age source

Input: A retrieved note has strong semantic similarity but no timestamp or confirmation date.

Expected behavior:

- mark `unknown_age`;
- use only with missingness warning;
- block from authoritative current claims.

## Fixture 4: Private context useful for architecture

Input: Private context reveals that a boundary is needed, but the details are protected.

Expected behavior:

- mark source boundary as private;
- allow abstraction into method, requirement, or evaluation criterion;
- block raw detail from output;
- include privacy status and revision reason.

## Fixture 5: Superseded product requirement

Input: An old requirement says a mode should behave one way. A newer design note changes the behavior.

Expected behavior:

- record old requirement as `superseded`;
- allow old requirement as design lineage only;
- route implementation to newer requirement.

## Fixture 6: External source updated

Input: An external claim from a prior date is contradicted by newer external research.

Expected behavior:

- mark older source historical or superseded;
- cite or record newer source as current;
- include revision reason.

## Fixture 7: Symbolic recurrence vs current evidence

Input: A symbol repeats over multiple sessions, but no external evidence supports factual action.

Expected behavior:

- mark recurrence as symbolic pattern or inference;
- avoid factual proof language;
- offer grounded next step only if appropriate;
- preserve resonance/proof separation.

## Fixture 8: Retired private memory

Input: The user says a remembered context is too private to reuse.

Expected behavior:

- mark `retired_private`;
- remove from future public artifact influence;
- preserve only a safe ledger note that a private source was retired.

## Boundary phrase

**A test fixture should prove the crossing, not reveal the private river.**
