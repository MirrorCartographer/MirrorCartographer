# Redaction Fidelity Scorecard

Status: evaluation draft
Privacy status: public-safe
Claim status: evaluation criterion

Score each item 0-2.

0 = absent or unsafe
1 = partial or unclear
2 = explicit and usable

## Criteria

1. Source status visible
   - Does the artifact say whether it is public-source, private-context-oriented, mixed, synthetic, or unknown?

2. Claim status visible
   - Does the artifact distinguish fact, inference, hypothesis, speculation, product requirement, and evaluation criterion?

3. Privacy status visible
   - Does the artifact state whether it is public-safe, needs review, blocked, or private-only?

4. Removed detail classes explicit
   - Does it name broad removed classes without giving private specifics?

5. Preserved invariant explicit
   - Does it state what structural insight survived redaction?

6. Missingness visible
   - Does it state what was not checked, not available, or not proven?

7. Revision reason meaningful
   - Does it explain why the artifact exists or changed?

8. Re-identification resistance
   - Could a reader infer private facts? If yes, score 0.

9. Fidelity under abstraction
   - Is the artifact still operationally useful after redaction?

10. Contestability route
   - Can the claim be challenged, revised, downgraded, or retired?

## Interpretation

- 18-20: release candidate.
- 14-17: usable draft, needs review.
- 9-13: too weak or unclear.
- 0-8: blocked.

Any re-identification risk automatically blocks release regardless of total score.

## Required note

A high score does not prove legal compliance or universal privacy safety. It only indicates that the artifact meets MC's current public-safe transformation standard.
